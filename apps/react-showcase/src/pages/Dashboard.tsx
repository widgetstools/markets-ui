import { useState } from "react";
import {
  CreditCard,
  Apple,
  Check,
  Star,
  Search,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Archive,
  Clock,
  Sparkles,
  Globe,
  ArrowUp,
  Loader2,
  CheckCircle2,
  Paperclip,
  Info,
  Mic,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
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
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";

// ---------------------------------------------------------------------------
// Column 0 — Single tall payment card
// ---------------------------------------------------------------------------

function PaymentCard() {
  const [method, setMethod] = useState<"card" | "paypal" | "apple">("card");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          All transactions are secure and encrypted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment type toggles */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={method === "card" ? "outline" : "ghost"}
            className={`flex flex-col items-center gap-1 h-auto py-3 ${method === "card" ? "!border-primary" : ""}`}
            onClick={() => setMethod("card")}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Card</span>
          </Button>
          <Button
            variant={method === "paypal" ? "outline" : "ghost"}
            className={`flex flex-col items-center gap-1 h-auto py-3 ${method === "paypal" ? "!border-primary" : ""}`}
            onClick={() => setMethod("paypal")}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
            </svg>
            <span className="text-xs">Paypal</span>
          </Button>
          <Button
            variant={method === "apple" ? "outline" : "ghost"}
            className={`flex flex-col items-center gap-1 h-auto py-3 ${method === "apple" ? "!border-primary" : ""}`}
            onClick={() => setMethod("apple")}
          >
            <Apple className="h-5 w-5" />
            <span className="text-xs">Apple</span>
          </Button>
        </div>

        {/* Name on Card */}
        <div className="space-y-2">
          <Label htmlFor="name">Name on Card</Label>
          <Input id="name" placeholder="John Doe" />
        </div>

        {/* Card Number + CVV */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter your 16-digit number.
        </p>

        {/* Month + Year */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Month</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const v = String(i + 1).padStart(2, "0");
                  return (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026, 2027, 2028, 2029].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Billing Address */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Billing Address</p>
          <p className="text-xs text-muted-foreground">
            The billing address associated with your payment method.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox id="same-address" defaultChecked />
            <Label htmlFor="same-address" className="text-sm font-normal">
              Same as shipping address
            </Label>
          </div>
        </div>

        <Separator />

        {/* Comments */}
        <div className="space-y-2">
          <Label>Comments</Label>
          <Textarea placeholder="Add any additional comments" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">Submit</Button>
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Column 1 — 5 cards
// ---------------------------------------------------------------------------

function NoTeamMembersCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center pt-6 pb-6 text-center">
        <div className="flex -space-x-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarFallback className="text-xs">CN</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarFallback className="text-xs">LR</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarFallback className="text-xs">ER</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-sm mb-1">No Team Members</CardTitle>
        <CardDescription className="text-xs mb-4">
          Invite your team to collaborate on this project.
        </CardDescription>
        <Button variant="outline" size="sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Invite Members
        </Button>
      </CardContent>
    </Card>
  );
}

function StatusBadgesRow() {
  return (
    <div className="rounded-lg border bg-card p-3 flex flex-wrap gap-2">
      <Badge variant="outline" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Syncing
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Updating
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Loading
      </Badge>
    </div>
  );
}

function SendMessageRow() {
  return (
    <div className="rounded-lg border bg-card p-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Send a message..."
          className="h-8 text-sm border-0 shadow-none focus-visible:ring-0"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <Mic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PriceRangeCard() {
  const [range, setRange] = useState([200, 800]);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        <CardDescription className="text-xs">
          Set your budget range (${range[0]} - {range[1]}).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Slider
          defaultValue={[200, 800]}
          min={0}
          max={1000}
          step={10}
          onValueChange={setRange}
        />
      </CardContent>
    </Card>
  );
}

function BottomStackCard() {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        {/* Search input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="h-9 pl-8 text-sm" />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            12 results
          </span>
        </div>

        {/* URL input */}
        <div className="flex items-center rounded-md border border-input">
          <span className="px-3 text-sm text-muted-foreground bg-muted border-r border-input rounded-l-md py-1.5">
            https://
          </span>
          <Input
            placeholder="example.com"
            className="border-0 shadow-none focus-visible:ring-0 h-auto py-1.5 text-sm flex-1"
          />
          <Info className="h-4 w-4 text-muted-foreground mr-2.5 shrink-0" />
        </div>

        {/* AI chat input */}
        <Input
          placeholder="Ask, Search or Chat..."
          className="h-9 text-sm"
        />

        {/* Auto / usage row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Plus className="h-3 w-3" />
            <span>Auto</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">52% used</span>
            <Button
              size="icon"
              className="h-7 w-7 rounded-full"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Username input */}
        <div className="relative">
          <Input defaultValue="@shadcn" className="h-9 pr-8 text-sm" />
          <CheckCircle2 className="absolute right-2.5 top-2.5 h-4 w-4 text-green-500" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Column 2 — 4 cards
// ---------------------------------------------------------------------------

function BrowserUrlBar() {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">https://</span>
        <span className="flex-1" />
        <Star className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </div>
  );
}

function AuthProfileCard() {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground">
              Verify via email or phone number.
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            Enable
          </Button>
        </div>
        <Separator />
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          <span className="text-sm flex-1">
            Your profile has been verified.
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

function AppearanceSettings() {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-sm font-medium">Appearance Settings</p>
    </div>
  );
}

function ComputeEnvironmentCard() {
  const [gpus, setGpus] = useState(8);
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {/* Compute Environment */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Compute Environment</p>
          <p className="text-xs text-muted-foreground">
            Select the compute environment for your cluster.
          </p>
        </div>
        <RadioGroup defaultValue="k8s" className="space-y-3">
          <div className="flex items-start space-x-3 rounded-md border border-primary p-3">
            <RadioGroupItem value="k8s" id="k8s" className="mt-0.5" />
            <div>
              <Label htmlFor="k8s" className="text-sm font-medium">
                Kubernetes
              </Label>
              <p className="text-xs text-muted-foreground">
                Run GPU workloads on a K8s configured cluster. This is the
                default.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rounded-md border p-3 opacity-50">
            <RadioGroupItem value="vm" id="vm" disabled className="mt-0.5" />
            <div>
              <Label htmlFor="vm" className="text-sm font-medium">
                Virtual Machine
              </Label>
              <p className="text-xs text-muted-foreground">
                Access a VM configured cluster to run workloads. (Coming soon)
              </p>
            </div>
          </div>
        </RadioGroup>

        <Separator />

        {/* Number of GPUs */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Number of GPUs</p>
          <p className="text-xs text-muted-foreground">
            You can add more later.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setGpus((c) => Math.max(0, c - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-lg font-semibold tabular-nums">
            {gpus}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setGpus((c) => c + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Wallpaper Tinting */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Wallpaper Tinting</p>
            <p className="text-xs text-muted-foreground">
              Allow the wallpaper to be tinted.
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Column 3 — 6 cards (xl only)
// ---------------------------------------------------------------------------

function PromptContextCard() {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <Button variant="outline" size="sm" className="text-xs">
            Add context
          </Button>
        </div>
        <Input
          placeholder="Ask, search, or make anything..."
          className="h-9 text-sm"
        />
        <Separator />
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">Auto</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>All Sources</span>
          </div>
          <span className="flex-1" />
          <Button size="icon" className="h-7 w-7 rounded-full">
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionsBar() {
  return (
    <div className="rounded-lg border bg-card p-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          Archive
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          Report
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          Snooze
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function TermsRow() {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" defaultChecked />
        <Label htmlFor="terms" className="text-sm font-normal leading-snug">
          I agree to the terms and conditions
        </Label>
      </div>
    </div>
  );
}

function PaginationCopilotRow() {
  return (
    <div className="rounded-lg border bg-card p-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((n) => (
          <Button
            key={n}
            variant={n === 1 ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 text-xs"
          >
            {n}
          </Button>
        ))}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="flex-1" />
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
          Copilot
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function SurveyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          How did you hear about us?
        </CardTitle>
        <CardDescription className="text-xs">
          Select the option that best describes how you found us.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          defaultValue="social"
          variant="outline"
          className="grid grid-cols-2 gap-2"
        >
          <ToggleGroupItem
            value="social"
            className="text-xs h-9 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Social Media
          </ToggleGroupItem>
          <ToggleGroupItem
            value="search"
            className="text-xs h-9 rounded-md"
          >
            Search Engine
          </ToggleGroupItem>
          <ToggleGroupItem
            value="referral"
            className="text-xs h-9 rounded-md"
          >
            Referral
          </ToggleGroupItem>
          <ToggleGroupItem
            value="other"
            className="text-xs h-9 rounded-md"
          >
            Other
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}

function ProcessingCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center pt-6 pb-6 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Processing your request</p>
          <p className="text-xs text-muted-foreground">
            Please wait while we process your request. Do not refresh the page.
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Column 0 */}
      <div className="flex flex-col gap-6">
        <PaymentCard />
      </div>

      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <NoTeamMembersCard />
        <StatusBadgesRow />
        <SendMessageRow />
        <PriceRangeCard />
        <BottomStackCard />
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <BrowserUrlBar />
        <AuthProfileCard />
        <AppearanceSettings />
        <ComputeEnvironmentCard />
      </div>

      {/* Column 3 */}
      <div className="hidden xl:flex flex-col gap-6">
        <PromptContextCard />
        <ActionsBar />
        <TermsRow />
        <PaginationCopilotRow />
        <SurveyCard />
        <ProcessingCard />
      </div>
    </div>
  );
}
