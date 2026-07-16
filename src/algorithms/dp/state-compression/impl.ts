// =============================================================================
// 状压进阶（State Compression）· 轮廓线 DP · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：用 1×2 多米诺骨牌**完全铺满** n×m 棋盘的方案数（轮廓线/逐格转移状压 DP）。
// =============================================================================

/** 输入：棋盘行数 n、列数 m（逐格转移，m 为轮廓线宽度）。 */
export interface TilingInput {
  rows: number;
  cols: number;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface StateCompressionHooks {
  /** 处理格子 (i,j)，从轮廓线状态 prev 推到 next，新增方案数 add。 */
  onTransition?: (i: number, j: number, prev: number, next: number, add: number) => void;
  /** 处理完一列/阶段，当前各轮廓线状态的方案数分布。 */
  onStage?: (phase: number, dist: Map<number, number>) => void;
  /** 算法完成：铺满方案数。 */
  onDone?: (count: number) => void;
}

/** 结果。 */
export interface StateCompressionResult {
  /** 完全铺满方案数。 */
  count: number;
}

/**
 * 状压 DP 解多米诺骨牌铺砖：用 1×2 骨牌完全铺满 `n×m` 棋盘的方案数。
 *
 * **逐格轮廓线 DP**：按从左到右、从上到下逐格处理。轮廓线（profile）是一个 `m` 位二进制数，
 * 第 `k` 位表示「当前格的左上方第 k 个格子是否已被覆盖」。
 *
 * 处理格子 `(i,j)`（轮廓线第 j 位对应本格是否已被上方竖放骨牌占据）：
 * - 若 `profile` 第 j 位为 1：本格已被上方骨牌占据，无需再放 → 新 profile 第 j 位清 0
 * - 若为 0：
 *   - 可**横放**（向右伸出，占 (i,j) 与 (i,j+1)）：新 profile 第 j+1 位置 1（需 j+1 < m）
 *   - 可**竖放**（向下伸出，占 (i,j) 与 (i+1,j)）：新 profile 第 j 位置 1
 *
 * 全部处理完后，轮廓线回到全 0 即一个合法的铺法。复杂度 `O(n·m·2^m)`。
 *
 * @param input 棋盘规模
 * @param hooks 可选事件钩子
 */
export function stateCompression(
  input: TilingInput,
  hooks: StateCompressionHooks = {},
): StateCompressionResult {
  const { rows: n, cols: m } = input;
  if (n <= 0 || m <= 0) {
    hooks.onDone?.(0);
    return { count: 0 };
  }
  // 保证轮廓线宽度 = min(n,m)，取较小者降低状态数（结果对称）
  // 这里直接以 m 为轮廓线宽度（要求 m 较小；调用方负责）。
  const W = m;
  const full = 1 << W;

  // dp[profile] = 当前方案数
  let dp = new Array<number>(full).fill(0);
  dp[0] = 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const next = new Array<number>(full).fill(0);
      for (let profile = 0; profile < full; profile++) {
        const cnt = dp[profile]!;
        if (cnt === 0) continue;
        const bit = 1 << j;
        if ((profile & bit) !== 0) {
          // 本格已被占据：清掉该位
          const np = profile ^ bit;
          next[np]! += cnt;
          hooks.onTransition?.(i, j, profile, np, cnt);
        } else {
          // 本格空：尝试横放（向右）
          if (j + 1 < m && (profile & (1 << (j + 1))) === 0) {
            const np = profile | (1 << (j + 1));
            next[np]! += cnt;
            hooks.onTransition?.(i, j, profile, np, cnt);
          }
          // 尝试竖放（向下）
          if (i + 1 < n) {
            const np = profile | bit;
            next[np]! += cnt;
            hooks.onTransition?.(i, j, profile, np, cnt);
          }
          // 若是最后一个格子且无法放置，则该 profile 在此处无贡献（自然丢弃）
        }
      }
      dp = next;
      hooks.onStage?.(i * m + j, new Map(dp.map((v, k) => [k, v])));
    }
  }

  const count = dp[0]!;
  hooks.onDone?.(count);
  return { count };
}
