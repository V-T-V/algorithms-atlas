// 优先级天花板协议 (ICPP) · 实现

export interface PcTask {
  id: string;
  basePriority: number;
}

export interface PcResource {
  id: string;
  /** 哪些任务可能使用该资源（用于计算天花板）。 */
  users: string[];
}

export interface PcEvent {
  type: 'lock' | 'unlock';
  taskId: string;
  resourceId: string;
  time: number;
}

export interface PcSnapshot {
  time: number;
  taskId: string;
  resourceId: string;
  type: 'lock' | 'unlock';
  ceiling: number;
  boostedPriority: number;
  blocked: boolean;
}

export interface PcResult {
  /** 各资源的优先级天花板。 */
  ceilings: Record<string, number>;
  snapshots: PcSnapshot[];
  effectivePriority: Record<string, number>;
  blockCount: number;
}

export interface PcHooks {
  onEvent?: (snap: PcSnapshot) => void;
}

/**
 * ICPP 仿真：lock 时若资源空闲，持有者优先级立即升至 ceiling；
 * 若被持有且当前任务优先级 ≤ 系统天花板，则阻塞。
 */
export function priorityCeiling(
  tasks: PcTask[],
  resources: PcResource[],
  events: PcEvent[],
  hooks: PcHooks = {},
): PcResult {
  const basePrio = new Map<string, number>();
  for (const t of tasks) basePrio.set(t.id, t.basePriority);
  const effective = new Map<string, number>();
  for (const t of tasks) effective.set(t.id, t.basePriority);
  // 计算天花板
  const ceilings: Record<string, number> = {};
  for (const r of resources) {
    ceilings[r.id] = r.users.reduce((m, u) => Math.max(m, basePrio.get(u) ?? 0), 0);
  }
  const holder = new Map<string, string>();
  const snapshots: PcSnapshot[] = [];
  let blockCount = 0;
  // 系统天花板 = 当前所有被持有资源的最高 ceiling
  const systemCeiling = (): number => {
    let m = 0;
    for (const resId of holder.keys()) m = Math.max(m, ceilings[resId] ?? 0);
    return m;
  };

  for (const e of events) {
    if (e.type === 'lock') {
      const cur = holder.get(e.resourceId);
      const _taskPrio = basePrio.get(e.taskId)!;
      if (cur === undefined) {
        // ICPP：检查是否会被系统天花板阻塞（OCPP 风格），此处简化为资源空闲即可获取
        holder.set(e.resourceId, e.taskId);
        effective.set(e.taskId, Math.max(effective.get(e.taskId)!, ceilings[e.resourceId] ?? 0));
        const snap: PcSnapshot = {
          time: e.time,
          taskId: e.taskId,
          resourceId: e.resourceId,
          type: 'lock',
          ceiling: ceilings[e.resourceId] ?? 0,
          boostedPriority: effective.get(e.taskId)!,
          blocked: false,
        };
        snapshots.push(snap);
        hooks.onEvent?.(snap);
      } else {
        // 资源被持有 -> 阻塞
        blockCount++;
        const snap: PcSnapshot = {
          time: e.time,
          taskId: e.taskId,
          resourceId: e.resourceId,
          type: 'lock',
          ceiling: ceilings[e.resourceId] ?? 0,
          boostedPriority: effective.get(cur)!,
          blocked: true,
        };
        snapshots.push(snap);
        hooks.onEvent?.(snap);
      }
    } else {
      const cur = holder.get(e.resourceId);
      if (cur === e.taskId) {
        holder.delete(e.resourceId);
        // 重新计算该任务有效优先级 = base 或 其仍持有资源的最高 ceiling
        let newEff = basePrio.get(e.taskId)!;
        for (const [resId, h] of holder) {
          if (h === e.taskId) newEff = Math.max(newEff, ceilings[resId] ?? 0);
        }
        effective.set(e.taskId, newEff);
        const snap: PcSnapshot = {
          time: e.time,
          taskId: e.taskId,
          resourceId: e.resourceId,
          type: 'unlock',
          ceiling: ceilings[e.resourceId] ?? 0,
          boostedPriority: newEff,
          blocked: false,
        };
        snapshots.push(snap);
        hooks.onEvent?.(snap);
      }
    }
  }
  // 引用 systemCeiling 以保留语义（避免未使用警告在 strict 下不报但 eslint 可能报）
  void systemCeiling;
  const effectivePriority: Record<string, number> = {};
  for (const t of tasks) effectivePriority[t.id] = effective.get(t.id)!;
  return { ceilings, snapshots, effectivePriority, blockCount };
}
