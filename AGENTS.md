# DevDesk 协作规则

## 1. 分工

用户负责全局环境：

- 安装 Node.js、pnpm、Git、VS Code、SQLite 等系统工具
- 配置 PATH、PowerShell 执行策略、环境变量和系统权限
- 执行全局安装或系统安装命令

Codex 负责项目内工作：

- 编写和修改项目源码、配置和文档
- 创建、调整项目结构
- 添加、移除或配置项目内依赖
- 运行项目内检查命令，例如 `pnpm.cmd lint`
- 说明需要用户执行的全局环境命令

Codex 不执行：

- `npm install -g`、`pnpm setup` 等全局安装或全局配置命令
- 修改 PATH、PowerShell 策略、系统环境变量
- 安装系统软件或系统依赖

## 2. 技术方向

- 桌面端：Electron
- 前端：React + TypeScript
- 构建工具：Vite
- 包管理：pnpm
- 样式：普通 CSS
- 当前数据存储：localStorage
- 后续数据存储：SQLite

## 3. 开发规则

- 每次只做一个小目标。
- 修改前先读相关文件。
- 优先复用当前项目已有写法。
- 不做无关重构。
- 页面组件不要直接读写底层存储。
- 前端不要直接访问 Node.js 或 Electron API，统一通过 `preload` 暴露的安全 API。
- 修改后运行必要检查，通常是：

```powershell
pnpm.cmd lint
.\node_modules\.bin\tsc.CMD --noEmit
```

## 4. 文件位置

按职责放文件：

- `electron/`：Electron 主进程、preload、桌面能力相关代码
- `src/`：React 前端源码
- `src/App.tsx`：当前主界面入口，后续变大后逐步拆分
- `src/types.ts`：核心业务类型
- `src/storage.ts`：当前 localStorage 存储层
- `src/useWorkspaceData.ts`：当前前端数据操作层
- `src/App.css`：当前主界面样式
- `src/index.css`：全局基础样式
- `public/`：静态资源

后续代码变多时，优先按下面结构拆分：

```text
src/
  pages/        页面级组件
  components/   可复用 UI 组件
  hooks/        React hooks
  services/     数据访问、系统能力封装
  styles/       样式文件
  utils/        通用工具函数
```

不要随意把业务逻辑、样式、类型和工具函数混在同一个大文件里。

## 5. 文件命名

- React 组件文件使用 PascalCase：`ProjectCard.tsx`、`TaskColumn.tsx`
- 页面组件使用 `Page` 后缀：`ProjectsPage.tsx`
- Hook 文件使用 camelCase，并以 `use` 开头：`useWorkspaceData.ts`
- 普通工具、服务文件使用 camelCase：`dateUtils.ts`、`projectService.ts`
- 类型文件可以集中为 `types.ts`，后续变大再拆成 `projectTypes.ts`
- CSS 文件和组件同名优先：`ProjectCard.css`
- 文档文件使用大写下划线或清晰英文名：`README.md`、`PROJECT_OVERVIEW.md`

## 6. 代码命名

- 变量和函数使用 camelCase：`projectNameById`、`saveProject`
- React 组件使用 PascalCase：`Dashboard`、`ProjectsPage`
- TypeScript 类型使用 PascalCase：`Project`、`TaskStatus`
- 常量使用 UPPER_SNAKE_CASE：`STORAGE_KEY`
- 布尔变量使用清晰语义：`isEditing`、`hasChanges`
- 事件处理函数使用 `handle` 前缀：`handleSubmit`、`handleDelete`
- 表单状态变量使用 `form` 或明确名称：`projectForm`
- 数组命名使用复数：`projects`、`tasks`

命名要表达业务含义，不使用 `data1`、`temp`、`foo`、`handleClick2` 这类临时名字。

## 7. 函数和组件规范

- 一个函数只做一件明确的事。
- 优先写小函数，避免超长函数。
- 表单提交函数命名为 `handleSubmit`。
- 删除函数命名为 `handleDeleteXxx` 或数据层的 `deleteXxx`。
- 数据层方法使用动作命名：`saveLog`、`deleteTask`、`updateTaskStatus`。
- React 页面组件只负责页面状态和调用数据层，不直接处理底层存储。
- 组件 props 需要有明确类型。
- 复杂 JSX 变长后，应拆成小组件。

## 8. TypeScript 规则

- 避免使用 `any`。
- 新增业务字段时，先更新 `src/types.ts`。
- 字符串状态值优先用联合类型，例如 `TaskStatus`。
- 函数参数和返回值能明确就写清楚。
- 不绕过类型检查，除非有明确原因并加简短注释。

## 9. Git 管理

每完成一个明确功能点，建议提交一次。

提交前检查：

```powershell
git status
git diff
pnpm.cmd lint
```

提交信息格式：

```text
type: short description
```

常用 type：

- `feat`：新功能
- `fix`：修复问题
- `refactor`：重构
- `docs`：文档
- `style`：样式调整
- `chore`：配置、依赖、脚手架、杂项
- `test`：测试

示例：

```powershell
git commit -m "feat: add learning log editing"
git commit -m "fix: keep task status after reload"
git commit -m "refactor: extract workspace data actions"
git commit -m "docs: add git guide"
git commit -m "chore: update electron config"
```

分支命名建议：

```text
feat/log-editing
fix/window-startup
refactor/storage-layer
docs/project-overview
```

推荐流程：

```powershell
git checkout main
git pull origin main
git checkout -b feat/small-feature
```

开发完成后：

```powershell
git add .
git commit -m "feat: add small feature"
git push -u origin feat/small-feature
```

优先通过 GitHub Pull Request 合并到 `main`。

## 10. 文档约定

- `README.md` 可提交到 Git。
- 其他学习型 Markdown 文档默认本地保留，是否提交由用户决定。
