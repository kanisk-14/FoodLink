import React from 'react';

export const metadata = {
  title: 'FoodLink Operations Shell — Smart Surplus Redistribution',
  description: 'Logistics and IoT hardware telemetry operations platform.',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">{children}</div>;
}
