# CodeInput · Pinpad

Figma: **4.7 Pincode** — PIN nuqtalari (`CodeInput`, 4 yoki 6) va raqamli klaviatura (`Pinpad`).

```tsx
<CodeInput value={pin} length={4} state={error ? 'error' : 'typing'} helperText={error ? "Kod noto'g'ri" : 'PIN kiriting'} aria-label="PIN" onChange={(e) => setPin(e.target.value)} />
<Pinpad onDigit={(d) => setPin((p) => (p + d).slice(0, 4))} onClear={() => setPin((p) => p.slice(0, -1))} bottomLeft="face" onBottomLeft={unlockWithFaceId} />
```

`CodeInput` ichida yashirin `<input type="password" inputMode="numeric" autoComplete="one-time-code">` — klaviatura va SMS avto-to'ldirish ishlaydi; holat matni `role="status"`. `Pinpad`: chap pastki tugma `face` · `finger` · `text` · `empty`; o'ngda o'chirish.
