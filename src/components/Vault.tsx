"use client";

import { useState, useEffect, useCallback } from 'react';
import { Bookmark, X } from 'lucide-react';
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

    const toggleVault = () => {
        setIsOpen(!isOpen);
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    if (!mounted) {
      return null;
    }

    return (
        <>
            <Button
                id="openVault"
                className="icon-btn"
                onClick={toggleVault}
                aria-label="Open vault"
                title="Open vault"
            >
                <Bookmark aria-label="Open vault" />
            </Button>

            <aside
                id="vaultDrawer"
                className={`drawer ${isOpen ? 'open' : ''}`}
            >
                <div className="drawer-content">
                    <header className="drawer-header">
                        <div className="text-lg font-semibold">Saved Queries</div>
                        <Button variant="ghost" size="icon" onClick={toggleVault} className="drawer-close">
                            <X aria-label="Close vault" />
                        </Button>
                    </header>
                    {savedQueries.length === 0 ? (
                        <p className="no-saved-items">No saved items yet</p>
                    ) : (
                        <ul id="vaultList" className="space-y-2">
                            {savedQueries.map((query, index) => (
                                <li key={index} className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm">{query.text} - {formatDate(query.date)}</span>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => deleteQuery(index)}>
                                            <span aria-label="Delete" title="Delete">X</span>
                                        </Button>
                                        {/* Optional: Add expand functionality here */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
                    {/* Alternar tema */}
        </>
    );
};
