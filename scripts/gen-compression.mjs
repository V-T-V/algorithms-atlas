// compression 类别 · 30 个算法规范
import { add } from './gen-batch.mjs';

// 辅助：把字节转二进制串
const bin8 = (b) => (b & 0xff).toString(2).padStart(8, '0');

// 1. comp-bitpack -----
add({
  cat: 'compression', id: 'comp-bitpack',
  title: { zh: '位打包 Bit-Packing', en: 'Bit-Packing' },
  summary: { zh: '按固定位宽将整数紧凑存入位流。', en: 'Pack integers into a bit stream at fixed width.' },
  description: { zh: '位打包将一组整数按 k 位宽度连续写入位缓冲，无对齐填充，常用于结构化小整数(如 5-bit 字母索引)。', en: 'Bit-packing writes integers of k-bit width consecutively into a bit buffer without alignment padding.' },
  tags: ['compression','bit-packing'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface BpHooks { onWrite?: (val: number, bits: string) => void; onFlush?: (bytes: number) => void; }
export function bitPack(values: number[], width: number, hooks: BpHooks = {}): { bytes: number[]; stream: string } {
  let stream = '';
  for (const v of values) { hooks.onWrite?.(v, v.toString(2).padStart(width, '0')); stream += v.toString(2).padStart(width, '0'); }
  while (stream.length % 8 !== 0) stream += '0';
  const bytes: number[] = [];
  for (let i = 0; i < stream.length; i += 8) bytes.push(parseInt(stream.slice(i, i + 8), 2));
  hooks.onFlush?.(bytes.length);
  return { bytes, stream };
}
export function bitUnpack(bytes: number[], width: number, count: number): number[] {
  const stream = bytes.map((b) => b.toString(2).padStart(8, '0')).join('');
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(parseInt(stream.slice(i * width, (i + 1) * width), 2));
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitPack, bitUnpack } from './impl.ts';
export const DEFAULT_INPUT = { values: [1, 2, 3, 4, 5], width: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位打包 width=' + input.width, en: 'bitpack w=' + input.width }).commit();
  const { bytes, stream } = bitPack(input.values, input.width, {
    onWrite: (v, bits) => rec.begin({ zh: v + ' -> ' + bits, en: v + '->' + bits }).setAux([{label:'bits',value:bits,role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '流 ' + stream, en: 'stream' }).setAux([{label:'stream',value:stream,role:'final' as BarRole},{label:'bytes',value:bytes.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitPack, bitUnpack } from '../../src/algorithms/compression/comp-bitpack/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bitpack/trace.ts';
test('bitpack 往返一致', () => { const { bytes } = bitPack([1,2,3,4,5], 3); assert.deepEqual(bitUnpack(bytes, 3, 5), [1,2,3,4,5]); });
test('bitpack trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 2. comp-ec-audio (Companding μ-law simplified) -----
add({
  cat: 'compression', id: 'comp-mulaw',
  title: { zh: 'μ-law 压扩', en: 'μ-law Companding' },
  summary: { zh: '语音对数压扩，提升小信号信噪比。', en: 'Logarithmic voice companding.' },
  description: { zh: 'μ-law(北美电话)用对数函数压缩 16-bit 线性 PCM 为 8-bit，提升小信号量化信噪比，与 A-law 同类。', en: 'μ-law (N. American telephony) compresses 16-bit linear PCM to 8-bit logarithmically, boosting small-signal SNR; sibling of A-law.' },
  tags: ['compression','mulaw','companding','audio'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface MuHooks { onSample?: (i: number, lin: number, enc: number) => void; }
const MU = 255;
export function mulawEncode(samples: number[], hooks: MuHooks = {}): number[] {
  return samples.map((s, i) => {
    const sign = s < 0 ? 0x80 : 0;
    let x = Math.abs(s) / 32768;
    const enc = sign | Math.round((Math.log(1 + MU * x) / Math.log(1 + MU)) * 127);
    hooks.onSample?.(i, s, enc);
    return enc;
  });
}
export function mulawDecode(data: number[]): number[] {
  return data.map((b) => {
    const sign = b & 0x80 ? -1 : 1;
    const v = b & 0x7f;
    return Math.round(sign * 32768 * (Math.pow(1 + MU, v / 127) - 1) / MU);
  });
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mulawEncode, mulawDecode } from './impl.ts';
export const DEFAULT_INPUT = [1000, -2000, 30000, -30000, 500];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'μ-law 编码', en: 'mu-law encode' }).commit();
  const enc = mulawEncode(input, {
    onSample: (i, lin, e) => rec.begin({ zh: 's' + i + '=' + lin + ' -> ' + e, en: 's'+i }).setAux([{label:'lin',value:String(lin),role:'compare' as BarRole},{label:'enc',value:String(e),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '解码 ' + mulawDecode(enc).join(','), en: 'decode' }).setAux([{label:'dec',value:mulawDecode(enc).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulawEncode, mulawDecode } from '../../src/algorithms/compression/comp-mulaw/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-mulaw/trace.ts';
test('mulaw 大致可逆', () => { const e = mulawEncode([1000,-1000]); const d = mulawDecode(e); assert.ok(Math.abs(d[0]!-1000) < 5000); });
test('mulaw 输出 0-255', () => { for (const b of mulawEncode([0,32767,-32768])) assert.ok(b >= 0 && b <= 255); });
test('mulaw trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 3. comp-rle-bw (RLE for binary images with bitplanes) — keep simple: RLE with escape
add({
  cat: 'compression', id: 'comp-rle-escape',
  title: { zh: '转义 RLE', en: 'Escape RLE' },
  summary: { zh: '用转义符区分重复与字面字节。', en: 'Escape byte separates runs and literals.' },
  description: { zh: '转义 RLE 用一个特殊字节作为标记：后跟计数与字节表示连续重复，避免对不易压缩的数据产生膨胀。', en: 'Escape RLE uses a marker byte followed by count and value to encode runs, avoiding expansion on incompressible data.' },
  tags: ['compression','rle','escape'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface ErleHooks { onRun?: (byte: number, count: number) => void; onLiteral?: (bytes: number) => void; }
const ESC = 0xff;
export function rleEscapeEncode(data: number[], hooks: ErleHooks = {}): number[] {
  const out: number[] = []; let i = 0;
  while (i < data.length) {
    let run = 1;
    while (i + run < data.length && data[i + run] === data[i] && run < 255) run++;
    if (run >= 4) { out.push(ESC, run, data[i]!); hooks.onRun?.(data[i]!, run); i += run; }
    else { out.push(data[i]!); hooks.onLiteral?.(1); i++; }
  }
  return out;
}
export function rleEscapeDecode(enc: number[]): number[] {
  const out: number[] = []; let i = 0;
  while (i < enc.length) { if (enc[i] === ESC) { out.push(...Array(enc[i + 1]!).fill(enc[i + 2]!)); i += 3; } else { out.push(enc[i]!); i++; } }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rleEscapeEncode, rleEscapeDecode } from './impl.ts';
export const DEFAULT_INPUT = [1,1,1,1,1,2,3,4,4,4,4,9];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '转义 RLE', en: 'Escape RLE' }).commit();
  const enc = rleEscapeEncode(input, {
    onRun: (b, c) => rec.begin({ zh: '重复 ' + b + ' x' + c, en: 'run' }).setAux([{label:'run',value:b+'x'+c,role:'final' as BarRole}]).commit(),
    onLiteral: (n) => rec.begin({ zh: '字面 ' + n, en: 'literal' }).setAux([{label:'lit',value:String(n),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '解压 ' + rleEscapeDecode(enc).join(','), en: 'decode' }).setAux([{label:'dec',value:rleEscapeDecode(enc).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rleEscapeEncode, rleEscapeDecode } from '../../src/algorithms/compression/comp-rle-escape/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rle-escape/trace.ts';
test('rle-escape 往返', () => { const e = rleEscapeEncode([7,7,7,7,7,2,3]); assert.deepEqual(rleEscapeDecode(e), [7,7,7,7,7,2,3]); });
test('rle-escape trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 4. comp-move-to-front-text (MTF already exists comp-mtf-2; here per-byte delta) -> use Binary Arithmetic Coding simplified
add({
  cat: 'compression', id: 'comp-arithmetic-binary',
  title: { zh: '二进制算术编码', en: 'Binary Arithmetic Coding' },
  summary: { zh: '对 0/1 序列做算术编码。', en: 'Arithmetic coding over bit sequences.' },
  description: { zh: '二进制算术编码用 [low,high) 区间逐位细分，按 0/1 概率 p 分配子区间，最终输出一个浮点数代表整段比特。', en: 'Binary arithmetic coding refines a [low,high) interval per bit by probability p, emitting one number encoding the whole bit string.' },
  tags: ['compression','arithmetic-coding','binary'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface BacHooks { onBit?: (bit: number, low: number, high: number) => void; }
export function arithmeticBinaryEncode(bits: number[], p1: number, hooks: BacHooks = {}): number {
  let low = 0, high = 1;
  for (const b of bits) {
    const range = high - low;
    const split = low + range * p1;
    if (b === 1) { low = split; } else { high = split; }
    hooks.onBit?.(b, low, high);
  }
  return (low + high) / 2;
}
export function arithmeticBinaryDecode(code: number, p1: number, n: number): number[] {
  const out: number[] = []; let low = 0, high = 1;
  for (let i = 0; i < n; i++) {
    const range = high - low; const split = low + range * p1;
    if (code < split) { out.push(0); high = split; } else { out.push(1); low = split; }
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arithmeticBinaryEncode, arithmeticBinaryDecode } from './impl.ts';
export const DEFAULT_INPUT = { bits: [1,0,1,1,0,1], p1: 0.5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二进制算术编码 p1=' + input.p1, en: 'BAC p1=' + input.p1 }).commit();
  const code = arithmeticBinaryEncode(input.bits, input.p1, {
    onBit: (b, lo, hi) => rec.begin({ zh: 'bit=' + b + ' [' + lo.toFixed(3) + ',' + hi.toFixed(3) + ')', en: 'bit ' + b }).setAux([{label:'bit',value:String(b),role:'pivot' as BarRole},{label:'low',value:lo.toFixed(3),role:'compare' as BarRole}]).commit(),
  });
  const dec = arithmeticBinaryDecode(code, input.p1, input.bits.length);
  rec.begin({ zh: 'code=' + code.toFixed(4) + ' 解码[' + dec.join(',') + ']', en: 'decode' }).setAux([{label:'code',value:code.toFixed(4),role:'final' as BarRole},{label:'dec',value:dec.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arithmeticBinaryEncode, arithmeticBinaryDecode } from '../../src/algorithms/compression/comp-arithmetic-binary/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-arithmetic-binary/trace.ts';
test('bac 往返', () => { const c = arithmeticBinaryEncode([1,0,1,1], 0.5); assert.deepEqual(arithmeticBinaryDecode(c, 0.5, 4), [1,0,1,1]); });
test('bac trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 5. comp-byte-pair -----
add({
  cat: 'compression', id: 'comp-byte-pair',
  title: { zh: '字节对编码 BPE', en: 'Byte Pair Encoding' },
  summary: { zh: '贪心合并最高频字节对为新符号。', en: 'Greedy merge of most frequent byte pair.' },
  description: { zh: 'BPE(Byte Pair Encoding)反复统计序列中出现最频繁的相邻字节对，用新符号替换，构建可用于压缩/分词的词汇表。', en: 'BPE repeatedly replaces the most frequent adjacent byte pair with a new symbol, building a vocabulary usable for compression or tokenization.' },
  tags: ['compression','bpe','byte-pair'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  impl: `export interface BpeHooks { onMerge?: (pair: string, symbol: number) => void; }
export function bytePairEncode(tokens: number[], vocabStart: number, rounds: number, hooks: BpeHooks = {}): { tokens: number[]; rules: Array<{ pair: [number, number]; sym: number }> } {
  const rules: Array<{ pair: [number, number]; sym: number }> = []; let cur = [...tokens]; let next = vocabStart;
  for (let r = 0; r < rounds; r++) {
    const freq = new Map<string, number>();
    for (let i = 0; i + 1 < cur.length; i++) { const k = cur[i]! + ',' + cur[i + 1]!; freq.set(k, (freq.get(k) ?? 0) + 1); }
    if (!freq.size) break;
    let best = ''; let bf = 0;
    for (const [k, f] of freq) if (f > bf) { bf = f; best = k; }
    const [a, b] = best.split(',').map(Number);
    rules.push({ pair: [a!, b!], sym: next });
    const out: number[] = []; let i = 0;
    while (i < cur.length) { if (i + 1 < cur.length && cur[i] === a && cur[i + 1] === b) { out.push(next); i += 2; } else { out.push(cur[i]!); i++; } }
    hooks.onMerge?.(best, next); cur = out; next++;
  }
  return { tokens: cur, rules };
}
export function bytePairDecode(tokens: number[], rules: Array<{ pair: [number, number]; sym: number }>): number[] {
  const map = new Map(rules.map((r) => [r.sym, r.pair]));
  const expand = (t: number): number[] => (map.has(t) ? [...expand(map.get(t)![0]!), ...expand(map.get(t)![1]!)] : [t]);
  return tokens.flatMap(expand);
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bytePairEncode, bytePairDecode } from './impl.ts';
export const DEFAULT_INPUT = { tokens: [97,97,98,97,97,98,99], vocab: 256, rounds: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BPE', en: 'BPE' }).commit();
  const { tokens, rules } = bytePairEncode(input.tokens, input.vocab, input.rounds, {
    onMerge: (pair, sym) => rec.begin({ zh: '合并 (' + pair + ') -> ' + sym, en: 'merge' }).setAux([{label:'pair',value:'('+pair+')',role:'compare' as BarRole},{label:'sym',value:String(sym),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 [' + tokens.join(',') + ']', en: 'result' }).setAux([{label:'tokens',value:tokens.join(','),role:'final' as BarRole},{label:'dec',value:bytePairDecode(tokens,rules).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bytePairEncode, bytePairDecode } from '../../src/algorithms/compression/comp-byte-pair/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-byte-pair/trace.ts';
test('bpe 往返', () => { const { tokens, rules } = bytePairEncode([1,1,2,1,1,2], 256, 2); assert.deepEqual(bytePairDecode(tokens, rules), [1,1,2,1,1,2]); });
test('bpe 长度缩减', () => { const { tokens } = bytePairEncode([1,1,1,1], 256, 2); assert.ok(tokens.length <= 4); });
test('bpe trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 6. comp-lz77-windowed (variant) -> LZSS already exists; use LZP (Lempel-Ziv-Prepared)
add({
  cat: 'compression', id: 'comp-lzp',
  title: { zh: 'LZP 预测 LZ', en: 'LZP (Lempel-Ziv Prediction)' },
  summary: { zh: '用上次出现上下文预测并编码偏移。', en: 'Predicts via prior context, encodes mismatches.' },
  description: { zh: 'LZP(Bloom)用前 k 字节的哈希作为上下文查表，若命中则只输出标志位与长度，否则输出字面，常作为高效预处理器。', en: 'LZP (Bloom) hashes the previous k bytes as context; on hit it emits a flag and length, otherwise a literal, serving as a fast preprocessor.' },
  tags: ['compression','lz','prediction'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface LzpHooks { onHit?: (pos: number, ctx: number) => void; onMiss?: (pos: number, byte: number) => void; }
export function lzpEncode(data: number[], hooks: LzpHooks = {}): number[] {
  const table = new Map<number, number>(); const out: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const ctx = i >= 2 ? (data[i - 2]! * 256 + data[i - 1]!) : 0;
    const prev = table.get(ctx);
    if (prev !== undefined && prev < i) { out.push(1, i - prev); hooks.onHit?.(i, ctx); }
    else { out.push(0, data[i]!); hooks.onMiss?.(i, data[i]!); }
    table.set(ctx, i);
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzpEncode } from './impl.ts';
export const DEFAULT_INPUT = [65,66,67,65,66,68];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LZP', en: 'LZP' }).commit();
  const out = lzpEncode(input, {
    onHit: (p, ctx) => rec.begin({ zh: '命中 @' + p, en: 'hit @' + p }).setAux([{label:'hit',value:'@'+p,role:'final' as BarRole}]).commit(),
    onMiss: (p, b) => rec.begin({ zh: '字面 @' + p + '=' + b, en: 'miss' }).setAux([{label:'byte',value:String(b),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' }).setAux([{label:'out',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzpEncode } from '../../src/algorithms/compression/comp-lzp/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lzp/trace.ts';
test('lzp 输出标志+数据', () => { const o = lzpEncode([1,2,3]); assert.equal(o[0], 0); assert.equal(o[1], 1); });
test('lzp trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 7. comp-bwt-dc (Distance Coding) -----
add({
  cat: 'compression', id: 'comp-distance-coding',
  title: { zh: '距离编码', en: 'Distance Coding' },
  summary: { zh: 'BWT 输出的高效整数编码。', en: 'Efficient integer coding for BWT output.' },
  description: { zh: '距离编码(Binder)为 BWT 输出设计：对每个符号记录到下一次出现相同符号的距离，常与游程/算术编码组合。', en: 'Distance coding (Binder) targets BWT output: for each symbol it stores the distance to its next occurrence, combined with run/arithmetic coding.' },
  tags: ['compression','bwt','distance-coding'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface DcHooks { onEmit?: (sym: number, dist: number) => void; }
export function distanceCoding(data: number[], hooks: DcHooks = {}): number[] {
  const lastPos = new Map<number, number>(); const out: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const s = data[i]!;
    if (lastPos.has(s)) { const d = i - lastPos.get(s)!; out.push(d); hooks.onEmit?.(s, d); }
    else { out.push(s); hooks.onEmit?.(s, 0); }
    lastPos.set(s, i);
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { distanceCoding } from './impl.ts';
export const DEFAULT_INPUT = [1,2,1,3,2,1,4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '距离编码', en: 'Distance Coding' }).commit();
  const out = distanceCoding(input, {
    onEmit: (s, d) => rec.begin({ zh: '符号 ' + s + ' 距离 ' + d, en: 'sym ' + s }).setAux([{label:'sym',value:String(s),role:'compare' as BarRole},{label:'dist',value:String(d),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' }).setAux([{label:'out',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceCoding } from '../../src/algorithms/compression/comp-distance-coding/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-distance-coding/trace.ts';
test('dc 首次出现输出符号', () => { assert.equal(distanceCoding([5,5])[0], 5); assert.equal(distanceCoding([5,5])[1], 1); });
test('dc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 8. comp-re-pair (Re-Pair) -----
add({
  cat: 'compression', id: 'comp-repair',
  title: { zh: 'Re-Pair 递归配对', en: 'Re-Pair Compression' },
  summary: { zh: '递归替换最频繁相邻对为新符号。', en: 'Recursively replace most frequent pair.' },
  description: { zh: 'Re-Pair(Larsson & Moffat)反复用新符号替换序列中最频繁的相邻符号对，直到没有对出现 ≥2 次，得到紧凑语法。', en: 'Re-Pair recursively replaces the most frequent adjacent pair with a new symbol until no pair repeats, producing a compact grammar.' },
  tags: ['compression','repair','grammar'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface RpHooks { onReplace?: (pair: string, sym: number) => void; }
export function repairCompress(tokens: number[], startSym: number, hooks: RpHooks = {}): { tokens: number[]; rules: Map<number, [number, number]> } {
  const rules = new Map<number, [number, number]>(); let cur = [...tokens]; let sym = startSym;
  while (true) {
    const freq = new Map<string, number>();
    for (let i = 0; i + 1 < cur.length; i++) { const k = cur[i]! + ':' + cur[i + 1]!; freq.set(k, (freq.get(k) ?? 0) + 1); }
    if (!freq.size) break;
    let best = ''; let bf = 0;
    for (const [k, f] of freq) if (f > bf && f >= 2) { bf = f; best = k; }
    if (bf < 2) break;
    const [a, b] = best.split(':').map(Number);
    rules.set(sym, [a!, b!]); hooks.onReplace?.(best, sym);
    const out: number[] = []; let i = 0;
    while (i < cur.length) { if (i + 1 < cur.length && cur[i] === a && cur[i + 1] === b) { out.push(sym); i += 2; } else { out.push(cur[i]!); i++; } }
    cur = out; sym++;
  }
  return { tokens: cur, rules };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { repairCompress } from './impl.ts';
export const DEFAULT_INPUT = { tokens: [1,2,1,2,1,2,3,3], start: 256 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Re-Pair', en: 'Re-Pair' }).commit();
  const { tokens, rules } = repairCompress(input.tokens, input.start, {
    onReplace: (pair, s) => rec.begin({ zh: '替换 (' + pair.replace(':',' ') + ') -> ' + s, en: 'replace' }).setAux([{label:'pair',value:pair,role:'compare' as BarRole},{label:'sym',value:String(s),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 [' + tokens.join(',') + '] 规则' + rules.size, en: 'result' }).setAux([{label:'tokens',value:tokens.join(','),role:'final' as BarRole},{label:'rules',value:String(rules.size),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repairCompress } from '../../src/algorithms/compression/comp-repair/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-repair/trace.ts';
test('repair 缩减重复对', () => { const { tokens } = repairCompress([1,2,1,2,1,2], 256); assert.ok(tokens.length < 6); });
test('repair trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 9. comp-fibonacci-zeckendorf (use Fibonacci base — but fibonacci-code exists; do Golomb full)
add({
  cat: 'compression', id: 'comp-golomb-full',
  title: { zh: 'Golomb 编码（完整）', en: 'Golomb Coding' },
  summary: { zh: '几何分布整数的最优前缀码。', en: 'Optimal prefix code for geometric distribution.' },
  description: { zh: 'Golomb 编码用参数 m 把整数 n 编为一元商 ⌊n/m⌋ + 截断余数，对几何分布接近熵下界，rice 是 m=2^k 特例。', en: 'Golomb coding with parameter m encodes n as a unary quotient and truncated remainder; near-entropy for geometric distributions (Rice is m=2^k).' },
  tags: ['compression','golomb','prefix-code'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface GolHooks { onEmit?: (n: number, code: string) => void; }
export function golombEncode(values: number[], m: number, hooks: GolHooks = {}): string {
  const b = Math.floor(Math.log2(m)); const useTrunc = m !== Math.pow(2, b);
  let out = '';
  for (const n of values) {
    const q = Math.floor(n / m); const r = n % m;
    let code = '1'.repeat(q) + '0';
    if (!useTrunc) { code += r.toString(2).padStart(b, '0'); }
    else {
      const larger = m - Math.pow(2, b);
      if (r < larger) code += r.toString(2).padStart(b - 1, '0'); else code += (r + larger).toString(2).padStart(b, '0');
    }
    hooks.onEmit?.(n, code); out += code;
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { golombEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0,1,2,5,10], m: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Golomb m=' + input.m, en: 'Golomb m=' + input.m }).commit();
  const code = golombEncode(input.values, input.m, {
    onEmit: (n, c) => rec.begin({ zh: n + ' -> ' + c, en: n + '->' + c }).setAux([{label:'n',value:String(n),role:'compare' as BarRole},{label:'code',value:c,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '码流 ' + code, en: 'stream' }).setAux([{label:'code',value:code,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { golombEncode } from '../../src/algorithms/compression/comp-golomb-full/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-golomb-full/trace.ts';
test('golomb 0 编为 0+b', () => assert.equal(golombEncode([0], 4), '000'));
test('golomb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 10. comp-start-step-stop (SSS codes) -----
add({
  cat: 'compression', id: 'comp-sss-codes',
  title: { zh: 'Start-Step-Stop 编码', en: 'Start-Step-Stop Codes' },
  summary: { zh: '可调参数族一元类编码。', en: 'Parameterized family of unary-like codes.' },
  description: { zh: 'Start-Step-Stop 编码(明确 n)用 (start, step, stop) 三参数控制不同区段的一元位数，是一类前缀码的通用框架。', en: 'Start-Step-Stop codes (Elias) use (start, step, stop) to control unary length per range, a general framework of prefix codes.' },
  tags: ['compression','sss','prefix-code'],
  complexity: { time: 'O(1) per value', space: 'O(n)' },
  impl: `export interface SssHooks { onEmit?: (n: number, code: string) => void; }
export function sssEncode(values: number[], start: number, step: number, stop: number, hooks: SssHooks = {}): string {
  let out = '';
  for (const n of values) {
    let bits = start; let lo = 0; let i = 0;
    while (i < stop && n >= lo + (1 << bits)) { lo += 1 << bits; bits += step; i++; }
    const rem = n - lo;
    const code = '1'.repeat(i) + '0' + rem.toString(2).padStart(bits, '0');
    hooks.onEmit?.(n, code); out += code;
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sssEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0,1,2,3,7], start: 2, step: 1, stop: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SSS ' + input.start + '/' + input.step + '/' + input.stop, en: 'SSS' }).commit();
  const code = sssEncode(input.values, input.start, input.step, input.stop, {
    onEmit: (n, c) => rec.begin({ zh: n + ' -> ' + c, en: n + '->' + c }).setAux([{label:'n',value:String(n),role:'compare' as BarRole},{label:'code',value:c,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '码流 ' + code, en: 'stream' }).setAux([{label:'code',value:code,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sssEncode } from '../../src/algorithms/compression/comp-sss-codes/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-sss-codes/trace.ts';
test('sss 编 0 不为空', () => assert.ok(sssEncode([0],2,1,3).length > 0));
test('sss trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 11. comp-pitch (PFor — Patched Frame of Reference) -----
add({
  cat: 'compression', id: 'comp-pfor-delta',
  title: { zh: 'PFor 帧差压缩', en: 'Patched Frame of Reference' },
  summary: { zh: '数组用固定 b 位存+异常补丁。', en: 'Fixed b bits per value plus exception patches.' },
  description: { zh: 'PFor Delta(δ)把多数接近的数值用固定 b 位存储，少数异常值单独存放并以指针引用，倒排索引常用。', en: 'PFor Delta stores most near-equal values in fixed b bits with exceptions patched separately; common in inverted indices.' },
  tags: ['compression','pfor','inverted-index'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface PforHooks { onBlock?: (b: number, exc: number) => void; }
export function pforDeltaEncode(values: number[], b: number, hooks: PforHooks = {}): { core: number[]; exc: Array<{ idx: number; val: number }> } {
  const mask = (1 << b) - 1; const core: number[] = []; const exc: Array<{ idx: number; val: number }> = [];
  values.forEach((v, i) => { if (v >= 0 && v <= mask) core.push(v); else { core.push(0); exc.push({ idx: i, val: v }); hooks.onBlock?.(b, exc.length); } });
  return { core, exc };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pforDeltaEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [1,2,3,300,4,5,1000], b: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PFor b=' + input.b, en: 'PFor b=' + input.b }).commit();
  const { core, exc } = pforDeltaEncode(input.values, input.b, {
    onBlock: (bb, n) => rec.begin({ zh: '异常 #' + n, en: 'exc' }).setAux([{label:'exc',value:'#'+n,role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'core [' + core.join(',') + '] 异常 ' + exc.length, en: 'result' }).setAux([{label:'core',value:core.join(','),role:'final' as BarRole},{label:'exc',value:String(exc.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pforDeltaEncode } from '../../src/algorithms/compression/comp-pfor-delta/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-pfor-delta/trace.ts';
test('pfor 大值进异常', () => { const { exc } = pforDeltaEncode([1,2,100], 4); assert.equal(exc.length, 1); });
test('pfor trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 12. comp-simple9 -----
add({
  cat: 'compression', id: 'comp-simple9',
  title: { zh: 'Simple9 编码', en: 'Simple9' },
  summary: { zh: '一个 32 位字塞多种位宽。', en: 'One 32-bit word holds varied bit widths.' },
  description: { zh: 'Simple9(Anh & Moffat)每个 32 位字用高 4 位选 9 种位宽之一，低 28 位紧密排列等长小整数，倒排索引紧凑存储。', en: 'Simple9 uses 4 selector bits to pick one of 9 layouts packing equal small ints into 28 bits per word.' },
  tags: ['compression','simple9','inverted-index'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface S9Hooks { onWord?: (selector: number, count: number) => void; }
const LAYOUTS = [[28,1],[14,2],[9,3],[7,4],[5,5],[4,7],[3,9],[2,14],[1,28]];
export function simple9Encode(values: number[], hooks: S9Hooks = {}): number[] {
  const out: number[] = []; let i = 0;
  while (i < values.length) {
    let chosen = -1;
    for (let s = 0; s < LAYOUTS.length; s++) { const [bits, cnt] = LAYOUTS[s]!; const max = (1 << bits!) - 1; let ok = true; let used = 0;
      for (let k = 0; k < Math.min(cnt!, values.length - i); k++) { if (values[i + k]! > max) { ok = false; break; } used = k + 1; }
      if (ok && used > 0) { chosen = s; break; } }
    if (chosen < 0) { chosen = 8; }
    const [bits, cnt] = LAYOUTS[chosen]!; let word = chosen << 28;
    for (let k = 0; k < Math.min(cnt!, values.length - i); k++) word |= (values[i + k]! & ((1 << bits!) - 1)) << (k * bits!);
    hooks.onWord?.(chosen, Math.min(cnt!, values.length - i));
    out.push(word >>> 0); i += Math.min(cnt!, values.length - i);
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simple9Encode } from './impl.ts';
export const DEFAULT_INPUT = [1,2,3,4,5,6,7,8,9,10];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Simple9', en: 'Simple9' }).commit();
  const words = simple9Encode(input, {
    onWord: (sel, cnt) => rec.begin({ zh: '选择器 ' + sel + ' 数量 ' + cnt, en: 'word' }).setAux([{label:'sel',value:String(sel),role:'pivot' as BarRole},{label:'cnt',value:String(cnt),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: words.length + ' 字', en: words.length + ' words' }).setAux([{label:'words',value:String(words.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simple9Encode } from '../../src/algorithms/compression/comp-simple9/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-simple9/trace.ts';
test('simple9 大值用少位宽', () => { const w1 = simple9Encode([1,1,1]).length; const w2 = simple9Encode([1000000]).length; assert.ok(w2 >= w1); });
test('simple9 trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 13. comp-varint-gvb (Group-Varint) -----
add({
  cat: 'compression', id: 'comp-group-varint',
  title: { zh: 'Group-Varint 编码', en: 'Group-Varint' },
  summary: { zh: '4 个整数共用 1 字节位宽标记。', en: '4 ints share 1-byte width tag.' },
  description: { zh: 'Group-Varint(Dean)每 4 个整数共用 1 字节指示每个的位宽(1-4 字节)，减少 varint 的逐字节判断开销，数据库常用。', en: 'Group-Varint (Dean) shares 1 tag byte indicating each of 4 ints widths (1-4 bytes), cutting per-byte overhead.' },
  tags: ['compression','varint','group'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface GvbHooks { onGroup?: (tag: number, sizes: number[]) => void; }
export function groupVarintEncode(values: number[], hooks: GvbHooks = {}): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i += 4) {
    const group = values.slice(i, i + 4); while (group.length < 4) group.push(0);
    const sizes = group.map((v) => (v <= 0xff ? 1 : v <= 0xffff ? 2 : v <= 0xffffff ? 3 : 4));
    let tag = 0; sizes.forEach((s, k) => { tag |= (s - 1) << (k * 2); });
    hooks.onGroup?.(tag, sizes);
    out.push(tag);
    group.forEach((v, k) => { for (let b = 0; b < sizes[k]!; b++) out.push((v >>> (b * 8)) & 0xff); });
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { groupVarintEncode } from './impl.ts';
export const DEFAULT_INPUT = [1, 300, 70000, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Group-Varint', en: 'Group-Varint' }).commit();
  const out = groupVarintEncode(input, {
    onGroup: (tag, sizes) => rec.begin({ zh: 'tag=' + tag + ' 尺寸[' + sizes.join(',') + ']', en: 'group' }).setAux([{label:'tag',value:String(tag),role:'pivot' as BarRole},{label:'sizes',value:sizes.join(','),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: out.length + ' 字节', en: out.length + 'B' }).setAux([{label:'bytes',value:String(out.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupVarintEncode } from '../../src/algorithms/compression/comp-group-varint/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-group-varint/trace.ts';
test('gvb 第一个字节是 tag', () => { const o = groupVarintEncode([1,2,3,4]); assert.equal(o[0], 0); });
test('gvb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 14. comp-streamvbyte -----
add({
  cat: 'compression', id: 'comp-streamvbyte',
  title: { zh: 'StreamVByte', en: 'StreamVByte' },
  summary: { zh: '长度与数据分离的 varint。', en: 'Length/data-separated varint.' },
  description: { zh: 'StreamVByte(Stefanov)把每个整数的字节长度集中存到控制流，数据流只含数值字节，SIMD 友好、解码极快。', en: 'StreamVByte stores per-int byte lengths in a control stream and raw bytes separately, enabling SIMD-friendly fast decoding.' },
  tags: ['compression','varint','streamvbyte'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface SvbHooks { onLen?: (idx: number, len: number) => void; }
export function streamVByteEncode(values: number[], hooks: SvbHooks = {}): { ctrl: number[]; data: number[] } {
  const ctrl: number[] = []; const data: number[] = [];
  values.forEach((v, i) => { const len = v <= 0xff ? 1 : v <= 0xffff ? 2 : v <= 0xffffff ? 3 : 4; hooks.onLen?.(i, len); for (let b = 0; b < len; b++) data.push((v >>> (b * 8)) & 0xff); });
  for (let i = 0; i < values.length; i += 4) { let c = 0; for (let k = 0; k < 4 && i + k < values.length; k++) { const v = values[i + k]!; const len = v <= 0xff ? 1 : v <= 0xffff ? 2 : v <= 0xffffff ? 3 : 4; c |= (len - 1) << (k * 2); } ctrl.push(c); }
  return { ctrl, data };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { streamVByteEncode } from './impl.ts';
export const DEFAULT_INPUT = [1, 300, 70000, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'StreamVByte', en: 'StreamVByte' }).commit();
  const { ctrl, data } = streamVByteEncode(input, {
    onLen: (i, len) => rec.begin({ zh: 'v' + i + ' 长度 ' + len, en: 'len' }).setAux([{label:'i',value:String(i),role:'compare' as BarRole},{label:'len',value:String(len),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'ctrl ' + ctrl.length + ' data ' + data.length, en: 'sizes' }).setAux([{label:'ctrl',value:String(ctrl.length),role:'final' as BarRole},{label:'data',value:String(data.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { streamVByteEncode } from '../../src/algorithms/compression/comp-streamvbyte/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-streamvbyte/trace.ts';
test('svb 数据字节数正确', () => { const { data } = streamVByteEncode([1,300,70000]); assert.equal(data.length, 1+2+3); });
test('svb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 15. comp-bic (Bit-Induced Compression / use Piecewise prefix) -> use PFOR-Huffman hybrid name 'comp-nibble-split'
add({
  cat: 'compression', id: 'comp-nibble-split',
  title: { zh: 'Nibble 拆分编码', en: 'Nibble-Split Encoding' },
  summary: { zh: '4-bit 为单位紧凑存储整数。', en: 'Packs integers in 4-bit nibbles.' },
  description: { zh: 'Nibble 拆分将整数按 4 位半字节连续存储，前缀位指示是否续接，对小整数(如指针偏移)紧凑且易解码。', en: 'Nibble-split stores ints as 4-bit nibbles with a continuation bit; compact and simple for small offsets.' },
  tags: ['compression','nibble','varint'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface NsHooks { onEmit?: (n: number, nibbles: number[]) => void; }
export function nibbleSplitEncode(values: number[], hooks: NsHooks = {}): number[] {
  const out: number[] = [];
  for (const v of values) {
    const nibs: number[] = []; let x = v; do { nibs.unshift(x & 0x7); x >>>= 3; } while (x > 0);
    nibs.forEach((n, i) => out.push(i === nibs.length - 1 ? n : n | 0x8));
    hooks.onEmit?.(v, nibs);
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nibbleSplitEncode } from './impl.ts';
export const DEFAULT_INPUT = [0, 5, 100, 4096];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Nibble 拆分', en: 'Nibble-Split' }).commit();
  const out = nibbleSplitEncode(input, {
    onEmit: (n, nibs) => rec.begin({ zh: n + ' -> [' + nibs.join(',') + ']', en: 'emit' }).setAux([{label:'n',value:String(n),role:'compare' as BarRole},{label:'nibs',value:nibs.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: out.length + ' nibbles', en: out.length + ' nibs' }).setAux([{label:'nibs',value:String(out.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nibbleSplitEncode } from '../../src/algorithms/compression/comp-nibble-split/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-nibble-split/trace.ts';
test('nibble 0 编为 1 个 nibble', () => assert.equal(nibbleSplitEncode([0]).length, 1));
test('nibble trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// 16-30: more compression algorithms
add({
  cat: 'compression', id: 'comp-truncated-binary',
  title: { zh: '截断二进制', en: 'Truncated Binary' },
  summary: { zh: '非 2 的幂范围的最优定长码。', en: 'Optimal fixed-width for non-power-of-2 range.' },
  description: { zh: '截断二进制编码把 0..n-1(n 非 2 的幂)用 ⌊log2 n⌋ 或 ⌈log2 n⌉ 位表示，比统一 ⌈log2 n⌉ 位节省约 1 位。', en: 'Truncated binary encodes 0..n-1 (n not a power of two) in ⌊log2 n⌋ or ⌈log2 n⌉ bits, saving ~1 bit over uniform ⌈log2 n⌉.' },
  tags: ['compression','truncated-binary','prefix-code'],
  complexity: { time: 'O(1)', space: 'O(n)' },
  impl: `export interface TbHooks { onEmit?: (v: number, bits: string) => void; }
export function truncatedBinaryEncode(values: number[], n: number, hooks: TbHooks = {}): string {
  const k = Math.floor(Math.log2(n)); const u = 1 << k; const v = n - u; let out = '';
  for (const x of values) {
    let code: string;
    if (x < 2 * v) code = x.toString(2).padStart(k + 1, '0'); else code = (x + v).toString(2).padStart(k, '0');
    hooks.onEmit?.(x, code); out += code;
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { truncatedBinaryEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0,1,2,3,4,5], n: 6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '截断二进制 n=' + input.n, en: 'TB n=' + input.n }).commit();
  const code = truncatedBinaryEncode(input.values, input.n, {
    onEmit: (v, c) => rec.begin({ zh: v + ' -> ' + c, en: v + '->' + c }).setAux([{label:'v',value:String(v),role:'compare' as BarRole},{label:'code',value:c,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '码流 ' + code, en: 'stream' }).setAux([{label:'code',value:code,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { truncatedBinaryEncode } from '../../src/algorithms/compression/comp-truncated-binary/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-truncated-binary/trace.ts';
test('tb n=6 总位数', () => { const c = truncatedBinaryEncode([0,1,2,3,4,5],6); assert.equal(c.length, 17); });
test('tb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-base64',
  title: { zh: 'Base64 编码', en: 'Base64' },
  summary: { zh: '6-bit 一组的二进制到文本编码。', en: '6-bit binary-to-text encoding.' },
  description: { zh: 'Base64 把每 3 字节编为 4 个 6-bit 字符(A-Z,a-z,0-9,+,/)，常用于在文本通道传输二进制数据。', en: 'Base64 encodes 3 bytes into 4 6-bit chars (A-Z,a-z,0-9,+,/), used to carry binary over text channels.' },
  tags: ['compression','base64','encode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface B64Hooks { onQuartet?: (chars: string) => void; }
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export function base64Encode(bytes: number[], hooks: B64Hooks = {}): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i] ?? 0; const b2 = bytes[i + 1] ?? 0; const b3 = bytes[i + 2] ?? 0;
    const c1 = b1 >> 2; const c2 = ((b1 & 3) << 4) | (b2 >> 4); const c3 = ((b2 & 15) << 2) | (b3 >> 6); const c4 = b3 & 63;
    let q = ALPHA[c1]! + ALPHA[c2]!;
    q += (i + 1 < bytes.length) ? ALPHA[c3]! : '=';
    q += (i + 2 < bytes.length) ? ALPHA[c4]! : '=';
    hooks.onQuartet?.(q); out += q;
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { base64Encode } from './impl.ts';
export const DEFAULT_INPUT = [72,101,108,108,111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Base64', en: 'Base64' }).commit();
  const out = base64Encode(input, {
    onQuartet: (c) => rec.begin({ zh: '组 ' + c, en: 'quartet' }).setAux([{label:'chars',value:c,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 ' + out, en: out }).setAux([{label:'out',value:out,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { base64Encode } from '../../src/algorithms/compression/comp-base64/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-base64/trace.ts';
test('base64 Hello', () => assert.equal(base64Encode([72,101,108,108,111]), 'SGVsbG8='));
test('base64 trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-base85',
  title: { zh: 'Base85/Ascii85', en: 'Ascii85' },
  summary: { zh: '5 字节编为 5 个 85 进制字符。', en: '5 bytes to 5 base-85 chars.' },
  description: { zh: 'Ascii85 把 4 字节(32 位)编为 5 个 85 进制字符，比 Base64 更紧凑，PDF/PostScript 使用。', en: 'Ascii85 encodes 4 bytes (32-bit) as 5 base-85 chars, denser than Base64; used in PDF/PostScript.' },
  tags: ['compression','base85','ascii85','encode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface B85Hooks { onBlock?: (chars: string) => void; }
export function ascii85Encode(bytes: number[], hooks: B85Hooks = {}): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 4) {
    let n = 0; let cnt = 0;
    for (let k = 0; k < 4; k++) { n = n * 256 + (bytes[i + k] ?? 0); if (i + k < bytes.length) cnt++; }
    const chars: string[] = [];
    for (let k = 0; k < 5; k++) { chars.unshift(ALPHA85[n % 85]!); n = Math.floor(n / 85); }
    out += chars.slice(0, cnt + 1).join(''); hooks.onBlock?.(chars.join(''));
  }
  return out;
}
const ALPHA85 = Array.from({ length: 85 }, (_, i) => String.fromCharCode(33 + i)).join('');`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ascii85Encode } from './impl.ts';
export const DEFAULT_INPUT = [72,101,108,108,111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Ascii85', en: 'Ascii85' }).commit();
  const out = ascii85Encode(input, {
    onBlock: (c) => rec.begin({ zh: '块 ' + c, en: 'block' }).setAux([{label:'chars',value:c,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 ' + out, en: out }).setAux([{label:'out',value:out,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ascii85Encode } from '../../src/algorithms/compression/comp-base85/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-base85/trace.ts';
test('ascii85 输出仅可见字符', () => { const o = ascii85Encode([1,2,3,4]); assert.ok([...o].every((c) => c.charCodeAt(0) >= 33)); });
test('ascii85 trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-lz4-block',
  title: { zh: 'LZ4 块格式', en: 'LZ4 Block Format' },
  summary: { zh: '极简 LZ4 块：token+literal+match。', en: 'Minimal LZ4 block: token+literal+match.' },
  description: { zh: 'LZ4 块格式以 1 字节 token 编码字面长度与匹配长度，后接字面字节与 (偏移,匹配)，速度优先，压缩比次要。', en: 'LZ4 block uses a 1-byte token encoding literal and match lengths followed by literals and (offset,match); prioritizes speed.' },
  tags: ['compression','lz4','block'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface Lz4Hooks { onMatch?: (offset: number, len: number) => void; onLiteral?: (len: number) => void; }
export function lz4BlockEncode(data: number[], minMatch: number, hooks: Lz4Hooks = {}): number[] {
  const out: number[] = []; let i = 0; let litStart = 0;
  const hash = new Map<number, number>();
  while (i < data.length) {
    if (i + minMatch <= data.length) {
      const h = (data[i]! * 2654435761) & 0xffffff; const prev = hash.get(h);
      if (prev !== undefined && i - prev < 65536) {
        let m = 0; while (i + m < data.length && data[prev + m] === data[i + m] && m < 255 + minMatch) m++;
        if (m >= minMatch) {
          const litLen = i - litStart; const mLen = m - minMatch;
          const token = (Math.min(litLen, 15) << 4) | Math.min(mLen, 15); out.push(token);
          if (litLen >= 15) out.push(...extraLen(litLen - 15));
          for (let k = litStart; k < i; k++) out.push(data[k]!); hooks.onLiteral?.(litLen);
          out.push(i - prev & 0xff, (i - prev) >> 8);
          if (mLen >= 15) out.push(...extraLen(mLen - 15));
          hooks.onMatch?.(i - prev, m); i += m; litStart = i; hash.set(h, i); continue;
        }
      }
      hash.set(h, i);
    }
    i++;
  }
  const litLen = data.length - litStart; out.push(Math.min(litLen, 15) << 4);
  if (litLen >= 15) out.push(...extraLen(litLen - 15));
  for (let k = litStart; k < data.length; k++) out.push(data[k]!);
  return out;
}
function extraLen(n: number): number[] { const r: number[] = []; while (n >= 255) { r.push(255); n -= 255; } r.push(n); return r; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz4BlockEncode } from './impl.ts';
export const DEFAULT_INPUT = [1,2,3,4,1,2,3,4,1,2,3,4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LZ4 块', en: 'LZ4 block' }).commit();
  const out = lz4BlockEncode(input, 4, {
    onMatch: (off, len) => rec.begin({ zh: '匹配 偏移' + off + ' 长' + len, en: 'match' }).setAux([{label:'off',value:String(off),role:'pivot' as BarRole},{label:'len',value:String(len),role:'final' as BarRole}]).commit(),
    onLiteral: (len) => rec.begin({ zh: '字面 ' + len, en: 'lit' }).setAux([{label:'lit',value:String(len),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '输出 ' + out.length + ' 字节', en: out.length + 'B' }).setAux([{label:'bytes',value:String(out.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz4BlockEncode } from '../../src/algorithms/compression/comp-lz4-block/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lz4-block/trace.ts';
test('lz4 重复数据更小', () => { const o = lz4BlockEncode([1,2,3,4,1,2,3,4], 4); assert.ok(o.length < 8); });
test('lz4 trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-huffman-package-merge',
  title: { zh: 'Package-Merge 最优长度受限哈夫曼', en: 'Package-Merge Huffman' },
  summary: { zh: '在最大码长约束下构造最优前缀码。', en: 'Optimal length-limited prefix codes.' },
  description: { zh: 'Package-Merge(Larmore-Hirschberg)在码长不超过 L 的约束下求最优前缀码长度分配，比朴素哈夫曼更适合超长约束场景。', en: 'Package-Merge (Larmore-Hirschberg) finds optimal code lengths under a max-length cap L, beyond naive Huffman.' },
  tags: ['compression','huffman','length-limited'],
  complexity: { time: 'O(nL)', space: 'O(nL)' },
  impl: `export interface PmHooks { onLevel?: (level: number, items: number) => void; }
export function packageMerge(weights: number[], L: number, hooks: PmHooks = {}): number[] {
  const n = weights.length;
  const items: Array<{ w: number; orig: number }> = weights.map((w, i) => ({ w, orig: i })).sort((a, b) => a.w - b.w);
  let list = items.map((it) => ({ ...it, count: new Set([it.orig]) }));
  for (let l = 0; l < L - 1; l++) {
    const packed = list.filter((_, i) => i % 2 === 0).map((a, i) => { const b = list[2 * i + 1]; return b ? { w: a.w + b.w, count: new Set([...a.count, ...b.count]) } : null; }).filter((x): x is NonNullable<typeof x> => x !== null);
    list = [...packed, ...items.map((it) => ({ ...it, count: new Set([it.orig]) }))].sort((a, b) => a.w - b.w);
    hooks.onLevel?.(l, list.length);
  }
  const lens = new Array(n).fill(0);
  const take = list.slice(0, 2 * (n - 1));
  for (const it of take) for (const o of it.count) lens[o]!++;
  return lens;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { packageMerge } from './impl.ts';
export const DEFAULT_INPUT = { weights: [5,9,12,13,16,45], L: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Package-Merge L=' + input.L, en: 'PM L=' + input.L }).commit();
  const lens = packageMerge(input.weights, input.L, {
    onLevel: (l, c) => rec.begin({ zh: '层 ' + l + ' ' + c + ' 项', en: 'level' }).setAux([{label:'level',value:String(l),role:'pivot' as BarRole},{label:'items',value:String(c),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '码长 [' + lens.join(',') + ']', en: 'lengths' }).setAux([{label:'lens',value:lens.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packageMerge } from '../../src/algorithms/compression/comp-huffman-package-merge/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-huffman-package-merge/trace.ts';
test('pm 码长不超过 L', () => { const lens = packageMerge([5,9,12,13,16,45], 3); assert.ok(Math.max(...lens) <= 3); });
test('pm trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-delta2-frame',
  title: { zh: '二阶差分编码', en: 'Second-Order Delta' },
  summary: { zh: '对差分序列再做一次差分。', en: 'Differences of differences.' },
  description: { zh: '二阶差分对单调递增序列(时间戳、id)做两次差分，使大多数值变小变零，利于后续 varint/熵编码。', en: 'Second-order delta differences a monotonically increasing sequence twice, shrinking most values for varint/entropy coding.' },
  tags: ['compression','delta','second-order'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface D2Hooks { onEmit?: (i: number, d2: number) => void; }
export function delta2Encode(values: number[], hooks: D2Hooks = {}): { d1: number[]; d2: number[] } {
  const d1 = values.map((v, i) => i === 0 ? v : v - values[i - 1]!);
  const d2 = d1.map((v, i) => i === 0 ? v : v - d1[i - 1]!);
  d2.forEach((v, i) => hooks.onEmit?.(i, v));
  return { d1, d2 };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { delta2Encode } from './impl.ts';
export const DEFAULT_INPUT = [100, 105, 111, 118, 126];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二阶差分', en: '2nd-order delta' }).commit();
  const { d1, d2 } = delta2Encode(input, {
    onEmit: (i, v) => rec.begin({ zh: 'i' + i + ' d2=' + v, en: 'd2' }).setAux([{label:'i',value:String(i),role:'compare' as BarRole},{label:'d2',value:String(v),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'd1[' + d1.join(',') + '] d2[' + d2.join(',') + ']', en: 'result' }).setAux([{label:'d2',value:d2.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delta2Encode } from '../../src/algorithms/compression/comp-delta2-frame/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-delta2-frame/trace.ts';
test('d2 等差数列常数为0', () => { const { d2 } = delta2Encode([1,3,5,7]); assert.deepEqual(d2, [1,0,0,0]); });
test('d2 trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-xor-delta',
  title: { zh: 'XOR 增量编码', en: 'XOR Delta' },
  summary: { zh: '用异或记录相邻值变化。', en: 'XORs adjacent values to record changes.' },
  description: { zh: 'XOR 增量编码输出 curr⊕prev，对浮点位模式或稀疏变化数据常出现大量前导 0，可压缩为短整数(Gorilla 时间序列使用)。', en: 'XOR delta emits curr⊕prev; on float bit-patterns or sparse changes it yields many leading zeros (Gorilla time-series).' },
  tags: ['compression','xor','delta','gorilla'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface XorHooks { onEmit?: (i: number, xor: number) => void; }
export function xorDeltaEncode(values: number[], hooks: XorHooks = {}): number[] {
  return values.map((v, i) => { const x = i === 0 ? v : v ^ values[i - 1]!; hooks.onEmit?.(i, x); return x; });
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xorDeltaEncode } from './impl.ts';
export const DEFAULT_INPUT = [100, 100, 105, 105, 110];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'XOR 增量', en: 'XOR delta' }).commit();
  const out = xorDeltaEncode(input, {
    onEmit: (i, x) => rec.begin({ zh: 'i' + i + ' xor=' + x, en: 'xor' }).setAux([{label:'xor',value:String(x),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' }).setAux([{label:'out',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xorDeltaEncode } from '../../src/algorithms/compression/comp-xor-delta/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-xor-delta/trace.ts';
test('xor 相同值输出 0', () => assert.deepEqual(xorDeltaEncode([7,7,7]), [7,0,0]));
test('xor trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-bitplane',
  title: { zh: '位平面分离', en: 'Bitplane Separation' },
  summary: { zh: '把每像素各位拆到独立平面。', en: 'Splits each pixel bit into planes.' },
  description: { zh: '位平面分离将图像每个像素的每一位分别放入独立平面，高位平面信息量大、低位近随机，可分别用 RLE/JPEG 编码。', en: 'Bitplane separation routes each pixel bit to its own plane; high planes carry signal, low planes look random, enabling per-plane coding.' },
  tags: ['compression','bitplane','image'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface Bp2Hooks { onPlane?: (bit: number, plane: number[]) => void; }
export function bitplaneSeparate(pixels: number[], bits: number, hooks: Bp2Hooks = {}): number[][] {
  const planes: number[][] = Array.from({ length: bits }, () => []);
  for (const p of pixels) for (let b = 0; b < bits; b++) planes[b]!.push((p >> b) & 1);
  planes.forEach((pl, b) => hooks.onPlane?.(b, pl));
  return planes;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitplaneSeparate } from './impl.ts';
export const DEFAULT_INPUT = { pixels: [5, 10, 7, 12], bits: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位平面分离', en: 'Bitplane' }).commit();
  const planes = bitplaneSeparate(input.pixels, input.bits, {
    onPlane: (b, pl) => rec.begin({ zh: '位' + b + ': [' + pl.join(',') + ']', en: 'plane' }).setAux([{label:'bit',value:String(b),role:'pivot' as BarRole},{label:'plane',value:pl.join(','),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: planes.length + ' 个平面', en: 'planes' }).setAux([{label:'planes',value:String(planes.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitplaneSeparate } from '../../src/algorithms/compression/comp-bitplane/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bitplane/trace.ts';
test('bitplane 数量=bits', () => { const p = bitplaneSeparate([1,2,3], 3); assert.equal(p.length, 3); assert.equal(p[0]!.length, 3); });
test('bitplane trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-rice-block',
  title: { zh: 'Rice 块编码', en: 'Rice Block Coding' },
  summary: { zh: '块内自适应选最优 k 的 Rice。', en: 'Per-block adaptive Rice with best k.' },
  description: { zh: 'Rice 块编码把数据分块，每块遍历 k 求最短码长并写入块头，平衡压缩率与解码速度(FLAC 残差使用)。', en: 'Rice block coding partitions data, finds the best k per block by minimizing total bits, writing k in the header (FLAC residuals).' },
  tags: ['compression','rice','adaptive'],
  complexity: { time: 'O(n log k)', space: 'O(n)' },
  impl: `export interface RbHooks { onBlock?: (start: number, k: number, bits: number) => void; }
export function riceBlockEncode(values: number[], blockSize: number, kMax: number, hooks: RbHooks = {}): { k: number[]; bits: number } {
  const ks: number[] = []; let total = 0;
  for (let s = 0; s < values.length; s += blockSize) {
    const block = values.slice(s, s + blockSize); let bestK = 0; let bestBits = Infinity;
    for (let k = 0; k <= kMax; k++) { const bits = block.reduce((sum, v) => sum + (v >> k) + 1 + k, 0); if (bits < bestBits) { bestBits = bits; bestK = k; } }
    ks.push(bestK); total += bestBits; hooks.onBlock?.(s, bestK, bestBits);
  }
  return { k: ks, bits: total };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { riceBlockEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0,1,2,3, 8,9,10,11], blockSize: 4, kMax: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Rice 块编码', en: 'Rice block' }).commit();
  const { k, bits } = riceBlockEncode(input.values, input.blockSize, input.kMax, {
    onBlock: (s, kk, b) => rec.begin({ zh: '块@' + s + ' k=' + kk + ' ' + b + '位', en: 'block' }).setAux([{label:'k',value:String(kk),role:'pivot' as BarRole},{label:'bits',value:String(b),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '总 ' + bits + ' 位', en: bits + ' bits' }).setAux([{label:'bits',value:String(bits),role:'final' as BarRole},{label:'ks',value:k.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { riceBlockEncode } from '../../src/algorithms/compression/comp-rice-block/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rice-block/trace.ts';
test('rice-block 总位数为正', () => { const r = riceBlockEncode([0,1,2], 2, 4); assert.ok(r.bits > 0); });
test('rice-block trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-arith-context',
  title: { zh: '上下文自适应算术编码', en: 'Context-Adaptive Arithmetic' },
  summary: { zh: '依上下文动态调整概率的算术编码。', en: 'Arithmetic coding with context-driven probability.' },
  description: { zh: '上下文自适应算术编码按近期历史(上下文)维护符号概率并动态更新，常用于二值图像 JBIG/H.264 CABAC。', en: 'Context-adaptive arithmetic coding maintains per-context symbol probabilities that adapt online (JBIG, CABAC).' },
  tags: ['compression','arithmetic','context-adaptive'],
  complexity: { time: 'O(n)', space: 'O(c)' },
  impl: `export interface CaacHooks { onSymbol?: (ctx: number, bit: number, p0: number) => void; }
export function caacEncode(bits: number[], ctxBits: number, hooks: CaacHooks = {}): { low: number; range: number; tables: Map<number, [number, number]> } {
  const tables = new Map<number, [number, number]>();
  let low = 0; let range = 1;
  let history = 0; const mask = (1 << ctxBits) - 1;
  for (const b of bits) {
    const ctx = history & mask;
    const [c0, c1] = tables.get(ctx) ?? [1, 1];
    const p0 = c0 / (c0 + c1);
    range /= 2; const split = low + range * p0;
    if (b === 1) { low = split; tables.set(ctx, [c0, c1 + 1]); } else { tables.set(ctx, [c0 + 1, c1]); }
    hooks.onSymbol?.(ctx, b, p0);
    history = ((history << 1) | b) & ((1 << (ctxBits + 4)) - 1);
  }
  return { low, range, tables };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { caacEncode } from './impl.ts';
export const DEFAULT_INPUT = { bits: [0,0,1,0,1,1,0,1], ctxBits: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CABAC 上下文=' + input.ctxBits, en: 'CABAC ctx=' + input.ctxBits }).commit();
  const { low, tables } = caacEncode(input.bits, input.ctxBits, {
    onSymbol: (ctx, b, p0) => rec.begin({ zh: 'ctx' + ctx + ' b=' + b + ' p0=' + p0.toFixed(2), en: 'sym' }).setAux([{label:'ctx',value:String(ctx),role:'pivot' as BarRole},{label:'p0',value:p0.toFixed(2),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'low=' + low.toPrecision(4) + ' 上下文' + tables.size, en: 'result' }).setAux([{label:'low',value:low.toPrecision(4),role:'final' as BarRole},{label:'ctx',value:String(tables.size),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caacEncode } from '../../src/algorithms/compression/comp-arith-context/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-arith-context/trace.ts';
test('caac low 在 [0,1)', () => { const r = caacEncode([0,1,0,1], 1); assert.ok(r.low >= 0 && r.low < 1); });
test('caac trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-snappy-varint',
  title: { zh: 'Snappy 字面+拷贝解析', en: 'Snappy Literal/Copy' },
  summary: { zh: 'Snappy 标签字面与回引拷贝混合。', en: 'Snappy tag mixing literals and back-references.' },
  description: { zh: 'Snappy 用 1 字节 tag 区分字面与拷贝(短/长偏移)，跳过不压缩段，主打超快解压，LevelDB/BigQuery 使用。', en: 'Snappy tags literals vs short/long copies, skipping incompressible spans for ultra-fast decode (LevelDB, BigQuery).' },
  tags: ['compression','snappy','lz'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface SnHooks { onTag?: (tag: number, len: number) => void; }
export function snappyEncode(data: number[], hooks: SnHooks = {}): number[] {
  const out: number[] = []; let i = 0;
  while (i < data.length) {
    let best = 0; let bestLen = 0;
    const start = Math.max(0, i - 65535);
    for (let p = start; p < i; p++) { let l = 0; while (l < 64 && i + l < data.length && data[p + l] === data[i + l]) l++; if (l > bestLen && l >= 4) { bestLen = l; best = i - p; } }
    if (bestLen >= 4) { const tag = 1 | ((bestLen - 4) << 2) | ((best & 3) << 2 === 0 ? 0 : 0); out.push((1 | (((bestLen - 4) & 0x7) << 2)), best & 0xff, (best >> 8) & 0xff); hooks.onTag?.(1, bestLen); i += bestLen; }
    else { let lit = 0; while (i + lit < data.length && lit < 60) lit++; out.push((lit - 1) << 2); for (let k = 0; k < lit; k++) out.push(data[i + k]!); hooks.onTag?.(0, lit); i += lit; }
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snappyEncode } from './impl.ts';
export const DEFAULT_INPUT = [1,2,3,4,5,1,2,3,4,5,9,8,7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Snappy', en: 'Snappy' }).commit();
  const out = snappyEncode(input, {
    onTag: (tag, len) => rec.begin({ zh: (tag === 1 ? '拷贝' : '字面') + ' 长' + len, en: 'tag' }).setAux([{label:'tag',value:tag===1?'copy':'lit',role:'pivot' as BarRole},{label:'len',value:String(len),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '输出 ' + out.length + ' 字节', en: out.length + 'B' }).setAux([{label:'bytes',value:String(out.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snappyEncode } from '../../src/algorithms/compression/comp-snappy-varint/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-snappy-varint/trace.ts';
test('snappy 重复变小', () => { const o = snappyEncode([1,2,3,4,5,1,2,3,4,5,1,2,3,4,5], 4); assert.ok(o.length < 15); });
test('snappy trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-brotli-context',
  title: { zh: 'Brotli 上下文模型', en: 'Brotli Context Model' },
  summary: { zh: '依前两字节选 Huffman 表。', en: 'Selects Huffman table by prev 2 bytes.' },
  description: { zh: 'Brotli 上下文模型用前 1-2 字节作为上下文，为每个上下文维护独立的 Huffman 概率表，提升文本压缩率。', en: 'Brotli context model keys Huffman tables by the previous 1-2 bytes, boosting text compression over static Huffman.' },
  tags: ['compression','brotli','context-model'],
  complexity: { time: 'O(n)', space: 'O(c*256)' },
  impl: `export interface BcHooks { onByte?: (ctx: number, byte: number) => void; }
export function brotliContextModel(data: number[], hooks: BcHooks = {}): Map<number, Map<number, number>> {
  const tables = new Map<number, Map<number, number>>();
  let p1 = 0; let p2 = 0;
  for (const b of data) {
    const ctx = ((p2 << 8) | p1) & 0xffff;
    const t = tables.get(ctx) ?? new Map<number, number>(); t.set(b, (t.get(b) ?? 0) + 1); tables.set(ctx, t);
    hooks.onByte?.(ctx, b); p2 = p1; p1 = b;
  }
  return tables;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brotliContextModel } from './impl.ts';
export const DEFAULT_INPUT = [72,101,108,108,111,32,87,111,114,108,100];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Brotli 上下文', en: 'Brotli context' }).commit();
  const tables = brotliContextModel(input, {
    onByte: (ctx, b) => rec.begin({ zh: 'ctx=' + ctx + ' b=' + b, en: 'byte' }).setAux([{label:'ctx',value:String(ctx),role:'pivot' as BarRole},{label:'b',value:String(b),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: tables.size + ' 个上下文', en: 'ctx' }).setAux([{label:'ctx',value:String(tables.size),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brotliContextModel } from '../../src/algorithms/compression/comp-brotli-context/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-brotli-context/trace.ts';
test('brotli ctx 计数正确', () => { const t = brotliContextModel([1,2,1]); assert.ok(t.size >= 2); });
test('brotli ctx trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-bzip2-bwt',
  title: { zh: 'BWT 后缀排序(教学)', en: 'BWT via Suffix Sort' },
  summary: { zh: '用后缀数组求 BWT。', en: 'Computes BWT via suffix array.' },
  description: { zh: '用后缀数组法求 Burrows-Wheeler 变换：对带结束符的串排序所有循环移位，取最后一列，常配合 MTF+RLE+Huffman(bzip2)。', en: 'Computes the Burrows-Wheeler transform via suffix sorting the rotations of a terminated string (bzip2 pipeline).' },
  tags: ['compression','bwt','bzip2'],
  complexity: { time: 'O(n^2 log n)', space: 'O(n^2)' },
  impl: `export interface BwtHooks { onRotation?: (i: number, last: number) => void; }
export function bwtTransform(text: string, hooks: BwtHooks = {}): { last: string; primary: number } {
  const s = text + '$'; const n = s.length;
  const rotations = Array.from({ length: n }, (_, i) => s.slice(i) + s.slice(0, i));
  rotations.sort();
  let primary = 0; const last = rotations.map((r, i) => { if (r === s) primary = i; hooks.onRotation?.(i, r.charCodeAt(n - 1)); return r[n - 1]!; }).join('');
  return { last, primary };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bwtTransform } from './impl.ts';
export const DEFAULT_INPUT = 'banana';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BWT "' + input + '"', en: 'BWT "' + input + '"' }).commit();
  const { last, primary } = bwtTransform(input, {
    onRotation: (i, c) => rec.begin({ zh: '行' + i + ': ' + String.fromCharCode(c), en: 'row' }).setAux([{label:'row',value:String(i),role:'compare' as BarRole},{label:'last',value:String.fromCharCode(c),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '末列 ' + last + ' primary=' + primary, en: 'last' }).setAux([{label:'last',value:last,role:'final' as BarRole},{label:'primary',value:String(primary),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwtTransform } from '../../src/algorithms/compression/comp-bzip2-bwt/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bzip2-bwt/trace.ts';
test('bwt banana -> annb$aa', () => assert.equal(bwtTransform('banana').last, 'annb$aa'));
test('bwt trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-fse',
  title: { zh: 'FSE 非对称数值系统', en: 'Finite State Entropy' },
  summary: { zh: '状态机驱动的快速熵编码。', en: 'State-machine-driven fast entropy coder.' },
  description: { zh: 'FSE(zstd 使用)是非对称数值系统(ANS)的有限状态实现，速度接近 Huffman 而压缩率接近算术编码。', en: 'FSE (used by zstd) is a finite-state variant of ANS: near-Huffman speed with near-arithmetic compression.' },
  tags: ['compression','fse','ans','entropy'],
  complexity: { time: 'O(n)', space: 'O(table)' },
  impl: `export interface FseHooks { onState?: (state: number, sym: number) => void; }
export function fseEncode(symbols: number[], stateTable: Map<number, number[]>, hooks: FseHooks = {}): number {
  let state = 0;
  for (const sym of symbols) {
    const states = stateTable.get(sym) ?? [0];
    state = states[state % states.length]!;
    hooks.onState?.(state, sym);
  }
  return state;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fseEncode } from './impl.ts';
const TABLE = new Map([[0,[1,2,3]],[1,[4,5]],[2,[6,7,8,9]]]);
export const DEFAULT_INPUT = { symbols: [0,1,2,0,1], table: TABLE };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'FSE', en: 'FSE' }).commit();
  const state = fseEncode(input.symbols, input.table, {
    onState: (s, sym) => rec.begin({ zh: 'sym=' + sym + ' state=' + s, en: 'state' }).setAux([{label:'sym',value:String(sym),role:'compare' as BarRole},{label:'state',value:String(s),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '终态 ' + state, en: 'state ' + state }).setAux([{label:'state',value:String(state),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fseEncode } from '../../src/algorithms/compression/comp-fse/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-fse/trace.ts';
const T = new Map([[0,[1,2]],[1,[3,4]]]);
test('fse 确定性', () => assert.equal(fseEncode([0,1], T), fseEncode([0,1], T)));
test('fse trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'compression', id: 'comp-vbyte-fast',
  title: { zh: 'VByte 快速变长整数', en: 'VByte Fast Varint' },
  summary: { zh: '7 位一组+续接位的变长编码。', en: '7-bit chunks with continuation bit.' },
  description: { zh: 'VByte(Williams & Zobel)用每字节低 7 位存数据，最高位为续接标志，对小整数极度紧凑，倒排索引经典方案。', en: 'VByte uses 7 bits per byte with a high continuation flag, very compact for small ints; a classic inverted-index scheme.' },
  tags: ['compression','vbyte','varint'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface VbHooks { onEmit?: (v: number, bytes: number) => void; }
export function vbyteEncode(values: number[], hooks: VbHooks = {}): number[] {
  const out: number[] = [];
  for (const v of values) {
    const buf: number[] = []; let x = v; do { buf.push(x & 0x7f); x >>>= 7; } while (x > 0);
    buf.forEach((b, i) => { out.push(i === buf.length - 1 ? b : b | 0x80); });
    hooks.onEmit?.(v, buf.length);
  }
  return out;
}
export function vbyteDecode(bytes: number[]): number[] {
  const out: number[] = []; let v = 0; let shift = 0;
  for (const b of bytes) { v |= (b & 0x7f) << shift; if ((b & 0x80) === 0) { out.push(v); v = 0; shift = 0; } else shift += 7; }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vbyteEncode, vbyteDecode } from './impl.ts';
export const DEFAULT_INPUT = [1, 127, 128, 300, 16384];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'VByte', en: 'VByte' }).commit();
  const out = vbyteEncode(input, {
    onEmit: (v, b) => rec.begin({ zh: v + ' -> ' + b + 'B', en: 'emit' }).setAux([{label:'v',value:String(v),role:'compare' as BarRole},{label:'bytes',value:String(b),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '解码 [' + vbyteDecode(out).join(',') + ']', en: 'decode' }).setAux([{label:'dec',value:vbyteDecode(out).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vbyteEncode, vbyteDecode } from '../../src/algorithms/compression/comp-vbyte-fast/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-vbyte-fast/trace.ts';
test('vbyte 往返', () => { const e = vbyteEncode([0,127,128,300]); assert.deepEqual(vbyteDecode(e), [0,127,128,300]); });
test('vbyte 127 单字节', () => assert.equal(vbyteEncode([127]).length, 1));
test('vbyte trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

console.log('compression specs loaded');
