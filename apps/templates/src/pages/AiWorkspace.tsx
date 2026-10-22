import { useState } from 'react';
import {
  Avatar,
  BekLogo,
  BottomNavGroup,
  BottomNavigation,
  BottomNavItem,
  Button,
  Checkbox,
  NavGroup,
  NavItem,
  Tab,
  TabList,
  Tabs,
  Tooltip,
} from '@bek-ui/react';
import { Icon, type IconName } from '../icons';

const TASKS = [
  {
    title: 'Review BEK brand colours',
    text: 'Brand colours checked and correct values supplied.',
    who: 'Nurbek Nurxonov',
    file: { name: 'BEK-brand-colors.txt', meta: 'TXT · 2 KB' },
  },
  {
    title: 'Update the checkDomain tool',
    text: 'checkDomain updated with a two-strategy approach.',
    who: 'Dilnoza Karimova',
  },
  {
    title: 'Find AI landing page templates',
    text: 'Tailark theming details confirmed from the official docs.',
    who: 'Jasur Rahimov',
  },
];

const nav = (items: [IconName, string][], selected?: string) =>
  items.map(([icon, label]) => (
    <NavItem
      key={label}
      href="#/workspace"
      icon={<Icon name={icon} />}
      selected={label === selected}
    >
      {label}
    </NavItem>
  ));

/** Figma "8.4 AI Workspace (Web)": sidebar, buyruq maydoni, vazifalar va o'ng ustunda eslatmalar. */
export function AiWorkspace() {
  const [task, setTask] = useState('');
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="tpl-workspace">
      <aside className="tpl-workspace__sidebar">
        <div className="tpl-dashboard__brand">
          <BekLogo size="s" />
        </div>
        <NavGroup title="Main">
          {nav([
            ['plus', 'New task'],
            ['search', 'Search'],
          ])}
        </NavGroup>
        <NavGroup title="Workspace">
          {nav(
            [
              ['home', 'Home'],
              ['book', 'Knowledge base'],
              ['folder', 'Files'],
              ['sparkles', 'Capabilities'],
              ['menu', 'Apps'],
            ],
            'Home',
          )}
        </NavGroup>
        <div className="tpl-push-down">
          {nav([
            ['more', 'Recent'],
            ['user', 'Account'],
            ['info', 'Usage'],
          ])}
        </div>
      </aside>

      <main className="tpl-workspace__main">
        <h1 className="tpl-display-s">
          Good morning,
          <br />
          Next meeting — Backlog Grooming
        </h1>
        <form className="tpl-composer" onSubmit={(event) => event.preventDefault()}>
          <textarea
            className="tpl-composer__input"
            placeholder="Write a task and run it"
            aria-label="Task"
            value={task}
            onChange={(event) => setTask(event.target.value)}
          />
          <div className="tpl-row tpl-between">
            <Tooltip content="Enhance prompt">
              <Button variant="flat" iconOnly startIcon={<Icon name="sparkles" />}>
                Enhance
              </Button>
            </Tooltip>
            <div className="tpl-row">
              <Button variant="flat" iconOnly startIcon={<Icon name="mic" />}>
                Dictate
              </Button>
              <Button variant="flat" iconOnly startIcon={<Icon name="settings" />}>
                Settings
              </Button>
              <Button type="submit" variant="action" iconOnly startIcon={<Icon name="arrowUp" />}>
                Run
              </Button>
            </div>
          </div>
        </form>

        <Tabs defaultValue="all">
          <TabList aria-label="Tasks">
            <Tab value="all">All</Tab>
            <Tab value="needs">Needs you</Tab>
            <Tab value="progress">In progress</Tab>
            <Tab value="conversations">Conversations</Tab>
          </TabList>
        </Tabs>
        <ul className="tpl-tasks">
          {TASKS.map((t) => (
            <li key={t.title} className="tpl-task">
              <Checkbox
                aria-label={t.title}
                checked={done.includes(t.title)}
                onChange={(event) =>
                  setDone(
                    event.target.checked ? [...done, t.title] : done.filter((x) => x !== t.title),
                  )
                }
              />
              <div className="tpl-task__body">
                <div className="tpl-strong">{t.title}</div>
                <div className="tpl-muted tpl-small">{t.text}</div>
                {t.file && (
                  <div className="tpl-file">
                    <span className="tpl-file__icon">
                      <Icon name="file" width={16} height={16} />
                    </span>
                    <div>
                      <div className="tpl-small">{t.file.name}</div>
                      <div className="tpl-caption tpl-muted">{t.file.meta}</div>
                    </div>
                  </div>
                )}
              </div>
              <Avatar name={t.who} size="s" />
            </li>
          ))}
        </ul>
      </main>

      <aside className="tpl-workspace__aside">
        <p className="tpl-lead tpl-muted">
          Your calendar is light today — but two conversations are slowly going cold
        </p>
        <div className="tpl-stack-8">
          <p>
            Senfonico — the design partner has been quiet for 6 days; the proposal is still open.
          </p>
          <Button variant="normal">Remind me</Button>
        </div>
        <hr className="tpl-hr" />
        <div className="tpl-stack-8">
          <p>The Blaxel ↔ Untethered thread has been waiting for your reply since Monday.</p>
          <Button variant="normal">Reply now</Button>
        </div>
      </aside>

      <BottomNavigation className="tpl-mobile-only">
        <BottomNavGroup variant="dual">
          <BottomNavItem href="#/workspace" icon={<Icon name="home" />} selected>
            Home
          </BottomNavItem>
          <BottomNavItem href="#/workspace" icon={<Icon name="folder" />}>
            Files
          </BottomNavItem>
        </BottomNavGroup>
        <BottomNavGroup variant="solo">
          <BottomNavItem href="#/workspace" variant="icon-only" icon={<Icon name="plus" />}>
            New task
          </BottomNavItem>
        </BottomNavGroup>
      </BottomNavigation>
    </div>
  );
}
