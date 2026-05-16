'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCanvasData, saveCanvasData } from '@/lib/actions/canvas';
import { useAuth } from '@/context/AuthContext';

interface StartupDataContextType {
  canvasData: any;
  loading: boolean;
  updateCanvasField: (field: string, value: string) => Promise<void>;
  startupId: string;
}

const StartupDataContext = createContext<StartupDataContextType | undefined>(undefined);

export function StartupDataProvider({ children }: { children: React.ReactNode }) {
  const [canvasData, setCanvasData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const startupId = user?.startupId || '';

  useEffect(() => {
    async function loadData() {
      if (!startupId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getCanvasData(startupId);
      if (data) {
        setCanvasData(data);
      } else {
        setCanvasData({});
      }
      setLoading(false);
    }
    loadData();
  }, [startupId]);

  const updateCanvasField = async (field: string, value: string) => {
    // Optimistic UI update
    setCanvasData((prev: any) => ({ ...prev, [field]: value }));
    
    // Save to DB
    await saveCanvasData(startupId, field, value);
  };

  return (
    <StartupDataContext.Provider value={{ canvasData, loading, updateCanvasField, startupId }}>
      {children}
    </StartupDataContext.Provider>
  );
}

export function useStartupData() {
  const context = useContext(StartupDataContext);
  if (context === undefined) {
    throw new Error('useStartupData must be used within a StartupDataProvider');
  }
  return context;
}
