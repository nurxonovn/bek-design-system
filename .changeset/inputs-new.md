---
'@bek-ui/react': minor
---

Yangi input komponentlari (Figma bilan strict mos): `ScrubField` (3.21 Scrub field — gorizontal sudrab o'zgartiriladigan son: pointer capture, Shift ×10 / Alt ×0.1, ↑↓ · PageUp/PageDown · Home/End, bosib kiritish; `role="spinbutton"`, o'lchamlar xs · s · m · l), `SwitchField` (3.6 Switch field — label + izoh + Switch, butun qator bosiladi; s · m), `CheckboxField` (3.4 Checkbox field — label + izoh + Checkbox, `controlPosition` start · end; s · m) va `ControlGroup` (3.20 Field groups → Control group — `<fieldset>` + `<legend>`, `density` default · compact; ichidagi ScrubField/SwitchField o'lchamni zichlikdan oladi). Umumiy qator uslubi `src/styles/control-field.css`; balandliklar `--bek-field-height-*` tokenlaridan.
