export interface FiHooks {
  onOp?: (op: string, val: number) => void;
}
export class Counter {
  private n = 0;
  add(x: number, hooks: FiHooks = {}): this {
    this.n += x;
    hooks.onOp?.('add', x);
    return this;
  }
  sub(x: number, hooks: FiHooks = {}): this {
    this.n -= x;
    hooks.onOp?.('sub', x);
    return this;
  }
  mul(x: number, hooks: FiHooks = {}): this {
    this.n *= x;
    hooks.onOp?.('mul', x);
    return this;
  }
  value(): number {
    return this.n;
  }
}
