# KPI card

Figma: **4.18 Chart · KPI card** — dashboard yuqori qatoridagi asosiy raqam. `variant`: `default` · `compact` · `progress`.

```tsx
<KpiCard label="Active users" value={formatNumber(12480)} delta={12.4} comparison="vs last week" trend={[9, 10, 9.6, 11, 12.1, 12.48]} href="/analytics/users" />
<KpiCard variant="compact" label="Transfers" value="1 940" delta={12.4} />
<KpiCard variant="progress" label="Monthly goal" goal={{ progress: 0.72, label: '3,6 of 5 mln' }} comparison="8 days left" />
```

- **Qachon:** dashboard tepasida 3–6 asosiy raqam. Compact — zich grid va Mobile ro'yxat; Progress — maqsadga nisbatan qiymat.
- **Tarkib:** label Caption/M · `text/secondary`, qiymat Headline/M (Compact — Title/M) tabular, `Delta`, `Sparkline` (Default) yoki progress track (`dataviz/track` + `accent/default`, `role="progressbar"`), taqqoslash Caption/S · `text/tertiary`.
- **Interaksiya:** `href` berilsa butun karta havola, hover'da Elevation/1 va fokus halqasi. Loading'da 5.4 Skeleton (Title + Text) ishlating.
- **Qoida:** bitta qatordagi kartalar bir xil variantda; format uz-UZ (`12 480`, `4,8 mln`).
- O'lcham: eni ko'pi bilan `scale/240`, padding `scale/16`, sparkline balandligi `chart/sparkline/height`.
