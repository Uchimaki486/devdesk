# DevDesk Electron 开发计划

## 1. 当前目标

本阶段目标是把 DevDesk 的技术路线固定为：

> Electron + React + TypeScript + SQLite

DevDesk 第一版是一个本地单用户桌面应用，用于管理个人开发项目、学习日志、任务和后续小应用入口。

第一版优先做到：

- 能打开桌面窗口
- 有清晰的工作台界面
- 能管理 Projects、Logs、Tasks、Apps
- 数据最终保存在本地 SQLite
- 后续可以继续扩展或迁移到 Tauri

## 2. 当前环境检查结果

检查时间：2026-05-27

当前工作目录：

```text
D:\Project\My-Study
```

已确认：

```text
Node.js: v24.13.0
npm: 11.6.2
Git: git version 2.51.0.windows.1
```

待处理：

```text
pnpm: 当前未识别为可运行命令
```

Windows PowerShell 当前对 `npm.ps1` 有执行策略限制，因此后续在 PowerShell 中优先使用：

```text
npm.cmd
```

例如：

```powershell
npm.cmd -v
```

如果后续要直接使用 `npm`、`pnpm` 这类命令，可以再单独调整 PowerShell 执行策略。

## 3. 推荐开发环境

建议准备：

- Windows 10/11 64 位
- VS Code
- Git for Windows
- Node.js LTS
- pnpm
- PowerShell 7 或 Windows PowerShell

VS Code 推荐插件：

- ESLint
- Prettier
- Error Lens
- SQLite Viewer

说明：

- 当前 Node.js 版本是 v24.13.0，高于常见 LTS 版本。通常也能用于开发，但如果后续 Electron 或原生依赖安装出现兼容问题，建议切换到 Node.js LTS。
- 当前 npm 可用，但 PowerShell 中需要使用 `npm.cmd`。
- pnpm 暂未安装，后续可通过 corepack 或 npm 安装。

## 4. 技术栈

最终选择：

```text
Electron
React
TypeScript
SQLite
```

辅助工具：

```text
electron-vite
better-sqlite3
electron-builder
```

样式策略：

- 第一版使用普通 CSS
- 不引入复杂 UI 组件库
- 先练习基础布局、组件拆分和交互

## 5. 项目目录规划

建议最终结构：

```text
D:\Project\My-Study\
  DevDesk-方案.md
  DevDesk-Electron-开发计划.md
  devdesk\
    package.json
    src\
      main\
      preload\
      renderer\
```

目录职责：

```text
src/main      Electron 主进程
src/preload   安全桥接层
src/renderer  React 前端界面
```

## 6. 架构原则

第一版采用简单清晰的三层结构。

```text
React 页面
  -> renderer service
  -> preload API
  -> Electron main process
  -> SQLite / 系统能力
```

约定：

- React 页面不直接访问 SQLite
- SQLite 只在 Electron 主进程中使用
- preload 只暴露必要 API
- 页面组件优先保持简单
- 和桌面能力相关的代码集中封装，方便未来迁移到 Tauri

## 7. MVP 页面

第一版包含 6 个页面。

### 7.1 Dashboard

首页概览。

展示：

- 最近项目
- 今日任务
- 最近学习日志
- 项目数量
- 任务数量
- 日志数量
- 已完成任务数量

### 7.2 Projects

项目管理。

字段：

- 项目名称
- 项目状态：想法中、开发中、暂停、完成
- 技术栈标签
- 当前目标
- 下一步
- 本地路径
- 仓库地址
- 创建时间
- 更新时间

操作：

- 新建
- 查看
- 编辑
- 删除

### 7.3 Logs

学习日志。

字段：

- 日期
- 关联项目
- 今天学了什么
- 遇到的问题
- 解决方案
- 明天继续做什么

操作：

- 新建
- 查看
- 编辑
- 删除

### 7.4 Tasks

任务管理。

字段：

- 标题
- 所属项目
- 状态：待做、进行中、完成
- 优先级：低、中、高
- 截止日期
- 备注

操作：

- 新建
- 编辑
- 删除
- 修改状态

第一版不做拖拽看板，状态通过按钮或下拉切换。

### 7.5 Apps

后续小应用入口。

字段：

- 应用名称
- 应用类型：内置页面、本地路径、网页链接
- 描述
- 地址或路径

操作：

- 新建
- 编辑
- 删除
- 打开入口

第一版只做登记和打开，不做插件系统。

### 7.6 Settings

设置页。

第一版保留：

- 主题入口
- 数据备份入口
- 数据导出入口

具体功能可以后续实现。

## 8. 数据模型草案

### 8.1 projects

```text
id
name
status
tech_stack
current_goal
next_step
local_path
repo_url
created_at
updated_at
```

### 8.2 logs

```text
id
date
project_id
learned
problems
solutions
next_plan
created_at
updated_at
```

### 8.3 tasks

```text
id
project_id
title
status
priority
due_date
notes
created_at
updated_at
```

### 8.4 app_entries

```text
id
name
type
description
target
created_at
updated_at
```

## 9. 阶段计划

### 阶段 0：环境准备

目标：

- 确认 Node.js、npm、Git 可用
- 安装或启用 pnpm
- 确认 VS Code 和推荐插件

验收标准：

- 能查看 Node.js 版本
- 能查看 npm 版本
- 能查看 Git 版本
- 能查看 pnpm 版本

### 阶段 1：创建基础桌面应用

目标：

- 使用 electron-vite 创建 Electron + React + TypeScript 项目
- 能启动桌面窗口
- React 页面能显示

验收标准：

- `devdesk` 目录存在
- 可以启动开发模式
- Electron 窗口正常打开

### 阶段 2：静态 UI 原型

目标：

- 创建主布局
- 创建 6 个页面
- 使用假数据展示内容

验收标准：

- 左侧导航可切换页面
- 每个页面都有基础内容
- 界面简洁清楚

### 阶段 3：前端基础交互

目标：

- 使用 React 状态实现基础增删改查
- 数据暂时只保存在内存中

验收标准：

- Projects、Logs、Tasks、Apps 可以新增、编辑、删除
- Tasks 可以切换状态
- 表单交互正常

### 阶段 4：SQLite 本地保存

目标：

- 在 Electron 主进程中接入 SQLite
- 建立数据表
- 前端通过 preload API 访问数据

验收标准：

- 关闭应用再打开，数据仍然存在
- 四类核心数据都可以增删改查

### 阶段 5：桌面能力和打包

目标：

- 打开本地项目路径
- 打开网页链接
- 打开应用入口
- 打包 Windows 应用

验收标准：

- 本地路径可以从应用中打开
- 网页链接可以从应用中打开
- 可以生成可运行的 Windows 桌面程序

## 10. 测试计划

每个阶段采用轻量测试。

环境测试：

- Node.js 可用
- npm 可用
- Git 可用
- pnpm 可用

启动测试：

- 开发模式可以启动
- Electron 窗口可以打开
- React 页面可以显示

页面测试：

- Dashboard 可访问
- Projects 可访问
- Logs 可访问
- Tasks 可访问
- Apps 可访问
- Settings 可访问

交互测试：

- 新增项目
- 编辑项目
- 删除项目
- 新增日志
- 新增任务
- 切换任务状态
- 新增应用入口

数据测试：

- 保存数据
- 关闭应用
- 重新打开
- 数据仍然存在

桌面能力测试：

- 打开本地目录
- 打开网页链接
- 打开 Apps 入口

打包测试：

- 生成 Windows 可运行程序
- 在本机启动打包后的应用

## 11. 当前默认决策

- 应用名：DevDesk
- 项目目录：`D:\Project\My-Study\devdesk`
- 优先平台：Windows
- 桌面框架：Electron
- 前端框架：React
- 开发语言：TypeScript
- 数据库：SQLite
- UI 方式：普通 CSS
- 用户模式：本地单用户
- 第一版不做登录
- 第一版不做云同步
- 第一版不做插件系统
- 第一版不做拖拽看板

## 12. 下一步

建议下一步执行：

1. 安装或启用 pnpm。
2. 创建 `devdesk` Electron 项目。
3. 启动开发模式确认桌面窗口。
4. 开始做阶段 2 的静态 UI 原型。
