// 协同调度 · 实现

export interface CoTask {
  id: string;
  group: string;
  burst: number;
}

export interface CoWindow {
  time: number;
  groupId: string;
  members: string[];
}

export interface CoHooks {
  onWindow?: (groupId: string, time: number, members: string[]) => void;
}

/**
 * 协同调度：按时间窗轮转各进程组，每组在窗内被整体调度的语义近似为
 * 把组内所有进程依次连续运行（部分抢占的宽松版成组调度）。
 */
export function scheduleCoScheduling(
  tasks: CoTask[],
  window: number,
  hooks: CoHooks = {},
): CoWindow[] {
  const groups = new Map<string, CoTask[]>();
  for (const t of tasks) {
    if (!groups.has(t.group)) groups.set(t.group, []);
    groups.get(t.group)!.push(t);
  }
  const groupOrder = [...groups.keys()].sort();
  const windows: CoWindow[] = [];
  let time = 0;
  // 每窗分配给一个组；按窗顺序循环直到所有 burst 耗尽
  const remaining = new Map<string, number>();
  for (const t of tasks) remaining.set(t.id, t.burst);
  const activeGroups = new Set(groupOrder);
  while (activeGroups.size > 0) {
    for (const g of groupOrder) {
      if (!activeGroups.has(g)) continue;
      const members = groups.get(g)!.filter((t) => remaining.get(t.id)! > 0);
      if (members.length === 0) {
        activeGroups.delete(g);
        continue;
      }
      const slot: CoWindow = { time, groupId: g, members: members.map((m) => m.id) };
      windows.push(slot);
      hooks.onWindow?.(
        g,
        time,
        members.map((m) => m.id),
      );
      // 在 window 内按成员依次消耗
      let budget = window;
      for (const m of members) {
        if (budget <= 0) break;
        const rem = remaining.get(m.id)!;
        const used = Math.min(rem, budget);
        remaining.set(m.id, rem - used);
        budget -= used;
      }
      time += window;
    }
  }
  return windows;
}
