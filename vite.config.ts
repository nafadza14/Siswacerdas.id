
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Fixed: Cast process as any to access cwd() if types are missing
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This allows the app to access process.env.API_KEY in the browser.
      // We use || '' to ensure it doesn't break if the key is missing.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // This prevents "process is not defined" crashes for other libs
      'process.env': {} 
    }
  };
});
