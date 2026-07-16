// 处理器亲和性调度 · 实现

export interface AffinityTask {
  id: string;
  load: number;
  homeCore: number;
}

export interface AffinityResult {
  assignment: Array<{ id: string; core: number; load: number }>;
  coreLoads: number[];
  migrations: number;
}

export interface AffHooks {
  onAssign?: (taskId: string, core: number, migrated: boolean) => void;
}

/** 把任务分配到核心：优先 home，失衡超过阈值才迁移。 */
export function scheduleAffinity(
  tasks: AffinityTask[],
  nCores: number,
  threshold = 2,
  hooks: AffHooks = {},
): AffinityResult {
  const coreLoads = new Array(nCores).fill(0);
  const assignment: Array<{ id: string; core: number; load: number }> = [];
  let migrations = 0;
  for (const t of tasks) {
    let core = t.homeCore;
    let migrated = false;
    // 若 home 核负载比最小负载核高出 threshold 以上，迁移
    let minCore = 0;
    for (let c = 1; c < nCores; c++) if (coreLoads[c]! < coreLoads[minCore]!) minCore = c;
    if (coreLoads[t.homeCore]! - coreLoads[minCore]! >= threshold) {
      core = minCore;
      migrated = true;
      migrations++;
    }
    coreLoads[core]! += t.load;
    assignment.push({ id: t.id, core, load: t.load });
    hooks.onAssign?.(t.id, core, migrated);
  }
  return { assignment, coreLoads, migrations };
}
