// =============================================================================
// Boyer-Moore-Horspool 字符串匹配 · 纯算法实现
// BM 的简化版：只用「坏字符」启发式，按模式末位对齐的文本字符决定滑动量。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BmHorspoolHooks {
  /** 把模式对齐到文本起点 pos（pos 是模式首字符对齐的文本下标）。 */
  onAlign?: (pos: number) => void;
  /** 从右向左比较模式下标 j 与文本下标 ti。返回比对结果。 */
  onCompare?: (j: number, ti: number, eq: boolean) => void;
  /** 在文本下标 ti（= pos + m - 1）处命中一次完整匹配。 */
  onFound?: (start: number) => void;
  /** 用坏字符表把对齐位置从 oldPos 滑到 newPos。badChar 为对齐末位字符。 */
  onShift?: (oldPos: number, newPos: number, badChar: string) => void;
}

/**
 * 构造 Horspool 坏字符表：`shift[c]` 表示当模式末位对齐的文本字符为 c 时，
 * 模式应向右滑动的位数。
 *
 * 规则：对模式 `pat`（长度 m），默认 `shift[c] = m`；
 * 对 `pat[0..m-2]` 中的每个字符 c，`shift[c] = m - 1 - i`（i 是 c 在前 m-1 位中
 * **最后一次**出现的位置）。末位字符 `pat[m-1]` 不参与此表（否则可能漏匹配）。
 *
 * 时间 `O(m + |Σ|)`，空间 `O(|Σ|)`。
 *
 * @returns Map：字符 → 滑动位数。未出现的字符返回默认值 m。
 */
export function buildBadCharTable(pat: string): Map<string, number> {
  const m = pat.length;
  const table = new Map<string, number>();
  // 默认值 m；只记录前 m-1 位字符（末位排除）
  for (let i = 0; i < m - 1; i++) {
    table.set(pat[i]!, m - 1 - i);
  }
  return table;
}

/**
 * Boyer-Moore-Horspool：在 `text` 中找出所有 `pat` 出现的起点下标。
 *
 * 流程：把模式对齐到 text[0]，循环——\n
 * 1. 从模式末位（j=m-1）向左比较 text[pos+j] 与 pat[j]，直到全部相等（命中）或某位不等\n
 * 2. 命中：记录起点 pos；按「坏字符 = text[pos+m-1]」查表滑动\n
 * 3. 失配：按「坏字符 = text[pos+m-1]」（即对齐末位对应的文本字符）查表滑动\n
 *
 * 坏字符表的查表用「对齐窗口的末位文本字符」，这正是 Horspool 与经典 BM 的区别——
 * 简单且仍平均 `O(n/m)`（最优子线性），最坏 `O(n·m)`。
 *
 * @returns 所有匹配起点下标（升序）。空模式或模式比文本长返回 `[]`。
 */
export function bmHorspool(text: string, pat: string, hooks: BmHorspoolHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const shift = buildBadCharTable(pat);
  const getShift = (c: string): number => shift.get(c) ?? m;

  const result: number[] = [];
  let pos = 0; // 当前模式首字符对齐的文本下标
  hooks.onAlign?.(pos);

  while (pos <= n - m) {
    // 从右向左比较
    let j = m - 1;
    let matched = true;
    while (j >= 0) {
      const ti = pos + j;
      const eq = text[ti] === pat[j];
      hooks.onCompare?.(j, ti, eq);
      if (!eq) {
        matched = false;
        break;
      }
      j--;
    }
    if (matched) {
      hooks.onFound?.(pos);
      result.push(pos);
    }
    // 滑动：坏字符 = 对齐窗口末位文本字符 text[pos + m - 1]
    const badChar = text[pos + m - 1]!;
    const step = getShift(badChar);
    const newPos = pos + step;
    hooks.onShift?.(pos, newPos, badChar);
    pos = newPos;
  }

  return result;
}
