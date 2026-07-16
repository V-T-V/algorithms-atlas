// 责任链模式 · 实现
export interface ChainHooks {
  onTry?: (handlerName: string, level: number, handled: boolean) => void;
  onEscalate?: (from: string, to: string) => void;
  onResult?: (finalHandler: string | null) => void;
}

export abstract class SupportHandler {
  protected next: SupportHandler | null = null;
  protected readonly hooks: ChainHooks;
  constructor(
    public readonly name: string,
    public readonly maxLevel: number,
    hooks: ChainHooks = {},
  ) {
    this.hooks = hooks;
  }
  setNext(h: SupportHandler): SupportHandler {
    this.next = h;
    return h;
  }
  handle(level: number): string | null {
    if (level <= this.maxLevel) {
      this.hooks.onTry?.(this.name, level, true);
      return this.name;
    }
    this.hooks.onTry?.(this.name, level, false);
    if (this.next) {
      this.hooks.onEscalate?.(this.name, this.next.name);
      return this.next.handle(level);
    }
    this.hooks.onResult?.(null);
    return null;
  }
}

export class L1Handler extends SupportHandler {
  constructor(hooks: ChainHooks = {}) {
    super('L1', 1, hooks);
  }
}
export class L2Handler extends SupportHandler {
  constructor(hooks: ChainHooks = {}) {
    super('L2', 3, hooks);
  }
}
export class L3Handler extends SupportHandler {
  constructor(hooks: ChainHooks = {}) {
    super('L3', 5, hooks);
  }
}

export function buildChain(hooks: ChainHooks = {}): L1Handler {
  const l1 = new L1Handler(hooks);
  const l2 = new L2Handler(hooks);
  const l3 = new L3Handler(hooks);
  l1.setNext(l2);
  l2.setNext(l3);
  return l1;
}
