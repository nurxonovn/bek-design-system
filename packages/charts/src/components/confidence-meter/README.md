# Confidence meter

Figma: **4.18 Chart · Confidence meter** — model AI javobi, prognoz yoki yaratilgan chartga qanchalik ishonishi: 5 segment, daraja matni va bir qatorlik sabab. `variant`: `high` · `medium` · `low` (berilmasa `value` dan).

```tsx
<ConfidenceMeter value={0.92} reason="Based on 2,4 mln rows from 3 sources" />
<ConfidenceMeter value={0.31} reason="Not enough data — check before you share" />
```

- **Qachon:** odamlar amal qilishi mumkin bo'lgan har AI chiqishi yonida (prognoz, ball, Generated chart); javoblar orasida ma'lumot sifati farq qilsa. Vazifa jarayoni uchun emas — 4.6 Progress.
- **Kodlash:** segmentlar = daraja (High 5 · `status/success/default`, Medium 3 · `status/warning/default`, Low 1 · `status/danger/default`, qolgani `dataviz/track`), matn = qiymat + sabab.
- **Chegaralar:** High ≥ 80%, Medium 50–79%, Low < 50% — mahsulotga qarab `thresholds` bilan. Low ishonch amalga olib borsin: ma'lumotni tekshirish, odamdan so'rash.
- **Rang yolg'iz ma'no tashimaydi:** daraja doim matnda ("High · 92%") va sabab bilan.
- **A11y:** `role="meter"`, `aria-valuenow` (0–100) va `aria-valuetext` "High, 92 percent".
- **O'lchamlar:** eni `scale/240`, segment balandligi `scale/6`, oraliq `scale/4`; yorliq Caption/M · `text/tertiary`, daraja Label/M · `text/primary`, sabab Caption/M · `text/secondary`.
