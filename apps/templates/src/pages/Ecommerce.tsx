import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Badge,
  BekLogo,
  BottomNavGroup,
  BottomNavigation,
  BottomNavItem,
  Button,
  Carousel,
  CheckoutBar,
  Chip,
  InfoWrap,
  Price,
  ProductCard,
  Rating,
  SearchField,
  Stepper,
  TextField,
  TopNavigation,
} from '@bek-ui/react';
import { Icon } from '../icons';
import { Phone, Placeholder } from '../Phone';

const image = <Placeholder ratio="1" icon={<Icon name="image" width={28} height={28} />} />;

function HeaderActions({ count = 3 }: { count?: number }) {
  return (
    <>
      <Button variant="flat" size="xl" iconOnly startIcon={<Icon name="heart" />}>
        Favourites
      </Button>
      <span className="tpl-badge-wrap">
        <Button variant="flat" size="xl" iconOnly startIcon={<Icon name="bell" />}>
          Notifications
        </Button>
        <Badge color="danger" size="s" className="tpl-badge-wrap__count">
          {count}
        </Badge>
      </span>
    </>
  );
}

function Home() {
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const add = (id: string) => setCart({ ...cart, [id]: 1 });
  const change = (id: string) => (quantity: number) => setCart({ ...cart, [id]: quantity });
  return (
    <>
      <div className="tpl-mobile-bar">
        <BekLogo size="s" />
        <div className="tpl-row">
          <HeaderActions />
        </div>
      </div>
      <div className="tpl-mobile-content">
        <SearchField size="s" placeholder="Search UI kits, icons or templates" />
        <div className="tpl-row tpl-scroll-x">
          {['All', 'UI kits', 'Icons', 'Templates'].map((label) => (
            <Chip key={label} selected={filter === label} onClick={() => setFilter(label)}>
              {label}
            </Chip>
          ))}
        </div>
        <div className="tpl-promo" data-theme="dark">
          <strong className="tpl-h3">Autumn sale — 40% off</strong>
          <span className="tpl-small">On all UI kits and templates. Until 24 September.</span>
          <Button
            variant="normal-contrast"
            endIcon={<Icon name="arrowUp" style={{ rotate: '90deg' }} />}
          >
            View
          </Button>
        </div>
        <div className="tpl-section-header">
          <h2 className="tpl-h3">Popular</h2>
          <Button variant="flat">All</Button>
        </div>
        <div className="tpl-grid-2">
          {[
            { id: 'dash', title: 'Dashboard UI Kit', amount: 490000, old: 790000, badge: 'New' },
            { id: 'icons', title: 'Icon set · 2,400', amount: 190000 },
            {
              id: 'land',
              title: 'Landing page templates',
              amount: 360000,
              old: 560000,
              badge: '−36%',
            },
            { id: 'mob', title: 'Mobile components', amount: 490000 },
          ].map((p) => (
            <ProductCard
              key={p.id}
              image={image}
              title={p.title}
              badge={
                p.badge && (
                  <Badge color="accent" size="s">
                    {p.badge}
                  </Badge>
                )
              }
              price={
                <Price
                  locale="uz-UZ"
                  amount={p.amount}
                  oldAmount={p.old}
                  currency="soʻm"
                  layout="stacked"
                />
              }
              quantity={cart[p.id] ?? 0}
              onAdd={() => add(p.id)}
              onQuantityChange={change(p.id)}
            />
          ))}
        </div>
        <div className="tpl-section-header">
          <h2 className="tpl-h3">New arrivals</h2>
          <Button variant="flat">All</Button>
        </div>
        <ProductCard
          layout="horizontal"
          image={image}
          title="Figma automation plugins"
          description="12 plugins · updated"
          price={<Price locale="uz-UZ" amount={190000} currency="soʻm" />}
          onAdd={() => add('plugins')}
          quantity={cart.plugins ?? 0}
          onQuantityChange={change('plugins')}
        />
        <ProductCard
          layout="horizontal"
          image={image}
          title="Mockup set · 80 scenes"
          description="In PSD and Figma formats"
          price={<Price locale="uz-UZ" amount={310000} currency="soʻm" />}
          onAdd={() => add('mockups')}
          quantity={cart.mockups ?? 0}
          onQuantityChange={change('mockups')}
        />
      </div>
      <BottomNavigation>
        <BottomNavGroup variant="dual">
          <BottomNavItem icon={<Icon name="home" />} selected>
            Shop
          </BottomNavItem>
          <BottomNavItem icon={<Icon name="search" />}>Search</BottomNavItem>
        </BottomNavGroup>
        <BottomNavGroup variant="solo">
          <BottomNavItem variant="icon-only" icon={<Icon name="bag" />}>
            Basket
          </BottomNavItem>
        </BottomNavGroup>
      </BottomNavigation>
    </>
  );
}

function Product() {
  const [seats, setSeats] = useState(1);
  const [licence, setLicence] = useState('Figma');
  return (
    <>
      <TopNavigation title="Dashboard UI Kit" actions={<HeaderActions />} />
      <Carousel aria-label="Product previews" controls="dots" placement="below">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="tpl-slide">
            <span>Preview {n} of 5</span>
            <span className="tpl-caption tpl-muted">Dashboard · Light</span>
          </div>
        ))}
      </Carousel>
      <div className="tpl-mobile-content">
        <div className="tpl-stack-4">
          <h1 className="tpl-h2">Dashboard UI Kit</h1>
          <span className="tpl-muted tpl-small">
            120 screens · Figma and React · Light and Dark
          </span>
          <Rating value={4.8} size="s" showScore count="(312 reviews)" />
        </div>
        <Price
          amount={490000}
          oldAmount={790000}
          discount="−38%"
          currency="soʻm"
          size="l"
          note="One-time payment · lifetime updates"
        />
        <div className="tpl-row">
          {['Figma', 'React', 'Team licence'].map((label) => (
            <Chip
              key={label}
              size="s"
              selected={licence === label}
              onClick={() => setLicence(label)}
            >
              {label}
            </Chip>
          ))}
        </div>
        <p className="tpl-small tpl-muted">
          A complete dashboard kit built on BEK tokens: charts, tables, filters and settings screens
          for web, tablet and mobile. Every screen ships in Light and Dark.
        </p>
        <div className="tpl-row tpl-between">
          <div>
            <div className="tpl-strong tpl-small">Seats</div>
            <div className="tpl-caption tpl-muted">One seat per designer</div>
          </div>
          <Stepper value={seats} onChange={setSeats} min={1} aria-label="Seats" />
        </div>
        <Accordion>
          <AccordionItem title="What's included" open>
            120 screens, 640 components, auto layout everywhere, variables for Light and Dark.
          </AccordionItem>
          <AccordionItem title="Licence">
            One project per seat, commercial use allowed.
          </AccordionItem>
          <AccordionItem title="Updates and support">
            Lifetime updates and email support.
          </AccordionItem>
          <AccordionItem title="Reviews · 312">4.8 average from verified buyers.</AccordionItem>
        </Accordion>
      </div>
      <CheckoutBar
        action={{ label: `Add to basket · ${(490000 * seats).toLocaleString('uz-UZ')} soʻm` }}
      />
    </>
  );
}

function Basket() {
  const [items, setItems] = useState([
    {
      id: 'dash',
      title: 'Dashboard UI Kit',
      meta: 'Figma · 1 seat',
      amount: 490000,
      old: 790000,
      q: 1,
    },
    { id: 'icons', title: 'Icon set · 2,400', meta: 'SVG and Figma', amount: 190000, q: 1 },
    { id: 'mob', title: 'Mobile components', meta: 'Figma · 2 seats', amount: 490000, q: 2 },
  ]);
  const subtotal = items.reduce((sum, i) => sum + i.amount * i.q, 0);
  const fmt = (n: number) => `${n.toLocaleString('uz-UZ')} soʻm`;
  return (
    <>
      <TopNavigation title={`Basket · ${items.length}`} />
      <div className="tpl-mobile-content">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            layout="horizontal"
            image={image}
            title={item.title}
            description={item.meta}
            price={
              <Price
                locale="uz-UZ"
                amount={item.amount}
                oldAmount={item.old}
                currency="soʻm"
                layout="stacked"
              />
            }
            quantity={item.q}
            onQuantityChange={(q) =>
              setItems(
                q === 0
                  ? items.filter((i) => i.id !== item.id)
                  : items.map((i) => (i.id === item.id ? { ...i, q } : i)),
              )
            }
          />
        ))}
        <div className="tpl-row">
          <TextField placeholder="Promo code" aria-label="Promo code" className="tpl-grow" />
          <Button variant="normal" size="xl">
            Apply
          </Button>
        </div>
        <InfoWrap emphasis title="Licences arrive by email" icon={<Icon name="info" />}>
          Download links and licence keys are sent right after payment.
        </InfoWrap>
        <dl className="tpl-summary">
          <div>
            <dt>Subtotal</dt>
            <dd>{fmt(subtotal)}</dd>
          </div>
          <div>
            <dt>Discount</dt>
            <dd className="tpl-success">− 300 000 soʻm</dd>
          </div>
          <div>
            <dt>VAT (12%)</dt>
            <dd>Included</dd>
          </div>
          <div className="tpl-summary__total">
            <dt>Total</dt>
            <dd>{fmt(Math.max(0, subtotal - 300000))}</dd>
          </div>
        </dl>
      </div>
      <CheckoutBar
        type="checkout"
        total={fmt(Math.max(0, subtotal - 300000))}
        action={{ label: 'Checkout' }}
        legal="By tapping Checkout you agree to the Terms of use"
      />
    </>
  );
}

/** Figma "8.2 E-commerce (Mobile)": Home, Product va Basket ekranlari. */
export function Ecommerce() {
  return (
    <div className="tpl-phones">
      <Phone label="Shop">
        <Home />
      </Phone>
      <Phone label="Product">
        <Product />
      </Phone>
      <Phone label="Basket">
        <Basket />
      </Phone>
    </div>
  );
}
