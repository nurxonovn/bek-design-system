import { Avatar, Badge, BekLogo, Button, Card } from '@bek/react';
import { Icon, type IconName } from '../icons';

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'settings',
    title: 'Built on tokens',
    text: 'Every colour, size and space is a token. Change one value and the whole system updates.',
  },
  {
    icon: 'eye',
    title: 'Light and Dark — one click',
    text: 'Both modes are built from the same tokens. No picking colours by hand, no inconsistencies.',
  },
  {
    icon: 'code',
    title: 'From Figma to code',
    text: "Component names, variant axes and tokens are identical in Figma and React. Developers don't have to guess.",
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    note: 'free forever',
    features: ['8 core components', 'Light mode', 'For personal projects'],
    cta: 'Get started',
  },
  {
    name: 'Pro',
    price: '$19',
    note: 'per month / 1 user',
    features: ['50+ components', 'Light and Dark modes', '240+ tokens', 'Figma library', 'Updates'],
    cta: 'Choose Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$49',
    note: 'per month / 5 users',
    features: ['Everything in Pro', 'Team library', 'React components', 'Priority support'],
    cta: 'For teams',
  },
];

const FOOTER = {
  Product: ['Components', 'Tokens', 'Templates', "What's new"],
  Resources: ['Docs', 'Guide', 'Figma library', 'Help'],
  Company: ['About us', 'Pricing', 'Contact', 'Licence'],
};

const arrow = <Icon name="arrowUp" style={{ rotate: '90deg' }} />;

/** Figma "8.3 Landing (Web)": Nav, Hero, Stats, Features, Pricing, CTA, Footer (Dark). */
export function Landing() {
  return (
    <div className="tpl-landing" data-theme="dark">
      <header className="tpl-landing__nav">
        <BekLogo size="s" />
        <nav className="tpl-row" aria-label="Main">
          {['Product', 'Components', 'Pricing', 'Docs'].map((label) => (
            <Button key={label} variant="flat">
              {label}
            </Button>
          ))}
        </nav>
        <div className="tpl-row tpl-push">
          <Button variant="flat">Sign in</Button>
          <Button variant="action">Start for free</Button>
        </div>
      </header>

      <section className="tpl-landing__hero">
        <Badge variant="subtle" color="accent" size="s">
          v1.0 is out — 50+ components
        </Badge>
        <h1 className="tpl-display">Build once — run everywhere</h1>
        <p className="tpl-lead">
          BEK — one design system for mobile, web and desktop. 50+ components, 240+ tokens, Light
          and Dark modes — all in one library.
        </p>
        <div className="tpl-row">
          <Button variant="action" size="2xl" endIcon={arrow}>
            Start for free
          </Button>
          <Button variant="normal-contrast" size="2xl">
            View components
          </Button>
        </div>
        <div className="tpl-row tpl-muted tpl-small">
          <span className="tpl-avatars">
            {['Nurbek Nurxonov', 'Dilnoza Karimova', 'Jasur Rahimov', 'Aziz Sobirov'].map((n) => (
              <Avatar key={n} name={n} size="s" />
            ))}
          </span>
          1,200+ designers and teams use BEK
        </div>
      </section>

      <section className="tpl-landing__stats">
        {[
          ['50+', 'components'],
          ['240+', 'design tokens'],
          ['2', 'modes — Light and Dark'],
          ['3', 'platforms'],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="tpl-h1">{value}</div>
            <div className="tpl-muted tpl-small">{label}</div>
          </div>
        ))}
      </section>

      <section className="tpl-landing__section">
        <h2 className="tpl-h1">Why BEK?</h2>
        <p className="tpl-muted">
          A design system isn't a set of components. It's your team speaking one language.
        </p>
        <div className="tpl-grid-3">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              variant="filled"
              size="l"
              icon={<Icon name={f.icon} width={20} height={20} />}
              title={f.title}
              description={f.text}
            />
          ))}
        </div>
      </section>

      <section className="tpl-landing__section tpl-landing__section--alt">
        <h2 className="tpl-h1">Simple pricing</h2>
        <p className="tpl-muted">Cancel at any time. Two months free with annual billing.</p>
        <div className="tpl-grid-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.popular ? 'elevated' : 'filled'}
              size="l"
              selected={plan.popular}
              title={plan.name}
              badge={
                plan.popular && (
                  <Badge variant="subtle" color="accent" size="s">
                    Popular
                  </Badge>
                )
              }
              footer={
                <Button
                  variant={plan.popular ? 'action' : 'normal-contrast'}
                  size="l"
                  className="tpl-grow"
                >
                  {plan.cta}
                </Button>
              }
            >
              <div className="tpl-plan__price">
                <span className="tpl-display">{plan.price}</span>
                <span className="tpl-muted tpl-caption">{plan.note}</span>
              </div>
              <ul className="tpl-checklist">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" width={16} height={16} />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="tpl-landing__cta">
        <h2 className="tpl-h1">Start building today</h2>
        <p>No card required. The free plan includes 8 components and Light mode.</p>
        <Button variant="normal-contrast" size="xl" endIcon={arrow}>
          Start for free
        </Button>
      </section>

      <footer className="tpl-landing__footer">
        <div className="tpl-landing__footer-grid">
          <div className="tpl-stack-8">
            <BekLogo size="s" />
            <span className="tpl-muted tpl-small">
              One design system for mobile, web and desktop.
            </span>
          </div>
          {Object.entries(FOOTER).map(([title, links]) => (
            <div key={title} className="tpl-stack-8">
              <strong className="tpl-small">{title}</strong>
              {links.map((link) => (
                <a key={link} href="#/landing" className="tpl-link">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="tpl-row tpl-between tpl-muted tpl-caption">
          <span>© 2026 BEK Design System</span>
          <span className="tpl-row">
            <a href="#/landing" className="tpl-link">
              Privacy
            </a>
            <a href="#/landing" className="tpl-link">
              Terms
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
