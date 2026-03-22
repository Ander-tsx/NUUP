'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { formatMXN, formatDate, truncateAddress } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Lock, Unlock } from 'lucide-react';
import { sileo } from 'sileo';
import type { Wallet, Transaction } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  deposit: <ArrowDownLeft className="w-4 h-4 text-green-600" />,
  withdraw: <ArrowUpRight className="w-4 h-4 text-red-500" />,
  escrow: <Lock className="w-4 h-4 text-amber-600" />,
  release: <Unlock className="w-4 h-4 text-blue-600" />,
};

const typeLabels: Record<string, string> = {
  deposit: 'Depósito',
  withdraw: 'Retiro',
  escrow: 'Escrow',
  release: 'Liberación',
};

export default function WalletPage() {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWallet = async () => {
    try {
      const [walletRes, txRes] = await Promise.allSettled([
        api.get('/wallets'),
        api.get('/wallets/transactions'),
      ]);
      if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data);
      if (txRes.status === 'fulfilled') {
        setTransactions(Array.isArray(txRes.value.data) ? txRes.value.data : []);
      }
    } catch {
      // keep previous state
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return;
    setActionLoading(true);
    const promise = api.post('/wallets/deposit', {
      amount_mxn: amount,
      amount_mxne: amount, // 1:1 ratio
    });
    sileo.promise(promise, {
      loading: { title: 'Procesando depósito...' },
      success: { title: 'Depósito exitoso', description: `Se depositaron ${formatMXN(amount)} MXNe` },
      error: { title: 'Error al depositar' },
    });
    try {
      await promise;
      setDepositAmount('');
      await fetchWallet();
    } catch {}
    setActionLoading(false);
  };

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return;
    setActionLoading(true);
    const promise = api.post('/wallets/withdraw', {
      amount_mxne: amount,
      external_address: withdrawAddress || undefined,
    });
    sileo.promise(promise, {
      loading: { title: 'Procesando retiro...' },
      success: { title: 'Retiro exitoso', description: `Se retiraron ${formatMXN(amount)} MXNe` },
      error: { title: 'Error al retirar' },
    });
    try {
      await promise;
      setWithdrawAmount('');
      setWithdrawAddress('');
      await fetchWallet();
    } catch {}
    setActionLoading(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="pt-14 min-h-screen bg-zinc-100 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-6">
            Wallet
          </h1>

          {/* Balance Card */}
          <div className="bg-zinc-950 rounded-xl p-6 mb-6">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Saldo disponible</p>
            <p className="text-4xl font-bold text-white mb-3">
              {formatMXN(wallet?.balance_mxne || 0)}
            </p>
            {wallet?.stellar_address && (
              <p className="font-mono text-xs text-white/30">
                {truncateAddress(wallet.stellar_address, 10)}
              </p>
            )}
          </div>

          {/* Deposit / Withdraw */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <h3 className="text-base font-semibold text-zinc-900 mb-3">Depositar</h3>
              <div className="space-y-3">
                <Input
                  label="Monto (MXN)"
                  type="number"
                  placeholder="1000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={handleDeposit}
                  loading={actionLoading}
                  disabled={!depositAmount || Number(depositAmount) <= 0}
                >
                  Depositar fondos
                </Button>
              </div>
            </Card>
            <Card>
              <h3 className="text-base font-semibold text-zinc-900 mb-3">Retirar</h3>
              <div className="space-y-3">
                <Input
                  label="Monto (MXNe)"
                  type="number"
                  placeholder="500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Input
                  label="CLABE / Dirección (opcional)"
                  placeholder="012345678901234567"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleWithdraw}
                  loading={actionLoading}
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
                >
                  Retirar a cuenta
                </Button>
              </div>
            </Card>
          </div>

          {/* Transaction History */}
          <Card>
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Historial de transacciones</h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-zinc-400 text-center py-6">Sin transacciones aún</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center">
                        {typeIcons[tx.type]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{typeLabels[tx.type] || tx.type}</p>
                        <p className="text-xs text-zinc-400">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        tx.type === 'deposit' || tx.type === 'release' ? 'text-zinc-900' : 'text-zinc-500'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'release' ? '+' : '-'}
                        {formatMXN(tx.amount_mxn)}
                      </p>
                      <Badge variant={tx.status === 'completed' ? 'completed' : tx.status === 'pending' ? 'pending' : 'rejected'}>
                        {tx.status === 'completed' ? 'Completado' : tx.status === 'pending' ? 'Pendiente' : 'Fallido'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
