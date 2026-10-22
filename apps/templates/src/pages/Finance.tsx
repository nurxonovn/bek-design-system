import { useId, useState, type ReactNode } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  BottomNavGroup,
  BottomNavigation,
  BottomNavItem,
  Button,
  FloatingActions,
  InfoWrap,
  Link,
  ListItem,
  ProgressBar,
  Select,
  SelectorCard,
  SelectorGroup,
  Steps,
  StepsItem,
} from '@bek-ui/react';
import { Icon, type IconName } from '../icons';
import { Phone } from '../Phone';

const ME = 'Nurbek Nurxonov';
const back = () => history.back();

function SectionHeader({ title, link = true }: { title: string; link?: boolean }) {
  return (
    <div className="tpl-section-header">
      <h2 className="bek-text-title-s">{title}</h2>
      {link && (
        <Link href="#/finance" variant="accent" endIcon={<Icon name="chevronRight" />}>
          View all
        </Link>
      )}
    </div>
  );
}

/** Figma "Tab bar": Bottom navigation (6.7) Variant=Mobile — Dual guruh (Home, Courses) + Solo (Reports). */
function TabBar() {
  return (
    <BottomNavigation aria-label="Main">
      <BottomNavGroup variant="dual">
        <BottomNavItem href="#/finance" icon={<Icon name="home" />} selected>
          Home
        </BottomNavItem>
        <BottomNavItem href="#/finance" icon={<Icon name="book" />}>
          Courses
        </BottomNavItem>
      </BottomNavGroup>
      <BottomNavGroup variant="solo">
        <BottomNavItem href="#/finance" icon={<Icon name="pieChart" />} variant="icon-only">
          Reports
        </BottomNavItem>
      </BottomNavGroup>
    </BottomNavigation>
  );
}

const categories: { title: string; spent: string; limit: string; icon: IconName }[] = [
  { title: 'Education', spent: '1 240 000', limit: '2 000 000', icon: 'file' },
  { title: 'Bank cards', spent: '2 100 000', limit: '3 000 000', icon: 'creditCard' },
  { title: 'Savings', spent: '900 000', limit: '1 500 000', icon: 'piggyBank' },
  { title: 'Transfers', spent: '365 000', limit: '1 000 000', icon: 'bank' },
];

function Budget() {
  const [month, setMonth] = useState('october');
  return (
    <>
      <AppBar
        title="Budget"
        actions={
          <>
            <Button variant="flat" size="xl" iconOnly startIcon={<Icon name="search" />}>
              Search
            </Button>
            <Avatar name={ME} size="s" />
          </>
        }
      />
      <div className="tpl-mobile-content tpl-fin-content">
        <section className="tpl-fin-card tpl-fin-budget" aria-label="Monthly budget">
          <div className="tpl-fin-budget__header">
            <span className="bek-text-body-m tpl-muted">Monthly budget</span>
            <Select
              size="s"
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="tpl-fin-budget__month"
            >
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
            </Select>
            <strong className="bek-text-headline-l tpl-fin-budget__amount">10 354 000 soʻm</strong>
          </div>
          <span className="bek-text-body-m tpl-muted">Monthly spending limit</span>
          <ProgressBar value={44} status="accent" aria-label="Monthly spending limit" />
          <div className="tpl-row tpl-between">
            <div className="tpl-stack-4">
              <span className="bek-text-caption-l tpl-muted">Spent</span>
              <span className="tpl-row">
                <span className="bek-text-body-m-strong">4 605 000 soʻm</span>
                <Badge variant="subtle" color="neutral" size="s">
                  44%
                </Badge>
              </span>
            </div>
            <div className="tpl-stack-4 tpl-fin-end">
              <span className="bek-text-caption-l tpl-muted">Remaining</span>
              <span className="bek-text-body-m-strong">5 749 000 soʻm</span>
            </div>
          </div>
          <Button variant="outline" size="xl">
            View details
          </Button>
        </section>
        <SectionHeader title="Categories" />
        <div className="tpl-fin-list">
          {categories.map((c) => (
            <ListItem
              key={c.title}
              href="#/finance"
              leading={<Icon name={c.icon} width={24} height={24} />}
              title={c.title}
              description={`${c.spent} of ${c.limit} soʻm`}
              chevron
            />
          ))}
        </div>
      </div>
      <TabBar />
    </>
  );
}

function Diagnostic({
  icon,
  status,
  title,
  value,
  caption,
}: {
  icon: IconName;
  status: string;
  title: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="tpl-fin-card tpl-fin-tile">
      <div className="tpl-row tpl-between">
        <Icon name={icon} width={20} height={20} className="tpl-fin-accent" />
        <Badge variant="subtle" color="success" size="s">
          {status}
        </Badge>
      </div>
      <span className="bek-text-body-m tpl-muted">{title}</span>
      <strong className="bek-text-headline-m">{value}</strong>
      <span className="bek-text-caption-l tpl-fin-tertiary">{caption}</span>
    </div>
  );
}

function CreditScore() {
  return (
    <>
      <header className="tpl-fin-header">
        <Avatar name={ME} size="m" />
        <h1 className="bek-text-title-m tpl-grow">Hello, Nurbek</h1>
        <Button variant="normal" size="l" iconOnly startIcon={<Icon name="creditCard" />}>
          Cards
        </Button>
        <Button variant="normal" size="l" iconOnly startIcon={<Icon name="settings" />}>
          Settings
        </Button>
      </header>
      <div className="tpl-mobile-content tpl-fin-content tpl-fin-content--loose">
        <section className="tpl-fin-score" aria-label="Credit score">
          <span className="bek-text-caption-l tpl-muted">CREDIT SCORE</span>
          <strong className="bek-text-display-l">782</strong>
          <Badge variant="subtle" color="success">
            +14 points
          </Badge>
          <div className="tpl-fin-range">
            <span className="bek-text-caption-l tpl-muted">300</span>
            <ProgressBar
              value={482}
              max={550}
              status="accent"
              aria-label="Credit score from 300 to 850"
              aria-valuetext="782"
              className="tpl-grow"
            />
            <span className="bek-text-caption-l tpl-muted">850</span>
          </div>
        </section>
        <section className="tpl-stack-12">
          <SectionHeader title="Next steps" />
          <div className="tpl-fin-card tpl-fin-card--s">
            <Steps aria-label="Next steps">
              <StepsItem
                status="complete"
                title="Credit card paid off"
                description="Completed 12 Oct"
              />
              <StepsItem
                status="current"
                title="Keep utilization under 5%"
                description="Projected impact: +8 points"
              />
              <StepsItem
                status="upcoming"
                title="Account aging"
                description="Reaches a 5-year average next month"
              />
            </Steps>
          </div>
        </section>
        <section className="tpl-stack-12">
          <SectionHeader title="Diagnostics" link={false} />
          <div className="tpl-grid-2 tpl-fin-tiles">
            <Diagnostic
              icon="creditCard"
              status="Optimal"
              title="Credit utilization"
              value="4%"
              caption="of 25 000 000 soʻm limit"
            />
            <Diagnostic
              icon="file"
              status="Excellent"
              title="On-time payments"
              value="100%"
              caption="36 of 36 payments"
            />
          </div>
        </section>
      </div>
      <TabBar />
    </>
  );
}

function PaymentBar({ label, value }: { label: string; value: string }) {
  return (
    <div className="tpl-row tpl-between">
      <span className="bek-text-caption-l tpl-muted">{label}</span>
      <span className="bek-text-caption-l tpl-muted">{value}</span>
    </div>
  );
}

function ConfirmPayment() {
  return (
    <>
      <AppBar title="Confirm payment" onBack={back} actions={<Avatar name={ME} size="s" />} />
      <div className="tpl-mobile-content tpl-fin-content tpl-fin-content--loose">
        <div className="tpl-fin-parties">
          <div className="tpl-fin-card tpl-fin-card--s tpl-fin-party">
            <PaymentBar label="Pay with" value="Balance" />
            <div className="tpl-fin-party__values">
              <Icon name="wallet" width={20} height={20} className="tpl-fin-accent" />
              <span className="bek-text-body-m tpl-grow">BEK Wallet</span>
              <strong className="bek-text-title-m">4 920 100 soʻm</strong>
            </div>
          </div>
          <div className="tpl-fin-card tpl-fin-card--s tpl-fin-party">
            <PaymentBar label="Pay to" value="Amount" />
            <div className="tpl-fin-party__values">
              <Avatar name="UX Foundations" size="s" />
              <span className="bek-text-body-m tpl-grow">BEK Academy</span>
              <strong className="bek-text-title-m">185 000 soʻm</strong>
            </div>
          </div>
        </div>
        <div className="tpl-fin-summary">
          <strong className="bek-text-display-s">185 000 soʻm</strong>
          <span className="bek-text-caption-l tpl-muted">
            Course 180 000 + service fee 5 000 soʻm
          </span>
          <span className="bek-text-body-m tpl-muted">
            for the course “UX Foundations” · 12 lessons
          </span>
        </div>
        <InfoWrap icon={<Icon name="truck" />} title="Pay in 4 parts" onInfo={() => undefined}>
          Split this payment with BEK Split — 46 250 soʻm a month, no fees
        </InfoWrap>
      </div>
      <FloatingActions
        position="sticky"
        layout="vertical"
        primary={{ label: 'Confirm and pay' }}
        secondary={{ label: 'Cancel', onClick: back }}
        legal="By paying you agree to the BEK Academy Terms"
      />
    </>
  );
}

const methods: { value: string; title: string; description: string; icon: IconName }[] = [
  { value: 'wallet', title: 'BEK Wallet', description: 'Instant, no fee', icon: 'wallet' },
  { value: 'uzcard', title: 'Uzcard ·· 4821', description: 'Fee 0.5%', icon: 'creditCard' },
  { value: 'bank', title: 'Bank transfer', description: '1–2 business days', icon: 'bank' },
  {
    value: 'split',
    title: 'BEK Split',
    description: '4 parts · 46 250 soʻm a month',
    icon: 'piggyBank',
  },
];

function PaymentMethod() {
  const [method, setMethod] = useState('wallet');
  const titleId = useId();
  const selected = methods.find((m) => m.value === method) ?? methods[0];
  return (
    <>
      <AppBar title="Payment method" onBack={back} actions={<Avatar name={ME} size="s" />} />
      <div className="tpl-mobile-content tpl-fin-content tpl-fin-content--tight">
        <div className="tpl-fin-balance">
          <span className="bek-text-caption-l tpl-muted">Available balance</span>
          <strong className="bek-text-headline-m">4 920 100 soʻm</strong>
        </div>
        <h2 id={titleId} className="bek-text-title-s">
          Choose how to pay
        </h2>
        <SelectorGroup name="payment-method" role="radiogroup" aria-labelledby={titleId}>
          {methods.map((m) => (
            <SelectorCard
              key={m.value}
              value={m.value}
              icon={<Icon name={m.icon} />}
              title={m.title}
              description={m.description}
              checked={method === m.value}
              onChange={() => setMethod(m.value)}
            />
          ))}
        </SelectorGroup>
        <Button
          variant="flat"
          size="l"
          startIcon={<Icon name="creditCardAdd" />}
          className="tpl-fin-start"
        >
          Add a new card
        </Button>
      </div>
      <FloatingActions position="sticky" primary={{ label: `Pay with ${selected.title}` }} />
    </>
  );
}

function Service({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: IconName;
}) {
  return (
    <div className="tpl-fin-card tpl-fin-card--s tpl-fin-service">
      <h3 className="bek-text-title-m">{title}</h3>
      <p className="bek-text-body-s tpl-muted">{description}</p>
      <div className="tpl-fin-slot" aria-hidden="true">
        <Icon name={icon} width={32} height={32} />
      </div>
    </div>
  );
}

function SplitPromo() {
  return (
    <>
      <AppBar title="BEK Split" onBack={back} actions={<Avatar name={ME} size="s" />} />
      <div className="tpl-mobile-content tpl-fin-content">
        <div className="tpl-stack-8 tpl-fin-hero">
          <h2 className="bek-text-headline-m">Pay in 4 parts — with no overpayment</h2>
          <p className="bek-text-body-m tpl-muted">
            Start learning today and spread the cost over 4 months. No interest, no fees.
          </p>
        </div>
        <div className="tpl-grid-2 tpl-fin-services">
          <Service title="Courses" description="Pay zero on the day you enrol" icon="file" />
          <Service title="Market" description="Split big purchases" icon="creditCard" />
          <Service title="Certification" description="REVO exams in 4 parts" icon="wallet" />
          <Service title="Savings" description="Grow a study fund" icon="piggyBank" />
        </div>
      </div>
      <FloatingActions
        position="sticky"
        info={
          <InfoWrap icon={<Icon name="truck" />} onInfo={() => undefined}>
            Up to 12 000 000 soʻm available
          </InfoWrap>
        }
        primary={{ label: 'Activate BEK Split' }}
      />
    </>
  );
}

/** `actions` — Floating action container ekrani: Home indicator panel ustida (Figma'dagidek). */
function FinancePhone({
  label,
  actions = false,
  children,
}: {
  label: string;
  actions?: boolean;
  children: ReactNode;
}) {
  const className = actions ? 'tpl-fin-phone tpl-fin-phone--actions' : 'tpl-fin-phone';
  return (
    <Phone label={label} className={className}>
      {children}
    </Phone>
  );
}

/** Figma "8.5 Finance (Mobile)": Budget, Credit score, Confirm payment, Payment method va Split promo. */
export function Finance() {
  return (
    <div className="tpl-phones">
      <FinancePhone label="Budget">
        <Budget />
      </FinancePhone>
      <FinancePhone label="Credit score">
        <CreditScore />
      </FinancePhone>
      <FinancePhone label="Confirm payment" actions>
        <ConfirmPayment />
      </FinancePhone>
      <FinancePhone label="Payment method" actions>
        <PaymentMethod />
      </FinancePhone>
      <FinancePhone label="Split promo" actions>
        <SplitPromo />
      </FinancePhone>
    </div>
  );
}
