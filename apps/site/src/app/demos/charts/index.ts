import type { ComponentType } from 'react';
import { chartDemosA } from './a';
import { chartDemosB } from './b';
import { chartDemosC } from './c';
import { chartDemosD } from './d';
import { chartDemosGeoStory } from './geo-story';
import { chartDemosSchedule } from './schedule';

// @bek-ui/charts jonli namunalari — katalogdagi papka nomi (dir) bo'yicha.
export const chartDemos: Record<string, ComponentType> = {
  ...chartDemosA,
  ...chartDemosB,
  ...chartDemosC,
  ...chartDemosD,
  ...chartDemosGeoStory,
  ...chartDemosSchedule,
};
