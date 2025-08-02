# 多命令版本标记演示

这个演示项目展示了 `vite-plugin-version-mark` 中新的多命令支持功能。它演示了配置和使用多个命令来生成丰富版本信息的各种方式。

## 演示功能

- **简单多命令**：使用默认分隔符的基本用法
- **高级配置**：带别名的自定义格式模板
- **错误处理**：处理命令失败的不同策略
- **自定义分隔符**：组合命令结果的替代方式

## 运行演示

```bash
# 安装依赖（从项目根目录）
pnpm install

# 启动演示
cd playground/vite-multi-command
pnpm dev
```

## 包含的示例

### 1. 简单多命令
```typescript
command: {
  commands: [
    'git rev-parse --abbrev-ref HEAD',  // 获取分支名
    'git rev-parse --short HEAD'        // 获取短 SHA
  ]
  // 输出: "main-abc1234"
}
```

### 2. 高级多命令
```typescript
command: {
  commands: [
    { alias: 'tag', cmd: 'git describe --tags --abbrev=0', fallback: 'v0.0.0' },
    { alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD', fallback: 'unknown' },
    { alias: 'sha', cmd: 'git rev-parse --short HEAD' }
  ],
  format: '{tag}-{branch}-{sha}',
  errorStrategy: 'fallback'
  // 输出: "v1.0.0-main-abc1234"
}
```

### 3. 错误处理演示
```typescript
command: {
  commands: [
    { alias: 'branch', cmd: 'git rev-parse --abbrev-ref HEAD' },
    { alias: 'invalid', cmd: 'this-command-does-not-exist', fallback: 'fallback-value' },
    { alias: 'sha', cmd: 'git rev-parse --short HEAD' }
  ],
  format: '{branch}-{invalid}-{sha}',
  errorStrategy: 'fallback'
  // 输出: "main-fallback-value-abc1234"
}
```

### 4. 自定义分隔符
```typescript
command: {
  commands: [
    'git rev-parse --abbrev-ref HEAD',
    'git rev-parse --short HEAD',
    'git describe --tags --abbrev=0 || echo "no-tag"'
  ],
  separator: '_'
  // 输出: "main_abc1234_v1.0.0"
}
```

## 如何检查结果

1. **浏览器控制台**：查看版本日志和全局变量
2. **全局变量**：访问 `window.__MULTI_COMMAND_*_VERSION__`
3. **Meta 标签**：查看页面源代码中的版本 meta 标签
4. **网络标签**：查看版本在构建过程中的使用情况

## 配置选项

| 选项 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `commands` | 要执行的命令数组 | `(string \| CommandConfig)[]` | - |
| `format` | 带有 `{alias}` 占位符的模板 | `string` | - |
| `separator` | 无格式时的默认分隔符 | `string` | `"-"` |
| `errorStrategy` | 错误处理：`strict`、`skip`、`fallback` | `string` | `"skip"` |
| `parallel` | 并行执行命令 | `boolean` | `true` |

## 错误策略

- **`strict`**：任何失败都会停止构建
- **`skip`**：忽略失败的命令
- **`fallback`**：对失败的命令使用回退值