import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  X,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";
import { marketsGridTheme } from "@marketsui/tokens/ag-grid-theme";

ModuleRegistry.registerModules([AllCommunityModule]);

// ---------------------------------------------------------------------------
// Color constants — use CSS variable HSL strings for consistency
// ---------------------------------------------------------------------------

const CLR_SUCCESS = "hsl(var(--mdl-success))";
const CLR_SUCCESS_BG = "hsl(var(--mdl-success) / 0.15)";
const CLR_DANGER = "hsl(var(--mdl-destructive))";
const CLR_DANGER_BG = "hsl(var(--mdl-destructive) / 0.15)";
const CLR_WARN = "#EAB308";

// Reusable inline style constants
const MONO: Record<string, string> = { fontFamily: "var(--font-mono, ui-monospace, monospace)", fontFeatureSettings: "'tnum'" };
const MONO_RIGHT: Record<string, string> = { ...MONO, textAlign: "right" };
const TABNUM: React.CSSProperties = { fontFeatureSettings: "'tnum'" };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Position {
  side: "LONG" | "SHORT";
  cusip: string;
  issuer: string;
  description: string;
  rating: string;
  coupon: number;
  maturity: string;
  notional: number;
  price: number;
  mktValue: number;
  yield: number;
  duration: number;
  dv01: number;
  sector: string;
  pnl: number;
}

interface Trade {
  tradeId: string;
  time: string;
  side: "BUY" | "SELL";
  cusip: string;
  issuer: string;
  qty: number;
  price: number;
  status: string;
}

interface RFQ {
  rfqId: string;
  bond: string;
  side: "BID" | "OFFER";
  qty: number;
  bid: number;
  offer: number;
  spread: number;
  status: string;
  dealer: string;
}

interface Order {
  orderId: string;
  side: "BUY" | "SELL";
  cusip: string;
  type: string;
  qty: number;
  limit: number;
  status: string;
  time: string;
}

interface Risk {
  cusip: string;
  issuer: string;
  dv01: number;
  cr01: number;
  spreadDuration: number;
  cs01: number;
  var: number;
}

interface LadderLevel {
  price: number;
  bidSize: number;
  askSize: number;
}

interface OrderPrefill {
  cusip?: string;
  issuer?: string;
  side?: "BUY" | "SELL";
  limitPrice?: number;
}

// ---------------------------------------------------------------------------
// Data: 12 Fixed Income Positions
// ---------------------------------------------------------------------------

const positions: Position[] = [
  { side: "LONG", cusip: "037833AK6", issuer: "Apple Inc", description: "AAPL 4.65 02/23/46", rating: "AA+", coupon: 4.65, maturity: "2046-02-23", notional: 15000000, price: 98.25, mktValue: 14737500, yield: 4.78, duration: 14.2, dv01: 21300, sector: "Technology", pnl: -262500 },
  { side: "LONG", cusip: "060505EN3", issuer: "Bank of America", description: "BAC 3.95 04/21/25", rating: "A-", coupon: 3.95, maturity: "2025-04-21", notional: 10000000, price: 99.45, mktValue: 9945000, yield: 4.12, duration: 3.2, dv01: 3200, sector: "Financials", pnl: -55000 },
  { side: "SHORT", cusip: "46625HJY5", issuer: "JPMorgan Chase", description: "JPM 5.04 01/28/44", rating: "A-", coupon: 5.04, maturity: "2044-01-28", notional: 12000000, price: 101.30, mktValue: 12156000, yield: 4.95, duration: 12.8, dv01: 15360, sector: "Financials", pnl: 156000 },
  { side: "LONG", cusip: "594918BW3", issuer: "Microsoft", description: "MSFT 3.50 02/12/35", rating: "AAA", coupon: 3.50, maturity: "2035-02-12", notional: 20000000, price: 96.80, mktValue: 19360000, yield: 3.88, duration: 8.1, dv01: 16200, sector: "Technology", pnl: -640000 },
  { side: "LONG", cusip: "912828ZT0", issuer: "US Treasury", description: "T 2.875 05/15/52", rating: "AA+", coupon: 2.875, maturity: "2052-05-15", notional: 25000000, price: 82.50, mktValue: 20625000, yield: 3.95, duration: 21.3, dv01: 53250, sector: "Government", pnl: -4375000 },
  { side: "SHORT", cusip: "459200HU8", issuer: "IBM", description: "IBM 4.15 07/27/27", rating: "A-", coupon: 4.15, maturity: "2027-07-27", notional: 8000000, price: 99.10, mktValue: 7928000, yield: 4.35, duration: 4.5, dv01: 3600, sector: "Technology", pnl: 72000 },
  { side: "LONG", cusip: "30231GAV4", issuer: "Exxon Mobil", description: "XOM 4.23 03/19/40", rating: "AA-", coupon: 4.23, maturity: "2040-03-19", notional: 10000000, price: 97.60, mktValue: 9760000, yield: 4.42, duration: 11.5, dv01: 11500, sector: "Energy", pnl: -240000 },
  { side: "LONG", cusip: "478160CD4", issuer: "Johnson & Johnson", description: "JNJ 3.40 01/15/38", rating: "AAA", coupon: 3.40, maturity: "2038-01-15", notional: 15000000, price: 94.20, mktValue: 14130000, yield: 3.92, duration: 10.2, dv01: 15300, sector: "Healthcare", pnl: -870000 },
  { side: "SHORT", cusip: "345370CQ5", issuer: "Ford Motor Credit", description: "F 6.95 03/06/26", rating: "BB+", coupon: 6.95, maturity: "2026-03-06", notional: 5000000, price: 102.80, mktValue: 5140000, yield: 5.85, duration: 2.8, dv01: 1400, sector: "Consumer", pnl: -140000 },
  { side: "LONG", cusip: "92343VGH1", issuer: "Verizon", description: "VZ 4.52 09/15/48", rating: "BBB+", coupon: 4.52, maturity: "2048-09-15", notional: 8000000, price: 91.30, mktValue: 7304000, yield: 5.12, duration: 15.8, dv01: 12640, sector: "Media", pnl: -696000 },
  { side: "LONG", cusip: "244199BF4", issuer: "Deere & Co", description: "DE 3.90 06/09/42", rating: "A", coupon: 3.90, maturity: "2042-06-09", notional: 6500000, price: 95.50, mktValue: 6207500, yield: 4.25, duration: 13.4, dv01: 8710, sector: "Industrials", pnl: -292500 },
  { side: "LONG", cusip: "172967KK2", issuer: "Citigroup", description: "C 5.50 09/13/25", rating: "BBB+", coupon: 5.50, maturity: "2025-09-13", notional: 5000000, price: 100.85, mktValue: 5042500, yield: 5.18, duration: 3.1, dv01: 1550, sector: "Financials", pnl: 42500 },
];

// ---------------------------------------------------------------------------
// Data: Trades
// ---------------------------------------------------------------------------

const trades: Trade[] = [
  { tradeId: "TRD-40281", time: "09:31:04", side: "BUY", cusip: "037833AK6", issuer: "Apple Inc", qty: 5000000, price: 98.25, status: "Filled" },
  { tradeId: "TRD-40282", time: "09:45:22", side: "SELL", cusip: "46625HJY5", issuer: "JPMorgan Chase", qty: 4000000, price: 101.30, status: "Filled" },
  { tradeId: "TRD-40283", time: "10:02:18", side: "BUY", cusip: "594918BW3", issuer: "Microsoft", qty: 10000000, price: 96.80, status: "Filled" },
  { tradeId: "TRD-40284", time: "10:15:43", side: "BUY", cusip: "912828ZT0", issuer: "US Treasury", qty: 25000000, price: 82.50, status: "Filled" },
  { tradeId: "TRD-40285", time: "11:08:56", side: "SELL", cusip: "459200HU8", issuer: "IBM", qty: 8000000, price: 99.10, status: "Filled" },
  { tradeId: "TRD-40286", time: "13:22:11", side: "BUY", cusip: "478160CD4", issuer: "Johnson & Johnson", qty: 15000000, price: 94.20, status: "Filled" },
  { tradeId: "TRD-40287", time: "14:05:39", side: "BUY", cusip: "244199BF4", issuer: "Deere & Co", qty: 6500000, price: 95.50, status: "Partial" },
  { tradeId: "TRD-40288", time: "15:30:02", side: "SELL", cusip: "345370CQ5", issuer: "Ford Motor Credit", qty: 5000000, price: 102.80, status: "Filled" },
];

// ---------------------------------------------------------------------------
// Data: RFQs
// ---------------------------------------------------------------------------

const rfqs: RFQ[] = [
  { rfqId: "RFQ-8810", bond: "AAPL 4.65 02/46", side: "BID", qty: 5000000, bid: 98.10, offer: 98.40, spread: 0.30, status: "Active", dealer: "Goldman Sachs" },
  { rfqId: "RFQ-8811", bond: "BAC 3.95 04/25", side: "OFFER", qty: 3000000, bid: 99.30, offer: 99.60, spread: 0.30, status: "Done", dealer: "Morgan Stanley" },
  { rfqId: "RFQ-8812", bond: "MSFT 3.50 02/35", side: "BID", qty: 10000000, bid: 96.60, offer: 97.00, spread: 0.40, status: "Active", dealer: "Barclays" },
  { rfqId: "RFQ-8813", bond: "T 2.875 05/52", side: "BID", qty: 15000000, bid: 82.25, offer: 82.75, spread: 0.50, status: "Expired", dealer: "Citi" },
  { rfqId: "RFQ-8814", bond: "XOM 4.23 03/40", side: "OFFER", qty: 5000000, bid: 97.40, offer: 97.80, spread: 0.40, status: "Active", dealer: "JPMorgan" },
  { rfqId: "RFQ-8815", bond: "JNJ 3.40 01/38", side: "BID", qty: 8000000, bid: 94.00, offer: 94.40, spread: 0.40, status: "Done", dealer: "BofA Securities" },
  { rfqId: "RFQ-8816", bond: "VZ 4.52 09/48", side: "BID", qty: 4000000, bid: 91.10, offer: 91.50, spread: 0.40, status: "Active", dealer: "Deutsche Bank" },
  { rfqId: "RFQ-8817", bond: "C 5.50 09/25", side: "OFFER", qty: 5000000, bid: 100.70, offer: 101.00, spread: 0.30, status: "Done", dealer: "Wells Fargo" },
];

// ---------------------------------------------------------------------------
// Data: Orders
// ---------------------------------------------------------------------------

const ORDERS: Order[] = [
  { orderId: "ORD-12040", side: "BUY", cusip: "037833AK6", type: "Limit", qty: 5000000, limit: 98.00, status: "Working", time: "09:30:00" },
  { orderId: "ORD-12041", side: "SELL", cusip: "46625HJY5", type: "Market", qty: 4000000, limit: 0, status: "Filled", time: "09:45:18" },
  { orderId: "ORD-12042", side: "BUY", cusip: "594918BW3", type: "Limit", qty: 10000000, limit: 96.50, status: "Working", time: "10:00:05" },
  { orderId: "ORD-12043", side: "BUY", cusip: "912828ZT0", type: "Limit", qty: 25000000, limit: 82.25, status: "Filled", time: "10:15:00" },
  { orderId: "ORD-12044", side: "SELL", cusip: "459200HU8", type: "Market", qty: 8000000, limit: 0, status: "Filled", time: "11:08:30" },
  { orderId: "ORD-12045", side: "BUY", cusip: "478160CD4", type: "Limit", qty: 15000000, limit: 94.00, status: "Cancelled", time: "13:20:00" },
  { orderId: "ORD-12046", side: "BUY", cusip: "244199BF4", type: "Limit", qty: 6500000, limit: 95.25, status: "Partial", time: "14:05:00" },
  { orderId: "ORD-12047", side: "SELL", cusip: "345370CQ5", type: "Market", qty: 5000000, limit: 0, status: "Filled", time: "15:29:45" },
];

// ---------------------------------------------------------------------------
// Data: Risk
// ---------------------------------------------------------------------------

const riskData: Risk[] = [
  { cusip: "037833AK6", issuer: "Apple Inc", dv01: 21300, cr01: 18200, spreadDuration: 13.8, cs01: 19500, var: 312000 },
  { cusip: "060505EN3", issuer: "Bank of America", dv01: 3200, cr01: 2800, spreadDuration: 3.0, cs01: 2950, var: 48000 },
  { cusip: "46625HJY5", issuer: "JPMorgan Chase", dv01: 15360, cr01: 13100, spreadDuration: 12.4, cs01: 14200, var: 228000 },
  { cusip: "594918BW3", issuer: "Microsoft", dv01: 16200, cr01: 13900, spreadDuration: 7.8, cs01: 15100, var: 245000 },
  { cusip: "912828ZT0", issuer: "US Treasury", dv01: 53250, cr01: 0, spreadDuration: 0, cs01: 0, var: 485000 },
  { cusip: "459200HU8", issuer: "IBM", dv01: 3600, cr01: 3100, spreadDuration: 4.2, cs01: 3350, var: 54000 },
  { cusip: "30231GAV4", issuer: "Exxon Mobil", dv01: 11500, cr01: 9800, spreadDuration: 11.1, cs01: 10600, var: 172000 },
  { cusip: "478160CD4", issuer: "Johnson & Johnson", dv01: 15300, cr01: 13100, spreadDuration: 9.8, cs01: 14200, var: 230000 },
  { cusip: "345370CQ5", issuer: "Ford Motor Credit", dv01: 1400, cr01: 1200, spreadDuration: 2.6, cs01: 1300, var: 42000 },
  { cusip: "92343VGH1", issuer: "Verizon", dv01: 12640, cr01: 10800, spreadDuration: 15.2, cs01: 11700, var: 190000 },
  { cusip: "244199BF4", issuer: "Deere & Co", dv01: 8710, cr01: 7450, spreadDuration: 12.9, cs01: 8100, var: 131000 },
  { cusip: "172967KK2", issuer: "Citigroup", dv01: 1550, cr01: 1330, spreadDuration: 2.9, cs01: 1440, var: 46500 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRatingColor(rating: string): string {
  if (rating === "AAA" || rating.startsWith("AA")) return CLR_SUCCESS;
  if (rating.startsWith("A")) return CLR_WARN;
  if (rating.startsWith("BBB")) return "#F97316";
  return CLR_DANGER;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return "$" + (value / 1_000_000).toFixed(2) + "M";
  }
  return "$" + value.toLocaleString("en-US");
}

function formatPnl(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  if (Math.abs(value) >= 1_000_000) {
    return prefix + "$" + (value / 1_000_000).toFixed(2) + "M";
  }
  return prefix + "$" + value.toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// Helper: deterministic pseudo-random from string seed
// ---------------------------------------------------------------------------

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (Math.imul(16807, h) + 1) | 0;
    return (h >>> 0) / 4294967296;
  };
}

const IG_RATINGS = new Set([
  "AAA", "AA+", "AA", "AA-", "A+", "A", "A-",
  "BBB+", "BBB", "BBB-",
]);

function generateLadderLevels(position: Position): LadderLevel[] {
  const rng = seededRandom(position.cusip);
  const isIG = IG_RATINGS.has(position.rating);
  const spread = isIG ? 0.125 : 0.50;
  const tick = spread / 10;
  const bestBid = position.price - spread / 2;
  const bestAsk = position.price + spread / 2;

  const levels: LadderLevel[] = [];

  for (let i = 0; i < 10; i++) {
    const price = bestAsk + i * tick;
    const factor = 1 - i / 9;
    const minSize = 1 + factor * 14;
    const maxSize = 3 + factor * 22;
    const size = minSize + rng() * (maxSize - minSize);
    levels.push({ price: Math.round(price * 1000) / 1000, bidSize: 0, askSize: Math.round(size * 100) / 100 });
  }

  for (let i = 0; i < 10; i++) {
    const price = bestBid - i * tick;
    const factor = 1 - i / 9;
    const minSize = 1 + factor * 14;
    const maxSize = 3 + factor * 22;
    const size = minSize + rng() * (maxSize - minSize);
    levels.push({ price: Math.round(price * 1000) / 1000, bidSize: Math.round(size * 100) / 100, askSize: 0 });
  }

  levels.sort((a, b) => b.price - a.price);
  return levels;
}

function formatSize(val: number): string {
  if (val >= 1) return val.toFixed(1) + "M";
  return (val * 1000).toFixed(0) + "K";
}

// ---------------------------------------------------------------------------
// Sector Allocation Data
// ---------------------------------------------------------------------------

const sectorAllocation = [
  { sector: "Financials", pct: 24.5, color: "#6366F1" },
  { sector: "Technology", pct: 21.2, color: "#06B6D4" },
  { sector: "Government", pct: 18.1, color: "#8B5CF6" },
  { sector: "Healthcare", pct: 11.0, color: "#10B981" },
  { sector: "Industrials", pct: 10.8, color: "#F59E0B" },
  { sector: "Consumer", pct: 10.4, color: "#EF4444" },
  { sector: "Media", pct: 3.9, color: "#EC4899" },
];

// ---------------------------------------------------------------------------
// Side badge HTML (shared by grids)
// ---------------------------------------------------------------------------

function sideBadgeHtml(value: string, buyLabel: string, sellLabel: string): string {
  const isBuy = value === buyLabel;
  const bg = isBuy ? "hsl(var(--mdl-success) / 0.15)" : "hsl(var(--mdl-destructive) / 0.15)";
  const fg = isBuy ? "hsl(var(--mdl-success))" : "hsl(var(--mdl-destructive))";
  return `<span style="display:inline-flex;align-items:center;padding:1px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:${bg};color:${fg}">${value}</span>`;
}

// ---------------------------------------------------------------------------
// Column Definitions: Positions
// ---------------------------------------------------------------------------

const positionColDefs: ColDef<Position>[] = [
  {
    field: "side",
    headerName: "Side",
    width: 90,
    cellRenderer: (params: { value: string }) => {
      if (!params.value) return null;
      return sideBadgeHtml(params.value, "LONG", "SHORT");
    },
  },
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO },
  { field: "issuer", headerName: "Issuer", width: 160 },
  { field: "description", headerName: "Description", width: 170, cellStyle: () => MONO },
  {
    field: "rating",
    headerName: "Rating",
    width: 85,
    cellStyle: (params) => ({
      color: getRatingColor(params.value ?? ""),
      fontWeight: 600,
    }),
  },
  {
    field: "coupon",
    headerName: "Coupon",
    width: 90,
    cellStyle: () => MONO,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(3) + "%" : "",
  },
  { field: "maturity", headerName: "Maturity", width: 110, cellStyle: () => MONO },
  {
    field: "notional",
    headerName: "Notional",
    width: 120,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "price",
    headerName: "Price",
    width: 85,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "mktValue",
    headerName: "Mkt Value",
    width: 120,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "yield",
    headerName: "Yield",
    width: 80,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) + "%" : "",
  },
  {
    field: "duration",
    headerName: "Duration",
    width: 90,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(1) : "",
  },
  {
    field: "dv01",
    headerName: "DV01",
    width: 100,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
];

// ---------------------------------------------------------------------------
// Column Definitions: Trades
// ---------------------------------------------------------------------------

const tradeColDefs: ColDef<Trade>[] = [
  { field: "tradeId", headerName: "Trade ID", width: 110, cellStyle: () => MONO },
  { field: "time", headerName: "Time", width: 100, cellStyle: () => MONO },
  {
    field: "side",
    headerName: "Side",
    width: 80,
    cellRenderer: (params: { value: string }) => {
      if (!params.value) return null;
      return sideBadgeHtml(params.value, "BUY", "SELL");
    },
  },
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO },
  { field: "issuer", headerName: "Issuer", width: 160 },
  {
    field: "qty",
    headerName: "Qty",
    width: 120,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "price",
    headerName: "Price",
    width: 85,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    cellStyle: (params) => ({
      color: params.value === "Filled" ? CLR_SUCCESS : params.value === "Partial" ? CLR_WARN : "",
      fontWeight: 600,
    }),
  },
];

// ---------------------------------------------------------------------------
// Column Definitions: RFQs
// ---------------------------------------------------------------------------

const rfqColDefs: ColDef<RFQ>[] = [
  { field: "rfqId", headerName: "RFQ ID", width: 100, cellStyle: () => MONO },
  { field: "bond", headerName: "Bond", width: 150, cellStyle: () => MONO },
  {
    field: "side",
    headerName: "Side",
    width: 80,
    cellStyle: (params) => ({
      color: params.value === "BID" ? CLR_SUCCESS : CLR_WARN,
      fontWeight: 600,
    }),
  },
  {
    field: "qty",
    headerName: "Qty",
    width: 110,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "bid",
    headerName: "Bid",
    width: 80,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "offer",
    headerName: "Offer",
    width: 80,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "spread",
    headerName: "Spread",
    width: 80,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    cellStyle: (params) => ({
      color: params.value === "Done" ? CLR_SUCCESS : params.value === "Active" ? CLR_WARN : "hsl(var(--muted-foreground))",
      fontWeight: 600,
    }),
  },
  { field: "dealer", headerName: "Dealer", width: 140 },
];

// ---------------------------------------------------------------------------
// Column Definitions: Orders
// ---------------------------------------------------------------------------

const orderColDefs: ColDef<Order>[] = [
  { field: "orderId", headerName: "Order ID", width: 110, cellStyle: () => MONO },
  {
    field: "side",
    headerName: "Side",
    width: 80,
    cellRenderer: (params: { value: string }) => {
      if (!params.value) return null;
      return sideBadgeHtml(params.value, "BUY", "SELL");
    },
  },
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO },
  { field: "type", headerName: "Type", width: 80 },
  {
    field: "qty",
    headerName: "Qty",
    width: 120,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "limit",
    headerName: "Limit",
    width: 85,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null && params.value > 0 ? params.value.toFixed(2) : "MKT",
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    cellStyle: (params) => ({
      color: params.value === "Filled" ? CLR_SUCCESS : params.value === "Working" ? CLR_WARN : params.value === "Partial" ? "#F97316" : params.value === "Cancelled" ? CLR_DANGER : "",
      fontWeight: 600,
    }),
  },
  { field: "time", headerName: "Time", width: 100, cellStyle: () => MONO },
];

// ---------------------------------------------------------------------------
// Column Definitions: Risk
// ---------------------------------------------------------------------------

const riskColDefs: ColDef<Risk>[] = [
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO },
  { field: "issuer", headerName: "Issuer", width: 160 },
  {
    field: "dv01",
    headerName: "DV01",
    width: 100,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "cr01",
    headerName: "CR01",
    width: 100,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "spreadDuration",
    headerName: "Sprd Dur",
    width: 95,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(1) : "",
  },
  {
    field: "cs01",
    headerName: "CS01",
    width: 100,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "var",
    headerName: "VaR",
    width: 110,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
];

// ---------------------------------------------------------------------------
// Default Column Definition
// ---------------------------------------------------------------------------

const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
};

// ---------------------------------------------------------------------------
// Component: Order Ticket Dialog (compact, dense)
// ---------------------------------------------------------------------------

function OrderTicketDialog({
  open,
  onOpenChange,
  prefill,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: OrderPrefill;
  onSubmit: (order: Order) => void;
}) {
  const [side, setSide] = useState<"BUY" | "SELL">(prefill?.side ?? "BUY");
  const [cusip, setCusip] = useState(prefill?.cusip ?? "");
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "Stop">("Limit");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState(prefill?.limitPrice?.toFixed(3) ?? "");
  const [tif, setTif] = useState("DAY");
  const [account, setAccount] = useState("CREDIT-MAIN");

  const resolvedIssuer = useMemo(() => {
    if (prefill?.issuer) return prefill.issuer;
    const pos = positions.find((p) => p.cusip === cusip);
    return pos?.issuer ?? "";
  }, [cusip, prefill?.issuer]);

  const prefillKey = `${prefill?.cusip}-${prefill?.side}-${prefill?.limitPrice}`;
  const [lastPrefillKey, setLastPrefillKey] = useState(prefillKey);
  if (prefillKey !== lastPrefillKey) {
    setLastPrefillKey(prefillKey);
    setSide(prefill?.side ?? "BUY");
    setCusip(prefill?.cusip ?? "");
    setLimitPrice(prefill?.limitPrice?.toFixed(3) ?? "");
    setOrderType(prefill?.limitPrice ? "Limit" : "Limit");
  }

  const handleSubmit = () => {
    const qty = parseFloat(quantity) || 0;
    const lim = parseFloat(limitPrice) || 0;
    const now = new Date();
    const timeStr = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
    const order: Order = {
      orderId: `ORD-${12048 + Math.floor(Math.random() * 9000)}`,
      side,
      cusip,
      type: orderType,
      qty: qty * 1_000_000,
      limit: orderType === "Market" ? 0 : lim,
      status: "Working",
      time: timeStr,
    };
    onSubmit(order);
    onOpenChange(false);
  };

  const selectClass =
    "flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring";

  const topBorderColor = side === "BUY" ? CLR_SUCCESS : CLR_DANGER;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] p-0 gap-0 overflow-hidden">
        {/* Colored top accent bar */}
        <div className="h-0.5" style={{ background: topBorderColor }} />

        <DialogHeader className="px-4 pt-3 pb-2">
          <DialogTitle className="text-sm font-semibold">New Order</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-3 space-y-3">
          {/* Side toggle — connected pills */}
          <div className="flex rounded-md overflow-hidden border border-border h-7">
            <button
              type="button"
              className="flex-1 text-xs font-semibold transition-colors"
              style={{
                background: side === "BUY" ? CLR_SUCCESS : "transparent",
                color: side === "BUY" ? "#fff" : "hsl(var(--muted-foreground))",
              }}
              onClick={() => setSide("BUY")}
            >
              Buy
            </button>
            <button
              type="button"
              className="flex-1 text-xs font-semibold transition-colors border-l border-border"
              style={{
                background: side === "SELL" ? CLR_DANGER : "transparent",
                color: side === "SELL" ? "#fff" : "hsl(var(--muted-foreground))",
              }}
              onClick={() => setSide("SELL")}
            >
              Sell
            </button>
          </div>

          {/* Row 1: CUSIP + Issuer */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">CUSIP</Label>
              <Input
                value={cusip}
                onChange={(e) => setCusip(e.target.value)}
                placeholder="037833AK6"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Issuer</Label>
              <div className="h-8 flex items-center px-2 rounded-md bg-muted text-xs font-medium truncate">
                {resolvedIssuer || "\u2014"}
              </div>
            </div>
          </div>

          {/* Row 2: Type + TIF */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Type</Label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as "Limit" | "Market" | "Stop")}
                className={selectClass}
              >
                <option value="Limit">Limit</option>
                <option value="Market">Market</option>
                <option value="Stop">Stop</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">TIF</Label>
              <select value={tif} onChange={(e) => setTif(e.target.value)} className={selectClass}>
                <option value="DAY">Day</option>
                <option value="GTC">GTC</option>
                <option value="IOC">IOC</option>
                <option value="FOK">FOK</option>
              </select>
            </div>
          </div>

          {/* Row 3: Qty + Limit */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Qty ($M)</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="5"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {orderType === "Market" ? "Price" : "Limit"}
              </Label>
              {orderType === "Market" ? (
                <div className="h-8 flex items-center px-2 rounded-md bg-muted text-xs font-mono text-muted-foreground">
                  MKT
                </div>
              ) : (
                <Input
                  type="number"
                  step="0.001"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder="98.250"
                  className="h-8 text-xs font-mono"
                />
              )}
            </div>
          </div>

          {/* Account */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Account</Label>
            <select value={account} onChange={(e) => setAccount(e.target.value)} className={selectClass}>
              <option value="CREDIT-MAIN">CREDIT-MAIN</option>
              <option value="CREDIT-PROP">CREDIT-PROP</option>
              <option value="RATES-HEDGE">RATES-HEDGE</option>
            </select>
          </div>
        </div>

        <DialogFooter className="px-4 pb-3 pt-0">
          <div className="flex gap-2 justify-end w-full">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs"
              style={{ background: topBorderColor, color: "#fff" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Component: Price Ladder (monospace table, tight rows, cumulative size)
// ---------------------------------------------------------------------------

function PriceLadder({
  position,
  onPriceClick,
}: {
  position: Position;
  onPriceClick: (price: number, side: "BUY" | "SELL") => void;
}) {
  const levels = useMemo(() => generateLadderLevels(position), [position]);
  const isIG = IG_RATINGS.has(position.rating);
  const spread = isIG ? 0.125 : 0.50;
  const spreadBps = (spread / position.price) * 10000;

  const maxBidSize = Math.max(...levels.map((l) => l.bidSize));
  const maxAskSize = Math.max(...levels.map((l) => l.askSize));

  const bestAskLevel = levels.filter((l) => l.askSize > 0).at(-1);
  const bestBidLevel = levels.filter((l) => l.bidSize > 0).at(0);

  // Compute cumulative sizes
  const askLevels = levels.filter((l) => l.askSize > 0); // sorted desc by price
  const bidLevels = levels.filter((l) => l.bidSize > 0); // sorted desc by price

  const cumAsk = new Map<number, number>();
  let cumAskTotal = 0;
  // Accumulate from worst (top) to best (bottom)
  for (const l of askLevels) {
    cumAskTotal += l.askSize;
    cumAsk.set(l.price, cumAskTotal);
  }

  const cumBid = new Map<number, number>();
  let cumBidTotal = 0;
  // Accumulate from best (top) to worst (bottom)
  for (const l of bidLevels) {
    cumBidTotal += l.bidSize;
    cumBid.set(l.price, cumBidTotal);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-1.5 border-b">
        <p className="text-xs font-semibold" style={MONO}>{position.description}</p>
        <p className="text-[10px] text-muted-foreground">{position.issuer} &middot; {position.rating}</p>
      </div>

      {/* Column Headers */}
      <div
        className="grid px-2 py-1 text-[10px] text-muted-foreground font-medium border-b uppercase tracking-wider"
        style={{ gridTemplateColumns: "1fr 1fr 70px 1fr 1fr" }}
      >
        <span className="text-right">Cum</span>
        <span className="text-right">Bid</span>
        <span className="text-center">Price</span>
        <span className="text-right">Ask</span>
        <span className="text-right">Cum</span>
      </div>

      {/* Levels */}
      <ScrollArea className="flex-1">
        <div>
          {levels.map((level, i) => {
            const isAsk = level.askSize > 0;
            const isBid = level.bidSize > 0;
            const isBestBid = bestBidLevel && level.price === bestBidLevel.price && isBid;
            const isBestAsk = bestAskLevel && level.price === bestAskLevel.price && isAsk;

            // Detect spread gap row
            const nextLevel = levels[i + 1];
            const isSpreadRow = isAsk && nextLevel && nextLevel.bidSize > 0;

            let bg = "transparent";
            if (isAsk) {
              const intensity = level.askSize / maxAskSize;
              const alpha = isBestAsk ? Math.max(intensity * 0.2, 0.12) : intensity * 0.12;
              bg = `hsl(var(--mdl-destructive) / ${alpha.toFixed(3)})`;
            } else if (isBid) {
              const intensity = level.bidSize / maxBidSize;
              const alpha = isBestBid ? Math.max(intensity * 0.2, 0.12) : intensity * 0.12;
              bg = `hsl(var(--mdl-success) / ${alpha.toFixed(3)})`;
            }

            return (
              <div key={i}>
                <div
                  className="grid px-2 cursor-pointer hover:bg-accent/50 transition-colors"
                  style={{
                    gridTemplateColumns: "1fr 1fr 70px 1fr 1fr",
                    background: bg,
                    height: 24,
                    alignItems: "center",
                    borderLeft: isBestBid ? `2px solid ${CLR_SUCCESS}` : isBestAsk ? `2px solid ${CLR_DANGER}` : "2px solid transparent",
                  }}
                  onClick={() => onPriceClick(level.price, isAsk ? "BUY" : "SELL")}
                >
                  <span className="text-right font-mono text-[11px] text-muted-foreground" style={TABNUM}>
                    {isBid ? formatSize(cumBid.get(level.price) ?? 0) : ""}
                  </span>
                  <span className="text-right font-mono text-[11px]" style={TABNUM}>
                    {isBid ? formatSize(level.bidSize) : ""}
                  </span>
                  <span
                    className={`text-center font-mono text-[11px] ${
                      isBestBid ? "font-bold" : isBestAsk ? "font-bold" : ""
                    }`}
                    style={{
                      ...TABNUM,
                      color: isBestBid ? CLR_SUCCESS : isBestAsk ? CLR_DANGER : undefined,
                    }}
                  >
                    {level.price.toFixed(3)}
                  </span>
                  <span className="text-right font-mono text-[11px]" style={TABNUM}>
                    {isAsk ? formatSize(level.askSize) : ""}
                  </span>
                  <span className="text-right font-mono text-[11px] text-muted-foreground" style={TABNUM}>
                    {isAsk ? formatSize(cumAsk.get(level.price) ?? 0) : ""}
                  </span>
                </div>
                {/* Spread indicator between best ask and best bid */}
                {isSpreadRow && (
                  <div
                    className="flex items-center justify-center border-y border-dashed border-border/60"
                    style={{ height: 20 }}
                  >
                    <span className="text-[10px] font-mono text-muted-foreground tracking-wide" style={TABNUM}>
                      Spread: {spreadBps.toFixed(1)} bps
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component: Portfolio Summary Strip (sleek, divider-separated)
// ---------------------------------------------------------------------------

function PortfolioSummary() {
  const metrics = [
    { label: "Total Notional", value: "$139.50M", sub: "12 positions", accent: "hsl(var(--mdl-success))", icon: DollarSign },
    { label: "Market Value", value: "$137.54M", sub: "Mark-to-market", accent: "hsl(var(--mdl-success))", icon: TrendingUp },
    { label: "Total P&L", value: "-$1.65M", sub: "-1.18% unrealized", accent: CLR_DANGER, icon: TrendingDown, valueColor: CLR_DANGER },
    { label: "DV01", value: "$181,327", sub: "Dollar value of 1bp", accent: CLR_WARN, icon: Shield },
  ];

  return (
    <div className="flex rounded-lg border bg-card overflow-hidden">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="flex-1 relative px-4 py-3"
          style={{ borderTop: `2px solid ${m.accent}` }}
        >
          {/* Divider */}
          {i > 0 && (
            <div className="absolute left-0 top-3 bottom-3 w-px bg-border" />
          )}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              {m.label}
            </span>
            <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div
            className="text-xl font-bold font-mono"
            style={{ ...TABNUM, color: m.valueColor }}
          >
            {m.value}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{m.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component: Sector Allocation Bar (sleek thin bar, inline labels)
// ---------------------------------------------------------------------------

function SectorAllocationBar() {
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          Sector Allocation
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Thin bar */}
        <div className="flex h-[3px] flex-1 overflow-hidden rounded-full">
          {sectorAllocation.map((s) => (
            <div
              key={s.sector}
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              className="h-full transition-all hover:brightness-125 hover:shadow-[0_0_6px_currentColor]"
              title={`${s.sector}: ${s.pct}%`}
            />
          ))}
        </div>
        {/* Inline labels */}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 shrink-0">
          {sectorAllocation.map((s) => (
            <div key={s.sector} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.sector} {s.pct}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component: Bond Detail Panel (grouped metrics, polished)
// ---------------------------------------------------------------------------

function BondDetailPanel({
  position,
  onClose,
  onTrade,
  onPriceClick,
}: {
  position: Position;
  onClose: () => void;
  onTrade: () => void;
  onPriceClick: (price: number, side: "BUY" | "SELL") => void;
}) {
  const pnlColor = position.pnl >= 0 ? CLR_SUCCESS : CLR_DANGER;
  const pnlBg = position.pnl >= 0 ? "hsl(var(--mdl-success) / 0.08)" : "hsl(var(--mdl-destructive) / 0.08)";

  const sectionHeader = (title: string) => (
    <div className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mt-3 mb-1.5 first:mt-0">
      {title}
    </div>
  );

  const metric = (label: string, value: string, mono = true) => (
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-medium" style={mono ? MONO : undefined}>{value}</p>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-3 px-3">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold truncate">{position.issuer}</CardTitle>
          <p className="text-[11px] text-muted-foreground font-mono" style={TABNUM}>
            {position.description}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px] px-2"
            onClick={onTrade}
          >
            Trade
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="details" className="flex flex-col h-full">
          <TabsList className="mx-3 mb-0 w-fit h-7">
            <TabsTrigger value="details" className="text-[11px] h-6 px-2.5">Details</TabsTrigger>
            <TabsTrigger value="ladder" className="text-[11px] h-6 px-2.5">Ladder</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex-1 overflow-auto px-3 pb-3 mt-2">
            {/* P&L display — prominent with subtle background bar */}
            <div
              className="rounded-md px-3 py-2 mb-3"
              style={{ background: pnlBg }}
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Unrealized P&amp;L</p>
              <p className="text-xl font-bold font-mono" style={{ ...TABNUM, color: pnlColor }}>
                {formatPnl(position.pnl)}
              </p>
            </div>

            {/* Identity */}
            {sectionHeader("Identity")}
            <div className="grid grid-cols-3 gap-y-2 gap-x-2 text-xs">
              {metric("CUSIP", position.cusip)}
              <div>
                <p className="text-[10px] text-muted-foreground">Rating</p>
                <p className="text-xs font-semibold" style={{ color: getRatingColor(position.rating) }}>
                  {position.rating}
                </p>
              </div>
              {metric("Sector", position.sector, false)}
            </div>

            {/* Pricing */}
            {sectionHeader("Pricing")}
            <div className="grid grid-cols-3 gap-y-2 gap-x-2 text-xs">
              {metric("Price", position.price.toFixed(2))}
              {metric("Yield", position.yield.toFixed(2) + "%")}
              {metric("Coupon", position.coupon.toFixed(3) + "%")}
            </div>

            {/* Risk */}
            {sectionHeader("Risk")}
            <div className="grid grid-cols-3 gap-y-2 gap-x-2 text-xs">
              {metric("Duration", position.duration.toFixed(1))}
              {metric("DV01", "$" + formatNumber(position.dv01))}
              {metric("Notional", formatCurrency(position.notional))}
            </div>

            {/* Side + Maturity */}
            {sectionHeader("Position")}
            <div className="grid grid-cols-3 gap-y-2 gap-x-2 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground">Side</p>
                <Badge variant={position.side === "LONG" ? "default" : "destructive"} className="text-[10px] h-4 px-1.5">
                  {position.side}
                </Badge>
              </div>
              {metric("Maturity", position.maturity)}
              {metric("Mkt Value", formatCurrency(position.mktValue))}
            </div>
          </TabsContent>
          <TabsContent value="ladder" className="flex-1 overflow-hidden mt-0">
            <PriceLadder
              position={position}
              onPriceClick={onPriceClick}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Component: Trading Page
// ---------------------------------------------------------------------------

export default function Trading() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [orderTicketOpen, setOrderTicketOpen] = useState(false);
  const [orderPrefill, setOrderPrefill] = useState<OrderPrefill>({});
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const openOrderTicket = (prefill?: OrderPrefill) => {
    setOrderPrefill(prefill ?? {});
    setOrderTicketOpen(true);
  };

  const handleOrderSubmit = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <div className="space-y-3">
      {/* Page Header — clean toolbar row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Fixed Income Trading</h2>
          {/* Live status pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2 py-0.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: CLR_SUCCESS,
                boxShadow: `0 0 4px ${CLR_SUCCESS}`,
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Live</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono" style={TABNUM}>
            As of 15:42:31 ET
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => openOrderTicket()}
        >
          <Plus className="h-3 w-3" />
          Order
        </Button>
      </div>

      {/* Pulse animation keyframe */}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Order Ticket Dialog */}
      <OrderTicketDialog
        open={orderTicketOpen}
        onOpenChange={setOrderTicketOpen}
        prefill={orderPrefill}
        onSubmit={handleOrderSubmit}
      />

      {/* Portfolio Summary Strip */}
      <PortfolioSummary />

      {/* Sector Allocation */}
      <SectorAllocationBar />

      {/* Positions Blotter + Detail Panel */}
      <div className={`grid gap-3 ${selectedPosition ? "grid-cols-[1fr_340px]" : "grid-cols-1"}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Positions Blotter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 400 }}>
              <AgGridReact<Position>
                theme={marketsGridTheme}
                rowData={positions}
                columnDefs={positionColDefs}
                defaultColDef={defaultColDef}
                rowHeight={28}
                headerHeight={30}
                animateRows={true}
                rowSelection="single"
                onRowClicked={(event) => {
                  if (event.data) setSelectedPosition(event.data);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {selectedPosition && (
          <BondDetailPanel
            position={selectedPosition}
            onClose={() => setSelectedPosition(null)}
            onTrade={() =>
              openOrderTicket({
                cusip: selectedPosition.cusip,
                issuer: selectedPosition.issuer,
              })
            }
            onPriceClick={(price, side) =>
              openOrderTicket({
                cusip: selectedPosition.cusip,
                issuer: selectedPosition.issuer,
                side,
                limitPrice: price,
              })
            }
          />
        )}
      </div>

      {/* Bottom Tabs: Trades / RFQs / Orders / Risk */}
      <Tabs defaultValue="trades">
        <TabsList className="h-8">
          <TabsTrigger value="trades" className="text-xs h-6 px-2.5 gap-1">
            Trades
            <span className="text-[10px] font-mono rounded-full bg-muted px-1.5 py-px" style={TABNUM}>
              {trades.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="rfqs" className="text-xs h-6 px-2.5 gap-1">
            RFQs
            <span className="text-[10px] font-mono rounded-full bg-muted px-1.5 py-px" style={TABNUM}>
              {rfqs.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs h-6 px-2.5 gap-1">
            Orders
            <span className="text-[10px] font-mono rounded-full bg-muted px-1.5 py-px" style={TABNUM}>
              {orders.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="text-xs h-6 px-2.5 gap-1">
            Risk
            <span className="text-[10px] font-mono rounded-full bg-muted px-1.5 py-px" style={TABNUM}>
              {riskData.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trades">
          <Card>
            <CardContent className="pt-4">
              <div style={{ height: 300 }}>
                <AgGridReact<Trade>
                  theme={marketsGridTheme}
                  rowData={trades}
                  columnDefs={tradeColDefs}
                  defaultColDef={defaultColDef}
                  rowHeight={28}
                  headerHeight={30}
                  animateRows={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfqs">
          <Card>
            <CardContent className="pt-4">
              <div style={{ height: 300 }}>
                <AgGridReact<RFQ>
                  theme={marketsGridTheme}
                  rowData={rfqs}
                  columnDefs={rfqColDefs}
                  defaultColDef={defaultColDef}
                  rowHeight={28}
                  headerHeight={30}
                  animateRows={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardContent className="pt-4">
              <div style={{ height: 300 }}>
                <AgGridReact<Order>
                  theme={marketsGridTheme}
                  rowData={orders}
                  columnDefs={orderColDefs}
                  defaultColDef={defaultColDef}
                  rowHeight={28}
                  headerHeight={30}
                  animateRows={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardContent className="pt-4">
              <div style={{ height: 300 }}>
                <AgGridReact<Risk>
                  theme={marketsGridTheme}
                  rowData={riskData}
                  columnDefs={riskColDefs}
                  defaultColDef={defaultColDef}
                  rowHeight={28}
                  headerHeight={30}
                  animateRows={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
