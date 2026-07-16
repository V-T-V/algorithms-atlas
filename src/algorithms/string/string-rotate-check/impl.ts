// =============================================================================
// 字符串旋转判定 · 纯算法实现
// =============================================================================

export interface RotateCheckHooks {
  onKmpBuild?: (i: number, j: number) => void;
  onCompare?: (textIdx: number, patIdx: number) => void;
  onFound?: (rot: number) => void;
}

/** KMP 求 lps（失败指针）。 */
function buildLps(p: string): number[] {
  const lps = new Array<number>(p.length).fill(0);
  let j = 0;
  for (let i = 1; i < p.length; i++) {
    while (j > 0 && p[i] !== p[j]) j = lps[j - 1]!;
    if (p[i] === p[j]) {
      j++;
      lps[i] = j;
    }
  }
  return lps;
}

/** 在 text 中查找 pat 的所有出现位置。 */
function kmpSearch(text: string, pat: string, hooks: RotateCheckHooks = {}): number[] {
  if (pat.length === 0) return [0];
  const lps = buildLps(pat);
  const res: number[] = [];
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    hooks.onCompare?.(i, j);
    while (j > 0 && text[i] !== pat[j]) j = lps[j - 1]!;
    if (text[i] === pat[j]) {
      j++;
      if (j === pat.length) {
        res.push(i - j + 1);
        hooks.onFound?.(i - j + 1);
        j = lps[j - 1]!;
      }
    }
  }
  return res;
}

/** 判定 s2 是否为 s1 的循环旋转。 */
export function isRotation(s1: string, s2: string, hooks: RotateCheckHooks = {}): boolean {
  if (s1.length !== s2.length) return false;
  if (s1.length === 0) return true;
  const doubled = s1 + s1;
  return kmpSearch(doubled, s2, hooks).length > 0;
}

/** 枚举所有使 rotate(s1, k) === s2 的旋转量 k。 */
export function rotationOffsets(s1: string, s2: string, hooks: RotateCheckHooks = {}): number[] {
  if (s1.length !== s2.length || s1.length === 0)
    return s1.length === 0 && s2.length === 0 ? [0] : [];
  const doubled = s1 + s1;
  return kmpSearch(doubled.slice(0, doubled.length - 1), s2, hooks);
}
