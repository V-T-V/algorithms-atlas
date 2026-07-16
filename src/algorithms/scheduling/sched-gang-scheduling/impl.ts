// 成组调度 · 实现

export interface Gang {
  id: string;
  threads: string[];
  quantum: number;
}

export interface GangSlot {
  time: number;
  gangId: string;
  cores: string[];
}

export interface GangHooks {
  onDispatch?: (gangId: string, time: number, threads: string[]) => void;
}

/** 成组调度：每时间片把一个 gang 的所有线程同时派发到各核。 */
export function scheduleGangs(gangs: Gang[], nCores: number, hooks: GangHooks = {}): GangSlot[] {
  const slots: GangSlot[] = [];
  let time = 0;
  for (const g of gangs) {
    // gang 线程数 <= nCores 才能整体调度
    const assigned = g.threads.slice(0, nCores);
    const slot: GangSlot = { time, gangId: g.id, cores: assigned };
    slots.push(slot);
    hooks.onDispatch?.(g.id, time, assigned);
    time += g.quantum;
  }
  return slots;
}
