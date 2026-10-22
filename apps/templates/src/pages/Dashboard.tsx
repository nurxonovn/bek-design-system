import {
  Avatar,
  Badge,
  BekLogo,
  BottomNavGroup,
  BottomNavigation,
  BottomNavItem,
  Button,
  Card,
  ListItem,
  NavItem,
  ProgressBar,
  SearchField,
  Tag,
  type TagColor,
} from '@bek-ui/react';
import { Icon, type IconName } from '../icons';
import { Placeholder } from '../Phone';

const NAV: { icon: IconName; label: string; badge?: number }[] = [
  { icon: 'home', label: 'Home' },
  { icon: 'book', label: 'My courses' },
  { icon: 'clipboard', label: 'Assignments', badge: 12 },
  { icon: 'calendar', label: 'Schedule' },
  { icon: 'star', label: 'Certificates' },
  { icon: 'settings', label: 'Settings' },
];

const STATS = [
  { label: 'Active courses', value: '4', delta: '+1', color: 'success' },
  { label: 'Completed', value: '12', delta: '+3', color: 'success' },
  { label: 'Average score', value: '86%', delta: '+4%', color: 'success' },
  { label: 'Day streak', value: '9', delta: 'Record', color: 'accent' },
] as const;

const COURSES: { title: string; meta: string; level: string; color: TagColor; action: string }[] = [
  {
    title: 'Design systems',
    meta: '12 lessons · 4h 30m · N. Nurxonov',
    level: 'Intermediate',
    color: 'info',
    action: 'Continue',
  },
  {
    title: 'UX research basics',
    meta: '8 lessons · 3h 10m · D. Karimova',
    level: 'Beginner',
    color: 'success',
    action: 'Continue',
  },
  {
    title: 'Web frontend: React',
    meta: '20 lessons · 9h 00m · J. Rahimov',
    level: 'Advanced',
    color: 'warning',
    action: 'Start',
  },
];

const DEADLINES: { icon: IconName; title: string; meta: string; due: string; color: TagColor }[] = [
  {
    icon: 'clipboard',
    title: 'Practical assignment No. 3',
    meta: 'Design systems · 18 September, 23:59',
    due: '2 days',
    color: 'warning',
  },
  {
    icon: 'check',
    title: 'Final test',
    meta: 'UX research basics · 21 September, 12:00',
    due: '5 days',
    color: 'neutral',
  },
  {
    icon: 'user',
    title: 'Meeting with mentor',
    meta: 'Today, 18:00 · Google Meet',
    due: 'Today',
    color: 'danger',
  },
  {
    icon: 'edit',
    title: 'Project presentation',
    meta: 'Web frontend: React · 28 September',
    due: '12 days',
    color: 'neutral',
  },
];

function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="tpl-section-header">
      <h2 className="tpl-h2">{title}</h2>
      <Button variant="flat" endIcon={<Icon name="arrowUp" style={{ rotate: '90deg' }} />}>
        {link}
      </Button>
    </div>
  );
}

/** Figma "8.1 Dashboard (Web)": Desktop 1440 (sidebar) va Mobile 390 (bottom navigation). */
export function Dashboard() {
  return (
    <div className="tpl-dashboard">
      <aside className="tpl-dashboard__sidebar">
        <div className="tpl-dashboard__brand">
          <BekLogo size="s" />
        </div>
        <nav className="tpl-dashboard__nav" aria-label="Main">
          {NAV.map((item, i) => (
            <NavItem
              key={item.label}
              href="#/dashboard"
              icon={<Icon name={item.icon} />}
              selected={i === 0}
              badge={item.badge}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
        <div className="tpl-dashboard__profile">
          <Avatar name="Nurbek Nurxonov" status="online" />
          <div>
            <div className="tpl-strong">Nurbek Nurxonov</div>
            <div className="tpl-muted tpl-caption">Student · Pro</div>
          </div>
        </div>
      </aside>

      <div className="tpl-dashboard__main">
        <header className="tpl-dashboard__header">
          <BekLogo size="s" className="tpl-mobile-only" />
          <SearchField
            size="s"
            placeholder="Search courses, lessons…"
            className="tpl-dashboard__search tpl-desktop-only"
          />
          <div className="tpl-row">
            <Button variant="flat" size="l" iconOnly startIcon={<Icon name="mail" />}>
              Messages
            </Button>
            <Button variant="flat" size="l" iconOnly startIcon={<Icon name="bell" />}>
              Notifications
            </Button>
            <Avatar size="s" name="Nurbek Nurxonov" />
          </div>
        </header>

        <main className="tpl-dashboard__content">
          <SearchField
            size="s"
            placeholder="Search courses, lessons…"
            className="tpl-mobile-only"
          />
          <div>
            <h1 className="tpl-h1">Hello, Nurbek</h1>
            <p className="tpl-muted">You have 2 lessons today and 1 assignment due soon</p>
          </div>

          <div className="tpl-stats">
            {STATS.map((stat) => (
              <Card key={stat.label} variant="elevated">
                <div className="tpl-stat__top">
                  <span className="tpl-muted">{stat.label}</span>
                  <Badge variant="subtle" size="s" color={stat.color}>
                    {stat.delta}
                  </Badge>
                </div>
                <div className="tpl-stat__value">{stat.value}</div>
              </Card>
            ))}
          </div>

          <Card variant="filled" size="l">
            <div className="tpl-progress-card">
              <div className="tpl-progress-card__text">
                <Badge variant="subtle" color="accent" size="s" dot>
                  In progress
                </Badge>
                <h2 className="tpl-h3">Design systems: from zero to production</h2>
                <p className="tpl-muted tpl-small">
                  Lesson 6: Auto Layout and Constraints · 18 minutes left
                </p>
                <ProgressBar value={26} max={42} label="26 of 42 lessons completed" showValue />
              </div>
              <Button
                variant="action"
                size="xl"
                endIcon={<Icon name="arrowUp" style={{ rotate: '90deg' }} />}
              >
                Continue
              </Button>
            </div>
          </Card>

          <SectionHeader title="My courses" link="All" />
          <div className="tpl-courses">
            {COURSES.map((course) => (
              <Card
                key={course.title}
                media={<Placeholder icon={<Icon name="image" width={32} height={32} />} />}
                title={course.title}
                badge={
                  <Tag color={course.color} size="s">
                    {course.level}
                  </Tag>
                }
                description={course.meta}
                footer={
                  <div className="tpl-row">
                    <Button variant="action">{course.action}</Button>
                    <Button variant="flat">Details</Button>
                  </div>
                }
              />
            ))}
          </div>

          <SectionHeader title="Upcoming deadlines" link="Go to schedule" />
          <Card variant="elevated" size="s" className="tpl-list-card">
            {DEADLINES.map((item) => (
              <ListItem
                key={item.title}
                href="#/dashboard"
                leading={<Icon name={item.icon} width={24} height={24} />}
                title={item.title}
                description={item.meta}
                trailing={
                  <Tag color={item.color} size="s">
                    {item.due}
                  </Tag>
                }
                chevron
              />
            ))}
          </Card>
        </main>

        <BottomNavigation className="tpl-mobile-only">
          <BottomNavGroup variant="dual">
            <BottomNavItem href="#/dashboard" icon={<Icon name="home" />} selected>
              Home
            </BottomNavItem>
            <BottomNavItem href="#/dashboard" icon={<Icon name="book" />}>
              Courses
            </BottomNavItem>
          </BottomNavGroup>
          <BottomNavGroup variant="solo">
            <BottomNavItem href="#/dashboard" variant="icon-only" icon={<Icon name="clipboard" />}>
              Assignments
            </BottomNavItem>
          </BottomNavGroup>
        </BottomNavigation>
      </div>
    </div>
  );
}
