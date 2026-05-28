# DevDesk Git 管理规范

## 1. 基本原则

- 每完成一个清晰阶段就提交一次。
- 不把多个无关修改混在同一次提交里。
- 提交前先确认应用能正常启动或至少通过基础检查。
- 不提交系统环境、缓存、构建产物和本机私有配置。

## 2. 推荐提交时机

适合提交：

- 初始化脚手架完成
- 新增一个页面或一个完整功能
- 修复一个明确问题
- 调整项目配置
- 更新文档

不建议提交：

- 功能写到一半且无法运行
- 临时调试代码
- 大量无关格式化改动混在功能改动中

## 3. 提交前检查

提交前建议执行：

```powershell
git status
pnpm.cmd lint
```

如果只是文档修改，可以不跑 lint。

如果改了 TypeScript 逻辑，建议再执行：

```powershell
.\node_modules\.bin\tsc.CMD --noEmit
```

## 4. 提交信息格式

使用简洁英文提交信息：

```text
type: short description
```

常用 type：

- `chore`：脚手架、依赖、配置、杂项
- `feat`：新功能
- `fix`：修复问题
- `docs`：文档
- `style`：样式调整
- `refactor`：重构
- `test`：测试

示例：

```powershell
git commit -m "chore: scaffold electron react app"
git commit -m "feat: add devdesk mvp workspace"
git commit -m "fix: keep task status after reload"
git commit -m "docs: add git guide"
```

## 5. 分支建议

个人学习阶段可以先只用：

```text
main
```

后续功能变复杂后，再使用功能分支：

```powershell
git checkout -b feat/sqlite-storage
git checkout -b feat/app-launcher
git checkout -b fix/window-startup
```

功能完成后合回 `main`。

## 6. 应该提交的文件

应该提交：

- `src/`
- `electron/`
- `public/`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `tsconfig*.json`
- `vite.config.ts`
- `.gitignore`
- `.gitattributes`
- `.editorconfig`
- 项目文档

不应该提交：

- `node_modules/`
- `dist/`
- `dist-electron/`
- `release/`
- 日志文件
- 本机缓存
- 私人密钥或 token

## 7. 换行符规范

项目统一使用 LF。

建议项目根目录保留 `.gitattributes`：

```text
* text=auto eol=lf
```

建议 VS Code 使用：

```json
{
  "files.eol": "\n"
}
```

Windows Git 建议：

```powershell
git config --global core.autocrlf input
```

## 8. 常用命令

查看状态：

```powershell
git status
```

查看修改：

```powershell
git diff
```

暂存全部修改：

```powershell
git add .
```

提交：

```powershell
git commit -m "feat: add something"
```

推送：

```powershell
git push
```

查看提交历史：

```powershell
git log --oneline --graph --decorate
```

## 9. 当前阶段建议

当前 DevDesk 处于学习项目早期，推荐节奏：

1. `chore: scaffold electron react app`
2. `feat: add devdesk mvp workspace`
3. `feat: persist workspace data`
4. `feat: add sqlite storage`
5. `feat: package windows app`
