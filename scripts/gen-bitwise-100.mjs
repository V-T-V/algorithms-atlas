// Generator for 45 bitwise algorithms (55 -> 100). Each has distinct real logic.
// ids use 'bit-' prefix variants to stay unique vs existing 55.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'bitwise';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, metaSrc, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), metaSrc);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

const bin = (n) => '0b' + (n >>> 0).toString(2).padStart(8, '0').slice(-8);

const ALGS = [];

// 1. bit-abs-2  —— 用掩码取绝对值（无分支）
ALGS.push({
  id: 'bit-abs-2',
  m: ['掩码绝对值', 'Masked Absolute Value', '用算术右移生成全1/全0掩码无分支求绝对值。', 'Branchless abs via arithmetic-shift sign mask.',
    '对 x：mask = x >> 31（算术右移，负数全1，非负全0），结果 = (x ^ mask) - mask。负数时翻转所有位再 +1 即 |x|。', 'mask = x >> 31 (all 1s if negative). abs = (x ^ mask) - mask. O(1).', 'O(1)', 'O(1)', ['bitwise', 'abs', 'branchless']],
  impl: `// 掩码绝对值 · 实现
export interface AbsMaskHooks { onMask?: (mask: number) => void; onResult?: (v: number) => void; }
export function absMask(x: number, hooks: AbsMaskHooks = {}): number {
  const v = x | 0;
  const mask = v >> 31; // 算术右移：负数全1(=-1)，非负全0
  hooks.onMask?.(mask >>> 0);
  const r = ((v ^ mask) - mask) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `// 掩码绝对值 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { absMask } from './impl.ts';
export const DEFAULT_INPUT = [-7, -1, 0, 5, -256];
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '掩码绝对值', en: 'Masked abs' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out: number[] = [];
  for (const x of input) {
    absMask(x, {
      onMask: (m) => rec.begin({ zh: 'mask = ' + b(m), en: 'mask = ' + b(m) }).setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }]).commit(),
      onResult: (r) => out.push(r),
    });
    rec.begin({ zh: '|' + x + '| = ' + Math.abs(x | 0), en: '|' + x + '| = ' + Math.abs(x | 0) }).setAux([{ label: '结果', value: String(Math.abs(x | 0)), role: 'final' as BarRole }]).commit();
  }
  rec.begin({ zh: '完成：' + out.join(', '), en: 'Done: ' + out.join(', ') }).setArray(out, out.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { absMask } from '../../src/algorithms/bitwise/bit-abs-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-abs-2/trace.ts';
test('absMask 正确', () => {
  assert.equal(absMask(0), 0);
  assert.equal(absMask(5), 5);
  assert.equal(absMask(-7), 7);
  assert.equal(absMask(-1), 1);
  assert.equal(absMask(-256), 256);
  assert.equal(absMask(2147483647), 2147483647);
});
test('absMask 钩子触发', () => {
  let c = 0;
  absMask(-100, { onMask: () => c++, onResult: () => c++ });
  assert.equal(c, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 2. bit-sign-2  —— 提取符号 (-1/0/1)
ALGS.push({
  id: 'bit-sign-2',
  m: ['符号提取', 'Sign Extraction', '无分支提取整数符号：负为 -1、零为 0、正为 1。', 'Branchless signum: -1 for negatives, 0 for zero, 1 for positives.',
    '对 x：signNeg = x >> 31（负数全1即 -1，非负 0）；isNonZero = (-x | x) >> 31（非零时 -1）。正号 = -isNonZero & ~signNeg。', 'signNeg = x>>31; nz = (-x|x)>>31; result combines them. O(1).', 'O(1)', 'O(1)', ['bitwise', 'sign', 'branchless']],
  impl: `// 符号提取 · 实现
export interface SignHooks { onSign?: (s: number) => void; }
export function signBit(x: number, hooks: SignHooks = {}): number {
  const v = x | 0;
  const signNeg = v >> 31;            // -1 if negative else 0
  const nonZero = (-v | v) >> 31;     // -1 if nonzero else 0
  const r = (nonZero & 1) + signNeg;  // -1 / 0 / 1
  hooks.onSign?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { signBit } from './impl.ts';
export const DEFAULT_INPUT = [-42, -1, 0, 1, 99];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '符号提取', en: 'Sign extraction' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = signBit(x, { onSign: (s) => out.push(s) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'pivot' as BarRole;
    rec.begin({ zh: 'sign(' + x + ') = ' + r, en: 'sign(' + x + ') = ' + r }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit();
  });
  rec.begin({ zh: '结果：' + out.join(', '), en: 'Result: ' + out.join(', ') }).setArray(out, out.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signBit } from '../../src/algorithms/bitwise/bit-sign-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-sign-2/trace.ts';
test('signBit 正确', () => {
  assert.equal(signBit(-42), -1);
  assert.equal(signBit(-1), -1);
  assert.equal(signBit(0), 0);
  assert.equal(signBit(1), 1);
  assert.equal(signBit(99), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 3. bit-min-2  —— 无分支求最小值
ALGS.push({
  id: 'bit-min-2',
  m: ['掩码求最小', 'Branchless Min', '用符号掩码无分支求两数最小值。', 'Branchless min via the sign mask.',
    '对 a,b：diff = a - b；mask = diff >> 31（a<b 时全1，否则全0）。min = b + (diff & mask)，即 a<b 时回退到 a。', 'diff = a-b; mask = diff>>31; min = b + (diff & mask). O(1).', 'O(1)', 'O(1)', ['bitwise', 'min', 'branchless']],
  impl: `// 掩码求最小 · 实现
export interface MinBitHooks { onMask?: (mask: number) => void; onResult?: (m: number) => void; }
export function minBit(a: number, b: number, hooks: MinBitHooks = {}): number {
  const x = a | 0, y = b | 0;
  const diff = (x - y) | 0;
  const mask = diff >> 31;
  hooks.onMask?.(mask >>> 0);
  const r = (y + (diff & mask)) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minBit } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[3, 7], [9, 2], [5, 5], [-1, 4]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '掩码求最小', en: 'Branchless min' }).commit();
  for (const [a, b] of input) {
    const r = minBit(a, b, { onMask: (m) => rec.begin({ zh: 'mask = ' + (m >>> 0).toString(2), en: 'mask' }).setAux([{ label: 'mask', value: (m >>> 0).toString(2), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'min(' + a + ',' + b + ') = ' + r, en: 'min(' + a + ',' + b + ') = ' + r }).setAux([{ label: 'min', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minBit } from '../../src/algorithms/bitwise/bit-min-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-min-2/trace.ts';
test('minBit 正确', () => {
  assert.equal(minBit(3, 7), 3);
  assert.equal(minBit(9, 2), 2);
  assert.equal(minBit(5, 5), 5);
  assert.equal(minBit(-1, 4), -1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 4. bit-max-2  —— 无分支求最大值
ALGS.push({
  id: 'bit-max-2',
  m: ['掩码求最大', 'Branchless Max', '用符号掩码无分支求两数最大值。', 'Branchless max via the sign mask.',
    '对 a,b：diff = a - b；mask = diff >> 31（a<b 时全1）。max = a - (diff & mask)，即 a<b 时回退到 b。', 'diff = a-b; mask = diff>>31; max = a - (diff & mask). O(1).', 'O(1)', 'O(1)', ['bitwise', 'max', 'branchless']],
  impl: `export interface MaxBitHooks { onMask?: (mask: number) => void; onResult?: (m: number) => void; }
export function maxBit(a: number, b: number, hooks: MaxBitHooks = {}): number {
  const x = a | 0, y = b | 0;
  const diff = (x - y) | 0;
  const mask = diff >> 31;
  hooks.onMask?.(mask >>> 0);
  const r = (x - (diff & mask)) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxBit } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[3, 7], [9, 2], [5, 5], [-1, 4]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '掩码求最大', en: 'Branchless max' }).commit();
  for (const [a, b] of input) {
    const r = maxBit(a, b, { onMask: (m) => rec.begin({ zh: 'mask = ' + (m >>> 0).toString(2), en: 'mask' }).setAux([{ label: 'mask', value: (m >>> 0).toString(2), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'max(' + a + ',' + b + ') = ' + r, en: 'max(' + a + ',' + b + ') = ' + r }).setAux([{ label: 'max', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxBit } from '../../src/algorithms/bitwise/bit-max-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-max-2/trace.ts';
test('maxBit 正确', () => {
  assert.equal(maxBit(3, 7), 7);
  assert.equal(maxBit(9, 2), 9);
  assert.equal(maxBit(5, 5), 5);
  assert.equal(maxBit(-1, 4), 4);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 5. bit-is-pow2-2  —— 判断 2 的幂 (x & (x-1))
ALGS.push({
  id: 'bit-is-pow2-2',
  m: ['2的幂判定v2', 'Power of Two v2', '用 (x & (x-1)) == 0 且 x>0 判定 2 的幂。', 'A power of two has exactly one set bit: x>0 and (x & (x-1)) == 0.',
    '2 的幂的二进制恰有一个 1。x-1 会把最低位的 1 变 0 并其后所有 0 变 1，故 x & (x-1) == 0 当且仅当 x 只有一个 1。需排除 x=0。', 'A power of two has one set bit; x & (x-1) clears it, so result is 0. Exclude x=0. O(1).', 'O(1)', 'O(1)', ['bitwise', 'power-of-two']],
  impl: `export interface IsPow2Hooks { onStrip?: (stripped: number) => void; onResult?: (r: boolean) => void; }
export function isPow2Bit(x: number, hooks: IsPow2Hooks = {}): boolean {
  const v = x | 0;
  const stripped = v & (v - 1);
  hooks.onStrip?.(stripped >>> 0);
  const r = v > 0 && stripped === 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPow2Bit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0, 1, 2, 3, 4, 16, 255, 256];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2的幂判定', en: 'Power of two check' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out: boolean[] = [];
  input.forEach((x, i) => {
    const r = isPow2Bit(x, { onResult: (v) => out.push(v) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = (r ? 'final' : 'warn') as BarRole;
    rec.begin({ zh: b(x) + ' & ' + b((x - 1) >>> 0) + ' → ' + r, en: b(x) + ' & ' + b((x - 1) >>> 0) + ' → ' + r }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit();
  });
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPow2Bit } from '../../src/algorithms/bitwise/bit-is-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-is-pow2-2/trace.ts';
test('isPow2Bit 正确', () => {
  assert.equal(isPow2Bit(0), false);
  assert.equal(isPow2Bit(1), true);
  assert.equal(isPow2Bit(2), true);
  assert.equal(isPow2Bit(3), false);
  assert.equal(isPow2Bit(16), true);
  assert.equal(isPow2Bit(255), false);
  assert.equal(isPow2Bit(256), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 6. bit-log2-2  —— 用折半 clz 求 floor(log2)
ALGS.push({
  id: 'bit-log2-2',
  m: ['折半log2', 'Floor Log2 by Halving', '由 31-clz 得到 floor(log2(x))。', 'floor(log2(x)) = 31 - clz(x).',
    '若 x>0，floor(log2 x) 即最高位 1 的位置。等价于 31 减去前导零个数。x=0 时返回 -1（未定义）。', 'For x>0, floor(log2 x) is the index of the MSB, i.e. 31 - clz(x). O(1).', 'O(1)', 'O(1)', ['bitwise', 'log2', 'clz']],
  impl: `export interface Log2Hooks { onClz?: (clz: number) => void; onResult?: (r: number) => void; }
export function clz32(x: number): number {
  if (x === 0) return 32;
  let n = 0, v = x >>> 0;
  if ((v & 0xFFFF0000) === 0) { n += 16; v <<= 16; }
  if ((v & 0xFF000000) === 0) { n += 8; v <<= 8; }
  if ((v & 0xF0000000) === 0) { n += 4; v <<= 4; }
  if ((v & 0xC0000000) === 0) { n += 2; v <<= 2; }
  if ((v & 0x80000000) === 0) { n += 1; }
  return n;
}
export function floorLog2(x: number, hooks: Log2Hooks = {}): number {
  if (x <= 0) return -1;
  const c = clz32(x >>> 0);
  hooks.onClz?.(c);
  const r = 31 - c;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floorLog2 } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 7, 8, 1023, 1024];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '折半求 floor(log2)', en: 'Floor log2' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = floorLog2(x, { onClz: (c) => rec.begin({ zh: 'clz(' + x + ')=' + c, en: 'clz(' + x + ')=' + c }).setAux([{ label: 'clz', value: String(c), role: 'pivot' as BarRole }]).commit(), onResult: (v) => out.push(v) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec.begin({ zh: 'log2(' + x + ')=' + r, en: 'log2(' + x + ')=' + r }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit();
  });
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floorLog2, clz32 } from '../../src/algorithms/bitwise/bit-log2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-log2-2/trace.ts';
test('floorLog2 正确', () => {
  assert.equal(floorLog2(1), 0);
  assert.equal(floorLog2(2), 1);
  assert.equal(floorLog2(3), 1);
  assert.equal(floorLog2(7), 2);
  assert.equal(floorLog2(8), 3);
  assert.equal(floorLog2(1023), 9);
  assert.equal(floorLog2(1024), 10);
  assert.equal(floorLog2(0), -1);
});
test('clz32 与原生一致', () => {
  for (const x of [0,1,2,15,16,255,256,0xffffffff]) assert.equal(clz32(x), Math.clz32(x));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 7. bit-next-pow2-2  —— 向上取整到下一个 2 的幂
ALGS.push({
  id: 'bit-next-pow2-2',
  m: ['下一个2的幂', 'Next Power of Two', '把任意正整数向上取整到最近的 2 的幂。', 'Round up a positive integer to the next power of two.',
    '不断把最高位之后的位全部填 1（折半传播），再加 1 即得。x=1 返回 1。', 'Propagate the highest set bit down to fill all lower bits, then add 1. O(1).', 'O(1)', 'O(1)', ['bitwise', 'power-of-two', 'round']],
  impl: `export interface NextPow2Hooks { onFill?: (filled: number) => void; onResult?: (r: number) => void; }
export function nextPow2(x: number, hooks: NextPow2Hooks = {}): number {
  let v = (x - 1) | 0;
  if (v <= 0) return 1;
  v = v >>> 0;
  v |= v >>> 1; v |= v >>> 2; v |= v >>> 4; v |= v >>> 8; v |= v >>> 16;
  hooks.onFill?.(v >>> 0);
  const r = (v + 1) >>> 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nextPow2 } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [1, 3, 5, 9, 16, 33, 1000];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '下一个2的幂', en: 'Next power of two' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = nextPow2(x, { onFill: (f) => rec.begin({ zh: 'filled = ' + b(f), en: 'filled = ' + b(f) }).setAux([{ label: 'filled', value: b(f), role: 'pivot' as BarRole }]).commit(), onResult: (v) => out.push(v) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec.begin({ zh: 'nextPow2(' + x + ')=' + r, en: 'nextPow2(' + x + ')=' + r }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit();
  });
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextPow2 } from '../../src/algorithms/bitwise/bit-next-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-next-pow2-2/trace.ts';
test('nextPow2 正确', () => {
  assert.equal(nextPow2(1), 1);
  assert.equal(nextPow2(3), 4);
  assert.equal(nextPow2(5), 8);
  assert.equal(nextPow2(9), 16);
  assert.equal(nextPow2(16), 16);
  assert.equal(nextPow2(33), 64);
  assert.equal(nextPow2(1000), 1024);
  assert.equal(nextPow2(0), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 8. bit-trailing-zeros-2  —— ctz 折半实现
ALGS.push({
  id: 'bit-trailing-zeros-2',
  m: ['末尾零计数v2', 'Count Trailing Zeros v2', '折半实现 ctz：返回最低位 1 之后的 0 个数。', 'Branchless ctz via halving isolates the lowest set bit.',
    '思路：先用 v & -v 分离最低位的 1（isolate），然后数其后 0 的个数。当 x=0 时约定返回 32。', 'Isolate lowbit with v & -v, then halve to count trailing zeros. x=0 → 32. O(1).', 'O(1)', 'O(1)', ['bitwise', 'ctz', 'lowest-set-bit']],
  impl: `export interface CtzHooks { onIsolate?: (iso: number) => void; onResult?: (r: number) => void; }
export function ctz32(x: number, hooks: CtzHooks = {}): number {
  const v = x | 0;
  if (v === 0) return 32;
  const iso = (v & -v) >>> 0; // 最低位的 1
  hooks.onIsolate?.(iso);
  // de Bruijn 查表法
  const SEQ = 0x077CB531;
  const TBL = [0,1,28,2,29,14,24,3,30,22,20,15,25,17,4,8,31,27,13,23,21,19,16,7,26,12,18,6,11,10,9,5];
  const idx = ((iso * SEQ) >>> 27) & 31;
  const r = TBL[idx]!;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctz32 } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [1, 2, 4, 8, 12, 0x10000, 0x80000000];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '末尾零计数', en: 'Count trailing zeros' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = ctz32(x, { onIsolate: (iso) => rec.begin({ zh: 'isolate = ' + b(iso), en: 'isolate = ' + b(iso) }).setAux([{ label: 'isolate', value: b(iso), role: 'pivot' as BarRole }]).commit(), onResult: (v) => out.push(v) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec.begin({ zh: 'ctz(' + x + ')=' + r, en: 'ctz(' + x + ')=' + r }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit();
  });
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctz32 } from '../../src/algorithms/bitwise/bit-trailing-zeros-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-trailing-zeros-2/trace.ts';
test('ctz32 正确', () => {
  assert.equal(ctz32(0), 32);
  assert.equal(ctz32(1), 0);
  assert.equal(ctz32(2), 1);
  assert.equal(ctz32(4), 2);
  assert.equal(ctz32(8), 3);
  assert.equal(ctz32(12), 2);
  assert.equal(ctz32(0x10000), 16);
  assert.equal(ctz32(0x80000000), 31);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 9. bit-popcount-3  —— 查表 popcount (8位表)
ALGS.push({
  id: 'bit-popcount-3',
  m: ['查表popcount', 'Popcount by Lookup', '用 256 项字节查表实现 32 位 popcount。', '32-bit popcount via a 256-entry byte lookup table.',
    '预生成 PC[256] 记录每个字节中 1 的个数；把 32 位整数拆成 4 个字节分别查表求和。', 'Precompute popcount per byte (256 entries), then sum the four bytes of x. O(1).', 'O(1)', 'O(1)', ['bitwise', 'popcount', 'lookup-table']],
  impl: `const PC: number[] = new Array(256);
for (let i = 0; i < 256; i++) PC[i] = (i & 1) + (PC[i >>> 1] ?? 0);
export interface PopcountHooks { onByte?: (pos: number, cnt: number) => void; onResult?: (r: number) => void; }
export function popcountTbl(x: number, hooks: PopcountHooks = {}): number {
  let v = x >>> 0, sum = 0;
  for (let i = 0; i < 4; i++) {
    const byte = v & 0xff;
    const c = PC[byte]!;
    hooks.onByte?.(i, c);
    sum += c;
    v >>>= 8;
  }
  hooks.onResult?.(sum);
  return sum;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountTbl } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [7, 255, 256, 0x10101010, 0xffffffff];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '查表 popcount', en: 'Popcount lookup' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = popcountTbl(x, { onResult: (v) => out.push(v) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec.begin({ zh: 'popcount(' + b(x) + ')=' + r, en: 'popcount(' + b(x) + ')=' + r }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit();
  });
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { popcountTbl } from '../../src/algorithms/bitwise/bit-popcount-3/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-popcount-3/trace.ts';
test('popcountTbl 正确', () => {
  assert.equal(popcountTbl(0), 0);
  assert.equal(popcountTbl(7), 3);
  assert.equal(popcountTbl(255), 8);
  assert.equal(popcountTbl(256), 1);
  assert.equal(popcountTbl(0x10101010), 4);
  assert.equal(popcountTbl(0xffffffff), 32);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 10. bit-swap-2  —— XOR swap
ALGS.push({
  id: 'bit-swap-2',
  m: ['异或交换v2', 'XOR Swap v2', '不借助临时变量用三次异或交换两个变量。', 'Swap two variables with three XORs, no temp.',
    'a ^= b; b ^= a; a ^= b; 利用异或的自反性完成交换。注意：对同一内存位置（别名）会归零。', 'a^=b; b^=a; a^=b; uses self-inverse of XOR. Aliasing zeroes the value. O(1).', 'O(1)', 'O(1)', ['bitwise', 'swap', 'xor']],
  impl: `export interface XorSwapHooks { onStep?: (step: number, a: number, b: number) => void; }
export function xorSwap(a: number, b: number, hooks: XorSwapHooks = {}): [number, number] {
  let x = a | 0, y = b | 0;
  x = (x ^ y) | 0; hooks.onStep?.(1, x, y);
  y = (x ^ y) | 0; hooks.onStep?.(2, x, y);
  x = (x ^ y) | 0; hooks.onStep?.(3, x, y);
  return [x, y];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xorSwap } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[10, 25], [0, 7], [-3, 8]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '异或交换', en: 'XOR swap' }).commit();
  for (const [a0, b0] of input) {
    const [a, b] = xorSwap(a0, b0, { onStep: (s, x, y) => rec.begin({ zh: 'step ' + s + ': a=' + x + ' b=' + y, en: 'step ' + s + ': a=' + x + ' b=' + y }).setAux([{ label: 'a', value: String(x), role: 'pivot' as BarRole }, { label: 'b', value: String(y), role: 'frontier' as BarRole }]).commit() });
    rec.begin({ zh: '(' + a0 + ',' + b0 + ') → (' + a + ',' + b + ')', en: '(' + a0 + ',' + b0 + ') → (' + a + ',' + b + ')' }).setAux([{ label: '结果', value: a + ',' + b, role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xorSwap } from '../../src/algorithms/bitwise/bit-swap-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-swap-2/trace.ts';
test('xorSwap 正确', () => {
  const [a, b] = xorSwap(10, 25);
  assert.equal(a, 25);
  assert.equal(b, 10);
  const [c, d] = xorSwap(0, 7);
  assert.equal(c, 7);
  assert.equal(d, 0);
  const [e, f] = xorSwap(-3, 8);
  assert.equal(e, 8);
  assert.equal(f, -3);
});
test('xorSwap 钩子触发3次', () => {
  let n = 0;
  xorSwap(1, 2, { onStep: () => n++ });
  assert.equal(n, 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 11. bit-rotate-2  —— 循环移位 (双向)
ALGS.push({
  id: 'bit-rotate-2',
  m: ['循环移位v2', 'Bitwise Rotate v2', '32 位循环左/右移位，溢出位回填到另一端。', '32-bit rotation (rotl/rotr) wrapping overflow to the other end.',
    '左移 r 位：rotl = (x << r) | (x >>> (32-r))；右移类似。r 取 mod 32。', 'rotl(x,r) = (x<<r)|(x>>>(32-r)); rotr symmetric. O(1).', 'O(1)', 'O(1)', ['bitwise', 'rotate', 'rotl']],
  impl: `export interface RotateHooks { onShift?: (dir: 'left' | 'right', r: number) => void; onResult?: (v: number) => void; }
export function rotl(x: number, r: number, hooks: RotateHooks = {}): number {
  const n = ((r % 32) + 32) % 32;
  hooks.onShift?.('left', n);
  const v = (((x << n) | (x >>> (32 - n))) >>> 0);
  hooks.onResult?.(v);
  return v;
}
export function rotr(x: number, r: number, hooks: RotateHooks = {}): number {
  const n = ((r % 32) + 32) % 32;
  hooks.onShift?.('right', n);
  const v = (((x >>> n) | (x << (32 - n))) >>> 0);
  hooks.onResult?.(v);
  return v;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotl, rotr } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const x = 0b00001111;
  rec.begin({ zh: 'x = ' + b(x), en: 'x = ' + b(x) }).setAux([{ label: 'x', value: b(x), role: 'pivot' as BarRole }]).commit();
  const y = rotl(x, 4, { onResult: (v) => rec.begin({ zh: 'rotl 4 → ' + b(v), en: 'rotl 4 → ' + b(v) }).setAux([{ label: 'rotl4', value: b(v), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: 'rotl(0x0F,4)=0xF0', en: 'rotl(0x0F,4)=0xF0' }).setAux([{ label: '结果', value: b(y), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotl, rotr } from '../../src/algorithms/bitwise/bit-rotate-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-rotate-2/trace.ts';
test('rotl/rotr 正确', () => {
  assert.equal(rotl(0x0000FFFF, 8), 0x00FFFF00);
  assert.equal(rotr(0x0000FFFF, 8), 0xFF0000FF);
  assert.equal(rotl(0x12345678, 32), 0x12345678); // r mod 32 = 0
  assert.equal(rotl(0x12345678, 4), 0x23456781);
});
test('rotl 后 rotr 还原', () => {
  for (const x of [1, 0xdeadbeef, 0x12345678]) assert.equal(rotr(rotl(x, 13), 13), x >>> 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 12. bit-reverse-3  —— 字节内反转 4bit
ALGS.push({
  id: 'bit-reverse-3',
  m: ['4位反转', 'Nibble Bit-Reversal', '对 4 位组的二进制做位序反转。', 'Reverse the bit order of a 4-bit value.',
    '用掩码交错交换：先交换相邻 2 位，再交换相邻 1 位。0b1010 → 0b0101。', 'Swap adjacent bits then adjacent pairs: nibble 0b1010 -> 0b0101. O(1).', 'O(1)', 'O(1)', ['bitwise', 'reverse', 'nibble']],
  impl: `export interface RevNibbleHooks { onStep?: (v: number) => void; onResult?: (r: number) => void; }
export function reverseNibble(x: number, hooks: RevNibbleHooks = {}): number {
  let v = x & 0xf;
  v = ((v & 0b0011) << 2) | ((v & 0b1100) >>> 2); hooks.onStep?.(v);
  v = ((v & 0b0101) << 1) | ((v & 0b1010) >>> 1); hooks.onStep?.(v);
  hooks.onResult?.(v);
  return v;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reverseNibble } from './impl.ts';
const b = (n: number): string => (n & 0xf).toString(2).padStart(4, '0');
export const DEFAULT_INPUT = [0, 1, 5, 10, 15];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '4位反转', en: 'Nibble reversal' }).commit();
  for (const x of input) {
    const r = reverseNibble(x, { onStep: (v) => rec.begin({ zh: '中间 = ' + b(v), en: 'mid = ' + b(v) }).setAux([{ label: 'mid', value: b(v), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: b(x) + ' → ' + b(r), en: b(x) + ' → ' + b(r) }).setAux([{ label: '结果', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reverseNibble } from '../../src/algorithms/bitwise/bit-reverse-3/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-reverse-3/trace.ts';
test('reverseNibble 正确', () => {
  assert.equal(reverseNibble(0), 0);
  assert.equal(reverseNibble(1), 0b1000);
  assert.equal(reverseNibble(5), 0b1010);
  assert.equal(reverseNibble(10), 0b0101);
  assert.equal(reverseNibble(15), 15);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 13. bit-clear-lowest-2  —— 清除最低位的1
ALGS.push({
  id: 'bit-clear-lowest-2',
  m: ['清除最低位1', 'Clear Lowest Set Bit', '用 x & (x-1) 清除最低位的 1。', 'Clear the lowest set bit with x & (x-1).',
    'x-1 把最低位 1 变 0、其后 0 全变 1，相与即清除最低位 1。常用于 Brian Kernighan 计数法。', 'x & (x-1) clears the lowest set bit. O(1) per op.', 'O(1)', 'O(1)', ['bitwise', 'lowest-set-bit', 'kernighan']],
  impl: `export interface ClearLowHooks { onCleared?: (before: number, after: number) => void; }
export function clearLowestBit(x: number, hooks: ClearLowHooks = {}): number {
  const v = x | 0;
  const r = (v & (v - 1)) | 0;
  hooks.onCleared?.(v >>> 0, r >>> 0);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clearLowestBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b00110010, 0b10000000, 0b00010001, 1];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '清除最低位1', en: 'Clear lowest set bit' }).commit();
  for (const x of input) {
    const r = clearLowestBit(x, { onCleared: (before, after) => rec.begin({ zh: b(before) + ' & ' + b(before - 1) + ' = ' + b(after), en: b(before) + ' & (b-1) = ' + b(after) }).setAux([{ label: 'after', value: b(after), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: '结果 = ' + b(r), en: 'result = ' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clearLowestBit } from '../../src/algorithms/bitwise/bit-clear-lowest-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-clear-lowest-2/trace.ts';
test('clearLowestBit 正确', () => {
  assert.equal(clearLowestBit(0b00110010), 0b00110000);
  assert.equal(clearLowestBit(0b10000000), 0);
  assert.equal(clearLowestBit(0b00010001), 0b00010000);
  assert.equal(clearLowestBit(1), 0);
  assert.equal(clearLowestBit(0), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 14. bit-isolate-lowest-2  —— 提取最低位的1
ALGS.push({
  id: 'bit-isolate-lowest-2',
  m: ['提取最低位1', 'Isolate Lowest Set Bit', '用 x & -x 提取最低位的 1。', 'Isolate the lowest set bit with x & -x.',
    '-x = ~x + 1，只保留最低位的 1。可用于 Fenwick 树的 lowbit、判断 2 的幂等。', 'x & -x keeps only the lowest set bit (Fenwick lowbit). O(1).', 'O(1)', 'O(1)', ['bitwise', 'lowest-set-bit', 'fenwick']],
  impl: `export interface IsoLowHooks { onIsolate?: (iso: number) => void; }
export function isolateLowestBit(x: number, hooks: IsoLowHooks = {}): number {
  const v = x | 0;
  const r = (v & -v) >>> 0;
  hooks.onIsolate?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isolateLowestBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b00110010, 0b10000000, 0b00010001, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '提取最低位1', en: 'Isolate lowest set bit' }).commit();
  for (const x of input) {
    const r = isolateLowestBit(x, { onIsolate: (iso) => rec.begin({ zh: b(x) + ' & -' + x + ' = ' + b(iso), en: b(x) + ' & -x = ' + b(iso) }).setAux([{ label: 'lowbit', value: b(iso), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: 'lowbit = ' + b(r), en: 'lowbit = ' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isolateLowestBit } from '../../src/algorithms/bitwise/bit-isolate-lowest-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-isolate-lowest-2/trace.ts';
test('isolateLowestBit 正确', () => {
  assert.equal(isolateLowestBit(0b00110010), 0b00000010);
  assert.equal(isolateLowestBit(0b10000000), 0b10000000);
  assert.equal(isolateLowestBit(0b00010001), 1);
  assert.equal(isolateLowestBit(0), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 15. bit-mod-pow2-2  —— 对2的幂取模用位与
ALGS.push({
  id: 'bit-mod-pow2-2',
  m: ['2的幂取模v2', 'Modulo Power of Two v2', '用 x & (m-1) 替代 x % m（m 为2的幂）。', 'Replace x % m by x & (m-1) when m is a power of two.',
    '当 m=2^k，x mod m 等于 x 的低 k 位，可用掩码 (m-1) 按位与求得，无除法。', 'When m=2^k, x mod m = x & (m-1), avoiding division. O(1).', 'O(1)', 'O(1)', ['bitwise', 'modulo', 'optimization']],
  impl: `export interface ModPow2Hooks { onMask?: (mask: number) => void; onResult?: (r: number) => void; }
export function modPow2(x: number, m: number, hooks: ModPow2Hooks = {}): number {
  if ((m & (m - 1)) !== 0 || m <= 0) throw new RangeError('m 必须是正的 2 的幂');
  const mask = m - 1;
  hooks.onMask?.(mask);
  const r = (x | 0) & mask;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modPow2 } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[25, 8], [17, 16], [255, 64], [7, 4]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2的幂取模', en: 'Modulo power of two' }).commit();
  for (const [x, m] of input) {
    const r = modPow2(x, m, { onMask: (mask) => rec.begin({ zh: 'mask = ' + b(mask), en: 'mask = ' + b(mask) }).setAux([{ label: 'mask', value: b(mask), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: x + ' & ' + (m - 1) + ' = ' + r, en: x + ' & ' + (m - 1) + ' = ' + r }).setAux([{ label: 'mod', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modPow2 } from '../../src/algorithms/bitwise/bit-mod-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-mod-pow2-2/trace.ts';
test('modPow2 正确', () => {
  assert.equal(modPow2(25, 8), 1);
  assert.equal(modPow2(17, 16), 1);
  assert.equal(modPow2(255, 64), 63);
  assert.equal(modPow2(7, 4), 3);
  assert.equal(modPow2(8, 8), 0);
});
test('modPow2 非幂报错', () => {
  assert.throws(() => modPow2(10, 6), RangeError);
  assert.throws(() => modPow2(10, 0), RangeError);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 16. bit-div-pow2-2  —— 除以2的幂用右移
ALGS.push({
  id: 'bit-div-pow2-2',
  m: ['2的幂除法v2', 'Divide Power of Two v2', '用算术右移实现除以 2 的幂（向零取整）。', 'Signed divide by a power of two via arithmetic shift (round toward zero).',
    'x >> k 对正数即 x/2^k；对负数需修正偏置：先加 (2^k - 1) 再右移以实现向零取整。', 'For negatives add (2^k - 1) before >>k to round toward zero. O(1).', 'O(1)', 'O(1)', ['bitwise', 'division', 'optimization']],
  impl: `export interface DivPow2Hooks { onShift?: (k: number, biased: number) => void; onResult?: (r: number) => void; }
export function divPow2(x: number, k: number, hooks: DivPow2Hooks = {}): number {
  if (k < 0 || k > 31) throw new RangeError('k ∈ [0,31]');
  const v = x | 0;
  if (k === 0) { hooks.onResult?.(v); return v; }
  const bias = v < 0 ? (1 << k) - 1 : 0;
  const biased = (v + bias) | 0;
  hooks.onShift?.(k, biased);
  const r = biased >> k;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { divPow2 } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[100, 3], [-100, 3], [7, 1], [-8, 2]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2的幂除法', en: 'Divide by power of two' }).commit();
  for (const [x, k] of input) {
    const r = divPow2(x, k, { onShift: (kk, biased) => rec.begin({ zh: 'biased=' + biased + ' >> ' + kk, en: 'biased=' + biased + ' >> ' + kk }).setAux([{ label: 'biased', value: String(biased), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: x + ' / 2^' + k + ' = ' + r, en: x + ' / 2^' + k + ' = ' + r }).setAux([{ label: 'div', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { divPow2 } from '../../src/algorithms/bitwise/bit-div-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-div-pow2-2/trace.ts';
test('divPow2 正数正确', () => {
  assert.equal(divPow2(100, 3), 12);
  assert.equal(divPow2(7, 1), 3);
  assert.equal(divPow2(8, 0), 8);
});
test('divPow2 负数向零取整', () => {
  assert.equal(divPow2(-100, 3), -12); // 向零而非向下
  assert.equal(divPow2(-8, 2), -2);
  assert.equal(divPow2(-7, 1), -3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 17. bit-mul-pow2-2  —— 乘以2的幂用左移
ALGS.push({
  id: 'bit-mul-pow2-2',
  m: ['2的幂乘法v2', 'Multiply Power of Two v2', '用左移实现乘以 2 的幂。', 'Multiply by a power of two via left shift.',
    'x << k 等价于 x * 2^k（受 32 位环绕）。k 取 mod 32。', 'x << k equals x * 2^k (32-bit wraparound). O(1).', 'O(1)', 'O(1)', ['bitwise', 'multiplication', 'optimization']],
  impl: `export interface MulPow2Hooks { onShift?: (k: number) => void; onResult?: (r: number) => void; }
export function mulPow2(x: number, k: number, hooks: MulPow2Hooks = {}): number {
  const n = ((k % 32) + 32) % 32;
  hooks.onShift?.(n);
  const r = ((x | 0) << n) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mulPow2 } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[3, 4], [1, 8], [-1, 2], [5, 0]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2的幂乘法', en: 'Multiply by power of two' }).commit();
  for (const [x, k] of input) {
    const r = mulPow2(x, k, { onShift: (n) => rec.begin({ zh: '<< ' + n, en: '<< ' + n }).setAux([{ label: 'shift', value: String(n), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: x + ' * 2^' + k + ' = ' + r, en: x + ' * 2^' + k + ' = ' + r }).setAux([{ label: 'mul', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulPow2 } from '../../src/algorithms/bitwise/bit-mul-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-mul-pow2-2/trace.ts';
test('mulPow2 正确', () => {
  assert.equal(mulPow2(3, 4), 48);
  assert.equal(mulPow2(1, 8), 256);
  assert.equal(mulPow2(-1, 2), -4);
  assert.equal(mulPow2(5, 0), 5);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 18. bit-add-2  —— 用位运算实现加法（半加器/全加器）
ALGS.push({
  id: 'bit-add-2',
  m: ['位运算加法', 'Addition via Bit Ops', '用 XOR（本位和）与 AND（进位）迭代模拟加法。', 'Iterative half/full adder: XOR for sum, AND<<1 for carry.',
    '无进位和 = a^b，进位 = (a&b)<<1；反复令 (a,b)=(sum, carry) 直到 carry=0。', 'sum=a^b, carry=(a&b)<<1; repeat until carry=0. O(log n).', 'O(log bits)', 'O(1)', ['bitwise', 'addition', 'half-adder']],
  impl: `export interface BitAddHooks { onIter?: (i: number, a: number, b: number) => void; }
export function addBit(a: number, b: number, hooks: BitAddHooks = {}): number {
  let x = a | 0, y = b | 0, i = 0;
  while (y !== 0) {
    hooks.onIter?.(i, x >>> 0, y >>> 0);
    const sum = (x ^ y) | 0;
    const carry = ((x & y) << 1) | 0;
    x = sum; y = carry; i++;
  }
  return x;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { addBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[13, 22], [0, 7], [255, 1]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位运算加法', en: 'Bit addition' }).commit();
  for (const [a, c] of input) {
    const r = addBit(a, c, { onIter: (i, x, y) => rec.begin({ zh: '迭代' + i + ': sum=' + b(x) + ' carry=' + b(y), en: 'iter ' + i + ': sum=' + b(x) + ' carry=' + b(y) }).setAux([{ label: 'sum', value: b(x), role: 'pivot' as BarRole }, { label: 'carry', value: b(y), role: 'frontier' as BarRole }]).commit() });
    rec.begin({ zh: a + ' + ' + c + ' = ' + r, en: a + ' + ' + c + ' = ' + r }).setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addBit } from '../../src/algorithms/bitwise/bit-add-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-add-2/trace.ts';
test('addBit 正确', () => {
  assert.equal(addBit(13, 22), 35);
  assert.equal(addBit(0, 7), 7);
  assert.equal(addBit(255, 1), 256);
  assert.equal(addBit(-5, 3), -2);
  assert.equal(addBit(100, 200), 300);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 19. bit-and-range-2  —— 区间按位与 [m,n]
ALGS.push({
  id: 'bit-and-range-2',
  m: ['区间按位与v2', 'Bitwise AND of Range v2', '求 [m, n] 内所有整数的按位与。', 'Bitwise AND of all integers in [m, n].',
    '当 m<n 时，最低位必然出现过 0 与 1，按位与后该位为 0；右移 m,n 直到相等，再左移补回。', 'AND over a range: shared prefix of m and n. O(log n).', 'O(log bits)', 'O(1)', ['bitwise', 'range', 'and']],
  impl: `export interface AndRangeHooks { onShift?: (shift: number, m: number, n: number) => void; }
export function rangeAnd(m: number, n: number, hooks: AndRangeHooks = {}): number {
  let shift = 0;
  let a = m | 0, b = n | 0;
  while (a !== b) {
    a >>>= 1; b >>>= 1; shift++;
    hooks.onShift?.(shift, a, b);
  }
  return (a << shift) | 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeAnd } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[5, 7], [12, 15], [16, 19], [10, 10]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间按位与', en: 'Range bitwise AND' }).commit();
  for (const [m, n] of input) {
    const r = rangeAnd(m, n, { onShift: (s, a, c) => rec.begin({ zh: 'shift ' + s + ': ' + b(a) + ' / ' + b(c), en: 'shift ' + s + ': ' + b(a) + ' / ' + b(c) }).setAux([{ label: 'm', value: b(a), role: 'pivot' as BarRole }, { label: 'n', value: b(c), role: 'frontier' as BarRole }]).commit() });
    rec.begin({ zh: '[' + m + ',' + n + '] AND = ' + r, en: '[' + m + ',' + n + '] AND = ' + r }).setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeAnd } from '../../src/algorithms/bitwise/bit-and-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-and-range-2/trace.ts';
test('rangeAnd 正确', () => {
  assert.equal(rangeAnd(5, 7), 4);
  assert.equal(rangeAnd(12, 15), 12);
  assert.equal(rangeAnd(16, 19), 16);
  assert.equal(rangeAnd(10, 10), 10);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 20. bit-or-range-2  —— 区间按位或 [m,n]
ALGS.push({
  id: 'bit-or-range-2',
  m: ['区间按位或v2', 'Bitwise OR of Range v2', '求 [m, n] 内所有整数的按位或。', 'Bitwise OR of all integers in [m, n].',
    '从低到高：只要 m 与 n 不等的位段，期间必然出现过 1，结果该段全为 1。等价于 m | (m+1) | ... | n 的公共填充。', 'OR over a range fills the gap bits between m and n with 1s. O(log n).', 'O(log bits)', 'O(1)', ['bitwise', 'range', 'or']],
  impl: `export interface OrRangeHooks { onFill?: (val: number) => void; }
export function rangeOr(m: number, n: number, hooks: OrRangeHooks = {}): number {
  let a = m | 0, b = n | 0;
  while (a < b) {
    a |= (a + 1);
    hooks.onFill?.(a >>> 0);
  }
  return a | 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeOr } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[5, 7], [8, 11], [16, 23], [9, 9]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间按位或', en: 'Range bitwise OR' }).commit();
  for (const [m, n] of input) {
    const r = rangeOr(m, n, { onFill: (val) => rec.begin({ zh: 'fill = ' + b(val), en: 'fill = ' + b(val) }).setAux([{ label: 'val', value: b(val), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: '[' + m + ',' + n + '] OR = ' + r, en: '[' + m + ',' + n + '] OR = ' + r }).setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeOr } from '../../src/algorithms/bitwise/bit-or-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-or-range-2/trace.ts';
test('rangeOr 正确', () => {
  assert.equal(rangeOr(5, 7), 7);
  assert.equal(rangeOr(8, 11), 15);
  assert.equal(rangeOr(16, 23), 31);
  assert.equal(rangeOr(9, 9), 9);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 21. bit-xor-range-2  —— 区间异或前缀 [0,n]
ALGS.push({
  id: 'bit-xor-range-2',
  m: ['区间异或v2', 'XOR of Range v2', '由前缀异或模式 O(1) 求 [m,n] 异或。', 'Compute XOR over [m, n] using the n-mod-4 prefix pattern.',
    'xor(0..n) 依 n%4 取值：n, 1, n+1, 0。区间 [m,n] = xor(0..n) ^ xor(0..m-1)。', 'xor(0..n) follows an n%4 pattern; [m,n] = f(n) ^ f(m-1). O(1).', 'O(1)', 'O(1)', ['bitwise', 'range', 'xor']],
  impl: `export interface XorRangeHooks { onPrefix?: (n: number, val: number) => void; }
function prefix(n: number): number {
  const r = ((n % 4) + 4) % 4;
  if (r === 0) return n;
  if (r === 1) return 1;
  if (r === 2) return n + 1;
  return 0;
}
export function rangeXor(m: number, n: number, hooks: XorRangeHooks = {}): number {
  const fn = prefix(n);
  const fm = prefix(m - 1);
  hooks.onPrefix?.(n, fn);
  hooks.onPrefix?.(m - 1, fm);
  return (fn ^ fm) | 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeXor } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[3, 5], [0, 7], [10, 15], [4, 4]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间异或', en: 'Range XOR' }).commit();
  for (const [m, n] of input) {
    const r = rangeXor(m, n, { onPrefix: (nn, val) => rec.begin({ zh: 'f(' + nn + ')=' + val, en: 'f(' + nn + ')=' + val }).setAux([{ label: 'f(n)', value: String(val), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: '[' + m + ',' + n + '] XOR = ' + r, en: '[' + m + ',' + n + '] XOR = ' + r }).setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeXor } from '../../src/algorithms/bitwise/bit-xor-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-xor-range-2/trace.ts';
const brute = (m: number, n: number) => { let r = 0; for (let i = m; i <= n; i++) r ^= i; return r; };
test('rangeXor 与暴力一致', () => {
  for (const [m, n] of [[3,5],[0,7],[10,15],[4,4],[1,100],[50,99]] as const) assert.equal(rangeXor(m, n), brute(m, n));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 22. bit-highest-set-2  —— 提取最高位的1
ALGS.push({
  id: 'bit-highest-set-2',
  m: ['提取最高位1', 'Highest Set Bit', '返回仅保留最高位 1 的值（即最大的 2 的幂 ≤ x）。', 'Keep only the highest set bit (largest power of two ≤ x).',
    '用「填充」把最高位以下全置 1，再 (v >> 1) + 1 得到仅含最高位的值。x=0 时返回 0。', 'Propagate then shift: isolates the MSB. O(1).', 'O(1)', 'O(1)', ['bitwise', 'msb', 'highest-set-bit']],
  impl: `export interface HighSetHooks { onFill?: (filled: number) => void; onResult?: (r: number) => void; }
export function highestSetBit(x: number, hooks: HighSetHooks = {}): number {
  let v = x | 0;
  if (v <= 0) { hooks.onResult?.(0); return 0; }
  v = v >>> 0;
  v |= v >>> 1; v |= v >>> 2; v |= v >>> 4; v |= v >>> 8; v |= v >>> 16;
  hooks.onFill?.(v >>> 0);
  const r = ((v >>> 1) + 1) >>> 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { highestSetBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [1, 5, 16, 255, 1000, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '提取最高位1', en: 'Highest set bit' }).commit();
  for (const x of input) {
    const r = highestSetBit(x, { onFill: (f) => rec.begin({ zh: 'filled = ' + b(f), en: 'filled = ' + b(f) }).setAux([{ label: 'filled', value: b(f), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'MSB(' + x + ')=' + b(r), en: 'MSB(' + x + ')=' + b(r) }).setAux([{ label: 'msb', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highestSetBit } from '../../src/algorithms/bitwise/bit-highest-set-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-highest-set-2/trace.ts';
test('highestSetBit 正确', () => {
  assert.equal(highestSetBit(1), 1);
  assert.equal(highestSetBit(5), 4);
  assert.equal(highestSetBit(16), 16);
  assert.equal(highestSetBit(255), 128);
  assert.equal(highestSetBit(1000), 512);
  assert.equal(highestSetBit(0), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 23. bit-lowest-set-2  —— 提取最低位的1
ALGS.push({
  id: 'bit-lowest-set-2',
  m: ['提取最低位1v2', 'Lowest Set Bit v2', '返回仅保留最低位 1 的值，x & -x。', 'Isolate the lowest set bit: x & -x.',
    '-x = ~x+1，只保留最低位的 1。x=0 返回 0。', 'x & -x returns the lowest set bit value. O(1).', 'O(1)', 'O(1)', ['bitwise', 'lsb', 'lowest-set-bit']],
  impl: `export interface LowSetHooks { onResult?: (r: number) => void; }
export function lowestSetBit(x: number, hooks: LowSetHooks = {}): number {
  const r = ((x | 0) & -(x | 0)) >>> 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lowestSetBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b10100, 0b10000, 0b11, 1, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '提取最低位1', en: 'Lowest set bit' }).commit();
  for (const x of input) {
    const r = lowestSetBit(x, { onResult: (v) => rec.begin({ zh: b(x) + ' & -x = ' + b(v), en: b(x) + ' & -x = ' + b(v) }).setAux([{ label: 'lsb', value: b(v), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: 'LSB=' + b(r), en: 'LSB=' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowestSetBit } from '../../src/algorithms/bitwise/bit-lowest-set-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-lowest-set-2/trace.ts';
test('lowestSetBit 正确', () => {
  assert.equal(lowestSetBit(0b10100), 0b100);
  assert.equal(lowestSetBit(0b10000), 16);
  assert.equal(lowestSetBit(0b11), 1);
  assert.equal(lowestSetBit(1), 1);
  assert.equal(lowestSetBit(0), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 24. bit-parity-2  —— 用查表 popcount 取奇偶
ALGS.push({
  id: 'bit-parity-2',
  m: ['奇偶校验v2', 'Parity v2', '基于 de Bruijn 查表判定 1 的个数奇偶。', 'Parity via byte-fold then de Bruijn lookup.',
    '把 32 位折半异或到 4 位，查 16 项表得奇偶。返回 0(偶)/1(奇)。', 'XOR-fold to 4 bits then lookup 16-entry parity table. O(1).', 'O(1)', 'O(1)', ['bitwise', 'parity']],
  impl: `const PT: number[] = [0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0];
export interface ParityHooks2 { onFold?: (v: number) => void; onResult?: (p: number) => void; }
export function parityLookup(x: number, hooks: ParityHooks2 = {}): number {
  let v = x >>> 0;
  v ^= v >>> 16; hooks.onFold?.(v);
  v ^= v >>> 8; hooks.onFold?.(v);
  v ^= v >>> 4; hooks.onFold?.(v);
  const r = PT[v & 0xf]!;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parityLookup } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [7, 12, 255, 256, 0x3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '查表奇偶', en: 'Parity lookup' }).commit();
  for (const x of input) {
    const r = parityLookup(x, { onFold: (v) => rec.begin({ zh: 'fold → ' + b(v), en: 'fold → ' + b(v) }).setAux([{ label: 'fold', value: b(v), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'parity(' + x + ')=' + r, en: 'parity(' + x + ')=' + r }).setAux([{ label: 'parity', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parityLookup } from '../../src/algorithms/bitwise/bit-parity-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-parity-2/trace.ts';
const ref = (x: number) => { let c = 0, v = x >>> 0; while (v) { c ^= v & 1; v >>>= 1; } return c; };
test('parityLookup 正确', () => {
  assert.equal(parityLookup(7), 1);
  assert.equal(parityLookup(12), 0);
  assert.equal(parityLookup(255), 0);
  assert.equal(parityLookup(256), 1);
});
test('parityLookup 与逐位一致', () => {
  for (let x = 0; x < 5000; x++) assert.equal(parityLookup(x), ref(x));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 25. bit-gray-code-2  —— 二进制转格雷码
ALGS.push({
  id: 'bit-gray-code-2',
  m: ['二进制转格雷码', 'Binary to Gray', 'gray = x ^ (x >> 1)。', 'Convert binary to Gray code: gray = x ^ (x >> 1).',
    '格雷码相邻整数只有一位不同：g = b ^ (b >> 1)。', 'gray = x ^ (x >> 1); adjacent codes differ by one bit. O(1).', 'O(1)', 'O(1)', ['bitwise', 'gray-code']],
  impl: `export interface GrayHooks { onResult?: (g: number) => void; }
export function toGray(x: number, hooks: GrayHooks = {}): number {
  const g = ((x | 0) ^ ((x | 0) >>> 1)) >>> 0;
  hooks.onResult?.(g);
  return g;
}
export function fromGray(g: number): number {
  let b = g >>> 0;
  let mask = b >>> 1;
  while (mask !== 0) { b = b ^ mask; mask = mask >>> 1; }
  return b >>> 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { toGray } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(4, '0');
export const DEFAULT_INPUT = [0, 1, 2, 3, 4, 5, 6, 7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二进制→格雷码', en: 'Binary to Gray' }).commit();
  for (const x of input) {
    const g = toGray(x);
    rec.begin({ zh: b(x) + ' → ' + b(g), en: b(x) + ' → ' + b(g) }).setAux([{ label: 'bin', value: b(x), role: 'pivot' as BarRole }, { label: 'gray', value: b(g), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toGray, fromGray } from '../../src/algorithms/bitwise/bit-gray-code-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-gray-code-2/trace.ts';
test('toGray 正确', () => {
  assert.equal(toGray(0), 0);
  assert.equal(toGray(1), 1);
  assert.equal(toGray(2), 3);
  assert.equal(toGray(3), 2);
  assert.equal(toGray(4), 6);
});
test('toGray/fromGray 互逆', () => {
  for (let x = 0; x < 1000; x++) assert.equal(fromGray(toGray(x)), x);
});
test('相邻格雷码仅差1位', () => {
  const cnt = (n: number) => { let c = 0, v = n >>> 0; while (v) { c += v & 1; v >>>= 1; } return c; };
  for (let x = 0; x < 100; x++) assert.equal(cnt(toGray(x) ^ toGray(x + 1)), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 26. bit-reverse-bytes-2  —— 32位字节序反转
ALGS.push({
  id: 'bit-reverse-bytes-2',
  m: ['字节序反转v2', 'Reverse Byte Order v2', '交换 32 位整数的 4 个字节顺序（端序翻转）。', 'Swap the four bytes of a 32-bit integer (endianness flip).',
    '通过掩码 + 移位交换字节：((x&0xFF)<<24)|((x&0xFF00)<<8)|((x>>>8)&0xFF00)|(x>>>24)。', 'Swap four bytes via masks and shifts. O(1).', 'O(1)', 'O(1)', ['bitwise', 'endian', 'byteswap']],
  impl: `export interface BSwapHooks { onResult?: (v: number) => void; }
export function bswap32(x: number, hooks: BSwapHooks = {}): number {
  const v = x >>> 0;
  const r = (((v & 0xff) << 24) | ((v & 0xff00) << 8) | ((v >>> 8) & 0xff00) | (v >>> 24)) >>> 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bswap32 } from './impl.ts';
const h = (n: number): string => '0x' + (n >>> 0).toString(16).padStart(8, '0');
export const DEFAULT_INPUT = [0x12345678, 0x000000FF, 0xFF000000, 0xDEADBEEF];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '字节序反转', en: 'Byte swap' }).commit();
  for (const x of input) {
    const r = bswap32(x, { onResult: (v) => rec.begin({ zh: h(x) + ' → ' + h(v), en: h(x) + ' → ' + h(v) }).setAux([{ label: 'bswap', value: h(v), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: '结果 ' + h(r), en: 'result ' + h(r) }).setAux([{ label: 'result', value: h(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bswap32 } from '../../src/algorithms/bitwise/bit-reverse-bytes-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-reverse-bytes-2/trace.ts';
test('bswap32 正确', () => {
  assert.equal(bswap32(0x12345678), 0x78563412);
  assert.equal(bswap32(0x000000FF), 0xFF000000);
  assert.equal(bswap32(0xFF000000), 0x000000FF);
  assert.equal(bswap32(0xDEADBEEF), 0xEFBEADDE);
});
test('bswap32 自逆', () => {
  for (const x of [0x12345678, 0xDEADBEEF, 0x00FF00FF]) assert.equal(bswap32(bswap32(x)), x >>> 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 27. bit-swap-nibbles-2  —— 交换低8位的高低4位
ALGS.push({
  id: 'bit-swap-nibbles-2',
  m: ['交换半字节v2', 'Swap Nibbles v2', '交换一个字节的高 4 位与低 4 位。', 'Swap the upper and lower nibble of a byte.',
    '((x & 0x0F) << 4) | ((x & 0xF0) >> 4)。', 'Swap the two nibbles of a byte. O(1).', 'O(1)', 'O(1)', ['bitwise', 'nibble', 'swap']],
  impl: `export interface NibbleSwapHooks { onResult?: (v: number) => void; }
export function swapNibbles(x: number, hooks: NibbleSwapHooks = {}): number {
  const v = x & 0xff;
  const r = (((v & 0x0f) << 4) | ((v & 0xf0) >>> 4)) & 0xff;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { swapNibbles } from './impl.ts';
const h = (n: number): string => '0x' + (n & 0xff).toString(16).padStart(2, '0');
export const DEFAULT_INPUT = [0xAB, 0x12, 0xF0, 0x0F];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '交换半字节', en: 'Swap nibbles' }).commit();
  for (const x of input) {
    const r = swapNibbles(x, { onResult: (v) => rec.begin({ zh: h(x) + ' → ' + h(v), en: h(x) + ' → ' + h(v) }).setAux([{ label: 'swapped', value: h(v), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: '结果 ' + h(r), en: 'result ' + h(r) }).setAux([{ label: 'result', value: h(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swapNibbles } from '../../src/algorithms/bitwise/bit-swap-nibbles-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-swap-nibbles-2/trace.ts';
test('swapNibbles 正确', () => {
  assert.equal(swapNibbles(0xAB), 0xBA);
  assert.equal(swapNibbles(0x12), 0x21);
  assert.equal(swapNibbles(0xF0), 0x0F);
  assert.equal(swapNibbles(0x0F), 0xF0);
});
test('swapNibbles 自逆', () => {
  for (const x of [0xAB, 0x12, 0xF0]) assert.equal(swapNibbles(swapNibbles(x)), x);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 28. bit-count-diff-2  —— 计算两数不同位的个数 (Hamming)
ALGS.push({
  id: 'bit-count-diff-2',
  m: ['汉明距离v2', 'Hamming Distance v2', '统计两整数二进制不同位的个数。', 'Count differing bit positions of two integers.',
    'diff = a ^ b，再对 diff 做 popcount。', 'popcount of a XOR b. O(1).', 'O(1)', 'O(1)', ['bitwise', 'hamming', 'distance']],
  impl: `export interface HammingHooks { onXor?: (d: number) => void; onResult?: (c: number) => void; }
export function hamming(a: number, b: number, hooks: HammingHooks = {}): number {
  const d = (a ^ b) >>> 0;
  hooks.onXor?.(d);
  let v = d, c = 0;
  while (v) { v &= v - 1; c++; }
  hooks.onResult?.(c);
  return c;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hamming } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[1, 4], [7, 10], [0, 0], [255, 0]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '汉明距离', en: 'Hamming distance' }).commit();
  for (const [a, c] of input) {
    const r = hamming(a, c, { onXor: (d) => rec.begin({ zh: 'xor = ' + b(d), en: 'xor = ' + b(d) }).setAux([{ label: 'xor', value: b(d), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'hamming(' + a + ',' + c + ')=' + r, en: 'hamming(' + a + ',' + c + ')=' + r }).setAux([{ label: 'dist', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hamming } from '../../src/algorithms/bitwise/bit-count-diff-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-count-diff-2/trace.ts';
test('hamming 正确', () => {
  assert.equal(hamming(1, 4), 2);
  assert.equal(hamming(7, 10), 3);
  assert.equal(hamming(0, 0), 0);
  assert.equal(hamming(255, 0), 8);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 29. bit-set-bit-2  —— 把指定位置1
ALGS.push({
  id: 'bit-set-bit-2',
  m: ['置位v2', 'Set Bit v2', '把第 i 位置 1：x | (1 << i)。', 'Set bit i: x | (1 << i).',
    '用按位或把第 i 位置 1。i ∈ [0,31]。', 'OR with (1<<i). O(1).', 'O(1)', 'O(1)', ['bitwise', 'set-bit']],
  impl: `export interface SetBitHooks { onMask?: (mask: number) => void; onResult?: (v: number) => void; }
export function setBit(x: number, i: number, hooks: SetBitHooks = {}): number {
  const mask = (1 << i) >>> 0;
  hooks.onMask?.(mask);
  const r = ((x | 0) | mask) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { setBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[0, 0], [0, 3], [0b1010, 1], [0b1000, 2]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '置位', en: 'Set bit' }).commit();
  for (const [x, i] of input) {
    const r = setBit(x, i, { onMask: (m) => rec.begin({ zh: 'mask = ' + b(m), en: 'mask = ' + b(m) }).setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: b(x) + ' → ' + b(r), en: b(x) + ' → ' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setBit } from '../../src/algorithms/bitwise/bit-set-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-set-bit-2/trace.ts';
test('setBit 正确', () => {
  assert.equal(setBit(0, 0), 1);
  assert.equal(setBit(0, 3), 8);
  assert.equal(setBit(0b1010, 1), 0b1010);
  assert.equal(setBit(0b1000, 2), 0b1100);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 30. bit-clear-bit-2  —— 把指定位清0
ALGS.push({
  id: 'bit-clear-bit-2',
  m: ['清位v2', 'Clear Bit v2', '把第 i 位清 0：x & ~(1 << i)。', 'Clear bit i: x & ~(1 << i).',
    '用按位与掩码的反码清掉第 i 位。', 'AND with ~(1<<i). O(1).', 'O(1)', 'O(1)', ['bitwise', 'clear-bit']],
  impl: `export interface ClearBitHooks { onMask?: (mask: number) => void; onResult?: (v: number) => void; }
export function clearBit(x: number, i: number, hooks: ClearBitHooks = {}): number {
  const mask = ~(1 << i);
  hooks.onMask?.(mask >>> 0);
  const r = ((x | 0) & mask) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clearBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[0b1111, 0], [0b1010, 3], [0b1000, 3], [0xFF, 4]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '清位', en: 'Clear bit' }).commit();
  for (const [x, i] of input) {
    const r = clearBit(x, i, { onMask: (m) => rec.begin({ zh: '~(1<<' + i + ') = ' + b(m), en: '~(1<<' + i + ') = ' + b(m) }).setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: b(x) + ' → ' + b(r), en: b(x) + ' → ' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clearBit } from '../../src/algorithms/bitwise/bit-clear-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-clear-bit-2/trace.ts';
test('clearBit 正确', () => {
  assert.equal(clearBit(0b1111, 0), 0b1110);
  assert.equal(clearBit(0b1010, 3), 0b0010);
  assert.equal(clearBit(0b1000, 3), 0);
  assert.equal(clearBit(0xFF, 4), 0xEF);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 31. bit-toggle-bit-2  —— 翻转指定位
ALGS.push({
  id: 'bit-toggle-bit-2',
  m: ['翻转位v2', 'Toggle Bit v2', '翻转第 i 位：x ^ (1 << i)。', 'Toggle bit i: x ^ (1 << i).',
    '异或 (1<<i) 翻转第 i 位：0 变 1，1 变 0。', 'XOR with (1<<i) flips bit i. O(1).', 'O(1)', 'O(1)', ['bitwise', 'toggle', 'xor']],
  impl: `export interface ToggleHooks { onMask?: (m: number) => void; onResult?: (v: number) => void; }
export function toggleBit(x: number, i: number, hooks: ToggleHooks = {}): number {
  const mask = (1 << i) >>> 0;
  hooks.onMask?.(mask);
  const r = ((x | 0) ^ mask) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { toggleBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[0b1010, 0], [0b1010, 3], [0, 5], [0xFF, 7]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '翻转位', en: 'Toggle bit' }).commit();
  for (const [x, i] of input) {
    const r = toggleBit(x, i, { onMask: (m) => rec.begin({ zh: 'mask = ' + b(m), en: 'mask = ' + b(m) }).setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: b(x) + ' → ' + b(r), en: b(x) + ' → ' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toggleBit } from '../../src/algorithms/bitwise/bit-toggle-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-toggle-bit-2/trace.ts';
test('toggleBit 正确', () => {
  assert.equal(toggleBit(0b1010, 0), 0b1011);
  assert.equal(toggleBit(0b1010, 3), 0b0010);
  assert.equal(toggleBit(0, 5), 32);
  assert.equal(toggleBit(0xFF, 7), 0x7F);
});
test('toggleBit 二次还原', () => {
  for (const x of [0b1010, 0xFF]) for (const i of [0,3,7]) assert.equal(toggleBit(toggleBit(x, i), i), x);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 32. bit-test-bit-2  —— 测试某位是否为1
ALGS.push({
  id: 'bit-test-bit-2',
  m: ['测试位v2', 'Test Bit v2', '测试第 i 位是否为 1：(x >> i) & 1。', 'Test bit i: (x >> i) & 1.',
    '右移 i 位后取最低位。', '(x >>> i) & 1. O(1).', 'O(1)', 'O(1)', ['bitwise', 'test-bit']],
  impl: `export interface TestBitHooks { onResult?: (v: boolean) => void; }
export function testBit(x: number, i: number, hooks: TestBitHooks = {}): boolean {
  const r = (((x >>> i) & 1) === 1);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { testBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [[0b1010, 1], [0b1010, 0], [0xFF, 3], [0, 4]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '测试位', en: 'Test bit' }).commit();
  for (const [x, i] of input) {
    const r = testBit(x, i);
    rec.begin({ zh: 'bit ' + i + ' of ' + b(x) + ' = ' + r, en: 'bit ' + i + ' of ' + b(x) + ' = ' + r }).setAux([{ label: 'bit' + i, value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testBit } from '../../src/algorithms/bitwise/bit-test-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-test-bit-2/trace.ts';
test('testBit 正确', () => {
  assert.equal(testBit(0b1010, 1), true);
  assert.equal(testBit(0b1010, 0), false);
  assert.equal(testBit(0xFF, 3), true);
  assert.equal(testBit(0, 4), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 33. bit-interleave-2  —— 交错两个16位得到32位 (Morton/Z-order)
ALGS.push({
  id: 'bit-interleave-2',
  m: ['位交错v2', 'Bit Interleave (Morton) v2', '把两个 16 位整数交错成 32 位（Morton 码）。', 'Interleave bits of two 16-bit values into a 32-bit Morton code.',
    '用掩码 + 移位的「扩散」逐级把 x 与 y 的位铺开，再合并。常用于空间索引（Z 序）。', 'Spread-and-merge to interleave bits (Z-order curve). O(log bits).', 'O(log bits)', 'O(1)', ['bitwise', 'morton', 'interleave']],
  impl: `function spread(v: number): number {
  let x = v & 0xffff;
  x = (x | (x << 8)) & 0x00FF00FF;
  x = (x | (x << 4)) & 0x0F0F0F0F;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;
  return x >>> 0;
}
export interface InterleaveHooks { onSpread?: (sx: number, sy: number) => void; onResult?: (r: number) => void; }
export function interleave(x: number, y: number, hooks: InterleaveHooks = {}): number {
  const sx = spread(x);
  const sy = spread(y);
  hooks.onSpread?.(sx, sy);
  const r = (sx | (sy << 1)) >>> 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interleave } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0');
export const DEFAULT_INPUT: Array<[number, number]> = [[1, 1], [3, 3], [0, 7]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位交错', en: 'Bit interleave' }).commit();
  for (const [x, y] of input) {
    const r = interleave(x, y, { onSpread: (sx, sy) => rec.begin({ zh: 'spread x=' + b(sx) + ' y=' + b(sy), en: 'spread' }).setAux([{ label: 'sx', value: b(sx), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'interleave(' + x + ',' + y + ')=' + r, en: 'interleave(' + x + ',' + y + ')=' + r }).setAux([{ label: 'morton', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interleave } from '../../src/algorithms/bitwise/bit-interleave-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-interleave-2/trace.ts';
test('interleave 正确', () => {
  assert.equal(interleave(1, 1), 0b11);
  assert.equal(interleave(3, 3), 0b1111);
  assert.equal(interleave(0, 7), 0b101010);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 34. bit-popcount-range-2  —— 区间内 1 的个数之和
ALGS.push({
  id: 'bit-popcount-range-2',
  m: ['区间popcount和', 'Popcount Sum over Range', '求 [m, n] 内所有整数 popcount 之和。', 'Sum of popcount over all integers in [m, n].',
    '暴力累加每个数的 popcount（教学用）。', 'Sum popcount of each integer in [m, n]. O((n-m) log n).', 'O((n-m) log n)', 'O(1)', ['bitwise', 'popcount', 'range']],
  impl: `export interface PopRangeHooks { onValue?: (x: number, c: number) => void; }
function pc(x: number): number { let v = x >>> 0, c = 0; while (v) { v &= v - 1; c++; } return c; }
export function popcountRange(m: number, n: number, hooks: PopRangeHooks = {}): number {
  let sum = 0;
  for (let x = m; x <= n; x++) {
    const c = pc(x);
    sum += c;
    hooks.onValue?.(x, c);
  }
  return sum;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountRange } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[0, 7], [1, 4], [5, 5]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间popcount和', en: 'Popcount range sum' }).commit();
  for (const [m, n] of input) {
    const vals: Array<[number, number]> = [];
    const r = popcountRange(m, n, { onValue: (x, c) => vals.push([x, c]) });
    rec.begin({ zh: 'sum pc([' + m + ',' + n + ']) = ' + r, en: 'sum pc([' + m + ',' + n + ']) = ' + r })
      .setBars(vals.map(([x, c]) => ({ value: c, role: 'final' as BarRole, label: String(x) }))).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { popcountRange } from '../../src/algorithms/bitwise/bit-popcount-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-popcount-range-2/trace.ts';
test('popcountRange 正确', () => {
  assert.equal(popcountRange(0, 7), 12); // 0+1+1+2+1+2+2+3
  assert.equal(popcountRange(1, 4), 5);  // 1+1+2+1
  assert.equal(popcountRange(5, 5), 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 35. bit-is-pow4-2  —— 判断4的幂
ALGS.push({
  id: 'bit-is-pow4-2',
  m: ['4的幂判定v2', 'Power of Four v2', '判断是否为 4 的幂：2的幂且唯一1位在偶数位。', 'A power of four: a power of two with its set bit at an even index.',
    '先 isPow2(x)，再 (x & 0x55555555) !== 0（4的幂的 1 必在偶数位）。', 'Power of two AND has set bit in even position (mask 0x55555555). O(1).', 'O(1)', 'O(1)', ['bitwise', 'power-of-four']],
  impl: `export interface IsPow4Hooks { onResult?: (r: boolean) => void; }
export function isPow4Bit(x: number, hooks: IsPow4Hooks = {}): boolean {
  const v = x | 0;
  const r = v > 0 && (v & (v - 1)) === 0 && (v & 0x55555555) !== 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPow4Bit } from './impl.ts';
export const DEFAULT_INPUT = [0, 1, 2, 4, 8, 16, 64, 256];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '4的幂判定', en: 'Power of four check' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  input.forEach((x, i) => {
    const r = isPow4Bit(x);
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = (r ? 'final' : 'warn') as BarRole;
    rec.begin({ zh: 'isPow4(' + x + ')=' + r, en: 'isPow4(' + x + ')=' + r }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit();
  });
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPow4Bit } from '../../src/algorithms/bitwise/bit-is-pow4-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-is-pow4-2/trace.ts';
test('isPow4Bit 正确', () => {
  assert.equal(isPow4Bit(0), false);
  assert.equal(isPow4Bit(1), true);
  assert.equal(isPow4Bit(2), false);
  assert.equal(isPow4Bit(4), true);
  assert.equal(isPow4Bit(8), false);
  assert.equal(isPow4Bit(16), true);
  assert.equal(isPow4Bit(64), true);
  assert.equal(isPow4Bit(256), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 36. bit-subset-enumerate-2  —— 枚举子集 (Gosper技巧)
ALGS.push({
  id: 'bit-subset-enumerate-2',
  m: ['子集枚举v2', 'Subset Enumeration v2', '枚举位掩码 mask 的所有非空子集（Gosper 技巧）。', 'Enumerate all non-empty subsets of a bitmask via the Gosper trick.',
    'sub = (sub - 1) & mask 依降序遍历所有子集，直到 0。', 'sub = (sub-1) & mask iterates all subsets in descending order. O(2^k).', 'O(2^k)', 'O(1)', ['bitwise', 'subset', 'gosper']],
  impl: `export interface SubsetHooks { onSubset?: (sub: number) => void; }
export function enumerateSubsets(mask: number, hooks: SubsetHooks = {}): number[] {
  const out: number[] = [];
  let sub = mask | 0;
  if (sub === 0) return out;
  do {
    out.push(sub >>> 0);
    hooks.onSubset?.(sub >>> 0);
    sub = ((sub - 1) & mask) | 0;
  } while (sub !== mask && sub !== 0 && out.length < 100000);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { enumerateSubsets } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [0b1011, 0b111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '子集枚举', en: 'Subset enumeration' }).commit();
  for (const mask of input) {
    const subs = enumerateSubsets(mask);
    rec.begin({ zh: 'mask=' + b(mask) + ' 共 ' + subs.length + ' 个子集', en: 'mask=' + b(mask) + ' has ' + subs.length + ' subsets' })
      .setBars(subs.map((s) => ({ value: s, role: 'final' as BarRole, label: b(s) }))).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enumerateSubsets } from '../../src/algorithms/bitwise/bit-subset-enumerate-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-subset-enumerate-2/trace.ts';
test('enumerateSubsets 正确', () => {
  assert.deepEqual(enumerateSubsets(0b101), [0b101, 0b100, 0b001]);
  assert.deepEqual(enumerateSubsets(0b111).length, 7);
  assert.deepEqual(enumerateSubsets(0), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 37. bit-carry-add-2  —— 模拟进位传播 (演示)
ALGS.push({
  id: 'bit-carry-add-2',
  m: ['进位传播', 'Carry Propagation', '模拟对一组二进制位做进位传播，常用于大数加法。', 'Simulate carry propagation across a bit array (big-number addition).',
    '从低到高：若该位 ≥ 2，则进位到高位，本位 mod 2。', 'Per-bit: if value >= 2, carry to the next. O(n).', 'O(n)', 'O(n)', ['bitwise', 'carry', 'addition']],
  impl: `export interface CarryHooks { onCarry?: (idx: number, bit: number) => void; }
export function carryPropagate(bits: number[], hooks: CarryHooks = {}): number[] {
  const out = [...bits];
  for (let i = 0; i + 1 < out.length; i++) {
    const cur = out[i]! | 0;
    if (cur >= 2) {
      const carry = Math.floor(cur / 2);
      out[i] = cur % 2;
      out[i + 1] = (out[i + 1]! | 0) + carry;
      hooks.onCarry?.(i, out[i]!);
    }
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { carryPropagate } from './impl.ts';
export const DEFAULT_INPUT = [2, 2, 0, 0]; // 低位在前: 2+2 产生进位
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '进位传播', en: 'Carry propagation' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const out = carryPropagate(input, { onCarry: (i, bit) => { const roles = input.map(() => 'default' as BarRole); roles[i] = 'swap' as BarRole; rec.begin({ zh: '位 ' + i + ' 进位', en: 'carry at ' + i }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit(); } });
  rec.begin({ zh: '结果：' + out.join(''), en: 'result: ' + out.join('') }).setArray([...out], out.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carryPropagate } from '../../src/algorithms/bitwise/bit-carry-add-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-carry-add-2/trace.ts';
test('carryPropagate 正确', () => {
  assert.deepEqual(carryPropagate([2, 2, 0, 0]), [0, 0, 1, 0]);
  assert.deepEqual(carryPropagate([1, 1, 0, 0]), [1, 1, 0, 0]);
  assert.deepEqual(carryPropagate([3, 0, 0, 0]), [1, 1, 0, 0]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 38. bit-mask-shift-2  —— 构造低位全1掩码
ALGS.push({
  id: 'bit-mask-shift-2',
  m: ['低k位掩码', 'Low-k Bits Mask', '构造低 k 位全 1 的掩码：(1<<k) - 1。', 'Build a mask of k low set bits: (1<<k) - 1.',
    '(1 << k) - 1 得到低 k 位全 1。k=0 → 0，k=32 需特殊处理。', '(1<<k) - 1 yields k low set bits. O(1).', 'O(1)', 'O(1)', ['bitwise', 'mask']],
  impl: `export interface MaskHooks { onResult?: (m: number) => void; }
export function lowMask(k: number, hooks: MaskHooks = {}): number {
  const n = k | 0;
  if (n <= 0) { hooks.onResult?.(0); return 0; }
  if (n >= 32) { hooks.onResult?.(0xFFFFFFFF); return 0xFFFFFFFF; }
  const r = ((1 << n) - 1) >>> 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lowMask } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [0, 1, 4, 8, 16, 32];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '低k位掩码', en: 'Low-k mask' }).commit();
  for (const k of input) {
    const r = lowMask(k, { onResult: (m) => rec.begin({ zh: 'mask(' + k + ')=' + b(m), en: 'mask(' + k + ')=' + b(m) }).setAux([{ label: 'mask', value: b(m), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: 'k=' + k + ' → ' + b(r), en: 'k=' + k + ' → ' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowMask } from '../../src/algorithms/bitwise/bit-mask-shift-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-mask-shift-2/trace.ts';
test('lowMask 正确', () => {
  assert.equal(lowMask(0), 0);
  assert.equal(lowMask(1), 1);
  assert.equal(lowMask(4), 0b1111);
  assert.equal(lowMask(8), 0xFF);
  assert.equal(lowMask(16), 0xFFFF);
  assert.equal(lowMask(32), 0xFFFFFFFF);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 39. bit-merge-mask-2  —— 用掩码合并两数 (a&m) | (b&~m)
ALGS.push({
  id: 'bit-merge-mask-2',
  m: ['掩码合并', 'Merge by Mask', '按掩码合并：result = (a & m) | (b & ~m)，m 为1处取 a。', 'Merge two values: result = (a & m) | (b & ~m); takes a where mask is 1.',
    '掩码 m 控制：m 的 1 位取自 a，0 位取自 b。常用于位域写入。', '(a & m) | (b & ~m). O(1).', 'O(1)', 'O(1)', ['bitwise', 'merge', 'bitfield']],
  impl: `export interface MergeHooks { onResult?: (r: number) => void; }
export function mergeMask(a: number, b: number, m: number, hooks: MergeHooks = {}): number {
  const r = (((a & m) | (b & ~m)) | 0);
  hooks.onResult?.(r >>> 0);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeMask } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number, number]> = [[0xFF, 0x00, 0x0F], [0b1010, 0b0101, 0b1100]];
export function buildTrace(input: Array<[number, number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '掩码合并', en: 'Merge by mask' }).commit();
  for (const [a, c, m] of input) {
    const r = mergeMask(a, c, m, { onResult: (v) => rec.begin({ zh: b(a) + ' m ' + b(m) + ' ' + b(c) + ' → ' + b(v), en: b(a) + ' m ' + b(m) + ' ' + b(c) + ' → ' + b(v) }).setAux([{ label: 'result', value: b(v), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: '合并 = ' + b(r), en: 'merge = ' + b(r) }).setAux([{ label: 'merge', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeMask } from '../../src/algorithms/bitwise/bit-merge-mask-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-merge-mask-2/trace.ts';
test('mergeMask 正确', () => {
  assert.equal(mergeMask(0xFF, 0x00, 0x0F), 0x0F);
  assert.equal(mergeMask(0b1010, 0b0101, 0b1100), 0b1001);
  assert.equal(mergeMask(0xFF, 0xAA, 0x00), 0xAA);
  assert.equal(mergeMask(0xFF, 0xAA, 0xFF), 0xFF);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 40. bit-floor-log2-2  —— floor(log2) 用填充法
ALGS.push({
  id: 'bit-floor-log2-2',
  m: ['floor log2 填充法', 'Floor Log2 by Fill', '用位填充后取位数得 floor(log2(x))。', 'floor(log2 x) via bit-fill then position.',
    '把最高位以下全填 1 得到 allones，再 popcount(allones) - 1 = log2。', 'Fill to all-ones then popcount - 1. O(1).', 'O(1)', 'O(1)', ['bitwise', 'log2']],
  impl: `export interface FloorLog2Hooks { onFill?: (v: number) => void; onResult?: (r: number) => void; }
export function floorLog2Fill(x: number, hooks: FloorLog2Hooks = {}): number {
  let v = x | 0;
  if (v <= 0) { hooks.onResult?.(-1); return -1; }
  v = v >>> 0;
  v |= v >>> 1; v |= v >>> 2; v |= v >>> 4; v |= v >>> 8; v |= v >>> 16;
  hooks.onFill?.(v >>> 0);
  // popcount(v)
  let c = 0, t = v >>> 0;
  while (t) { t &= t - 1; c++; }
  const r = c - 1;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floorLog2Fill } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 7, 8, 1023, 1024];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'floor log2 填充法', en: 'Floor log2 by fill' }).commit();
  for (const x of input) {
    const r = floorLog2Fill(x, { onFill: (v) => rec.begin({ zh: 'filled = 0x' + (v >>> 0).toString(16), en: 'filled' }).setAux([{ label: 'filled', value: String(v >>> 0), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'log2(' + x + ')=' + r, en: 'log2(' + x + ')=' + r }).setAux([{ label: 'log2', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floorLog2Fill } from '../../src/algorithms/bitwise/bit-floor-log2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-floor-log2-2/trace.ts';
test('floorLog2Fill 正确', () => {
  assert.equal(floorLog2Fill(1), 0);
  assert.equal(floorLog2Fill(2), 1);
  assert.equal(floorLog2Fill(7), 2);
  assert.equal(floorLog2Fill(8), 3);
  assert.equal(floorLog2Fill(1023), 9);
  assert.equal(floorLog2Fill(1024), 10);
  assert.equal(floorLog2Fill(0), -1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 41. bit-count-blocks-2  —— 统计连续1块数
ALGS.push({
  id: 'bit-count-blocks-2',
  m: ['统计1块数', 'Count Runs of Ones', '统计整数二进制中连续 1 段的个数。', 'Count contiguous runs of 1 bits in an integer.',
    '扫描位：在每段「0→1」的上升沿计数一次。', 'Count rising edges 0->1 across bits. O(bits).', 'O(bits)', 'O(1)', ['bitwise', 'runs', 'blocks']],
  impl: `export interface BlocksHooks { onRun?: (start: number) => void; onResult?: (c: number) => void; }
export function countBlocks(x: number, hooks: BlocksHooks = {}): number {
  let v = x >>> 0;
  let count = 0;
  let prev = 0;
  for (let i = 0; i < 32; i++) {
    const bit = v & 1;
    if (bit === 1 && prev === 0) { count++; hooks.onRun?.(i); }
    prev = bit;
    v >>>= 1;
    if (v === 0 && prev === 0) break;
  }
  hooks.onResult?.(count);
  return count;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countBlocks } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b110011, 0b10101, 0b111, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '统计连续1块', en: 'Count runs of ones' }).commit();
  for (const x of input) {
    const r = countBlocks(x, { onRun: (i) => rec.begin({ zh: '在第 ' + i + ' 位发现新段', en: 'new run at bit ' + i }).setAux([{ label: 'bit', value: String(i), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: b(x) + ' → ' + r + ' 段', en: b(x) + ' → ' + r + ' runs' }).setAux([{ label: 'runs', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countBlocks } from '../../src/algorithms/bitwise/bit-count-blocks-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-count-blocks-2/trace.ts';
test('countBlocks 正确', () => {
  assert.equal(countBlocks(0b110011), 2);
  assert.equal(countBlocks(0b10101), 3);
  assert.equal(countBlocks(0b111), 1);
  assert.equal(countBlocks(0), 0);
  assert.equal(countBlocks(0xFFFFFFFF), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 42. bit-cond-move-2  —— 无分支条件选择 (cmov)
ALGS.push({
  id: 'bit-cond-move-2',
  m: ['条件选择', 'Branchless Conditional Select', '无分支按 flag 选择 a 或 b：result = (flag ? a : b)。', 'Branchless select: choose a or b based on a boolean flag.',
    'mask = -flag（布尔转 0/-1），result = (a & mask) | (b & ~mask)。', 'mask = -(flag?1:0); result = (a & mask) | (b & ~mask). O(1).', 'O(1)', 'O(1)', ['bitwise', 'cmov', 'branchless']],
  impl: `export interface CmovHooks { onMask?: (mask: number) => void; onResult?: (r: number) => void; }
export function selectBit(flag: boolean, a: number, b: number, hooks: CmovHooks = {}): number {
  const mask = (flag ? -1 : 0) | 0;
  hooks.onMask?.(mask >>> 0);
  const r = (((a | 0) & mask) | ((b | 0) & ~mask)) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { selectBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[boolean, number, number]> = [[true, 0xAA, 0x55], [false, 0xAA, 0x55]];
export function buildTrace(input: Array<[boolean, number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '条件选择', en: 'Conditional select' }).commit();
  for (const [f, a, c] of input) {
    const r = selectBit(f, a, c, { onMask: (m) => rec.begin({ zh: 'mask = ' + b(m), en: 'mask = ' + b(m) }).setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: (f ? 'a' : 'b') + ' = ' + b(r), en: 'sel = ' + b(r) }).setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectBit } from '../../src/algorithms/bitwise/bit-cond-move-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-cond-move-2/trace.ts';
test('selectBit 正确', () => {
  assert.equal(selectBit(true, 0xAA, 0x55), 0xAA);
  assert.equal(selectBit(false, 0xAA, 0x55), 0x55);
  assert.equal(selectBit(true, 100, 200), 100);
  assert.equal(selectBit(false, 100, 200), 200);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 43. bit-trailing-ones-2  —— 统计末尾连续1
ALGS.push({
  id: 'bit-trailing-ones-2',
  m: ['末尾连续1', 'Count Trailing Ones', '统计最低位起连续 1 的个数。', 'Count contiguous 1 bits starting from the LSB.',
    'cto = ctz(~x)。即翻转后数末尾 0。', 'cto(x) = ctz(~x). O(1).', 'O(1)', 'O(1)', ['bitwise', 'trailing-ones', 'ctz']],
  impl: `export interface CtoHooks { onResult?: (c: number) => void; }
function ctz(x: number): number {
  if (x === 0) return 32;
  let n = 0, v = x >>> 0;
  while ((v & 1) === 0) { n++; v >>>= 1; }
  return n;
}
export function countTrailingOnes(x: number, hooks: CtoHooks = {}): number {
  const v = x | 0;
  const r = ctz(~v);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countTrailingOnes } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b1011, 0b111, 0b1000, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '末尾连续1', en: 'Trailing ones' }).commit();
  for (const x of input) {
    const r = countTrailingOnes(x, { onResult: (c) => rec.begin({ zh: b(x) + ' → ' + c, en: b(x) + ' → ' + c }).setAux([{ label: 'ones', value: String(c), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: 'result=' + r, en: 'result=' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countTrailingOnes } from '../../src/algorithms/bitwise/bit-trailing-ones-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-trailing-ones-2/trace.ts';
test('countTrailingOnes 正确', () => {
  assert.equal(countTrailingOnes(0b1011), 2);
  assert.equal(countTrailingOnes(0b111), 3);
  assert.equal(countTrailingOnes(0b1000), 0);
  assert.equal(countTrailingOnes(0), 0);
  assert.equal(countTrailingOnes(-1), 32);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 44. bit-leading-ones-2  —— 统计前导连续1
ALGS.push({
  id: 'bit-leading-ones-2',
  m: ['前导连续1', 'Count Leading Ones', '统计最高位起连续 1 的个数。', 'Count contiguous 1 bits from the MSB.',
    'clo = clz(~x)。', 'clo(x) = clz(~x). O(1).', 'O(1)', 'O(1)', ['bitwise', 'leading-ones', 'clz']],
  impl: `export interface CloHooks { onResult?: (c: number) => void; }
function clz(x: number): number {
  if (x === 0) return 32;
  let n = 0, v = x >>> 0;
  if ((v & 0xFFFF0000) === 0) { n += 16; v <<= 16; }
  if ((v & 0xFF000000) === 0) { n += 8; v <<= 8; }
  if ((v & 0xF0000000) === 0) { n += 4; v <<= 4; }
  if ((v & 0xC0000000) === 0) { n += 2; v <<= 2; }
  if ((v & 0x80000000) === 0) { n += 1; }
  return n;
}
export function countLeadingOnes(x: number, hooks: CloHooks = {}): number {
  const v = x | 0;
  const r = clz(~v);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countLeadingOnes } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b11100000, 0xFFFFFFFF, 0b01110000 >>> 0, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前导连续1', en: 'Leading ones' }).commit();
  for (const x of input) {
    const r = countLeadingOnes(x, { onResult: (c) => rec.begin({ zh: b(x) + ' → ' + c, en: b(x) + ' → ' + c }).setAux([{ label: 'ones', value: String(c), role: 'final' as BarRole }]).commit() });
    rec.begin({ zh: 'result=' + r, en: 'result=' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countLeadingOnes } from '../../src/algorithms/bitwise/bit-leading-ones-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-leading-ones-2/trace.ts';
test('countLeadingOnes 正确', () => {
  assert.equal(countLeadingOnes(0xFFFFFFFF), 32);
  assert.equal(countLeadingOnes(0), 0);
  assert.equal(countLeadingOnes(-1), 32);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 45. bit-round-up-pow2-2  —— 把数组大小向上对齐到2的幂倍数
ALGS.push({
  id: 'bit-round-up-pow2-2',
  m: ['对齐到2的幂', 'Align to Power of Two', '把 size 向上对齐到 align（2的幂）的倍数。', 'Round size up to a multiple of align (a power of two).',
    '对齐公式：(size + align - 1) & ~(align - 1)，等价于向上取整到 align 的倍数。', '(size + align - 1) & ~(align - 1). O(1).', 'O(1)', 'O(1)', ['bitwise', 'alignment', 'power-of-two']],
  impl: `export interface AlignHooks { onMask?: (mask: number) => void; onResult?: (r: number) => void; }
export function alignUp(size: number, align: number, hooks: AlignHooks = {}): number {
  if ((align & (align - 1)) !== 0 || align <= 0) throw new RangeError('align 必须是正的 2 的幂');
  const mask = align - 1;
  hooks.onMask?.(mask >>> 0);
  const r = (((size | 0) + mask) & ~mask) | 0;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { alignUp } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[10, 8], [16, 8], [17, 16], [0, 4]];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '对齐到2的幂倍数', en: 'Align to power of two' }).commit();
  for (const [s, a] of input) {
    const r = alignUp(s, a, { onMask: (m) => rec.begin({ zh: 'mask = ' + m, en: 'mask = ' + m }).setAux([{ label: 'mask', value: String(m), role: 'pivot' as BarRole }]).commit() });
    rec.begin({ zh: 'alignUp(' + s + ',' + a + ')=' + r, en: 'alignUp(' + s + ',' + a + ')=' + r }).setAux([{ label: 'aligned', value: String(r), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alignUp } from '../../src/algorithms/bitwise/bit-round-up-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-round-up-pow2-2/trace.ts';
test('alignUp 正确', () => {
  assert.equal(alignUp(10, 8), 16);
  assert.equal(alignUp(16, 8), 16);
  assert.equal(alignUp(17, 16), 32);
  assert.equal(alignUp(0, 4), 0);
});
test('alignUp 非幂报错', () => { assert.throws(() => alignUp(10, 6), RangeError); });
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// ——————————————————————————————————————————————————————————————
// 生成
// ——————————————————————————————————————————————————————————————
for (const a of ALGS) {
  // a.m = [zh, en, sumZh, sumEn, descZh, descEn, time, space, tags]
  const m = a.m;
  const metaSrc = meta(a.id, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
  writeAlg(a.id, metaSrc, a.impl, a.trace, a.test);
}
console.log(`bitwise: wrote ${ALGS.length} algorithms`);
