/**
 * MarketsUI AG Grid Theme
 *
 * Creates a Quartz-based AG Grid theme configured for dense trading data.
 * Uses our design system tokens (teal accent, true-black dark mode,
 * DM Sans body font, JetBrains Mono for numeric cells).
 *
 * Supports both light and dark modes via colorSchemeVariable.
 * The grid reads the .dark class on <html> to switch automatically.
 *
 * Usage (React):
 *   import { marketsGridTheme } from '@marketsui/tokens/ag-grid-theme';
 *   <AgGridReact theme={marketsGridTheme} ... />
 *
 * Usage (Angular):
 *   import { marketsGridTheme } from '@marketsui/tokens/ag-grid-theme';
 *   [theme]="marketsGridTheme"
 */

import {
  themeQuartz,
  colorSchemeVariable,
  iconSetQuartzLight,
} from "ag-grid-community";

/**
 * Light mode theme parameters.
 * Warm off-white backgrounds, reduced contrast for eye comfort.
 */
const lightParams = {
  /* ── Core colors ── */
  backgroundColor: "#ffffff",
  foregroundColor: "#181C24",            /* Softened dark — not pure black */
  accentColor: "#17957E",               /* Teal — slightly deeper for readability */
  borderColor: "#E4E7EC",               /* Soft border */

  /* ── Surfaces ── */
  headerBackgroundColor: "#F7F8FA",      /* Warm off-white header */
  headerTextColor: "#6B7280",            /* Muted header — less harsh */
  oddRowBackgroundColor: "#FAFBFC",      /* Very subtle zebra */
  rowHoverColor: "#F0F2F5",              /* Neutral hover — not teal-tinted */
  selectedRowBackgroundColor: "rgba(23, 149, 126, 0.07)",  /* Teal 7% */

  /* ── Text ── */
  textColor: "#181C24",
  subtleTextColor: "#6B7280",
  cellTextColor: "#181C24",

  /* ── Inputs ── */
  inputBackgroundColor: "#F0F2F5",
  inputBorder: { color: "#E4E7EC" },

  /* ── Misc ── */
  rangeSelectorBackgroundColor: "rgba(23, 149, 126, 0.10)",
  columnHoverColor: "rgba(23, 149, 126, 0.04)",
};

/**
 * Dark mode theme parameters.
 * Navy-black background, institutional dark surfaces, teal accent.
 * Designed for dense trading data with high readability.
 */
const darkParams = {
  /* ── Core colors ── */
  backgroundColor: "#13161C",            /* Navy-black — matches --mdl-card dark */
  foregroundColor: "#F0F2F5",            /* Primary text */
  accentColor: "#21B8A4",               /* Teal — matches --mdl-primary dark */
  borderColor: "#222630",               /* Navy-tinted border */

  /* ── Surfaces ── */
  headerBackgroundColor: "#13161C",      /* Same as bg for flat look */
  headerTextColor: "#8A94A6",            /* Muted header text */
  oddRowBackgroundColor: "#0F1115",      /* Subtle zebra — slightly darker */
  rowHoverColor: "#1A1E26",              /* Elevated surface on hover */
  selectedRowBackgroundColor: "rgba(33, 184, 164, 0.10)",  /* Teal 10% */

  /* ── Text ── */
  textColor: "#F0F2F5",
  subtleTextColor: "#8A94A6",
  cellTextColor: "#F0F2F5",

  /* ── Inputs ── */
  inputBackgroundColor: "#1A1E26",
  inputBorder: { color: "#222630" },

  /* ── Misc ── */
  rangeSelectorBackgroundColor: "rgba(33, 184, 164, 0.14)",
  columnHoverColor: "rgba(33, 184, 164, 0.06)",
};

/**
 * Shared parameters — same in both light and dark modes.
 * Optimized for dense trading data grids.
 */
const sharedParams = {
  /* ── Typography — DM Sans for UI, JetBrains Mono for numbers ── */
  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
  headerFontFamily: "'DM Sans', system-ui, sans-serif",
  cellFontFamily: "'JetBrains Mono', 'SF Mono', monospace",
  fontSize: 12,

  /* ── Dense layout for trading data ── */
  spacing: 4,                            /* Compact spacing */
  headerFontSize: 12,
  headerFontWeight: 600 as any,

  /* ── Borders ── */
  wrapperBorder: true,
  wrapperBorderRadius: 8,
  headerRowBorder: true,
  rowBorder: { width: 1 },
  columnBorder: false,

  /* ── Widgets ── */
  borderRadius: 6,
};

/**
 * The MarketsUI AG Grid theme.
 *
 * Uses colorSchemeVariable which reads the prefers-color-scheme media query
 * and the .dark class on <html> to automatically switch between light and
 * dark parameter sets.
 *
 * Shared across React and Angular — imported from @marketsui/tokens.
 */
export const marketsGridTheme = themeQuartz
  .withPart(colorSchemeVariable)
  .withPart(iconSetQuartzLight)
  .withParams(sharedParams)
  .withParams(lightParams, "light")
  .withParams(darkParams, "dark");

export default marketsGridTheme;
