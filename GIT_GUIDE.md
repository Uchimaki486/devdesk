# DevDesk Git 使用规范

## 1. 基本原则

- `main` 保持稳定。
- 每个功能使用独立分支。
- 每完成一个明确功能点提交一次。
- 提交前查看 diff，避免混入无关修改。
- 优先通过 GitHub Pull Request 合并功能分支。

## 2. 提交信息

格式：

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
git commit -m "refactor: extract workspace data actions"
git commit -m "docs: update project overview"
```

## 3. 分支命名

建议格式：

```text
feat/log-editing
fix/window-startup
refactor/storage-layer
docs/project-overview
```

## 4. 推荐流程：GitHub PR 合并

开始功能：

```powershell
git checkout main
git pull --ff-only origin main
git checkout -b feat/small-feature
```

开发后提交：

```powershell
git status
git diff
git add .
git commit -m "feat: add small feature"
```

推送分支：

```powershell
git push -u origin feat/small-feature
```

GitHub 上操作：

1. 创建 Pull Request
2. 确认 `base: main`，`compare: feat/small-feature`
3. 查看 `Files changed`
4. Merge Pull Request
5. 删除远程功能分支

合并后同步本地：

```powershell
git checkout main
git pull --ff-only origin main
git branch -d feat/small-feature
```

## 5. 本地合并

小改动也可以本地合并：

```powershell
git checkout main
git pull --ff-only origin main
git merge --no-ff feat/small-feature
git push origin main
git branch -d feat/small-feature
```

说明：

- `--no-ff` 会保留一次明确的 merge commit。
- 如果想保持线性历史，可以使用 `git merge feat/small-feature`。

## 6. `git pull --ff-only origin main`

含义：

> 从远程 `origin/main` 拉取更新，但只允许快进，不允许自动生成 merge commit。

适合用于同步 `main`：

```powershell
git checkout main
git pull --ff-only origin main
```

如果失败，说明本地和远程历史分叉了。此时不要反复 `git pull`，先检查：

```powershell
git status --short --branch
git log --oneline --graph --decorate --all -n 20
```

## 7. 不提交的文件

不提交构建产物和依赖目录：

- `node_modules/`
- `dist/`
- `dist-electron/`
- `release/`
- 日志文件
- 本机缓存
- 私人密钥或 token

应该提交：

- 源码
- 配置文件
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- 必要文档

## 8. 常用检查

提交前建议：

```powershell
git status
git diff
pnpm.cmd lint
.\node_modules\.bin\tsc.CMD --noEmit
```

查看分支和历史：

```powershell
git branch -vv
git log --oneline --graph --decorate --all -n 20
```
