// =============================================================================
// 水库采样（Reservoir Sampling, Algorithm R）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

export type Rng = () => number; // 返回 [0,1)

/** 线性同余生成器（LCG），可复现的随机源。 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ReservoirHooks {
  /** 从流中读到第 i 个元素（0-based）。 */
  onStream?: (i: number) => void;
  /** 蓄水池已满，第 i 个元素尝试替换槽位 slot（即生成 j 并比较）。 */
  onTryReplace?: (i: number, slot: number) => void;
  /** 蓄水池前 k 个元素初始化完成。 */
  onFill?: () => void;
}

/**
 * 水库采样（Algorithm R）：从未知/巨大流中均匀抽取 k 个样本。
 * 每个元素被选中的概率均为 k/n（n 为流大小）。
 *
 * @param stream 数据流（只遍历一次，可视为迭代源）
 * @param k 蓄水池容量
 * @param rng [0,1) 随机源；默认 Math.random
 * @param hooks 可选事件钩子
 * @returns 长度 min(k, n) 的样本数组
 */
export function reservoirSampling(
  stream: readonly number[],
  k: number,
  rng: Rng = Math.random,
  hooks: ReservoirHooks = {},
): number[] {
  const n = stream.length;
  const size = Math.max(0, Math.min(k, n));
  const reservoir: number[] = new Array(size);

  // 1) 前k个直接灌入
  for (let i = 0; i < size; i++) {
    hooks.onStream?.(i);
    reservoir[i] = stream[i]!;
  }
  hooks.onFill?.();

  // 2) 第 i (i>=k) 个：以 k/i 概率保留，随机替换池中某元素
  for (let i = size; i < n; i++) {
    hooks.onStream?.(i);
    const j = Math.floor(rng() * (i + 1)); // [0, i]
    if (j < size) {
      reservoir[j] = stream[i]!;
      hooks.onTryReplace?.(i, j);
    }
  }
  return reservoir;
}
