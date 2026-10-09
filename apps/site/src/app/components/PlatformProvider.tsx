import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Platform = 'web' | 'android' | 'ios';

interface PlatformContextType {
  currentPlatform: Platform;
  setPlatform: (platform: Platform) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}

interface PlatformProviderProps {
  children: ReactNode;
}

export function PlatformProvider({ children }: PlatformProviderProps) {
  const [currentPlatform, setPlatform] = useState<Platform>('web');

  return (
    <PlatformContext.Provider value={{ currentPlatform, setPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
}