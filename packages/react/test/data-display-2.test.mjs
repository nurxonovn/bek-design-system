import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Price,
  Rating,
  Separator,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('Table: native table with sortable header and selected row', () => {
  const html = r(
    h(
      Table,
      { size: 's', zebra: true },
      h(
        'thead',
        null,
        h(
          'tr',
          null,
          h(TableHeaderCell, { sort: 'asc', onSort() {} }, 'Name'),
          h(TableHeaderCell, null, 'Total'),
        ),
      ),
      h(
        'tbody',
        null,
        h(
          TableRow,
          { selected: true },
          h(TableCell, { description: 'Designer' }, 'Nurbek'),
          h(TableCell, { numeric: true }, '12'),
        ),
      ),
    ),
  );
  assert.match(html, /<table class="bek-table bek-table--s bek-table--zebra">/);
  assert.match(
    html,
    /<th scope="col" aria-sort="ascending" class="bek-table__th"><button type="button"/,
  );
  assert.match(html, /<tr aria-selected="true" class="bek-table__row is-selected">/);
  assert.match(html, /bek-table__description">Designer/);
  assert.match(
    html,
    /bek-table__td bek-table__td--text-description"><span class="bek-table__stack"/,
  );
  assert.match(html, /bek-table__td bek-table__td--numeric">12/);
});

test('Table: cell types from Figma (select, index, media, tags, status, actions)', () => {
  assert.match(
    r(h(TableCell, { type: 'select' }, 'x')),
    /class="bek-table__td bek-table__td--select">x</,
  );
  assert.match(r(h(TableCell, { type: 'index' }, '1')), /bek-table__td--index">1</);
  assert.match(r(h(TableCell, { type: 'text' }, 't')), /class="bek-table__td">t</);
  for (const type of ['media', 'tags', 'status', 'actions'])
    assert.match(
      r(h(TableCell, { type }, 'c')),
      new RegExp(`bek-table__td--${type}"><span class="bek-table__inline">c</span>`),
    );
  assert.match(r(h(Table, { size: 'l' })), /bek-table bek-table--l/);
});

test('Separator: line, block, labeled', () => {
  assert.match(
    r(h(Separator, { inset: 'both' })),
    /role="separator" class="bek-separator bek-separator--line bek-separator--horizontal bek-separator--inset-both"/,
  );
  assert.match(r(h(Separator, { type: 'block' })), /bek-separator--block/);
  assert.match(r(h(Separator, { type: 'labeled', label: 'yoki' })), /bek-separator__label">yoki</);
});

test('Price: sale shows struck old price and discount', () => {
  const html = r(
    h(Price, {
      amount: 4234000,
      oldAmount: 5000000,
      currency: 'soʻm',
      discount: '−15%',
      locale: 'en',
      size: 'l',
    }),
  );
  assert.match(html, /bek-price bek-price--l bek-price--inline bek-price--sale/);
  assert.match(html, /bek-price__amount">4,234,000/);
  assert.match(html, /<s class="bek-price__old">5,000,000/);
  assert.match(html, /bek-price__discount">−15%/);
});

test('Rating: 3.5 → 3 full, 1 half, 1 empty; labelled score', () => {
  const html = r(h(Rating, { value: 3.5, count: '(1 245)', locale: 'en' }));
  assert.match(html, /role="img" aria-label="3.5 \/ 5"/);
  assert.equal(html.match(/bek-star__full/g).length, 4);
  assert.equal(html.match(/bek-star__empty/g).length, 2);
  assert.match(html, /clip-path:inset\(0 50% 0 0\)/);
  assert.equal(html.match(/bek-rating__star--full/g).length, 3);
  assert.equal(html.match(/bek-rating__star--half/g).length, 1);
  assert.equal(html.match(/bek-rating__star--empty/g).length, 1);
  assert.equal(r(h(Rating, { value: 4.5, variant: 'compact' })).match(/<svg/g).length, 1);
});
