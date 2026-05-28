export type ProjectStatus = '想法中' | '开发中' | '暂停' | '完成'
export type TaskStatus = '待做' | '进行中' | '完成'
export type Priority = '低' | '中' | '高'
export type AppEntryType = '网页链接' | '本地路径' | '内置页面'

export type Project = {
  id: string
  name: string
  status: ProjectStatus
  techStack: string
  currentGoal: string
  nextStep: string
  localPath: string
  repoUrl: string
  updatedAt: string
}

export type LearningLog = {
  id: string
  date: string
  projectId: string
  learned: string
  problems: string
  solutions: string
  nextPlan: string
}

export type Task = {
  id: string
  projectId: string
  title: string
  status: TaskStatus
  priority: Priority
  dueDate: string
  notes: string
}

export type AppEntry = {
  id: string
  name: string
  type: AppEntryType
  description: string
  target: string
}

export type DevDeskData = {
  projects: Project[]
  logs: LearningLog[]
  tasks: Task[]
  apps: AppEntry[]
}
