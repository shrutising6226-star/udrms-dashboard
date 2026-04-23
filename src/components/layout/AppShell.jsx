import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
