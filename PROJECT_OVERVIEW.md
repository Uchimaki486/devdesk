# DevDesk 项目入门导览

这份文档面向刚开始学习 React、Electron 和 TypeScript 的阶段，用来说明项目从哪里启动、每个目录做什么、关键配置文件怎么看。

## 1. 这个项目是什么

DevDesk 是一个桌面端个人开发学习工作台。

当前技术栈：

- Electron：让网页应用变成桌面软件
- React：负责界面和交互
- TypeScript：给 JavaScript 加类型
- Vite：负责前端开发服务和打包
- pnpm：负责项目依赖管理

当前数据暂存在浏览器本地存储 `localStorage`，后续再迁移到 SQLite。

## 2. 程序从哪里启动

开发时执行：

```powershell
pnpm.cmd dev
```

启动后大致发生这些事：

1. Vite 启动 React 前端页面。
2. Electron 启动桌面窗口。
3. Electron 窗口加载 React 页面。
4. React 渲染 DevDesk 的界面。

可以把它理解成：

```text
pnpm dev
  -> Vite
  -> Electron
  -> React 页面
  -> DevDesk 工作台
```

## 3. 三个重要入口

### 3.1 桌面端入口

文件：

```text
electron/main.ts
```

作用：

- 创建 Electron 桌面窗口
- 设置窗口大小、标题、背景色
- 加载 React 页面
- 处理桌面端能力，例如打开网页链接或本地路径

你可以先重点看：

```ts
function createWindow() {
  win = new BrowserWindow(...)
}
```

这就是创建桌面窗口的地方。

### 3.2 安全桥入口

文件：

```text
electron/preload.ts
```

作用：

- 连接 Electron 主进程和 React 页面
- 只暴露允许前端使用的桌面能力

当前暴露了：

```ts
window.devdesk.system.openTarget(...)
```

它用于从界面里打开网页链接或本地路径。

### 3.3 React 前端入口

文件：

```text
src/main.tsx
```

作用：

- 找到 HTML 里的 `root`
- 把 React 应用挂载进去
- 渲染 `App`

核心代码：

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(...)
```

这表示 React 从这里开始接管页面。

## 4. 主要目录结构

```text
devdesk/
  electron/
    main.ts
    preload.ts
    electron-env.d.ts

  src/
    App.tsx
    App.css
    main.tsx
    index.css
    storage.ts
    useWorkspaceData.ts
    types.ts
    global.d.ts

  public/
  package.json
  vite.config.ts
  tsconfig.json
  electron-builder.json5
```

## 5. src 目录怎么看

### 5.1 `src/App.tsx`

这是当前最重要的界面文件。

它包含：

- 左侧导航
- 首页 Dashboard
- 项目 Projects
- 日志 Logs
- 任务 Tasks
- 应用入口 Apps
- 设置 Settings

你可以把 `App.tsx` 理解成：

> DevDesk 当前所有页面的主界面。

后续项目变大后，我们会把里面的页面拆成多个组件文件。

### 5.2 `src/useWorkspaceData.ts`

这是当前的数据操作层。

它负责：

- 新建项目
- 删除项目
- 新建日志
- 删除日志
- 新建任务
- 修改任务状态
- 删除任务
- 新建应用入口
- 删除应用入口

React 页面不直接修改底层存储，而是调用这里的方法。

这样做的好处是：后续从 `localStorage` 迁移到 SQLite 时，主要改这里，不用把所有页面都重写。

### 5.3 `src/storage.ts`

这是当前的数据保存层。

它负责：

- 从 `localStorage` 读取数据
- 把数据保存到 `localStorage`
- 提供初始示例数据
- 生成 id

当前存储 key 是：

```text
devdesk-data-v1
```

### 5.4 `src/types.ts`

这是 TypeScript 类型定义文件。

它定义了项目中用到的数据结构，例如：

- `Project`
- `LearningLog`
- `Task`
- `AppEntry`
- `DevDeskData`

类型的作用是告诉编辑器和 TypeScript：

> 一个项目应该有哪些字段，一个任务应该有哪些字段。

### 5.5 `src/App.css`

这是 DevDesk 主界面的样式。

它控制：

- 左侧导航
- 页面布局
- 表单样式
- 卡片样式
- 任务列布局
- 响应式布局

### 5.6 `src/index.css`

这是全局基础样式。

它控制：

- 全局字体
- 页面背景色
- body 默认样式

## 6. electron 目录怎么看

### 6.1 `electron/main.ts`

Electron 主进程。

它更接近“桌面软件外壳”，负责窗口和系统能力。

当前重点：

- `BrowserWindow`：创建窗口
- `ipcMain.handle`：接收前端请求
- `shell.openExternal`：打开网页
- `shell.openPath`：打开本地路径

### 6.2 `electron/preload.ts`

Electron preload 脚本。

它运行在主进程和前端页面之间，是安全桥。

当前只暴露：

```ts
window.devdesk.system.openTarget
```

不要在 React 页面里直接使用 Node.js 或 Electron API，这是为了安全和可维护。

### 6.3 `electron/electron-env.d.ts`

Electron 模板生成的类型声明文件。

暂时不用重点看。

## 7. 配置文件说明

### 7.1 `package.json`

项目说明书。

里面包含：

- 项目名称
- 项目版本
- 启动命令
- 依赖列表

常用命令：

```json
"dev": "vite",
"build": "tsc && vite build && electron-builder",
"lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
```

目前常用：

```powershell
pnpm.cmd dev
pnpm.cmd lint
```

### 7.2 `vite.config.ts`

Vite 和 Electron 的连接配置。

它告诉项目：

- React 插件怎么启用
- Electron 主进程入口是 `electron/main.ts`
- preload 入口是 `electron/preload.ts`

### 7.3 `tsconfig.json`

TypeScript 配置。

它告诉 TypeScript：

- 使用哪些语法规则
- 检查哪些文件
- 如何理解 `.ts` 和 `.tsx`

### 7.4 `electron-builder.json5`

Electron 打包配置。

后续打包 Windows 应用时会用到。

当前阶段先不用重点关注。

### 7.5 `pnpm-lock.yaml`

依赖锁文件。

它记录每个依赖的精确版本，保证你下次安装和现在一致。

应该提交到 Git。

### 7.6 `pnpm-workspace.yaml`

pnpm 配置文件。

当前记录了允许构建的依赖，例如：

```yaml
allowBuilds:
  electron: true
  esbuild: true
```

应该提交到 Git。

## 8. React 入门理解

React 可以先理解成：

> 用函数描述界面。

例如：

```tsx
function App() {
  return <div>Hello</div>
}
```

这个函数返回什么，界面就显示什么。

当前项目里：

- `App` 是总界面
- `Dashboard` 是首页
- `ProjectsPage` 是项目页
- `TasksPage` 是任务页

这些都是 React 组件。

## 9. TypeScript 入门理解

TypeScript 可以先理解成：

> 带类型检查的 JavaScript。

例如：

```ts
type Project = {
  id: string
  name: string
}
```

它表示一个 `Project` 必须有 `id` 和 `name`，而且都是字符串。

这样写代码时，编辑器可以提前提示错误。

## 10. Electron 入门理解

Electron 可以先理解成两部分：

```text
主进程：管理窗口和系统能力
渲染进程：显示页面，也就是 React 界面
```

在当前项目中：

```text
electron/main.ts       主进程
electron/preload.ts    安全桥
src/App.tsx            渲染进程里的 React 界面
```

前端页面如果需要桌面能力，不直接碰系统，而是通过 preload 暴露的方法调用。

## 11. 当前数据流

当前数据流是：

```text
App.tsx 页面操作
  -> useWorkspaceData.ts
  -> storage.ts
  -> localStorage
```

例如新建任务：

```text
点击新建任务
  -> 调用 addTask
  -> 更新 React 状态
  -> 自动保存到 localStorage
```

## 12. 建议阅读顺序

第一次读代码建议按这个顺序：

1. `package.json`
2. `src/main.tsx`
3. `src/App.tsx`
4. `src/types.ts`
5. `src/useWorkspaceData.ts`
6. `src/storage.ts`
7. `electron/main.ts`
8. `electron/preload.ts`

不用一次全部看懂。先知道每个文件负责什么，就已经很好。

## 13. 下一步学习建议

接下来可以围绕一个小功能学习，例如：

- 给日志增加编辑功能
- 给任务增加编辑功能
- 增加 JSON 导出功能
- 把一个页面拆成独立组件

每次只做一个小功能，先理解方案，再写代码，再看 Git diff 复盘。
