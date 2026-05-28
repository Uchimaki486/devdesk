# DevDesk 项目协作规范

本文件用于约定 DevDesk 项目的协作方式、项目管理节奏、代码命名规则和关键文件职责。后续无论是用户手动开发，还是 Codex 协助开发，都优先遵守这里的规则。

## 1. 项目定位

DevDesk 是一个本地单用户桌面应用，用来管理个人开发项目、学习日志、任务和后续小工具入口。

当前技术方向：

- 桌面端：Electron
- 前端：React + TypeScript
- 构建工具：Vite
- 包管理：pnpm
- 样式：普通 CSS
- 当前数据存储：localStorage
- 后续数据存储：SQLite

第一阶段目标不是做复杂项目管理系统，而是做一个清晰、可运行、可迭代的个人开发学习工作台。

## 2. 协作分工

用户负责全局环境：

- 安装 Node.js、pnpm、Git、VS Code、SQLite 等系统工具。
- 配置 PATH、PowerShell 执行策略、环境变量和系统权限。
- 执行全局安装、系统安装、系统设置类命令。

Codex 负责项目内工作：

- 编写和修改项目源码、配置和文档。
- 创建或调整项目结构。
- 添加、移除或配置项目内依赖。
- 运行项目内检查和构建命令。
- 说明需要用户执行的全局环境命令。

Codex 不执行：

- `npm install -g`、`pnpm setup` 等全局安装或全局配置命令。
- 修改 PATH、PowerShell 策略、系统环境变量。
- 安装系统软件或系统依赖。

Codex 可以执行：

- `pnpm install`
- `pnpm add <package>`
- `pnpm lint`
- `pnpm build`
- `pnpm dev`
- 读取、搜索、创建和修改项目文件。

## 3. 开发流程

每次开发建议遵循这个顺序：

1. 明确本次只做一个小目标。
2. 先读相关文件，再动代码。
3. 优先复用当前项目已有写法。
4. 修改后运行必要检查。
5. 看 git diff，确认没有无关改动。
6. 每完成一个明确功能点，都提醒用户进行一次 Git 提交。
7. 再决定是否提交。

常用命令：

```powershell
pnpm.cmd install
pnpm.cmd dev
pnpm.cmd lint
pnpm.cmd build
```

如果 PowerShell 对 `.ps1` 有限制，优先使用 `pnpm.cmd`。

## 4. 目录职责

```text
devdesk/
  electron/                 Electron 主进程和 preload
  public/                   静态资源
  src/                      React 前端源码
  package.json              项目脚本和依赖
  vite.config.ts            Vite 与 Electron 插件配置
  electron-builder.json5    Electron 打包配置
  AGENTS.md                 项目协作规则
```

### electron/

- `electron/main.ts`
  - Electron 主进程入口。
  - 负责创建窗口、加载前端页面、处理系统能力。
  - SQLite 接入后，数据库访问应优先放在主进程或主进程调用的模块中。

- `electron/preload.ts`
  - Electron 安全桥。
  - 只暴露前端真正需要的能力。
  - React 页面不要直接访问 Node.js 或 Electron API。

- `electron/electron-env.d.ts`
  - Electron 相关类型声明。
  - 通常不需要频繁修改。

### src/

- `src/main.tsx`
  - React 渲染入口。
  - 只负责挂载应用，不放业务逻辑。

- `src/App.tsx`
  - 当前主要界面文件。
  - 包含页面切换、表单、列表和页面组件。
  - 后续文件变大后，应逐步拆分到 `src/components/` 和 `src/pages/`。

- `src/App.css`
  - 当前主界面样式。
  - 修改布局、表单、卡片、任务列等样式时优先看这里。

- `src/index.css`
  - 全局基础样式。
  - 只放字体、body、全局背景等基础规则。

- `src/types.ts`
  - 核心数据类型定义。
  - 修改 Project、Task、LearningLog、AppEntry 字段时必须先更新这里。

- `src/storage.ts`
  - 当前 localStorage 存储层。
  - 负责读取、保存、初始数据和 id 生成。
  - 后续迁移 SQLite 时，应保留清晰的数据边界。

- `src/useWorkspaceData.ts`
  - 当前前端数据操作层。
  - 页面组件通过这里新增、编辑、删除和更新数据。
  - 不要在页面里到处直接写存储逻辑。

- `src/global.d.ts`
  - 前端可访问的 `window.devdesk` 类型声明。
  - preload 暴露 API 后，要同步更新这里。

## 5. 命名规范

### 文件命名

- React 组件文件使用 PascalCase：
  - `App.tsx`
  - `ProjectCard.tsx`
  - `TaskColumn.tsx`

- Hook 文件使用 camelCase，并以 `use` 开头：
  - `useWorkspaceData.ts`
  - `useTaskFilters.ts`

- 普通工具或服务文件使用 camelCase：
  - `storage.ts`
  - `projectService.ts`
  - `dateUtils.ts`

- 类型文件可集中使用：
  - `types.ts`

如果后续模块变多，可以拆成：

```text
src/
  pages/
  components/
  hooks/
  services/
  styles/
```

### 变量和函数命名

- 变量、函数使用 camelCase：
  - `projectNameById`
  - `saveProject`
  - `deleteTask`

- React 组件使用 PascalCase：
  - `Dashboard`
  - `ProjectsPage`
  - `TaskCard`

- TypeScript 类型使用 PascalCase：
  - `Project`
  - `TaskStatus`
  - `DevDeskData`

- 常量使用明确语义。全局常量可以使用 UPPER_SNAKE_CASE：
  - `STORAGE_KEY`

### 类型命名

- 表单类型以 `Form` 结尾：
  - `ProjectForm`
  - `TaskForm`

- 状态联合类型以 `Status` 结尾：
  - `ProjectStatus`
  - `TaskStatus`

- 枚举式字符串联合类型保持简短清晰：
  - `Priority`
  - `AppEntryType`

## 6. 代码组织规则

### 页面组件

页面组件负责：

- 展示页面结构。
- 处理表单状态。
- 调用数据操作方法。

页面组件不负责：

- 直接读写 localStorage。
- 直接调用 SQLite。
- 直接调用 Electron 主进程。

### 数据操作

当前数据流：

```text
React 页面
  -> useWorkspaceData.ts
  -> storage.ts
  -> localStorage
```

后续 SQLite 数据流建议：

```text
React 页面
  -> renderer service 或 hook
  -> window.devdesk.*
  -> preload.ts
  -> electron/main.ts
  -> SQLite
```

### Electron 能力

前端需要桌面能力时，必须经过 preload 暴露的安全 API。

允许：

```ts
window.devdesk.system.openTarget(target);
```

避免：

```ts
import { shell } from "electron";
```

React 渲染层不直接导入 Electron、Node.js、fs、path、sqlite 相关模块。

## 7. 样式规范

- 当前阶段使用普通 CSS，不引入大型 UI 组件库。
- 优先保持工作台风格：清晰、稳定、信息密度适中。
- 卡片圆角控制在 8px 左右。
- 表单、按钮、列表、面板样式尽量复用已有 class。
- 不做复杂动画，不做花哨背景。
- 移动端适配先保证可用，不追求完整移动端体验。

CSS 命名建议：

- 页面外壳：`app-shell`、`workspace`
- 导航：`sidebar`、`nav-list`
- 页面：`page`、`page-header`
- 表单：`editor`、`field`、`form-actions`
- 列表：`card-list`、`item-card`
- 任务：`task-columns`、`task-column`、`task-card`

新增样式时优先沿用已有语义，不随意新增同义 class。

## 8. 数据模型规则

核心数据类型在 `src/types.ts` 中维护。

当前核心实体：

- `Project`
- `LearningLog`
- `Task`
- `AppEntry`
- `DevDeskData`

修改数据字段时，要同步检查：

1. `src/types.ts`
2. `src/storage.ts` 的 `initialData`
3. `src/useWorkspaceData.ts` 的新增/编辑逻辑
4. `src/App.tsx` 中相关表单和展示
5. 后续 SQLite schema 和迁移逻辑

字段命名统一使用 camelCase：

- `projectId`
- `currentGoal`
- `nextStep`
- `localPath`
- `repoUrl`
- `dueDate`

不要混用 `snake_case` 和 `camelCase`。如果 SQLite 表字段使用 `snake_case`，需要在数据访问层统一转换。

## 9. 当前优先级

当前项目已经有基础界面和 localStorage 数据层。下一步优先级建议：

1. 安装依赖并跑通 `pnpm.cmd lint`、`pnpm.cmd build`、`pnpm.cmd dev`。
2. 补齐 Tasks 编辑功能。
3. 补齐 Logs 编辑功能。
4. 补齐 Apps 编辑功能。
5. 逐步拆分 `src/App.tsx`，降低单文件复杂度。
6. 再考虑 SQLite 接入。

SQLite 不建议过早接入。先把页面 CRUD 和数据边界稳定下来，再迁移存储层。

## 10. 关键位置标注

开发时重点关注这些位置：

```text
src/types.ts
  数据结构源头。字段变化先改这里。

src/storage.ts
  当前持久化入口。localStorage 初始数据和保存逻辑在这里。

src/useWorkspaceData.ts
  当前业务数据操作入口。新增、编辑、删除逻辑优先放这里。

src/App.tsx
  当前页面和交互集中地。新增页面交互时先看对应 Page 组件。

src/global.d.ts
  window.devdesk 类型声明。preload API 变化时同步更新。

electron/preload.ts
  前端和主进程之间的安全桥。只暴露必要 API。

electron/main.ts
  Electron 主进程入口。窗口、系统能力、后续 SQLite 都从这里扩展。

vite.config.ts
  Vite + Electron 插件配置。一般少改，除非调整构建入口。

package.json
  项目脚本和依赖。新增依赖或脚本时同步检查这里。
```

## 11. Git 规范

每完成一个独立功能、修复或文档更新后，Codex 都要提醒用户可以提交一次 Git 记录。提醒内容应包含：

- 当前主要改动了哪些文件。
- 建议的提交信息。
- 可以直接执行的 Git 命令。

提交前建议检查：

```powershell
git status --short
git diff
pnpm.cmd lint
pnpm.cmd build
```

如果文件已经暂存，可以用下面命令查看暂存内容：

```powershell
git diff --cached
```

常用提交流程：

```powershell
git status --short
git diff
git add .gitignore AGENTS.md src/App.tsx src/useWorkspaceData.ts
git diff --cached
git commit -m "添加任务编辑功能"
```

如果本次只改了部分文件，就只 `git add` 本次相关文件，不要随手 `git add .`。

提交信息建议使用简短中文或英文动词开头：

- `添加任务编辑功能`
- `拆分项目页面组件`
- `修复应用入口打开逻辑`
- `docs: update project conventions`

不要把以下内容提交到 Git：

- `node_modules/`
- `dist/`
- `dist-electron/`
- 本地临时文件
- 系统环境配置文件

## 12. 文档维护

重要设计变化要同步更新文档：

- 项目方向变化：更新 `DevDesk-方案.md`
- 阶段计划变化：更新 `DevDesk-Electron-开发计划.md`
- 新人入口说明：更新 `PROJECT_OVERVIEW.md`
- 协作和命名规范变化：更新 `AGENTS.md`

文档要服务开发，不追求一次写完。每次只补和当前阶段相关的内容。
