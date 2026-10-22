# Control group

Figma: **3.20 Field groups** → Control group — sozlamalar paneli guruhi: qisqa sarlavha va 2–4 boshqaruv qatori (ScrubField, SwitchField, Select yoki TextField) bitta oraliq bilan. Muharrirlar, tool panellar va afzalliklar oynalari uchun. `density`: `default` · `compact`.

```tsx
<ControlGroup title="Motion">
  <ScrubField label="Speed" defaultValue={1.75} min={0.25} max={4} step={0.05} unit="×" />
  <ScrubField label="Frame interval" defaultValue={134} max={500} unit="ms" />
  <ScrubField label="Trail persistence" defaultValue={94} unit="%" />
  <SwitchField label="Pointer highlight" defaultChecked />
</ControlGroup>

<ControlGroup title="Pointer" density="compact">…</ControlGroup>
```

## Zichlik

| `density` | Qatorlar                         | Oraliq    | Sarlavha                  | Qayerda                                   |
| --------- | -------------------------------- | --------- | ------------------------- | ----------------------------------------- |
| `default` | ScrubField M 44 · SwitchField M  | `scale/8` | Label/M, pastda `scale/4` | Mobile, Tablet, afzalliklar oynalari      |
| `compact` | ScrubField XS 32 · SwitchField S | `scale/4` | Label/S, pastda `scale/2` | Web / Tablet tool panellari (hit area 44) |

Zichlik guruhda beriladi: ichidagi ScrubField va SwitchField `size` berilmasa o'lchamni shundan oladi. Select va TextField uchun `size` ni o'zingiz bering. Bitta guruhda Default va Compact qatorlarni aralashtirmang.

## Qoidalar (Figma doc)

- Guruhda 2–4 qator (Figma "Show row 3", "Show row 4" — React'da children); uzun ro'yxatni o'z sarlavhali bir nechta guruhga bo'ling.
- Tartib: avval raqamli qiymatlar, toggle'lar oxirida; xavfli amallar guruh ichida hech qachon yo'q.
- O'zgarishlar darhol qo'llanadi — Saqlash tugmasi yo'q. Saqlash kerak bo'lsa — Fieldset (3.19) bilan forma.
- Sarlavha — qisqa ot ("Motion", "Color"); Figma "Show title" — `title` berilmasa sarlavha yo'q (unda `aria-label` bering).
- Bir nechta guruh yonma-yon sozlamalar panelini tashkil qiladi (Characters · Motion · Color · Pointer).
- Har qator — to'liq komponent, ichki atom emas (CMP-09).

## A11y

`<fieldset>` + `<legend>` (sarlavha): guruh nomi ekran o'quvchida har qator bilan o'qiladi. `disabled` butun guruhdagi native boshqaruvlarni o'chiradi. Fieldset atributlari (`aria-label`, `id`, `disabled`, `name`) uzatiladi.
