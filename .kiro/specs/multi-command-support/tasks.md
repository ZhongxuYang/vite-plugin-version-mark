# Implementation Plan

- [x] 1. 扩展类型定义和接口

  - 创建多命令相关的 TypeScript 类型定义
  - 扩展现有的 VitePluginVersionMarkInput 接口以支持新的 command 配置
  - 定义 CommandConfig、MultiCommandOptions、CommandResult 等核心类型
  - _Requirements: 1.1, 3.1, 4.1_

- [x] 2. 实现配置解析器 (ConfigurationParser)

  - 创建配置解析器类，用于解析和验证用户的 command 配置
  - 实现 parseCommandConfig 方法，区分字符串和多命令对象配置
  - 实现配置验证逻辑，确保用户配置的有效性
  - 添加向后兼容性检查，确保字符串配置正常工作
  - _Requirements: 3.1, 3.2, 4.1_

- [x] 3. 实现命令执行器 (CommandExecutor)
- [x] 3.1 创建基础命令执行功能

  - 重构现有的 execCommand 函数为 CommandExecutor 类
  - 实现 execSingleCommand 方法，保持现有单命令执行逻辑
  - 添加超时控制和错误处理机制
  - 编写单元测试验证单命令执行功能
  - _Requirements: 1.1, 3.1_

- [x] 3.2 实现多命令执行功能

  - 实现 execMultipleCommands 方法，支持多个命令的执行
  - 添加并行和串行执行模式的支持
  - 实现不同错误处理策略（strict、skip、fallback）
  - 添加命令执行结果的收集和管理
  - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2, 5.3_

- [x] 4. 实现结果格式化器 (ResultFormatter)
- [x] 4.1 创建模板解析功能

  - 实现 parseTemplate 方法，解析格式模板中的占位符
  - 支持 {alias} 格式的占位符语法
  - 处理模板中的特殊字符和转义
  - 编写单元测试验证模板解析功能
  - _Requirements: 2.1, 2.2, 4.2_

- [x] 4.2 实现结果格式化功能

  - 实现 format 方法，将多个命令结果按模板格式化
  - 支持默认分隔符连接（当未提供模板时）
  - 处理缺失结果的占位符替换
  - 添加格式化错误的处理逻辑
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 5. 更新核心分析逻辑 (analyticOptions)
- [x] 5.1 集成新的配置解析

  - 修改 analyticOptions 函数以支持新的 command 配置类型
  - 集成 ConfigurationParser 来解析用户配置
  - 保持现有的版本字段优先级逻辑不变
  - 确保向后兼容性，字符串配置使用原有逻辑
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 5.2 集成多命令执行流程

  - 在 analyticOptions 中集成 CommandExecutor 的多命令执行
  - 根据配置类型选择单命令或多命令执行路径
  - 集成 ResultFormatter 来格式化最终的版本信息
  - 处理执行过程中的错误和异常情况
  - _Requirements: 1.1, 1.2, 1.3, 2.1_

- [x] 6. 编写单元测试
- [x] 6.1 测试配置解析器

  - 测试字符串配置的解析和兼容性
  - 测试多命令对象配置的解析
  - 测试配置验证逻辑和错误处理
  - 测试边界情况和异常输入
  - _Requirements: 3.1, 4.1_

- [x] 6.2 测试命令执行器

  - 测试单命令执行的正确性和错误处理
  - 测试多命令的并行和串行执行
  - 测试不同错误处理策略的行为
  - 测试超时控制和资源管理
  - _Requirements: 1.1, 1.3, 5.1, 5.2, 5.3_

- [x] 6.3 测试结果格式化器

  - 测试模板解析的准确性
  - 测试结果格式化的各种场景
  - 测试占位符替换和默认分隔符
  - 测试格式化错误的处理
  - _Requirements: 2.1, 2.2, 4.2_

- [x] 7. 编写集成测试
- [x] 7.1 端到端功能测试

  - 创建测试用例覆盖不同的配置组合
  - 测试与现有功能的集成（ifGlobal、ifMeta 等）
  - 测试在实际 Vite 构建过程中的表现
  - 验证生成的版本信息在各种输出格式中的正确性
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 7.2 向后兼容性测试

  - 测试现有字符串配置在新版本中的兼容性
  - 验证现有项目升级后的功能正常性
  - 测试与其他版本相关选项的优先级处理
  - 确保 API 接口的向后兼容性
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 8. 更新文档和示例
- [x] 8.1 更新 TypeScript 类型文档

  - 更新类型定义文件的注释和文档
  - 添加新配置选项的 JSDoc 注释
  - 提供完整的类型使用示例
  - 确保 IDE 智能提示的完整性
  - _Requirements: 2.1, 4.1_

- [x] 8.2 更新 README 和使用示例

  - 在 README 中添加多命令配置的说明
  - 提供常见使用场景的配置示例
  - 更新配置选项表格，包含新的 command 配置格式
  - 添加错误处理策略的说明文档
  - _Requirements: 1.1, 2.1, 5.1_

- [x] 9. 创建示例项目和测试用例

  - 在 playground 目录中创建多命令配置的示例项目
  - 展示分支名 + commit SHA 的组合使用场景
  - 创建复杂格式模板的使用示例
  - 提供不同错误处理策略的演示
  - _Requirements: 1.1, 2.1, 5.1_

- [x] 10. 性能优化和最终测试
  - 优化多命令并行执行的性能
  - 添加命令执行结果的缓存机制
  - 进行压力测试，验证大量命令执行的稳定性
  - 最终的回归测试，确保所有功能正常工作
  - _Requirements: 1.1, 1.3_
