// 锦标赛选最小（两两比较法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露每轮每场对决。

/** 事件钩子。 */
export interface TournamentSelectHooks {
  /** 进入第 round 轮，本轮有 m 个种子。 */
  onRound?: (round: number, size: number) => void;
  /** 一场对决：a vs b，胜者（较小者）晋级。 */
  onMatch?: (
    round: number,
    matchIndex: number,
    a: number,
    b: number | null,
    winner: number,
  ) => void;
  /** 冠军产生（最小值）。给出总比较次数。 */
  onChampion?: (winner: number, comparisons: number) => void;
}

export interface TournamentResult {
  /** 全局最小值。 */
  minimum: number;
  /** 比较总次数（恰好 n−1）。 */
  comparisons: number;
  /** 轮数。 */
  rounds: number;
  /** 冠军一路击败的对手（用于求次小）。 */
  defeatedByChampion: number[];
}

/**
 * 锦标赛选最小：n−1 次比较。
 *
 * @param arr 待选数组
 * @param hooks 可选事件钩子
 * @returns 锦标赛结果
 */
export function tournamentMin(
  arr: readonly number[],
  hooks: TournamentSelectHooks = {},
): TournamentResult {
  const n = arr.length;
  if (n === 0) throw new RangeError('空数组无法选最小');

  // 当前轮的「存活者」（值），初始为输入拷贝
  let field: number[] = [...arr];
  // 冠军一路击败的对手
  let championPath: number[] = [];
  // 用「值→历史败者」映射记录每个值击败过谁（同值歧义：这里用 (value, 源) 区分简化）
  const beatenBy = new Map<string, number[]>();

  let comparisons = 0;
  let round = 0;

  while (field.length > 1) {
    hooks.onRound?.(round, field.length);
    const next: number[] = [];
    championPath = [];
    for (let i = 0; i < field.length; i += 2) {
      const a = field[i]!;
      const b = i + 1 < field.length ? field[i + 1]! : null;
      let winner: number;
      if (b === null) {
        winner = a;
        hooks.onMatch?.(round, i / 2, a, null, winner);
      } else {
        comparisons++;
        if (a <= b) {
          winner = a;
          const key = `${a}`;
          const list = beatenBy.get(key) ?? [];
          list.push(b);
          beatenBy.set(key, list);
        } else {
          winner = b;
          const key = `${b}`;
          const list = beatenBy.get(key) ?? [];
          list.push(a);
          beatenBy.set(key, list);
        }
        hooks.onMatch?.(round, i / 2, a, b, winner);
      }
      next.push(winner);
    }
    field = next;
    round++;
  }

  const winner = field[0]!;
  championPath = beatenBy.get(`${winner}`) ?? [];
  hooks.onChampion?.(winner, comparisons);

  return {
    minimum: winner,
    comparisons,
    rounds: round,
    defeatedByChampion: championPath,
  };
}

/**
 * 在锦标赛结果基础上求次小：次小必在冠军击败过的对手中。
 * 额外比较 ⌈log₂n⌉−1 次。
 */
export function tournamentSecond(
  arr: readonly number[],
  hooks: TournamentSelectHooks = {},
): { minimum: number; second: number; comparisons: number } {
  const r = tournamentMin(arr, hooks);
  if (r.defeatedByChampion.length === 0) {
    return { minimum: r.minimum, second: r.minimum, comparisons: r.comparisons };
  }
  const second = r.defeatedByChampion.reduce((acc, v) => (v < acc ? v : acc), Infinity);
  return {
    minimum: r.minimum,
    second,
    comparisons: r.comparisons + r.defeatedByChampion.length - 1,
  };
}
