// =============================================================================
// K近邻（K-Nearest Neighbors）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 分类：对查询点计算到所有训练点的距离，取最近 K 个，多数表决决定类别。
// =============================================================================

/** 训练样本点（带类别标签）。 */
export interface LabeledPoint {
  x: number;
  y: number;
  /** 类别标签。 */
  label: string;
}

export interface KnnResult {
  /** 预测的类别。 */
  label: string;
  /** 投票计数（按类别）。 */
  votes: Record<string, number>;
  /** 最近 K 个邻居（按距离升序）。 */
  neighbors: Array<{ index: number; dist: number; label: string }>;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface KnnHooks {
  /** 计算查询点到训练点 i 的距离。 */
  onDistance?: (i: number, dist: number) => void;
  /** 距离排序完成，选出最近 K 个邻居。 */
  onSelectNeighbors?: (neighbors: Array<{ index: number; dist: number }>) => void;
  /** 第 i 个邻居投出类别票。 */
  onVote?: (i: number, neighborIndex: number, label: string, votes: Record<string, number>) => void;
  /** 得出最终类别。 */
  onResult?: (label: string, votes: Record<string, number>) => void;
}

export interface KnnOptions {
  /** 邻居数。 */
  k: number;
}

/**
 * K 近邻分类（多数表决，欧氏距离）。
 * 平局规则：距离相同时按训练点下标升序（稳定排序）。
 *
 * @param train 训练集
 * @param query 查询点
 * @param options 配置（k）
 * @param hooks 可选事件钩子
 * @returns 分类结果
 */
export function knn(
  train: readonly LabeledPoint[],
  query: { x: number; y: number },
  options: KnnOptions,
  hooks: KnnHooks = {},
): KnnResult {
  const { k } = options;
  const n = train.length;

  if (n === 0 || k <= 0) {
    return { label: '', votes: {}, neighbors: [] };
  }

  // 1. 计算到每个训练点的欧氏距离
  const dists: Array<{ index: number; dist: number; label: string }> = [];
  for (let i = 0; i < n; i++) {
    const p = train[i]!;
    const dx = p.x - query.x;
    const dy = p.y - query.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    dists.push({ index: i, dist, label: p.label });
    hooks.onDistance?.(i, dist);
  }

  // 2. 按距离升序稳定排序（距离相同按下标）
  dists.sort((a, b) => a.dist - b.dist || a.index - b.index);
  const kk = Math.min(k, n);
  const neighbors = dists.slice(0, kk);
  hooks.onSelectNeighbors?.(neighbors.map((nb) => ({ index: nb.index, dist: nb.dist })));

  // 3. 多数表决
  const votes: Record<string, number> = {};
  neighbors.forEach((nb, i) => {
    votes[nb.label] = (votes[nb.label] ?? 0) + 1;
    hooks.onVote?.(i, nb.index, nb.label, { ...votes });
  });

  // 选票数最多者；平局取字典序最小（确定性）
  let bestLabel = '';
  let bestCount = -1;
  const labels = Object.keys(votes).sort();
  for (const label of labels) {
    const c = votes[label]!;
    if (c > bestCount) {
      bestCount = c;
      bestLabel = label;
    }
  }

  hooks.onResult?.(bestLabel, votes);
  return {
    label: bestLabel,
    votes,
    neighbors: neighbors.map((nb) => ({ index: nb.index, dist: nb.dist, label: nb.label })),
  };
}
