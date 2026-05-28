import type { DevDeskData } from './types'

const STORAGE_KEY = 'devdesk-data-v1'
const today = new Date().toISOString().slice(0, 10)

export const initialData: DevDeskData = {
  projects: [
    {
      id: 'project-1',
      name: 'DevDesk MVP',
      status: '开发中',
      techStack: 'Electron, React, TypeScript',
      currentGoal: '完成个人开发学习工作台的第一版界面和基础交互',
      nextStep: '跑通项目、日志、任务和应用入口流程',
      localPath: '',
      repoUrl: '',
      updatedAt: new Date().toISOString(),
    },
  ],
  logs: [
    {
      id: 'log-1',
      date: today,
      projectId: 'project-1',
      learned: '确认 Electron 作为第一阶段桌面端技术栈',
      problems: '前端和桌面端基础需要边做边补',
      solutions: '先做简洁 MVP，再逐步接入本地数据库和桌面能力',
      nextPlan: '替换默认模板，完成 DevDesk 工作台界面',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      projectId: 'project-1',
      title: '完成 DevDesk MVP 界面',
      status: '进行中',
      priority: '高',
      dueDate: '',
      notes: '第一阶段先用 localStorage 保存数据',
    },
  ],
  apps: [
    {
      id: 'app-1',
      name: 'DevDesk',
      type: '内置页面',
      description: '当前个人开发学习工作台',
      target: '',
    },
  ],
}

export function loadData(): DevDeskData {
  const rawData = localStorage.getItem(STORAGE_KEY)
  if (!rawData) return initialData

  try {
    return JSON.parse(rawData) as DevDeskData
  } catch {
    return initialData
  }
}

export function saveData(data: DevDeskData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
