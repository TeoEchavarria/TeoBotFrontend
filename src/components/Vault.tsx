"use client";

import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from 'lucide-react';
import { useVault } from '@/hooks/use-vault';
import { Button } from "@/components/ui/button";

export const Vault = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { savedQueries, deleteQuery } = useVault();

    const toggleVault = () => {
        setIsOpen(!isOpen);
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <>
            <button
                id="openVault"
                className="icon-btn absolute top-2 right-12"
                onClick={toggleVault}
                aria-label="Open vault"
                title="Open vault"
            >
                <Bookmark aria-label="Open vault" />
            </button>

            <aside
                id="vaultDrawer"
                className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}
            >
                <div className="p-4">
                    <header className="text-lg font-semibold mb-4">Saved Queries</header>
                    {savedQueries.length === 0 ? (
                        <p className="text-muted-foreground">No saved items yet</p>
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
        </>
    );
};
