import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from =
    (location.state as { from?: string; preferredDate?: string } | null)?.from ?? '/reservas';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values.email, values.password);
      toast.success('Bem-vindo de volta!');
      navigate(from, {
        replace: true,
        state: location.state,
      });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  });

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Entrar</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Acesse sua conta para gerenciar reservas.
        </p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <Input label="E-mail" type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <Button type="submit" variant="primary" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Não tem conta?{' '}
          <Link to="/cadastro" state={location.state} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
}
