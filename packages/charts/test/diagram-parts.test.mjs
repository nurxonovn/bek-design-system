import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  AgentNode,
  DIAGRAM_ARROW_LENGTH,
  DIAGRAM_DECISION_HEIGHT,
  DIAGRAM_NODE_GAP,
  DIAGRAM_NODE_HEIGHT,
  DIAGRAM_NODE_WIDTH,
  DiagramConnector,
  DiagramNode,
  diagramNodeSize,
  OrgCard,
  orthogonalPath,
  orthogonalPoints,
  Timeline,
  TimelineItem,
} from '../dist/index.js';

const svg = (child) => render(h('svg', null, child));

test('DiagramNode: root classes per variant, label, SVG shape only for decision/data', () => {
  const html = render(h(DiagramNode, { label: 'Step name' }));
  assert.match(html, /^<div class="bek-diagram bek-diagram-node bek-diagram-node--process/);
  assert.match(html, /<span class="bek-diagram-node__label">Step name<\/span>/);
  assert.doesNotMatch(html, /<svg/);
  for (const variant of ['terminal', 'note', 'subprocess']) {
    const out = render(h(DiagramNode, { variant, label: 'X' }));
    assert.match(out, new RegExp(`bek-diagram-node--${variant}`));
    assert.doesNotMatch(out, /<polygon/);
  }
  for (const variant of ['decision', 'data']) {
    const out = render(h(DiagramNode, { variant, label: 'X' }));
    assert.match(out, new RegExp(`bek-diagram-node--${variant}`));
    assert.match(out, /<svg class="bek-diagram-node__shape"[^>]*aria-hidden="true"/);
    assert.equal(out.match(/<polygon/g).length, 1);
  }
  assert.match(
    render(h(DiagramNode, { label: 'Now', highlighted: true })),
    /bek-diagram-node--highlighted/,
  );
});

test('diagramNodeSize and layout constants follow Figma scale tokens', () => {
  assert.deepEqual(diagramNodeSize(), { width: 160, height: 56 });
  assert.deepEqual(diagramNodeSize('decision'), { width: 160, height: 80 });
  assert.equal(DIAGRAM_NODE_WIDTH, 160);
  assert.equal(DIAGRAM_NODE_HEIGHT, 56);
  assert.equal(DIAGRAM_DECISION_HEIGHT, 80);
  assert.equal(DIAGRAM_NODE_GAP, 32);
});

test('orthogonalPath / orthogonalPoints: horizontal and vertical elbows, straight when aligned', () => {
  assert.equal(orthogonalPath({ x: 0, y: 0 }, { x: 120, y: 48 }), 'M0,0H60V48H120');
  assert.equal(orthogonalPath({ x: 0, y: 0 }, { x: 120, y: 48 }, 'vertical'), 'M0,0V24H120V48');
  assert.equal(orthogonalPath({ x: 0, y: 10 }, { x: 80, y: 10 }), 'M0,10H80');
  assert.equal(orthogonalPoints({ x: 0, y: 0 }, { x: 40, y: 40 }).length, 4);
  assert.equal(orthogonalPoints({ x: 5, y: 0 }, { x: 5, y: 40 }).length, 2);
});

test('DiagramConnector: line trimmed by the arrow, head pinned to `to`, variants', () => {
  const html = svg(h(DiagramConnector, { from: { x: 0, y: 20 }, to: { x: 120, y: 20 } }));
  assert.match(
    html,
    /<g class="bek-diagram bek-diagram-connector bek-diagram-connector--straight">/,
  );
  assert.match(html, new RegExp(`d="M0,20H${120 - DIAGRAM_ARROW_LENGTH}"`));
  assert.match(html, /class="bek-diagram-connector__head" d="M120,20L112,25L112,15Z"/);
  assert.doesNotMatch(html, /<text/);

  assert.match(
    svg(h(DiagramConnector, { variant: 'dashed', from: { x: 0, y: 0 }, to: { x: 50, y: 0 } })),
    /bek-diagram-connector--dashed/,
  );
  const elbow = svg(
    h(DiagramConnector, { variant: 'elbow', from: { x: 0, y: 0 }, to: { x: 120, y: 48 } }),
  );
  assert.match(elbow, /d="M0,0H60V48H112"/);
  const dashedElbow = svg(
    h(DiagramConnector, {
      variant: 'dashed',
      route: 'elbow',
      direction: 'vertical',
      from: { x: 0, y: 0 },
      to: { x: 120, y: 48 },
    }),
  );
  assert.match(dashedElbow, /d="M0,0V24H120V40"/);
  assert.match(
    svg(h(DiagramConnector, { from: { x: 0, y: 0 }, to: { x: 9, y: 0 }, active: true })),
    /bek-diagram-connector--active/,
  );
});

test('DiagramConnector labeled: pill rect + text at the middle segment', () => {
  const html = svg(
    h(DiagramConnector, {
      variant: 'labeled',
      label: 'Yes',
      from: { x: 0, y: 20 },
      to: { x: 120, y: 20 },
    }),
  );
  assert.match(html, /bek-diagram-connector--labeled/);
  assert.match(html, /<g class="bek-diagram-connector__label"><rect [^>]*rx="10"/);
  assert.match(html, /<text x="60" y="20"[^>]*>Yes<\/text>/);
});

test('AgentNode: status classes, Badge per status, spinner only while running', () => {
  const idle = render(
    h(AgentNode, { title: 'Summarize with AI', type: 'LLM step', meta: 'Waiting' }),
  );
  assert.match(idle, /^<div class="bek-diagram bek-agent-node bek-agent-node--idle">/);
  assert.match(idle, /<span class="bek-agent-node__status" role="status">/);
  assert.match(idle, /bek-badge--subtle[^"]*bek-tone--neutral/);
  assert.match(idle, />Idle</);
  assert.match(idle, /bek-badge__dot/);
  assert.equal(idle.match(/bek-agent-node__port /g).length, 2);
  assert.match(idle, /class="bek-agent-node__type">LLM step</);

  const running = render(h(AgentNode, { title: 'S', status: 'running', meta: '12 of 40' }));
  assert.match(running, /bek-agent-node--running/);
  assert.match(running, /bek-spinner/);
  assert.match(running, /bek-tone--accent/);
  assert.doesNotMatch(running, /bek-badge__dot/);
  assert.equal(running.match(/role="status"/g).length, 1);

  assert.match(
    render(h(AgentNode, { title: 'S', status: 'success' })),
    /bek-tone--success[^]*>Done</,
  );
  const error = render(h(AgentNode, { title: 'S', status: 'error', meta: 'Rate limit' }));
  assert.match(error, /bek-agent-node--error/);
  assert.match(error, /bek-tone--danger[^]*>Failed</);
  assert.match(error, /class="bek-agent-node__meta">Rate limit</);
});

test('AgentNode: href makes the node a focusable link; ports and statusLabel optional', () => {
  const html = render(
    h(AgentNode, { title: 'S', href: '/steps/s', ports: false, statusLabel: 'Queued' }),
  );
  assert.match(html, /^<a href="\/steps\/s" class="[^"]*bek-agent-node--link bek-focus-ring"/);
  assert.doesNotMatch(html, /bek-agent-node__port/);
  assert.match(html, />Queued</);
});

test('OrgCard: avatar initials, name tooltip, collapsed badge with uz-UZ count', () => {
  const html = render(
    h(OrgCard, { name: 'Dilnoza Nazarova', role: 'Head of Retail', team: 'Retail banking' }),
  );
  assert.match(html, /^<div class="bek-diagram bek-org-card bek-org-card--default">/);
  assert.match(html, /bek-avatar bek-avatar--m/);
  assert.match(html, />DN</);
  assert.match(html, /title="Dilnoza Nazarova"/);
  assert.match(html, /class="bek-org-card__role">Head of Retail</);
  assert.doesNotMatch(html, /bek-badge/);

  const collapsed = render(h(OrgCard, { name: 'A B', reports: 1200, collapsed: true }));
  assert.match(collapsed, /bek-org-card--collapsed/);
  assert.match(collapsed, />\+1\s200</);
  assert.match(collapsed, /bek-badge__dot/);
});

test('OrgCard: treeitem semantics, selected ring and toggle button', () => {
  const html = render(
    h(OrgCard, {
      name: 'A B',
      reports: 3,
      collapsed: true,
      selected: true,
      nodeRole: 'treeitem',
      onToggle: () => {},
    }),
  );
  assert.match(html, /role="treeitem" aria-expanded="false" aria-selected="true"/);
  assert.match(html, /bek-org-card--selected/);
  assert.match(
    html,
    /<button type="button" class="bek-org-card__toggle bek-focus-ring" aria-expanded="false" aria-label="Show 3 reports">/,
  );
  const open = render(h(OrgCard, { name: 'A B', reports: 3, onToggle: () => {} }));
  assert.match(open, /aria-label="Hide 3 reports"/);
  assert.match(open, /bek-badge--outline/);
});

test('Timeline / TimelineItem: ordered list, state classes, aria-current, <time>', () => {
  const html = render(
    h(
      Timeline,
      { 'aria-label': 'Application status' },
      h(TimelineItem, { title: 'Submitted', date: '14 Oct', dateTime: '2026-10-14T10:20' }),
      h(TimelineItem, {
        state: 'current',
        title: 'Credit check',
        date: 'Today',
        description: 'Up to 2 hours',
      }),
      h(TimelineItem, { state: 'upcoming', title: 'Card issued' }),
    ),
  );
  assert.match(html, /^<ol aria-label="Application status" class="bek-diagram bek-timeline">/);
  assert.equal(html.match(/<li /g).length, 3);
  assert.match(html, /class="bek-diagram bek-timeline-item bek-timeline-item--done"/);
  assert.match(
    html,
    /aria-current="step" class="bek-diagram bek-timeline-item bek-timeline-item--current"/,
  );
  assert.equal(html.match(/aria-current/g).length, 1);
  assert.match(html, /bek-timeline-item--upcoming/);
  assert.match(
    html,
    /<time class="bek-timeline-item__date" datetime="2026-10-14T10:20">14 Oct<\/time>/i,
  );
  assert.match(html, /class="bek-timeline-item__description">Up to 2 hours</);
  assert.match(html, /class="bek-timeline-item__rail" aria-hidden="true"/);
  assert.match(render(h(TimelineItem, { title: 'Last', line: false })), /bek-timeline-item--last/);
});
