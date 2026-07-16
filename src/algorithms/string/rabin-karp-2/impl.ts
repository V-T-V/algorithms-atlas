// =============================================================================
// Rabin-Karp 二维匹配 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RabinKarp2Hooks {
  /** 计算模式（或某行窗口）的哈希。 */
  onHash?: (label: 'pattern' | 'window', row: number, hash: number) => void;
  /** 行列哈希匹配，进一步逐字符校验。 */
  onVerify?: (r: number, c: number) => void;
  /** 命中一次完整 2D 匹配（左上角 (r,c)）。 */
  onFound?: (r: number, c: number) => void;
}

const BASE = 256;
const MOD = 1_000_000_007;

/**
 * 二维 Rabin-Karp：在大文本（字符串数组，每行等长）中查找二维模式（patRows）所有出现的左上角。
 *
 * 思路：\n
 * 1. 先按「行」做一维滚动哈希，把文本中每个 (r, c) 起宽为 pw 的窗口算出行哈希\n
 * 2. 对模式算出每行哈希，再纵向组合成一个「列哈希指纹」\n
 * 3. 在文本的行哈希矩阵上纵向滚动，找到与模式指纹相等的 pw×ph 窗口\n
 * 4. 命中后逐字符校验避免哈希碰撞误判\n
 *
 * 时间平均 O(R·C)，最坏 O(R·C·ph·pw)。空间 O(R·C)（行哈希矩阵）。
 *
 * @returns 所有命中的左上角坐标 [row, col]（按行优先升序）
 */
export function rabinKarp2(
  text: string[],
  patRows: string[],
  hooks: RabinKarp2Hooks = {},
): Array<[number, number]> {
  const R = text.length;
  if (R === 0 || patRows.length === 0) return [];
  const C = text[0]!.length;
  const ph = patRows.length;
  const pw = patRows[0]!.length;
  if (pw === 0 || pw > C || ph > R) return [];

  const powW = modPow(BASE, pw - 1, MOD);

  // 行哈希矩阵 rowHash[r][c] = text[r][c..c+pw-1] 的哈希
  const rowHash: number[][] = [];
  for (let r = 0; r < R; r++) {
    const line = text[r]!;
    let h = 0;
    for (let k = 0; k < pw; k++) h = (h * BASE + line.charCodeAt(k)) % MOD;
    hooks.onHash?.('window', r, h);
    const arr = [h];
    for (let c = 1; c + pw <= C; c++) {
      h = (h - ((line.charCodeAt(c - 1) * powW) % MOD) + MOD) % MOD;
      h = (h * BASE + line.charCodeAt(c + pw - 1)) % MOD;
      arr.push(h);
    }
    rowHash.push(arr);
  }

  // 模式：每行哈希，再纵向组合成列哈希指纹
  const patRowHash: number[] = patRows.map((line) => {
    let h = 0;
    for (let k = 0; k < pw; k++) h = (h * BASE + line.charCodeAt(k)) % MOD;
    return h;
  });
  hooks.onHash?.('pattern', -1, patRowHash[0]!);

  // 模式纵向指纹：把 ph 个行哈希当作一列再哈希
  const powH = modPow(MOD, ph - 1, 0); // 占位，实际用大质数做第二维基数
  const BASE2 = MOD; // 第二维基数（任意与 MOD 互质即可）
  void powH;
  let patFp = 0;
  for (let k = 0; k < ph; k++) patFp = (patFp * BASE2 + patRowHash[k]!) % BIG_PRIME;

  const powHmod = modPow(BASE2, ph - 1, BIG_PRIME);

  const results: Array<[number, number]> = [];

  // 在行哈希矩阵上，对每列做纵向滚动
  for (let c = 0; c + pw <= C; c++) {
    // 计算首列窗口 [0..ph-1] 的纵向哈希
    let colFp = 0;
    for (let r = 0; r < ph; r++) colFp = (colFp * BASE2 + rowHash[r]![c]!) % BIG_PRIME;
    for (let r = 0; r + ph <= R; r++) {
      if (r > 0) {
        colFp = (colFp - ((rowHash[r - 1]![c]! * powHmod) % BIG_PRIME) + BIG_PRIME) % BIG_PRIME;
        colFp = (colFp * BASE2 + rowHash[r + ph - 1]![c]!) % BIG_PRIME;
      }
      if (colFp === patFp) {
        hooks.onVerify?.(r, c);
        if (verify2d(text, patRows, r, c)) {
          hooks.onFound?.(r, c);
          results.push([r, c]);
        }
      }
    }
  }
  return results;
}

const BIG_PRIME = 1_000_000_009;

function verify2d(text: string[], patRows: string[], r: number, c: number): boolean {
  for (let i = 0; i < patRows.length; i++) {
    const line = text[r + i]!;
    const pl = patRows[i]!;
    for (let j = 0; j < pl.length; j++) {
      if (line.charCodeAt(c + j) !== pl.charCodeAt(j)) return false;
    }
  }
  return true;
}

function modPow(base: number, exp: number, mod: number): number {
  if (mod === 0) return 0;
  let result = 1;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1;
  }
  return result;
}
