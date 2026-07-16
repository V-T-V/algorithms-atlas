export interface MsHooks {
  onSet?: (instanceId: number, value: number) => void;
}
export class Monostate {
  private static shared = 0;
  private id: number;
  constructor(id: number) {
    this.id = id;
  }
  set(v: number, hooks: MsHooks = {}): void {
    Monostate.shared = v;
    hooks.onSet?.(this.id, v);
  }
  get(): number {
    return Monostate.shared;
  }
}
