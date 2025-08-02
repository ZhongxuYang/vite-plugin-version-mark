# Requirements Document

## Introduction

扩展 vite-plugin-version-mark 的 command 参数功能，使其支持多个命令的组合执行，以便生成更丰富的版本信息。目前 command 参数只支持单个字符串命令，新功能将允许用户配置多个命令并将结果组合成最终的版本号。

## Requirements

### Requirement 1

**User Story:** 作为一个开发者，我希望能够配置多个 git 命令来生成版本号，这样我就可以同时获取分支名和提交 SHA 信息。

#### Acceptance Criteria

1. WHEN 用户配置 command 为数组格式 THEN 插件 SHALL 依次执行每个命令并收集结果
2. WHEN 多个命令都执行成功 THEN 插件 SHALL 将结果按照指定的格式组合成最终版本号
3. WHEN 任何一个命令执行失败 THEN 插件 SHALL 记录错误并使用默认版本号或跳过失败的命令

### Requirement 2

**User Story:** 作为一个开发者，我希望能够自定义多个命令结果的组合格式，这样我就可以控制最终版本号的显示样式。

#### Acceptance Criteria

1. WHEN 用户提供格式模板 THEN 插件 SHALL 使用模板来格式化多个命令的结果
2. WHEN 格式模板包含占位符 THEN 插件 SHALL 将命令结果替换到对应的占位符位置
3. IF 用户未提供格式模板 THEN 插件 SHALL 使用默认的连接方式（如用 "-" 连接）

### Requirement 3

**User Story:** 作为一个开发者，我希望新的多命令功能向后兼容现有的字符串配置，这样我就不需要修改现有的配置。

#### Acceptance Criteria

1. WHEN 用户配置 command 为字符串 THEN 插件 SHALL 保持原有的单命令执行逻辑
2. WHEN 用户配置 command 为数组 THEN 插件 SHALL 使用新的多命令执行逻辑
3. WHEN 用户同时配置了其他版本相关选项（如 ifShortSHA）THEN 插件 SHALL 按照现有的优先级规则处理

### Requirement 4

**User Story:** 作为一个开发者，我希望能够为每个命令配置别名或标识符，这样我就可以在格式模板中更清晰地引用特定命令的结果。

#### Acceptance Criteria

1. WHEN 用户为命令配置别名 THEN 插件 SHALL 使用别名作为结果的标识符
2. WHEN 在格式模板中使用别名占位符 THEN 插件 SHALL 将对应命令的结果替换到该位置
3. IF 用户未配置别名 THEN 插件 SHALL 使用默认的索引标识符（如 $0, $1, $2）

### Requirement 5

**User Story:** 作为一个开发者，我希望能够配置命令执行的错误处理策略，这样我就可以控制当某个命令失败时的行为。

#### Acceptance Criteria

1. WHEN 用户配置严格模式 AND 任何命令失败 THEN 插件 SHALL 抛出错误并停止构建
2. WHEN 用户配置宽松模式 AND 某个命令失败 THEN 插件 SHALL 跳过该命令并继续处理其他命令
3. WHEN 用户配置回退模式 AND 某个命令失败 THEN 插件 SHALL 使用预设的默认值替代失败命令的结果