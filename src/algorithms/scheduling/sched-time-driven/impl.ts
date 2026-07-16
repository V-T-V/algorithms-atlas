// 时间驱动调度 · 实现

export interface TdTask {
  id: string;
  execution: number; // 占用的 slot 数（向上取整）
}

export interface TdSlot {
  index: number;
  taskId: string | null;
  used: number;
  slack: number;
}

export interface TdResult {
  slotLength: number;
  slots: TdSlot[];
  totalLoad: number;
  totalSlack: number;
  feasible: boolean;
}

export interface TdHooks {
  onSlot?: (index: number, taskId: string | null, used: number, slack: number) => void;
}

/**
 * 时间驱动：slotLength 为单位槽长，slotsPerPeriod 为每周期的槽数。
 * 任务按 execution/slotLength 向上取整占若干连续槽。
 */
export function timeDriven(
  tasks: TdTask[],
  slotLength: number,
  slotsPerPeriod: number,
  hooks: TdHooks = {},
): TdResult {
  const slots: TdSlot[] = [];
  let cursor = 0;
  let totalLoad = 0;
  for (const t of tasks) {
    const need = Math.ceil(t.execution / slotLength);
    for (let k = 0; k < need; k++) {
      if (cursor >= slotsPerPeriod) break;
      const used = k === need - 1 ? t.execution - (need - 1) * slotLength : slotLength;
      slots.push({ index: cursor, taskId: t.id, used, slack: slotLength - used });
      totalLoad += used;
      cursor++;
    }
  }
  // 剩余槽空闲
  while (cursor < slotsPerPeriod) {
    slots.push({ index: cursor, taskId: null, used: 0, slack: slotLength });
    cursor++;
  }
  for (const s of slots) hooks.onSlot?.(s.index, s.taskId, s.used, s.slack);
  const totalSlack = slots.reduce((sum, s) => sum + s.slack, 0);
  const feasible = totalLoad <= slotsPerPeriod * slotLength;
  return { slotLength, slots, totalLoad, totalSlack, feasible };
}
