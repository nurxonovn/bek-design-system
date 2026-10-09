import React, { useState, useMemo } from 'react';
import { useTranslation } from './TranslationProvider';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';

// Import specific icons from Lucide
import {
  Search, Copy, Download, X,
  // Arrows
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowDownLeft, ArrowDownRight, ArrowUpLeft, ArrowUpRight,
  ArrowBigDown, ArrowBigLeft, ArrowBigRight, ArrowBigUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ChevronsDown, ChevronsUp, ChevronsLeft, ChevronsRight, MoveDown, MoveUp, MoveLeft, MoveRight,
  // Add/Remove
  Plus, Minus, PlusCircle, MinusCircle, PlusSquare, MinusSquare, XCircle, XSquare, Check, CheckCircle,
  // Alert
  AlertCircle, AlertTriangle, AlertOctagon, Info, ShieldAlert, Bell, BellOff, BellRing,
  // Award
  Award, Trophy, Medal, Crown, Star, StarHalf, StarOff, Badge, BadgeCheck, BadgeAlert,
  // Animation
  Loader, Loader2, LoaderCircle, RefreshCw, RefreshCcw, RotateCw, RotateCcw, Zap, ZapOff, Activity,
  // AI
  Bot, BrainCircuit, BrainCog, Sparkles, Wand, Wand2, Cpu, Network, Workflow, Binary, Code, Code2,
  // Business
  Calendar, CalendarDays, Clock, CreditCard, DollarSign, TrendingUp, TrendingDown, BarChart, BarChart2, 
  BarChart3, BarChart4, PieChart, LineChart, Briefcase,
  // Communication
  Mail, MailOpen, MessageCircle, MessageSquare, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing,
  Video, VideoOff, Send, SendHorizontal, Share, Share2, AtSign, Inbox, MessagesSquare,
  // Files
  File, FileText, FileCode, FileImage, FileVideo, Folder, FolderOpen, FolderClosed,
  Upload, Save, Trash, Trash2, Archive, Files, FolderArchive,
  // Media
  Play, Pause, Square, Volume, Volume1, Volume2, VolumeX, Camera, CameraOff, Image, ImagePlus,
  Music, Music2, Film, Mic, MicOff, Radio, Speaker, Disc,
  // Editing
  Edit, Edit2, Edit3, Pen, PenTool, Scissors, Clipboard, ClipboardCopy, ClipboardPaste,
  Type, Bold, Italic, Underline, Strikethrough, Highlighter, Eraser, Paintbrush,
  // Navigation
  Navigation, Navigation2, MapPin, Map, Compass, Signpost, Route, RouteOff, Locate, LocateFixed,
  // UI
  Menu, Settings, Settings2, Home, User, User2, UserCircle, Filter, SlidersHorizontal,
  Grid, Grid2x2, Grid3x3, List, LayoutGrid, LayoutList, Eye, EyeOff, Maximize, Minimize,
  // Social
  Heart, HeartOff, ThumbsUp, ThumbsDown, Users, Users2, UserPlus, UserMinus, UserCheck, Smile, Frown,
  // Security
  Lock, LockOpen, Unlock, Shield, ShieldCheck, Key, KeyRound, Fingerprint, ShieldQuestion,
  // Devices
  Smartphone, Tablet, Laptop, Monitor, Watch, Tv, Tv2, Wifi, WifiOff, Bluetooth, Usb, Battery, BatteryCharging,
  // Shopping
  ShoppingCart, ShoppingBag, Package, Package2, PackageCheck, Gift, Tag, Tags, Store, Receipt,
  // Weather
  Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudFog, CloudLightning, Sun, Moon, Sunrise, Sunset, Wind, Thermometer, Droplets, Snowflake,
  // Time
  Clock1, Clock2, Clock3, Clock4, Clock5, Clock6, Clock7, Clock8, Clock9, Clock10, Clock11, Clock12, Timer, TimerOff, Hourglass,
  // Text
  Text, TextCursor, Heading, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';

// Icon filter types
type IconStyle = 'stroke' | 'twotone' | 'duotone' | 'solid' | 'bulk';
type IconType = 'rounded' | 'sharp' | 'standard';

// Pill Filter Component
interface PillFilterProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
}

function PillFilter<T extends string>({ options, selected, onChange }: PillFilterProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 bg-muted rounded-full p-[4px]">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 rounded-full transition-all duration-200 text-sm
            ${selected === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Define all icons with categories
const allIconsData = [
  // Arrows
  { name: 'ArrowDown', component: ArrowDown, category: 'arrows' },
  { name: 'ArrowLeft', component: ArrowLeft, category: 'arrows' },
  { name: 'ArrowRight', component: ArrowRight, category: 'arrows' },
  { name: 'ArrowUp', component: ArrowUp, category: 'arrows' },
  { name: 'ArrowDownLeft', component: ArrowDownLeft, category: 'arrows' },
  { name: 'ArrowDownRight', component: ArrowDownRight, category: 'arrows' },
  { name: 'ArrowUpLeft', component: ArrowUpLeft, category: 'arrows' },
  { name: 'ArrowUpRight', component: ArrowUpRight, category: 'arrows' },
  { name: 'ArrowBigDown', component: ArrowBigDown, category: 'arrows' },
  { name: 'ArrowBigLeft', component: ArrowBigLeft, category: 'arrows' },
  { name: 'ArrowBigRight', component: ArrowBigRight, category: 'arrows' },
  { name: 'ArrowBigUp', component: ArrowBigUp, category: 'arrows' },
  { name: 'ChevronDown', component: ChevronDown, category: 'arrows' },
  { name: 'ChevronUp', component: ChevronUp, category: 'arrows' },
  { name: 'ChevronLeft', component: ChevronLeft, category: 'arrows' },
  { name: 'ChevronRight', component: ChevronRight, category: 'arrows' },
  { name: 'ChevronsDown', component: ChevronsDown, category: 'arrows' },
  { name: 'ChevronsUp', component: ChevronsUp, category: 'arrows' },
  { name: 'ChevronsLeft', component: ChevronsLeft, category: 'arrows' },
  { name: 'ChevronsRight', component: ChevronsRight, category: 'arrows' },
  { name: 'MoveDown', component: MoveDown, category: 'arrows' },
  { name: 'MoveUp', component: MoveUp, category: 'arrows' },
  { name: 'MoveLeft', component: MoveLeft, category: 'arrows' },
  { name: 'MoveRight', component: MoveRight, category: 'arrows' },
  
  // Add/Remove
  { name: 'Plus', component: Plus, category: 'add-remove' },
  { name: 'Minus', component: Minus, category: 'add-remove' },
  { name: 'PlusCircle', component: PlusCircle, category: 'add-remove' },
  { name: 'MinusCircle', component: MinusCircle, category: 'add-remove' },
  { name: 'PlusSquare', component: PlusSquare, category: 'add-remove' },
  { name: 'MinusSquare', component: MinusSquare, category: 'add-remove' },
  { name: 'X', component: X, category: 'add-remove' },
  { name: 'XCircle', component: XCircle, category: 'add-remove' },
  { name: 'XSquare', component: XSquare, category: 'add-remove' },
  { name: 'Check', component: Check, category: 'add-remove' },
  { name: 'CheckCircle', component: CheckCircle, category: 'add-remove' },
  
  // Alert
  { name: 'AlertCircle', component: AlertCircle, category: 'alert' },
  { name: 'AlertTriangle', component: AlertTriangle, category: 'alert' },
  { name: 'AlertOctagon', component: AlertOctagon, category: 'alert' },
  { name: 'Info', component: Info, category: 'alert' },
  { name: 'ShieldAlert', component: ShieldAlert, category: 'alert' },
  { name: 'Bell', component: Bell, category: 'alert' },
  { name: 'BellOff', component: BellOff, category: 'alert' },
  { name: 'BellRing', component: BellRing, category: 'alert' },
  
  // Award
  { name: 'Award', component: Award, category: 'award' },
  { name: 'Trophy', component: Trophy, category: 'award' },
  { name: 'Medal', component: Medal, category: 'award' },
  { name: 'Crown', component: Crown, category: 'award' },
  { name: 'Star', component: Star, category: 'award' },
  { name: 'StarHalf', component: StarHalf, category: 'award' },
  { name: 'StarOff', component: StarOff, category: 'award' },
  { name: 'Badge', component: Badge, category: 'award' },
  { name: 'BadgeCheck', component: BadgeCheck, category: 'award' },
  { name: 'BadgeAlert', component: BadgeAlert, category: 'award' },
  
  // Animation
  { name: 'Loader', component: Loader, category: 'animation' },
  { name: 'Loader2', component: Loader2, category: 'animation' },
  { name: 'LoaderCircle', component: LoaderCircle, category: 'animation' },
  { name: 'RefreshCw', component: RefreshCw, category: 'animation' },
  { name: 'RefreshCcw', component: RefreshCcw, category: 'animation' },
  { name: 'RotateCw', component: RotateCw, category: 'animation' },
  { name: 'RotateCcw', component: RotateCcw, category: 'animation' },
  { name: 'Zap', component: Zap, category: 'animation' },
  { name: 'ZapOff', component: ZapOff, category: 'animation' },
  { name: 'Activity', component: Activity, category: 'animation' },
  
  // AI
  { name: 'Bot', component: Bot, category: 'ai' },
  { name: 'BrainCircuit', component: BrainCircuit, category: 'ai' },
  { name: 'BrainCog', component: BrainCog, category: 'ai' },
  { name: 'Sparkles', component: Sparkles, category: 'ai' },
  { name: 'Wand', component: Wand, category: 'ai' },
  { name: 'Wand2', component: Wand2, category: 'ai' },
  { name: 'Cpu', component: Cpu, category: 'ai' },
  { name: 'Network', component: Network, category: 'ai' },
  { name: 'Workflow', component: Workflow, category: 'ai' },
  { name: 'Binary', component: Binary, category: 'ai' },
  { name: 'Code', component: Code, category: 'ai' },
  { name: 'Code2', component: Code2, category: 'ai' },
  
  // Business
  { name: 'Calendar', component: Calendar, category: 'business' },
  { name: 'CalendarDays', component: CalendarDays, category: 'business' },
  { name: 'Clock', component: Clock, category: 'business' },
  { name: 'CreditCard', component: CreditCard, category: 'business' },
  { name: 'DollarSign', component: DollarSign, category: 'business' },
  { name: 'TrendingUp', component: TrendingUp, category: 'business' },
  { name: 'TrendingDown', component: TrendingDown, category: 'business' },
  { name: 'BarChart', component: BarChart, category: 'business' },
  { name: 'BarChart2', component: BarChart2, category: 'business' },
  { name: 'BarChart3', component: BarChart3, category: 'business' },
  { name: 'BarChart4', component: BarChart4, category: 'business' },
  { name: 'PieChart', component: PieChart, category: 'business' },
  { name: 'LineChart', component: LineChart, category: 'business' },
  { name: 'Briefcase', component: Briefcase, category: 'business' },
  
  // Communication
  { name: 'Mail', component: Mail, category: 'communication' },
  { name: 'MailOpen', component: MailOpen, category: 'communication' },
  { name: 'MessageCircle', component: MessageCircle, category: 'communication' },
  { name: 'MessageSquare', component: MessageSquare, category: 'communication' },
  { name: 'Phone', component: Phone, category: 'communication' },
  { name: 'PhoneCall', component: PhoneCall, category: 'communication' },
  { name: 'PhoneIncoming', component: PhoneIncoming, category: 'communication' },
  { name: 'PhoneOutgoing', component: PhoneOutgoing, category: 'communication' },
  { name: 'Video', component: Video, category: 'communication' },
  { name: 'VideoOff', component: VideoOff, category: 'communication' },
  { name: 'Send', component: Send, category: 'communication' },
  { name: 'SendHorizontal', component: SendHorizontal, category: 'communication' },
  { name: 'Share', component: Share, category: 'communication' },
  { name: 'Share2', component: Share2, category: 'communication' },
  { name: 'AtSign', component: AtSign, category: 'communication' },
  { name: 'Inbox', component: Inbox, category: 'communication' },
  { name: 'MessagesSquare', component: MessagesSquare, category: 'communication' },
  
  // Files
  { name: 'File', component: File, category: 'files' },
  { name: 'FileText', component: FileText, category: 'files' },
  { name: 'FileCode', component: FileCode, category: 'files' },
  { name: 'FileImage', component: FileImage, category: 'files' },
  { name: 'FileVideo', component: FileVideo, category: 'files' },
  { name: 'Folder', component: Folder, category: 'files' },
  { name: 'FolderOpen', component: FolderOpen, category: 'files' },
  { name: 'FolderClosed', component: FolderClosed, category: 'files' },
  { name: 'Download', component: Download, category: 'files' },
  { name: 'Upload', component: Upload, category: 'files' },
  { name: 'Save', component: Save, category: 'files' },
  { name: 'Trash', component: Trash, category: 'files' },
  { name: 'Trash2', component: Trash2, category: 'files' },
  { name: 'Archive', component: Archive, category: 'files' },
  { name: 'Files', component: Files, category: 'files' },
  { name: 'FolderArchive', component: FolderArchive, category: 'files' },
  
  // Media
  { name: 'Play', component: Play, category: 'media' },
  { name: 'Pause', component: Pause, category: 'media' },
  { name: 'Square', component: Square, category: 'media' },
  { name: 'Volume', component: Volume, category: 'media' },
  { name: 'Volume1', component: Volume1, category: 'media' },
  { name: 'Volume2', component: Volume2, category: 'media' },
  { name: 'VolumeX', component: VolumeX, category: 'media' },
  { name: 'Camera', component: Camera, category: 'media' },
  { name: 'CameraOff', component: CameraOff, category: 'media' },
  { name: 'Image', component: Image, category: 'media' },
  { name: 'ImagePlus', component: ImagePlus, category: 'media' },
  { name: 'Music', component: Music, category: 'media' },
  { name: 'Music2', component: Music2, category: 'media' },
  { name: 'Film', component: Film, category: 'media' },
  { name: 'Mic', component: Mic, category: 'media' },
  { name: 'MicOff', component: MicOff, category: 'media' },
  { name: 'Radio', component: Radio, category: 'media' },
  { name: 'Speaker', component: Speaker, category: 'media' },
  { name: 'Disc', component: Disc, category: 'media' },
  
  // Editing
  { name: 'Edit', component: Edit, category: 'editing' },
  { name: 'Edit2', component: Edit2, category: 'editing' },
  { name: 'Edit3', component: Edit3, category: 'editing' },
  { name: 'Pen', component: Pen, category: 'editing' },
  { name: 'PenTool', component: PenTool, category: 'editing' },
  { name: 'Scissors', component: Scissors, category: 'editing' },
  { name: 'Copy', component: Copy, category: 'editing' },
  { name: 'Clipboard', component: Clipboard, category: 'editing' },
  { name: 'ClipboardCopy', component: ClipboardCopy, category: 'editing' },
  { name: 'ClipboardPaste', component: ClipboardPaste, category: 'editing' },
  { name: 'Type', component: Type, category: 'editing' },
  { name: 'Bold', component: Bold, category: 'editing' },
  { name: 'Italic', component: Italic, category: 'editing' },
  { name: 'Underline', component: Underline, category: 'editing' },
  { name: 'Strikethrough', component: Strikethrough, category: 'editing' },
  { name: 'Highlighter', component: Highlighter, category: 'editing' },
  { name: 'Eraser', component: Eraser, category: 'editing' },
  { name: 'Paintbrush', component: Paintbrush, category: 'editing' },
  
  // Navigation
  { name: 'Navigation', component: Navigation, category: 'navigation' },
  { name: 'Navigation2', component: Navigation2, category: 'navigation' },
  { name: 'MapPin', component: MapPin, category: 'navigation' },
  { name: 'Map', component: Map, category: 'navigation' },
  { name: 'Compass', component: Compass, category: 'navigation' },
  { name: 'Signpost', component: Signpost, category: 'navigation' },
  { name: 'Route', component: Route, category: 'navigation' },
  { name: 'RouteOff', component: RouteOff, category: 'navigation' },
  { name: 'Locate', component: Locate, category: 'navigation' },
  { name: 'LocateFixed', component: LocateFixed, category: 'navigation' },
  
  // UI
  { name: 'Menu', component: Menu, category: 'ui' },
  { name: 'Settings', component: Settings, category: 'ui' },
  { name: 'Settings2', component: Settings2, category: 'ui' },
  { name: 'Home', component: Home, category: 'ui' },
  { name: 'User', component: User, category: 'ui' },
  { name: 'User2', component: User2, category: 'ui' },
  { name: 'UserCircle', component: UserCircle, category: 'ui' },
  { name: 'Search', component: Search, category: 'ui' },
  { name: 'Filter', component: Filter, category: 'ui' },
  { name: 'SlidersHorizontal', component: SlidersHorizontal, category: 'ui' },
  { name: 'Grid', component: Grid, category: 'ui' },
  { name: 'Grid2x2', component: Grid2x2, category: 'ui' },
  { name: 'Grid3x3', component: Grid3x3, category: 'ui' },
  { name: 'List', component: List, category: 'ui' },
  { name: 'LayoutGrid', component: LayoutGrid, category: 'ui' },
  { name: 'LayoutList', component: LayoutList, category: 'ui' },
  { name: 'Eye', component: Eye, category: 'ui' },
  { name: 'EyeOff', component: EyeOff, category: 'ui' },
  { name: 'Maximize', component: Maximize, category: 'ui' },
  { name: 'Minimize', component: Minimize, category: 'ui' },
  
  // Social
  { name: 'Heart', component: Heart, category: 'social' },
  { name: 'HeartOff', component: HeartOff, category: 'social' },
  { name: 'ThumbsUp', component: ThumbsUp, category: 'social' },
  { name: 'ThumbsDown', component: ThumbsDown, category: 'social' },
  { name: 'Users', component: Users, category: 'social' },
  { name: 'Users2', component: Users2, category: 'social' },
  { name: 'UserPlus', component: UserPlus, category: 'social' },
  { name: 'UserMinus', component: UserMinus, category: 'social' },
  { name: 'UserCheck', component: UserCheck, category: 'social' },
  { name: 'Smile', component: Smile, category: 'social' },
  { name: 'Frown', component: Frown, category: 'social' },
  
  // Security
  { name: 'Lock', component: Lock, category: 'security' },
  { name: 'LockOpen', component: LockOpen, category: 'security' },
  { name: 'Unlock', component: Unlock, category: 'security' },
  { name: 'Shield', component: Shield, category: 'security' },
  { name: 'ShieldCheck', component: ShieldCheck, category: 'security' },
  { name: 'Key', component: Key, category: 'security' },
  { name: 'KeyRound', component: KeyRound, category: 'security' },
  { name: 'Fingerprint', component: Fingerprint, category: 'security' },
  { name: 'ShieldQuestion', component: ShieldQuestion, category: 'security' },
  
  // Devices
  { name: 'Smartphone', component: Smartphone, category: 'devices' },
  { name: 'Tablet', component: Tablet, category: 'devices' },
  { name: 'Laptop', component: Laptop, category: 'devices' },
  { name: 'Monitor', component: Monitor, category: 'devices' },
  { name: 'Watch', component: Watch, category: 'devices' },
  { name: 'Tv', component: Tv, category: 'devices' },
  { name: 'Tv2', component: Tv2, category: 'devices' },
  { name: 'Wifi', component: Wifi, category: 'devices' },
  { name: 'WifiOff', component: WifiOff, category: 'devices' },
  { name: 'Bluetooth', component: Bluetooth, category: 'devices' },
  { name: 'Usb', component: Usb, category: 'devices' },
  { name: 'Battery', component: Battery, category: 'devices' },
  { name: 'BatteryCharging', component: BatteryCharging, category: 'devices' },
  
  // Shopping
  { name: 'ShoppingCart', component: ShoppingCart, category: 'shopping' },
  { name: 'ShoppingBag', component: ShoppingBag, category: 'shopping' },
  { name: 'Package', component: Package, category: 'shopping' },
  { name: 'Package2', component: Package2, category: 'shopping' },
  { name: 'PackageCheck', component: PackageCheck, category: 'shopping' },
  { name: 'Gift', component: Gift, category: 'shopping' },
  { name: 'Tag', component: Tag, category: 'shopping' },
  { name: 'Tags', component: Tags, category: 'shopping' },
  { name: 'Store', component: Store, category: 'shopping' },
  { name: 'Receipt', component: Receipt, category: 'shopping' },
  
  // Weather
  { name: 'Cloud', component: Cloud, category: 'weather' },
  { name: 'CloudRain', component: CloudRain, category: 'weather' },
  { name: 'CloudSnow', component: CloudSnow, category: 'weather' },
  { name: 'CloudDrizzle', component: CloudDrizzle, category: 'weather' },
  { name: 'CloudFog', component: CloudFog, category: 'weather' },
  { name: 'CloudLightning', component: CloudLightning, category: 'weather' },
  { name: 'Sun', component: Sun, category: 'weather' },
  { name: 'Moon', component: Moon, category: 'weather' },
  { name: 'Sunrise', component: Sunrise, category: 'weather' },
  { name: 'Sunset', component: Sunset, category: 'weather' },
  { name: 'Wind', component: Wind, category: 'weather' },
  { name: 'Thermometer', component: Thermometer, category: 'weather' },
  { name: 'Droplets', component: Droplets, category: 'weather' },
  { name: 'Snowflake', component: Snowflake, category: 'weather' },
  
  // Time
  { name: 'Clock1', component: Clock1, category: 'time' },
  { name: 'Clock2', component: Clock2, category: 'time' },
  { name: 'Clock3', component: Clock3, category: 'time' },
  { name: 'Clock4', component: Clock4, category: 'time' },
  { name: 'Clock5', component: Clock5, category: 'time' },
  { name: 'Clock6', component: Clock6, category: 'time' },
  { name: 'Clock7', component: Clock7, category: 'time' },
  { name: 'Clock8', component: Clock8, category: 'time' },
  { name: 'Clock9', component: Clock9, category: 'time' },
  { name: 'Clock10', component: Clock10, category: 'time' },
  { name: 'Clock11', component: Clock11, category: 'time' },
  { name: 'Clock12', component: Clock12, category: 'time' },
  { name: 'Timer', component: Timer, category: 'time' },
  { name: 'TimerOff', component: TimerOff, category: 'time' },
  { name: 'Hourglass', component: Hourglass, category: 'time' },
  
  // Text
  { name: 'Text', component: Text, category: 'text' },
  { name: 'TextCursor', component: TextCursor, category: 'text' },
  { name: 'Heading', component: Heading, category: 'text' },
  { name: 'Heading1', component: Heading1, category: 'text' },
  { name: 'Heading2', component: Heading2, category: 'text' },
  { name: 'Heading3', component: Heading3, category: 'text' },
  { name: 'AlignLeft', component: AlignLeft, category: 'text' },
  { name: 'AlignCenter', component: AlignCenter, category: 'text' },
  { name: 'AlignRight', component: AlignRight, category: 'text' },
  { name: 'AlignJustify', component: AlignJustify, category: 'text' },
];

interface IconDetailsProps {
  icon: { name: string; component: React.ComponentType<any>; category: string };
  currentStyle: IconStyle;
}

function IconDetails({ icon, currentStyle }: IconDetailsProps) {
  const { t } = useTranslation();
  const IconComponent = icon.component;
  
  const strokeWidth = currentStyle === 'solid' || currentStyle === 'bulk' ? 2 : 1.5;
  
  const copyReactCode = async () => {
    const code = `import { ${icon.name} } from 'lucide-react';\n\n<${icon.name} size={24} strokeWidth={${strokeWidth}} />`;
    const success = await copyToClipboard(code);
    if (success) {
      toast.success(t.iconCopied);
    } else {
      toast.error('Failed to copy code');
    }
  };
  
  const downloadSVG = () => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
  <!-- ${icon.name} from Lucide Icons -->
</svg>`;
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${icon.name.toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t.iconDownloaded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center p-12 bg-muted/50 rounded-2xl">
        <IconComponent size={80} className="text-foreground" strokeWidth={strokeWidth} />
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl mb-2 text-foreground text-center">
            {icon.name}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Category: {icon.category}
          </p>
        </div>
        
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">{t.iconUsage}:</p>
          <code className="text-xs text-foreground block bg-background/50 p-3 rounded-lg break-all">
            {`import { ${icon.name} } from 'lucide-react';`}<br/><br/>
            {`<${icon.name} size={24} strokeWidth={${strokeWidth}} />`}
          </code>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={copyReactCode} 
            variant="outline" 
            className="flex-1 rounded-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            {t.copyCode}
          </Button>
          <Button 
            onClick={downloadSVG} 
            variant="outline"
            className="flex-1 rounded-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadSvg}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function IconsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [iconStyle, setIconStyle] = useState<IconStyle>('stroke');
  const [iconType, setIconType] = useState<IconType>('rounded');

  const filteredIcons = useMemo(() => {
    let icons = allIconsData;
    
    if (selectedCategory !== 'all') {
      icons = icons.filter(icon => icon.category === selectedCategory);
    }
    
    if (searchTerm) {
      icons = icons.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return icons;
  }, [searchTerm, selectedCategory]);

  const getStrokeWidth = () => {
    if (iconStyle === 'solid' || iconStyle === 'bulk') return 2;
    if (iconStyle === 'twotone' || iconStyle === 'duotone') return 1.5;
    return 1.5;
  };

  const styleOptions = [
    { value: 'stroke' as IconStyle, label: 'Stroke' },
    { value: 'twotone' as IconStyle, label: 'Twotone' },
    { value: 'duotone' as IconStyle, label: 'Duotone' },
    { value: 'solid' as IconStyle, label: 'Solid' },
    { value: 'bulk' as IconStyle, label: 'Bulk' }
  ];

  const typeOptions = [
    { value: 'rounded' as IconType, label: 'Rounded' },
    { value: 'sharp' as IconType, label: 'Sharp' },
    { value: 'standard' as IconType, label: 'Standard' }
  ];

  const categoryOptions = [
    { value: 'all', label: t.allIcons },
    { value: 'arrows', label: 'Arrows' },
    { value: 'add-remove', label: 'Add + Remove' },
    { value: 'alert', label: 'Alert' },
    { value: 'award', label: 'Award' },
    { value: 'animation', label: 'Animation' },
    { value: 'ai', label: 'AI' },
    { value: 'business', label: 'Business' },
    { value: 'communication', label: 'Communication' },
    { value: 'files', label: 'Files' },
    { value: 'media', label: 'Media' },
    { value: 'editing', label: 'Editing' },
    { value: 'navigation', label: 'Navigation' },
    { value: 'ui', label: 'UI' },
    { value: 'social', label: 'Social' },
    { value: 'security', label: 'Security' },
    { value: 'devices', label: 'Devices' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'weather', label: 'Weather' },
    { value: 'time', label: 'Time' },
    { value: 'text', label: 'Text' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl mb-3 text-foreground">
            {t.iconsTitle}
          </h1>
          <p className="text-base text-muted-foreground mx-auto max-w-2xl mb-4 text-center">
            {t.iconsDesc}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{allIconsData.length}</span> {t.icons}
            </span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-foreground">5</span> Styles
            </span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-foreground">3</span> Types
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-[20px] flex items-center gap-4 flex-wrap mt-[0px] mr-[0px] ml-[0px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] h-10 rounded-full border-border bg-muted hover:bg-background transition-colors">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <PillFilter options={styleOptions} selected={iconStyle} onChange={setIconStyle} />
          <PillFilter options={typeOptions} selected={iconType} onChange={setIconType} />
          
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t.searchIcons}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-[40px] pr-[12px] h-10 rounded-[20px] border-border bg-muted focus:bg-background transition-colors text-[14px] text-[rgb(136,136,136)] pt-[4px] pb-[4px]"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground text-center">
            {filteredIcons.length} {t.icons.toLowerCase()}
            {selectedCategory !== 'all' && ` in ${categoryOptions.find(c => c.value === selectedCategory)?.label}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Icons Grid */}
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {filteredIcons.map((icon) => {
              const IconComponent = icon.component;
              return (
                <Dialog key={icon.name}>
                  <DialogTrigger asChild>
                    <button className="group flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-center">
                        <IconComponent size={24} className="text-foreground" strokeWidth={getStrokeWidth()} />
                      </div>
                      <span className="text-xs text-muted-foreground text-center group-hover:text-foreground transition-colors line-clamp-2">
                        {icon.name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-3xl p-8" aria-describedby={undefined}>
                    <DialogTitle className="sr-only">{icon.name}</DialogTitle>
                    <DialogClose className="absolute right-6 top-6 rounded-full p-2 hover:bg-muted transition-colors">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </DialogClose>
                    <IconDetails icon={icon} currentStyle={iconStyle} />
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <Search className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg mb-2 text-foreground">
              {t.noIconsFound}
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              {t.noIconsFoundDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}