// =============================================================================
// Gamma + RLE 混合 · 纯算法实现
// =============================================================================

export interface GammaRunHooks {
  onRun?: (sym: number, length: number) => void;
}

interface Run {
  sym: number;
  length: number;
}

/** RLE：返回游程序列。 */
export function rle(data: readonly number[]): Run[] {
  if (data.length === 0) return [];
  const runs: Run[] = [];
  let cur = data[0]!;
  let len = 1;
  for (let i = 1; i < data.length; i++) {
    if (data[i] === cur) len++;
    else {
      runs.push({ sym: cur, length: len });
      cur = data[i]!;
      len = 1;
    }
  }
  runs.push({ sym: cur, length: len });
  return runs;
}

/** Elias gamma 编码正整数。 */
function gamma(n: number): string {
  if (n < 1) throw new Error(`需正整数 / needs positive int: ${n}`);
  const bin = n.toString(2);
  return '0'.repeat(bin.length - 1) + bin;
}

function gammaDecode(bits: string, start: number): { value: number; length: number } {
  let i = start;
  let zeros = 0;
  while (i < bits.length && bits[i] === '0') {
    zeros++;
    i++;
  }
  if (i >= bits.length) throw new Error('不完整');
  const L = zeros + 1;
  if (i + L > bits.length) throw new Error('不完整');
  const bin = bits.slice(i, i + L);
  return { value: parseInt(bin, 2), length: i + L - start };
}

/** 编码：每游程 = 符号(8 位) + 长度(gamma)。 */
export function gammaRunEncode(data: readonly number[], hooks: GammaRunHooks = {}): string {
  const runs = rle(data);
  let bits = '';
  for (const r of runs) {
    bits += r.sym.toString(2).padStart(8, '0');
    bits += gamma(r.length);
    hooks.onRun?.(r.sym, r.length);
  }
  return bits;
}

export function gammaRunDecode(bits: string): number[] {
  const out: number[] = [];
  let pos = 0;
  while (pos + 8 <= bits.length) {
    const sym = parseInt(bits.slice(pos, pos + 8), 2);
    pos += 8;
    const { value, length } = gammaDecode(bits, pos);
    pos += length;
    for (let k = 0; k < value; k++) out.push(sym);
  }
  return out;
}
