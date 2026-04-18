import { useState, useMemo, useCallback, useEffect, useRef, createContext, useContext } from "react";
import {
  Plus,
  Minus,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
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
import {
  DockManagerCore,
  type WidgetProps,
  type DockviewApi,
  type DockManagerState,
  createTheme,
} from "@widgetstools/react-dock-manager";
// Core dock manager CSS — imported via Vite alias to bypass package export restrictions
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — resolved by Vite alias in vite.config.ts
import "dock-manager-css";

ModuleRegistry.registerModules([AllCommunityModule]);

// ---------------------------------------------------------------------------
// Color constants
// ---------------------------------------------------------------------------

const CLR_SUCCESS = "hsl(var(--mdl-success))";
const CLR_DANGER = "hsl(var(--mdl-destructive))";
const CLR_WARN = "#EAB308";

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

interface LivePosition extends Position {
  prevPrice: number;
  dayChange: number;
  dayChangePct: number;
  flashDir: "up" | "down" | null;
  lastUpdate: number;
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

interface TimeSaleEntry {
  id: number;
  time: string;
  issuer: string;
  cusip: string;
  side: "BUY" | "SELL";
  qty: number;
  price: number;
  yieldVal: number;
  venue: string;
}

interface BenchmarkYield {
  tenor: string;
  label: string;
  yield: number;
  prevYield: number;
  change: number;
  flashDir: "up" | "down" | null;
}

interface MarketAlert {
  id: number;
  time: string;
  type: "price" | "order" | "rfq" | "risk";
  severity: "info" | "warn" | "critical";
  message: string;
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
// Data: Treasury Benchmarks
// ---------------------------------------------------------------------------

const INITIAL_BENCHMARKS: Omit<BenchmarkYield, "flashDir">[] = [
  { tenor: "2Y", label: "UST 2Y", yield: 4.28, prevYield: 4.28, change: -0.02 },
  { tenor: "3Y", label: "UST 3Y", yield: 4.18, prevYield: 4.18, change: 0.01 },
  { tenor: "5Y", label: "UST 5Y", yield: 4.15, prevYield: 4.15, change: -0.03 },
  { tenor: "7Y", label: "UST 7Y", yield: 4.22, prevYield: 4.22, change: 0.00 },
  { tenor: "10Y", label: "UST 10Y", yield: 4.42, prevYield: 4.42, change: 0.02 },
  { tenor: "20Y", label: "UST 20Y", yield: 4.68, prevYield: 4.68, change: 0.01 },
  { tenor: "30Y", label: "UST 30Y", yield: 4.72, prevYield: 4.72, change: -0.01 },
];

// ---------------------------------------------------------------------------
// Data: Trading Venues for Time & Sales
// ---------------------------------------------------------------------------

const VENUES = ["TRACE", "MarketAxess", "Tradeweb", "Bloomberg", "ICE", "DirectBid"];
const DEALERS = ["Goldman Sachs", "Morgan Stanley", "JPMorgan", "Barclays", "Citi", "BofA", "Deutsche Bank", "Wells Fargo", "HSBC", "UBS"];

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

function timeNow(): string {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function timeNowWithMs(): string {
  const now = new Date();
  const hms = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  return hms + "." + String(now.getMilliseconds()).padStart(3, "0");
}

// ---------------------------------------------------------------------------
// Initialize live positions from static data
// ---------------------------------------------------------------------------

function initLivePositions(): LivePosition[] {
  return positions.map((p) => ({
    ...p,
    prevPrice: p.price,
    dayChange: 0,
    dayChangePct: 0,
    flashDir: null,
    lastUpdate: Date.now(),
  }));
}

// ---------------------------------------------------------------------------
// Side cell style helper (shared by grids)
// ---------------------------------------------------------------------------

function sideCellStyle(value: string, buyLabel: string): Record<string, string | number> {
  const isBuy = value === buyLabel;
  return {
    color: isBuy ? CLR_SUCCESS : CLR_DANGER,
    fontWeight: 600,
    fontSize: '11px',
  };
}

// ---------------------------------------------------------------------------
// Column Definitions: Positions (enhanced with P&L + Day Change)
// ---------------------------------------------------------------------------

function getPositionColDefs(): ColDef<LivePosition>[] {
  return [
    {
      field: "side",
      headerName: "Side",
      width: 65,
      cellStyle: (params) => sideCellStyle(params.value ?? "", "LONG"),
    },
    { field: "cusip", headerName: "CUSIP", width: 95, cellStyle: () => MONO },
    { field: "issuer", headerName: "Issuer", width: 130 },
    { field: "description", headerName: "Desc", width: 145, cellStyle: () => MONO },
    {
      field: "rating",
      headerName: "Rtg",
      width: 55,
      cellStyle: (params) => ({
        color: getRatingColor(params.value ?? ""),
        fontWeight: 600,
      }),
    },
    {
      field: "coupon",
      headerName: "Cpn",
      width: 68,
      cellStyle: () => MONO,
      valueFormatter: (params) => params.value != null ? params.value.toFixed(3) + "%" : "",
    },
    { field: "maturity", headerName: "Mat", width: 90, cellStyle: () => MONO },
    {
      field: "notional",
      headerName: "Notional",
      width: 100,
      cellStyle: () => MONO_RIGHT,
      valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
    },
    {
      field: "price",
      headerName: "Price",
      width: 72,
      cellStyle: (params) => {
        const data = params.data;
        if (!data) return MONO_RIGHT;
        const base: Record<string, string> = { ...MONO_RIGHT };
        if (data.flashDir === "up") {
          base.color = CLR_SUCCESS;
          base.fontWeight = "700";
        } else if (data.flashDir === "down") {
          base.color = CLR_DANGER;
          base.fontWeight = "700";
        }
        return base;
      },
      valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
    },
    {
      field: "dayChange",
      headerName: "Chg",
      width: 62,
      cellStyle: (params) => ({
        ...MONO_RIGHT,
        color: (params.value ?? 0) > 0 ? CLR_SUCCESS : (params.value ?? 0) < 0 ? CLR_DANGER : "inherit",
        fontWeight: "600",
      }),
      valueFormatter: (params) => {
        const v = params.value ?? 0;
        if (v === 0) return "--";
        return (v > 0 ? "+" : "") + v.toFixed(2);
      },
    },
    {
      field: "mktValue",
      headerName: "Mkt Val",
      width: 100,
      cellStyle: () => MONO_RIGHT,
      valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
    },
    {
      field: "yield",
      headerName: "Yld",
      width: 62,
      cellStyle: () => MONO_RIGHT,
      valueFormatter: (params) => params.value != null ? params.value.toFixed(2) + "%" : "",
    },
    {
      field: "duration",
      headerName: "Dur",
      width: 55,
      cellStyle: () => MONO_RIGHT,
      valueFormatter: (params) => params.value != null ? params.value.toFixed(1) : "",
    },
    {
      field: "dv01",
      headerName: "DV01",
      width: 80,
      cellStyle: () => MONO_RIGHT,
      valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
    },
    {
      field: "pnl",
      headerName: "P&L",
      width: 95,
      cellStyle: (params) => ({
        ...MONO_RIGHT,
        color: (params.value ?? 0) >= 0 ? CLR_SUCCESS : CLR_DANGER,
        fontWeight: "700",
      }),
      valueFormatter: (params) => params.value != null ? formatPnl(params.value) : "",
    },
  ];
}

// ---------------------------------------------------------------------------
// Column Definitions: Trades
// ---------------------------------------------------------------------------

const tradeColDefs: ColDef<Trade>[] = [
  { field: "tradeId", headerName: "Trade ID", width: 100, cellStyle: () => MONO },
  { field: "time", headerName: "Time", width: 85, cellStyle: () => MONO },
  {
    field: "side",
    headerName: "Side",
    width: 70,
    cellStyle: (params) => sideCellStyle(params.value ?? "", "BUY"),
  },
  { field: "cusip", headerName: "CUSIP", width: 100, cellStyle: () => MONO },
  { field: "issuer", headerName: "Issuer", width: 140 },
  {
    field: "qty",
    headerName: "Qty",
    width: 110,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "price",
    headerName: "Price",
    width: 75,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "status",
    headerName: "Status",
    width: 85,
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
  { field: "rfqId", headerName: "RFQ ID", width: 90, cellStyle: () => MONO },
  { field: "bond", headerName: "Bond", width: 140, cellStyle: () => MONO },
  {
    field: "side",
    headerName: "Side",
    width: 70,
    cellStyle: (params) => ({
      color: params.value === "BID" ? CLR_SUCCESS : CLR_WARN,
      fontWeight: 600,
    }),
  },
  {
    field: "qty",
    headerName: "Qty",
    width: 100,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "bid",
    headerName: "Bid",
    width: 75,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "offer",
    headerName: "Offer",
    width: 75,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "spread",
    headerName: "Sprd",
    width: 70,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "status",
    headerName: "Status",
    width: 80,
    cellStyle: (params) => ({
      color: params.value === "Done" ? CLR_SUCCESS : params.value === "Active" ? CLR_WARN : "hsl(var(--muted-foreground))",
      fontWeight: 600,
    }),
  },
  { field: "dealer", headerName: "Dealer", width: 130 },
];

// ---------------------------------------------------------------------------
// Column Definitions: Orders
// ---------------------------------------------------------------------------

const orderColDefs: ColDef<Order>[] = [
  { field: "orderId", headerName: "Order ID", width: 100, cellStyle: () => MONO },
  {
    field: "side",
    headerName: "Side",
    width: 70,
    cellStyle: (params) => sideCellStyle(params.value ?? "", "BUY"),
  },
  { field: "cusip", headerName: "CUSIP", width: 100, cellStyle: () => MONO },
  { field: "type", headerName: "Type", width: 70 },
  {
    field: "qty",
    headerName: "Qty",
    width: 110,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "limit",
    headerName: "Limit",
    width: 75,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null && params.value > 0 ? params.value.toFixed(2) : "MKT",
  },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    cellStyle: (params) => ({
      color: params.value === "Filled" ? CLR_SUCCESS : params.value === "Working" ? CLR_WARN : params.value === "Partial" ? "#F97316" : params.value === "Cancelled" ? CLR_DANGER : "",
      fontWeight: 600,
    }),
  },
  { field: "time", headerName: "Time", width: 85, cellStyle: () => MONO },
];

// ---------------------------------------------------------------------------
// Column Definitions: Risk
// ---------------------------------------------------------------------------

const riskColDefs: ColDef<Risk>[] = [
  { field: "cusip", headerName: "CUSIP", width: 100, cellStyle: () => MONO },
  { field: "issuer", headerName: "Issuer", width: 140 },
  {
    field: "dv01",
    headerName: "DV01",
    width: 90,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "cr01",
    headerName: "CR01",
    width: 90,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "spreadDuration",
    headerName: "Sprd Dur",
    width: 85,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(1) : "",
  },
  {
    field: "cs01",
    headerName: "CS01",
    width: 90,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "var",
    headerName: "VaR",
    width: 100,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
];

// ---------------------------------------------------------------------------
// Column Definitions: Time & Sales
// ---------------------------------------------------------------------------

const timeSalesColDefs: ColDef<TimeSaleEntry>[] = [
  { field: "time", headerName: "Time", width: 100, cellStyle: () => MONO },
  {
    field: "side",
    headerName: "Side",
    width: 60,
    cellStyle: (params) => sideCellStyle(params.value ?? "", "BUY"),
  },
  { field: "issuer", headerName: "Issuer", width: 120 },
  { field: "cusip", headerName: "CUSIP", width: 90, cellStyle: () => MONO },
  {
    field: "qty",
    headerName: "Size",
    width: 80,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? formatSize(params.value / 1_000_000) : "",
  },
  {
    field: "price",
    headerName: "Price",
    width: 70,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "yieldVal",
    headerName: "Yield",
    width: 65,
    cellStyle: () => MONO_RIGHT,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) + "%" : "",
  },
  { field: "venue", headerName: "Venue", width: 100 },
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
// Trading Context — shared state between dock widgets
// ---------------------------------------------------------------------------

interface TradingContextValue {
  selectedPosition: LivePosition | null;
  setSelectedPosition: (p: LivePosition | null) => void;
  openOrderTicket: (prefill?: OrderPrefill) => void;
  orders: Order[];
  addOrder: (o: Order) => void;
  closeOrderTicket: () => void;
  livePositions: LivePosition[];
  filteredPositions: LivePosition[];
  positionFilter: "All" | "IG" | "HY" | "GOVT";
  setPositionFilter: (f: "All" | "IG" | "HY" | "GOVT") => void;
  detailTab: "details" | "ladder";
  setDetailTab: (t: "details" | "ladder") => void;
  totalNotional: number;
  totalMktValue: number;
  totalPnl: number;
  totalDv01: number;
  timeSales: TimeSaleEntry[];
}

const TradingContext = createContext<TradingContextValue>(null!);

// ---------------------------------------------------------------------------
// Component: Price Ladder
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

  const askLevels = levels.filter((l) => l.askSize > 0);
  const bidLevels = levels.filter((l) => l.bidSize > 0);

  const cumAsk = new Map<number, number>();
  let cumAskTotal = 0;
  for (const l of askLevels) {
    cumAskTotal += l.askSize;
    cumAsk.set(l.price, cumAskTotal);
  }

  const cumBid = new Map<number, number>();
  let cumBidTotal = 0;
  for (const l of bidLevels) {
    cumBidTotal += l.bidSize;
    cumBid.set(l.price, cumBidTotal);
  }

  return (
    <div className="flex flex-col h-full">
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

      <ScrollArea className="flex-1">
        <div>
          {levels.map((level, i) => {
            const isAsk = level.askSize > 0;
            const isBid = level.bidSize > 0;
            const isBestBid = bestBidLevel && level.price === bestBidLevel.price && isBid;
            const isBestAsk = bestAskLevel && level.price === bestAskLevel.price && isAsk;

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
                    height: 22,
                    alignItems: "center",
                    borderLeft: isBestBid ? `2px solid ${CLR_SUCCESS}` : isBestAsk ? `2px solid ${CLR_DANGER}` : "2px solid transparent",
                  }}
                  onClick={() => onPriceClick(level.price, isAsk ? "BUY" : "SELL")}
                >
                  <span className="text-right font-mono text-[10px] text-muted-foreground" style={TABNUM}>
                    {isBid ? formatSize(cumBid.get(level.price) ?? 0) : ""}
                  </span>
                  <span className="text-right font-mono text-[10px]" style={TABNUM}>
                    {isBid ? formatSize(level.bidSize) : ""}
                  </span>
                  <span
                    className={`text-center font-mono text-[10px] ${
                      isBestBid ? "font-bold" : isBestAsk ? "font-bold" : ""
                    }`}
                    style={{
                      ...TABNUM,
                      color: isBestBid ? CLR_SUCCESS : isBestAsk ? CLR_DANGER : undefined,
                    }}
                  >
                    {level.price.toFixed(3)}
                  </span>
                  <span className="text-right font-mono text-[10px]" style={TABNUM}>
                    {isAsk ? formatSize(level.askSize) : ""}
                  </span>
                  <span className="text-right font-mono text-[10px] text-muted-foreground" style={TABNUM}>
                    {isAsk ? formatSize(cumAsk.get(level.price) ?? 0) : ""}
                  </span>
                </div>
                {isSpreadRow && (
                  <div
                    className="flex items-center justify-center border-y border-dashed border-border/60"
                    style={{ height: 18 }}
                  >
                    <span className="text-[9px] font-mono text-muted-foreground tracking-wide" style={TABNUM}>
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
// Dock Manager: Custom dark theme
// ---------------------------------------------------------------------------

/** Dark dock theme — matches --mdl-* dark tokens (thinkorswim-inspired) */
const marketsDarkTheme = createTheme(
  "Markets Dark",
  "dark",
  { hue: 0, sat: 0, light: 7 },
  { hue: 171, sat: 77, light: 55 },
  {
    bg: "0 0% 7%",
    surface: "0 0% 12%",
    surfaceAlt: "0 0% 14%",
    panelHeader: "0 0% 12%",
    tabBar: "0 0% 7%",
    tabActive: "0 0% 12%",
    border: "0 0% 18%",
    splitter: "0 0% 14%",
    text: "0 0% 100%",
    textSecondary: "0 0% 62%",
    textMuted: "0 0% 45%",
    hover: "0 0% 15%",
    primary: "171 77% 55%",
    floatShadow: "0 0% 0%",
  }
);

/** Light dock theme — matches --mdl-* light tokens */
const marketsLightTheme = createTheme(
  "Markets Light",
  "light",
  { hue: 220, sat: 9, light: 96 },
  { hue: 174, sat: 72, light: 40 },
  {
    bg: "0 0% 100%",
    surface: "0 0% 100%",
    surfaceAlt: "220 9% 96%",
    panelHeader: "0 0% 100%",
    tabBar: "220 9% 96%",
    tabActive: "0 0% 100%",
    border: "220 9% 90%",
    splitter: "220 9% 90%",
    text: "225 18% 10%",
    textSecondary: "218 11% 52%",
    textMuted: "218 11% 72%",
    hover: "220 9% 96%",
    primary: "174 72% 40%",
    floatShadow: "0 0% 70%",
  }
);

// ---------------------------------------------------------------------------
// Dock Manager: Initial layout state
// ---------------------------------------------------------------------------

const defaultState: DockManagerState = {
  panels: {
    positions: { id: "positions", title: "Positions Blotter", closable: false, floatable: true, widgetType: "positions-blotter" },
    activity: { id: "activity", title: "Activity", closable: false, floatable: true, widgetType: "activity-panel" },
    detail: { id: "detail", title: "Bond Detail", closable: true, floatable: true, widgetType: "bond-detail" },
    ladder: { id: "ladder", title: "Price Ladder", closable: true, floatable: true, widgetType: "price-ladder" },
  },
  layout: {
    type: "split",
    id: "root",
    direction: "horizontal",
    sizes: [65, 35],
    children: [
      {
        type: "split",
        id: "left_split",
        direction: "vertical",
        sizes: [60, 40],
        children: [
          {
            type: "tabgroup",
            id: "tg_positions",
            panels: ["positions"],
            activePanel: "positions",
          },
          {
            type: "tabgroup",
            id: "tg_activity",
            panels: ["activity"],
            activePanel: "activity",
          },
        ],
      },
      {
        type: "tabgroup",
        id: "tg_right",
        panels: ["detail", "ladder"],
        activePanel: "detail",
      },
    ],
  },
  floatingPanels: [],
  popoutPanels: [],
  unpinnedPanels: [],
  nextZIndex: 1,
  activePaneId: "positions",
};

// ---------------------------------------------------------------------------
// Dock Widget: Positions Blotter
// ---------------------------------------------------------------------------

function PositionsBlotterWidget(_props: WidgetProps) {
  const {
    filteredPositions,
    positionFilter,
    setPositionFilter,
    setSelectedPosition,
    setDetailTab,
    openOrderTicket,
  } = useContext(TradingContext);

  const gridRef = useRef<AgGridReact<LivePosition>>(null);
  const positionColDefs = useMemo(() => getPositionColDefs(), []);
  const selectedCusipRef = useRef<string | null>(null);

  const handlePositionClick = useCallback(
    (pos: LivePosition) => {
      selectedCusipRef.current = pos.cusip;
      setSelectedPosition(pos);
      setDetailTab("details");
    },
    [setSelectedPosition, setDetailTab]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Positions header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 10px",
          height: 24,
          minHeight: 24,
          maxHeight: 24,
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "hsl(var(--foreground))" }}>
          Positions
        </span>
        <span
          style={{
            fontSize: 10, fontWeight: 600, ...MONO,
            background: "hsl(var(--mdl-primary) / 0.15)",
            color: "hsl(var(--mdl-primary))",
            borderRadius: 9999,
            padding: "0 6px",
            lineHeight: "16px",
          }}
        >
          {filteredPositions.length}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 2 }}>
          {(["All", "IG", "HY", "GOVT"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setPositionFilter(f)}
              style={{
                fontSize: 10, fontWeight: 600,
                padding: "0 8px", height: 20,
                borderRadius: 9999, border: "none", cursor: "pointer",
                background: positionFilter === f ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                color: positionFilter === f ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {/* AG Grid */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<LivePosition>
          ref={gridRef}
          theme={marketsGridTheme}
          rowData={filteredPositions}
          columnDefs={positionColDefs}
          defaultColDef={defaultColDef}
          rowHeight={26}
          headerHeight={28}
          animateRows={true}
          rowSelection="single"
          getRowId={(params) => params.data.cusip}
          onRowClicked={(event) => { if (event.data) handlePositionClick(event.data); }}
          onRowDoubleClicked={(event) => {
            if (event.data) {
              openOrderTicket({ cusip: event.data.cusip, issuer: event.data.issuer, limitPrice: event.data.price });
            }
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dock Widget: Activity Panel (Trades / RFQs / Orders / Risk)
// ---------------------------------------------------------------------------

function ActivityPanelWidget(_props: WidgetProps) {
  const { orders } = useContext(TradingContext);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Tabs defaultValue="trades" className="flex flex-col h-full">
        <TabsList className="h-6 mx-1 mt-1 w-fit shrink-0">
          <TabsTrigger value="trades" className="text-[10px] h-5 px-2 gap-1">
            Trades <span className="text-[9px] font-mono rounded-full bg-muted px-1 py-px" style={TABNUM}>{trades.length}</span>
          </TabsTrigger>
          <TabsTrigger value="rfqs" className="text-[10px] h-5 px-2 gap-1">
            RFQs <span className="text-[9px] font-mono rounded-full bg-muted px-1 py-px" style={TABNUM}>{rfqs.length}</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-[10px] h-5 px-2 gap-1">
            Orders <span className="text-[9px] font-mono rounded-full bg-muted px-1 py-px" style={TABNUM}>{orders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="text-[10px] h-5 px-2 gap-1">
            Risk <span className="text-[9px] font-mono rounded-full bg-muted px-1 py-px" style={TABNUM}>{riskData.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="trades" className="flex-1 mt-0 overflow-hidden">
          <div className="h-full w-full"><AgGridReact<Trade> theme={marketsGridTheme} rowData={trades} columnDefs={tradeColDefs} defaultColDef={defaultColDef} rowHeight={22} headerHeight={24} animateRows={true} /></div>
        </TabsContent>
        <TabsContent value="rfqs" className="flex-1 mt-0 overflow-hidden">
          <div className="h-full w-full"><AgGridReact<RFQ> theme={marketsGridTheme} rowData={rfqs} columnDefs={rfqColDefs} defaultColDef={defaultColDef} rowHeight={22} headerHeight={24} animateRows={true} /></div>
        </TabsContent>
        <TabsContent value="orders" className="flex-1 mt-0 overflow-hidden">
          <div className="h-full w-full"><AgGridReact<Order> theme={marketsGridTheme} rowData={orders} columnDefs={orderColDefs} defaultColDef={defaultColDef} rowHeight={22} headerHeight={24} animateRows={true} /></div>
        </TabsContent>
        <TabsContent value="risk" className="flex-1 mt-0 overflow-hidden">
          <div className="h-full w-full"><AgGridReact<Risk> theme={marketsGridTheme} rowData={riskData} columnDefs={riskColDefs} defaultColDef={defaultColDef} rowHeight={22} headerHeight={24} animateRows={true} /></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dock Widget: Bond Detail
// ---------------------------------------------------------------------------

function BondDetailWidget(_props: WidgetProps) {
  const { selectedPosition, detailTab, setDetailTab, openOrderTicket } = useContext(TradingContext);

  const handleTradeFromDetail = useCallback(() => {
    if (!selectedPosition) return;
    openOrderTicket({
      cusip: selectedPosition.cusip,
      issuer: selectedPosition.issuer,
    });
  }, [selectedPosition, openOrderTicket]);

  const handlePriceClick = useCallback(
    (price: number, side: "BUY" | "SELL") => {
      if (!selectedPosition) return;
      openOrderTicket({
        cusip: selectedPosition.cusip,
        issuer: selectedPosition.issuer,
        side,
        limitPrice: price,
      });
    },
    [selectedPosition, openOrderTicket]
  );

  if (!selectedPosition) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "hsl(var(--muted-foreground))", fontSize: 11 }}>
        Select a position to view details
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Detail header */}
      <div style={{ padding: "4px 10px", borderBottom: "1px solid hsl(var(--border))", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{selectedPosition.issuer}</span>
          <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", ...MONO }}>{selectedPosition.description}</div>
        </div>
      </div>

      {/* P&L strip */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "4px 10px", borderBottom: "1px solid hsl(var(--border))" }}>
        <span style={{ fontSize: 18, fontWeight: 700, ...MONO, color: selectedPosition.pnl >= 0 ? CLR_SUCCESS : CLR_DANGER }}>
          {formatPnl(selectedPosition.pnl)}
        </span>
        <span
          style={{
            fontSize: 10, fontWeight: 600, ...MONO,
            padding: "1px 6px", borderRadius: 4,
            background: selectedPosition.pnl >= 0 ? "hsl(var(--mdl-success) / 0.15)" : "hsl(var(--mdl-destructive) / 0.15)",
            color: selectedPosition.pnl >= 0 ? CLR_SUCCESS : CLR_DANGER,
          }}
        >
          {((selectedPosition.pnl / selectedPosition.notional) * 100).toFixed(2)}%
        </span>
      </div>

      {/* Metrics grid */}
      <div style={{ padding: "6px 10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 10px", borderBottom: "1px solid hsl(var(--border))" }}>
        {([
          ["CUSIP", selectedPosition.cusip],
          ["SIDE", null],
          ["RATING", null],
          ["COUPON", selectedPosition.coupon.toFixed(3) + "%"],
          ["MATURITY", selectedPosition.maturity],
          ["SECTOR", selectedPosition.sector],
          ["NOTIONAL", formatCurrency(selectedPosition.notional)],
          ["PRICE", selectedPosition.price.toFixed(2)],
          ["MKT VALUE", formatCurrency(selectedPosition.mktValue)],
          ["YIELD", selectedPosition.yield.toFixed(2) + "%"],
          ["DURATION", selectedPosition.duration.toFixed(1)],
          ["DV01", "$" + formatNumber(selectedPosition.dv01)],
        ] as const).map(([label, value]) => (
          <div key={label}>
            <p style={{ fontSize: 9, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>{label}</p>
            {label === "SIDE" ? (
              <span style={{ fontSize: 12, fontWeight: 700, ...MONO, color: selectedPosition.side === "LONG" ? CLR_SUCCESS : CLR_DANGER }}>{selectedPosition.side}</span>
            ) : label === "RATING" ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: getRatingColor(selectedPosition.rating), ...MONO }}>{selectedPosition.rating}</span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 700, ...MONO }}>{value}</span>
            )}
          </div>
        ))}
      </div>

      {/* Tabs: Details / Ladder */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "3px 10px", borderBottom: "1px solid hsl(var(--border))" }}>
        <button type="button" onClick={() => setDetailTab("details")} style={{ fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 4, border: "none", cursor: "pointer", background: detailTab === "details" ? "hsl(var(--accent))" : "transparent", color: detailTab === "details" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}>Details</button>
        <button type="button" onClick={() => setDetailTab("ladder")} style={{ fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 4, border: "none", cursor: "pointer", background: detailTab === "ladder" ? "hsl(var(--accent))" : "transparent", color: detailTab === "ladder" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}>Ladder</button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {detailTab === "ladder" ? (
          <PriceLadder position={selectedPosition} onPriceClick={handlePriceClick} />
        ) : (
          <div style={{ padding: "6px 10px", fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
            {selectedPosition.description} &middot; {selectedPosition.sector} &middot; {selectedPosition.rating}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{ borderTop: "1px solid hsl(var(--border))", padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <Button size="sm" className="h-6 text-[11px] px-4 font-semibold" style={{ background: "hsl(var(--mdl-primary))", color: "#fff" }} onClick={handleTradeFromDetail}>
          Trade
        </Button>
        <Button variant="outline" size="sm" className="h-6 text-[11px] px-3" onClick={() => openOrderTicket({ cusip: selectedPosition.cusip, issuer: selectedPosition.issuer, side: selectedPosition.side === "LONG" ? "SELL" : "BUY", limitPrice: selectedPosition.price })}>
          RFQ
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dock Widget: Price Ladder
// ---------------------------------------------------------------------------

function PriceLadderWidget(_props: WidgetProps) {
  const { selectedPosition, openOrderTicket } = useContext(TradingContext);

  const handlePriceClick = useCallback(
    (price: number, side: "BUY" | "SELL") => {
      if (!selectedPosition) return;
      openOrderTicket({
        cusip: selectedPosition.cusip,
        issuer: selectedPosition.issuer,
        side,
        limitPrice: price,
      });
    },
    [selectedPosition, openOrderTicket]
  );

  if (!selectedPosition) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "hsl(var(--muted-foreground))", fontSize: 11 }}>
        Select a position to view the price ladder
      </div>
    );
  }

  return <PriceLadder position={selectedPosition} onPriceClick={handlePriceClick} />;
}

// ---------------------------------------------------------------------------
// Dock Widget: Order Ticket (floating)
// ---------------------------------------------------------------------------

function OrderTicketWidget({ panel }: WidgetProps) {
  const { addOrder, closeOrderTicket } = useContext(TradingContext);
  const prefill = (panel.widgetProps as Record<string, unknown> | undefined)?.prefill as OrderPrefill | undefined;

  const [side, setSide] = useState<"BUY" | "SELL">(prefill?.side ?? "BUY");
  const [cusip, setCusip] = useState(prefill?.cusip ?? "");
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "Stop">("Limit");
  const [quantity, setQuantity] = useState("5");
  const [limitPrice, setLimitPrice] = useState(prefill?.limitPrice?.toFixed(3) ?? "");
  const [tif, setTif] = useState("DAY");

  const resolvedIssuer = useMemo(() => {
    if (prefill?.issuer) return prefill.issuer;
    const p = positions.find((r) => r.cusip === cusip);
    return p?.issuer ?? "";
  }, [cusip, prefill?.issuer]);

  const qtyNum = parseFloat(quantity) || 0;
  const limNum = parseFloat(limitPrice) || 0;
  const isBuy = side === "BUY";

  const handleClose = useCallback(() => {
    closeOrderTicket();
  }, [closeOrderTicket]);

  const handleSubmit = useCallback(() => {
    const order: Order = {
      orderId: `ORD-${12048 + Math.floor(Math.random() * 9000)}`,
      side,
      cusip,
      type: orderType,
      qty: qtyNum * 1_000_000,
      limit: orderType === "Market" ? 0 : limNum,
      status: "Working",
      time: timeNow(),
    };
    addOrder(order);
    handleClose();
  }, [side, cusip, orderType, qtyNum, limNum, addOrder, handleClose]);

  const selectClass =
    "flex h-8 w-full rounded border border-border bg-secondary px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "hsl(var(--card))" }}>
      {/* Header info */}
      <div style={{ padding: "8px 14px", borderBottom: "1px solid hsl(var(--border))", display: "flex", alignItems: "center", gap: 8, background: isBuy ? `linear-gradient(135deg, hsl(var(--card)), ${CLR_SUCCESS}15)` : `linear-gradient(135deg, hsl(var(--card)), ${CLR_DANGER}15)` }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Order</span>
        {cusip && <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", ...MONO }}>{cusip}</span>}
        {resolvedIssuer && <span style={{ fontSize: 11, fontWeight: 500 }}>{resolvedIssuer}</span>}
      </div>

      {/* Side toggle */}
      <div style={{ display: "flex", margin: "10px 14px 8px", height: 36, borderRadius: 6, overflow: "hidden", border: "1px solid hsl(var(--border))" }}>
        <button
          type="button"
          onClick={() => setSide("BUY")}
          style={{
            flex: 1, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
            background: isBuy ? CLR_SUCCESS : "transparent",
            color: isBuy ? "#fff" : "hsl(var(--muted-foreground))",
            transition: "all 0.15s ease",
          }}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => setSide("SELL")}
          style={{
            flex: 1, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
            background: !isBuy ? CLR_DANGER : "transparent",
            color: !isBuy ? "#fff" : "hsl(var(--muted-foreground))",
            transition: "all 0.15s ease",
          }}
        >
          SELL
        </button>
      </div>

      {/* Form rows */}
      <div style={{ padding: "6px 14px 10px", display: "flex", flexDirection: "column", gap: 8, flex: 1, overflow: "auto" }}>
        {/* CUSIP */}
        <div style={{ display: "flex", alignItems: "center", height: 34 }}>
          <Label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", width: 65, flexShrink: 0 }}>CUSIP</Label>
          <Input value={cusip} onChange={(e) => setCusip(e.target.value)} className="h-7 text-xs font-mono bg-secondary border-border flex-1" />
        </div>

        {/* Type */}
        <div style={{ display: "flex", alignItems: "center", height: 34 }}>
          <Label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", width: 65, flexShrink: 0 }}>Type</Label>
          <div className="relative flex-1">
            <select value={orderType} onChange={(e) => setOrderType(e.target.value as "Limit" | "Market" | "Stop")} className={selectClass}>
              <option value="Limit">Limit</option>
              <option value="Market">Market</option>
              <option value="Stop">Stop</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Qty */}
        <div style={{ display: "flex", alignItems: "center", height: 34 }}>
          <Label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", width: 65, flexShrink: 0 }}>Qty ($M)</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <button type="button" onClick={() => setQuantity(String(Math.max(1, qtyNum - 1)))} style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "1px solid hsl(var(--border))", background: "hsl(var(--secondary))", cursor: "pointer", flexShrink: 0 }}>
              <Minus style={{ width: 10, height: 10, color: "hsl(var(--muted-foreground))" }} />
            </button>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-7 text-xs font-mono text-center bg-secondary border-border flex-1" />
            <button type="button" onClick={() => setQuantity(String(qtyNum + 1))} style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "1px solid hsl(var(--border))", background: "hsl(var(--secondary))", cursor: "pointer", flexShrink: 0 }}>
              <Plus style={{ width: 10, height: 10, color: "hsl(var(--muted-foreground))" }} />
            </button>
          </div>
        </div>

        {/* Limit Price */}
        {orderType !== "Market" && (
          <div style={{ display: "flex", alignItems: "center", height: 34 }}>
            <Label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", width: 65, flexShrink: 0 }}>Limit Px</Label>
            <Input type="number" step="0.001" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} placeholder="98.250" className="h-7 text-xs font-mono bg-secondary border-border flex-1" />
          </div>
        )}

        {/* TIF */}
        <div style={{ display: "flex", alignItems: "center", height: 34 }}>
          <Label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", width: 65, flexShrink: 0 }}>TIF</Label>
          <div className="relative flex-1">
            <select value={tif} onChange={(e) => setTif(e.target.value)} className={selectClass}>
              <option value="DAY">Day</option>
              <option value="GTC">GTC</option>
              <option value="IOC">IOC</option>
              <option value="FOK">FOK</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid hsl(var(--border))", padding: "12px 14px", display: "flex", gap: 8 }}>
        <Button variant="ghost" size="sm" className="h-9 text-sm flex-1" onClick={handleClose}>Cancel</Button>
        <Button
          size="sm"
          className="h-9 text-sm flex-1 font-semibold"
          style={{ background: isBuy ? CLR_SUCCESS : CLR_DANGER, color: "#fff" }}
          onClick={handleSubmit}
        >
          {isBuy ? "Buy" : "Sell"} {resolvedIssuer ? resolvedIssuer.split(" ")[0] : ""}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Widget registry
// ---------------------------------------------------------------------------

const WIDGETS: Record<string, React.ComponentType<WidgetProps>> = {
  "positions-blotter": PositionsBlotterWidget,
  "activity-panel": ActivityPanelWidget,
  "bond-detail": BondDetailWidget,
  "price-ladder": PriceLadderWidget,
  "order-ticket": OrderTicketWidget,
};

// ---------------------------------------------------------------------------
// Component: Trading Page
// ---------------------------------------------------------------------------

export default function Trading() {
  // -- State --
  const [api, setApi] = useState<DockviewApi | null>(null);
  const [livePositions, setLivePositions] = useState<LivePosition[]>(initLivePositions);
  const [selectedPosition, setSelectedPosition] = useState<LivePosition | null>(null);
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  // Track dark/light mode from the <html> class (toggled by App.tsx header)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const [positionFilter, setPositionFilter] = useState<"All" | "IG" | "HY" | "GOVT">("All");
  const [detailTab, setDetailTab] = useState<"details" | "ladder">("details");
  const [_benchmarks, setBenchmarks] = useState<BenchmarkYield[]>(
    INITIAL_BENCHMARKS.map((b) => ({ ...b, flashDir: null }))
  );
  const [timeSales, setTimeSales] = useState<TimeSaleEntry[]>([]);
  const [_tickCount, setTickCount] = useState(0);
  const [_lastTickTime, setLastTickTime] = useState("");
  const [_alerts, setAlerts] = useState<MarketAlert[]>([]);
  const timeSaleIdRef = useRef(0);
  const alertIdRef = useRef(0);

  // -- Live price tick simulation --
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const tickTime = timeNowWithMs();

      const numTicks = 1 + Math.floor(Math.random() * 3);
      const tickedIndices = new Set<number>();
      for (let t = 0; t < numTicks; t++) {
        tickedIndices.add(Math.floor(Math.random() * positions.length));
      }

      setLivePositions((prev) =>
        prev.map((p, i) => {
          if (!tickedIndices.has(i)) {
            if (p.flashDir && now - p.lastUpdate > 800) {
              return { ...p, flashDir: null };
            }
            return p;
          }

          const tickSize = p.price * 0.0002;
          const delta = (Math.random() - 0.48) * tickSize * 2;
          const newPrice = Math.round((p.price + delta) * 100) / 100;
          const newMktValue = Math.round(newPrice / 100 * p.notional);
          const basePnl = positions[i].pnl;
          const priceMovePnl = (newPrice - positions[i].price) * (p.notional / 100);
          const newPnl = Math.round(basePnl + priceMovePnl);
          const dayChange = Math.round((newPrice - positions[i].price) * 100) / 100;
          const dayChangePct = Math.round((dayChange / positions[i].price) * 10000) / 100;

          return {
            ...p,
            prevPrice: p.price,
            price: newPrice,
            mktValue: newMktValue,
            pnl: newPnl,
            dayChange,
            dayChangePct,
            flashDir: delta > 0 ? "up" : "down",
            lastUpdate: now,
          };
        })
      );

      setTickCount((c) => c + numTicks);
      setLastTickTime(tickTime);

      setSelectedPosition(() => null);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Keep selectedPosition in sync with live data
  const selectedCusipRef = useRef<string | null>(null);
  useEffect(() => {
    if (selectedCusipRef.current) {
      const updated = livePositions.find((p) => p.cusip === selectedCusipRef.current);
      if (updated) {
        setSelectedPosition(updated);
      }
    }
  }, [livePositions]);

  // Override setSelectedPosition to track cusip
  const setSelectedPositionTracked = useCallback((p: LivePosition | null) => {
    selectedCusipRef.current = p?.cusip ?? null;
    setSelectedPosition(p);
  }, []);

  // -- Treasury benchmark tick simulation --
  useEffect(() => {
    const interval = setInterval(() => {
      setBenchmarks((prev) =>
        prev.map((b) => {
          if (Math.random() > 0.4) {
            return b.flashDir ? { ...b, flashDir: null } : b;
          }
          const delta = (Math.random() - 0.5) * 0.006;
          const newYield = Math.round((b.yield + delta) * 1000) / 1000;
          const newChange = Math.round((newYield - INITIAL_BENCHMARKS.find((ib) => ib.tenor === b.tenor)!.yield) * 1000) / 10;
          return {
            ...b,
            prevYield: b.yield,
            yield: newYield,
            change: newChange,
            flashDir: delta > 0 ? "up" as const : "down" as const,
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // -- Time & Sales generator --
  useEffect(() => {
    const initial: TimeSaleEntry[] = [];
    for (let i = 0; i < 15; i++) {
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const side = Math.random() > 0.5 ? "BUY" as const : "SELL" as const;
      const qty = (Math.floor(Math.random() * 20) + 1) * 500_000;
      const priceOffset = (Math.random() - 0.5) * 0.5;
      timeSaleIdRef.current++;
      initial.push({
        id: timeSaleIdRef.current,
        time: `${String(9 + Math.floor(Math.random() * 7)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        issuer: pos.issuer,
        cusip: pos.cusip,
        side,
        qty,
        price: Math.round((pos.price + priceOffset) * 100) / 100,
        yieldVal: Math.round((pos.yield + (Math.random() - 0.5) * 0.1) * 100) / 100,
        venue: VENUES[Math.floor(Math.random() * VENUES.length)],
      });
    }
    initial.sort((a, b) => b.time.localeCompare(a.time));
    setTimeSales(initial);

    const interval = setInterval(() => {
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const side = Math.random() > 0.5 ? "BUY" as const : "SELL" as const;
      const qty = (Math.floor(Math.random() * 20) + 1) * 500_000;
      const priceOffset = (Math.random() - 0.5) * 0.3;
      timeSaleIdRef.current++;
      const entry: TimeSaleEntry = {
        id: timeSaleIdRef.current,
        time: timeNowWithMs(),
        issuer: pos.issuer,
        cusip: pos.cusip,
        side,
        qty,
        price: Math.round((pos.price + priceOffset) * 100) / 100,
        yieldVal: Math.round((pos.yield + (Math.random() - 0.5) * 0.1) * 100) / 100,
        venue: VENUES[Math.floor(Math.random() * VENUES.length)],
      };
      setTimeSales((prev) => [entry, ...prev].slice(0, 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // -- Alert generator --
  useEffect(() => {
    const alertTemplates = [
      { type: "price" as const, severity: "info" as const, msg: (p: Position) => `${p.issuer} price crossed ${(p.price + 0.5).toFixed(2)} — up ${(Math.random() * 20 + 5).toFixed(0)}bps` },
      { type: "order" as const, severity: "info" as const, msg: () => `ORD-${12048 + Math.floor(Math.random() * 100)} filled at market` },
      { type: "rfq" as const, severity: "warn" as const, msg: () => `RFQ from ${DEALERS[Math.floor(Math.random() * DEALERS.length)]} expiring in 30s` },
      { type: "risk" as const, severity: "warn" as const, msg: () => `DV01 limit ${(Math.random() * 10 + 80).toFixed(0)}% utilized — approaching threshold` },
      { type: "price" as const, severity: "critical" as const, msg: (p: Position) => `${p.issuer} spread widening +${(Math.random() * 15 + 5).toFixed(0)}bps — review position` },
      { type: "risk" as const, severity: "critical" as const, msg: () => `VaR breach on Financials sector — current exposure exceeds limit` },
    ];

    const initialAlerts: MarketAlert[] = [];
    for (let i = 0; i < 4; i++) {
      const tmpl = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const pos = positions[Math.floor(Math.random() * positions.length)];
      alertIdRef.current++;
      initialAlerts.push({
        id: alertIdRef.current,
        time: `${String(9 + Math.floor(Math.random() * 6)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        type: tmpl.type,
        severity: tmpl.severity,
        message: tmpl.msg(pos),
      });
    }
    setAlerts(initialAlerts);

    const interval = setInterval(() => {
      const tmpl = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const pos = positions[Math.floor(Math.random() * positions.length)];
      alertIdRef.current++;
      const alert: MarketAlert = {
        id: alertIdRef.current,
        time: timeNow(),
        type: tmpl.type,
        severity: tmpl.severity,
        message: tmpl.msg(pos),
      };
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // -- Computed values --
  const totalNotional = livePositions.reduce((s, p) => s + p.notional, 0);
  const totalMktValue = livePositions.reduce((s, p) => s + p.mktValue, 0);
  const totalPnl = livePositions.reduce((s, p) => s + p.pnl, 0);
  const totalDv01 = livePositions.reduce((s, p) => s + p.dv01, 0);

  const filteredPositions = useMemo(() => {
    if (positionFilter === "All") return livePositions;
    if (positionFilter === "IG") return livePositions.filter((p) => IG_RATINGS.has(p.rating));
    if (positionFilter === "HY") return livePositions.filter((p) => !IG_RATINGS.has(p.rating) && p.sector !== "Government");
    return livePositions.filter((p) => p.sector === "Government");
  }, [positionFilter, livePositions]);

  // -- Clock for header --
  const [clock, setClock] = useState(timeNow());
  useEffect(() => {
    const id = setInterval(() => setClock(timeNow()), 1000);
    return () => clearInterval(id);
  }, []);

  // -- Order ticket --
  const openOrderTicket = useCallback((prefill?: OrderPrefill) => {
    if (!api) return;
    // Close existing order ticket if open
    try { api.closePanel("order-ticket"); } catch { /* noop */ }
    // Add as new panel, then float it
    api.addPanel({
      id: "order-ticket",
      title: prefill?.issuer ? `Order: ${prefill.issuer}` : "New Order",
      widgetType: "order-ticket",
      widgetProps: { prefill },
      closable: true,
      floatable: true,
    });
    api.floatPanel({
      panelId: "order-ticket",
      x: window.innerWidth - 400,
      y: 80,
      width: 340,
      height: 460,
    });
  }, [api]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
    alertIdRef.current++;
    const newAlert: MarketAlert = {
      id: alertIdRef.current,
      time: timeNow(),
      type: "order",
      severity: "info",
      message: `New ${order.side} order submitted: ${order.cusip} ${formatCurrency(order.qty)} @ ${order.limit > 0 ? order.limit.toFixed(2) : "MKT"}`,
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 20));
  }, []);

  // -- Keyboard shortcuts --
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        openOrderTicket();
      }
      if (e.key === "Escape") {
        if (selectedPosition) {
          setSelectedPositionTracked(null);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedPosition, openOrderTicket, setSelectedPositionTracked]);

  // -- Context value --
  const ctx = useMemo<TradingContextValue>(() => ({
    selectedPosition,
    setSelectedPosition: setSelectedPositionTracked,
    openOrderTicket,
    orders,
    addOrder,
    closeOrderTicket: () => { try { api?.closePanel("order-ticket"); } catch { /* not open */ } },
    livePositions,
    filteredPositions,
    positionFilter,
    setPositionFilter,
    detailTab,
    setDetailTab,
    totalNotional,
    totalMktValue,
    totalPnl,
    totalDv01,
    timeSales,
  }), [
    selectedPosition, setSelectedPositionTracked, openOrderTicket,
    orders, addOrder, api, livePositions, filteredPositions,
    positionFilter, detailTab, totalNotional, totalMktValue, totalPnl, totalDv01, timeSales,
  ]);

  // =====================================================================
  // RENDER
  // =====================================================================

  return (
    <TradingContext.Provider value={ctx}>
      <div style={{ height: "calc(100vh - 48px)", display: "flex", flexDirection: "column" }}>
        {/* ================================================================
            HEADER STRIP (32px)
            ================================================================ */}
        <div
          style={{
            height: 32,
            minHeight: 32,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            borderBottom: "1px solid hsl(var(--border))",
            gap: 12,
          }}
        >
          {/* Left: title + live + time */}
          <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Fixed Income Trading</span>
          <span
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: CLR_SUCCESS,
              boxShadow: `0 0 4px ${CLR_SUCCESS}`,
              animation: "pulse 2s infinite",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 10, fontWeight: 600, color: CLR_SUCCESS, flexShrink: 0 }}>LIVE</span>
          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", ...MONO, flexShrink: 0 }}>
            As of {clock} ET
          </span>

          <div style={{ flex: 1 }} />

          {/* Center: KPI inline badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {([
              { label: "Notional", value: formatCurrency(totalNotional), color: undefined },
              { label: "Mkt Value", value: formatCurrency(totalMktValue), color: undefined },
              { label: "P&L", value: formatPnl(totalPnl), color: totalPnl >= 0 ? CLR_SUCCESS : CLR_DANGER },
              { label: "DV01", value: "$" + formatNumber(totalDv01), color: undefined },
            ] as const).map((kpi, i) => (
              <div
                key={kpi.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0 14px",
                  borderRight: i < 3 ? "1px solid hsl(var(--border))" : "none",
                }}
              >
                <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", lineHeight: "12px" }}>{kpi.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, ...MONO, color: kpi.color, lineHeight: "16px" }}>{kpi.value}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Right: + Order button */}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-3 gap-1"
            onClick={() => openOrderTicket()}
          >
            <Plus style={{ width: 12, height: 12 }} />
            Order
          </Button>
        </div>

        {/* ================================================================
            DOCK MANAGER — fills remaining space
            ================================================================ */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <DockManagerCore
            initialState={defaultState}
            widgets={WIDGETS}
            onReady={setApi}
            theme={isDark ? marketsDarkTheme : marketsLightTheme}
          />
        </div>
      </div>
    </TradingContext.Provider>
  );
}
