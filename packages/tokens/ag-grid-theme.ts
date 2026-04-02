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
 * Clean white backgrounds, teal accent, subtle borders.
 */
const lightParams = {
  /* ── Core colors ── */
  backgroundColor: "#ffffff",
  foregroundColor: "#181A20",
  accentColor: "#1DA898",               /* Teal — matches --mdl-primary light */
  borderColor: "#E5E7EB",               /* Light gray border */

  /* ── Surfaces ── */
  headerBackgroundColor: "#FAFAFA",      /* Slightly off-white header */
  headerTextColor: "#181A20",
  oddRowBackgroundColor: "#FAFAFA",      /* Subtle zebra striping */
  rowHoverColor: "#F0FDFA",              /* Light teal hover */
  selectedRowBackgroundColor: "rgba(29, 168, 152, 0.08)",  /* Teal 8% */

  /* ── Text ── */
  textColor: "#181A20",
  subtleTextColor: "#848E9C",
  cellTextColor: "#181A20",

  /* ── Inputs ── */
  inputBackgroundColor: "#F5F5F5",
  inputBorder: { color: "#E5E7EB" },

  /* ── Misc ── */
  rangeSelectorBackgroundColor: "rgba(29, 168, 152, 0.12)",
  columnHoverColor: "rgba(29, 168, 152, 0.04)",
};

/**
 * Dark mode theme parameters.
 * True black background, warm dark surfaces, teal accent.
 * Designed for dense trading data with high readability.
 */
const darkParams = {
  /* ── Core colors ── */
  backgroundColor: "#0B0E11",            /* True black — matches --mdl-background dark */
  foregroundColor: "#EAECEF",            /* Primary text */
  accentColor: "#21B8A4",               /* Teal — matches --mdl-primary dark */
  borderColor: "#2B2F36",               /* Warm dark border */

  /* ── Surfaces ── */
  headerBackgroundColor: "#14161A",      /* Slightly raised header */
  headerTextColor: "#EAECEF",
  oddRowBackgroundColor: "#14161A",      /* Subtle zebra striping */
  rowHoverColor: "#1E2026",              /* Card surface on hover */
  selectedRowBackgroundColor: "rgba(33, 184, 164, 0.12)",  /* Teal 12% */

  /* ── Text ── */
  textColor: "#EAECEF",
  subtleTextColor: "#848E9C",
  cellTextColor: "#EAECEF",

  /* ── Inputs ── */
  inputBackgroundColor: "#1E2026",
  inputBorder: { color: "#2B2F36" },

  /* ── Misc ── */
  rangeSelectorBackgroundColor: "rgba(33, 184, 164, 0.16)",
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
