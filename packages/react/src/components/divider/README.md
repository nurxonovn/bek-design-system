# Divider

Figma: **9.1 Slots & Helpers → \_Divider**. Yagona ajratuvchi chiziq: `border/hairline`, 1 px (`stroke/default`). List, Menu, Card ichida.

```tsx
<Divider />                          // gorizontal, role="separator"
<Divider orientation="vertical" />
<Divider decorative />               // faqat bezak — role="none"
```

## Focus ring

Figma **\_Focus ring** komponent emas, CSS klass: `bek-focus-ring` — `:focus-visible` da 2 px `border/focus` chiziq, element chetidan 2 px tashqarida, uning radiusiga moslashadi (1.6 Accessibility).

```tsx
<button className="bek-focus-ring">…</button>
```
