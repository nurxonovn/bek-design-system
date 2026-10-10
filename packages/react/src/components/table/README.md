# Table

Figma: **4.5 Table** — native `<table>` + `TableHeaderCell` (saralash), `TableRow` (tanlangan / o'chirilgan), `TableCell` (tavsif, raqam). `size`: `s` 40 · `m` 48 · `l` 56 px; `zebra`.

```tsx
<Table zebra>
  <thead>
    <tr>
      <TableHeaderCell sort={sort} onSort={toggleSort}>
        Ism
      </TableHeaderCell>
      <TableHeaderCell>Holat</TableHeaderCell>
    </tr>
  </thead>
  <tbody>
    <TableRow selected={id === 1}>
      <TableCell description="Dizayner">Nurbek</TableCell>
      <TableCell>
        <Tag color="success">Faol</Tag>
      </TableCell>
    </TableRow>
  </tbody>
</Table>
```

`TableCell` `type` — Figma "Type": `select` → `Checkbox`, `index` → tartib raqami (`text/secondary`), `text`, `text-description` (`description` berilganda avtomatik), `media` → `Avatar` + matn, `tags` / `status` → `Tag`, `actions` → icon-only `Button` (oxirgi ustun, bitta tugma — qolgani menyuda). Saralanadigan sarlavha — tugma va `aria-sort`. `l` o'lchamda matn Body/M, sarlavha Label/L.

```tsx
<TableCell type="select">
  <Checkbox aria-label="Qatorni tanlash" />
</TableCell>
<TableCell type="media">
  <Avatar size="xs" name="Nurbek" /> Nurbek
</TableCell>
<TableCell type="actions">
  <Button variant="flat" size="s" iconOnly startIcon={<MoreIcon />}>Amallar</Button>
</TableCell>
```
