"use client";

import React, { useState, useEffect } from 'react';
import { Bookmark, X, Sun, Moon } from 'lucide-react';
import { useVault } from '@/hooks/use-vault';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';

export const Vault = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { savedQueries, deleteQuery } = useVault();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleVault = () => setIsOpen(open => !open);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50">
        <Button
          onClick={toggleVault}
          aria-label="Open vault"
          title="Open vault"
          className="p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-transform hover:scale-110"
        >
          <Bookmark className="h-6 w-6" />
        </Button>
        <Button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition-transform hover:scale-110"
        >
          {theme === 'dark'
            ? <Sun className="h-6 w-6" />
            : <Moon className="h-6 w-6" />
          }
        </Button>
      </div>

      {/* Vault Drawer */}
      <aside id="vaultDrawer" className={`drawer ${isOpen ? 'open' : ''}`}>  
        <div className="drawer-content p-6 bg-white dark:bg-gray-800 h-full flex flex-col">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Saved Queries</h2>
            <Button
              onClick={toggleVault}
              aria-label="Close vault"
              title="Close vault"
              className="p-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-transform"
            >
              <X className="h-5 w-5" />
            </Button>
          </header>
          {savedQueries.length === 0 ? (
            <p className="text-center text-gray-500">No saved items yet</p>
          ) : (
            <ul className="overflow-y-auto flex-1 space-y-3">
              {savedQueries.map((query, idx) => (
                <li key={idx} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{query.text}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(query.date)}</span>
                  </div>
                  <Button
                    onClick={() => deleteQuery(idx)}
                    aria-label="Delete saved query"
                    title="Delete"
                    className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-transform"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};