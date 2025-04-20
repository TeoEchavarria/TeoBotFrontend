"use client";

import { useState, useEffect, useCallback } from 'react';

interface SavedQuery {
    text: string;
    date: Date;
}

export const useVault = () => {
    const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);

    useEffect(() => {
        // Load saved queries from local storage on component mount
        const storedQueries = localStorage.getItem('savedQueries');
        if (storedQueries) {
            setSavedQueries(JSON.parse(storedQueries).map((q: { text: string, date: string }) => ({
                text: q.text,
                date: new Date(q.date)
            })));
        }
    }, []);

    const saveQuery = useCallback((query: string) => {
        const newQuery = {
            text: query,
            date: new Date()
        };
        setSavedQueries(prevQueries => {
            const updatedQueries = [...prevQueries, newQuery];
            localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
            return updatedQueries;
        });
    }, []);

    const deleteQuery = useCallback((index: number) => {
        setSavedQueries(prevQueries => {
            const updatedQueries = prevQueries.filter((_, i) => i !== index);
            localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
            return updatedQueries;
        });
    }, []);

    return {
        savedQueries,
        saveQuery,
        deleteQuery
    };
};
