// =============================================================================
// 勾股数生成（Pythagorean Triples）· 纯算法实现
// 欧几里得公式：本原勾股数 (a,b,c)（gcd(a,b,c)=1，a 奇 b 偶）由
//   a = m² - n², b = 2mn, c = m² + n² 给出，其中 m>n≥1, gcd(m,n)=1, m-n 奇。
// 乘以 k 得所有勾股数。
// =============================================================================

export interface PythagoreanHooks {
  onGenerate?: (m: number, n: number, triple: [number, number, number]) => void;
  onResult?: (triples: Array<[number, number, number]>) => void;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** 生成所有 c ≤ maxC 的本原勾股数。 */
export function primitivePythagoreanTriples(
  maxC: number,
  hooks: PythagoreanHooks = {},
): Array<[number, number, number]> {
  const result: Array<[number, number, number]> = [];
  for (let m = 2; m * m + 1 <= maxC; m++) {
    for (let n = 1; n < m; n++) {
      const c = m * m + n * n;
      if (c > maxC) break;
      if (gcd(m, n) !== 1) continue;
      if ((m - n) % 2 === 0) continue;
      const a = m * m - n * n;
      const b = 2 * m * n;
      const triple: [number, number, number] = [a, b, c];
      result.push(triple);
      hooks.onGenerate?.(m, n, triple);
    }
  }
  result.sort((x, y) => x[2]! - y[2]!);
  hooks.onResult?.(result);
  return result;
}

/** 生成所有勾股数（含非本原）c ≤ maxC。 */
export function allPythagoreanTriples(maxC: number): Array<[number, number, number]> {
  const result: Array<[number, number, number]> = [];
  const seen = new Set<string>();
  const prim = primitivePythagoreanTriples(maxC);
  for (const [a0, b0, c0] of prim) {
    let k = 1;
    while (k * c0! <= maxC) {
      const a = k * a0!;
      const b = k * b0!;
      const c = k * c0!;
      const key = [a, b, c].sort((x, y) => x - y).join(',');
      if (!seen.has(key)) {
        seen.add(key);
        result.push([a, b, c]);
      }
      k++;
    }
  }
  result.sort((x, y) => x[2]! - y[2]!);
  return result;
}
