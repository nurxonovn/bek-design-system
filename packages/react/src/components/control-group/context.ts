'use client';

import { createContext, useContext } from 'react';

/** Figma "3.20 Control group" → Density: default — M qatorlar (44), compact — XS/S qatorlar (32/36). */
export type ControlGroupDensity = 'default' | 'compact';

export const ControlGroupContext = createContext<ControlGroupDensity | null>(null);

/** Qator komponentlari (ScrubField, SwitchField) `size` berilmasa zichlikni guruhdan oladi. */
export function useControlGroupDensity(): ControlGroupDensity | null {
  return useContext(ControlGroupContext);
}
