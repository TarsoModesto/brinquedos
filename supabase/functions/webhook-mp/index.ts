import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Webhook do Mercado Pago envia o tipo de ação
    const { type, data } = body;

    // Só processar notificações de pagamento
    if (type !== "payment") {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpAccessToken) {
      throw new Error("MP_ACCESS_TOKEN não configurada");
    }

    // Buscar detalhes do pagamento no Mercado Pago
    const paymentId = data.id;
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mpAccessToken}`,
        },
      }
    );

    if (!mpResponse.ok) {
      throw new Error("Erro ao buscar pagamento no Mercado Pago");
    }

    const payment = await mpResponse.json();
    const externalReference = payment.external_reference; // agendamento_id

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Atualizar status do pagamento
    const statusMapeado = payment.status === "approved" ? "aprovado" : "recusado";

    const { error: erroAtualizacaoPagamento } = await supabaseClient
      .from("pagamentos")
      .update({
        status: statusMapeado,
        mp_payment_id: paymentId,
      })
      .eq("agendamento_id", externalReference);

    if (erroAtualizacaoPagamento) {
      throw erroAtualizacaoPagamento;
    }

    // Se aprovado, atualizar agendamento para confirmado
    if (payment.status === "approved") {
      const { error: erroAgendamento } = await supabaseClient
        .from("agendamentos")
        .update({ status: "confirmado" })
        .eq("id", externalReference);

      if (erroAgendamento) {
        throw erroAgendamento;
      }

      // Enviar email de confirmação (v1.1)
      // Por enquanto, só registramos a notificação
      await supabaseClient.from("notificacoes").insert({
        agendamento_id: externalReference,
        usuario_id: payment.customer_id, // será preenchido melhor depois
        tipo: "confirmacao",
        assunto: "Agendamento Confirmado!",
        corpo: `Seu agendamento foi confirmado. Prepare-se para a festa!`,
        status: "enviada",
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});
