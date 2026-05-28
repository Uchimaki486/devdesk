import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('devdesk', {
  system: {
    openTarget: (target: string): Promise<boolean> => ipcRenderer.invoke('system:open-target', target),
  },
})
