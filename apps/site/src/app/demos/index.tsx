import React, { useState, type ComponentType } from 'react';
import {
  Accordion,
  AccordionItem,
  Alert,
  AlertDialog,
  AppBar,
  Avatar,
  Badge,
  BaseSelector,
  BekLogo,
  BottomNavGroup,
  BottomNavItem,
  BottomNavigation,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  CartPill,
  Checkbox,
  CheckboxField,
  CheckoutBar,
  Chip,
  CodeInput,
  ControlGroup,
  DatePicker,
  DescriptionList,
  DescriptionListItem,
  Divider,
  DropdownMenu,
  EmptyState,
  FacetPanel,
  Fieldset,
  HomeIndicator,
  Icon,
  Keyboard,
  InfoWrap,
  Link,
  ListItem,
  LoadMore,
  Loader,
  Mascot,
  MascotMessage,
  MenuItem,
  MenuSeparator,
  Modal,
  NavGroup,
  NavItem,
  NotificationBar,
  OrderWidget,
  Pagination,
  Pattern,
  Pinpad,
  Popover,
  Price,
  ProductCard,
  ProgressBar,
  Radio,
  RangeSlider,
  Rating,
  SearchField,
  SearchResultRow,
  SearchSuggestionGroup,
  SearchSuggestions,
  SegmentedControl,
  Select,
  ScrubField,
  SelectorCard,
  SelectorGroup,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  StatusBar,
  Stepper,
  Steps,
  StepsItem,
  Switch,
  SwitchField,
  Tab,
  TabList,
  TabPanel,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  Tabs,
  Tag,
  TextField,
  Textarea,
  TimeSlotPicker,
  Toast,
  ToastViewport,
  Tooltip,
  TooltipCallout,
  TopNavigation,
  useSearchSuggestions,
  type FacetValue,
  DropZone,
  FileUploader,
  FloatingActions,
  MediaUploader,
  ScrollArea,
} from '@bek-ui/react';
import type { FileRejection, UploaderFile } from '@bek-ui/react';
import {
  ChevronRight,
  Download,
  Edit3,
  Flame,
  Heart,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import { chartDemos } from './charts';
import { backgroundDemos } from './backgrounds';

// Jonli namunalar — har komponent papkasi (dir) uchun bitta demo. README'dagi misollar asosida.
// Yangi komponent qo'shilganda shu ro'yxatga demo qo'shing; bo'lmasa katalog "Namuna tez orada" ko'rsatadi.

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);
const Col = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 w-full max-w-sm">{children}</div>
);
const Photo = ({ label = 'Rasm' }: { label?: string }) => (
  <div
    aria-hidden="true"
    style={{
      display: 'grid',
      placeItems: 'center',
      width: '100%',
      height: '100%',
      minHeight: 96,
      background: 'var(--bek-fill-tertiary)',
      color: 'var(--bek-text-tertiary)',
      fontSize: 'var(--bek-type-caption-md-size)',
    }}
  >
    {label}
  </div>
);

export const demos: Record<string, ComponentType> = {
  ...chartDemos,
  // @bek-ui/backgrounds — o'yin maydonchalari (ControlGroup + ScrubField / SwitchField / Select).
  ...backgroundDemos,
  accordion: () => (
    <Col>
      <Accordion>
        <AccordionItem title="Yetkazib berish" description="Toshkent bo'ylab">
          100 000 soʻmdan bepul, 2 soat ichida.
        </AccordionItem>
        <AccordionItem title="Qaytarish">14 kun ichida, chek bilan.</AccordionItem>
        <AccordionItem title="To'lov" badge={<Badge size="s" variant="subtle" color="accent">Yangi</Badge>}>
          Karta, naqd yoki bo'lib to'lash.
        </AccordionItem>
      </Accordion>
    </Col>
  ),
  alert: () => (
    <Col>
      <Alert tone="danger" title="To'lov amalga oshmadi" primaryAction={{ label: 'Qayta urinish' }} secondaryAction={{ label: 'Keyinroq' }} onClose={() => {}}>
        Karta rad etildi. Boshqa karta bilan urinib ko'ring.
      </Alert>
      <Alert variant="solid" tone="warning" layout="stacked" title="Balans kam">
        Davom etish uchun hisobni to'ldiring.
      </Alert>
    </Col>
  ),
  'app-bar': () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <AppBar title="Buyurtmalar" onBack={() => {}} actions={<Button variant="flat" size="xl" iconOnly startIcon={<Heart size={20} />}>Sevimlilar</Button>} />
      <AppBar scrolled title="Buyurtmalar" onBack={() => {}} />
      <AppBar variant="search" title="Katalog" onBack={() => {}} search={{ 'aria-label': 'Katalogdan qidirish', placeholder: 'Qidirish' }} />
    </div>
  ),
  avatar: () => (
    <Row>
      <Avatar name="Nurbek Nurxonov" status="online" />
      <Avatar name="Nurbek Nurxonov" size="s" />
      <Avatar size="l" />
      <Avatar name="Aziza Karimova" size="xl" status="busy" />
    </Row>
  ),
  badge: () => (
    <Row>
      <Badge>Label</Badge>
      <Badge variant="subtle" color="success" dot>
        Faol
      </Badge>
      <Badge variant="outline" color="danger" size="s">
        Muddati o'tgan
      </Badge>
      <Badge color="accent" size="l">
        Yangi
      </Badge>
    </Row>
  ),
  'base-selector': () => {
    const [v, setV] = useState('classic');
    return (
      <div className="w-full max-w-xs">
        <BaseSelector
          aria-label="Xamir"
          value={v}
          onChange={setV}
          options={[
            { value: 'classic', label: 'Klassik', image: <Photo label="🍕" /> },
            { value: 'thin', label: 'Yupqa', image: <Photo label="🫓" /> },
            { value: 'cheese', label: 'Pishloqli', image: <Photo label="🧀" /> },
          ]}
        />
      </div>
    );
  },
  'bottom-navigation': () => (
    <div className="w-full max-w-sm">
      <BottomNavigation>
        <BottomNavGroup variant="dual">
          <BottomNavItem href="#/" icon={<Home size={24} />} selected>
            Asosiy
          </BottomNavItem>
          <BottomNavItem href="#/components" icon={<Search size={24} />}>
            Qidiruv
          </BottomNavItem>
        </BottomNavGroup>
        <BottomNavGroup variant="solo">
          <BottomNavItem href="#/tokens" variant="icon-only" icon={<ShoppingBag size={24} />}>
            Savat
          </BottomNavItem>
        </BottomNavGroup>
      </BottomNavigation>
    </div>
  ),
  breadcrumb: () => {
    const items = [
      { label: 'Bosh sahifa', href: '#/', icon: <Home size={16} /> },
      { label: 'Katalog', href: '#/components' },
      { label: 'Telefonlar', href: '#/components' },
      { label: 'iPhone 16' },
    ];
    return (
      <Col>
        <Breadcrumb items={items} />
        <Breadcrumb items={items} layout="collapsed" onOverflowClick={() => {}} />
        <Breadcrumb items={items} layout="back" />
      </Col>
    );
  },
  button: () => (
    <Row>
      <Button variant="action">Saqlash</Button>
      <Button>Bekor qilish</Button>
      <Button variant="outline-danger" size="l" startIcon={<Trash2 size={20} />}>
        O'chirish
      </Button>
      <Button variant="flat" startIcon={<Download size={16} />}>
        Yuklab olish
      </Button>
      <Button loading>Saqlanmoqda</Button>
      <Button variant="flat" iconOnly startIcon={<Settings size={16} />}>
        Sozlamalar
      </Button>
    </Row>
  ),
  card: () => (
    <div className="w-full max-w-sm">
      <Card
        title="To'lov"
        description="Visa · 4421"
        badge={
          <Badge variant="subtle" color="success" size="s">
            To'langan
          </Badge>
        }
        footer={
          <>
            <Button variant="action">Tasdiqlash</Button>
            <Button variant="outline">Bekor</Button>
          </>
        }
      >
        Buyurtma №4821 · 149 000 soʻm · 12 oktabr
      </Card>
    </div>
  ),
  carousel: () => (
    <div className="w-full max-w-sm">
      <Carousel aria-label="Aksiyalar" peek>
        <Photo label="Pitsa −20%" />
        <Photo label="Bepul yetkazish" />
        <Photo label="Yangi menyu" />
      </Carousel>
    </div>
  ),
  checkbox: () => {
    const [all, setAll] = useState(false);
    const [some, setSome] = useState(true);
    return (
      <Col>
        <Checkbox checked={all} indeterminate={some && !all} onChange={() => { setAll(!all); setSome(false); }}>
          Hammasi
        </Checkbox>
        <Checkbox defaultChecked>Shartlarga roziman</Checkbox>
        <Checkbox disabled>O'chirilgan</Checkbox>
      </Col>
    );
  },
  'checkbox-field': () => {
    const [remember, setRemember] = useState(false);
    return (
      <Col>
        <CheckboxField
          label="Bu qurilmani eslab qolish"
          description="30 kun davomida bu brauzerda kod so'ralmaydi"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <CheckboxField label="Yangiliklarni emailga yuborish" />
        <CheckboxField label="Yashirin qatlamlarni ko'rsatish" size="s" controlPosition="end" defaultChecked />
        <CheckboxField label="O'chirilgan" disabled />
      </Col>
    );
  },
  'checkout-bar': () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <CheckoutBar info={<InfoWrap icon={<Truck size={20} />}>200 000 soʻmdan bepul yetkazish</InfoWrap>} action={{ label: 'Savatga · 147 000 soʻm' }} />
      <CheckoutBar type="checkout" total="159 000 soʻm" action={{ label: "To'lash" }} legal="To'lash tugmasini bosib shartlarga rozilik bildirasiz" />
      <CartPill icon={<ShoppingBag size={20} />} label="Savat · 3 ta" total="147 000 soʻm" />
    </div>
  ),
  chip: () => {
    const [vegan, setVegan] = useState(true);
    return (
      <Row>
        <Chip selected={vegan} onClick={() => setVegan(!vegan)} count={12}>
          Vegan
        </Chip>
        <Chip>Achchiq</Chip>
        <Chip size="m" selected>
          Yangi
        </Chip>
        <Chip variant="input" onRemove={() => {}}>
          Toshkent
        </Chip>
        <Chip disabled>Tugadi</Chip>
      </Row>
    );
  },
  'control-group': () => (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <ControlGroup title="Harakat">
        <ScrubField label="Tezlik" defaultValue={1.75} min={0.25} max={4} step={0.05} unit="×" />
        <ScrubField label="Kadr oralig'i" defaultValue={134} max={500} unit="ms" />
        <ScrubField label="Iz davomiyligi" defaultValue={94} unit="%" />
        <SwitchField label="Kursor yoritilishi" defaultChecked />
      </ControlGroup>
      <ControlGroup title="Kursor" density="compact">
        <ScrubField label="Yorqinlik" defaultValue={100} unit="%" />
        <ScrubField label="Radius" defaultValue={122} max={400} unit="px" />
        <ScrubField label="Yoritish davomiyligi" defaultValue={64} unit="%" />
        <SwitchField label="Harakatni kamaytirish" />
      </ControlGroup>
    </div>
  ),
  'date-picker': () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="w-full max-w-sm">
        <DatePicker value={date} onChange={setDate} locale="uz" />
      </div>
    );
  },
  'description-list': () => (
    <div className="w-full max-w-sm">
      <DescriptionList title="Buyurtmangiz" total={{ term: 'Jami', value: '149 000 soʻm' }}>
        <DescriptionListItem term="BEK Pro, 1 oy">99 000 soʻm</DescriptionListItem>
        <DescriptionListItem term="Jamoa o'rinlari × 2">60 000 soʻm</DescriptionListItem>
        <DescriptionListItem term="Promo BEK15">−10 000 soʻm</DescriptionListItem>
        <DescriptionListItem term="Yetkazib berish" hint="200 000 dan oshsa bepul" leader>
          Bepul
        </DescriptionListItem>
      </DescriptionList>
    </div>
  ),
  divider: () => (
    <Col>
      <span>Yuqori</span>
      <Divider />
      <span>Pastki</span>
    </Col>
  ),
  'empty-state': () => (
    <EmptyState
      size="s"
      media={<Photo label="🐾" />}
      title="Hali hech narsa yo'q"
      description="Biror narsa qo'shsangiz, shu yerda ko'rinadi."
      primaryAction={{ label: "Qo'shish" }}
      secondaryAction={{ label: "Ko'proq bilish" }}
    />
  ),
  'facet-panel': () => {
    const facets = [
      {
        id: 'type',
        label: 'Turi',
        options: [
          { value: 'symbol-text', label: 'Belgi va matn', count: 661 },
          { value: 'wordmark', label: 'Yozuv', count: 428 },
          { value: 'symbol', label: 'Belgi', count: 118 },
          { value: 'animated', label: 'Animatsiyali', count: 111 },
          { value: 'app-icon', label: 'Ilova ikonkasi', count: 1 },
        ],
      },
      {
        id: 'industry',
        label: 'Soha',
        options: [
          { value: 'finance', label: 'Moliya', count: 312 },
          { value: 'education', label: "Ta'lim", count: 204 },
          { value: 'retail', label: 'Savdo', count: 98 },
        ],
      },
      { id: 'style', label: 'Uslub', options: [{ value: 'flat', label: 'Tekis', count: 540 }, { value: 'line', label: 'Chiziqli', count: 233 }] },
    ];
    const [filters, setFilters] = useState<FacetValue>({ type: ['symbol-text', 'wordmark'] });
    const total = Object.values(filters).reduce((n, v) => n + v.length, 0);
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <FacetPanel
          facets={facets}
          value={filters}
          onChange={setFilters}
          title="Filtrlar"
          clearAllLabel="Hammasini tozalash"
          summary={`${total} ta filtr · 1 089 natija`}
          resultsLabel="Natijalarni ko'rsatish"
          selectedCountLabel={(n) => `${n} ta tanlangan`}
        />
        <div className="w-full max-w-sm">
          <FacetPanel
            device="mobile"
            facets={facets.slice(0, 2)}
            value={filters}
            onChange={setFilters}
            title="Filtrlar"
            clearAllLabel="Tozalash"
            resultsLabel="1 089 natijani ko'rsatish"
          />
        </div>
      </div>
    );
  },
  fieldset: () => {
    const [v, setV] = useState('courier');
    return (
      <Col>
        <Fieldset label="Yetkazib berish" message="Kuryer 2 soat ichida yetib keladi">
          <SegmentedControl
            aria-label="Yetkazib berish"
            value={v}
            onChange={setV}
            options={[
              { value: 'courier', label: 'Kuryer' },
              { value: 'pickup', label: 'Olib ketish' },
            ]}
          />
        </Fieldset>
        <Fieldset label="Shartnoma" status="error" message="Davom etish uchun shartlarni qabul qiling">
          <Checkbox>Foydalanish shartlarini qabul qilaman</Checkbox>
        </Fieldset>
        <Fieldset label="Promo-kod" optional hint="Chek yoki xabardagi kod" status="success" message="−15% qo'llandi">
          <Chip selected>BEK15</Chip>
        </Fieldset>
      </Col>
    );
  },
  icon: () => (
    <Row>
      <Icon size={16}>
        <Search />
      </Icon>
      <Icon size={20}>
        <Search />
      </Icon>
      <Icon size={24} label="Qidirish">
        <Search />
      </Icon>
    </Row>
  ),
  'info-wrap': () => (
    <Col>
      <InfoWrap icon={<Truck size={20} />}>200 000 soʻmdan yetkazish bepul</InfoWrap>
      <InfoWrap emphasis title="Bepul yetkazish" onInfo={() => {}}>
        200 000 soʻmdan
      </InfoWrap>
    </Col>
  ),
  link: () => (
    <Col>
      <p>
        To'lov bilan siz <Link href="#/docs">oferta shartlarini</Link> qabul qilasiz.
      </p>
      <Link href="#/components" variant="accent" size="m" endIcon={<ChevronRight />}>
        Hammasini ko'rish
      </Link>
      <Link href="#/components" variant="neutral" size="l">
        Figma UI kit, 2026
      </Link>
      <Link href="#/docs" variant="subtle">
        Maxfiylik siyosati
      </Link>
    </Col>
  ),
  'list-item': () => {
    const [wifi, setWifi] = useState(true);
    return (
      <Col>
        <ListItem leading={<Avatar name="Nurbek" />} title="Nurbek" description="Dizayner" chevron href="#/components/avatar" />
        <ListItem title="Wi-Fi" trailing={<Switch checked={wifi} onChange={(e) => setWifi(e.target.checked)} aria-label="Wi-Fi" />} />
        <ListItem title="Oʻzbek" selected onClick={() => {}} />
      </Col>
    );
  },
  loader: () => (
    <Row>
      <Loader size={16} />
      <Loader />
      <Loader size={40} label="Buyurtmalar yuklanmoqda" />
      <Loader value={0.6} />
    </Row>
  ),
  logo: () => (
    <Row>
      <BekLogo product="Design System" />
      <BekLogo product="Academy" size="m" />
      <BekLogo variant="mark" size="l" />
      <BekLogo color="mono" />
    </Row>
  ),
  navigation: () => (
    <div style={{ width: 240 }}>
      <NavGroup title="Ish maydoni">
        <NavItem icon={<LayoutGrid size={20} />} href="#/" selected>
          Boshqaruv paneli
        </NavItem>
        <NavItem icon={<ShoppingBag size={20} />} href="#/components" badge={<Badge size="s" color="accent">3</Badge>}>
          Buyurtmalar
        </NavItem>
        <NavItem icon={<Settings size={20} />} href="#/tokens">
          Sozlamalar
        </NavItem>
      </NavGroup>
    </div>
  ),
  'notification-bar': () => (
    <Col>
      <NotificationBar tone="success" action={{ label: 'Bekor qilish' }}>
        Savatga qo'shildi
      </NotificationBar>
      <NotificationBar tone="info">Havola nusxalandi</NotificationBar>
    </Col>
  ),
  'order-widget': () => (
    <div className="w-full max-w-sm">
      <OrderWidget
        status="preparing"
        size="expanded"
        icon={<Flame size={24} />}
        title="Buyurtmangiz tayyorlanmoqda"
        subtitle="Taxminan 12 daqiqa"
        href="#/components/order-widget"
        stageLabels={['Qabul qilindi', 'Tayyorlanmoqda', "Yo'lda", 'Yetkazildi']}
        progressLabel="Buyurtma holati"
      />
    </div>
  ),
  overlay: () => {
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    return (
      <Row>
        <Button variant="action" onClick={() => setOpen(true)}>
          Modal ochish
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Profilni tahrirlash" description="O'zgarishlar darhol saqlanadi." primaryAction={{ label: 'Saqlash', onClick: () => setOpen(false) }} cancelAction={{ label: 'Bekor qilish' }}>
          <TextField label="Ism" defaultValue="Nurbek" />
        </Modal>
        <Button variant="outline-danger" onClick={() => setConfirm(true)}>
          O'chirish…
        </Button>
        <AlertDialog open={confirm} onClose={() => setConfirm(false)} variant="danger" title="Ishonchingiz komilmi?" description="Buyurtma qaytarib bo'lmaydigan tarzda o'chiriladi." confirmAction={{ label: "O'chirish", onClick: () => setConfirm(false) }} cancelAction={{ label: 'Bekor qilish' }} />
        <DropdownMenu trigger={<Button variant="outline">Amallar</Button>} aria-label="Buyurtma amallari">
          <MenuItem icon={<Edit3 size={16} />} hotkey="⌘E">
            Tahrirlash
          </MenuItem>
          <MenuItem icon={<Share2 size={16} />}>Ulashish</MenuItem>
          <MenuSeparator />
          <MenuItem icon={<Trash2 size={16} />} danger>
            O'chirish
          </MenuItem>
        </DropdownMenu>
        <Popover trigger={<Button variant="flat">Popover</Button>} title="Yangi imkoniyat" description="Buyurtmani endi bir bosishda takrorlash mumkin." primaryAction={{ label: 'Tushunarli' }} />
      </Row>
    );
  },
  pagination: () => {
    const [page, setPage] = useState(3);
    return (
      <Col>
        <Pagination page={page} pageCount={52} onPageChange={setPage} summary="1–24 / 1 240" />
        <Pagination variant="compact" page={page} pageCount={52} onPageChange={setPage} />
        <LoadMore loaded={24} total={120} onLoadMore={() => {}} label="120 tadan 24 tasi ko'rsatildi" />
      </Col>
    );
  },
  pincode: () => {
    const [pin, setPin] = useState('12');
    return (
      <Col>
        <CodeInput value={pin} length={4} state={pin.length === 4 ? 'success' : 'typing'} helperText="PIN kiriting" aria-label="PIN" onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} />
        <Pinpad onDigit={(d) => setPin((p) => (p + d).slice(0, 4))} onClear={() => setPin((p) => p.slice(0, -1))} bottomLeft="face" />
      </Col>
    );
  },
  price: () => (
    <Row>
      <Price amount={4234000} currency="soʻm" locale="uz" />
      <Price amount="4 234 000" currency="soʻm" oldAmount="5 000 000" discount="−15%" layout="stacked" note="oyiga" size="l" />
    </Row>
  ),
  'product-card': () => {
    const [qty, setQty] = useState(0);
    return (
      <div className="w-full max-w-sm">
        <ProductCard
          image={<Photo label="🍕" />}
          title="Pepperoni"
          description="Pepperoni, mozzarella, tomat sousi"
          price={<Price amount={89000} currency="soʻm" locale="uz" />}
          badge="Yangi"
          quantity={qty}
          onAdd={() => setQty(1)}
          onQuantityChange={setQty}
          addLabel="Qo'shish"
        />
      </div>
    );
  },
  progress: () => (
    <Col>
      <ProgressBar value={62} max={100} label="Yuklanmoqda" showValue />
      <ProgressBar value={30} status="success" size="s" aria-label="Profil to'ldirilgan" />
      <ProgressBar value={80} status="danger" size="l" label="Xotira" showValue />
    </Col>
  ),
  radio: () => (
    <Col>
      <Radio name="plan" value="free" defaultChecked>
        Free
      </Radio>
      <Radio name="plan" value="pro">
        Pro
      </Radio>
      <Radio name="plan" value="team" disabled>
        Team
      </Radio>
    </Col>
  ),
  rating: () => (
    <Row>
      <Rating value={4.5} count="(1 245 sharh)" locale="uz" />
      <Rating value={4.8} variant="compact" size="s" />
      <Rating value={3} size="l" />
    </Row>
  ),
  'scrub-field': () => {
    const [speed, setSpeed] = useState(1.75);
    return (
      <Col>
        <ScrubField label="Tezlik" value={speed} onChange={setSpeed} min={0.25} max={4} step={0.05} unit="×" />
        <ScrubField label="Shaffoflik" defaultValue={64} unit="%" size="xs" />
        <ScrubField label="Radius" defaultValue={122} max={400} unit="px" size="s" />
        <ScrubField label="Yorqinlik" defaultValue={100} unit="%" size="l" />
        <ScrubField label="O'chirilgan" defaultValue={40} unit="%" disabled />
      </Col>
    );
  },
  'search-field': () => {
    const [q, setQ] = useState('');
    return (
      <Col>
        <SearchField aria-label="Mahsulot qidirish" placeholder="Mahsulot qidirish" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} onCancel={() => setQ('')} cancelLabel="Bekor qilish" />
        <SearchField aria-label="Katalog qidiruvi" variant="elevated" size="l" scope="All" shortcut="⌘K" onVoice={() => {}} voiceLabel="Ovozli qidiruv" onFilter={() => {}} filterLabel="Filtrlar" />
        <SearchField aria-label="Qidiruv (yuklanmoqda)" size="s" defaultValue="Pizza" loading loadingLabel="Yuklanmoqda" />
        <SearchField aria-label="Qidiruv (o'chirilgan)" size="s" disabled />
      </Col>
    );
  },
  'search-suggestions': () => {
    const all = ['Pizza margherita', 'Pizza delivery', 'Pizza four cheese', 'Pizzeria near me', 'Sushi near me', 'Lagman', 'Coffee beans'];
    const [q, setQ] = useState('');
    const [open, setOpen] = useState(false);
    const [recent, setRecent] = useState(['Pizza delivery', 'Sushi near me', 'Lagman', 'Coffee beans']);
    const nav = useSearchSuggestions({ open, onClose: () => setOpen(false) });
    const matches = q ? all.filter((s) => s.toLowerCase().includes(q.toLowerCase())) : [];
    const pick = (s: string) => {
      setQ(s);
      setOpen(false);
      setRecent((r) => [s, ...r.filter((x) => x !== s)].slice(0, 4));
    };
    return (
      <div className="flex flex-col gap-6 w-full max-w-xl">
        <div className="flex flex-col gap-2">
          <SearchField
            aria-label="Qidirish"
            placeholder="Qidirish (masalan, piz)"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClear={() => setQ('')}
            {...nav.inputProps}
          />
          {open && (
            <SearchSuggestions
              {...nav.listProps}
              label="Takliflar"
              emptyTitle={q ? `“${q}” bo'yicha hech narsa topilmadi` : undefined}
              emptyDescription="Imloni tekshiring yoki umumiyroq so'z yozing."
              hints={[['↑ ↓', 'Tanlash'], ['↵', 'Ochish'], ['esc', 'Yopish']]}
            >
              {!q
                ? recent.length > 0 && (
                    <SearchSuggestionGroup label="Oxirgi qidiruvlar" actionLabel="Tozalash" onAction={() => setRecent([])}>
                      {recent.map((s) => (
                        <SearchResultRow key={s} type="recent" title={s} onClick={() => pick(s)} onFillQuery={() => setQ(s)} fillQueryLabel="Maydonga qo'yish" />
                      ))}
                    </SearchSuggestionGroup>
                  )
                : matches.length > 0 && (
                    <SearchSuggestionGroup label="Takliflar">
                      {matches.map((s) => (
                        <SearchResultRow key={s} type="query" title={s} match={q} onClick={() => pick(s)} onFillQuery={() => setQ(s)} fillQueryLabel="Maydonga qo'yish" />
                      ))}
                    </SearchSuggestionGroup>
                  )}
            </SearchSuggestions>
          )}
        </div>
        <SearchSuggestions label="Natijalar namunasi" activeId="demo-person" hints={[['↑ ↓', 'Tanlash'], ['↵', 'Ochish'], ['esc', 'Yopish']]}>
          <SearchSuggestionGroup label="Odamlar">
            <SearchResultRow id="demo-person" type="person" title="Alicia Kumar" meta="HR Business Partner" />
          </SearchSuggestionGroup>
          <SearchSuggestionGroup label="Fayllar">
            <SearchResultRow type="file" title="Vacation_Planning_Handbook.pdf" meta="May 19 · 2025" snippet="Planning your vacation is an important part of keeping a healthy work-life balance." />
            <SearchResultRow type="file" title="Coverage_Requirements.docx" meta="Apr 11 · 2025" snippet="Minimum staffing levels for every team during the holiday season." />
          </SearchSuggestionGroup>
          <SearchSuggestionGroup label="Elementlar" actionLabel="Hammasi">
            <SearchResultRow type="item" title="Q2 vacation coordination" meta="Jun 12 · 2025" snippet="Step-by-step guidance on prioritising requests and aligning with project deadlines." source="#hr" />
          </SearchSuggestionGroup>
        </SearchSuggestions>
        <SearchSuggestions label="Yuklanmoqda namunasi" loading loadingLabel="Natijalar yuklanmoqda" hints={null} />
      </div>
    );
  },
  'segmented-control': () => {
    const [v, setV] = useState('week');
    return (
      <SegmentedControl
        aria-label="Davr"
        value={v}
        onChange={setV}
        options={[
          { value: 'day', label: 'Kun' },
          { value: 'week', label: 'Hafta' },
          { value: 'month', label: 'Oy' },
        ]}
      />
    );
  },
  select: () => (
    <div className="w-full max-w-sm">
      <Select label="Mamlakat" placeholder="Tanlang" defaultValue="">
        <option value="uz">Oʻzbekiston</option>
        <option value="kz">Qozogʻiston</option>
        <option value="kg">Qirgʻiziston</option>
      </Select>
    </div>
  ),
  separator: () => (
    <Col>
      <Separator />
      <Separator inset="leading" />
      <Separator type="labeled" label="yoki" />
    </Col>
  ),
  skeleton: () => (
    <Col>
      <Skeleton shape="list-row" />
      <Skeleton shape="text" lines={2} />
      <Skeleton shape="card" />
    </Col>
  ),
  slider: () => {
    const [v, setV] = useState(40);
    const [range, setRange] = useState<[number, number]>([200000, 600000]);
    return (
      <Col>
        <Slider aria-label="Ovoz" value={v} onChange={(e) => setV(+e.target.value)} />
        <RangeSlider min={0} max={1000000} step={10000} value={range} onChange={setRange} formatValue={(n) => `${n.toLocaleString('uz')} soʻm`} labels={['Narx dan', 'Narx gacha']} />
      </Col>
    );
  },
  spinner: () => (
    <Row>
      <Spinner />
      <Spinner size={20} />
      <Spinner size={24} label="Yuklanmoqda" />
    </Row>
  ),
  stepper: () => {
    const [qty, setQty] = useState(2);
    return (
      <Row>
        <Stepper aria-label="Miqdor" min={1} max={10} value={qty} onChange={setQty} unit="dona" />
        <Stepper aria-label="Miqdor" variant="outline" size="l" defaultValue={1} min={1} max={5} />
      </Row>
    );
  },
  steps: () => (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <div className="w-full max-w-sm">
        <Steps marker="icon" aria-label="Buyurtma holati">
          <StepsItem status="complete" title="Buyurtma qabul qilindi" meta="10 okt, 09:12" />
          <StepsItem status="complete" title="To'landi" meta="10 okt, 09:13" />
          <StepsItem
            status="current"
            title="Yig'ildi"
            description="Kuryer 15:00 da olib ketadi"
            action={<Button size="m">Kuzatish</Button>}
            meta="Bugun"
          />
          <StepsItem status="upcoming" title="Yo'lda" />
          <StepsItem status="upcoming" title="Yetkazildi" />
        </Steps>
      </div>
      <Steps orientation="horizontal" marker="number" aria-label="Rasmiylashtirish">
        <StepsItem status="complete" title="Savat" caption="10 okt" />
        <StepsItem status="complete" title="Yetkazish" caption="10 okt" />
        <StepsItem status="current" title="To'lov" />
        <StepsItem status="upcoming" title="Tayyor" />
      </Steps>
      <div className="w-full max-w-sm">
        <Steps aria-label="Ariza">
          <StepsItem status="complete" title="Hujjatlar yuklandi" description="Pasport, diplom" />
          <StepsItem status="complete" title="Ko'rib chiqish" description="2 kun" />
          <StepsItem
            status="error"
            title="To'lov"
            description="Karta rad etildi — boshqa karta bilan urinib ko'ring"
            action={<Button size="m">Boshqa karta</Button>}
          />
          <StepsItem status="upcoming" title="Sertifikat" />
        </Steps>
      </div>
    </div>
  ),
  switch: () => {
    const [on, setOn] = useState(true);
    return (
      <Col>
        <Switch checked={on} onChange={(e) => setOn(e.target.checked)}>
          Wi-Fi
        </Switch>
        <Switch size="l" defaultChecked>
          Bildirishnomalar
        </Switch>
        <Switch disabled>O'chirilgan</Switch>
      </Col>
    );
  },
  'switch-field': () => {
    const [glow, setGlow] = useState(true);
    return (
      <Col>
        <SwitchField label="Kursor yoritilishi" checked={glow} onChange={(e) => setGlow(e.target.checked)} />
        <SwitchField label="Harakatni kamaytirish" description="Fon animatsiyalarini to'xtatadi" />
        <SwitchField label="To'rni ko'rsatish" size="s" defaultChecked />
        <SwitchField label="O'chirilgan" disabled />
      </Col>
    );
  },
  table: () => (
    <div className="w-full">
      <Table zebra>
        <thead>
          <tr>
            <TableHeaderCell sort="asc" onSort={() => {}}>
              Ism
            </TableHeaderCell>
            <TableHeaderCell>Holat</TableHeaderCell>
            <TableHeaderCell>Summa</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          <TableRow selected>
            <TableCell>Nurbek</TableCell>
            <TableCell>
              <Tag color="success">Faol</Tag>
            </TableCell>
            <TableCell numeric>149 000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Aziza</TableCell>
            <TableCell>
              <Tag color="warning">Kutilmoqda</Tag>
            </TableCell>
            <TableCell numeric>60 000</TableCell>
          </TableRow>
        </tbody>
      </Table>
    </div>
  ),
  tabs: () => (
    <div className="w-full max-w-sm">
      <Tabs defaultValue="overview" type="underline" size="m">
        <TabList aria-label="Mahsulot">
          <Tab value="overview">Umumiy</Tab>
          <Tab value="reviews" badge={12}>
            Sharhlar
          </Tab>
          <Tab value="faq" disabled>
            FAQ
          </Tab>
        </TabList>
        <TabPanel value="overview">Mahsulot haqida qisqacha.</TabPanel>
        <TabPanel value="reviews">12 ta sharh.</TabPanel>
      </Tabs>
    </div>
  ),
  tag: () => (
    <Row>
      <Tag>Design</Tag>
      <Tag color="accent">Figma</Tag>
      <Tag variant="outline" color="utility" size="m">
        Beta
      </Tag>
      <Tag color="success">Faol</Tag>
    </Row>
  ),
  'text-field': () => (
    <Col>
      <TextField label="Email" type="email" />
      <TextField label="Telefon" placeholder="+998 __ ___ __ __" supportingText="SMS kod yuboriladi" />
      <TextField label="Karta" error supportingText="Karta raqami noto'g'ri" defaultValue="4421" />
      <TextField variant="outlined" size="l" leadingIcon={<Search size={20} />} placeholder="Qidirish" />
      <TextField label="Summa" prefix="UZS" suffix=".00" inputMode="decimal" />
      <TextField variant="underlined" size="2xl" label="Telefon" prefix="+998" type="tel" />
    </Col>
  ),
  textarea: () => (
    <div className="w-full max-w-sm">
      <Textarea label="Izoh" maxLength={500} showCount supportingText="Ixtiyoriy" />
    </div>
  ),
  'time-slot': () => {
    const [day, setDay] = useState('today');
    const [slot, setSlot] = useState('a');
    return (
      <div className="w-full max-w-sm">
        <TimeSlotPicker
          title="Yetkazish vaqti"
          days={[
            { value: 'today', label: 'Bugun' },
            { value: 'tomorrow', label: 'Ertaga' },
          ]}
          day={day}
          onDayChange={setDay}
          slots={[
            { value: 'x', time: '25–35 daq', note: '+5 000 soʻm', express: true },
            { value: 'a', time: '12:00–12:30', note: 'Bepul' },
            { value: 'b', time: '12:30–13:00', note: 'Bepul' },
            { value: 'c', time: '13:00–13:30', note: 'Band', disabled: true },
          ]}
          value={slot}
          onChange={setSlot}
        />
      </div>
    );
  },
  'selector-card': () => {
    const [delivery, setDelivery] = useState('');
    return (
      <Col>
        <Fieldset
          label="Yetkazib berish usuli"
          status={delivery ? 'helper' : 'error'}
          message={delivery ? undefined : 'Yetkazib berish usulini tanlang'}
        >
          <SelectorGroup name="demo-delivery" error={!delivery}>
            <SelectorCard
              value="courier"
              checked={delivery === 'courier'}
              onChange={() => setDelivery('courier')}
              icon={<Truck />}
              title="Kuryer"
              description="Toshkent bo'ylab 2 soat ichida"
              meta="15 000 soʻm"
            />
            <SelectorCard
              value="pickup"
              checked={delivery === 'pickup'}
              onChange={() => setDelivery('pickup')}
              icon={<ShoppingBag />}
              title="Topshirish punkti"
              description="Ertaga tayyor, 1 200 ball"
              meta="Bepul"
            />
            <SelectorCard value="post" disabled icon={<Home />} title="Pochta" description="Hozircha mavjud emas" />
          </SelectorGroup>
        </Fieldset>
        <Fieldset label="Bildirishnomalar">
          <SelectorGroup>
            <SelectorCard control="switch" title="Buyurtma holati" description="Push va SMS" defaultChecked />
            <SelectorCard control="checkbox" title="Aksiyalar" description="Haftada bir marta" />
          </SelectorGroup>
        </Fieldset>
        <SelectorCard
          name="demo-plan"
          media="image-top"
          image={<Photo label="Pro" />}
          title="Pro"
          description="Barcha komponentlar va yangilanishlar"
          meta="99 000 soʻm / oy"
          defaultChecked
        />
      </Col>
    );
  },
  toast: () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <Toast tone="success" title="O'zgarishlar saqlandi" action={{ label: 'Bekor qilish' }} onClose={() => {}} />
      <Toast variant="subtle" tone="danger" title="To'lov amalga oshmadi" description="Boshqa karta bilan urinib ko'ring." />
    </div>
  ),
  tooltip: () => (
    <Row>
      <Tooltip content="Ulashish" placement="bottom">
        <Button variant="flat" iconOnly startIcon={<Share2 size={16} />}>
          Ulashish
        </Button>
      </Tooltip>
      <TooltipCallout tip="top-left" action={{ label: 'Tushunarli' }}>
        Yangi: buyurtmani bir bosishda takrorlang
      </TooltipCallout>
    </Row>
  ),
  keyboard: () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <Keyboard />
      <Keyboard platform="android" type="numeric" />
    </div>
  ),
  mascot: () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <Row>
        <Mascot pose="idle" size="s" />
        <Mascot pose="happy" size="m" />
        <Mascot pose="love" size="m" />
        <Mascot pose="dizzy" size="m" />
        <Mascot pose="sleepy" size="m" />
      </Row>
      <MascotMessage pose="sleepy" title="Hali kurslar yo'q" description="Birinchi kursni qo'shing — tarix shu yerda ko'rinadi." action={{ label: "Kurs qo'shish" }} />
    </div>
  ),
  pattern: () => (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
      <Pattern type="dots" style={{ height: 120, minHeight: 0, borderRadius: 12 }} />
      <Pattern type="grid" style={{ height: 120, minHeight: 0, borderRadius: 12 }} />
      <Pattern type="diagonal" tone="accent" style={{ height: 120, minHeight: 0, borderRadius: 12 }} />
      <Pattern type="logo-petals" tone="accent" style={{ height: 120, minHeight: 0, borderRadius: 12 }} />
    </div>
  ),
  'system-bars': () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      {/* content="dark" — doim yorug' fon ustida; rang mavzuga emas, orqadagi fonga ergashadi. */}
      <div style={{ background: 'var(--bek-static-white)', borderRadius: 16 }}>
        <StatusBar />
        <HomeIndicator />
      </div>
      <div style={{ background: 'var(--bek-static-dark)', borderRadius: 16 }}>
        <StatusBar platform="android" content="light" />
        <HomeIndicator platform="android" content="light" />
      </div>
    </div>
  ),
  'top-navigation': () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <TopNavigation title="Mahsulot" onLeadingClick={() => {}} actions={<Button variant="flat" iconOnly startIcon={<Share2 size={20} />}>Ulashish</Button>} />
      <TopNavigation type="large-title" title="Profil" leading="none" />
    </div>
  ),
  'floating-actions': () => (
    <div className="w-full max-w-sm flex flex-col gap-3">
      {/* Namunada `position="static"`; ilovada standart `fixed` — ekran pastiga qotadi. */}
      <FloatingActions
        position="static"
        homeIndicator={false}
        info={<InfoWrap icon={<Truck size={20} />}>100 000 soʻmdan bepul yetkazish</InfoWrap>}
        primary={{ label: 'Davom etish' }}
      />
      <FloatingActions
        position="static"
        homeIndicator={false}
        layout="horizontal"
        primary={{ label: "Qo'ng'iroq" }}
        secondary={{ label: 'Yozish' }}
      />
      <FloatingActions
        position="static"
        layout="summary"
        total="159 000 soʻm"
        primary={{ label: "To'lash" }}
        legal="Davom etib, shartlarga rozilik bildirasiz"
      />
    </div>
  ),
  
  scrollbar: () => (
    <Row>
      <ScrollArea
        aria-label="Buyurtmalar"
        style={{ height: 160, width: 240, padding: 12, background: 'var(--bek-bg-sheet)' }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 8px' }}>
            Buyurtma №{1040 + i}
          </p>
        ))}
      </ScrollArea>
      <ScrollArea
        orientation="horizontal"
        size="s"
        aria-label="Kategoriyalar"
        style={{ width: 240, paddingBlock: 8 }}
      >
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {['Telefonlar', 'Noutbuklar', 'Planshetlar', 'Quloqchinlar', 'Soatlar', 'Kameralar'].map(
            (c) => (
              <Chip key={c}>{c}</Chip>
            ),
          )}
        </div>
      </ScrollArea>
    </Row>
  ),
  
  uploader: () => {
    const MB = 1024 * 1024;
    const [files, setFiles] = useState<UploaderFile[]>([
      { id: 'p', name: 'Pasport-skan.pdf', size: 2.4 * MB, status: 'done' },
    ]);
    const finish = (id: string, progress: number) => {
      setFiles((list) =>
        list.map((f) =>
          f.id === id ? { ...f, progress, status: progress >= 100 ? 'done' : 'uploading' } : f,
        ),
      );
      if (progress < 100) setTimeout(() => finish(id, progress + 25), 400);
    };
    const add = (accepted: File[], rejected: FileRejection[]) => {
      const stamp = Date.now();
      const uploading = accepted.map((f, i) => ({
        id: `${stamp}-${i}`,
        name: f.name,
        size: f.size,
        status: 'uploading' as const,
        progress: 0,
      }));
      const failed = rejected.map((r, i) => ({
        id: `${stamp}-r${i}`,
        name: r.file.name,
        size: r.file.size,
        status: 'error' as const,
        error:
          r.reason === 'file-too-large'
            ? 'Yuklanmadi — fayl 10 MB dan katta'
            : 'Yuklanmadi — bu turdagi fayl qabul qilinmaydi',
      }));
      setFiles((list) => [...list, ...uploading, ...failed]);
      uploading.forEach((f) => finish(f.id, 25));
    };
    return (
      <div className="flex flex-col gap-6 w-full max-w-xl">
        <Fieldset label="Rasmlar · 3 / 10">
          <div className="flex flex-wrap gap-3">
            <MediaUploader size="m" status="done" alt="Muqova" coverBadge="Asosiy" onRemove={() => {}} removeLabel="O'chirish" />
            <MediaUploader size="m" status="uploading" progress={64} uploadingLabel="Yuklanmoqda" />
            <MediaUploader size="m" status="error" retryLabel="Qayta" />
            <MediaUploader size="m" label="Rasm qo'shish" />
            <MediaUploader size="m" kind="video" label="Video qo'shish" />
          </div>
        </Fieldset>
        <Fieldset label="Hujjatlar" message="PDF, JPG yoki PNG · 10 MB gacha">
          <FileUploader
            accept=".pdf,.jpg,.png"
            maxSize={10 * MB}
            multiple
            label="Fayl yuklash"
            anotherLabel="Yana yuklash"
            removeLabel="O'chirish"
          />
        </Fieldset>
        <DropZone
          accept=".pdf,.jpg,.png"
          maxSize={10 * MB}
          multiple
          title="Fayllarni shu yerga tashlang yoki"
          browseLabel="tanlang"
          dropLabel="Yuklash uchun qo'yib yuboring"
          hint="PDF, JPG yoki PNG · 10 MB gacha"
          removeLabel="O'chirish"
          retryLabel="Qayta urinish"
          listLabel="Yuklangan hujjatlar"
          files={files}
          onFilesAdded={add}
          onRemove={(f) => setFiles((list) => list.filter((x) => x.id !== f.id))}
          onRetry={(f) => setFiles((list) => list.filter((x) => x.id !== f.id))}
        />
      </div>
    );
  },
};

// ToastViewport ishlatilmasa ham eksportda qolsin — hujjatlarda import ko'rsatish uchun.
void ToastViewport;
