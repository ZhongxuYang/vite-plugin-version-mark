# Multi-Command Version Mark Demo

This demo project showcases the new multi-command support in `vite-plugin-version-mark`. It demonstrates various ways to configure and use multiple commands to generate rich version information.

## Features Demonstrated

- **Simple Multi-Command**: Basic usage with default separator
- **Advanced Configuration**: Custom format templates with aliases
- **Error Handling**: Different strategies for handling command failures
- **Custom Separators**: Alternative ways to combine command results

## Running the Demo

```bash
# Install dependencies (from project root)
pnpm install

# Start the demo
cd playground/vite-multi-command
pnpm dev
```

## Examples Included

### 1. Simple Multi-Command
```typescript
command: {
  commands: [
    'git rev-parse --abbrev-ref HEAD',  // Get branch name
    'git rev-parse --short HEAD'        // Get short commit SHA
  ]
  // Output: "main-abc1234"
}
```

### 2. Advanced Multi-Command
```typescript
command: {
  commands: [
    { alias: 'tag', cmd: 'git describe --tags --abbrev=0', fallback: 'v0.0.0' },
    { alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD', fallback: 'unknown' },
    { alias: 'sha', cmd: 'git rev-parse --short HEAD' }
  ],
  format: '{tag}-{branch}-{sha}',
  errorStrategy: 'fallback'
  // Output: "v1.0.0-main-abc1234"
}
```

### 3. Error Handling Demo
```typescript
command: {
  commands: [
    { alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD' },
    { alias: 'invalid', cmd: 'this-command-does-not-exist', fallback: 'fallback-value' },
    { alias: 'sha', cmd: 'git rev-parse --short HEAD' }
  ],
  format: '{branch}-{invalid}-{sha}',
  errorStrategy: 'fallback'
  // Output: "main-fallback-value-abc1234"
}
```

### 4. Custom Separator
```typescript
command: {
  commands: [
    'git rev-parse --abbrev-ref HEAD',
    'git rev-parse --short HEAD',
    'git describe --tags --abbrev=0 || echo "no-tag"'
  ],
  separator: '_'
  // Output: "main_abc1234_v1.0.0"
}
```

## How to Inspect Results

1. **Browser Console**: Check for version logs and global variables
2. **Global Variables**: Access `window.__MULTI_COMMAND_*_VERSION__`
3. **Meta Tags**: View page source to see version meta tags
4. **Network Tab**: See how versions are used in the build process

## Configuration Options

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| `commands` | Array of commands to execute | `(string \| CommandConfig)[]` | - |
| `format` | Template with `{alias}` placeholders | `string` | - |
| `separator` | Default separator when no format | `string` | `"-"` |
| `errorStrategy` | Error handling: `strict`, `skip`, `fallback` | `string` | `"skip"` |
| `parallel` | Execute commands in parallel | `boolean` | `true` |

## Error Strategies

- **`strict`**: Any failure stops the build
- **`skip`**: Failed commands are ignored
- **`fallback`**: Use fallback values for failed commands