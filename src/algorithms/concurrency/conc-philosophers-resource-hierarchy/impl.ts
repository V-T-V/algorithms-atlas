// 资源层级哲学家 · 实现

export interface RhEvent {
  philosopher: number;
  action: 'dine' | 'finish';
}

export interface RhStep {
  philosopher: number;
  action: string;
  /** forkOwner[f] = 持有叉 f 的哲学家，-1 表示空闲。 */
  forkOwner: number[];
  eating: number[];
  order: Array<{ p: number; first: number; second: number }>;
}

export interface RhHooks {
  onAcquire?: (p: number, fork: number) => void;
  onEat?: (p: number) => void;
  onRelease?: (p: number, fork: number) => void;
}

export function simulateResourceHierarchy(
  n: number,
  events: RhEvent[],
  hooks: RhHooks = {},
): RhStep[] {
  const forkOwner = new Array(n).fill(-1);
  const eating: number[] = [];
  const steps: RhStep[] = [];

  // 每个哲学家的取叉顺序：先小后大
  const order = Array.from({ length: n }, (_, i) => {
    const f1 = i;
    const f2 = (i + 1) % n;
    return { p: i, first: Math.min(f1, f2), second: Math.max(f1, f2) };
  });

  for (const ev of events) {
    if (ev.action === 'dine') {
      const o = order[ev.philosopher]!;
      // 先取 first
      if (forkOwner[o.first] === -1) {
        forkOwner[o.first] = ev.philosopher;
        hooks.onAcquire?.(ev.philosopher, o.first);
      }
      // 再取 second
      if (forkOwner[o.second] === -1) {
        forkOwner[o.second] = ev.philosopher;
        hooks.onAcquire?.(ev.philosopher, o.second);
      }
      if (forkOwner[o.first] === ev.philosopher && forkOwner[o.second] === ev.philosopher) {
        eating.push(ev.philosopher);
        hooks.onEat?.(ev.philosopher);
      }
    } else {
      const o = order[ev.philosopher]!;
      if (forkOwner[o.first] === ev.philosopher) {
        forkOwner[o.first] = -1;
        hooks.onRelease?.(ev.philosopher, o.first);
      }
      if (forkOwner[o.second] === ev.philosopher) {
        forkOwner[o.second] = -1;
        hooks.onRelease?.(ev.philosopher, o.second);
      }
      const idx = eating.indexOf(ev.philosopher);
      if (idx >= 0) eating.splice(idx, 1);
    }
    steps.push({
      philosopher: ev.philosopher,
      action: ev.action,
      forkOwner: [...forkOwner],
      eating: [...eating],
      order: [...order],
    });
  }
  return steps;
}
