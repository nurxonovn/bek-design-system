---
'@bek-ui/react': minor
---

Yangi `ChipGroup` va `RangeField` komponentlari (Figma 3.20 Field groups) — Fieldset anatomiyasidagi kompozit maydonlar: bitta label ostida Filter chip'lar to'plami (`selection="single|multiple"`) va From · To juftligi (ikki Text field L, bitta umumiy xabar). Figma ↔ kod to'liq auditi (2026-11-01): Figma'dagi barcha 209 komponent set'i va 5 Variables kolleksiyasi kod bilan solishtirildi; 4.16 Description list va 6.2 App shell · Tablet spec'lari jonli Figma'ga moslandi.

`Fieldset` endi `messageId` qabul qiladi (ichki control'lar xabarga `aria-describedby` bilan bog'lanishi uchun); `TextField` tashqaridan berilgan `aria-describedby`ni prefix/suffix/yordamchi matn id'lari bilan birlashtiradi (avval almashtirardi).
