/// <reference types="chrome"/>

declare namespace NodeJS {
  interface Timeout {
    _idleTimeout: number;
    _idlePrev: unknown;
    _idleNext: unknown;
    _idleStart: number;
    _onTimeout: () => void;
    _timerArgs: unknown[];
    _repeat: number | null;
  }
}

interface Window {
  chrome: typeof chrome;
}

declare namespace chrome {
  export interface Tab {
    id?: number;
    url?: string;
    active?: boolean;
    windowId?: number;
  }

  export const tabs: {
    create: (createProperties: {
      url?: string;
      active?: boolean;
      windowId?: number;
    }, callback?: (tab: Tab) => void) => void;
    
    remove: (tabId: number, callback?: () => void) => void;
    
    query: (queryInfo: {
      active?: boolean;
      currentWindow?: boolean;
    }, callback: (tabs: Tab[]) => void) => void;
  };
}

declare const chrome: typeof chrome;