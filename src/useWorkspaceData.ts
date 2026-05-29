import { useEffect, useState } from "react";
import { createId, loadData, saveData } from "./storage";
import type {
  AppEntry,
  AppEntryType,
  DevDeskData,
  LearningLog,
  Priority,
  Project,
  ProjectStatus,
  Task,
  TaskStatus,
} from "./types";

export type ProjectForm = {
  name: string;
  status: ProjectStatus;
  techStack: string;
  currentGoal: string;
  nextStep: string;
  localPath: string;
  repoUrl: string;
};

export type LogForm = {
  date: string;
  projectId: string;
  learned: string;
  problems: string;
  solutions: string;
  nextPlan: string;
};

export type TaskForm = {
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  notes: string;
};

export type AppForm = {
  name: string;
  type: AppEntryType;
  description: string;
  target: string;
};

export function useWorkspaceData() {
  const [data, setData] = useState<DevDeskData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  return {
    data,
    saveProject(projectForm: ProjectForm, editingId?: string | null) {
      const project: Project = {
        id: editingId ?? createId("project"),
        ...projectForm,
        updatedAt: new Date().toISOString(),
      };

      setData((currentData) => ({
        ...currentData,
        projects: editingId
          ? currentData.projects.map((item) =>
              item.id === editingId ? project : item,
            )
          : [project, ...currentData.projects],
      }));
    },
    deleteProject(projectId: string) {
      setData((currentData) => ({
        ...currentData,
        projects: currentData.projects.filter(
          (project) => project.id !== projectId,
        ),
        logs: currentData.logs.map((log) =>
          log.projectId === projectId ? { ...log, projectId: "" } : log,
        ),
        tasks: currentData.tasks.map((task) =>
          task.projectId === projectId ? { ...task, projectId: "" } : task,
        ),
      }));
    },
    saveLog(logForm: LogForm, editingId?: string | null) {
      const log: LearningLog = {
        id: editingId ?? createId("log"),
        ...logForm,
      };

      setData((currentData) => ({
        ...currentData,
        logs: editingId
          ? currentData.logs.map((item) => (item.id === editingId ? log : item))
          : [log, ...currentData.logs],
      }));
    },
    deleteLog(logId: string) {
      setData((currentData) => ({
        ...currentData,
        logs: currentData.logs.filter((log) => log.id !== logId),
      }));
    },
    saveTask(taskForm: TaskForm, editingId?: string | null) {
      const task: Task = {
        id: editingId ?? createId("task"),
        ...taskForm,
      };

      setData((currentData) => ({
        ...currentData,
        tasks: editingId
          ? currentData.tasks.map((item) => (item.id === editingId ? task : item))
          : [task, ...currentData.tasks],
      }));
    },
    updateTaskStatus(taskId: string, status: TaskStatus) {
      setData((currentData) => ({
        ...currentData,
        tasks: currentData.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        ),
      }));
    },
    deleteTask(taskId: string) {
      setData((currentData) => ({
        ...currentData,
        tasks: currentData.tasks.filter((task) => task.id !== taskId),
      }));
    },
    addApp(appForm: AppForm) {
      const app: AppEntry = {
        id: createId("app"),
        ...appForm,
      };

      setData((currentData) => ({
        ...currentData,
        apps: [app, ...currentData.apps],
      }));
    },
    deleteApp(appId: string) {
      setData((currentData) => ({
        ...currentData,
        apps: currentData.apps.filter((app) => app.id !== appId),
      }));
    },
  };
}
