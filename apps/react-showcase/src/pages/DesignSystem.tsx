import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Type,
  Palette,
  Ruler,
  Component,
  BarChart3,
  Terminal,
  AlertCircle,
  Bold,
  ChevronDown,
  MoreHorizontal,
  Layers,
  ListChecks,
  SlidersHorizontal,
  TableIcon,
  MessageSquare,
  ToggleLeft,
  Menu,
  Loader2,
  Columns3,
  MessageSquarePlus,
  Info,
  Settings2,
  Table2,
  ScrollText,
  BellRing,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ScrollArea } from "../components/ui/scroll-area";
import { Calendar } from "../components/ui/calendar";
import { DatePicker } from "../components/ui/date-picker";
import { Slider } from "../components/ui/slider";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";
import { marketsGridTheme } from "@marketsui/tokens/ag-grid-theme";

ModuleRegistry.registerModules([AllCommunityModule]);
import { Textarea } from "../components/ui/textarea";
import { Toggle } from "../components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ChevronsUpDown,
  Home,
  GalleryHorizontal,
  AreaChart,
  PanelLeftClose,
  Search,
  MousePointerClick,
  PanelBottomOpen,
  AtSign,
  KeyRound,
  MenuSquare,
  Navigation,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  PanelRight,
  Bell,
  TextCursorInput,
  DollarSign,
  Percent,
  CalendarIcon,
  Smile,
  Calculator,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Color Swatch
// ---------------------------------------------------------------------------

interface ColorSwatchProps {
  label: string;
  cssVar: string;
  /** If true, renders white text on the swatch */
  lightText?: boolean;
}

function ColorSwatch({ label, cssVar, lightText }: ColorSwatchProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-12 w-12 rounded-lg border border-border shadow-sm"
        style={{ backgroundColor: `hsl(var(${cssVar}))` }}
      />
      <div className="text-center">
        <p className="text-xs font-medium">{label}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{cssVar}</p>
      </div>
    </div>
  );
}

function TradingColorSwatch({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-md border border-border"
        style={{ backgroundColor: `hsl(var(${cssVar}))` }}
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">{cssVar}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Color Palette
// ---------------------------------------------------------------------------

function ColorPaletteSection() {
  const semanticColors: ColorSwatchProps[] = [
    { label: "Background", cssVar: "--background" },
    { label: "Foreground", cssVar: "--foreground", lightText: true },
    { label: "Card", cssVar: "--card" },
    { label: "Primary", cssVar: "--primary", lightText: true },
    { label: "Secondary", cssVar: "--secondary" },
    { label: "Muted", cssVar: "--muted" },
    { label: "Accent", cssVar: "--accent" },
    { label: "Brand", cssVar: "--brand", lightText: true },
    { label: "Destructive", cssVar: "--destructive", lightText: true },
    { label: "Success", cssVar: "--success", lightText: true },
    { label: "Border", cssVar: "--border" },
    { label: "Input", cssVar: "--input" },
    { label: "Ring", cssVar: "--ring", lightText: true },
  ];

  const tradingColors = [
    { label: "Bid (Blue)", cssVar: "--mdl-bid" },
    { label: "Ask (Red)", cssVar: "--mdl-ask" },
    { label: "Flash Up", cssVar: "--mdl-flash-up" },
    { label: "Flash Down", cssVar: "--mdl-flash-down" },
    { label: "P&L Positive", cssVar: "--mdl-pnl-positive" },
    { label: "P&L Negative", cssVar: "--mdl-pnl-negative" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle>Color Palette</CardTitle>
        </div>
        <CardDescription>
          Semantic color tokens using HSL channel format. All colors adapt between light and dark themes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Semantic Colors */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Semantic Colors</h4>
          <div className="flex flex-wrap gap-6">
            {semanticColors.map((color) => (
              <ColorSwatch key={color.cssVar} {...color} />
            ))}
          </div>
        </div>

        <Separator />

        {/* Trading Colors */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Trading Colors</h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {tradingColors.map((color) => (
              <TradingColorSwatch key={color.cssVar} {...color} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Typography
// ---------------------------------------------------------------------------

function TypographySection() {
  const fontSizes = [
    { label: "xs", size: "11px", var: "--mdl-font-xs" },
    { label: "sm", size: "13px", var: "--mdl-font-sm" },
    { label: "base", size: "14px", var: "--mdl-font-base" },
    { label: "lg", size: "16px", var: "--mdl-font-lg" },
    { label: "xl", size: "18px", var: "--mdl-font-xl" },
  ];

  const fontWeights = [
    { label: "Light", weight: 300 },
    { label: "Regular", weight: 400 },
    { label: "Medium", weight: 500 },
    { label: "Semi Bold", weight: 600 },
    { label: "Bold", weight: 700 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          <CardTitle>Typography</CardTitle>
        </div>
        <CardDescription>
          Font families, sizes, and weights from the design language tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Font Families */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Font Families</h4>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Body &mdash; DM Sans</p>
              <p style={{ fontFamily: "var(--mdl-font-family)", fontSize: "16px" }}>
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Mono &mdash; JetBrains Mono
              </p>
              <p style={{ fontFamily: "var(--mdl-font-mono)", fontSize: "16px" }}>
                1,234.56 &nbsp; -789.01 &nbsp; AAPL &nbsp; 0xDEADBEEF
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Font Sizes */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Font Sizes</h4>
          <div className="space-y-3">
            {fontSizes.map((fs) => (
              <div key={fs.label} className="flex items-baseline gap-4">
                <div className="w-16 shrink-0 text-right">
                  <span className="font-mono text-xs text-muted-foreground">
                    {fs.label} ({fs.size})
                  </span>
                </div>
                <p style={{ fontSize: `var(${fs.var})` }}>
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Font Weights */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Heading Weights</h4>
          <div className="space-y-3">
            {fontWeights.map((fw) => (
              <div key={fw.weight} className="flex items-baseline gap-4">
                <div className="w-24 shrink-0 text-right">
                  <span className="font-mono text-xs text-muted-foreground">
                    {fw.weight} &mdash; {fw.label}
                  </span>
                </div>
                <p className="text-lg" style={{ fontWeight: fw.weight }}>
                  MarketsUI Design System
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Spacing & Sizing
// ---------------------------------------------------------------------------

function SpacingSizingSection() {
  const heights = [
    { label: "sm", value: "28px", var: "--mdl-height-sm" },
    { label: "default", value: "36px", var: "--mdl-height-default" },
    { label: "lg", value: "44px", var: "--mdl-height-lg" },
  ];

  const paddings = [
    { label: "padding-x", value: "12px", var: "--mdl-padding-x" },
    { label: "padding-x-lg", value: "16px", var: "--mdl-padding-x-lg" },
    { label: "padding-y", value: "8px", var: "--mdl-padding-y" },
  ];

  const radii = [
    { label: "sm", value: "6px", var: "--mdl-radius-sm" },
    { label: "md", value: "10px", var: "--mdl-radius-md" },
    { label: "lg", value: "14px", var: "--mdl-radius-lg" },
    { label: "xl", value: "18px", var: "--mdl-radius-xl" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-primary" />
          <CardTitle>Spacing & Sizing</CardTitle>
        </div>
        <CardDescription>Height, padding, and border-radius tokens.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Heights */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Height Tokens</h4>
          <div className="space-y-3">
            {heights.map((h) => (
              <div key={h.label} className="flex items-center gap-4">
                <div className="w-28 shrink-0 text-right">
                  <span className="font-mono text-xs text-muted-foreground">
                    {h.label} ({h.value})
                  </span>
                </div>
                <div
                  className="rounded-md bg-primary/20 border border-primary/30"
                  style={{ height: h.value, width: "100%", maxWidth: "240px" }}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Padding */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Padding Tokens</h4>
          <div className="space-y-3">
            {paddings.map((p) => (
              <div key={p.label} className="flex items-center gap-4">
                <div className="w-28 shrink-0 text-right">
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.label} ({p.value})
                  </span>
                </div>
                <div className="inline-flex items-center rounded-md border border-dashed border-primary/40 bg-primary/5">
                  <div
                    className="bg-primary/20 text-xs text-primary font-mono flex items-center justify-center"
                    style={{
                      padding: p.label.includes("y") ? `${p.value} 12px` : `8px ${p.value}`,
                      minHeight: "32px",
                    }}
                  >
                    {p.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Radius */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Border Radius</h4>
          <div className="flex flex-wrap gap-6">
            {radii.map((r) => (
              <div key={r.label} className="flex flex-col items-center gap-2">
                <div
                  className="h-16 w-16 border-2 border-primary bg-primary/10"
                  style={{ borderRadius: r.value }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium">{r.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Component Showcase
// ---------------------------------------------------------------------------

function ComponentShowcaseSection() {
  const [switchOn, setSwitchOn] = useState(true);
  const [switchOff, setSwitchOff] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Component className="h-5 w-5 text-primary" />
          <CardTitle>Component Showcase</CardTitle>
        </div>
        <CardDescription>
          shadcn/ui components styled with MarketsUI tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Buttons */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Buttons</h4>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Inputs */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Inputs</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ds-default">Default</Label>
              <Input id="ds-default" placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds-with-value">With Value</Label>
              <Input id="ds-with-value" defaultValue="Hello World" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds-disabled">Disabled</Label>
              <Input id="ds-disabled" disabled placeholder="Disabled input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds-number">Numeric (Mono)</Label>
              <Input
                id="ds-number"
                defaultValue="1,234.56"
                className="font-mono"
                style={{ fontFamily: "var(--mdl-font-mono)" }}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Selects */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Selects</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Instrument</Label>
              <Select defaultValue="aapl">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aapl">AAPL</SelectItem>
                  <SelectItem value="googl">GOOGL</SelectItem>
                  <SelectItem value="msft">MSFT</SelectItem>
                  <SelectItem value="tsla">TSLA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Frame</Label>
              <Select defaultValue="1d">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Switches */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Switches</h4>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} id="ds-switch-on" />
              <Label htmlFor="ds-switch-on">Enabled</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={switchOff} onCheckedChange={setSwitchOff} id="ds-switch-off" />
              <Label htmlFor="ds-switch-off">Disabled</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Badges */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Badges</h4>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <Separator />

        {/* Cards */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Cards</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Card Title</CardTitle>
                <CardDescription>Card description goes here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is an example card with header, content, and footer sections.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Market Summary</CardTitle>
                <CardDescription>Real-time overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span>AAPL</span>
                    <span style={{ color: "hsl(var(--mdl-pnl-positive))" }}>+2.34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GOOGL</span>
                    <span style={{ color: "hsl(var(--mdl-pnl-negative))" }}>-1.12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MSFT</span>
                    <span style={{ color: "hsl(var(--mdl-pnl-positive))" }}>+0.87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Trading Colors Demo
// ---------------------------------------------------------------------------

const orderBookBids = [
  { price: "182.45", size: "1,200", total: "218,940", depth: 85 },
  { price: "182.44", size: "3,500", total: "638,540", depth: 70 },
  { price: "182.43", size: "800", total: "145,944", depth: 55 },
  { price: "182.42", size: "5,100", total: "930,342", depth: 40 },
  { price: "182.41", size: "2,300", total: "419,543", depth: 25 },
];

const orderBookAsks = [
  { price: "182.46", size: "2,800", total: "510,888", depth: 80 },
  { price: "182.47", size: "1,500", total: "273,705", depth: 65 },
  { price: "182.48", size: "4,200", total: "766,416", depth: 50 },
  { price: "182.49", size: "900", total: "164,241", depth: 35 },
  { price: "182.50", size: "6,000", total: "1,095,000", depth: 20 },
];

function TradingColorsDemoSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Trading Colors Demo</CardTitle>
        </div>
        <CardDescription>
          Live trading UI patterns using bid, ask, flash, and P&L color tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Order Book */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Order Book</h4>
          <div className="rounded-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/50 px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground">Price</span>
              <span className="text-xs font-medium text-muted-foreground text-right">Size</span>
              <span className="text-xs font-medium text-muted-foreground text-right">Total</span>
            </div>

            {/* Asks (reversed so highest is on top) */}
            <div className="divide-y divide-border/50">
              {[...orderBookAsks].reverse().map((row) => (
                <div key={row.price} className="relative grid grid-cols-3 gap-4 px-4 py-1.5">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: `linear-gradient(to left, hsl(var(--mdl-ask)) ${row.depth}%, transparent ${row.depth}%)`,
                    }}
                  />
                  <span
                    className="relative font-mono text-sm"
                    style={{ color: "hsl(var(--mdl-ask))" }}
                  >
                    {row.price}
                  </span>
                  <span className="relative font-mono text-sm text-right">{row.size}</span>
                  <span className="relative font-mono text-sm text-right text-muted-foreground">
                    {row.total}
                  </span>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="border-y border-border bg-muted/30 px-4 py-2 text-center">
              <span className="font-mono text-sm font-semibold">182.455</span>
              <span className="ml-2 text-xs text-muted-foreground">Spread: 0.01 (0.005%)</span>
            </div>

            {/* Bids */}
            <div className="divide-y divide-border/50">
              {orderBookBids.map((row) => (
                <div key={row.price} className="relative grid grid-cols-3 gap-4 px-4 py-1.5">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: `linear-gradient(to left, hsl(var(--mdl-bid)) ${row.depth}%, transparent ${row.depth}%)`,
                    }}
                  />
                  <span
                    className="relative font-mono text-sm"
                    style={{ color: "hsl(var(--mdl-bid))" }}
                  >
                    {row.price}
                  </span>
                  <span className="relative font-mono text-sm text-right">{row.size}</span>
                  <span className="relative font-mono text-sm text-right text-muted-foreground">
                    {row.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* P&L Display */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">P&L Display</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: "hsl(var(--mdl-pnl-positive))" }} />
                <span
                  className="font-mono text-2xl font-semibold"
                  style={{ color: "hsl(var(--mdl-pnl-positive))" }}
                >
                  +$1,234.56
                </span>
              </div>
              <p
                className="font-mono text-sm mt-1"
                style={{ color: "hsl(var(--mdl-pnl-positive))" }}
              >
                +2.34%
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Realized P&L</p>
              <div className="flex items-center gap-2">
                <TrendingDown
                  className="h-5 w-5"
                  style={{ color: "hsl(var(--mdl-pnl-negative))" }}
                />
                <span
                  className="font-mono text-2xl font-semibold"
                  style={{ color: "hsl(var(--mdl-pnl-negative))" }}
                >
                  -$567.89
                </span>
              </div>
              <p
                className="font-mono text-sm mt-1"
                style={{ color: "hsl(var(--mdl-pnl-negative))" }}
              >
                -1.07%
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Flash Animation Demo */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Flash Animation</h4>
          <p className="mb-4 text-sm text-muted-foreground">
            Price tick animations using CSS keyframes with flash-up (green) and flash-down (red) tokens.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Flash Up (Price Increase)</p>
              <div className="flash-up-demo rounded-md px-4 py-3">
                <span className="font-mono text-xl font-semibold">182.46</span>
                <ArrowUpRight
                  className="inline-block ml-1 h-4 w-4"
                  style={{ color: "hsl(var(--mdl-flash-up))" }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Flash Down (Price Decrease)</p>
              <div className="flash-down-demo rounded-md px-4 py-3">
                <span className="font-mono text-xl font-semibold">182.44</span>
                <ArrowDownRight
                  className="inline-block ml-1 h-4 w-4"
                  style={{ color: "hsl(var(--mdl-flash-down))" }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Accordion
// ---------------------------------------------------------------------------

function AccordionSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <CardTitle>Accordion</CardTitle>
        </div>
        <CardDescription>
          Collapsible content panels for organizing information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is MarketsUI?</AccordionTrigger>
            <AccordionContent>
              MarketsUI is a design system and component library purpose-built for
              financial trading applications. It provides themed, accessible UI
              primitives with trading-specific color tokens for bid/ask, P&L, and
              price flash animations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How does theming work?</AccordionTrigger>
            <AccordionContent>
              Theming uses HSL CSS custom properties that adapt between light and
              dark modes. All shadcn/ui components automatically pick up theme
              changes through Tailwind utility classes that reference these
              semantic tokens.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              What trading data providers are supported?
            </AccordionTrigger>
            <AccordionContent>
              MarketsUI is provider-agnostic. It works with any data feed
              including Bloomberg, Refinitiv, OpenFin, and custom WebSocket
              streams. The component layer is decoupled from the data layer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Alert
// ---------------------------------------------------------------------------

function AlertSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <CardTitle>Alert</CardTitle>
        </div>
        <CardDescription>
          Contextual feedback messages for user actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Market Data Connected</AlertTitle>
          <AlertDescription>
            Real-time feed is active. You are receiving live price updates for
            all subscribed instruments.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Lost</AlertTitle>
          <AlertDescription>
            The market data feed has been disconnected. Prices shown may be
            stale. Attempting to reconnect...
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Avatar
// ---------------------------------------------------------------------------

function AvatarSection() {
  const avatars = [
    { initials: "OM", bg: "bg-blue-600" },
    { initials: "JL", bg: "bg-emerald-600" },
    { initials: "IN", bg: "bg-amber-600" },
    { initials: "WK", bg: "bg-violet-600" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Component className="h-5 w-5 text-primary" />
          <CardTitle>Avatar</CardTitle>
        </div>
        <CardDescription>
          User profile images with fallback initials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {avatars.map((a) => (
            <Avatar key={a.initials}>
              <AvatarFallback className={`${a.bg} text-white text-sm font-medium`}>
                {a.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Checkbox & Radio Group
// ---------------------------------------------------------------------------

function CheckboxRadioSection() {
  const [terms, setTerms] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          <CardTitle>Checkbox & Radio Group</CardTitle>
        </div>
        <CardDescription>
          Selection controls for forms and settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Checkboxes */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Checkboxes</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={terms}
                onCheckedChange={(v) => setTerms(v === true)}
              />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications"
                checked={notifications}
                onCheckedChange={(v) => setNotifications(v === true)}
              />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autosave"
                checked={autoSave}
                onCheckedChange={(v) => setAutoSave(v === true)}
              />
              <Label htmlFor="autosave">Auto-save</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Radio Group */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Radio Group</h4>
          <RadioGroup defaultValue="realtime">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="realtime" id="r1" />
              <Label htmlFor="r1">Realtime</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delayed" id="r2" />
              <Label htmlFor="r2">Delayed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="eod" id="r3" />
              <Label htmlFor="r3">End of Day</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Progress & Slider
// ---------------------------------------------------------------------------

function ProgressSliderSection() {
  const [sliderValue, setSliderValue] = useState([40]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <CardTitle>Progress & Slider</CardTitle>
        </div>
        <CardDescription>
          Visual indicators for progress and range selection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Progress */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Progress</h4>
          <div className="space-y-2">
            <Progress value={65} />
            <p className="text-xs text-muted-foreground">65% complete</p>
          </div>
        </div>

        <Separator />

        {/* Slider */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Slider</h4>
          <div className="space-y-2">
            <Slider
              defaultValue={[40]}
              max={100}
              step={1}
              value={sliderValue}
              onValueChange={setSliderValue}
            />
            <p className="text-xs text-muted-foreground">
              Value: {sliderValue[0]}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Table
// ---------------------------------------------------------------------------

const PNL_POSITIVE_STYLE = { color: "hsl(var(--mdl-pnl-positive))" } as const;
const PNL_NEGATIVE_STYLE = { color: "hsl(var(--mdl-pnl-negative))" } as const;

interface PositionRow {
  symbol: string;
  side: "Buy" | "Sell";
  qty: number;
  avgPrice: number;
  lastPrice: number;
  pnl: number;
  status: "Filled" | "Partial" | "Working";
  exchange: string;
}

const positions: PositionRow[] = [
  { symbol: "AAPL", side: "Buy", qty: 500, avgPrice: 182.45, lastPrice: 185.92, pnl: 1735.00, status: "Filled", exchange: "NASDAQ" },
  { symbol: "GOOGL", side: "Sell", qty: 200, avgPrice: 141.82, lastPrice: 144.50, pnl: -536.00, status: "Filled", exchange: "NASDAQ" },
  { symbol: "MSFT", side: "Buy", qty: 350, avgPrice: 378.91, lastPrice: 381.45, pnl: 889.00, status: "Filled", exchange: "NASDAQ" },
  { symbol: "TSLA", side: "Sell", qty: 100, avgPrice: 248.12, lastPrice: 251.30, pnl: -318.00, status: "Partial", exchange: "NASDAQ" },
  { symbol: "AMZN", side: "Buy", qty: 150, avgPrice: 178.65, lastPrice: 181.20, pnl: 382.50, status: "Filled", exchange: "NASDAQ" },
  { symbol: "META", side: "Buy", qty: 300, avgPrice: 485.20, lastPrice: 492.10, pnl: 2070.00, status: "Filled", exchange: "NASDAQ" },
  { symbol: "NVDA", side: "Buy", qty: 250, avgPrice: 875.40, lastPrice: 889.15, pnl: 3437.50, status: "Filled", exchange: "NASDAQ" },
  { symbol: "JPM", side: "Sell", qty: 400, avgPrice: 198.30, lastPrice: 196.80, pnl: 600.00, status: "Filled", exchange: "NYSE" },
  { symbol: "BAC", side: "Buy", qty: 800, avgPrice: 35.42, lastPrice: 34.90, pnl: -416.00, status: "Partial", exchange: "NYSE" },
  { symbol: "GS", side: "Buy", qty: 120, avgPrice: 465.80, lastPrice: 471.25, pnl: 654.00, status: "Filled", exchange: "NYSE" },
  { symbol: "V", side: "Sell", qty: 180, avgPrice: 278.50, lastPrice: 280.15, pnl: -297.00, status: "Working", exchange: "NYSE" },
  { symbol: "WMT", side: "Buy", qty: 600, avgPrice: 162.35, lastPrice: 164.80, pnl: 1470.00, status: "Filled", exchange: "NYSE" },
  { symbol: "DIS", side: "Sell", qty: 350, avgPrice: 112.40, lastPrice: 110.85, pnl: 542.50, status: "Filled", exchange: "NYSE" },
  { symbol: "NFLX", side: "Buy", qty: 90, avgPrice: 628.90, lastPrice: 635.20, pnl: 567.00, status: "Filled", exchange: "NASDAQ" },
  { symbol: "AMD", side: "Sell", qty: 450, avgPrice: 164.75, lastPrice: 167.30, pnl: -1147.50, status: "Partial", exchange: "NASDAQ" },
  { symbol: "INTC", side: "Buy", qty: 1000, avgPrice: 31.20, lastPrice: 30.85, pnl: -350.00, status: "Working", exchange: "NASDAQ" },
  { symbol: "CRM", side: "Buy", qty: 200, avgPrice: 272.60, lastPrice: 278.40, pnl: 1160.00, status: "Filled", exchange: "NYSE" },
];

const positionColDefs: ColDef<PositionRow>[] = [
  { field: "symbol", headerName: "Symbol", pinned: "left", minWidth: 100 },
  {
    field: "side",
    headerName: "Side",
    minWidth: 80,
    cellStyle: (params) => ({
      color: params.value === "Buy" ? "hsl(158, 68%, 44%)" : "hsl(350, 89%, 60%)",
      fontWeight: 500,
    }),
  },
  {
    field: "qty",
    headerName: "Qty",
    minWidth: 90,
    type: "rightAligned",
    cellStyle: { fontFamily: "var(--font-mono, ui-monospace, monospace)" },
    valueFormatter: (params) => params.value?.toLocaleString() ?? "",
  },
  {
    field: "avgPrice",
    headerName: "Avg Price",
    minWidth: 110,
    type: "rightAligned",
    cellStyle: { fontFamily: "var(--font-mono, ui-monospace, monospace)" },
    valueFormatter: (params) => params.value?.toFixed(2) ?? "",
  },
  {
    field: "lastPrice",
    headerName: "Last Price",
    minWidth: 110,
    type: "rightAligned",
    cellStyle: { fontFamily: "var(--font-mono, ui-monospace, monospace)" },
    valueFormatter: (params) => params.value?.toFixed(2) ?? "",
  },
  {
    field: "pnl",
    headerName: "P&L",
    minWidth: 120,
    type: "rightAligned",
    cellStyle: (params) => ({
      color: params.value >= 0 ? "hsl(158, 68%, 44%)" : "hsl(350, 89%, 60%)",
      fontWeight: 500,
      fontFamily: "var(--font-mono, ui-monospace, monospace)",
    }),
    valueFormatter: (params) => {
      if (params.value == null) return "";
      const sign = params.value >= 0 ? "+" : "";
      return `${sign}${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
  },
  { field: "status", headerName: "Status", minWidth: 100 },
  { field: "exchange", headerName: "Exchange", minWidth: 100 },
];

function TableSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TableIcon className="h-5 w-5 text-primary" />
          <CardTitle>Positions Blotter</CardTitle>
        </div>
        <CardDescription>
          AG Grid with MarketsUI theme — dense layout for trading data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: 500 }}>
          <AgGridReact<PositionRow>
            theme={marketsGridTheme}
            rowData={positions}
            columnDefs={positionColDefs}
            defaultColDef={{ flex: 1, sortable: true, filter: true, resizable: true }}
            rowHeight={32}
            headerHeight={36}
            animateRows={true}
            suppressRowHoverHighlight={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Textarea
// ---------------------------------------------------------------------------

function TextareaSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>Textarea</CardTitle>
        </div>
        <CardDescription>
          Multi-line text input for notes and comments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="trading-notes">Trading Notes</Label>
          <Textarea
            id="trading-notes"
            placeholder="Enter trading notes..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Toggle & Toggle Group
// ---------------------------------------------------------------------------

function ToggleSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ToggleLeft className="h-5 w-5 text-primary" />
          <CardTitle>Toggle & Toggle Group</CardTitle>
        </div>
        <CardDescription>
          Pressable buttons for toggling options on and off.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Single Toggle */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Single Toggle</h4>
          <Toggle aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator />

        {/* Toggle Group */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Toggle Group</h4>
          <ToggleGroup type="single" defaultValue="1D" variant="outline">
            <ToggleGroupItem value="1D">1D</ToggleGroupItem>
            <ToggleGroupItem value="1W">1W</ToggleGroupItem>
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Dropdown Menu
// ---------------------------------------------------------------------------

function DropdownMenuSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5 text-primary" />
          <CardTitle>Dropdown Menu</CardTitle>
        </div>
        <CardDescription>
          Contextual menus for actions and navigation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="mr-2 h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Position Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Position</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Close Position
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Skeleton
// ---------------------------------------------------------------------------

function SkeletonSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-primary" />
          <CardTitle>Skeleton</CardTitle>
        </div>
        <CardDescription>
          Placeholder loading states for content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-10 w-[120px] rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Tabs
// ---------------------------------------------------------------------------

function TabsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Columns3 className="h-5 w-5 text-primary" />
          <CardTitle>Tabs</CardTitle>
        </div>
        <CardDescription>
          Tabbed interface for switching between related content panels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="rounded-md border p-4">
              <h4 className="text-sm font-semibold mb-1">Portfolio Overview</h4>
              <p className="text-sm text-muted-foreground">
                Total value: $1,245,830.00 &mdash; Daily P&L: +$3,420.50
              </p>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="rounded-md border p-4">
              <h4 className="text-sm font-semibold mb-1">Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Sharpe Ratio: 1.82 &mdash; Max Drawdown: -4.3% &mdash; Win Rate: 64%
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="rounded-md border p-4">
              <h4 className="text-sm font-semibold mb-1">Reports</h4>
              <p className="text-sm text-muted-foreground">
                3 reports generated this week. Next scheduled report: Friday 5:00 PM.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Dialog
// ---------------------------------------------------------------------------

function DialogSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          <CardTitle>Dialog</CardTitle>
        </div>
        <CardDescription>
          Modal dialog for confirmations and focused interactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Trade</DialogTitle>
              <DialogDescription>
                Are you sure you want to execute this trade?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Tooltip
// ---------------------------------------------------------------------------

function TooltipSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle>Tooltip</CardTitle>
        </div>
        <CardDescription>
          Contextual information shown on hover.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Bid</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Place a bid order</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Ask</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Place an ask order</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Market</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Execute at market price</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Popover
// ---------------------------------------------------------------------------

function PopoverSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <CardTitle>Popover</CardTitle>
        </div>
        <CardDescription>
          Floating panel anchored to a trigger element.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Order Settings</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tp">Take Profit</Label>
              <Input id="tp" placeholder="e.g. 105.50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sl">Stop Loss</Label>
              <Input id="sl" placeholder="e.g. 98.25" />
            </div>
            <Button className="w-full">Apply</Button>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Table Component
// ---------------------------------------------------------------------------

function TableComponentSection() {
  const bonds = [
    { cusip: "912828ZT6", issuer: "US Treasury", coupon: "2.875%", maturity: "2028-05-15", yield: "4.32%" },
    { cusip: "06051GJH3", issuer: "Bank of America", coupon: "3.500%", maturity: "2029-04-19", yield: "4.78%" },
    { cusip: "459200KG5", issuer: "IBM Corp", coupon: "4.150%", maturity: "2030-07-01", yield: "4.95%" },
    { cusip: "594918BW3", issuer: "Microsoft", coupon: "2.400%", maturity: "2027-08-08", yield: "4.15%" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Table2 className="h-5 w-5 text-primary" />
          <CardTitle>Table</CardTitle>
        </div>
        <CardDescription>
          Styled HTML table for displaying structured data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Sample bond inventory</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>CUSIP</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Coupon</TableHead>
              <TableHead>Maturity</TableHead>
              <TableHead className="text-right">Yield</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonds.map((b) => (
              <TableRow key={b.cusip}>
                <TableCell className="font-mono">{b.cusip}</TableCell>
                <TableCell>{b.issuer}</TableCell>
                <TableCell>{b.coupon}</TableCell>
                <TableCell>{b.maturity}</TableCell>
                <TableCell className="text-right">{b.yield}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Scroll Area
// ---------------------------------------------------------------------------

function ScrollAreaSection() {
  const tickers = [
    { symbol: "AAPL", price: 189.84 },
    { symbol: "MSFT", price: 420.55 },
    { symbol: "GOOGL", price: 175.98 },
    { symbol: "AMZN", price: 186.13 },
    { symbol: "NVDA", price: 878.37 },
    { symbol: "META", price: 503.28 },
    { symbol: "TSLA", price: 175.22 },
    { symbol: "BRK.B", price: 411.63 },
    { symbol: "JPM", price: 198.47 },
    { symbol: "V", price: 281.92 },
    { symbol: "UNH", price: 527.18 },
    { symbol: "JNJ", price: 156.74 },
    { symbol: "WMT", price: 169.35 },
    { symbol: "PG", price: 162.48 },
    { symbol: "HD", price: 363.91 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          <CardTitle>Scroll Area</CardTitle>
        </div>
        <CardDescription>
          Custom scrollable container with styled scrollbar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {tickers.map((t) => (
              <div
                key={t.symbol}
                className="flex items-center justify-between py-1 text-sm"
              >
                <span className="font-mono font-medium">{t.symbol}</span>
                <span className="text-muted-foreground">
                  ${t.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Toast
// ---------------------------------------------------------------------------

function ToastSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" />
          <CardTitle>Toast</CardTitle>
        </div>
        <CardDescription>
          Notification messages that appear temporarily.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Toast requires a Toaster provider at the app root and useToast hook.
            This button demonstrates the trigger pattern; wire up useToast() in
            a real implementation. */}
        <Button
          variant="outline"
          onClick={() => {
            // To enable: import { useToast } from "../components/ui/use-toast"
            // then call toast({ title: "Trade Executed", description: "Bought 100 AAPL @ $189.84" })
          }}
        >
          Show Notification
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Requires Toaster provider and useToast hook to be wired up at the app root.
        </p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Calendar & Date Picker
// ---------------------------------------------------------------------------

function CalendarDatePickerSection() {
  const [demoDate, setDemoDate] = useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calendar & Date Picker</CardTitle>
        <CardDescription>Date selection with calendar popover</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-sm font-medium mb-3 text-muted-foreground">Calendar</p>
            <Calendar mode="single" className="rounded-md border" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3 text-muted-foreground">Date Picker</p>
              <DatePicker placeholder="Select trade date" />
            </div>
            <div>
              <p className="text-sm font-medium mb-3 text-muted-foreground">Date Picker (with date)</p>
              <DatePicker date={demoDate} onSelect={setDemoDate} placeholder="Settlement date" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Breadcrumb
// ---------------------------------------------------------------------------

function BreadcrumbSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          <CardTitle>Breadcrumb</CardTitle>
        </div>
        <CardDescription>Navigation breadcrumb trail for hierarchical pages.</CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Portfolio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Positions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Carousel
// ---------------------------------------------------------------------------

function CarouselSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GalleryHorizontal className="h-5 w-5 text-primary" />
          <CardTitle>Carousel</CardTitle>
        </div>
        <CardDescription>Horizontally scrollable content with navigation controls.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto max-w-sm">
          <Carousel>
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((i) => (
                <CarouselItem key={i}>
                  <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted">
                    <span className="text-2xl font-semibold text-muted-foreground">Card {i}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Chart
// ---------------------------------------------------------------------------

function ChartSection() {
  const chartData = [
    { month: "Jan", volume: 186 },
    { month: "Feb", volume: 305 },
    { month: "Mar", volume: 237 },
    { month: "Apr", volume: 273 },
    { month: "May", volume: 209 },
    { month: "Jun", volume: 314 },
  ];

  const chartConfig: ChartConfig = {
    volume: {
      label: "Volume",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AreaChart className="h-5 w-5 text-primary" />
          <CardTitle>Chart</CardTitle>
        </div>
        <CardDescription>Recharts integration with shadcn chart wrapper.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="volume" fill="var(--color-volume)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Collapsible
// ---------------------------------------------------------------------------

function CollapsibleSection() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PanelLeftClose className="h-5 w-5 text-primary" />
          <CardTitle>Collapsible</CardTitle>
        </div>
        <CardDescription>Expandable section that reveals hidden content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Trade Details</h4>
            <CollapsibleTrigger>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-2 text-sm">
            AAPL &mdash; Buy 100 @ $189.84
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-2 text-sm">
              Order Type: Limit
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              Time in Force: GTC
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              Commission: $1.25
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Command
// ---------------------------------------------------------------------------

function CommandSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <CardTitle>Command</CardTitle>
        </div>
        <CardDescription>
          Searchable command palette for quick actions. Built on top of cmdk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Command className="max-w-md rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Context Menu
// ---------------------------------------------------------------------------

function ContextMenuSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MousePointerClick className="h-5 w-5 text-primary" />
          <CardTitle>Context Menu</CardTitle>
        </div>
        <CardDescription>Right-click triggered menu for contextual actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-24 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Right-click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Buy</ContextMenuItem>
            <ContextMenuItem>Sell</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>View Chart</ContextMenuItem>
            <ContextMenuItem>Add to Watchlist</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Cancel Order</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Drawer
// ---------------------------------------------------------------------------

function DrawerSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PanelBottomOpen className="h-5 w-5 text-primary" />
          <CardTitle>Drawer</CardTitle>
        </div>
        <CardDescription>Bottom sheet drawer for order details and forms.</CardDescription>
      </CardHeader>
      <CardContent>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Order Summary</DrawerTitle>
              <DrawerDescription>Review your order before submitting.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Instrument</span><span className="font-mono">AAPL</span></div>
              <div className="flex justify-between"><span>Side</span><span className="text-green-500">Buy</span></div>
              <div className="flex justify-between"><span>Quantity</span><span className="font-mono">100</span></div>
              <div className="flex justify-between"><span>Price</span><span className="font-mono">$189.84</span></div>
            </div>
            <DrawerFooter>
              <Button>Submit Order</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Hover Card
// ---------------------------------------------------------------------------

function HoverCardSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AtSign className="h-5 w-5 text-primary" />
          <CardTitle>Hover Card</CardTitle>
        </div>
        <CardDescription>Popover content triggered on hover.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Check out{" "}
          <HoverCard>
            <HoverCardTrigger>
              <Button variant="link" className="px-0 h-auto">@AAPL</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Apple Inc.</h4>
                <p className="text-xs text-muted-foreground">NASDAQ: AAPL</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-sm font-bold">$189.84</span>
                  <Badge variant="default" className="text-xs">+1.25%</Badge>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Market Cap: $2.94T &middot; P/E: 31.2
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          for latest pricing.
        </p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Input OTP
// ---------------------------------------------------------------------------

function InputOTPSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <CardTitle>Input OTP</CardTitle>
        </div>
        <CardDescription>One-time password input for 2FA verification.</CardDescription>
      </CardHeader>
      <CardContent>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="mt-2 text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Menubar
// ---------------------------------------------------------------------------

function MenubarSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MenuSquare className="h-5 w-5 text-primary" />
          <CardTitle>Menubar</CardTitle>
        </div>
        <CardDescription>Application menubar like a trading terminal.</CardDescription>
      </CardHeader>
      <CardContent>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New Workspace</MenubarItem>
              <MenubarItem>Open Layout</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Save Layout</MenubarItem>
              <MenubarItem>Export</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Preferences</MenubarItem>
              <MenubarItem>Columns</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Order Book</MenubarItem>
              <MenubarItem>Time &amp; Sales</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Toggle Sidebar</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Navigation Menu
// ---------------------------------------------------------------------------

function NavigationMenuSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <CardTitle>Navigation Menu</CardTitle>
        </div>
        <CardDescription>Horizontal navigation for top-level sections.</CardDescription>
      </CardHeader>
      <CardContent>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" href="#">
                Portfolio
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" href="#">
                Trading
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" href="#">
                Analytics
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Pagination
// ---------------------------------------------------------------------------

function PaginationSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-primary" />
          <CardTitle>Pagination</CardTitle>
        </div>
        <CardDescription>Page navigation for paginated data sets.</CardDescription>
      </CardHeader>
      <CardContent>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Resizable
// ---------------------------------------------------------------------------

function ResizableSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-primary" />
          <CardTitle>Resizable</CardTitle>
        </div>
        <CardDescription>Resizable panels with draggable handles.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResizablePanelGroup orientation="horizontal" className="min-h-[120px] rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium text-muted-foreground">Watchlist</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium text-muted-foreground">Chart</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Sheet
// ---------------------------------------------------------------------------

function SheetSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PanelRight className="h-5 w-5 text-primary" />
          <CardTitle>Sheet</CardTitle>
        </div>
        <CardDescription>Side panel overlay for filters and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet>
          <SheetTrigger>
            <Button variant="outline">Open Filters</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Settings</SheetTitle>
              <SheetDescription>Adjust filters for your trade blotter.</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Instrument</Label>
                <Input placeholder="e.g. AAPL" />
              </div>
              <div className="space-y-2">
                <Label>Side</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="filled-only" />
                <Label htmlFor="filled-only">Filled only</Label>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>
                <Button>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Sonner (Toast)
// ---------------------------------------------------------------------------

function SonnerSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Sonner</CardTitle>
        </div>
        <CardDescription>Lightweight toast notifications via the sonner library.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Trade executed successfully")}>
          Show Toast
        </Button>
        <Button variant="outline" onClick={() => toast.success("Order filled: 100 AAPL @ $189.84")}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error("Order rejected: insufficient margin")}>
          Error
        </Button>
        <p className="mt-2 w-full text-xs text-muted-foreground">
          Requires the Sonner Toaster component to be mounted at the app root.
        </p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section: Input Group
// ---------------------------------------------------------------------------

function InputGroupSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TextCursorInput className="h-5 w-5 text-primary" />
          <CardTitle>Input Group</CardTitle>
        </div>
        <CardDescription>Input with prefix and suffix addon elements.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Price</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <DollarSign className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="0.00" />
          </InputGroup>
        </div>
        <div className="space-y-2">
          <Label>Allocation</Label>
          <InputGroup>
            <InputGroupInput placeholder="50" />
            <InputGroupAddon align="inline-end">
              <Percent className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Design System Page
// ---------------------------------------------------------------------------

export default function DesignSystem() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Design System</h2>
        <p className="text-muted-foreground">
          Visual reference for all MarketsUI design tokens and component patterns.
        </p>
      </div>

      <ColorPaletteSection />
      <TypographySection />
      <SpacingSizingSection />
      <ComponentShowcaseSection />
      <TradingColorsDemoSection />
      <AccordionSection />
      <AlertSection />
      <AvatarSection />
      <CheckboxRadioSection />
      <ProgressSliderSection />
      <TableSection />
      <TextareaSection />
      <ToggleSection />
      <DropdownMenuSection />
      <SkeletonSection />
      <TabsSection />
      <DialogSection />
      <TooltipSection />
      <PopoverSection />
      <TableComponentSection />
      <ScrollAreaSection />
      <ToastSection />
      <CalendarDatePickerSection />
      <BreadcrumbSection />
      <CarouselSection />
      <ChartSection />
      <CollapsibleSection />
      <CommandSection />
      <ContextMenuSection />
      <DrawerSection />
      <HoverCardSection />
      <InputOTPSection />
      <MenubarSection />
      <NavigationMenuSection />
      <PaginationSection />
      <ResizableSection />
      <SheetSection />
      <SonnerSection />
      <InputGroupSection />
    </div>
  );
}
