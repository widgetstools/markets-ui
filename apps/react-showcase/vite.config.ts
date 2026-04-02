import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix broken @import path in @widgetstools/react-dock-manager/styles.css
      "../../dock-manager-core/src/styles/dock-manager.css": path.resolve(
        __dirname,
        "../../node_modules/@widgetstools/dock-manager-core/dist/styles/dock-manager.css"
      ),
      // Alias for importing core CSS from TS files
      "dock-manager-css": path.resolve(
        __dirname,
        "../../node_modules/@widgetstools/dock-manager-core/dist/styles/dock-manager.css"
      ),
    },
  },
});
