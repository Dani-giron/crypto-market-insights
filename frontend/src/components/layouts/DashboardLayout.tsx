import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="relative z-10 max-w-[1280px] mx-auto px-8 py-10">
      {children}
    </div>
  );
};
