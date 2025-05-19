declare namespace chrome {
  export interface Tab {
    id?: number;
    url?: string;
    active?: boolean;
    windowId?: number;
  }

  export interface CreateProperties {
    url?: string;
    active?: boolean;
    windowId?: number;
  }

  export type TabCallback = (tab: Tab) => void;

  export interface TabsAPI {
    create: (properties: CreateProperties, callback?: TabCallback) => void;
    remove: (tabId: number, callback?: () => void) => void;
    query: (queryInfo: object, callback: (tabs: Tab[]) => void) => void;
  }

  export interface ChromeAPI {
    tabs: TabsAPI;
  }

  export const tabs: TabsAPI;
}

declare const chrome: chrome.ChromeAPI;