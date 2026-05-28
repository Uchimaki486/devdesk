# DevDesk 协作规则

## 分工

用户负责全局环境：
- 安装 Node.js、pnpm、Git、VS Code、SQLite 等系统工具
- 配置 PATH、PowerShell 执行策略、环境变量和系统权限
- 执行需要全局安装或系统安装的命令

Codex 负责项目内工作：
- 编写和修改项目源码、配置和文档
- 创建或调整项目骨架
- 添加、移除或配置项目内依赖
- 说明需要用户执行的全局环境命令

## 技术方向

- 桌面端：Electron
- 前端：React + TypeScript
- 包管理：pnpm
- 样式：普通 CSS
- 数据存储：先完成界面和交互，再接入 SQLite

## 命令边界

Codex 不执行：
- 全局安装命令，例如 `npm install -g`
- 修改 PATH、PowerShell 策略、系统环境变量
- 安装系统软件或系统依赖

Codex 可以执行：
- 项目内脚手架命令
- 项目内依赖安装，例如 `pnpm install`、`pnpm add`
- 项目内检查和构建命令，例如 `pnpm lint`、`pnpm build`
- 读取、搜索、创建和修改项目文件

如果命令可能影响全局环境，Codex 只给出命令和说明，由用户执行。
