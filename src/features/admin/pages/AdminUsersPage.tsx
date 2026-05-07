import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Crown, Search, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/store/bookingStore';
import { userService } from '@/services';
import type { User } from '@/types';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/errors';

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const bookings = useBookingStore((s) => s.bookings);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const [users, setUsers] = useState<User[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    void fetchBookings();
    void userService.list().then(setUsers);
  }, [fetchBookings]);

  const bookingsByUser = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      if (!b.userId) return;
      map.set(b.userId, (map.get(b.userId) ?? 0) + 1);
    });
    return map;
  }, [bookings]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => (q ? u.name.toLowerCase().includes(q) || u.email.includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, query]);

  const togglePromote = async (u: User) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (currentUser?.id === u.id && newRole === 'user') {
      toast.error('Você não pode rebaixar a si mesmo.');
      return;
    }
    try {
      const updated = await userService.setRole(u.id, newRole);
      setUsers((prev) => (prev ? prev.map((x) => (x.id === u.id ? updated : x)) : prev));
      toast.success(
        newRole === 'admin' ? `${u.name} agora é administrador.` : `${u.name} voltou a usuário.`
      );
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Usuários
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Gerencie permissões e acompanhe atividade dos clientes.
        </p>
      </header>

      <Card>
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Buscar por nome ou e-mail"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Card>

      {users === null ? (
        <Card className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center text-slate-500 dark:text-slate-400">
          Nenhum usuário encontrado.
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">E-mail</th>
                <th className="px-5 py-3">Cadastrado em</th>
                <th className="px-5 py-3">Reservas</th>
                <th className="px-5 py-3">Papel</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((u) => {
                const isAdmin = u.role === 'admin';
                const total = bookingsByUser.get(u.id) ?? 0;
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full',
                            isAdmin
                              ? 'bg-gradient-fun text-white'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          )}
                        >
                          {isAdmin ? <Crown className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {u.name}
                          {isSelf ? (
                            <span className="ml-2 rounded-full bg-support-400/20 px-2 py-0.5 text-xs font-medium text-support-600 dark:text-support-400">
                              você
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {format(parseISO(u.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-200">
                      {total}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                          isAdmin
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                        )}
                      >
                        {isAdmin ? <Crown className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        {isAdmin ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        size="sm"
                        variant={isAdmin ? 'outline' : 'primary'}
                        onClick={() => void togglePromote(u)}
                        disabled={isAdmin && isSelf}
                      >
                        {isAdmin ? 'Remover admin' : 'Promover a admin'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
