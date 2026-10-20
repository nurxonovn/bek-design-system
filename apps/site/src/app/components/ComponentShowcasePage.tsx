import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useTranslation } from './TranslationProvider';
import { useTheme } from './ThemeProvider';
import { 
  ArrowLeft, Info, AlertCircle, CheckCircle, XCircle, 
  Download, Upload, Search, Moon, Sun, Loader2,
  ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';

interface ComponentShowcasePageProps {
  onNavigate: (page: string) => void;
}

export function ComponentShowcasePage({ onNavigate }: ComponentShowcasePageProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(60);
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('components')}
            className="text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Komponentlarga qaytish
          </Button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1>Component Showcase</h1>
              <p className="text-muted-foreground mt-1">
                Barcha komponentlarning variant va holatlari - Token-based, Light/Dark mode ready
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {theme === 'dark' ? <Moon className="h-3 w-3 mr-1" /> : <Sun className="h-3 w-3 mr-1" />}
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Badge>
              <Badge variant="secondary">
                v1.0.0
              </Badge>
            </div>
          </div>

          {/* Design Guidelines Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Dizayn yo'riqnomalari</AlertTitle>
              <AlertDescription>
                Barcha komponentlar 8pt spacing tizimi, CSS tokenlar va Figma Variables bilan yaratilgan. 
                Har bir komponent Default, Hover, Active, Focused, Disabled va Error holatlarini qo'llab-quvvatlaydi.
              </AlertDescription>
            </Alert>

            <Alert className="border-primary/20 bg-primary/5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">React Ready</AlertTitle>
              <AlertDescription>
                Smart naming: btn/primary/default, input/text/focused, toast/success. 
                Auto Layout grid (4 columns desktop) bilan tartibga solingan.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* 1️⃣ FORM CONTROLS */}
        <div className="space-y-6">
          <div className="px-4 py-2 bg-muted/30 rounded-lg">
            <h2>1️⃣ Form Controls</h2>
          </div>

          {/* BUTTONS */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <p className="text-muted-foreground">
                Variants: Primary, Secondary, Ghost, Destructive / Sizes: Small, Medium, Large / States: Default, Hover, Pressed, Disabled, Loading
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-6">
              {/* Variants */}
              <div className="space-y-3">
                <Label>Variants (Medium Size)</Label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <Label>Sizes (Primary Variant)</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div className="space-y-3">
                <Label>With Icons</Label>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="secondary">
                    Upload
                    <Upload className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* States */}
              <div className="space-y-3">
                <Label>States</Label>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button disabled>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* INPUTS */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <p className="text-muted-foreground">
                Types: Text, Password, Search, Email / States: Default, Focused, Error, Disabled, Success
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Input</Label>
                  <Input type="text" placeholder="Enter text..." />
                </div>

                <div className="space-y-2">
                  <Label>With Prefix Icon</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search..." className="pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password Input</Label>
                  <Input type="password" placeholder="Enter password..." />
                </div>

                <div className="space-y-2">
                  <Label>Email Input</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>

                <div className="space-y-2">
                  <Label>Disabled Input</Label>
                  <Input type="text" placeholder="Disabled..." disabled />
                </div>

                <div className="space-y-2">
                  <Label className="text-destructive">Error State</Label>
                  <Input type="text" placeholder="Error..." className="border-destructive" />
                  <p className="text-xs text-destructive">This field is required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CHECKBOX & RADIO */}
          <Card>
            <CardHeader>
              <CardTitle>Checkbox & Radio</CardTitle>
              <p className="text-muted-foreground">
                States: Checked, Unchecked, Disabled
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Checkboxes</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check1" defaultChecked />
                      <label htmlFor="check1">Checked checkbox</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check2" />
                      <label htmlFor="check2">Unchecked checkbox</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check3" disabled />
                      <label htmlFor="check3" className="text-muted-foreground">Disabled checkbox</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check4" disabled defaultChecked />
                      <label htmlFor="check4" className="text-muted-foreground">Disabled checked</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Radio Buttons</Label>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="radio1" />
                      <label htmlFor="radio1">Selected option</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="radio2" />
                      <label htmlFor="radio2">Unselected option</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option3" id="radio3" disabled />
                      <label htmlFor="radio3" className="text-muted-foreground">Disabled option</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SWITCH */}
          <Card>
            <CardHeader>
              <CardTitle>Switch</CardTitle>
              <p className="text-muted-foreground">
                States: On, Off, Disabled
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable notifications</Label>
                    <p className="text-muted-foreground">
                      Receive notifications about updates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark mode</Label>
                    <p className="text-muted-foreground">
                      Toggle dark mode theme
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between opacity-50">
                  <div className="space-y-0.5">
                    <Label>Disabled switch</Label>
                    <p className="text-muted-foreground">
                      This option is disabled
                    </p>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SELECT & TEXTAREA */}
          <Card>
            <CardHeader>
              <CardTitle>Select & Textarea</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Select Dropdown</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Variantni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Textarea</Label>
                  <Textarea placeholder="Matn kiriting..." rows={4} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2️⃣ NAVIGATION & INTERACTION */}
        <div className="space-y-6">
          <div className="px-4 py-2 bg-muted/30 rounded-lg">
            <h2>2️⃣ Navigation & Interaction</h2>
          </div>

          {/* TABS */}
          <Card>
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Overview</TabsTrigger>
                  <TabsTrigger value="tab2">Details</TabsTrigger>
                  <TabsTrigger value="tab3">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-4">
                  <p className="text-muted-foreground">Overview tab content goes here.</p>
                </TabsContent>
                <TabsContent value="tab2" className="mt-4">
                  <p className="text-muted-foreground">Details tab content goes here.</p>
                </TabsContent>
                <TabsContent value="tab3" className="mt-4">
                  <p className="text-muted-foreground">Settings tab content goes here.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* PAGINATION */}
          <Card>
            <CardHeader>
              <CardTitle>Pagination</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">1</Button>
                <Button variant="default" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">10</Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3️⃣ FEEDBACK & OVERLAYS */}
        <div className="space-y-6">
          <div className="px-4 py-2 bg-muted/30 rounded-lg">
            <h2>3️⃣ Feedback & Overlays</h2>
          </div>

          {/* ALERTS */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <p className="text-muted-foreground">
                Types: Info, Success, Warning, Error
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert message.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Your changes have been saved successfully.
                </AlertDescription>
              </Alert>

              <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-400">Warning</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  Please review your information before continuing.
                </AlertDescription>
              </Alert>

              <Alert className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800 dark:text-red-400">Error</AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-300">
                  An error occurred. Please try again.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* MODAL */}
          <Card>
            <CardHeader>
              <CardTitle>Modal / Dialog</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Modal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modal Title</DialogTitle>
                    <DialogDescription>
                      This is a modal dialog with header, body, and footer sections.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-muted-foreground">
                      Modal body content goes here. You can add forms, text, or any other components.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* TOAST */}
          <Card>
            <CardHeader>
              <CardTitle>Toast Notifications</CardTitle>
              <p className="text-muted-foreground">
                Types: Success, Error, Warning, Info
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => toast.success('Success!', {
                    description: 'Operation completed successfully.'
                  })}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Success
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.error('Error!', {
                    description: 'Something went wrong.'
                  })}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Error
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.warning('Warning!', {
                    description: 'Please check your input.'
                  })}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Warning
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Info', {
                    description: 'Here is some information.'
                  })}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4️⃣ DATA DISPLAY */}
        <div className="space-y-6">
          <div className="px-4 py-2 bg-muted/30 rounded-lg">
            <h2>4️⃣ Data Display</h2>
          </div>

          {/* CARDS */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <p className="text-muted-foreground">
                Variants: Basic, With Image, With Actions
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Basic Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Simple card with header and content.
                    </p>
                  </CardContent>
                </Card>

                {/* Card with Badge */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>With Badge</CardTitle>
                      <Badge>New</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Card with status badge.
                    </p>
                  </CardContent>
                </Card>

                {/* Card with Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>With Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      Card with action buttons.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Cancel</Button>
                      <Button size="sm">Save</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* TABLE */}
          <Card>
            <CardHeader>
              <CardTitle>Table</CardTitle>
              <p className="text-muted-foreground">
                With header row, hover row, selected row, pagination
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending</Badge>
                    </TableCell>
                    <TableCell>User</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob Johnson</TableCell>
                    <TableCell>
                      <Badge variant="outline">Inactive</Badge>
                    </TableCell>
                    <TableCell>User</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* BADGES & AVATARS */}
          <Card>
            <CardHeader>
              <CardTitle>Badges & Avatars</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label>Badges</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge className="bg-green-500 text-white">Success</Badge>
                  <Badge className="bg-yellow-500 text-white">Warning</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Avatars</Label>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-14 w-14">
                    <AvatarFallback>EF</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PROGRESS & SLIDER */}
          <Card>
            <CardHeader>
              <CardTitle>Progress & Slider</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label>Progress Bar</Label>
                <div className="space-y-2">
                  <Progress value={progress} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      Decrease
                    </Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      Increase
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Slider - Value: {sliderValue[0]}</Label>
                <Slider 
                  value={sliderValue} 
                  onValueChange={setSliderValue}
                  max={100} 
                  step={1} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DEVELOPER HANDOFF */}
        <div className="space-y-6">
          <div className="px-4 py-2 bg-muted/30 rounded-lg">
            <h2>💡 Developer Handoff Ready</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* React Integration */}
            <Card>
              <CardHeader>
                <CardTitle>React Integration</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Installation</Label>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>pnpm add @bek/tokens @bek/react</code>
                    </pre>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Import styles</Label>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{`import '@bek/tokens/tokens.css';
import '@bek/tokens/typography.css';
import '@bek/react/styles.css';`}</code>
                    </pre>
                  </div>

                  <div>
                    <Label className="mb-2 block">Usage Example</Label>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{`import { Button } from '@bek/react';

<Button variant="action" size="l" onClick={handleClick}>
  Click me
</Button>`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Tokens */}
            <Card>
              <CardHeader>
                <CardTitle>Design Tokens</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Colors</Label>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Primary:</span>
                        <span className="font-mono">#2E90FA</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Destructive:</span>
                        <span className="font-mono">#d4183d</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Background:</span>
                        <span className="font-mono">#FAFAFA</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-2 block">Typography</Label>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Font Family:</span>
                        <span className="font-mono">ttinterphases Pro</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Base Size:</span>
                        <span className="font-mono">14px</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-2 block">Spacing System</Label>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Base:</span>
                        <span className="font-mono">8pt grid</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Border Radius:</span>
                        <span className="font-mono">0.625rem (10px)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Component Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Component Library Stats</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">30+</div>
                  <div className="text-xs text-muted-foreground">Components</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">100+</div>
                  <div className="text-xs text-muted-foreground">Variants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">6</div>
                  <div className="text-xs text-muted-foreground">State Types</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">2</div>
                  <div className="text-xs text-muted-foreground">Theme Modes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}