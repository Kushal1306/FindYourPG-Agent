// vite.config.js
import { defineConfig } from "file:///C:/Users/Kushal%20jain/Desktop/saksham-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Kushal%20jain/Desktop/saksham-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { viteStaticCopy } from "file:///C:/Users/Kushal%20jain/Desktop/saksham-frontend/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Kushal jain\\Desktop\\saksham-frontend";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
          dest: "./"
          // Adjust based on where you want to serve from
        },
        {
          src: "node_modules/@ricky0123/vad-web/dist/silero_vad.onnx",
          dest: "./"
        },
        {
          src: "node_modules/onnxruntime-web/dist/*.wasm",
          dest: "./"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    assetsInlineLimit: 0
    // Ensure large assets like WASM aren't inlined
  },
  optimizeDeps: {
    exclude: ["onnxruntime-web"]
    // Avoid dependency pre-bundling issues
  },
  define: {
    "process.env": {}
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLdXNoYWwgamFpblxcXFxEZXNrdG9wXFxcXHNha3NoYW0tZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEt1c2hhbCBqYWluXFxcXERlc2t0b3BcXFxcc2Frc2hhbS1mcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvS3VzaGFsJTIwamFpbi9EZXNrdG9wL3Nha3NoYW0tZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjsvLyBpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuLy8gaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuLy8gaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbi8vIGV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4vLyAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcbi8vICAgcmVzb2x2ZToge1xuLy8gICAgIGFsaWFzOiB7XG4vLyAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbi8vICAgICB9LFxuLy8gICB9XG4vLyB9KVxuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSAndml0ZS1wbHVnaW4tc3RhdGljLWNvcHknO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgdGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnbm9kZV9tb2R1bGVzL0ByaWNreTAxMjMvdmFkLXdlYi9kaXN0L3ZhZC53b3JrbGV0LmJ1bmRsZS5taW4uanMnLFxuICAgICAgICAgIGRlc3Q6ICcuLycgLy8gQWRqdXN0IGJhc2VkIG9uIHdoZXJlIHlvdSB3YW50IHRvIHNlcnZlIGZyb21cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJ25vZGVfbW9kdWxlcy9Acmlja3kwMTIzL3ZhZC13ZWIvZGlzdC9zaWxlcm9fdmFkLm9ubngnLFxuICAgICAgICAgIGRlc3Q6ICcuLydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJ25vZGVfbW9kdWxlcy9vbm54cnVudGltZS13ZWIvZGlzdC8qLndhc20nLFxuICAgICAgICAgIGRlc3Q6ICcuLydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCwgLy8gRW5zdXJlIGxhcmdlIGFzc2V0cyBsaWtlIFdBU00gYXJlbid0IGlubGluZWRcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydvbm54cnVudGltZS13ZWInXSwgLy8gQXZvaWQgZGVwZW5kZW5jeSBwcmUtYnVuZGxpbmcgaXNzdWVzXG4gIH0sXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudic6IHt9XG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFjQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsc0JBQXNCO0FBakIvQixJQUFNLG1DQUFtQztBQW9CekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLG1CQUFtQjtBQUFBO0FBQUEsRUFDckI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxpQkFBaUI7QUFBQTtBQUFBLEVBQzdCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
