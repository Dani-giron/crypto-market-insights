/**
 * DashboardLayout Component
 * Main layout for the crypto dashboard with header and content area
 */

import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-dark-text">Crypto Market Insights</h1>
              <p className="text-xs text-dark-text-muted mt-0.5 uppercase tracking-wide">
                Market Analytics
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
};
