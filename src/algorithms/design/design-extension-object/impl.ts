export interface Ext {
  id: string;
}
export class Subject {
  private exts = new Map<string, Ext>();
  setExtension(id: string, e: Ext): void {
    this.exts.set(id, e);
  }
  getExtension(id: string): Ext | undefined {
    return this.exts.get(id);
  }
}
export interface EoHooks {
  onQuery?: (id: string, found: boolean) => void;
}
export function queryExt(s: Subject, id: string, hooks: EoHooks = {}): Ext | undefined {
  const e = s.getExtension(id);
  hooks.onQuery?.(id, !!e);
  return e;
}
