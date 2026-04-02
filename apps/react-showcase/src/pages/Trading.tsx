import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  BarChart3,
  X,
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
import { Separator } from "../components/ui/separator";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";
import { marketsGridTheme } from "@marketsui/tokens/ag-grid-theme";

ModuleRegistry.registerModules([AllCommunityModule]);

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

const orders: Order[] = [
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

const MONO_STYLE = { fontFamily: "var(--font-mono, ui-monospace, monospace)" };

function getRatingColor(rating: string): string {
  if (rating === "AAA" || rating.startsWith("AA")) return "hsl(158, 68%, 44%)";
  if (rating.startsWith("A")) return "#EAB308";
  if (rating.startsWith("BBB")) return "#F97316";
  return "hsl(350, 89%, 60%)";
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
// Column Definitions: Positions
// ---------------------------------------------------------------------------

const positionColDefs: ColDef<Position>[] = [
  {
    field: "side",
    headerName: "Side",
    width: 90,
    cellRenderer: (params: { value: string }) => {
      if (!params.value) return null;
      const isLong = params.value === "LONG";
      return `<span style="display:inline-flex;align-items:center;padding:1px 8px;border-radius:9999px;font-size:11px;font-weight:600;${isLong ? "background:hsl(158,68%,44%,0.15);color:hsl(158,68%,44%)" : "background:hsl(350,89%,60%,0.15);color:hsl(350,89%,60%)"}">${params.value}</span>`;
    },
  },
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO_STYLE },
  { field: "issuer", headerName: "Issuer", width: 160 },
  { field: "description", headerName: "Description", width: 170, cellStyle: () => MONO_STYLE },
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
    cellStyle: () => MONO_STYLE,
    valueFormatter: (params) => params.value != null ? params.value.toFixed(3) + "%" : "",
  },
  { field: "maturity", headerName: "Maturity", width: 110, cellStyle: () => MONO_STYLE },
  {
    field: "notional",
    headerName: "Notional",
    width: 120,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "price",
    headerName: "Price",
    width: 85,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "mktValue",
    headerName: "Mkt Value",
    width: 120,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "yield",
    headerName: "Yield",
    width: 80,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) + "%" : "",
  },
  {
    field: "duration",
    headerName: "Duration",
    width: 90,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(1) : "",
  },
  {
    field: "dv01",
    headerName: "DV01",
    width: 100,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
];

// ---------------------------------------------------------------------------
// Column Definitions: Trades
// ---------------------------------------------------------------------------

const tradeColDefs: ColDef<Trade>[] = [
  { field: "tradeId", headerName: "Trade ID", width: 110, cellStyle: () => MONO_STYLE },
  { field: "time", headerName: "Time", width: 100, cellStyle: () => MONO_STYLE },
  {
    field: "side",
    headerName: "Side",
    width: 80,
    cellRenderer: (params: { value: string }) => {
      if (!params.value) return null;
      const isBuy = params.value === "BUY";
      return `<span style="display:inline-flex;align-items:center;padding:1px 8px;border-radius:9999px;font-size:11px;font-weight:600;${isBuy ? "background:hsl(158,68%,44%,0.15);color:hsl(158,68%,44%)" : "background:hsl(350,89%,60%,0.15);color:hsl(350,89%,60%)"}">${params.value}</span>`;
    },
  },
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO_STYLE },
  { field: "issuer", headerName: "Issuer", width: 160 },
  {
    field: "qty",
    headerName: "Qty",
    width: 120,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "price",
    headerName: "Price",
    width: 85,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    cellStyle: (params) => ({
      color: params.value === "Filled" ? "hsl(158, 68%, 44%)" : params.value === "Partial" ? "#EAB308" : "",
      fontWeight: 600,
    }),
  },
];

// ---------------------------------------------------------------------------
// Column Definitions: RFQs
// ---------------------------------------------------------------------------

const rfqColDefs: ColDef<RFQ>[] = [
  { field: "rfqId", headerName: "RFQ ID", width: 100, cellStyle: () => MONO_STYLE },
  { field: "bond", headerName: "Bond", width: 150, cellStyle: () => MONO_STYLE },
  {
    field: "side",
    headerName: "Side",
    width: 80,
    cellStyle: (params) => ({
      color: params.value === "BID" ? "hsl(158, 68%, 44%)" : "#EAB308",
      fontWeight: 600,
    }),
  },
  {
    field: "qty",
    headerName: "Qty",
    width: 110,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "bid",
    headerName: "Bid",
    width: 80,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "offer",
    headerName: "Offer",
    width: 80,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "spread",
    headerName: "Spread",
    width: 80,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    cellStyle: (params) => ({
      color: params.value === "Done" ? "hsl(158, 68%, 44%)" : params.value === "Active" ? "#EAB308" : "hsl(var(--muted-foreground))",
      fontWeight: 600,
    }),
  },
  { field: "dealer", headerName: "Dealer", width: 140 },
];

// ---------------------------------------------------------------------------
// Column Definitions: Orders
// ---------------------------------------------------------------------------

const orderColDefs: ColDef<Order>[] = [
  { field: "orderId", headerName: "Order ID", width: 110, cellStyle: () => MONO_STYLE },
  {
    field: "side",
    headerName: "Side",
    width: 80,
    cellRenderer: (params: { value: string }) => {
      if (!params.value) return null;
      const isBuy = params.value === "BUY";
      return `<span style="display:inline-flex;align-items:center;padding:1px 8px;border-radius:9999px;font-size:11px;font-weight:600;${isBuy ? "background:hsl(158,68%,44%,0.15);color:hsl(158,68%,44%)" : "background:hsl(350,89%,60%,0.15);color:hsl(350,89%,60%)"}">${params.value}</span>`;
    },
  },
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO_STYLE },
  { field: "type", headerName: "Type", width: 80 },
  {
    field: "qty",
    headerName: "Qty",
    width: 120,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? formatNumber(params.value) : "",
  },
  {
    field: "limit",
    headerName: "Limit",
    width: 85,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null && params.value > 0 ? params.value.toFixed(2) : "MKT",
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    cellStyle: (params) => ({
      color: params.value === "Filled" ? "hsl(158, 68%, 44%)" : params.value === "Working" ? "#EAB308" : params.value === "Partial" ? "#F97316" : params.value === "Cancelled" ? "hsl(350, 89%, 60%)" : "",
      fontWeight: 600,
    }),
  },
  { field: "time", headerName: "Time", width: 100, cellStyle: () => MONO_STYLE },
];

// ---------------------------------------------------------------------------
// Column Definitions: Risk
// ---------------------------------------------------------------------------

const riskColDefs: ColDef<Risk>[] = [
  { field: "cusip", headerName: "CUSIP", width: 110, cellStyle: () => MONO_STYLE },
  { field: "issuer", headerName: "Issuer", width: 160 },
  {
    field: "dv01",
    headerName: "DV01",
    width: 100,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "cr01",
    headerName: "CR01",
    width: 100,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "spreadDuration",
    headerName: "Sprd Dur",
    width: 95,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? params.value.toFixed(1) : "",
  },
  {
    field: "cs01",
    headerName: "CS01",
    width: 100,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
    valueFormatter: (params) => params.value != null ? "$" + formatNumber(params.value) : "",
  },
  {
    field: "var",
    headerName: "VaR",
    width: 110,
    cellStyle: () => ({ ...MONO_STYLE, textAlign: "right" }),
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
// Component: Portfolio Summary Strip
// ---------------------------------------------------------------------------

function PortfolioSummary() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Notional
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={MONO_STYLE}>$139.50M</div>
          <p className="text-xs text-muted-foreground">12 positions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Market Value
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={MONO_STYLE}>$137.54M</div>
          <p className="text-xs text-muted-foreground">Mark-to-market</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total P&amp;L
          </CardTitle>
          <TrendingDown className="h-4 w-4" style={{ color: "hsl(350, 89%, 60%)" }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ ...MONO_STYLE, color: "hsl(350, 89%, 60%)" }}>
            -$1.65M
          </div>
          <p className="text-xs text-muted-foreground">-1.18% unrealized</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Portfolio Risk (DV01)
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={MONO_STYLE}>$181,327</div>
          <p className="text-xs text-muted-foreground">Dollar value of 1bp</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component: Sector Allocation Bar
// ---------------------------------------------------------------------------

function SectorAllocationBar() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sector Allocation</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          {sectorAllocation.map((s) => (
            <div
              key={s.sector}
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              className="h-full transition-all"
              title={`${s.sector}: ${s.pct}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {sectorAllocation.map((s) => (
            <div key={s.sector} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.sector} {s.pct}%
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Component: Bond Detail Panel
// ---------------------------------------------------------------------------

function BondDetailPanel({
  position,
  onClose,
}: {
  position: Position;
  onClose: () => void;
}) {
  const pnlColor = position.pnl >= 0 ? "hsl(158, 68%, 44%)" : "hsl(350, 89%, 60%)";

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">{position.issuer}</CardTitle>
          <p className="text-sm text-muted-foreground" style={MONO_STYLE}>
            {position.description}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Unrealized P&amp;L</p>
          <p className="text-2xl font-bold" style={{ ...MONO_STYLE, color: pnlColor }}>
            {formatPnl(position.pnl)}
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">CUSIP</p>
            <p className="font-medium" style={MONO_STYLE}>{position.cusip}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Side</p>
            <Badge variant={position.side === "LONG" ? "default" : "destructive"} className="text-xs">
              {position.side}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Coupon</p>
            <p className="font-medium" style={MONO_STYLE}>{position.coupon.toFixed(3)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Maturity</p>
            <p className="font-medium" style={MONO_STYLE}>{position.maturity}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="font-medium" style={{ color: getRatingColor(position.rating) }}>
              {position.rating}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sector</p>
            <p className="font-medium">{position.sector}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Notional</p>
            <p className="font-medium" style={MONO_STYLE}>{formatCurrency(position.notional)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-medium" style={MONO_STYLE}>{position.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mkt Value</p>
            <p className="font-medium" style={MONO_STYLE}>{formatCurrency(position.mktValue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Yield</p>
            <p className="font-medium" style={MONO_STYLE}>{position.yield.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-medium" style={MONO_STYLE}>{position.duration.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">DV01</p>
            <p className="font-medium" style={MONO_STYLE}>${formatNumber(position.dv01)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Component: Trading Page
// ---------------------------------------------------------------------------

export default function Trading() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fixed Income Trading</h2>
        <p className="text-muted-foreground">Credit desk positions &amp; risk management</p>
      </div>

      {/* Portfolio Summary Strip */}
      <PortfolioSummary />

      {/* Sector Allocation */}
      <SectorAllocationBar />

      {/* Positions Blotter + Detail Panel */}
      <div className={`grid gap-4 ${selectedPosition ? "grid-cols-[1fr_340px]" : "grid-cols-1"}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Positions Blotter</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 400 }}>
              <AgGridReact<Position>
                theme={marketsGridTheme}
                rowData={positions}
                columnDefs={positionColDefs}
                defaultColDef={defaultColDef}
                rowHeight={28}
                headerHeight={32}
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
          />
        )}
      </div>

      {/* Bottom Tabs: Trades / RFQs / Orders / Risk */}
      <Tabs defaultValue="trades">
        <TabsList>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
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
                  headerHeight={32}
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
                  headerHeight={32}
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
                  headerHeight={32}
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
                  headerHeight={32}
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
