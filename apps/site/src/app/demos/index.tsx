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
  BottomNavItem,
  BottomNavigation,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  CartPill,
  Checkbox,
  CheckoutBar,
  Chip,
  CodeInput,
  DatePicker,
  DescriptionList,
  DescriptionListItem,
  Divider,
  DropdownMenu,
  EmptyState,
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
  SearchBar,
  SegmentedControl,
  Select,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  StatusBar,
  Stepper,
  Switch,
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
} from '@bek/react';
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
  User,
} from 'lucide-react';

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
      <AppBar title="Buyurtmalar" onBack={() => {}} actions={<Button variant="flat" size="l" iconOnly startIcon={<Heart size={20} />}>Sevimlilar</Button>} />
      <AppBar scrolled title="Buyurtmalar" onBack={() => {}} />
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
        <BottomNavItem href="#/" icon={<Home size={24} />} selected>
          Bosh sahifa
        </BottomNavItem>
        <BottomNavItem href="#/components" icon={<Search size={24} />} badge="dot">
          Qidiruv
        </BottomNavItem>
        <BottomNavItem href="#/tokens" icon={<ShoppingBag size={24} />} badge={3}>
          Savat
        </BottomNavItem>
        <BottomNavItem href="#/docs" icon={<User size={24} />}>
          Profil
        </BottomNavItem>
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
  'search-bar': () => {
    const [q, setQ] = useState('');
    return (
      <div className="w-full max-w-sm">
        <SearchBar aria-label="Mahsulot qidirish" placeholder="Mahsulot qidirish" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} onCancel={() => setQ('')} cancelLabel="Bekor qilish" />
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
};

// ToastViewport ishlatilmasa ham eksportda qolsin — hujjatlarda import ko'rsatish uchun.
void ToastViewport;
