/**
 * MarketsUI PrimeNG Preset — Teal accent
 *
 * Overrides PrimeNG's Aura preset so Angular components visually match
 * the shadcn/React components — teal primary accent, true black dark
 * mode, warm gray surfaces.
 *
 * Usage in app.config.ts:
 *   import { marketsPreset } from '@marketsui/tokens/primeng-preset';
 *   providePrimeNG({ theme: { preset: marketsPreset, options: { darkModeSelector: '.dark' } } })
 */

import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

export const marketsPreset = definePreset(Aura, {
  semantic: {
    /* Teal scale — primary actions, selected states, focus rings.
       Stands out on both light and dark backgrounds. */
    primary: {
      50: "#F0FDFA",
      100: "#CCFBF1",
      200: "#99F6E4",
      300: "#5EEAD4",
      400: "#2DD4BF",
      500: "#1DA898",  /* ← Core teal — matches light mode --mdl-primary */
      600: "#0D9488",
      700: "#0F766E",
      800: "#115E59",
      900: "#134E4A",
      950: "#042F2E",
    },
    colorScheme: {
      light: {
        primary: {
          color: "#17957E",            /* Deeper teal — readable on off-white */
          inverseColor: "#ffffff",
          hoverColor: "#0D9488",
          activeColor: "#0F766E",
        },
        highlight: {
          background: "#17957E",
          focusBackground: "#0D9488",
          color: "#ffffff",
          focusColor: "#ffffff",
        },
        /* Warm off-white surfaces — reduced contrast for eye comfort */
        surface: {
          0: "#ffffff",
          50: "#FAFBFC",
          100: "#F7F8FA",   /* Main background */
          200: "#F0F2F5",   /* Secondary / muted */
          300: "#E4E7EC",   /* Borders */
          400: "#C8CDD6",
          500: "#9CA3B0",
          600: "#6B7280",   /* Muted foreground */
          700: "#4B5563",
          800: "#374151",
          900: "#1F2937",
          950: "#181C24",   /* Main foreground */
        },
      },
      dark: {
        primary: {
          color: "#21B8A4",            /* Teal 46% lightness — bright on dark */
          inverseColor: "#0B0D11",
          hoverColor: "#2DD4BF",
          activeColor: "#14B8A6",
        },
        highlight: {
          background: "rgba(33, 184, 164, 0.16)",
          focusBackground: "rgba(33, 184, 164, 0.24)",
          color: "rgba(33, 184, 164, 0.87)",
          focusColor: "rgba(33, 184, 164, 0.87)",
        },
        /* Navy-black surfaces — institutional dark palette */
        surface: {
          0: "#0B0D11",   /* Navy-black canvas */
          50: "#0F1115",
          100: "#13161C",  /* Card surface */
          200: "#1A1E26",  /* Elevated surface */
          300: "#222630",  /* Border / input bg */
          400: "#2E3340",  /* Input border on focus */
          500: "#5E6878",  /* Tertiary text */
          600: "#8A94A6",  /* Secondary text */
          700: "#B0B8C8",
          800: "#D4D9E2",
          900: "#F0F2F5",  /* Primary text */
          950: "#F7F8FA",
        },
      },
    },
  },
});

export default marketsPreset;
