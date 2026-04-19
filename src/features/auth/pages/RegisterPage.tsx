import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
  const from =
    (location.state as { from?: string } | null)?.from ?? '/reservas';

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerUser(values.name, values.email, values.password);
      toast.success('Conta criada com sucesso!');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Cadastre-se para solicitar e acompanhar reservas.
        </p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <Input label="Nome completo" {...form.register('name')} error={form.formState.errors.name?.message} />
          <Input label="E-mail" type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
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
          <Button type="submit" variant="primary" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Criando…' : 'Cadastrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Já tem conta?{' '}
          <Link to="/entrar" state={location.state} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
