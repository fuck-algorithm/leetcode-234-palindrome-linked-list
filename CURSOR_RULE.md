# 项目编码规范和开发指南

## 核心规则

1. **始终使用中文回答**
   - 所有代码注释必须使用中文
   - 所有用户文档必须使用中文
   - 所有提交信息和代码审查评论必须使用中文

2. **代码质量和模块化**
   - 代码应该优雅可维护，遵循清晰的设计模式
   - 单个文件的代码行数不得超过200行，超过应当拆分为独立模块
   - 每个函数应该只做一件事情，函数长度应该控制在50行以内
   - 使用有意义的变量名和函数名，避免无意义的缩写

## 文件拆分指南

当文件超过200行时，应遵循以下指南进行重构：

1. **按功能拆分**
   - 将不同功能的组件拆分到独立文件中
   - 例如：`PalindromeVisualization.tsx`中的`NodeComponent`、`LinkComponent`等应分别移至`components/`目录下

2. **按类型拆分**
   - 将常量、类型定义、工具函数等分别放在独立文件中
   - 例如：颜色常量应单独放在`constants/colors.ts`中

3. **示例重构建议**
   - 当前`PalindromeVisualization.tsx`超过1400行，应拆分为：
     * `visualizations/components/NodeComponent.tsx`
     * `visualizations/components/LinkComponent.tsx`
     * `visualizations/components/IndicatorComponent.tsx`
     * `visualizations/components/LegendComponent.tsx`
     * `visualizations/constants/VisualizationConstants.ts`
     * `visualizations/PalindromeVisualization.tsx`（主组件）

## 代码风格指南

1. **排版与格式**
   - 使用2个空格进行缩进（不使用Tab）
   - 每行不超过100个字符
   - 花括号始终使用K&R风格（左括号不换行）
   - 函数参数超过3个时应换行

2. **命名约定**
   - 组件使用PascalCase（如`NodeComponent`）
   - 函数和变量使用camelCase（如`getNodePosition`）
   - 常量使用UPPER_SNAKE_CASE（如`NODE_RADIUS`）
   - 类型和接口使用PascalCase（如`NodeData`）

3. **React最佳实践**
   - 使用函数组件和Hooks，避免使用类组件
   - 使用`useMemo`和`useCallback`优化性能
   - 避免在渲染过程中进行复杂计算
   - 组件props应该使用TypeScript类型定义

## 代码评审清单

提交代码前，确保：

- [ ] 文件行数未超过200行
- [ ] 函数行数未超过50行
- [ ] 所有注释和变量名使用中文
- [ ] 没有未使用的导入和变量
- [ ] 所有可能的错误情况都有处理
- [ ] 符合项目的TypeScript规范
- [ ] 性能敏感的部分使用了适当的优化

## 实施建议

1. **现有代码重构计划**
   - 优先重构`PalindromeVisualization.tsx`文件（超过1400行）
   - 其次重构`AlgorithmExplanation.tsx`文件（超过200行）
   - 最后重构`palindromeChecker.ts`文件

2. **新功能开发规范**
   - 在开发新功能前先设计组件结构
   - 确保新增代码符合模块化原则
   - 每个PR应包含对应的文档更新

# 游标规则 (Cursor Rules)

本项目遵循以下游标规则，所有项目贡献者和 AI 助手均需遵守这些规则。

## 语言要求

1. **使用中文回答** - 所有交流、注释和文档必须使用中文，包括代码注释。English should not be used unless it's part of a technical term or code. AI助手必须始终使用中文回复用户，即使用户使用其他语言提问。

## 代码质量与风格

1. **代码优雅可维护** - 代码应该简洁、清晰，遵循良好的编程实践，并使用有意义的变量和函数名称。

2. **模块化设计** - 将功能拆分为独立的模块和组件，每个模块应当有明确的职责。

3. **文件大小限制** - 单个文件不应超过 200 行代码。如果超过该限制，应该将其重构为多个独立的小模块。

4. **类型安全** - 使用 TypeScript 的类型系统确保代码类型安全，避免使用 `any` 类型。

5. **注释规范** - 为每个组件、函数和复杂逻辑添加适当的注释，解释其用途和工作原理。

## 组件设计原则

1. **单一职责** - 每个组件只负责一个功能或表示一种视觉元素。

2. **可复用性** - 组件应当设计为可复用的，避免重复代码。

3. **props 接口** - 每个组件应当有明确定义的 props 接口，使用 TypeScript 类型来约束。

4. **逻辑与视图分离** - 将业务逻辑与视图渲染分离，使用自定义 hooks 管理复杂状态和副作用。

## 项目结构

1. **目录组织** - 项目应遵循清晰的目录结构，相关功能应当放在一起。

2. **命名约定** - 使用一致的文件和目录命名约定：
   - 组件文件名使用 PascalCase（如 `NodeComponent.tsx`）
   - 工具和钩子函数使用 camelCase（如 `palindromeChecker.ts`）
   - 常量文件使用 PascalCase 后缀 Constants（如 `VisualizationConstants.ts`）

3. **导入顺序** - 导入语句应按照以下顺序排列：
   - React 和外部库
   - 项目内部组件
   - 工具函数和常量
   - 样式文件

## 视觉设计和交互

1. **响应式设计** - 组件应当能够适应不同屏幕尺寸和设备。

2. **可访问性** - 确保组件符合 Web 可访问性标准，包括适当的 ARIA 属性和键盘导航。

3. **一致的视觉语言** - 保持一致的颜色、字体和间距，创建统一的用户体验。

## 性能考虑

1. **避免不必要的渲染** - 使用 `React.memo`、`useMemo` 和 `useCallback` 来避免不必要的重新渲染。

2. **异步加载** - 对于大型组件或不是立即需要的功能，考虑使用异步加载。

3. **性能监控** - 定期检查组件性能，确保良好的用户体验。

---

遵循这些规则将帮助我们维护一个干净、高效且可维护的代码库。 