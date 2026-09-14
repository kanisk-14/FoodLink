'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StakeholderRole } from '@/types/foodlink';
import { DEMO_USERS, validateCredentials, setClientSession } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as StakeholderRole) || 'provider';

  const [selectedRole, setSelectedRole] = useState<StakeholderRole>(
    ['provider', 'delivery', 'receiver'].includes(initialRole) ? initialRole : 'provider'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<'both' | 'email' | 'password' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'provider' as StakeholderRole,
      label: 'FOOD PROVIDER',
      title: 'Food Provider',
      code: 'AUTH-01',
      demoEmail: 'provider@foodlink.demo',
    },
    {
      id: 'delivery' as StakeholderRole,
      label: 'DELIVERY PARTNER',
      title: 'Delivery Partner',
      code: 'AUTH-02',
      demoEmail: 'delivery@foodlink.demo',
    },
    {
      id: 'receiver' as StakeholderRole,
      label: 'RECEIVING ORG',
      title: 'Receiving Org',
      code: 'AUTH-03',
      demoEmail: 'receiver@foodlink.demo',
    },
  ];

  const handleSelectDemoAccount = (demoEmail: string, role: StakeholderRole) => {
    setEmail(demoEmail);
    setPassword('FoodLink123');
    setSelectedRole(role);
    setErrorMessage(null);
    setErrorField(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions if already processing
    if (isLoading) return;

    setErrorMessage(null);
    setErrorField(null);

    // Validate credentials against requirements
    const result = validateCredentials(email, password);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed');
      setErrorField(result.errorField || null);
      return;
    }

    // Success flow with button state transition
    setIsLoading(true);

    setTimeout(() => {
      if (result.user) {
        setClientSession(result.user);
        router.push(`/app?role=${result.user.role}`);
      } else {
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="w-full max-w-md space-y-6 font-sans">
      {/* Top Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="text-xs font-mono text-[#6f706a] hover:text-[#1c1d1b] transition-colors inline-flex items-center gap-1"
        >
          <span>&larr;</span>
          <span>Return to overview</span>
        </Link>
        <div className="flex items-baseline justify-between border-b border-[#ddd9cf] pb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-[#1c1d1b]">
              FOODLINK
            </span>
            <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            <span className="text-xs font-mono text-[#6f706a] ml-1">/ ACCESS PORTAL</span>
          </div>
          <span className="text-[10px] font-mono text-[#6f706a]">SYS-LOGIN</span>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6f706a]">
          SELECT ROLE PERSPECTIVE
        </label>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedRole(r.id);
                  setEmail(r.demoEmail);
                  setPassword('FoodLink123');
                  setErrorMessage(null);
                  setErrorField(null);
                }}
                className={`p-3 text-left border rounded-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#536b4f] text-[#1c1d1b] shadow-xs'
                    : 'bg-[#f2efe7] border-[#ddd9cf] text-[#6f706a] hover:bg-white hover:text-[#1c1d1b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-[#6f706a]">{r.code}</span>
                  {isSelected && <span className="w-1.5 h-1.5 bg-[#536b4f]" />}
                </div>
                <div className="font-bold text-xs leading-tight">{r.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-[#ddd9cf] p-6 space-y-5">
        {/* SECTION 5: DEMO ACCESS DETAILS */}
        <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] space-y-2 rounded-xs font-mono text-xs">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold text-[#6f706a] uppercase tracking-wider">
              DEMO ACCESS
            </span>
            <span className="text-[9px] text-[#536b4f] font-semibold">
              PASSWORD: FoodLink123
            </span>
          </div>

          <div className="divide-y divide-[#ece9df] text-[11px]">
            {DEMO_USERS.map((u) => {
              const isCurrent = selectedRole === u.role;
              return (
                <div
                  key={u.email}
                  onClick={() => handleSelectDemoAccount(u.email, u.role)}
                  className={`py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isCurrent ? 'text-[#1c1d1b] font-semibold' : 'text-[#6f706a] hover:text-[#1c1d1b]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 ${isCurrent ? 'bg-[#536b4f]' : 'bg-[#b8b4a7]'}`} />
                    <span>{u.roleName}</span>
                  </div>
                  <span className="text-[10px] underline underline-offset-2">{u.email}</span>
                </div>
              );
            })}
          </div>
          <div className="text-[9px] text-[#6f706a] pt-1">
            Click any account above to populate credentials.
          </div>
        </div>

        {/* Error Alert for Both Fields Empty */}
        {errorField === 'both' && errorMessage && (
          <div
            id="auth-error-message"
            className="p-2.5 bg-[#f3e5de] border border-[#e2cdc4] text-[#934e35] text-xs font-mono flex items-center gap-2 rounded-xs"
          >
            <span className="w-1.5 h-1.5 bg-[#934e35] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <label className="block text-[11px] text-[#6f706a]">WORK EMAIL</label>
            <input
              type="text"
              id="login-email"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorField === 'email' || errorField === 'both') {
                  setErrorMessage(null);
                  setErrorField(null);
                }
              }}
              placeholder="e.g. provider@foodlink.demo"
              className={`w-full px-3 py-2 border bg-[#f7f5ef] text-[#1c1d1b] focus:outline-none text-xs font-mono rounded-xs transition-colors ${
                errorField === 'email' || errorField === 'both'
                  ? 'border-[#934e35] focus:border-[#934e35]'
                  : 'border-[#ddd9cf] focus:border-[#536b4f]'
              }`}
            />
            {errorField === 'email' && errorMessage && (
              <div
                id="auth-error-message"
                className="text-[11px] text-[#934e35] font-mono pt-1 flex items-center gap-1.5"
              >
                <span className="w-1 h-1 bg-[#934e35] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-[#6f706a]">PASSWORD</label>
            <input
              type="password"
              id="login-password"
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorField === 'password' || errorField === 'both') {
                  setErrorMessage(null);
                  setErrorField(null);
                }
              }}
              placeholder="••••••••••••"
              className={`w-full px-3 py-2 border bg-[#f7f5ef] text-[#1c1d1b] focus:outline-none text-xs font-mono rounded-xs transition-colors ${
                errorField === 'password' || errorField === 'both'
                  ? 'border-[#934e35] focus:border-[#934e35]'
                  : 'border-[#ddd9cf] focus:border-[#536b4f]'
              }`}
            />
            {errorField === 'password' && errorMessage && (
              <div
                id="auth-error-message"
                className="text-[11px] text-[#934e35] font-mono pt-1 flex items-center gap-1.5"
              >
                <span className="w-1 h-1 bg-[#934e35] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            id="login-submit-btn"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full font-mono text-xs cursor-pointer"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>

      <div className="text-center font-mono text-[10px] text-[#6f706a] flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#536b4f]" />
        <span>FOODLINK PROTOTYPE &bull; ROLE-BASED ACCESS DEMO</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-[#1c1d1b]">
      <Suspense fallback={<div className="font-mono text-xs text-[#6f706a]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
