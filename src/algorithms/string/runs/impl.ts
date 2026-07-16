// =============================================================================
// 字符串 Run（周期性极大区间）· 纯算法实现
// 一个 run 是一个三元组 (l, r, p)：s[l..r] 是以最小周期 p 周期延展，且该区间无法向两侧延伸
// （即 s[l-1] !== s[l-1+p] 且 s[r+1] !== s[r+1-p]），且至少经历两个完整周期（r-l+1 >= 2p）。
// 这里给出基于前缀函数的实用实现（非理论最优，但正确且清晰）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 一个 run：区间 [l, r]（闭）与最小周期 p。 */
export interface Run {
  l: number;
  r: number;
  period: number;
  /** 周期重复次数（区间长度 / 周期）。 */
  exponent: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RunsHooks {
  /** 检测到候选周期 p 的极大区间。 */
  onRun?: (run: Run) => void;
  /** 计算完成。 */
  onDone?: (runs: Run[]) => void;
}

/**
 * 求字符串的所有 run（极大周期区间）。
 *
 * 做法：对每个候选周期 p（1..n/2），扫描所有起点，找以 p 为周期、至少两个完整周期、
 * 且无法向两侧延伸的极大区间。用「相邻字符相等」判定周期性。
 * 时间 O(n^2)（朴素，演示用；理论最优为 O(n)）。
 *
 * @returns run 列表（按 (l, period) 排序）
 */
export function runs(s: string, hooks: RunsHooks = {}): Run[] {
  const n = s.length;
  const result: Run[] = [];
  if (n < 2) {
    hooks.onDone?.(result);
    return result;
  }

  for (let p = 1; p <= n / 2; p++) {
    // 找所有「以 p 为周期的极大连续段」
    let l = 0;
    while (l < n) {
      // 从 l 起，要求 s[l..l+2p-1] 满足周期 p（即 s[i]==s[i+p] 对 i in [l, l+p-1]）
      if (l + 2 * p - 1 >= n) break;
      let periodicStart = true;
      for (let i = l; i < l + p; i++) {
        if (s[i] !== s[i + p]) {
          periodicStart = false;
          break;
        }
      }
      if (!periodicStart) {
        l++;
        continue;
      }
      // 向右扩展直到破坏周期性
      let r = l + 2 * p - 1;
      while (r + 1 < n && s[r + 1 - p] === s[r + 1]) r++;
      // 向左检查是否已经极大（s[l-1] !== s[l-1+p]）
      const leftMaximal = l === 0 || s[l - 1] !== s[l - 1 + p];
      if (leftMaximal) {
        const len = r - l + 1;
        const run: Run = { l, r, period: p, exponent: len / p };
        result.push(run);
        hooks.onRun?.(run);
      }
      // 跳到 r+1 继续（避免重复）
      l = r + 1;
    }
  }

  // 去重（同一区间可能被多个 p 触发，保留最小周期）
  result.sort((a, b) => (a.l !== b.l ? a.l - b.l : a.period - b.period));
  const deduped: Run[] = [];
  for (const run of result) {
    const last = deduped[deduped.length - 1];
    if (last && last.l === run.l && last.r === run.r) continue; // 同区间保留更小周期（已排序在前）
    deduped.push(run);
  }

  hooks.onDone?.(deduped);
  return deduped;
}
