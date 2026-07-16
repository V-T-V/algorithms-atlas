// =============================================================================
// Boyer-Moore 字符串匹配 · 纯算法实现
// 从右向左比较，结合「坏字符」与「好后缀」两条启发式规则跳过大量位置。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BoyerMooreHooks {
  /** 模式串对齐到文本起点 s，开始从右向左比较（j 为当前模式指针）。 */
  onAlign?: (start: number, j: number) => void;
  /** 比较文本 text[s+j] 与模式 pat[j]：match=true 相等，false 不等。 */
  onCompare?: (s: number, j: number, match: boolean) => void;
  /** 失配后决定本次跳跃量 shift，以及由哪条规则主导。 */
  onShift?: (from: number, to: number, shift: number, rule: 'bad-char' | 'good-suffix') => void;
  /** 在文本下标 start 处完整匹配（start 为模式起点）。 */
  onFound?: (start: number) => void;
}

/**
 * 构造「坏字符表」`bc`：`bc.get(ch)` = ch 在模式串中**最右**的出现位置，不存在为 −1。
 * 失配时移动 `j − bc.get(textChar)`（至少 1）。
 */
export function buildBadCharTable(pat: string): Map<string, number> {
  const bc = new Map<string, number>();
  for (let i = 0; i < pat.length; i++) bc.set(pat[i]!, i);
  return bc;
}

/**
 * 构造「好后缀表」`gs`：`gs[j]` 表示当 pat[j] 失配（已匹配后缀长度 = m−1−j）时，
 * 模式应右移使哪个位置对齐。具体含义：
 *   `gs[j]` = 新的起点偏移量（≥1），表示「右移 gs[j]，使模式某前缀/子串对齐文本」。
 *
 * 标准定义：`gs[j]` 为满足下列条件的最小偏移 d>0：
 *   (a) 存在子串 pat[k..k+m−1−d] 与已匹配后缀 pat[j+1..m−1] 相等；或
 *   (b) pat 的某个前缀 pat[0..r] 与已匹配后缀的某后缀相等。
 * 此处采用 CP-Algorithms 的简洁实现（先按前缀匹配填 strong suffix，再传播）。
 */
export function buildGoodSuffixTable(pat: string): number[] {
  const m = pat.length;
  const gs = new Array<number>(m).fill(m);
  // suffix[i] = pat 与「pat 右对齐到 i 处」时的最长公共后缀长度
  const suffix = new Array<number>(m).fill(0);
  suffix[m - 1] = m;
  let g = m - 1;
  for (let i = m - 2; i >= 0; i--) {
    let ii = i;
    while (ii >= 0 && pat[ii] === pat[g - (i - ii)]) ii--;
    suffix[i] = i - ii;
    if (ii < 0) {
      g = i; // 当前 i 是一个 border 起点
    }
  }
  // 第 1 步：对每个有完整后缀匹配的 i，更新 gs
  for (let i = 0; i < m; i++) {
    if (suffix[i] === i + 1) {
      // pat[0..i] 是 pat[0..m-1] 的后缀 → 可作为好后缀的前缀匹配
      for (let j = 0; j < m - 1 - i; j++) {
        if (gs[j] === m) gs[j] = m - 1 - i;
      }
    }
  }
  // 第 2 步：用子串匹配（suffix 完整覆盖后缀）填 gs
  for (let i = 0; i < m - 1; i++) {
    gs[m - 1 - suffix[i]!] = m - 1 - i;
  }
  return gs;
}

/**
 * Boyer-Moore 匹配：在 `text` 中找出所有 `pat` 出现的起点下标。
 *
 * 步骤：\n
 * 1. 模式起点 `s = 0`，模式指针 `j = m−1`（从右往左比较）。\n
 * 2. 当 `text[s+j] === pat[j]`：j−−；若 j < 0，命中匹配，记录 `s`，并 `s += gs[0]` 继续找后续。\n
 * 3. 失配时计算两条跳跃：\n
 *    - 坏字符：`bcShift = j − bc.get(text[s+j])`（若不存在则 j+1）\n
 *    - 好后缀：`gsShift = gs[j]`\n
 *    取 `shift = max(bcShift, gsShift)`，`s += shift`。\n
 *
 * 平均复杂度 `O(n/m)`（次线性的关键），最坏 `O(n·m)`（带回溯的版本可做到 `O(n+m)`）。
 *
 * @returns 所有匹配起点下标（升序）。空模式返回 `[]`。
 */
export function boyerMoore(text: string, pat: string, hooks: BoyerMooreHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const bc = buildBadCharTable(pat);
  const gs = buildGoodSuffixTable(pat);
  const result: number[] = [];

  let s = 0; // 模式起点
  while (s <= n - m) {
    let j = m - 1;
    hooks.onAlign?.(s, j);
    while (j >= 0 && pat[j] === text[s + j]) {
      hooks.onCompare?.(s, j, true);
      j--;
    }
    if (j < 0) {
      // 完整匹配
      result.push(s);
      hooks.onFound?.(s);
      const shift = gs[0]! > 0 ? gs[0]! : 1;
      hooks.onShift?.(s, s + shift, shift, 'good-suffix');
      s += shift;
    } else {
      hooks.onCompare?.(s, j, false);
      const bad = bc.get(text[s + j]!) ?? -1;
      const bcShift = Math.max(1, j - bad);
      const gsShift = gs[j]!;
      let shift: number;
      let rule: 'bad-char' | 'good-suffix';
      if (bcShift >= gsShift) {
        shift = bcShift;
        rule = 'bad-char';
      } else {
        shift = gsShift;
        rule = 'good-suffix';
      }
      hooks.onShift?.(s, s + shift, shift, rule);
      s += shift;
    }
  }
  return result;
}
