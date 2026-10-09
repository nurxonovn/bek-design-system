# TimeSlotPicker

Figma: **3.15 Time slot picker** + **Time slot** — yetkazish yoki band qilish oynasini tanlash: kun (SegmentedControl) + oynalar to'ri (qatorda 3 ta) + izoh. Express oyna birinchi.

```tsx
<TimeSlotPicker
  title="Yetkazish vaqti"
  days={days}
  day={day}
  onDayChange={setDay}
  slots={[
    { value: 'x', time: '25–35 daq', note: '+5 000 soʻm', express: true },
    { value: 'a', time: '12:00–12:30', note: 'Bepul' },
  ]}
  value={slot}
  onChange={setSlot}
/>
```

Oynalar — radio guruh (← → bilan); `disabled` — to'lgan oyna; tanlangan — `accent/default`.
