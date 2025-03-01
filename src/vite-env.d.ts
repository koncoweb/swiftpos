/// <reference types="vite/client" />

// Add Tauri API type declarations
declare module '@tauri-apps/api/tauri' {
  export function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
}

declare module '@tauri-apps/api/window' {
  export class Window {
    static getCurrent(): Window;
    label: string;
    title: string;
    setTitle(title: string): Promise<void>;
    maximize(): Promise<void>;
    unmaximize(): Promise<void>;
    minimize(): Promise<void>;
    unminimize(): Promise<void>;
    close(): Promise<void>;
    hide(): Promise<void>;
    show(): Promise<void>;
    setFocus(): Promise<void>;
    isFocused(): Promise<boolean>;
    isMaximized(): Promise<boolean>;
    isMinimized(): Promise<boolean>;
    isVisible(): Promise<boolean>;
    center(): Promise<void>;
    requestUserAttention(): Promise<void>;
    setDecorations(decorations: boolean): Promise<void>;
    setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>;
    setSize(size: { width: number; height: number }): Promise<void>;
    setMinSize(size: { width: number; height: number }): Promise<void>;
    setMaxSize(size: { width: number; height: number }): Promise<void>;
    setPosition(position: { x: number; y: number }): Promise<void>;
    setFullscreen(fullscreen: boolean): Promise<void>;
    setIcon(icon: string): Promise<void>;
    setSkipTaskbar(skip: boolean): Promise<void>;
    startDragging(): Promise<void>;
  }
}