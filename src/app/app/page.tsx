'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EquipmentCard } from '@/components/ui/shipping-card';
import { CreateBatchDialog } from '@/components/batches/create-batch-dialog';
import { RouteMap } from '@/components/ui/route-map';
import { BatchQrCode } from '@/components/ui/qr-code';
import { StakeholderRole, FoodBatch, DeliveryStage } from '@/types/foodlink';
import { STAKEHOLDER_PROFILES, MOCK_BATCHES, MOCK_NOTIFICATIONS } from '@/data/mockData';
import { DemoRunner } from '@/components/hardware/demo-runner';
import { getClientSession, clearClientSession, DemoUser } from '@/lib/auth';

function AppShellContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = (searchParams.get('role') as StakeholderRole) || 'provider';
  const tabParam = searchParams.get('tab') || 'overview';

  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [accessNotice, setAccessNotice] = useState<string | null>(null);

  const [activeRole, setActiveRole] = useState<StakeholderRole>(
    ['provider', 'delivery', 'receiver'].includes(roleParam) ? roleParam : 'provider'
  );

  const [activeNav, setActiveNav] = useState<
    'overview' | 'batches' | 'deliveries' | 'passport' | 'devices' | 'reports'
  >(
    ['overview', 'batches', 'deliveries', 'passport', 'devices', 'reports'].includes(tabParam as any)
      ? (tabParam as any)
      : 'overview'
  );

  const [batches, setBatches] = useState<FoodBatch[]>(MOCK_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(MOCK_BATCHES[0].id);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [confirmedReceipts, setConfirmedReceipts] = useState<Record<string, boolean>>({});
  const [reportedIssues, setReportedIssues] = useState<Record<string, string>>({});
  const [issueModalBatch, setIssueModalBatch] = useState<FoodBatch | null>(null);
  const [issueText, setIssueText] = useState('');

  // Delivery workflow progression tracker
  const [deliveryStages, setDeliveryStages] = useState<Record<string, DeliveryStage>>({
    batch_fl_0024: 'IN_TRANSIT',
    batch_fl_0025: 'ASSIGNED',
    batch_fl_0027: 'PICKED_UP',
  });

  // Session authentication check and role guard
  useEffect(() => {
    const session = getClientSession();
    if (!session) {
      router.replace('/login');
      return;
    }

    setCurrentUser(session);
    setIsAuthChecked(true);

    // Guard against accessing another role's dashboard directly via URL
    if (roleParam && roleParam !== session.role) {
      const requestedRoleLabel =
        roleParam === 'provider'
          ? 'Food Provider'
          : roleParam === 'delivery'
          ? 'Delivery Partner'
          : 'Receiving Organization';

      setAccessNotice(
        `Access denied to ${requestedRoleLabel} dashboard. Direct access is restricted. Redirected to your permitted ${session.roleName} dashboard.`
      );
      setActiveRole(session.role);
      router.replace(`/app?role=${session.role}&tab=${tabParam}`);
    } else {
      setActiveRole(session.role);
    }
  }, [roleParam, tabParam, router]);

  const formatTime = (isoOrTime: string) => {
    if (!isoOrTime) return '12:30 PM';
    if (!isoOrTime.includes('T')) return isoOrTime;
    try {
      const d = new Date(isoOrTime);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoOrTime;
    }
  };

  const profile = STAKEHOLDER_PROFILES[activeRole];
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const handleRoleChange = (newRole: StakeholderRole) => {
    if (currentUser && newRole !== currentUser.role) {
      const requestedRoleLabel =
        newRole === 'provider'
          ? 'Food Provider'
          : newRole === 'delivery'
          ? 'Delivery Partner'
          : 'Receiving Organization';

      setAccessNotice(
        `Access restricted: You are currently signed in as ${currentUser.roleName}. To access the ${requestedRoleLabel} dashboard, please log out and sign in with the corresponding demo account.`
      );
      return;
    }
    setActiveRole(newRole);
    router.push(`/app?role=${newRole}&tab=${activeNav}`);
  };

  const handleLogout = () => {
    clearClientSession();
    router.push('/login');
  };

  const handleNavChange = (newNav: typeof activeNav) => {
    setActiveNav(newNav);
    router.push(`/app?role=${activeRole}&tab=${newNav}`);
  };

  const handleBatchCreated = (newBatch: FoodBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatchId(newBatch.id);
  };

  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await fetch('/api/batches');
        if (res.ok) {
          const data = await res.json();
          if (data.batches && data.batches.length > 0) {
            setBatches(data.batches);
          }
        }
      } catch (err) {
        console.error('Failed to load batches', err);
      }
    }
    loadBatches();
  }, []);

  const getPrimaryDeliveryAction = (stage: DeliveryStage) => {
    switch (stage) {
      case 'ASSIGNED':
        return { label: 'ACCEPT PICKUP', next: 'ACCEPTED' as DeliveryStage };
      case 'ACCEPTED':
        return { label: 'START DELIVERY', next: 'PICKED_UP' as DeliveryStage };
      case 'PICKED_UP':
        return { label: 'START TRANSIT', next: 'IN_TRANSIT' as DeliveryStage };
      case 'IN_TRANSIT':
        return { label: 'CONFIRM ARRIVAL', next: 'ARRIVED' as DeliveryStage };
      case 'ARRIVED':
        return { label: 'CONFIRM DELIVERY', next: 'DELIVERED' as DeliveryStage };
      case 'DELIVERED':
        return { label: '✓ DELIVERY COMPLETED', next: null };
    }
  };

  // Delivery stage advancement
  const handleAdvanceDeliveryStage = (batchId: string, currentStage: DeliveryStage) => {
    const action = getPrimaryDeliveryAction(currentStage);
    if (action.next) {
      setDeliveryStages((prev) => ({ ...prev, [batchId]: action.next! }));
    }
  };

  const handleConfirmReceipt = (batchId: string) => {
    setConfirmedReceipts((prev) => ({ ...prev, [batchId]: true }));
  };

  const handleReportIssueSubmit = () => {
    if (issueModalBatch && issueText.trim()) {
      setReportedIssues((prev) => ({ ...prev, [issueModalBatch.id]: issueText.trim() }));
      setIssueModalBatch(null);
      setIssueText('');
    }
  };

  // Counts for Provider Dashboard
  const activeBatchesCount = batches.filter((b) => b.status !== 'intake_verified').length;
  const awaitingPickupCount = batches.filter((b) => b.status === 'awaiting_pickup').length;
  const inTransitCount = batches.filter((b) => b.status === 'in_transit').length;
  const completedCount = batches.filter((b) => b.status === 'intake_verified').length;

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center font-mono text-xs text-[#6f706a]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#536b4f] animate-pulse" />
          <span>VERIFYING SESSION CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-sans selection:bg-[#536b4f] selection:text-[#f7f5ef]">
      {/* =============================================================== */}
      {/* CREATE BATCH MODAL WORKFLOW */}
      {/* =============================================================== */}
      <CreateBatchDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onBatchCreated={handleBatchCreated}
      />

      {/* REPORT ISSUE MODAL */}
      {issueModalBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1d1b]/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md bg-[#f7f5ef] border border-[#ddd9cf] p-5 space-y-4 font-mono text-xs text-[#1c1d1b]">
            <div className="flex items-center justify-between border-b border-[#ddd9cf] pb-2">
              <span className="font-bold uppercase text-[#934e35]">REPORT INTAKE ISSUE</span>
              <button
                onClick={() => setIssueModalBatch(null)}
                className="text-base text-[#6f706a] hover:text-[#1c1d1b]"
              >
                &times;
              </button>
            </div>
            <div className="text-[11px] text-[#6f706a]">
              Log condition discrepancy or packaging concern for Batch {issueModalBatch.code}.
            </div>
            <textarea
              rows={3}
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="e.g. Tray seal damaged upon receipt, packaging cooled to 12°C..."
              className="w-full p-2.5 bg-white border border-[#ddd9cf] focus:outline-none focus:border-[#b66a4e] text-xs font-mono"
            />
            <div className="flex items-center justify-between pt-2 border-t border-[#ddd9cf]">
              <Button variant="outline" size="sm" onClick={() => setIssueModalBatch(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-[#b66a4e] hover:bg-[#a25a40] text-white border-[#b66a4e]"
                onClick={handleReportIssueSubmit}
              >
                Submit Discrepancy Note
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* TOP BAR */}
      {/* =============================================================== */}
      <header className="sticky top-0 z-30 h-14 bg-[#f7f5ef] border-b border-[#ddd9cf] px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Section Context */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-[#1c1d1b]">
            <span>FOODLINK</span>
            <span className="w-1.5 h-1.5 bg-[#536b4f]" />
          </Link>
          <span className="text-[#ddd9cf]">/</span>
          <span className="text-xs font-mono text-[#6f706a] uppercase">
            {activeNav.toUpperCase()}
          </span>
        </div>

        {/* Right: Role Switcher & User Reference */}
        <div className="flex items-center gap-3">
          <Link
            href="/presentation"
            className="hidden md:inline-flex items-center px-2 py-1 bg-white border border-[#ddd9cf] hover:bg-[#f2efe7] text-xs font-mono text-[#1c1d1b]"
          >
            Presentation Mode &rarr;
          </Link>
          <span className="hidden lg:inline-block px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[10px] font-mono font-bold border border-[#ccd9c8]">
            LIVE HARDWARE STREAM
          </span>
          {/* Quick Role Switcher */}
          <div className="flex items-center border border-[#ddd9cf] bg-white rounded-xs p-0.5 text-xs font-mono">
            <button
              onClick={() => handleRoleChange('provider')}
              className={`px-2.5 py-1 transition-colors cursor-pointer ${
                activeRole === 'provider'
                  ? 'bg-[#536b4f] text-white font-medium'
                  : 'text-[#6f706a] hover:text-[#1c1d1b]'
              }`}
            >
              Provider
            </button>
            <button
              onClick={() => handleRoleChange('delivery')}
              className={`px-2.5 py-1 transition-colors cursor-pointer ${
                activeRole === 'delivery'
                  ? 'bg-[#b66a4e] text-white font-medium'
                  : 'text-[#6f706a] hover:text-[#1c1d1b]'
              }`}
            >
              Courier
            </button>
            <button
              onClick={() => handleRoleChange('receiver')}
              className={`px-2.5 py-1 transition-colors cursor-pointer ${
                activeRole === 'receiver'
                  ? 'bg-[#536b4f] text-white font-medium'
                  : 'text-[#6f706a] hover:text-[#1c1d1b]'
              }`}
            >
              Receiver
            </button>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="px-2 py-1 border border-[#ddd9cf] bg-white text-xs font-mono text-[#6f706a] hover:text-[#1c1d1b] cursor-pointer"
            >
              Alerts (3)
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#ddd9cf] p-3 shadow-md z-50 font-mono text-xs space-y-2">
                <div className="font-bold text-[10px] text-[#6f706a] border-b border-[#ece9df] pb-1 uppercase">
                  OPERATIONAL LOG ALERTS
                </div>
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="text-[11px] border-b border-[#f2efe7] pb-1.5 space-y-0.5">
                    <div className="font-semibold text-[#1c1d1b]">{n.title}</div>
                    <div className="text-[10px] text-[#6f706a]">{n.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Reference */}
          <div className="hidden sm:flex items-center gap-2 border-l border-[#ddd9cf] pl-3 text-xs font-mono text-[#6f706a]">
            <span>{currentUser?.name || profile.name}</span>
            <span className="text-[#b8b4a7]">&bull;</span>
            <button
              onClick={handleLogout}
              className="hover:text-[#1c1d1b] underline text-[#536b4f] cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* =============================================================== */}
      {/* MAIN LAYOUT WITH SIDEBAR */}
      {/* =============================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-56 bg-[#f2efe7] border-r border-[#ddd9cf] flex flex-col justify-between p-4 shrink-0 font-mono text-xs">
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-[10px] text-[#6f706a] uppercase">ACTIVE ORGANIZATION</div>
              <div className="font-bold text-xs text-[#1c1d1b] leading-tight truncate">
                {profile.organization}
              </div>
              <div className="text-[10px] text-[#536b4f] font-semibold">
                &bull; {profile.badgeLabel}
              </div>
            </div>

            {/* Standardized Primary Nav Items */}
            <nav className="space-y-1">
              <button
                onClick={() => handleNavChange('overview')}
                className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                  activeNav === 'overview'
                    ? 'bg-white border border-[#ddd9cf] text-[#1c1d1b] font-bold'
                    : 'text-[#6f706a] hover:bg-white hover:text-[#1c1d1b]'
                }`}
              >
                <span>Overview</span>
                {activeNav === 'overview' && <span className="w-1.5 h-1.5 bg-[#536b4f]" />}
              </button>

              <button
                onClick={() => handleNavChange('batches')}
                className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                  activeNav === 'batches'
                    ? 'bg-white border border-[#ddd9cf] text-[#1c1d1b] font-bold'
                    : 'text-[#6f706a] hover:bg-white hover:text-[#1c1d1b]'
                }`}
              >
                <span>Food Batches</span>
                <span className="text-[10px] text-[#6f706a]">{batches.length}</span>
              </button>

              <button
                onClick={() => handleNavChange('deliveries')}
                className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                  activeNav === 'deliveries'
                    ? 'bg-white border border-[#ddd9cf] text-[#1c1d1b] font-bold'
                    : 'text-[#6f706a] hover:bg-white hover:text-[#1c1d1b]'
                }`}
              >
                <span>Deliveries</span>
                <span className="text-[10px] text-[#b66a4e] font-semibold">3</span>
              </button>

              <button
                onClick={() => handleNavChange('passport')}
                className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                  activeNav === 'passport'
                    ? 'bg-white border border-[#ddd9cf] text-[#1c1d1b] font-bold'
                    : 'text-[#6f706a] hover:bg-white hover:text-[#1c1d1b]'
                }`}
              >
                <span>Food Passport</span>
                <span className="text-[10px] text-[#536b4f] font-semibold">LOGS</span>
              </button>

              <button
                onClick={() => handleNavChange('devices')}
                className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                  activeNav === 'devices'
                    ? 'bg-white border border-[#ddd9cf] text-[#1c1d1b] font-bold'
                    : 'text-[#6f706a] hover:bg-white hover:text-[#1c1d1b]'
                }`}
              >
                <span>Devices</span>
                <span className="text-[10px] text-[#6f706a]">4 Nodes</span>
              </button>

              <button
                onClick={() => handleNavChange('reports')}
                className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                  activeNav === 'reports'
                    ? 'bg-white border border-[#ddd9cf] text-[#1c1d1b] font-bold'
                    : 'text-[#6f706a] hover:bg-white hover:text-[#1c1d1b]'
                }`}
              >
                <span>Reports</span>
                <span className="text-[10px] text-[#6f706a]">Audit</span>
              </button>
            </nav>
          </div>

          {/* Bottom Settings & Account */}
          <div className="pt-4 border-t border-[#ddd9cf] space-y-1 text-[#6f706a]">
            <Link
              href="/app?tab=reports"
              className="block px-2.5 py-1 hover:text-[#1c1d1b] transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-2.5 py-1 hover:text-[#1c1d1b] transition-colors cursor-pointer"
            >
              Logout
            </button>
            <div className="pt-2 text-[10px] text-[#8e8e86]">SYS VERSION 1.2</div>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Access Denied / Route Guard Notice */}
          {accessNotice && (
            <div
              id="access-denied-notice"
              className="p-3 bg-[#f3e5de] border border-[#e2cdc4] text-[#934e35] text-xs font-mono flex items-center justify-between rounded-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#934e35] shrink-0" />
                <span>{accessNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAccessNotice(null)}
                className="text-[10px] text-[#934e35] hover:text-[#1c1d1b] underline cursor-pointer shrink-0 ml-4"
              >
                [DISMISS]
              </button>
            </div>
          )}

          <DemoRunner compact onStepChange={() => {
            fetch('/api/batches').then(r => r.json()).then(d => { if (d.batches) setBatches(d.batches); });
          }} />
          {/* =========================================================== */}
          {/* SECTION A: PROVIDER CONSOLE (OVERVIEW OR BATCHES TAB) */}
          {/* =========================================================== */}
          {(activeNav === 'overview' || activeNav === 'batches') && activeRole === 'provider' && (
            <div className="space-y-6">
              {/* Top Context & "Create Batch" CTA */}
              <div className="bg-white border border-[#ddd9cf] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-[#e8eee5] text-[#3d523a] text-[9px] font-mono font-bold uppercase">
                      PROVIDER CONSOLE
                    </span>
                    <span className="text-xs font-mono text-[#6f706a]">{profile.organization}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1c1d1b] mt-0.5 tracking-tight">
                    Surplus Food Inventory &amp; Transit Staging
                  </h2>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                  className="font-mono text-xs gap-1.5"
                >
                  <span>+ Create Food Batch</span>
                </Button>
              </div>

              {/* Compact Overview Blocks (Avoid giant cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3.5 bg-white border border-[#ddd9cf]">
                  <span className="text-[10px] text-[#6f706a] uppercase block">ACTIVE BATCHES</span>
                  <div className="text-2xl font-bold text-[#1c1d1b] mt-1">{activeBatchesCount}</div>
                  <span className="text-[10px] text-[#6f706a]">Currently managed</span>
                </div>

                <div className="p-3.5 bg-white border border-[#ddd9cf]">
                  <span className="text-[10px] text-[#6f706a] uppercase block">AWAITING PICKUP</span>
                  <div className="text-2xl font-bold text-[#b66a4e] mt-1">{awaitingPickupCount}</div>
                  <span className="text-[10px] text-[#6f706a]">Staged at loading dock</span>
                </div>

                <div className="p-3.5 bg-white border border-[#ddd9cf]">
                  <span className="text-[10px] text-[#6f706a] uppercase block">IN TRANSIT</span>
                  <div className="text-2xl font-bold text-[#536b4f] mt-1">{inTransitCount}</div>
                  <span className="text-[10px] text-[#6f706a]">En route to destination</span>
                </div>

                <div className="p-3.5 bg-white border border-[#ddd9cf]">
                  <span className="text-[10px] text-[#6f706a] uppercase block">COMPLETED</span>
                  <div className="text-2xl font-bold text-[#1c1d1b] mt-1">{completedCount}</div>
                  <span className="text-[10px] text-[#6f706a]">Received without issue</span>
                </div>
              </div>

              {/* Table of Food Batches */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between font-mono text-xs">
                  <span className="font-bold text-[#1c1d1b]">DECLARED FOOD BATCHES</span>
                  <span className="text-[11px] text-[#6f706a]">{batches.length} ENTRIES</span>
                </div>

                <div className="bg-white border border-[#ddd9cf] overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#f2efe7] border-b border-[#ddd9cf] text-[#6f706a] text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">BATCH</th>
                        <th className="py-2.5 px-3">FOOD</th>
                        <th className="py-2.5 px-3">WEIGHT</th>
                        <th className="py-2.5 px-3">PREPARED</th>
                        <th className="py-2.5 px-3">PICKUP DEADLINE</th>
                        <th className="py-2.5 px-3">DESTINATION</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ece9df]">
                      {batches.map((b) => (
                        <tr key={b.id} className="hover:bg-[#fafaf6] transition-colors">
                          <td className="py-2.5 px-3 font-bold text-[#1c1d1b]">
                            <Link href={`/food/${b.code}`} className="hover:underline text-[#1c1d1b]">
                              {b.code}
                            </Link>
                          </td>
                          <td className="py-2.5 px-3 font-sans font-medium text-[#1c1d1b]">
                            {b.title}
                          </td>
                          <td className="py-2.5 px-3">{b.initialWeightKg.toFixed(1)} kg</td>
                          <td className="py-2.5 px-3 text-[#6f706a]">
                            {formatTime(b.preparedAtIso || '11:45 AM')}
                          </td>
                          <td className="py-2.5 px-3 text-[#b66a4e] font-medium">
                            {formatTime(b.pickupDeadlineIso || '01:00 PM')}
                          </td>
                          <td className="py-2.5 px-3 text-[#1c1d1b] truncate max-w-[160px]">
                            {b.receiver.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-block px-1.5 py-0.5 border text-[10px] font-bold uppercase ${
                                b.status === 'in_transit'
                                  ? 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8]'
                                  : b.status === 'awaiting_pickup'
                                  ? 'bg-[#f3e5de] text-[#934e35] border-[#e2cdc4]'
                                  : 'bg-[#f2efe7] text-[#6f706a] border-[#ddd9cf]'
                              }`}
                            >
                              {b.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <Link href={`/food/${b.code}`}>
                              <button className="px-2 py-0.5 border border-[#ddd9cf] bg-white hover:bg-[#e8eee5] hover:text-[#536b4f] text-[10px] uppercase font-mono cursor-pointer">
                                View &rarr;
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* SECTION B: DELIVERY DASHBOARD (FOR COURIER FLEET) */}
          {/* =========================================================== */}
          {(activeNav === 'deliveries' || (activeNav === 'overview' && activeRole === 'delivery')) && (
            <div className="space-y-6">
              <div className="bg-white border border-[#ddd9cf] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-[#f3e5de] text-[#934e35] text-[9px] font-mono font-bold uppercase">
                      COURIER TRANSIT DISPATCH
                    </span>
                    <span className="text-xs font-mono text-[#6f706a]">Carrier: Marcus Vance (#08)</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1c1d1b] mt-0.5 tracking-tight">
                    Active Delivery Assignments &amp; Telemetry
                  </h2>
                </div>
                <div className="text-xs font-mono text-[#536b4f]">
                  Vehicle: Transport Van #2 &bull; Battery 84%
                </div>
              </div>

              {/* Delivery Progression Cards */}
              <div className="space-y-4">
                {batches.filter((b) => b.status !== 'intake_verified').map((batch) => {
                  const currentStage = deliveryStages[batch.id] || 'IN_TRANSIT';
                  const stages: DeliveryStage[] = [
                    'ASSIGNED',
                    'ACCEPTED',
                    'PICKED_UP',
                    'IN_TRANSIT',
                    'ARRIVED',
                    'DELIVERED',
                  ];
                  const currentIdx = stages.indexOf(currentStage);

                  return (
                    <div key={batch.id} className="bg-white border border-[#ddd9cf] p-5 font-mono text-xs space-y-4">
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-3">
                        <div>
                          <span className="text-[10px] text-[#6f706a] uppercase">ASSIGNMENT</span>
                          <div className="text-base font-bold text-[#1c1d1b]">
                            {batch.code} &bull; {batch.title}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-[#6f706a] block">CURRENT STAGE</span>
                          <span className="px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] border border-[#ccd9c8] font-bold text-xs uppercase">
                            {currentStage.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Route Spec Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">PICKUP LOCATION</span>
                          <span className="font-semibold text-[#1c1d1b]">{batch.provider.name}</span>
                          <span className="text-[#6f706a] block text-[10px]">{batch.provider.address}</span>
                        </div>
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">DESTINATION</span>
                          <span className="font-semibold text-[#1c1d1b]">{batch.receiver.name}</span>
                          <span className="text-[#6f706a] block text-[10px]">{batch.receiver.address}</span>
                        </div>
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">FOOD CONDITION</span>
                          <span className="font-bold text-[#536b4f]">{batch.hardware.temperatureC} &deg;C</span>
                          <span className="text-[#6f706a] block text-[10px]">{batch.hardware.netFoodWeightKg} kg net</span>
                        </div>
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">CONTAINER LATCH</span>
                          <span className="font-bold text-[#536b4f]">{batch.hardware.lidLatched ? 'LATCHED' : 'OPEN'}</span>
                          <span className="text-[#6f706a] block text-[10px]">{batch.hardware.deviceId}</span>
                        </div>
                      </div>

                      {/* Step Progression Action Bar */}
                      <div className="pt-3 border-t border-[#ddd9cf] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          {stages.map((stg, idx) => {
                            const isPast = idx < currentIdx;
                            const isCurrent = idx === currentIdx;
                            return (
                              <span
                                key={stg}
                                className={`px-2 py-1 border ${
                                  isCurrent
                                    ? 'bg-[#536b4f] text-white border-[#536b4f] font-bold'
                                    : isPast
                                    ? 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8]'
                                    : 'bg-[#f7f5ef] text-[#6f706a] border-[#ddd9cf]'
                                }`}
                              >
                                {idx + 1}. {stg.replace('_', ' ')}
                              </span>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/food/${batch.code}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              Inspect Passport &rarr;
                            </Button>
                          </Link>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={currentStage === 'DELIVERED'}
                            onClick={() => handleAdvanceDeliveryStage(batch.id, currentStage)}
                            className={`text-xs font-mono ${
                              currentStage === 'DELIVERED'
                                ? 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8]'
                                : ''
                            }`}
                          >
                            {getPrimaryDeliveryAction(currentStage).label}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* SECTION C: RECEIVER INTAKE RADAR (FOR FOOD BANKS/SHELTERS) */}
          {/* =========================================================== */}
          {(activeNav === 'overview' || activeNav === 'batches') && activeRole === 'receiver' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#ddd9cf] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-[#e8eee5] text-[#3d523a] text-[9px] font-mono font-bold uppercase">
                      INTAKE INSPECTION RADAR
                    </span>
                    <span className="text-xs font-mono text-[#6f706a]">{profile.organization}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1c1d1b] mt-0.5 tracking-tight">
                    Inbound Food Batches &amp; Digital Intake
                  </h2>
                </div>
                <div className="text-xs font-mono text-[#6f706a]">
                  Receiving Dock: Open (12:30 PM &ndash; 02:00 PM)
                </div>
              </div>

              {/* Inbound Batches List */}
              <div className="space-y-4">
                {batches.map((batch) => {
                  const isConfirmed = confirmedReceipts[batch.id];
                  const hasReportedIssue = reportedIssues[batch.id];

                  return (
                    <div key={batch.id} className="bg-white border border-[#ddd9cf] p-5 font-mono text-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-3">
                        <div>
                          <div className="text-[10px] text-[#6f706a] uppercase">INBOUND BATCH</div>
                          <div className="text-base font-bold text-[#1c1d1b]">
                            {batch.code} &bull; {batch.title}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-[#6f706a] block">ESTIMATED INTAKE</span>
                          <span className="font-bold text-[#536b4f] text-sm">{formatTime(batch.estimatedArrivalIso || '12:55 PM')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">ORIGIN PROVIDER</span>
                          <span className="font-semibold text-[#1c1d1b]">{batch.provider.name}</span>
                        </div>
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">QUANTITY</span>
                          <span className="font-bold text-[#1c1d1b]">{batch.hardware.netFoodWeightKg} kg</span>
                          <span className="text-[#6f706a] block text-[10px]">~{batch.portionsEstimated} meals</span>
                        </div>
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">PROBE TEMPERATURE</span>
                          <span className="font-bold text-[#536b4f]">{batch.hardware.temperatureC} &deg;C</span>
                          <span className="text-[#6f706a] block text-[10px]">Within safe limit</span>
                        </div>
                        <div>
                          <span className="text-[#6f706a] block text-[10px]">DELIVERY STATUS</span>
                          <span className="font-semibold text-[#1c1d1b]">{batch.delivery.status}</span>
                          <span className="text-[#6f706a] block text-[10px]">{batch.delivery.driverName}</span>
                        </div>
                      </div>

                      {hasReportedIssue && (
                        <div className="p-2.5 bg-[#f3e5de] border border-[#e2cdc4] text-[#934e35] text-[11px]">
                          <strong>REPORTED ISSUE:</strong> {hasReportedIssue}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-[#ddd9cf] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <Link href={`/food/${batch.code}`}>
                          <Button variant="outline" size="sm">
                            Inspect Digital Passport &rarr;
                          </Button>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setIssueModalBatch(batch);
                              setIssueText('');
                            }}
                          >
                            Report Issue
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isConfirmed}
                            onClick={() => handleConfirmReceipt(batch.id)}
                            className={isConfirmed ? 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8]' : ''}
                          >
                            {isConfirmed ? '✓ Receipt Confirmed' : 'Confirm Receipt'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* SECTION D: FOOD PASSPORT VIEW */}
          {/* =========================================================== */}
          {activeNav === 'passport' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#ddd9cf] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[#536b4f] uppercase tracking-wider font-bold">
                    FOOD PASSPORT EXPLORER
                  </span>
                  <h2 className="text-lg font-bold text-[#1c1d1b]">
                    Batch Inspection &amp; Chain-of-Custody Records
                  </h2>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#6f706a]">Select Batch:</span>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="px-2.5 py-1 bg-[#f7f5ef] border border-[#ddd9cf] text-[#1c1d1b]"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} &bull; {b.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Equipment Card + Timeline for selected batch */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <EquipmentCard
                    nodeId={selectedBatch.hardware.deviceId}
                    batchCode={selectedBatch.code}
                    itemDescription={selectedBatch.title.split(' ')[0].toUpperCase()}
                    weightKg={selectedBatch.hardware.netFoodWeightKg}
                    tempC={selectedBatch.hardware.temperatureC}
                    status={selectedBatch.status === 'in_transit' ? 'IN TRANSIT' : 'DELIVERED'}
                    time="12:42 PM"
                    lidStatus={selectedBatch.hardware.lidLatched ? 'LATCHED' : 'OPEN'}
                    categoryTag={selectedBatch.categoryLabel}
                  />

                  <div className="p-4 bg-white border border-[#ddd9cf] font-mono text-xs space-y-2">
                    <div className="font-bold text-[#1c1d1b] border-b border-[#ece9df] pb-2">
                      QUICK ACTIONS
                    </div>
                    <Link href={`/food/${selectedBatch.code}`} className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        Open Dedicated /food/{selectedBatch.code} Record &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Passport Timeline */}
                <div className="lg:col-span-7 bg-white border border-[#ddd9cf] p-5 font-mono text-xs space-y-3">
                  <div className="flex items-baseline justify-between border-b border-[#ece9df] pb-3">
                    <span className="font-bold text-sm text-[#1c1d1b]">
                      6-STAGE CUSTODY TIMELINE &bull; {selectedBatch.code}
                    </span>
                    <span className="text-[10px] text-[#536b4f] font-semibold">STATUS: VERIFIED</span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedBatch.passport.map((evt) => (
                      <div
                        key={evt.step}
                        className={`p-3 border rounded-xs ${
                          evt.completed
                            ? 'bg-[#f7f5ef] border-[#ddd9cf]'
                            : 'bg-white border-[#ece9df] opacity-60'
                        }`}
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-xs text-[#1c1d1b]">
                            {evt.step} &bull; {evt.title}
                          </span>
                          <span className="text-[10px] text-[#6f706a]">{evt.timestamp}</span>
                        </div>
                        <div className="text-[11px] text-[#6f706a] mt-0.5">{evt.stageName} &bull; {evt.location}</div>
                        {evt.notes && (
                          <div className="text-[10px] text-[#3d523a] mt-1 pt-1 border-t border-[#ece9df]">
                            {evt.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* SECTION E: DEVICES & HARDWARE INVENTORY */}
          {/* =========================================================== */}
          {activeNav === 'devices' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white border border-[#ddd9cf] p-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
                    HARDWARE INVENTORY
                  </span>
                  <h2 className="text-lg font-bold text-[#1c1d1b]">
                    Registered ESP32 Physical Container Nodes
                  </h2>
                </div>
                <Link href="/devices">
                  <Button variant="outline" size="sm">
                    Open Full Equipment Registry &rarr;
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {batches.map((b) => (
                  <div key={b.hardware.deviceId} className="bg-white border border-[#ddd9cf] p-4 space-y-3">
                    <div className="flex items-baseline justify-between border-b border-[#ece9df] pb-2">
                      <div className="font-bold text-sm text-[#1c1d1b]">{b.hardware.deviceId}</div>
                      <span className="px-1.5 py-0.2 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold">
                        ONLINE &bull; RSSI {b.hardware.wifiRssiDbm} dBm
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#6f706a] block text-[10px]">CURRENT ASSIGNMENT</span>
                        <span className="font-semibold text-[#1c1d1b]">{b.code}</span>
                      </div>
                      <div>
                        <span className="text-[#6f706a] block text-[10px]">FIRMWARE</span>
                        <span className="text-[#1c1d1b]">{b.hardware.firmwareVersion}</span>
                      </div>
                      <div>
                        <span className="text-[#6f706a] block text-[10px]">BATTERY POWER</span>
                        <span className="font-bold text-[#536b4f]">{b.hardware.batteryPct}%</span>
                      </div>
                      <div>
                        <span className="text-[#6f706a] block text-[10px]">LAST PING</span>
                        <span className="text-[#1c1d1b]">{b.hardware.lastPingIso}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-[#f7f5ef] border border-[#ddd9cf] text-[10px] text-[#6f706a] flex items-center justify-between">
                      <span>DS18B20 &bull; HX711 &bull; Reed &bull; OLED</span>
                      <Link
                        href={`/devices/${b.hardware.deviceId.replace(/\s+/g, '-')}`}
                        className="text-[#1c1d1b] font-bold underline underline-offset-2 hover:text-[#536b4f]"
                      >
                        Technical Sheet &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* SECTION F: REPORTS & AUDIT LOG */}
          {/* =========================================================== */}
          {activeNav === 'reports' && (
            <div className="bg-white border border-[#ddd9cf] p-6 font-mono text-xs space-y-4">
              <div className="border-b border-[#ece9df] pb-3">
                <span className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
                  SYSTEM LOGS &amp; AUDIT EXPORT
                </span>
                <h2 className="text-lg font-bold text-[#1c1d1b]">
                  Chain-of-Custody Compliance Summary
                </h2>
              </div>
              <p className="text-[#6f706a] leading-relaxed">
                All transit sessions maintain immutable telemetry records signed by individual ESP32
                container controllers. Data can be exported for tax write-off verification and
                hunger-relief compliance reporting.
              </p>

              <div className="p-4 bg-[#f7f5ef] border border-[#ddd9cf] space-y-2">
                <div className="font-bold text-[#1c1d1b]">AUDIT LEDGER STATS</div>
                <div className="grid grid-cols-3 gap-3 text-[11px]">
                  <div><span className="text-[#6f706a]">TOTAL REDISTRIBUTIONS:</span> 4 BATCHES</div>
                  <div><span className="text-[#6f706a]">RECORDED MASS:</span> 24.9 KG NET</div>
                  <div><span className="text-[#6f706a]">DISCREPANCY RATE:</span> 0.00%</div>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="primary" size="sm">
                  Download Verified Batch Ledger (CSV) &rarr;
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AppShellPage() {
  return (
    <Suspense
      fallback={<div className="p-8 font-mono text-xs text-[#6f706a]">Loading operations shell...</div>}
    >
      <AppShellContent />
    </Suspense>
  );
}
