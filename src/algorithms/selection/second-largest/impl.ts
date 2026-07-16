// 找第二大元素（锦标赛 + 冠军对手法）· 纯算法实现
// 为了正确处理「重复值」，每个元素带唯一序号 tag。

export interface Tagged {
  value: number;
  tag: number; // 原始下标，保证唯一
}

/** 事件钩子。 */
export interface SecondLargestHooks {
  /** 锦标赛每场对决。 */
  onMatch?: (round: number, a: Tagged, b: Tagged, winner: Tagged) => void;
  /** 冠军产生。 */
  onChampion?: (champion: Tagged, comparisons: number) => void;
  /** 冠军的败者名单。 */
  onChampionLosers?: (losers: number[]) => void;
  /** 次大确定。 */
  onResult?: (second: Tagged, totalComparisons: number) => void;
}

export interface SecondLargestResult {
  largest: number;
  second: number;
  comparisons: number;
}

function tagMax(x: Tagged, y: Tagged): Tagged {
  if (x.value !== y.value) return x.value > y.value ? x : y;
  return x.tag > y.tag ? x : y; // 平局按 tag 决定，确保确定性
}

/**
 * 锦标赛 + 败者名单法找第二大。
 *
 * @param arr 输入数组（至少 2 个元素）
 * @param hooks 可选事件钩子
 */
export function secondLargest(
  arr: readonly number[],
  hooks: SecondLargestHooks = {},
): SecondLargestResult {
  const n = arr.length;
  if (n < 2) throw new RangeError('至少需要 2 个元素');

  // 给每个元素打 tag
  const tagged: Tagged[] = arr.map((value, i) => ({ value, tag: i }));
  // 记录每个 tag 的「败者名单」（其击败过谁）
  const losers = new Map<number, number[]>();

  let field: Tagged[] = [...tagged];
  let comparisons = 0;
  let round = 0;

  while (field.length > 1) {
    const next: Tagged[] = [];
    for (let i = 0; i < field.length; i += 2) {
      const a = field[i]!;
      if (i + 1 >= field.length) {
        next.push(a);
        continue;
      }
      const b = field[i + 1]!;
      comparisons++;
      const winner = tagMax(a, b);
      const loser = winner === a ? b : a;
      const list = losers.get(winner.tag) ?? [];
      list.push(loser.value);
      losers.set(winner.tag, list);
      hooks.onMatch?.(round, a, b, winner);
      next.push(winner);
    }
    field = next;
    round++;
  }

  const champion = field[0]!;
  hooks.onChampion?.(champion, comparisons);

  const champLosers = losers.get(champion.tag) ?? [];
  hooks.onChampionLosers?.(champLosers);

  // 冠军的败者名单中的最大值即第二大
  const second = champLosers.reduce((acc, v) => (v > acc ? v : acc), -Infinity);
  comparisons += Math.max(0, champLosers.length - 1);
  hooks.onResult?.({ value: second, tag: -1 }, comparisons);

  return { largest: champion.value, second, comparisons };
}
