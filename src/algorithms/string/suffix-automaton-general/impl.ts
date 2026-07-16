// =============================================================================
// 广义后缀自动机（多串）· 纯算法实现
// 多串共享 SAM：判定子串是否出现在任一原串中。
// =============================================================================

export interface GSAMState {
  id: number;
  len: number;
  link: number;
  next: Map<string, number>;
}

/** 事件钩子。 */
export interface GSAMHooks {
  /** 创建新状态。 */
  onCreate?: (id: number, len: number, link: number) => void;
  /** 设置转移 from --c--> to。 */
  onTransition?: (from: number, c: string, to: number) => void;
  /** 设置后缀链接。 */
  onLink?: (id: number, link: number) => void;
  /** 完成。给出状态数。 */
  onDone?: (count: number) => void;
}

export class GeneralSAM {
  states: GSAMState[] = [];
  private last = 0;

  constructor(hooks: GSAMHooks = {}) {
    this.states.push({ id: 0, len: 0, link: -1, next: new Map() });
    hooks.onCreate?.(0, 0, -1);
    this.hooks = hooks;
  }

  private hooks: GSAMHooks;

  private extend(c: string, last: number): number {
    const cur = this.states.length;
    this.states.push({ id: cur, len: this.states[last]!.len + 1, link: 0, next: new Map() });
    this.hooks.onCreate?.(cur, this.states[last]!.len + 1, 0);
    let p = last;
    while (p !== -1 && !this.states[p]!.next.has(c)) {
      this.states[p]!.next.set(c, cur);
      this.hooks.onTransition?.(p, c, cur);
      p = this.states[p]!.link;
    }
    if (p === -1) {
      this.states[cur]!.link = 0;
    } else {
      const q = this.states[p]!.next.get(c)!;
      if (this.states[p]!.len + 1 === this.states[q]!.len) {
        this.states[cur]!.link = q;
      } else {
        const clone = this.states.length;
        this.states.push({
          id: clone,
          len: this.states[p]!.len + 1,
          link: this.states[q]!.link,
          next: new Map(this.states[q]!.next),
        });
        this.hooks.onCreate?.(clone, this.states[p]!.len + 1, this.states[q]!.link);
        while (p !== -1 && this.states[p]!.next.get(c) === q) {
          this.states[p]!.next.set(c, clone);
          this.hooks.onTransition?.(p, c, clone);
          p = this.states[p]!.link;
        }
        this.states[q]!.link = clone;
        this.states[cur]!.link = clone;
        this.hooks.onLink?.(q, clone);
        this.hooks.onLink?.(cur, clone);
      }
    }
    this.hooks.onLink?.(cur, this.states[cur]!.link);
    return cur;
  }

  /** 添加一个串。 */
  addString(s: string): void {
    this.last = 0;
    for (const ch of s) {
      // 若转移已存在且长度恰好，则直接复用（广义 SAM 关键）
      const existing = this.states[this.last]!.next.get(ch);
      if (
        existing !== undefined &&
        this.states[existing]!.len === this.states[this.last]!.len + 1
      ) {
        this.last = existing;
      } else {
        this.last = this.extend(ch, this.last);
      }
    }
  }

  /** 判定子串 t 是否出现在某个已添加的串中。 */
  contains(t: string): boolean {
    let cur = 0;
    for (const ch of t) {
      const nxt = this.states[cur]!.next.get(ch);
      if (nxt === undefined) return false;
      cur = nxt;
    }
    return true;
  }
}

/** 便捷：构建并返回 GSAM。 */
export function buildGeneralSAM(strings: string[], hooks: GSAMHooks = {}): GeneralSAM {
  const sam = new GeneralSAM(hooks);
  for (const s of strings) sam.addString(s);
  hooks.onDone?.(sam.states.length);
  return sam;
}
