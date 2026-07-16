// CLH 队列锁 · 实现
export interface ClhNode {
  locked: boolean;
  owner: number;
}
export interface ClhEvent {
  thread: number;
  action: 'lock' | 'unlock';
}
export interface ClhHooks {
  onEnqueue?: (t: number, pred: number) => void;
  onSpinPred?: (t: number, pred: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface ClhStep {
  thread: number;
  queue: ClhNode[];
  holder: number;
}
export function simulateClh(events: ClhEvent[], hooks: ClhHooks = {}): ClhStep[] {
  // 初始哨兵节点（unlocked）
  let tail: ClhNode = { locked: false, owner: -1 };
  let holder = -1;
  const myNode = new Map<number, ClhNode>();
  const predMap = new Map<number, ClhNode>();
  const steps: ClhStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      const node: ClhNode = { locked: true, owner: ev.thread };
      myNode.set(ev.thread, node);
      const pred = tail;
      predMap.set(ev.thread, pred);
      tail = node;
      hooks.onEnqueue?.(ev.thread, pred.owner);
      if (pred.locked) hooks.onSpinPred?.(ev.thread, pred.owner);
      // 模拟：等到前驱释放
      pred.locked = false;
      holder = ev.thread;
      hooks.onAcquire?.(ev.thread);
    } else if (holder === ev.thread) {
      const node = myNode.get(ev.thread)!;
      node.locked = false;
      holder = -1;
      hooks.onRelease?.(ev.thread);
    }
    const queue: ClhNode[] = [];
    let cur: ClhNode | undefined = tail;
    const seen = new Set<ClhNode>();
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      queue.unshift(cur);
      cur = predMap.get(cur.owner);
    }
    steps.push({ thread: ev.thread, queue, holder });
  }
  return steps;
}
