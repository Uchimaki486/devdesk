# DevDesk 项目入门

## 1. 项目是什么

DevDesk 是一个桌面端个人开发学习工作台。

技术栈：

- Electron：桌面窗口和系统能力
- React：界面和交互
- TypeScript：类型检查
- Vite：开发服务和构建
- pnpm：依赖管理

当前数据存在 `localStorage`，后续会迁移到 SQLite。

## 2. 如何启动

```powershell
pnpm.cmd dev
```

启动流程：

```text
pnpm dev
  -> Vite 启动 React 页面
  -> Electron 创建桌面窗口
  -> 窗口加载 React 页面
```

## 3. 关键入口

- `electron/main.ts`：Electron 主进程，创建窗口，处理系统能力
- `electron/preload.ts`：安全桥，只暴露前端需要的桌面 API
- `src/main.tsx`：React 入口，把 `App` 挂载到页面
- `src/App.tsx`：当前主界面，包含各页面

## 4. 目录结构

```text
devdesk/
  electron/
    main.ts          桌面窗口和系统能力
    preload.ts       主进程与前端之间的安全桥

  src/
    main.tsx         React 入口
    App.tsx          当前主界面
    App.css          主界面样式
    index.css        全局样式
    types.ts         业务类型
    storage.ts       localStorage 读写
    useWorkspaceData.ts 数据操作层
    global.d.ts      window.devdesk 类型声明

  package.json       脚本和依赖
  vite.config.ts     Vite + Electron 配置
  tsconfig.json      TypeScript 配置
```

## 5. 当前数据流

```text
App.tsx
  -> useWorkspaceData.ts
  -> storage.ts
  -> localStorage
```

例如新建日志：

```text
点击保存
  -> 调用 saveLog
  -> 更新 React 状态
  -> 自动保存到 localStorage
```

## 6. 重要文件怎么看

- `src/types.ts`：先看数据长什么样
- `src/storage.ts`：看数据保存在哪里
- `src/useWorkspaceData.ts`：看新增、编辑、删除怎么做
- `src/App.tsx`：看页面如何调用数据操作
- `electron/main.ts`：看桌面窗口如何创建
- `electron/preload.ts`：看前端能调用哪些桌面能力

推荐阅读顺序：

```text
package.json
src/main.tsx
src/types.ts
src/storage.ts
src/useWorkspaceData.ts
src/App.tsx
electron/main.ts
electron/preload.ts
```

## 7. 初学理解

React：

> 用函数描述界面，状态变化后界面自动更新。

TypeScript：

> 给 JavaScript 加类型，提前发现字段和参数错误。

Electron：

> 主进程负责桌面能力，React 负责界面，preload 负责安全连接。
