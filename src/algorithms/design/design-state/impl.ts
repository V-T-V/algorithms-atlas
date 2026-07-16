// 状态模式 · 实现
export interface StateHooks {
  onTransition?: (from: string, to: string, event: string) => void;
  onAction?: (state: string, event: string, result: string) => void;
}

export interface VendingState {
  name: string;
  insertCoin(ctx: VendingContext): string;
  dispense(ctx: VendingContext): string;
  refund(ctx: VendingContext): string;
}

export class VendingContext {
  public state: VendingState;
  public coins = 0;
  private readonly hooks: StateHooks;
  constructor(initial: VendingState, hooks: StateHooks = {}) {
    this.state = initial;
    this.hooks = hooks;
  }
  setState(s: VendingState, event: string): void {
    const from = this.state.name;
    this.state = s;
    this.hooks.onTransition?.(from, s.name, event);
  }
  insertCoin(): string {
    const r = this.state.insertCoin(this);
    this.hooks.onAction?.(this.state.name, 'insertCoin', r);
    return r;
  }
  dispense(): string {
    const r = this.state.dispense(this);
    this.hooks.onAction?.(this.state.name, 'dispense', r);
    return r;
  }
  refund(): string {
    const r = this.state.refund(this);
    this.hooks.onAction?.(this.state.name, 'refund', r);
    return r;
  }
}

export class IdleState implements VendingState {
  name = 'idle';
  insertCoin(ctx: VendingContext): string {
    ctx.coins += 1;
    ctx.setState(new HasCoinState(), 'insertCoin');
    return '投币成功';
  }
  dispense(): string {
    return '请先投币';
  }
  refund(): string {
    return '无可退';
  }
}

export class HasCoinState implements VendingState {
  name = 'hasCoin';
  insertCoin(ctx: VendingContext): string {
    ctx.coins += 1;
    return '再投一枚';
  }
  dispense(ctx: VendingContext): string {
    if (ctx.coins >= 1) {
      ctx.coins -= 1;
      ctx.setState(new IdleState(), 'dispense');
      return '出货成功';
    }
    return '投币不足';
  }
  refund(ctx: VendingContext): string {
    const n = ctx.coins;
    ctx.coins = 0;
    ctx.setState(new IdleState(), 'refund');
    return `退币 ${n}`;
  }
}
