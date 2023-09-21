// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'SIMPLAQ')
  console.log('ENV:', env, process.env.NODE_ENV)

  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          //additionalData: `@import "@/styles/ui/variables";`
        }
      }
    },
    define: {
      'process.env': {
        tenantCentralDomain: env.SIMPLAQ_TENANT_CENTRAL_DOMAIN
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      },
      extensions: ['.js', '.json', '.html', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        [`^/api/.*`]: {
          target: 'https://api.beta.mysimplaq.com/',
          changeOrigin: true,
          secure: false,
          headers: {
            Origin: 'http://galeriesantovka.beta.mysimplaq.com' // replace with tenant url
          },
          configure: (proxy, options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
            })
          }
        }
      }
    },
    base: ''
  }
})
