import { FormEvent, useMemo, useState } from 'react'
import './App.css'
import {
  Field,
  FormActions,
  InfoRow,
  Page,
  Panel,
  ProjectSelect,
  SelectField,
  Stat,
  TextField,
} from './components/WorkspaceUi'
import { useWorkspaceData } from './useWorkspaceData'
import type {
  AppEntryType,
  DevDeskData,
  Priority,
  ProjectStatus,
  TaskStatus,
} from './types'

type PageId = 'dashboard' | 'projects' | 'logs' | 'tasks' | 'apps' | 'settings'
type WorkspaceActions = ReturnType<typeof useWorkspaceData>

const pages: Array<{ id: PageId; label: string }> = [
  { id: 'dashboard', label: '首页' },
  { id: 'projects', label: '项目' },
  { id: 'logs', label: '日志' },
  { id: 'tasks', label: '任务' },
  { id: 'apps', label: '应用' },
  { id: 'settings', label: '设置' },
]

const projectStatuses: ProjectStatus[] = ['想法中', '开发中', '暂停', '完成']
const taskStatuses: TaskStatus[] = ['待做', '进行中', '完成']
const priorities: Priority[] = ['低', '中', '高']
const appTypes: AppEntryType[] = ['网页链接', '本地路径', '内置页面']

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const workspace = useWorkspaceData()
  const { data } = workspace

  const projectNameById = useMemo(
    () => new Map(data.projects.map((project) => [project.id, project.name])),
    [data.projects],
  )

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <strong>DevDesk</strong>
            <span>个人开发学习工作台</span>
          </div>
        </div>

        <nav className="nav-list">
          {pages.map((item) => (
            <button
              className={page === item.id ? 'active' : ''}
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        {page === 'dashboard' && (
          <Dashboard data={data} projectNameById={projectNameById} />
        )}
        {page === 'projects' && <ProjectsPage workspace={workspace} />}
        {page === 'logs' && (
          <LogsPage workspace={workspace} projectNameById={projectNameById} />
        )}
        {page === 'tasks' && (
          <TasksPage workspace={workspace} projectNameById={projectNameById} />
        )}
        {page === 'apps' && <AppsPage workspace={workspace} />}
        {page === 'settings' && <SettingsPage />}
      </section>
    </main>
  )
}

function Dashboard({
  data,
  projectNameById,
}: {
  data: DevDeskData
  projectNameById: Map<string, string>
}) {
  const activeTasks = data.tasks.filter((task) => task.status !== '完成')
  const doneTasks = data.tasks.filter((task) => task.status === '完成')

  return (
    <Page title="首页" subtitle="快速查看你的项目、任务和学习记录">
      <div className="stats-grid">
        <Stat label="项目" value={data.projects.length} />
        <Stat label="任务" value={data.tasks.length} />
        <Stat label="已完成" value={doneTasks.length} />
        <Stat label="日志" value={data.logs.length} />
      </div>

      <div className="panel-grid">
        <Panel title="最近项目">
          {data.projects.slice(0, 4).map((project) => (
            <InfoRow
              key={project.id}
              title={project.name}
              meta={`${project.status} · ${project.nextStep || '暂无下一步'}`}
            />
          ))}
        </Panel>
        <Panel title="当前任务">
          {activeTasks.slice(0, 5).map((task) => (
            <InfoRow
              key={task.id}
              title={task.title}
              meta={`${task.status} · ${task.priority} · ${projectNameById.get(task.projectId) || '未关联项目'}`}
            />
          ))}
        </Panel>
        <Panel title="最近日志">
          {data.logs.slice(0, 4).map((log) => (
            <InfoRow
              key={log.id}
              title={log.date}
              meta={log.learned || '暂无内容'}
            />
          ))}
        </Panel>
      </div>
    </Page>
  )
}

function ProjectsPage({ workspace }: { workspace: WorkspaceActions }) {
  const { data } = workspace
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    status: '想法中' as ProjectStatus,
    techStack: '',
    currentGoal: '',
    nextStep: '',
    localPath: '',
    repoUrl: '',
  })

  function resetForm(): void {
    setEditingId(null)
    setForm({
      name: '',
      status: '想法中',
      techStack: '',
      currentGoal: '',
      nextStep: '',
      localPath: '',
      repoUrl: '',
    })
  }

  function submit(event: FormEvent): void {
    event.preventDefault()
    if (!form.name.trim()) return

    workspace.saveProject(form, editingId)
    resetForm()
  }

  return (
    <Page title="项目" subtitle="管理正在做、准备做、已经完成的学习项目">
      <form className="editor" onSubmit={submit}>
        <Field
          label="项目名称"
          value={form.name}
          onChange={(name) => setForm({ ...form, name })}
        />
        <SelectField
          label="状态"
          value={form.status}
          options={projectStatuses}
          onChange={(status) =>
            setForm({ ...form, status: status as ProjectStatus })
          }
        />
        <Field
          label="技术栈"
          value={form.techStack}
          onChange={(techStack) => setForm({ ...form, techStack })}
        />
        <Field
          label="本地路径"
          value={form.localPath}
          onChange={(localPath) => setForm({ ...form, localPath })}
        />
        <Field
          label="仓库地址"
          value={form.repoUrl}
          onChange={(repoUrl) => setForm({ ...form, repoUrl })}
        />
        <TextField
          label="当前目标"
          value={form.currentGoal}
          onChange={(currentGoal) => setForm({ ...form, currentGoal })}
        />
        <TextField
          label="下一步"
          value={form.nextStep}
          onChange={(nextStep) => setForm({ ...form, nextStep })}
        />
        <FormActions
          submitLabel={editingId ? '保存项目' : '新建项目'}
          onCancel={resetForm}
        />
      </form>

      <div className="card-list">
        {data.projects.map((project) => (
          <article className="item-card" key={project.id}>
            <div>
              <span className="badge">{project.status}</span>
              <h3>{project.name}</h3>
              <p>{project.currentGoal || '暂无当前目标'}</p>
              <small>{project.techStack || '未填写技术栈'}</small>
            </div>
            <div className="row-actions">
              {project.localPath && (
                <button
                  type="button"
                  onClick={() =>
                    window.devdesk.system.openTarget(project.localPath)
                  }
                >
                  打开
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingId(project.id)
                  setForm({
                    name: project.name,
                    status: project.status,
                    techStack: project.techStack,
                    currentGoal: project.currentGoal,
                    nextStep: project.nextStep,
                    localPath: project.localPath,
                    repoUrl: project.repoUrl,
                  })
                }}
              >
                编辑
              </button>
              <button
                className="danger"
                type="button"
                onClick={() => workspace.deleteProject(project.id)}
              >
                删除
              </button>
            </div>
          </article>
        ))}
      </div>
    </Page>
  )
}

function LogsPage({
  workspace,
  projectNameById,
}: {
  workspace: WorkspaceActions
  projectNameById: Map<string, string>
}) {
  const { data } = workspace
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    date: getToday(),
    projectId: '',
    learned: '',
    problems: '',
    solutions: '',
    nextPlan: '',
  })

  function resetForm(): void {
    setEditingId(null)
    setForm({
      date: getToday(),
      projectId: '',
      learned: '',
      problems: '',
      solutions: '',
      nextPlan: '',
    })
  }

  function submit(event: FormEvent): void {
    event.preventDefault()
    workspace.saveLog(form, editingId)
    resetForm()
  }

  return (
    <Page title="学习日志" subtitle="把每天学到的东西和问题沉淀下来">
      <form className="editor" onSubmit={submit}>
        <Field
          label="日期"
          type="date"
          value={form.date}
          onChange={(date) => setForm({ ...form, date })}
        />
        <ProjectSelect
          projects={data.projects}
          value={form.projectId}
          onChange={(projectId) => setForm({ ...form, projectId })}
        />
        <TextField
          label="今天学了什么"
          value={form.learned}
          onChange={(learned) => setForm({ ...form, learned })}
        />
        <TextField
          label="遇到的问题"
          value={form.problems}
          onChange={(problems) => setForm({ ...form, problems })}
        />
        <TextField
          label="解决方案"
          value={form.solutions}
          onChange={(solutions) => setForm({ ...form, solutions })}
        />
        <TextField
          label="明天继续"
          value={form.nextPlan}
          onChange={(nextPlan) => setForm({ ...form, nextPlan })}
        />
        <FormActions
          submitLabel={editingId ? '保存日志' : '新建日志'}
          onCancel={resetForm}
        />
      </form>

      <div className="card-list">
        {data.logs.map((log) => (
          <article className="item-card" key={log.id}>
            <div>
              <span className="badge">{log.date}</span>
              <h3>{projectNameById.get(log.projectId) || '未关联项目'}</h3>
              <p>{log.learned || '暂无学习内容'}</p>
              <small>{log.nextPlan || '未填写明天计划'}</small>
            </div>
            <div className="row-actions">
              <button
                type="button"
                onClick={() => {
                  setEditingId(log.id)
                  setForm({
                    date: log.date,
                    projectId: log.projectId,
                    learned: log.learned,
                    problems: log.problems,
                    solutions: log.solutions,
                    nextPlan: log.nextPlan,
                  })
                }}
              >
                编辑
              </button>
              <button
                className="danger"
                type="button"
                onClick={() => workspace.deleteLog(log.id)}
              >
                删除
              </button>
            </div>
          </article>
        ))}
      </div>
    </Page>
  )
}

function TasksPage({
  workspace,
  projectNameById,
}: {
  workspace: WorkspaceActions
  projectNameById: Map<string, string>
}) {
  const { data } = workspace
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    projectId: '',
    title: '',
    status: '待做' as TaskStatus,
    priority: '中' as Priority,
    dueDate: '',
    notes: '',
  })

  function resetForm(): void {
    setEditingId(null)
    setForm({
      projectId: '',
      title: '',
      status: '待做',
      priority: '中',
      dueDate: '',
      notes: '',
    })
  }

  function submit(event: FormEvent): void {
    event.preventDefault()
    if (!form.title.trim()) return
    workspace.saveTask(form, editingId)
    resetForm()
  }

  return (
    <Page title="任务" subtitle="拆解下一步要做的具体动作">
      <form className="editor" onSubmit={submit}>
        <Field
          label="任务标题"
          value={form.title}
          onChange={(title) => setForm({ ...form, title })}
        />
        <ProjectSelect
          projects={data.projects}
          value={form.projectId}
          onChange={(projectId) => setForm({ ...form, projectId })}
        />
        <SelectField
          label="状态"
          value={form.status}
          options={taskStatuses}
          onChange={(status) =>
            setForm({ ...form, status: status as TaskStatus })
          }
        />
        <SelectField
          label="优先级"
          value={form.priority}
          options={priorities}
          onChange={(priority) =>
            setForm({ ...form, priority: priority as Priority })
          }
        />
        <Field
          label="截止日期"
          type="date"
          value={form.dueDate}
          onChange={(dueDate) => setForm({ ...form, dueDate })}
        />
        <TextField
          label="备注"
          value={form.notes}
          onChange={(notes) => setForm({ ...form, notes })}
        />
        <FormActions
          submitLabel={editingId ? '保存任务' : '新建任务'}
          onCancel={resetForm}
        />
      </form>

      <div className="task-columns">
        {taskStatuses.map((status) => (
          <section className="task-column" key={status}>
            <h2>{status}</h2>
            {data.tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <article className="task-card" key={task.id}>
                  <span className="badge">{task.priority}</span>
                  <h3>{task.title}</h3>
                  <p>{projectNameById.get(task.projectId) || '未关联项目'}</p>
                  <small>{task.dueDate || '无截止日期'}</small>
                  <div className="row-actions">
                    {taskStatuses.map((nextStatus) => (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() =>
                          workspace.updateTaskStatus(task.id, nextStatus)
                        }
                      >
                        {nextStatus}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(task.id)
                        setForm({
                          projectId: task.projectId,
                          title: task.title,
                          status: task.status,
                          priority: task.priority,
                          dueDate: task.dueDate,
                          notes: task.notes,
                        })
                      }}
                    >
                      编辑
                    </button>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => workspace.deleteTask(task.id)}
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
          </section>
        ))}
      </div>
    </Page>
  )
}

function AppsPage({ workspace }: { workspace: WorkspaceActions }) {
  const { data } = workspace
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    type: '网页链接' as AppEntryType,
    description: '',
    target: '',
  })

  function resetForm(): void {
    setEditingId(null)
    setForm({ name: '', type: '网页链接', description: '', target: '' })
  }

  function submit(event: FormEvent): void {
    event.preventDefault()
    if (!form.name.trim()) return
    workspace.saveApp(form, editingId)
    resetForm()
  }

  return (
    <Page title="应用入口" subtitle="登记后续制作的小工具、网页和本地项目">
      <form className="editor" onSubmit={submit}>
        <Field
          label="应用名称"
          value={form.name}
          onChange={(name) => setForm({ ...form, name })}
        />
        <SelectField
          label="类型"
          value={form.type}
          options={appTypes}
          onChange={(type) => setForm({ ...form, type: type as AppEntryType })}
        />
        <Field
          label="地址或路径"
          value={form.target}
          onChange={(target) => setForm({ ...form, target })}
        />
        <TextField
          label="描述"
          value={form.description}
          onChange={(description) => setForm({ ...form, description })}
        />
        <FormActions
          submitLabel={editingId ? '保存入口' : '新建入口'}
          onCancel={resetForm}
        />
      </form>

      <div className="card-list">
        {data.apps.map((entry) => (
          <article className="item-card" key={entry.id}>
            <div>
              <span className="badge">{entry.type}</span>
              <h3>{entry.name}</h3>
              <p>{entry.description || '暂无描述'}</p>
              <small>{entry.target || '暂无地址或路径'}</small>
            </div>
            <div className="row-actions">
              {entry.target && (
                <button
                  type="button"
                  onClick={() => window.devdesk.system.openTarget(entry.target)}
                >
                  打开
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingId(entry.id)
                  setForm({
                    name: entry.name,
                    type: entry.type,
                    description: entry.description,
                    target: entry.target,
                  })
                }}
              >
                编辑
              </button>
              <button
                className="danger"
                type="button"
                onClick={() => workspace.deleteApp(entry.id)}
              >
                删除
              </button>
            </div>
          </article>
        ))}
      </div>
    </Page>
  )
}

function SettingsPage() {
  return (
    <Page title="设置" subtitle="第一版先保留简单设置入口">
      <div className="panel-grid">
        <Panel title="数据存储">
          当前数据暂存在浏览器本地存储，后续可迁移到 SQLite。
        </Panel>
        <Panel title="主题">当前使用浅色工作台风格，深色模式后续再加。</Panel>
        <Panel title="备份">导入、导出和备份功能留到数据模型稳定后实现。</Panel>
      </div>
    </Page>
  )
}

export default App
