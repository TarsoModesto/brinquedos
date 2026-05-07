import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser } = useAuth();
  const from = (location.state as { from?: string } | null)?.from ?? '/reservas';
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const needsConfirmation = await registerUser(values.name, values.email, values.password);
      if (needsConfirmation) {
        setPendingEmail(values.email);
        return;
      }
      toast.success('Conta criada com sucesso!');
      navigate(from, { replace: true, state: location.state });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  });

  if (pendingEmail) {
    return (
      <div className="mx-auto max-w-md animate-fade-in">
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-fun text-white shadow-glow">
            <Mail className="h-8 w-8" aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Confirme seu e-mail
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Enviamos um link de confirmação para{' '}
            <strong className="text-slate-900 dark:text-white">{pendingEmail}</strong>. Abra a sua
            caixa de entrada (ou pasta de spam) e clique no link para ativar a conta.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/entrar" className="font-semibold text-brand-600 hover:underline">
              Já confirmei, ir para login
            </Link>
            <button
              type="button"
              onClick={() => setPendingEmail(null)}
              className="text-sm text-slate-500 hover:underline dark:text-slate-400"
            >
              Usar outro e-mail
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Cadastre-se para solicitar e acompanhar reservas.
        </p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <Input
            label="Nome completo"
            autoComplete="name"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="new-password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <Input
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            {...form.register('confirm')}
            error={form.formState.errors.confirm?.message}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Criando…' : 'Cadastrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Já tem conta?{' '}
          <Link
            to="/entrar"
            state={location.state}
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
