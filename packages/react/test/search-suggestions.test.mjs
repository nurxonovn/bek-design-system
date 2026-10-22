import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  SearchField,
  SearchResultRow,
  SearchSuggestionGroup,
  SearchSuggestions,
  useSearchSuggestions,
} from '../dist/index.js';

const row = (props) => renderToStaticMarkup(h(SearchResultRow, props));

test('SearchResultRow: role=option, default type query (search icon), aria-selected=false', () => {
  const html = row({ title: 'Pizza margherita', id: 'r1' });
  assert.match(
    html,
    /^<div role="option" aria-selected="false" id="r1" class="bek-search-result-row bek-search-result-row--query">/,
  );
  assert.match(html, /bek-search-result-row__icon" aria-hidden="true"><svg viewBox="0 0 20 20"/);
  assert.match(html, /bek-search-result-row__title">Pizza margherita</);
  assert.match(html, /<kbd class="bek-search-result-row__enter" aria-hidden="true">↵<\/kbd>/);
  assert.doesNotMatch(html, /__meta|__snippet|__source|__fill/);
});

test('SearchResultRow: every Figma Type → modifier class', () => {
  for (const type of ['query', 'recent', 'item', 'person', 'file'])
    assert.match(row({ type, title: 'T' }), new RegExp(`bek-search-result-row--${type}`));
  assert.match(row({ type: 'item', title: 'T' }), /bek-search-result-row__thumb/);
  assert.match(row({ type: 'file', title: 'T' }), /bek-search-result-row__thumb/);
});

test('SearchResultRow: Query match → matched part wrapped, rest secondary', () => {
  const html = row({ title: 'Pizza margherita', match: 'piz' });
  assert.match(
    html,
    /__title bek-search-result-row__title--matched"><span class="bek-search-result-row__match">Piz<\/span>za margherita</,
  );
  // match yo'q bo'lsa — oddiy sarlavha
  assert.match(
    row({ title: 'Sushi', match: 'piz' }),
    /__title bek-search-result-row__title--matched">Sushi</,
  );
});

test('SearchResultRow: meta / snippet / source slots; snippet → multiline', () => {
  const html = row({
    type: 'file',
    title: 'Coverage_Requirements.docx',
    meta: 'Apr 11 · 2025',
    snippet: 'Minimum staffing levels',
    source: '#hr',
  });
  assert.match(html, /bek-search-result-row--file bek-search-result-row--multiline/);
  assert.match(html, /__meta">Apr 11 · 2025</);
  assert.match(html, /__snippet">Minimum staffing levels</);
  assert.match(html, /__source">#hr</);
});

test('SearchResultRow: Person → hidden Avatar with initials; media overrides', () => {
  const html = row({ type: 'person', title: 'Alicia Kumar', meta: 'HR Business Partner' });
  assert.match(
    html,
    /__avatar" aria-hidden="true"><span role="img" aria-label="Alicia Kumar" class="bek-avatar bek-avatar--m">/,
  );
  assert.match(html, />AK</);
  assert.match(
    row({ type: 'item', title: 'X', media: h('img', { src: 'a.png', alt: '' }) }),
    /__thumb" aria-hidden="true"><img src="a.png" alt=""\/>/,
  );
});

test('SearchResultRow: selected → aria-selected=true + selected class; Fill query only with handler', () => {
  const html = row({ title: 'Lagman', type: 'recent', selected: true, onFillQuery: () => {} });
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /bek-search-result-row--selected/);
  assert.match(html, /__fill" aria-hidden="true" title="Fill query"/);
  // option ichida fokuslanuvchi element yo'q
  assert.doesNotMatch(html, /<button|tabindex/);
  assert.doesNotMatch(row({ title: 'X', type: 'item', onFillQuery: () => {} }), /__fill/);
});

test('SearchSuggestions: listbox with id/label, web footer hints, activeId selects the row', () => {
  const html = renderToStaticMarkup(
    h(
      SearchSuggestions,
      { listId: 'list', label: 'Takliflar', activeId: 'a' },
      h(
        SearchSuggestionGroup,
        { label: 'Suggestions' },
        h(SearchResultRow, { id: 'a', title: 'Pizza delivery' }),
        h(SearchResultRow, { id: 'b', title: 'Pizza four cheese' }),
      ),
    ),
  );
  assert.match(html, /^<div class="bek-search-suggestions bek-search-suggestions--web">/);
  assert.match(
    html,
    /<div id="list" role="listbox" aria-label="Takliflar" class="bek-search-suggestions__list">/,
  );
  assert.match(html, /aria-selected="true" id="a"/);
  assert.match(html, /aria-selected="false" id="b"/);
  const labelId = html.match(/role="group" aria-labelledby="([^"]+)"/)[1];
  assert.match(
    html,
    new RegExp(
      `<span id="${labelId}" class="bek-search-suggestions__group-label">Suggestions</span>`,
    ),
  );
  assert.match(
    html,
    /__footer" aria-hidden="true"><span>↑ ↓\u00a0\u00a0Navigate<\/span><span>↵\u00a0\u00a0Open<\/span><span>esc\u00a0\u00a0Close<\/span>/,
  );
});

test('SearchSuggestionGroup: action ("See all") is an option, selectable via activeId', () => {
  const html = renderToStaticMarkup(
    h(
      SearchSuggestions,
      {},
      h(
        SearchSuggestionGroup,
        { label: 'Items', actionLabel: 'See all' },
        h(SearchResultRow, { type: 'item', title: 'Q2' }),
      ),
    ),
  );
  const actionId = html.match(
    /<div id="([^"]+)" role="option" aria-selected="false" class="bek-search-suggestions__group-action">See all/,
  )[1];
  const selected = renderToStaticMarkup(
    h(
      SearchSuggestions,
      { activeId: actionId },
      h(
        SearchSuggestionGroup,
        { label: 'Items', actionLabel: 'See all' },
        h(SearchResultRow, { title: 'Q2' }),
      ),
    ),
  );
  assert.match(
    selected,
    /role="option" aria-selected="true" class="bek-search-suggestions__group-action bek-search-suggestions__group-action--selected"/,
  );
});

test('SearchSuggestions: mobile → field slot on top, no footer hints', () => {
  const html = renderToStaticMarkup(
    h(
      SearchSuggestions,
      { device: 'mobile', field: h(SearchField, { 'aria-label': 'Search' }) },
      h(SearchResultRow, { title: 'A' }),
    ),
  );
  assert.match(
    html,
    /bek-search-suggestions--mobile"><div class="bek-search-suggestions__field"><div role="search"/,
  );
  assert.doesNotMatch(html, /__footer/);
  assert.doesNotMatch(
    renderToStaticMarkup(h(SearchSuggestions, { hints: null }, h(SearchResultRow, { title: 'A' }))),
    /__footer/,
  );
});

test('SearchSuggestions: Loading → aria-busy listbox, skeleton rows, live region label', () => {
  const html = renderToStaticMarkup(
    h(
      SearchSuggestions,
      { loading: true, loadingLabel: 'Yuklanmoqda' },
      h(SearchResultRow, { title: 'A' }),
    ),
  );
  assert.match(html, /role="listbox" aria-label="Suggestions" aria-busy="true"/);
  assert.equal(html.match(/bek-search-suggestions__skeleton"/g).length, 4);
  assert.match(html, /bek-skeleton--rect bek-search-suggestions__skeleton-thumb/);
  assert.match(html, /role="status"><span class="bek-visually-hidden">Yuklanmoqda<\/span>/);
  assert.doesNotMatch(html, /role="option"/);
});

test('SearchSuggestions: Empty → status with icon, title, description; listbox stays for aria-controls', () => {
  const html = renderToStaticMarkup(
    h(SearchSuggestions, {
      listId: 'l',
      emptyTitle: 'No results for “pizzzza”',
      emptyDescription: 'Check the spelling or try a broader word.',
    }),
  );
  assert.match(html, /<div id="l" role="listbox"/);
  assert.match(
    html,
    /role="status"><div class="bek-search-suggestions__empty"><span class="bek-search-suggestions__empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"/,
  );
  assert.match(html, /__empty-title">No results for “pizzzza”</);
  assert.match(html, /__empty-description">Check the spelling or try a broader word.</);
});

test('useSearchSuggestions: combobox props for SearchField + list props', () => {
  let nav;
  function Demo() {
    nav = useSearchSuggestions({ open: true });
    return h(
      'div',
      null,
      h(SearchField, { 'aria-label': 'Search', ...nav.inputProps }),
      h(SearchSuggestions, nav.listProps, h(SearchResultRow, { title: 'A' })),
    );
  }
  const html = renderToStaticMarkup(h(Demo));
  const listId = nav.listProps.listId;
  assert.equal(nav.inputProps.role, 'combobox');
  assert.equal(nav.inputProps['aria-controls'], listId);
  assert.equal(nav.activeId, undefined);
  assert.match(
    html,
    new RegExp(
      `role="combobox" aria-expanded="true" aria-controls="${listId}" aria-autocomplete="list"`,
    ),
  );
  assert.match(html, new RegExp(`<div id="${listId}" role="listbox"`));
  let closed;
  function Closed() {
    closed = useSearchSuggestions({ open: false });
    return null;
  }
  renderToStaticMarkup(h(Closed));
  assert.equal(closed.inputProps['aria-expanded'], false);
});
