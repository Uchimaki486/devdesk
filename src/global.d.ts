export {}

declare global {
  interface Window {
    devdesk: {
      system: {
        openTarget: (target: string) => Promise<boolean>
      }
    }
  }
}
