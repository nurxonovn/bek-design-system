import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  DrawerItem,
  MenuPanel,
  ModuleRail,
  NavDrawer,
  NavGroup,
  NavItem,
  NavProfile,
  NavRail,
  NavSubList,
  RailItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('Tabs: roles, selection, roving tabindex and panel linkage', () => {
  const html = r(
    h(
      Tabs,
      { defaultValue: 'b', type: 'pill', size: 'l' },
      h(
        TabList,
        { width: 'fill', 'aria-label': 'Sections' },
        h(Tab, { value: 'a' }, 'A'),
        h(Tab, { value: 'b', badge: 3 }, 'B'),
        h(Tab, { value: 'c', disabled: true }, 'C'),
      ),
      h(TabPanel, { value: 'a' }, 'Panel A'),
      h(TabPanel, { value: 'b' }, 'Panel B'),
    ),
  );
  assert.match(
    html,
    /role="tablist"[^>]*class="bek-tab-list bek-tab-list--pill bek-tab-list--l bek-tab-list--fill"/,
  );
  assert.equal(html.match(/aria-selected="true"/g).length, 1);
  assert.match(html, /aria-selected="true"[^>]*tabindex="0"/);
  assert.equal(html.match(/tabindex="-1"/g).length, 2);
  assert.match(html, /bek-badge--subtle bek-badge--s bek-tone--accent/);
  assert.doesNotMatch(html, /Panel A/);
  const tabId = html.match(/aria-selected="true" aria-controls="([^"]+)"/)[1];
  assert.match(html, new RegExp(`role="tabpanel" id="${tabId}"`));
});

test('NavItem: link vs button, aria-current, compact modes keep an accessible name', () => {
  const link = r(h(NavItem, { href: '/x', selected: true, icon: h('svg') }, 'Dashboard'));
  assert.match(link, /^<a class="bek-focus-ring bek-nav-item bek-nav-item--expanded"/);
  assert.match(link, /aria-current="page"/);
  assert.match(link, /href="\/x"/);
  const btn = r(h(NavItem, { mode: 'module', icon: h('svg') }, 'Orders'));
  assert.match(btn, /^<button type="button"/);
  assert.match(btn, /bek-visually-hidden">Orders/);
  assert.match(btn, /bek-nav-item__chip" aria-hidden="true">Orders/);
  const exp = r(h(NavItem, { expanded: false }, 'Projects'));
  assert.match(exp, /aria-expanded="false"/);
  assert.match(exp, /bek-nav-item__chevron/);
  const dis = r(h(NavItem, { href: '/y', disabled: true }, 'Off'));
  assert.doesNotMatch(dis, /href=/);
  assert.match(dis, /aria-disabled="true"/);
  assert.doesNotMatch(r(h(NavItem, { mode: 'sub', icon: h('svg') }, 'Sub')), /__icon/);
});

test('NavGroup, NavSubList, MenuPanel and ModuleRail structure', () => {
  const g = r(h(NavGroup, { title: 'Workspace', collapsed: true }, h(NavItem, null, 'A')));
  assert.match(g, /role="group" aria-labelledby="([^"]+)"/);
  assert.match(g, /class="bek-visually-hidden">Workspace/);
  assert.match(r(h(NavSubList, { open: false, variant: 'touch' })), /hidden=""/);
  const panel = r(h(MenuPanel, { collapsed: true, top: 'T', bottom: 'B' }, 'M'));
  assert.match(panel, /^<nav class="bek-menu-panel bek-menu-panel--collapsed">/);
  assert.ok(panel.indexOf('__top') < panel.indexOf('__middle'));
  assert.ok(panel.indexOf('__middle') < panel.indexOf('__bottom'));
  assert.match(
    r(h(ModuleRail, { title: 'Apps', showLabels: true }, 'x')),
    /bek-module-rail--labels/,
  );
});

test('NavRail / RailItem and NavDrawer / DrawerItem', () => {
  const rail = r(
    h(NavRail, null, h(RailItem, { icon: h('svg'), selected: true, badge: 2 }, 'Home')),
  );
  assert.match(rail, /^<nav class="bek-nav-rail">/);
  assert.match(rail, /aria-current="page"/);
  assert.match(rail, /bek-rail-item__label">Home/);
  const drawer = r(
    h(
      NavDrawer,
      { open: false, onClose() {}, footer: 'F' },
      h(DrawerItem, { mode: 'sub' }, 'Phones'),
    ),
  );
  assert.match(drawer, /^<dialog class="bek-nav-drawer">/);
  assert.match(drawer, /aria-label|Close menu/);
  assert.match(drawer, /bek-drawer-item bek-drawer-item--sub/);
  assert.match(drawer, /bek-nav-drawer__footer">F/);
  const profile = r(h(NavProfile, { avatar: h('svg'), name: 'Alex', role: 'Admin', action: 'X' }));
  assert.match(
    profile,
    /^<div class="bek-nav-profile"><span class="bek-nav-profile__avatar" aria-hidden="true"><svg><\/svg><\/span><span class="bek-nav-profile__text"><span class="bek-nav-profile__name">Alex<\/span><span class="bek-nav-profile__role">Admin<\/span><\/span>X<\/div>$/,
  );
  assert.doesNotMatch(r(h(NavProfile, { name: 'A' })), /__role|__avatar/);
});
