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

Figma'dagi katak turlari: Select → `Checkbox`, Media → `Avatar`, Tags/Status → `Tag`, Actions → icon-only `Button`. Saralanadigan sarlavha — tugma va `aria-sort`.
