// =============================================================================
// 后缀自动机（SAM）
// =============================================================================

interface State {
  next: Map<string, number>;
  link: number;
  len: number;
}

export interface SamHooks {
  onClone?: (from: number, to: number) => void;
  onNewState?: (id: number) => void;
  onLink?: (state: number, link: number) => void;
  onDone?: (size: number) => void;
}

export class SuffixAutomaton3 {
  public states: State[] = [];
  public last = 0;
  constructor(
    s: string = '',
    private hooks: SamHooks = {},
  ) {
    this.states.push({ next: new Map(), link: -1, len: 0 });
    for (const ch of s) this.extend(ch);
  }
  extend(c: string): number {
    const cur = this.states.length;
    this.states.push({ next: new Map(), link: -1, len: this.states[this.last]!.len + 1 });
    this.hooks.onNewState?.(cur);
    let p = this.last;
    while (p !== -1 && !this.states[p]!.next.has(c)) {
      this.states[p]!.next.set(c, cur);
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
          next: new Map(this.states[q]!.next),
          link: this.states[q]!.link,
          len: this.states[p]!.len + 1,
        });
        this.hooks.onClone?.(q, clone);
        while (p !== -1 && this.states[p]!.next.get(c) === q) {
          this.states[p]!.next.set(c, clone);
          p = this.states[p]!.link;
        }
        this.states[q]!.link = clone;
        this.states[cur]!.link = clone;
      }
    }
    this.hooks.onLink?.(cur, this.states[cur]!.link);
    this.last = cur;
    return cur;
  }
  /** 判断子串 s 是否被 SAM 接受（即 s 是否为某后缀的前缀）。 */
  contains(sub: string): boolean {
    let cur = 0;
    for (const ch of sub) {
      const nx = this.states[cur]!.next.get(ch);
      if (nx === undefined) return false;
      cur = nx;
    }
    return true;
  }
  get size(): number {
    return this.states.length;
  }
}
