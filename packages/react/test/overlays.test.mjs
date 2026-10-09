import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ActionSheet,
  AlertDialog,
  BottomSheet,
  Button,
  CommandGroup,
  CommandItem,
  CommandPalette,
  ContextMenu,
  Drawer,
  DropdownMenu,
  HoverCard,
  MenuItem,
  MenuSeparator,
  Modal,
  Popover,
  ShareSheet,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);
const noop = () => {};

test('Modal: dialog labelled by title, footer buttons follow variant', () => {
  const html = r(
    h(
      Modal,
      {
        open: false,
        onClose: noop,
        size: 's',
        variant: 'danger',
        title: 'Delete?',
        description: 'Gone forever',
        primaryAction: { label: 'Delete' },
        cancelAction: { label: 'Cancel' },
      },
      'Body',
    ),
  );
  assert.match(
    html,
    /^<dialog aria-labelledby="([^"]+)-title" aria-describedby="\1-description" class="bek-overlay bek-modal bek-modal--s">/,
  );
  assert.match(html, /bek-button--outline[^>]*>.*Cancel/);
  assert.match(html, /bek-button--danger/);
  assert.match(html, /aria-label="Close"/);
  assert.doesNotMatch(
    r(h(Modal, { open: false, onClose: noop, title: 'T', hideClose: true })),
    /aria-label="Close"|__footer/,
  );
});

test('Drawer and BottomSheet variants', () => {
  assert.match(
    r(h(Drawer, { open: false, onClose: noop, title: 'T', side: 'left', size: 'l' })),
    /class="bek-overlay bek-drawer bek-drawer--left bek-drawer--l bek-drawer--divider"/,
  );
  const promo = r(
    h(BottomSheet, {
      open: false,
      onClose: noop,
      type: 'promo',
      title: 'New',
      media: h('img', { alt: '' }),
      primaryAction: { label: 'Try' },
      secondaryAction: { label: 'Not now' },
    }),
  );
  assert.match(promo, /bek-bottom-sheet__hero/);
  assert.match(promo, /bek-bottom-sheet__promo-title/);
  assert.doesNotMatch(promo, /aria-label="Close"/);
  assert.match(promo, /bek-button--flat-secondary bek-button--xl/);
});

test('AlertDialog: alertdialog role, no close button, stacked order', () => {
  const html = r(
    h(AlertDialog, {
      open: false,
      onClose: noop,
      variant: 'warning',
      layout: 'stacked',
      title: 'Sure?',
      confirmAction: { label: 'Yes' },
      cancelAction: { label: 'No' },
    }),
  );
  assert.match(html, /role="alertdialog"/);
  assert.doesNotMatch(html, /aria-label="Close"/);
  assert.ok(html.indexOf('Yes') < html.indexOf('No'));
  assert.match(html, /bek-button--action bek-button--l/);
  const inline = r(
    h(AlertDialog, {
      open: false,
      onClose: noop,
      variant: 'danger',
      title: 'Sure?',
      confirmAction: { label: 'Yes' },
      cancelAction: { label: 'No' },
    }),
  );
  assert.ok(inline.indexOf('No') < inline.indexOf('Yes'));
  assert.match(inline, /bek-button--danger bek-button--m/);
});

test('Anchored overlays render only the trigger until opened', () => {
  const pop = r(h(Popover, { trigger: h(Button, null, 'Open'), title: 'T' }));
  assert.match(
    pop,
    /^<span class="bek-anchor"><button[^>]*aria-expanded="false" aria-haspopup="dialog"/,
  );
  const menu = r(
    h(DropdownMenu, { trigger: h(Button, null, 'Menu') }, h(MenuItem, null, 'A'), h(MenuSeparator)),
  );
  assert.match(menu, /aria-haspopup="menu" aria-expanded="false"/);
  assert.doesNotMatch(menu, /role="menu"/);
  assert.match(
    r(h(ContextMenu, { menu: h(MenuItem, null, 'Copy') }, 'Area')),
    /^<div class="bek-context-area">Area<\/div>$/,
  );
  assert.match(
    r(h(HoverCard, { trigger: h('a', { href: '#' }, '@a') }, 'Card')),
    /^<span class="bek-anchor"><a href="#">@a<\/a><\/span>$/,
  );
});

test('CommandPalette: combobox + listbox, empty state', () => {
  const html = r(
    h(
      CommandPalette,
      { open: false, onClose: noop, query: '', onQueryChange: noop },
      h(CommandGroup, { heading: 'Suggestions' }, h(CommandItem, { hotkey: '⌘O' }, 'Open')),
    ),
  );
  assert.match(html, /role="combobox"/);
  assert.match(html, /role="listbox"/);
  assert.match(html, /role="option"/);
  assert.match(html, /bek-command__footer/);
  const empty = r(
    h(CommandPalette, {
      open: false,
      onClose: noop,
      query: 'x',
      onQueryChange: noop,
      empty: 'No results',
      hints: null,
    }),
  );
  assert.match(empty, /bek-command__empty">No results/);
  assert.doesNotMatch(empty, /bek-command__footer/);
});

test('ActionSheet and ShareSheet', () => {
  const sheet = r(
    h(ActionSheet, {
      open: false,
      onClose: noop,
      platform: 'ios',
      title: 'Options',
      actions: [{ label: 'Delete', destructive: true, icon: h('svg') }, { label: 'Edit' }],
    }),
  );
  assert.match(sheet, /bek-action-sheet--ios/);
  assert.match(sheet, /bek-action-sheet__action--destructive/);
  assert.doesNotMatch(sheet, /bek-action-sheet__icon|bek-bottom-sheet__handle/);
  const share = r(
    h(ShareSheet, {
      open: false,
      onClose: noop,
      title: 'Item',
      link: 'https://bek.uz/p/1',
      contacts: [{ label: 'Aziz', icon: 'AK' }],
      targets: [{ label: 'Copy', icon: h('svg') }],
    }),
  );
  assert.match(share, /bek-share-sheet__link">bek.uz\/p\/1/);
  assert.match(share, /bek-share-sheet__row--contact/);
  assert.match(share, /bek-share-sheet__copy[^>]*><span aria-live="polite">Copy/);
});
