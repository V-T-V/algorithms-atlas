// 回传 · 实现

export interface BPNode {
  visits: number;
  wins: number;
  parent: BPNode | null;
}

export interface BackupHooks {
  onBackup?: (visits: number, wins: number, depth: number) => void;
}

/**
 * 单人回传：所有节点 wins += reward。
 */
export function backupSingle(node: BPNode, reward: number, hooks: BackupHooks = {}): void {
  let cur: BPNode | null = node;
  let depth = 0;
  while (cur !== null) {
    cur.visits++;
    cur.wins += reward;
    hooks.onBackup?.(cur.visits, cur.wins, depth);
    cur = cur.parent;
    depth++;
  }
}

/**
 * 双人零和回传：轮流玩家视角，奖励在每层取反。
 * 起点节点视为对手刚刚行动后的局面，故起点 wins += reward，下一层（己方）wins += (1-reward)，依此交替。
 */
export function backupTwoPlayer(node: BPNode, reward: number, hooks: BackupHooks = {}): void {
  let cur: BPNode | null = node;
  let depth = 0;
  let r = reward;
  while (cur !== null) {
    cur.visits++;
    cur.wins += r;
    hooks.onBackup?.(cur.visits, cur.wins, depth);
    cur = cur.parent;
    r = 1 - r; // 切换玩家视角
    depth++;
  }
}

/** 沿父链收集路径。 */
export function pathToRoot(node: BPNode): BPNode[] {
  const path: BPNode[] = [];
  let cur: BPNode | null = node;
  while (cur !== null) {
    path.push(cur);
    cur = cur.parent;
  }
  return path;
}
