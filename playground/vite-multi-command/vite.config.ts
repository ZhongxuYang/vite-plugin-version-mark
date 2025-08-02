import {defineConfig} from 'vite'
import {vitePluginVersionMark} from '../../src/plugins/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vite-plugin-version-mark-multi-command',
  build: {
    sourcemap: true,
  },
  plugins: [
    // Example 1: Simple multi-command with default separator
    // This will output something like: "main-abc1234"
    vitePluginVersionMark({
      name: 'multi-command-simple',
      command: {
        commands: [
          'git rev-parse --abbrev-ref HEAD',  // Get branch name
          'git rev-parse --short HEAD',        // Get short commit SHA
        ],
        // Uses default separator "-"
      },
      ifGlobal: true,
      ifMeta: true,
      ifLog: true,
    }),

    // Example 2: Advanced multi-command with custom format
    // This will output something like: "v1.0.0-main-abc1234"
    vitePluginVersionMark({
      name: 'multi-command-advanced',
      command: {
        commands: [
          { 
            alias: 'tag', 
            cmd: 'git describe --tags --abbrev=0', 
            fallback: 'v0.0.0',
            timeout: 5000,
          },
          { 
            alias: 'branch', 
            cmd: 'git rev-parse --abbrev-ref HEAD', 
            fallback: 'unknown', 
          },
          { 
            alias: 'sha', 
            cmd: 'git rev-parse --short HEAD',
            timeout: 3000,
          },
        ],
        format: '{tag}-{branch}-{sha}',
        errorStrategy: 'fallback',
        parallel: true,
      },
      ifGlobal: true,
      ifMeta: true,
      ifLog: true,
    }),

    // Example 3: Error handling demonstration
    // This shows how different error strategies work
    vitePluginVersionMark({
      name: 'multi-command-error-demo',
      command: {
        commands: [
          {alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD'},
          {alias: 'invalid', cmd: 'this-command-does-not-exist', fallback: 'fallback-value'},
          {alias: 'sha', cmd: 'git rev-parse --short HEAD'},
        ],
        format: '{branch}-{invalid}-{sha}',
        errorStrategy: 'fallback',  // Try changing to 'skip' or 'strict'
      },
      ifGlobal: true,
      ifMeta: true,
      ifLog: true,
    }),

    // Example 4: Custom separator without format template
    // This will output something like: "main_abc1234_v1.0.0"
    vitePluginVersionMark({
      name: 'multi-command-separator',
      command: {
        commands: [
          'git rev-parse --abbrev-ref HEAD',
          'git rev-parse --short HEAD',
          'git describe --tags --abbrev=0 || echo "no-tag"',
        ],
        separator: '_',
        errorStrategy: 'skip',
      },
      ifGlobal: true,
      ifMeta: true,
      ifLog: true,
    }),
  ],
})
