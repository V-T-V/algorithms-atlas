// =============================================================================
// AC 自动机增强（AC Automaton Enhanced）· 纯算法实现
// 在标准 AC 自动机基础上增加：(1) 每个模式串的命中次数统计；(2) 命中位置索引；
// (3) 支持按模式串查询「在文本中出现几次 / 出现在哪些位置」。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

import { buildAcAutomaton, acSearch, type AcHooks } from '../ac-automaton/impl.ts';

/** 单个模式串的命中统计。 */
export interface PatternStats {
  pattern: string;
  patternIdx: number;
  /** 命中次数（含重叠）。 */
  count: number;
  /** 所有命中位置（起始下标，升序）。 */
  positions: number[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AcAutomaton2Hooks extends AcHooks {
  /** 命中后更新某模式的统计。 */
  onStat?: (patternIdx: number, count: number) => void;
}

/**
 * AC 自动机增强：构建自动机 → 扫描文本 → 汇总每个模式的命中次数与位置。
 *
 * @param text 文本
 * @param patterns 模式串数组
 * @returns 每个模式串的统计（数组下标对齐 patterns）
 */
export function acAutomaton2(
  text: string,
  patterns: string[],
  hooks: AcAutomaton2Hooks = {},
): PatternStats[] {
  if (patterns.length === 0) return [];
  const ac = buildAcAutomaton(patterns, hooks);

  // 初始化统计
  const stats: PatternStats[] = patterns.map((pattern, patternIdx) => ({
    pattern,
    patternIdx,
    count: 0,
    positions: [],
  }));

  // 包装 onFound：除了记录到 results，还更新 stats
  const wrappedHooks: AcHooks = {
    ...hooks,
    onFound: (t, pi) => {
      const pat = patterns[pi]!;
      const start = t - pat.length + 1;
      stats[pi]!.count++;
      stats[pi]!.positions.push(start);
      hooks.onFound?.(t, pi);
      hooks.onStat?.(pi, stats[pi]!.count);
    },
  };

  acSearch(text, ac, wrappedHooks);

  return stats;
}
