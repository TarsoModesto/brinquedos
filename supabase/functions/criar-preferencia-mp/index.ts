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
    const { agendamento_id } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Buscar agendamento com serviço
    const { data: agendamento, error: erroAgendamento } = await supabaseClient
      .from("agendamentos")
      .select("*, servico:servicos(*)")
      .eq("id", agendamento_id)
      .single();

    if (erroAgendamento || !agendamento) {
      throw new Error("Agendamento não encontrado");
    }

    // Calcular valor baseado no dia da semana
    const dataInicio = new Date(agendamento.data_inicio);
    const diaSemana = dataInicio.getDay();
    const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;
    const valor = ehFimDeSemana
      ? agendamento.servico.preco_fim_semana
      : agendamento.servico.preco_semana;

    // Criar preferência no Mercado Pago
    const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpAccessToken) {
      throw new Error("MP_ACCESS_TOKEN não configurada");
    }

    const preferenceData = {
      items: [
        {
          title: agendamento.servico.nome,
          quantity: 1,
          unit_price: valor,
          description: `Festa de ${agendamento.servico.duracao_minutos} minutos`,
        },
      ],
      back_urls: {
        success: `${Deno.env.get("FRONTEND_URL")}/agendamento/${agendamento_id}/sucesso`,
        failure: `${Deno.env.get("FRONTEND_URL")}/agendamento/${agendamento_id}/falha`,
        pending: `${Deno.env.get("FRONTEND_URL")}/agendamento/${agendamento_id}/pendente`,
      },
      external_reference: agendamento_id,
    };

    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mpAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceData),
      }
    );

    if (!mpResponse.ok) {
      const error = await mpResponse.text();
      console.error("Erro MP:", error);
      throw new Error(`Erro ao criar preferência no Mercado Pago: ${error}`);
    }

    const preference = await mpResponse.json();

    // Salvar pagamento no banco
    const { error: erroPagamento } = await supabaseClient
      .from("pagamentos")
      .insert({
        agendamento_id,
        metodo: "cartao",
        valor,
        status: "pendente",
        mp_payment_id: preference.id,
      });

    if (erroPagamento) {
      throw erroPagamento;
    }

    return new Response(
      JSON.stringify({
        preference_id: preference.id,
        init_point: preference.init_point,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
