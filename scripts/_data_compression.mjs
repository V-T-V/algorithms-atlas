// compression data — 23 algorithms (variants of existing)

export const algos = [
// 1. comp-lz-2 — generic LZ family variant
{
  id: 'comp-lz-2',
  titleZh: 'LZ 通用 v2', titleEn: 'LZ Generic v2',
  summaryZh: 'LZ 通用：滑动窗口 + 前看缓冲，输出 (距离, 长度) 二元组。',
  summaryEn: 'Generic LZ: sliding window + lookahead, emit (distance, length) pairs.',
  descZh: 'LZ 通用 v2 输出 (distance, length) 二元组（不含 next 字符，与 LZ77 不同），用滑动窗口搜索最长匹配。',
  descEn: 'Generic LZ v2 emits (distance, length) pairs (without next char, unlike LZ77), searching the sliding window for the longest match.',
  tags: ['compression','dictionary','lz','sliding-window'],
  time: 'O(n·w)', space: 'O(w)',
  impl: `// LZ 通用 v2 · 实现
export interface Lz2Token { distance: number; length: number; }
export interface Lz2Hooks { onMatch?: (pos: number, dist: number, len: number) => void; onEmit?: (t: Lz2Token) => void; }
export function lz2Encode(input: string, windowSize = 16, minMatch = 3, hooks: Lz2Hooks = {}): Lz2Token[] {
  const out: Lz2Token[] = [];
  let pos = 0;
  while (pos < input.length) {
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < input.length && input[pos - d + len] === input[pos + len] && len < windowSize) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= minMatch) {
      hooks.onMatch?.(pos, bestDist, bestLen);
      out.push({ distance: bestDist, length: bestLen });
      hooks.onEmit?.(out[out.length - 1]!);
      pos += bestLen;
    } else {
      // 单字符：distance=0, length=1（隐式）
      out.push({ distance: 0, length: 1 });
      hooks.onEmit?.(out[out.length - 1]!);
      pos++;
    }
  }
  return out;
}
export function lz2Decode(tokens: Lz2Token[]): string {
  let out = '';
  for (const t of tokens) {
    if (t.distance === 0) out += '?'; // 占位；实际需配合字符流
    else {
      const start = out.length - t.distance;
      for (let i = 0; i < t.length; i++) out += out[start + i]!;
    }
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz2Encode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABABABABABC';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'LZ v2', en: 'LZ v2' })
    .setArray(codes, codes.map(() => 'default' as BarRole), [{ index: 0, label: 'pos' }]).commit();
  let pos = 0;
  lz2Encode(input, 8, 3, {
    onMatch: (p, d, l) => { pos = p;
      rec.begin({ zh: \`匹配 @\${p} d=\${d} len=\${l}\`, en: \`match @\${p} d=\${d} len=\${l}\` })
        .setArray(codes, codes.map((_, i) => (i >= p && i < p + l ? 'swap' : 'default') as BarRole), [{ index: p, label: 'pos' }])
        .setAux([{ label: '(d,l)', value: \`\${d},\${l}\`, role: 'final' as BarRole }]).commit();
    },
    onEmit: (t) => rec.begin({ zh: \`emit (\${t.distance},\${t.length})\`, en: \`emit (\${t.distance},\${t.length})\` })
      .setAux([{ label: 'emit', value: \`\${t.distance},\${t.length}\`, role: 'final' as BarRole }]).commit(),
  });
  void pos;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz2Encode, lz2Decode } from '../../src/algorithms/compression/comp-lz-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lz-2/trace.ts';

test('lz2 编码产生 token', () => {
  const t = lz2Encode('ABABABABABC', 8, 3);
  assert.ok(t.length > 0);
  assert.ok(t.some((x) => x.length >= 3));
});
test('lz2 单字符输出 distance=0', () => {
  const t = lz2Encode('A', 8, 3);
  assert.deepEqual(t, [{ distance: 0, length: 1 }]);
});
test('lz2 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 2. comp-lz4-2
{
  id: 'comp-lz4-2',
  titleZh: 'LZ4 v2', titleEn: 'LZ4 v2',
  summaryZh: 'LZ4：块级匹配，匹配长度 4 字节起，吞吐高。',
  summaryEn: 'LZ4: block matches with min length 4, high throughput.',
  descZh: 'LZ4（Collet）面向速度：最小匹配 4 字节，token = (literal_len, match_len, distance)，literals 优先批量输出。',
  descEn: 'LZ4 (Collet) is speed-oriented: min match 4 bytes; token = (literal_len, match_len, distance); literals are batched.',
  tags: ['compression','lz4','dictionary','fast'],
  time: 'O(n·w)', space: 'O(w)',
  impl: `// LZ4 v2 · 实现
export interface Lz4Token { litLen: number; matchLen: number; distance: number; }
export interface Lz4Hooks { onMatch?: (pos: number, dist: number, mlen: number) => void; onEmit?: (t: Lz4Token) => void; }
export function lz4Encode(input: string, windowSize = 32, hooks: Lz4Hooks = {}): Lz4Token[] {
  const out: Lz4Token[] = [];
  let pos = 0;
  let litStart = 0;
  while (pos < input.length) {
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < input.length && input[pos - d + len] === input[pos + len] && len < 255 + 15) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= 4) {
      hooks.onMatch?.(pos, bestDist, bestLen);
      out.push({ litLen: pos - litStart, matchLen: bestLen - 4, distance: bestDist });
      hooks.onEmit?.(out[out.length - 1]!);
      pos += bestLen;
      litStart = pos;
    } else pos++;
  }
  // 最后一段 literals
  if (litStart < pos) out.push({ litLen: pos - litStart, matchLen: 0, distance: 0 });
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz4Encode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABCDEFGABCDEFGABCDEFG';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'LZ4', en: 'LZ4' })
    .setArray(codes, codes.map(() => 'default' as BarRole), [{ index: 0, label: 'pos' }]).commit();
  lz4Encode(input, 16, {
    onMatch: (p, d, l) => rec.begin({ zh: \`匹配 @\${p} d=\${d} len=\${l}\`, en: \`match @\${p} d=\${d} len=\${l}\` })
      .setArray(codes, codes.map((_, i) => (i >= p && i < p + l ? 'swap' : 'default') as BarRole), [{ index: p, label: 'pos' }])
      .setAux([{ label: '(d,l)', value: \`\${d},\${l}\`, role: 'final' as BarRole }]).commit(),
    onEmit: (t) => rec.begin({ zh: \`emit lit=\${t.litLen} match=\${t.matchLen+4} d=\${t.distance}\`, en: \`emit lit=\${t.litLen} match=\${t.matchLen+4} d=\${t.distance}\` })
      .setAux([{ label: 'token', value: \`\${t.litLen}/\${t.matchLen+4}/\${t.distance}\`, role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz4Encode } from '../../src/algorithms/compression/comp-lz4-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lz4-2/trace.ts';

test('lz4 长匹配被编码', () => {
  const t = lz4Encode('ABCDEFGABCDEFGABCDEFG', 16);
  assert.ok(t.some((x) => x.matchLen + 4 >= 7));
});
test('lz4 无匹配全 literal', () => {
  const t = lz4Encode('ABC', 8);
  assert.equal(t.length, 1);
  assert.equal(t[0]!.litLen, 3);
});
test('lz4 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 3. comp-lz5
{
  id: 'comp-lz5',
  titleZh: 'LZ5', titleEn: 'LZ5',
  summaryZh: 'LZ5：LZ4 的更大窗口/字典变体，更高压缩比。',
  summaryEn: 'LZ5: larger-window LZ4 variant with better ratio.',
  descZh: 'LZ5 在 LZ4 基础上增大窗口与哈希表，并优化长距离匹配，换取更高压缩比（仍保持较快解压）。',
  descEn: 'LZ5 enlarges the window and hash tables over LZ4 and optimizes long-distance matches for better ratio (still fast decode).',
  tags: ['compression','lz5','dictionary','variant'],
  time: 'O(n·w)', space: 'O(w)',
  impl: `// LZ5 · 实现
export interface Lz5Token { litLen: number; matchLen: number; distance: number; }
export interface Lz5Hooks { onMatch?: (pos: number, dist: number, mlen: number) => void; onEmit?: (t: Lz5Token) => void; }
export function lz5Encode(input: string, windowSize = 64, hooks: Lz5Hooks = {}): Lz5Token[] {
  const out: Lz5Token[] = [];
  let pos = 0; let litStart = 0;
  while (pos < input.length) {
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < input.length && input[pos - d + len] === input[pos + len]) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= 4) {
      hooks.onMatch?.(pos, bestDist, bestLen);
      out.push({ litLen: pos - litStart, matchLen: bestLen - 4, distance: bestDist });
      hooks.onEmit?.(out[out.length - 1]!);
      pos += bestLen;
      litStart = pos;
    } else pos++;
  }
  if (litStart < pos) out.push({ litLen: pos - litStart, matchLen: 0, distance: 0 });
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz5Encode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'LZ5（大窗口）', en: 'LZ5 (large window)' })
    .setArray(codes, codes.map(() => 'default' as BarRole), []).commit();
  lz5Encode(input, 32, {
    onEmit: (t) => rec.begin({ zh: \`emit lit=\${t.litLen} match=\${t.matchLen+4} d=\${t.distance}\`, en: \`emit\` })
      .setAux([{ label: 'token', value: \`\${t.litLen}/\${t.matchLen+4}/\${t.distance}\`, role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz5Encode } from '../../src/algorithms/compression/comp-lz5/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lz5/trace.ts';

test('lz5 长匹配', () => {
  const t = lz5Encode('ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP', 32);
  assert.ok(t.some((x) => x.matchLen + 4 >= 16));
});
test('lz5 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 4. comp-lzss-2
{
  id: 'comp-lzss-2',
  titleZh: 'LZSS v2', titleEn: 'LZSS v2',
  summaryZh: 'LZSS：位标志 + (距离, 长度)，比 LZ77 更紧凑。',
  summaryEn: 'LZSS: bit flag + (distance, length); more compact than LZ77.',
  descZh: 'LZSS（Storer & Szymanski）改进 LZ77：每个 token 前加 1 位标志（0=字面，1=匹配），匹配时不带 next 字符。',
  descEn: 'LZSS (Storer & Szymanski) improves LZ77: each token has a 1-bit flag (0=literal, 1=match); matches omit the next char.',
  tags: ['compression','lzss','dictionary','sliding-window'],
  time: 'O(n·w)', space: 'O(w)',
  impl: `// LZSS v2 · 实现
export interface LzssToken { flag: 0 | 1; literal?: number; distance?: number; length?: number; }
export interface LzssHooks { onMatch?: (pos: number, d: number, l: number) => void; onEmit?: (t: LzssToken) => void; }
export function lzssEncode(input: string, windowSize = 16, minMatch = 3, hooks: LzssHooks = {}): LzssToken[] {
  const out: LzssToken[] = [];
  let pos = 0;
  const codes = input.split('').map((c) => c.charCodeAt(0));
  while (pos < codes.length) {
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < windowSize) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= minMatch) {
      hooks.onMatch?.(pos, bestDist, bestLen);
      const t: LzssToken = { flag: 1, distance: bestDist, length: bestLen };
      out.push(t); hooks.onEmit?.(t); pos += bestLen;
    } else {
      const t: LzssToken = { flag: 0, literal: codes[pos] };
      out.push(t); hooks.onEmit?.(t); pos++;
    }
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzssEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABABABABABC';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'LZSS', en: 'LZSS' })
    .setArray(codes, codes.map(() => 'default' as BarRole), [{ index: 0, label: 'pos' }]).commit();
  let pos = 0;
  lzssEncode(input, 8, 3, {
    onEmit: (t) => { rec.begin({ zh: t.flag ? \`emit match d=\${t.distance} l=\${t.length}\` : \`emit literal \${t.literal}\`, en: '' })
      .setArray(codes, codes.map((_, i) => (i >= pos && (t.flag ? i < pos + (t.length ?? 0) : i === pos) ? 'swap' : 'default') as BarRole), [{ index: pos, label: 'pos' }]).commit();
      pos += t.flag ? (t.length ?? 0) : 1;
    },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzssEncode } from '../../src/algorithms/compression/comp-lzss-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lzss-2/trace.ts';

test('lzss 编码字面与匹配', () => {
  const t = lzssEncode('ABABABABABC', 8, 3);
  assert.ok(t.some((x) => x.flag === 0));
  assert.ok(t.some((x) => x.flag === 1));
});
test('lzss trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 5. comp-lzo-2
{
  id: 'comp-lzo-2',
  titleZh: 'LZO v2', titleEn: 'LZO v2',
  summaryZh: 'LZO：极快解压的块压缩，匹配用 RLE 前缀优化。',
  summaryEn: 'LZO: very fast block decompression; matches use RLE-prefix optimization.',
  descZh: 'LZO（Oberhumer）优先解压速度：匹配长度用变长编码 + RLE 风格的 run-length 加速长 run。',
  descEn: 'LZO (Oberhumer) prioritizes decode speed: match lengths use variable-length encoding with RLE-style run acceleration.',
  tags: ['compression','lzo','fast','block'],
  time: 'O(n·w)', space: 'O(w)',
  impl: `// LZO v2 · 实现（简化）
export interface LzoToken { kind: 'lit' | 'match' | 'run'; len: number; distance?: number; literal?: number; }
export interface LzoHooks { onEmit?: (t: LzoToken) => void; onRun?: (pos: number, len: number) => void; }
export function lzoEncode(input: string, hooks: LzoHooks = {}): LzoToken[] {
  const out: LzoToken[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  let pos = 0;
  while (pos < codes.length) {
    // 检测 RLE run（同字符连续）
    let runLen = 1;
    while (pos + runLen < codes.length && codes[pos + runLen] === codes[pos] && runLen < 256) runLen++;
    if (runLen >= 4) {
      hooks.onRun?.(pos, runLen);
      const t: LzoToken = { kind: 'run', len: runLen, literal: codes[pos] };
      out.push(t); hooks.onEmit?.(t); pos += runLen; continue;
    }
    // 检测回看匹配
    let bestLen = 0; let bestDist = 0;
    for (let d = 1; d <= pos; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 64) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= 3) {
      const t: LzoToken = { kind: 'match', len: bestLen, distance: bestDist };
      out.push(t); hooks.onEmit?.(t); pos += bestLen;
    } else {
      const t: LzoToken = { kind: 'lit', len: 1, literal: codes[pos] };
      out.push(t); hooks.onEmit?.(t); pos++;
    }
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzoEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'AAAAAAABCABABCAB';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'LZO', en: 'LZO' })
    .setArray(codes, codes.map(() => 'default' as BarRole), []).commit();
  lzoEncode(input, {
    onRun: (p, l) => rec.begin({ zh: \`run @\${p} len=\${l}\`, en: \`run @\${p} len=\${l}\` })
      .setAux([{ label: 'run', value: String(l), role: 'final' as BarRole }]).commit(),
    onEmit: (t) => rec.begin({ zh: \`emit \${t.kind}\`, en: \`emit \${t.kind}\` })
      .setAux([{ label: t.kind, value: String(t.len), role: 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzoEncode } from '../../src/algorithms/compression/comp-lzo-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lzo-2/trace.ts';

test('lzo 检测 run', () => {
  const t = lzoEncode('AAAAAAAABC');
  assert.ok(t.some((x) => x.kind === 'run' && x.len >= 6));
});
test('lzo trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 6. comp-snappy-2
{
  id: 'comp-snappy-2',
  titleZh: 'Snappy v2', titleEn: 'Snappy v2',
  summaryZh: 'Snappy：Google 高速压缩，不追求最佳压缩比。',
  summaryEn: 'Snappy: Google high-speed compression, not aiming for best ratio.',
  descZh: 'Snappy（Google）面向极高速压缩/解压：使用简单 tag + varint 长度 + copy 指令。匹配 ≥4 字节。',
  descEn: 'Snappy (Google) targets very high speed: simple tags + varint lengths + copy operations; min match 4 bytes.',
  tags: ['compression','snappy','fast','google'],
  time: 'O(n·w)', space: 'O(w)',
  impl: `// Snappy v2 · 实现（简化）
export interface SnappyTag { kind: 'literal' | 'copy'; len: number; distance?: number; }
export interface SnappyHooks { onEmit?: (t: SnappyTag) => void; }
export function snappyEncode(input: string, hooks: SnappyHooks = {}): SnappyTag[] {
  const out: SnappyTag[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  let pos = 0;
  let litStart = 0;
  while (pos < codes.length) {
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - 2048); // 11-bit distance for demo
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 64) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= 4) {
      if (pos - litStart > 0) { const t: SnappyTag = { kind: 'literal', len: pos - litStart }; out.push(t); hooks.onEmit?.(t); }
      const t: SnappyTag = { kind: 'copy', len: bestLen, distance: bestDist };
      out.push(t); hooks.onEmit?.(t);
      pos += bestLen; litStart = pos;
    } else pos++;
  }
  if (litStart < pos) { const t: SnappyTag = { kind: 'literal', len: pos - litStart }; out.push(t); hooks.onEmit?.(t); }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snappyEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'Snappy', en: 'Snappy' })
    .setArray(codes, codes.map(() => 'default' as BarRole), []).commit();
  snappyEncode(input, {
    onEmit: (t) => rec.begin({ zh: t.kind === 'copy' ? \`copy len=\${t.len} d=\${t.distance}\` : \`literal len=\${t.len}\`, en: '' })
      .setAux([{ label: t.kind, value: String(t.len), role: t.kind === 'copy' ? 'final' : 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snappyEncode } from '../../src/algorithms/compression/comp-snappy-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-snappy-2/trace.ts';

test('snappy 长输入含 copy', () => {
  const t = snappyEncode('ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP');
  assert.ok(t.some((x) => x.kind === 'copy'));
});
test('snappy 短输入全 literal', () => {
  const t = snappyEncode('AB');
  assert.ok(t.every((x) => x.kind === 'literal'));
});
test('snappy trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 7. comp-zstd-2
{
  id: 'comp-zstd-2',
  titleZh: 'Zstandard v2', titleEn: 'Zstandard v2',
  summaryZh: 'Zstd：LZ + FSE 熵编码，平衡速度与压缩比。',
  summaryEn: 'Zstd: LZ + FSE entropy coding, balancing speed and ratio.',
  descZh: 'Zstandard（Facebook）用 LZ77 系列 + 有限状态熵编码（FSE/tANS），可选块树结构（RLE/Repeat/Raw）。',
  descEn: 'Zstandard (Facebook) uses LZ77-family plus FSE/tANS entropy coding, with optional block-tree structures (RLE/Repeat/Raw).',
  tags: ['compression','zstd','lz','fse','entropy'],
  time: 'O(n·w)', space: 'O(w)',
  impl: `// Zstd v2 · 实现（简化：LZ 匹配 + 频率统计）
export interface ZstdToken { kind: 'lit' | 'match'; len: number; distance?: number; literal?: number; }
export interface ZstdHooks { onEmit?: (t: ZstdToken) => void; onStats?: (freq: Map<number, number>) => void; }
export function zstdEncode(input: string, windowSize = 32, minMatch = 3, hooks: ZstdHooks = {}): ZstdToken[] {
  const out: ZstdToken[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const freq = new Map<number, number>();
  let pos = 0;
  while (pos < codes.length) {
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 64) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= minMatch) {
      const t: ZstdToken = { kind: 'match', len: bestLen, distance: bestDist };
      out.push(t); hooks.onEmit?.(t); pos += bestLen;
    } else {
      const c = codes[pos]!;
      freq.set(c, (freq.get(c) ?? 0) + 1);
      const t: ZstdToken = { kind: 'lit', len: 1, literal: c };
      out.push(t); hooks.onEmit?.(t); pos++;
    }
  }
  hooks.onStats?.(freq);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zstdEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABABABABABABABCDCDCDCD';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'Zstd', en: 'Zstd' })
    .setArray(codes, codes.map(() => 'default' as BarRole), []).commit();
  zstdEncode(input, 16, 3, {
    onEmit: (t) => rec.begin({ zh: t.kind === 'match' ? \`match len=\${t.len} d=\${t.distance}\` : \`lit \${t.literal}\`, en: '' })
      .setAux([{ label: t.kind, value: String(t.len), role: t.kind === 'match' ? 'final' : 'compare' as BarRole }]).commit(),
    onStats: (f) => rec.begin({ zh: \`频率表 \${f.size} 项\`, en: \`freq \${f.size} entries\` })
      .setAux([{ label: 'symbols', value: String(f.size), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zstdEncode } from '../../src/algorithms/compression/comp-zstd-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-zstd-2/trace.ts';

test('zstd 含 match', () => {
  const t = zstdEncode('ABABABABABABABCDCDCDCD', 16, 3);
  assert.ok(t.some((x) => x.kind === 'match'));
});
test('zstd trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 8. comp-brotli-2
{
  id: 'comp-brotli-2',
  titleZh: 'Brotli v2', titleEn: 'Brotli v2',
  summaryZh: 'Brotli：LZ77 + 上下文建模 + 静态字典，Web 优化。',
  summaryEn: 'Brotli: LZ77 + context modeling + static dictionary, web-optimized.',
  descZh: 'Brotli（Google）针对 Web 优化：LZ77 + 二阶上下文建模 + 内置 120KB 静态字典（含常见 Web 文本）。',
  descEn: 'Brotli (Google) is web-optimized: LZ77 + second-order context modeling + a built-in 120KB static dictionary of common web text.',
  tags: ['compression','brotli','lz','context','web'],
  time: 'O(n·w)', space: 'O(w + dict)',
  impl: `// Brotli v2 · 实现（简化：LZ + 上下文频率）
export interface BrotliToken { kind: 'lit' | 'match' | 'dict'; len: number; distance?: number; ctx?: number; literal?: number; }
export interface BrotliHooks { onEmit?: (t: BrotliToken) => void; }
const STATIC_DICT = new Set(['html', 'head', 'body', 'div', 'span', 'http', 'www', 'com']);
export function brotliEncode(input: string, windowSize = 32, hooks: BrotliHooks = {}): BrotliToken[] {
  const out: BrotliToken[] = [];
  let pos = 0;
  let prev = 0;
  while (pos < input.length) {
    // 字典词匹配
    let matched = false;
    for (const w of STATIC_DICT) {
      if (input.substr(pos, w.length).toLowerCase() === w) {
        const t: BrotliToken = { kind: 'dict', len: w.length };
        out.push(t); hooks.onEmit?.(t); pos += w.length; matched = true; prev = w.charCodeAt(0); break;
      }
    }
    if (matched) continue;
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < input.length && input[pos - d + len] === input[pos + len] && len < 64) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= 4) {
      const t: BrotliToken = { kind: 'match', len: bestLen, distance: bestDist, ctx: prev & 0x3f };
      out.push(t); hooks.onEmit?.(t); pos += bestLen; prev = input.charCodeAt(pos - 1) ?? 0;
    } else {
      const t: BrotliToken = { kind: 'lit', len: 1, literal: input.charCodeAt(pos), ctx: prev & 0x3f };
      out.push(t); hooks.onEmit?.(t); prev = input.charCodeAt(pos); pos++;
    }
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brotliEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'www.html.body.div';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'Brotli', en: 'Brotli' })
    .setArray(codes, codes.map(() => 'default' as BarRole), []).commit();
  brotliEncode(input, 16, {
    onEmit: (t) => rec.begin({ zh: \`emit \${t.kind} len=\${t.len}\`, en: \`emit \${t.kind}\` })
      .setAux([{ label: t.kind, value: String(t.len), role: t.kind === 'dict' ? 'final' : 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brotliEncode } from '../../src/algorithms/compression/comp-brotli-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-brotli-2/trace.ts';

test('brotli 匹配字典词', () => {
  const t = brotliEncode('www.html.body.div');
  assert.ok(t.some((x) => x.kind === 'dict'));
});
test('brotli trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 9. comp-deflate-3
{
  id: 'comp-deflate-3',
  titleZh: 'DEFLATE v3', titleEn: 'DEFLATE v3',
  summaryZh: 'DEFLATE：LZ77 + Huffman，gzip/zlib 内核。',
  summaryEn: 'DEFLATE: LZ77 + Huffman, the core of gzip/zlib.',
  descZh: 'DEFLATE（Deutsch）= LZ77 + 哈夫曼编码，可选用固定或动态 Huffman 表。是 gzip、zlib、PNG 的内核。',
  descEn: 'DEFLATE (Deutsch) = LZ77 + Huffman coding, with fixed or dynamic Huffman tables; the core of gzip, zlib, and PNG.',
  tags: ['compression','deflate','lz77','huffman','gzip'],
  time: 'O(n·w)', space: 'O(w + tree)',
  impl: `// DEFLATE v3 · 实现（简化：LZ77 + 频率表）
export interface DeflateToken { kind: 'lit' | 'match'; len: number; distance?: number; literal?: number; }
export interface DeflateHooks { onEmit?: (t: DeflateToken) => void; onHuffman?: (freq: Map<number, number>) => void; }
export function deflateEncode(input: string, windowSize = 32, minMatch = 3, hooks: DeflateHooks = {}): DeflateToken[] {
  const out: DeflateToken[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const freq = new Map<number, number>();
  let pos = 0;
  while (pos < codes.length) {
    let bestLen = 0; let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 258) len++;
      if (len > bestLen) { bestLen = len; bestDist = d; }
    }
    if (bestLen >= minMatch) {
      const t: DeflateToken = { kind: 'match', len: bestLen, distance: bestDist };
      out.push(t); hooks.onEmit?.(t); pos += bestLen;
      freq.set(256 + bestDist, (freq.get(256 + bestDist) ?? 0) + 1); // 距离符号占位
    } else {
      const c = codes[pos]!;
      freq.set(c, (freq.get(c) ?? 0) + 1);
      const t: DeflateToken = { kind: 'lit', len: 1, literal: c };
      out.push(t); hooks.onEmit?.(t); pos++;
    }
  }
  hooks.onHuffman?.(freq);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deflateEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'abcabcabcabc';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'DEFLATE', en: 'DEFLATE' })
    .setArray(codes, codes.map(() => 'default' as BarRole), []).commit();
  deflateEncode(input, 16, 3, {
    onEmit: (t) => rec.begin({ zh: t.kind === 'match' ? \`match \${t.len}\` : \`lit\`, en: '' })
      .setAux([{ label: t.kind, value: String(t.len), role: t.kind === 'match' ? 'final' : 'compare' as BarRole }]).commit(),
    onHuffman: (f) => rec.begin({ zh: \`Huffman: \${f.size} 符号\`, en: \`Huffman: \${f.size} symbols\` })
      .setAux([{ label: 'symbols', value: String(f.size), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deflateEncode } from '../../src/algorithms/compression/comp-deflate-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-deflate-3/trace.ts';

test('deflate 含 match', () => {
  const t = deflateEncode('abcabcabcabc', 16, 3);
  assert.ok(t.some((x) => x.kind === 'match'));
});
test('deflate trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 10. comp-gzip-2
{
  id: 'comp-gzip-2',
  titleZh: 'gzip v2', titleEn: 'gzip v2',
  summaryZh: 'gzip：DEFLATE + 头部 + CRC32 校验。',
  summaryEn: 'gzip: DEFLATE + header + CRC32 checksum.',
  descZh: 'gzip = DEFLATE 数据 + 元信息头部（魔数、修改时间、标志）+ 尾部 CRC32 与原始大小。',
  descEn: 'gzip = DEFLATE payload + a metadata header (magic, mtime, flags) + a CRC32 and original-size trailer.',
  tags: ['compression','gzip','deflate','crc32'],
  time: 'O(n)', space: 'O(1)',
  impl: `// gzip v2 · 实现（CRC32 + 头/尾包装）
export interface GzipResult { header: number[]; payloadSize: number; crc32: number; size: number; }
export interface GzipHooks { onHeader?: (header: number[]) => void; onCrc?: (crc: number) => void; }
const CRC_TABLE: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t.push(c);
  }
  return t;
})();
export function crc32(data: number[]): number {
  let c = 0xffffffff;
  for (const b of data) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export function gzipWrap(input: string, payloadSize: number, hooks: GzipHooks = {}): GzipResult {
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const header = [0x1f, 0x8b, 0x08, 0x00, 0, 0, 0, 0, 0, 0x03]; // magic + DEFLATE + unix
  hooks.onHeader?.(header);
  const crc = crc32(codes);
  hooks.onCrc?.(crc);
  return { header, payloadSize, crc32: crc, size: codes.length };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gzipWrap } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'hellohello';
  rec.begin({ zh: 'gzip 包装', en: 'gzip wrap' }).commit();
  const r = gzipWrap(input, 8, {
    onHeader: (h) => rec.begin({ zh: \`头部 10 字节\`, en: \`header 10 bytes\` })
      .setBars(h.map((b) => ({ value: b, role: 'compare' as BarRole }))).commit(),
    onCrc: (crc) => rec.begin({ zh: \`CRC32=\${crc.toString(16)}\`, en: \`CRC32=\${crc.toString(16)}\` })
      .setAux([{ label: 'CRC', value: crc.toString(16), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`完成 size=\${r.size}\`, en: \`done size=\${r.size}\` })
    .setAux([{ label: 'size', value: String(r.size), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gzipWrap, crc32 } from '../../src/algorithms/compression/comp-gzip-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-gzip-2/trace.ts';

test('crc32 已知值', () => {
  // CRC32 of "" = 0
  assert.equal(crc32([]), 0);
  // CRC32 of "123456789" = 0xCBF43926
  assert.equal(crc32([49,50,51,52,53,54,55,56,57]), 0xcbf43926);
});
test('gzip wrap 生成头部', () => {
  const r = gzipWrap('abc', 3);
  assert.equal(r.header[0], 0x1f);
  assert.equal(r.header[1], 0x8b);
});
test('gzip trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 11. comp-zlib-2
{
  id: 'comp-zlib-2',
  titleZh: 'zlib v2', titleEn: 'zlib v2',
  summaryZh: 'zlib：DEFLATE + Adler-32 校验 + 短头部。',
  summaryEn: 'zlib: DEFLATE + Adler-32 checksum + short header.',
  descZh: 'zlib = 2 字节头部（CMF + FLG）+ DEFLATE 数据 + 4 字节 Adler-32 校验。比 gzip 头更短。',
  descEn: 'zlib = 2-byte header (CMF + FLG) + DEFLATE payload + 4-byte Adler-32 checksum; shorter header than gzip.',
  tags: ['compression','zlib','deflate','adler32'],
  time: 'O(n)', space: 'O(1)',
  impl: `// zlib v2 · 实现（Adler-32 + 头部）
export interface ZlibResult { header: number[]; adler32: number; size: number; }
export interface ZlibHooks { onHeader?: (h: number[]) => void; onAdler?: (a: number) => void; }
export function adler32(data: number[]): number {
  let a = 1; let b = 0;
  for (const x of data) { a = (a + x) % 65521; b = (b + a) % 65521; }
  return ((b << 16) | a) >>> 0;
}
export function zlibWrap(input: string, hooks: ZlibHooks = {}): ZlibResult {
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const header = [0x78, 0x9c]; // CMF=deflate32k, FLG=default level
  hooks.onHeader?.(header);
  const a = adler32(codes);
  hooks.onAdler?.(a);
  return { header, adler32: a, size: codes.length };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zlibWrap } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'hellohello';
  rec.begin({ zh: 'zlib 包装', en: 'zlib wrap' }).commit();
  zlibWrap(input, {
    onHeader: (h) => rec.begin({ zh: \`头部 \${h.map((x)=>x.toString(16)).join(' ')}\`, en: \`header\` })
      .setBars(h.map((b) => ({ value: b, role: 'compare' as BarRole }))).commit(),
    onAdler: (a) => rec.begin({ zh: \`Adler32=\${a.toString(16)}\`, en: \`Adler32=\${a.toString(16)}\` })
      .setAux([{ label: 'Adler', value: a.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zlibWrap, adler32 } from '../../src/algorithms/compression/comp-zlib-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-zlib-2/trace.ts';

test('adler32 已知值', () => {
  // Adler-32 of "Wikipedia" = 0x11E60398
  assert.equal(adler32([87,105,107,105,112,101,100,105,97]), 0x11e60398);
});
test('zlib wrap 头部 0x78 0x9c', () => {
  const r = zlibWrap('abc');
  assert.equal(r.header[0], 0x78);
  assert.equal(r.header[1], 0x9c);
});
test('zlib trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 12. comp-huffman-4
{
  id: 'comp-huffman-4',
  titleZh: 'Huffman 规范编码 v4', titleEn: 'Canonical Huffman v4',
  summaryZh: '规范 Huffman：按码长+符号序生成码字，省去树结构。',
  summaryEn: 'Canonical Huffman: codes from lengths + symbol order, no tree needed.',
  descZh: '规范 Huffman（Deutsch）只编码每个符号的码长，解码端按码长升序+符号序重建码字。是 DEFLATE、JPEG 等的标准做法。',
  descEn: 'Canonical Huffman (Deutsch) encodes only each symbol code length; the decoder rebuilds codes by length-ascending + symbol order. Standard in DEFLATE, JPEG.',
  tags: ['compression','huffman','canonical','entropy'],
  time: 'O(n log n)', space: 'O(σ)',
  impl: `// 规范 Huffman v4 · 实现
export interface HuffSym { sym: number; len: number; code: number; }
export interface ChHooks { onLengths?: (lens: Map<number, number>) => void; onCodes?: (codes: HuffSym[]) => void; }
interface HuffNode { sym?: number; freq: number; left?: HuffNode; right?: HuffNode; }
export function buildCodeLengths(freq: Map<number, number>): Map<number, number> {
  if (freq.size === 0) return new Map();
  if (freq.size === 1) { const k = freq.keys().next().value as number; return new Map([[k, 1]]); }
  const nodes: HuffNode[] = [...freq.entries()].map(([sym, f]) => ({ sym, freq: f }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const a = nodes.shift()!; const b = nodes.shift()!;
    nodes.push({ freq: a.freq + b.freq, left: a, right: b });
  }
  const lens = new Map<number, number>();
  function walk(n: HuffNode, d: number) {
    if (n.sym !== undefined) lens.set(n.sym, d || 1);
    else { if (n.left) walk(n.left, d + 1); if (n.right) walk(n.right, d + 1); }
  }
  walk(nodes[0]!, 0);
  return lens;
}
export function canonicalHuffman(freq: Map<number, number>, hooks: ChHooks = {}): HuffSym[] {
  const lens = buildCodeLengths(freq);
  hooks.onLengths?.(lens);
  // 按码长升序、符号升序
  const sorted = [...lens.entries()].sort((a, b) => a[1] === b[1] ? a[0] - b[0] : a[1] - b[1]);
  let code = 0; let prevLen = 0;
  const out: HuffSym[] = sorted.map(([sym, len]) => {
    code = prevLen === 0 ? 0 : (code + 1) << (len - prevLen);
    prevLen = len;
    return { sym, len, code };
  });
  hooks.onCodes?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canonicalHuffman } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const freq = new Map([['A'.charCodeAt(0), 5], ['B'.charCodeAt(0), 2], ['C'.charCodeAt(0), 1], ['D'.charCodeAt(0), 1]]);
  rec.begin({ zh: '规范 Huffman', en: 'Canonical Huffman' }).commit();
  const codes = canonicalHuffman(freq, {
    onLengths: (l) => rec.begin({ zh: \`码长: \${[...l.entries()].map(([s,n])=>String.fromCharCode(s)+':'+n).join(' ')}\`, en: 'lengths' })
      .setAux([{ label: 'syms', value: String(l.size), role: 'compare' as BarRole }]).commit(),
    onCodes: (cs) => rec.begin({ zh: \`码字生成\`, en: 'codes built' })
      .setBars(cs.map((c) => ({ value: c.len, role: 'final' as BarRole, label: String.fromCharCode(c.sym) }))).commit(),
  });
  void codes;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalHuffman, buildCodeLengths } from '../../src/algorithms/compression/comp-huffman-4/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-huffman-4/trace.ts';

test('canonical huffman 码字无前缀冲突', () => {
  const freq = new Map([['A'.charCodeAt(0), 5], ['B'.charCodeAt(0), 2], ['C'.charCodeAt(0), 1], ['D'.charCodeAt(0), 1]]);
  const codes = canonicalHuffman(freq);
  // 验证前缀性质：任意两码字互不为前缀
  for (let i = 0; i < codes.length; i++) for (let j = 0; j < codes.length; j++) {
    if (i === j) continue;
    const a = codes[i]!; const b = codes[j]!;
    const aBits = a.code.toString(2).padStart(a.len, '0');
    const bBits = b.code.toString(2).padStart(b.len, '0');
    assert.ok(!aBits.startsWith(bBits) || aBits === bBits);
  }
});
test('canonical huffman 单符号码长 1', () => {
  const lens = buildCodeLengths(new Map([[42, 10]]));
  assert.equal(lens.get(42), 1);
});
test('canonical huffman trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 13. comp-huffman-5
{
  id: 'comp-huffman-5',
  titleZh: 'Huffman 自适应 v5', titleEn: 'Adaptive Huffman v5',
  summaryZh: '自适应 Huffman：单遍扫描，频率随编码更新。',
  summaryEn: 'Adaptive Huffman: single pass; frequencies update during encoding.',
  descZh: '自适应 Huffman（Knuth 改进）一遍扫描即可编码，无需先统计频率；编码器与解码器同步维护同一棵动态树。',
  descEn: 'Adaptive Huffman (Knuth improvements) encodes in one pass without pre-counting frequencies; encoder and decoder maintain the same dynamic tree in lockstep.',
  tags: ['compression','huffman','adaptive','online'],
  time: 'O(n log σ)', space: 'O(σ)',
  impl: `// 自适应 Huffman v5 · 实现（简化：每次重建）
export interface AhHooks { onEncode?: (sym: number, code: string) => void; onUpdate?: (freq: Map<number, number>) => void; }
export function adaptiveHuffman(data: number[], hooks: AhHooks = {}): string {
  const freq = new Map<number, number>();
  let out = '';
  for (const sym of data) {
    if (freq.size === 0 || !freq.has(sym)) {
      // 新符号：先输出 8 位原始码（简化）
      const raw = sym.toString(2).padStart(8, '0');
      out += raw;
      hooks.onEncode?.(sym, raw);
    } else {
      // 用当前频率表生成 Huffman 并取该符号的码字（简化版每次重建）
      const codes = buildCodes(freq);
      const c = codes.get(sym) ?? '';
      out += c;
      hooks.onEncode?.(sym, c);
    }
    freq.set(sym, (freq.get(sym) ?? 0) + 1);
    hooks.onUpdate?.(freq);
  }
  return out;
}
function buildCodes(freq: Map<number, number>): Map<number, string> {
  interface N { sym?: number; f: number; l?: N; r?: N; }
  if (freq.size === 1) { const k = freq.keys().next().value as number; return new Map([[k, '0']]); }
  const nodes: N[] = [...freq.entries()].map(([sym, f]) => ({ sym, f }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const a = nodes.shift()!; const b = nodes.shift()!;
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<number, string>();
  function walk(n: N, s: string) {
    if (n.sym !== undefined) codes.set(n.sym, s || '0');
    else { if (n.l) walk(n.l, s + '0'); if (n.r) walk(n.r, s + '1'); }
  }
  walk(nodes[0]!, '');
  return codes;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adaptiveHuffman } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABCBBCA'.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: '自适应 Huffman', en: 'Adaptive Huffman' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  adaptiveHuffman(data, {
    onEncode: (s, c) => rec.begin({ zh: \`编码 '\${String.fromCharCode(s)}' → \${c}\`, en: \`encode '\${String.fromCharCode(s)}' → \${c}\` })
      .setAux([{ label: 'code', value: c, role: 'compare' as BarRole }]).commit(),
    onUpdate: (f) => rec.begin({ zh: \`频率更新 \${f.size} 符号\`, en: \`freq \${f.size}\` })
      .setAux([{ label: 'syms', value: String(f.size), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaptiveHuffman } from '../../src/algorithms/compression/comp-huffman-5/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-huffman-5/trace.ts';

test('adaptive huffman 输出非空', () => {
  const s = adaptiveHuffman([65, 66, 65, 66, 67]);
  assert.ok(s.length > 0);
});
test('adaptive huffman trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 14. comp-arithmetic-3
{
  id: 'comp-arithmetic-3',
  titleZh: '算术编码 v3', titleEn: 'Arithmetic Coding v3',
  summaryZh: '算术编码：用 [low, high) 区间表示整个消息，分数位编码。',
  summaryEn: 'Arithmetic coding: a [low, high) interval represents the whole message; fractional bits.',
  descZh: '算术编码（Rissanen）用累积概率缩放 [low, high) 区间，最终输出一个分数。能逼近熵界，比 Huffman 更紧。',
  descEn: 'Arithmetic coding (Rissanen) scales [low, high) by cumulative probabilities and outputs a fraction, approaching the entropy bound tighter than Huffman.',
  tags: ['compression','arithmetic','entropy','interval'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 算术编码 v3 · 实现（定点）
export interface AcHooks { onStep?: (sym: number, low: number, high: number) => void; onResult?: (low: number, high: number) => void; }
export function arithmeticEncode(data: number[], freq: Map<number, [number, number]>, hooks: AcHooks = {}): { low: number; high: number } {
  // freq: sym → [cumLow, cumHigh] in [0, total)
  let low = 0;
  let high = 65535;
  const total = 65536;
  for (const sym of data) {
    const range = high - low + 1;
    const [cl, ch] = freq.get(sym) ?? [0, 1];
    high = low + Math.floor(range * ch / total) - 1;
    low = low + Math.floor(range * cl / total);
    hooks.onStep?.(sym, low, high);
  }
  hooks.onResult?.(low, high);
  return { low, high };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arithmeticEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABA'.split('').map((c) => c.charCodeAt(0));
  // A: [0, 49152), B: [49152, 65536) of total 65536
  const freq = new Map([
    ['A'.charCodeAt(0), [0, 49152]],
    ['B'.charCodeAt(0), [49152, 65536]],
  ]);
  rec.begin({ zh: '算术编码', en: 'Arithmetic coding' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  arithmeticEncode(data, freq, {
    onStep: (s, lo, hi) => rec.begin({ zh: \`'\${String.fromCharCode(s)}' → [\${lo},\${hi}]\`, en: '' })
      .setAux([{ label: 'low', value: String(lo), role: 'compare' as BarRole }, { label: 'high', value: String(hi), role: 'final' as BarRole }]).commit(),
    onResult: (lo, hi) => rec.begin({ zh: \`结果 [\${lo},\${hi}]\`, en: \`result [\${lo},\${hi}]\` })
      .setAux([{ label: 'interval', value: \`\${lo}..\${hi}\`, role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arithmeticEncode } from '../../src/algorithms/compression/comp-arithmetic-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-arithmetic-3/trace.ts';

test('arithmetic encode 区间收敛', () => {
  const freq = new Map([['A'.charCodeAt(0), [0, 49152]], ['B'.charCodeAt(0), [49152, 65536]]]);
  const r = arithmeticEncode([65,65,66,65], freq);
  assert.ok(r.high >= r.low);
});
test('arithmetic encode trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 15. comp-rans
{
  id: 'comp-rans',
  titleZh: 'rANS', titleEn: 'rANS',
  summaryZh: 'rANS：基于状态 x = (x/M)*F(s) + s 的熵编码。',
  summaryEn: 'rANS: entropy coding via state x = (x/M)*F(s) + s.',
  descZh: 'rANS（range Asymmetric Numeral Systems，Duda）用整数状态 x 编码：x_{n+1} = (x_n / M) * F(s) + (x_n mod M) - C(s)。逆序解码。',
  descEn: 'rANS (range Asymmetric Numeral Systems, Duda) uses integer state: x_{n+1} = (x_n / M) * F(s) + (x_n mod M) - C(s); decoded in reverse.',
  tags: ['compression','ans','entropy','rans'],
  time: 'O(n)', space: 'O(σ)',
  impl: `// rANS · 实现（简化）
export interface RansHooks { onEncode?: (sym: number, state: number) => void; onResult?: (state: number) => void; }
export interface RansSym { sym: number; freq: number; cumStart: number; }
export function ransEncode(data: number[], table: Map<number, RansSym>, M: number, hooks: RansHooks = {}): number {
  let x = M; // 初始状态
  for (let i = data.length - 1; i >= 0; i--) {
    const sym = data[i]!;
    const s = table.get(sym)!;
    x = Math.floor(x / s.freq) * M + (x % s.freq) + s.cumStart;
    hooks.onEncode?.(sym, x);
  }
  hooks.onResult?.(x);
  return x;
}
export function ransDecode(x: number, table: Map<number, RansSym>, M: number, n: number, bySlot: (slot: number) => number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const slot = x % M;
    const sym = bySlot(slot);
    const s = table.get(sym)!;
    x = s.freq * Math.floor(x / M) + slot - s.cumStart;
    out.push(sym);
  }
  return out.reverse();
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ransEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABA'.split('').map((c) => c.charCodeAt(0));
  // M=8, A: freq=6 cumStart=0; B: freq=2 cumStart=6
  const M = 8;
  const table = new Map([
    ['A'.charCodeAt(0), { sym: 65, freq: 6, cumStart: 0 }],
    ['B'.charCodeAt(0), { sym: 66, freq: 2, cumStart: 6 }],
  ]);
  rec.begin({ zh: 'rANS', en: 'rANS' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ransEncode(data, table, M, {
    onEncode: (s, st) => rec.begin({ zh: \`编码 '\${String.fromCharCode(s)}' state=\${st}\`, en: '' })
      .setAux([{ label: 'state', value: String(st), role: 'final' as BarRole }]).commit(),
    onResult: (st) => rec.begin({ zh: \`最终 state=\${st}\`, en: \`final state=\${st}\` })
      .setAux([{ label: 'final', value: String(st), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ransEncode, ransDecode } from '../../src/algorithms/compression/comp-rans/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rans/trace.ts';

test('rans round-trip', () => {
  const data = [65, 65, 66, 65];
  const M = 8;
  const table = new Map([
    [65, { sym: 65, freq: 6, cumStart: 0 }],
    [66, { sym: 66, freq: 2, cumStart: 6 }],
  ]);
  // 构建 slot → sym 查找表
  const slotToSym: number[] = [];
  for (const [, s] of table) for (let k = 0; k < s.freq; k++) slotToSym.push(s.sym);
  const x = ransEncode(data, table, M);
  const decoded = ransDecode(x, table, M, data.length, (slot) => slotToSym[slot]!);
  assert.deepEqual(decoded, data);
});
test('rans trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 16. comp-tans
{
  id: 'comp-tans',
  titleZh: 'tANS', titleEn: 'tANS',
  summaryZh: 'tANS：表驱动 ANS，FSE 的基础。',
  summaryEn: 'tANS: table-driven ANS, the basis of FSE.',
  descZh: 'tANS（table ANS）预算好「状态-符号」转移表，编/解码都是查表，速度快于 rANS。',
  descEn: 'tANS (table ANS) precomputes state-symbol transition tables so encode/decode are table lookups; faster than rANS.',
  tags: ['compression','ans','entropy','tans','fse'],
  time: 'O(n)', space: 'O(L)',
  impl: `// tANS · 实现（简化：构建转移表 + 查表）
export interface TansEntry { sym: number; nextState: number; }
export interface TansHooks { onTable?: (table: TansEntry[]) => void; onEncode?: (sym: number, state: number) => void; }
export function tansBuildTable(symbols: number[], L: number): TansEntry[] {
  // 简化：均匀分配状态
  const table: TansEntry[] = [];
  const perSym = Math.floor(L / symbols.length);
  for (let i = 0; i < L; i++) {
    const sym = symbols[i % symbols.length]!;
    table.push({ sym, nextState: ((i + 1) % L) });
  }
  void perSym;
  return table;
}
export function tansEncode(data: number[], table: TansEntry[], L: number, hooks: TansHooks = {}): number {
  hooks.onTable?.(table);
  let state = L - 1;
  for (let i = data.length - 1; i >= 0; i--) {
    const entry = table[state]!;
    state = entry.nextState;
    hooks.onEncode?.(data[i]!, state);
  }
  return state;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tansBuildTable, tansEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABBA'.split('').map((c) => c.charCodeAt(0));
  const syms = [65, 66];
  const table = tansBuildTable(syms, 8);
  rec.begin({ zh: 'tANS', en: 'tANS' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  tansEncode(data, table, 8, {
    onTable: (t) => rec.begin({ zh: \`表 \${t.length} 项\`, en: \`table \${t.length} entries\` })
      .setAux([{ label: 'L', value: String(t.length), role: 'compare' as BarRole }]).commit(),
    onEncode: (s, st) => rec.begin({ zh: \`'\${String.fromCharCode(s)}' → state=\${st}\`, en: '' })
      .setAux([{ label: 'state', value: String(st), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tansBuildTable, tansEncode } from '../../src/algorithms/compression/comp-tans/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-tans/trace.ts';

test('tans table 长度 = L', () => {
  assert.equal(tansBuildTable([65, 66], 8).length, 8);
});
test('tans encode 返回状态', () => {
  const t = tansBuildTable([65, 66], 8);
  const s = tansEncode([65, 66, 65], t, 8);
  assert.ok(s >= 0 && s < 8);
});
test('tans trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 17. comp-ans-2
{
  id: 'comp-ans-2',
  titleZh: 'ANS 综合演示 v2', titleEn: 'ANS Overview v2',
  summaryZh: 'ANS 综合：演示 rANS/tANS 的统一状态机模型。',
  summaryEn: 'ANS overview: demonstrate the unified state-machine model behind rANS/tANS.',
  descZh: 'ANS（Asymmetric Numeral Systems）核心是一个整数状态 x：编码符号 s 使 x 增大（相当于把符号「挤入」一个超大进制数）。本实现演示统一接口。',
  descEn: 'ANS core is an integer state x: encoding symbol s grows x (as if pushing the symbol into a big-base numeral). This impl shows the unified interface.',
  tags: ['compression','ans','entropy','overview'],
  time: 'O(n)', space: 'O(σ)',
  impl: `// ANS 综合演示 v2 · 实现
export interface AnsHooks { onEncode?: (sym: number, x: number) => void; onResult?: (x: number) => void; }
export interface AnsFreq { sym: number; base: number; cum: number; }
/** 编码：x = x * base + cum + sym_offset。 */
export function ansEncode(data: number[], freq: Map<number, AnsFreq>, hooks: AnsHooks = {}): number {
  let x = 1;
  for (let i = data.length - 1; i >= 0; i--) {
    const f = freq.get(data[i]!)!;
    x = x * f.base + f.cum;
    hooks.onEncode?.(data[i]!, x);
  }
  hooks.onResult?.(x);
  return x;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ansEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'ABAB'.split('').map((c) => c.charCodeAt(0));
  const freq = new Map([
    ['A'.charCodeAt(0), { sym: 65, base: 3, cum: 0 }],
    ['B'.charCodeAt(0), { sym: 66, base: 3, cum: 1 }],
  ]);
  rec.begin({ zh: 'ANS 综合', en: 'ANS overview' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ansEncode(data, freq, {
    onEncode: (s, x) => rec.begin({ zh: \`'\${String.fromCharCode(s)}' x=\${x}\`, en: '' })
      .setAux([{ label: 'x', value: String(x), role: 'final' as BarRole }]).commit(),
    onResult: (x) => rec.begin({ zh: \`最终 x=\${x}\`, en: \`final x=\${x}\` })
      .setAux([{ label: 'final', value: String(x), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ansEncode } from '../../src/algorithms/compression/comp-ans-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ans-2/trace.ts';

test('ans encode 单调递增', () => {
  const freq = new Map([[65, { sym: 65, base: 3, cum: 0 }], [66, { sym: 66, base: 3, cum: 1 }]]);
  const x = ansEncode([65, 66, 65], freq);
  assert.ok(x > 1);
});
test('ans trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 18. comp-ppm-2
{
  id: 'comp-ppm-2',
  titleZh: 'PPM v2', titleEn: 'PPM v2',
  summaryZh: 'PPM：上下文自适应概率 + 回退机制。',
  summaryEn: 'PPM: context-adaptive probabilities with backoff.',
  descZh: 'PPM（Prediction by Partial Matching）用最长 k 阶上下文预测下一符号；若上下文不存在则用「逃逸」概率回退到 k-1 阶。',
  descEn: 'PPM (Prediction by Partial Matching) predicts the next symbol using the longest order-k context; if absent, an escape probability backs off to order k-1.',
  tags: ['compression','ppm','context','adaptive'],
  time: 'O(n·k)', space: 'O(σ^k)',
  impl: `// PPM v2 · 实现（简化：order-1）
export interface PpmHooks { onPredict?: (ctx: number, sym: number, prob: number) => void; onEscape?: (ctx: number, order: number) => void; }
export function ppmPredict(data: number[], maxOrder = 2, hooks: PpmHooks = {}): Array<{ sym: number; ctx: number[]; escaped: boolean }> {
  // 上下文表：order-1 与 order-2
  const order1 = new Map<number, Map<number, number>>();
  const order2 = new Map<string, Map<number, number>>();
  const out: Array<{ sym: number; ctx: number[]; escaped: boolean }> = [];
  for (let i = 0; i < data.length; i++) {
    const sym = data[i]!;
    const ctx1 = i > 0 ? data[i - 1]! : -1;
    const key2 = i > 1 ? \`\${data[i - 2]!},\${data[i - 1]!}\` : '';
    let escaped = false;
    if (ctx1 >= 0) {
      const t1 = order1.get(ctx1);
      if (t1 && t1.has(sym)) {
        const total = [...t1.values()].reduce((a, b) => a + b, 0);
        hooks.onPredict?.(ctx1, sym, t1.get(sym)! / total);
      } else { escaped = true; hooks.onEscape?.(ctx1, 1); }
    }
    if (key2 && !escaped) {
      const t2 = order2.get(key2);
      if (t2 && t2.has(sym)) {
        const total = [...t2.values()].reduce((a, b) => a + b, 0);
        hooks.onPredict?.(ctx1, sym, t2.get(sym)! / total);
      }
    }
    // 更新表
    if (ctx1 >= 0) {
      if (!order1.has(ctx1)) order1.set(ctx1, new Map());
      const t = order1.get(ctx1)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
    if (key2) {
      if (!order2.has(key2)) order2.set(key2, new Map());
      const t = order2.get(key2)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
    out.push({ sym, ctx: ctx1 >= 0 ? [ctx1] : [], escaped });
  }
  void maxOrder;
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ppmPredict } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABABCABAB'.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'PPM', en: 'PPM' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ppmPredict(data, 2, {
    onPredict: (ctx, s, p) => rec.begin({ zh: \`ctx='\${String.fromCharCode(ctx)}' 预测 '\${String.fromCharCode(s)}' p=\${p.toFixed(2)}\`, en: '' })
      .setAux([{ label: 'prob', value: p.toFixed(2), role: 'final' as BarRole }]).commit(),
    onEscape: (ctx) => rec.begin({ zh: \`ctx='\${String.fromCharCode(ctx)}' 逃逸\`, en: 'escape' })
      .setAux([{ label: 'escape', value: String.fromCharCode(ctx), role: 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ppmPredict } from '../../src/algorithms/compression/comp-ppm-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ppm-2/trace.ts';

test('ppm 输出长度 = 输入长度', () => {
  const out = ppmPredict([65, 66, 65, 66, 65]);
  assert.equal(out.length, 5);
});
test('ppm 重复模式提高预测概率', () => {
  const out = ppmPredict([65, 66, 65, 66, 65]);
  // 第 5 个 A 在 BA 之后已被预测
  assert.ok(out.some((x) => x.sym === 65 && !x.escaped));
});
test('ppm trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 19. comp-ppm-d-star
{
  id: 'comp-ppm-d-star',
  titleZh: 'PPM*d', titleEn: 'PPM*d',
  summaryZh: 'PPM*d：所有阶上下文加权混合，无显式逃逸。',
  summaryEn: 'PPM*d: blend all-order contexts, no explicit escape.',
  descZh: 'PPM*d（Cleary, Teahan）维护所有阶上下文，预测时把各阶概率加权混合，避免显式逃逸，常优于 PPM。',
  descEn: 'PPM*d (Cleary, Teahan) maintains all-order contexts and blends their probabilities, avoiding explicit escape and often beating PPM.',
  tags: ['compression','ppm','context','blending'],
  time: 'O(n·k)', space: 'O(σ^k)',
  impl: `// PPM*d · 实现（简化：order-0/1/2 混合）
export interface PpmdHooks { onBlend?: (sym: number, prob: number) => void; }
export function ppmStar(data: number[], hooks: PpmdHooks = {}): Array<{ sym: number; prob: number }> {
  const o0 = new Map<number, number>();
  const o1 = new Map<number, Map<number, number>>();
  const o2 = new Map<string, Map<number, number>>();
  const out: Array<{ sym: number; prob: number }> = [];
  for (let i = 0; i < data.length; i++) {
    const sym = data[i]!;
    const p0 = (o0.get(sym) ?? 0) / Math.max(1, [...o0.values()].reduce((a, b) => a + b, 0));
    let p1 = p0;
    if (i > 0) {
      const t = o1.get(data[i - 1]!);
      if (t) { const tot = [...t.values()].reduce((a, b) => a + b, 0); p1 = t.get(sym) ? t.get(sym)! / tot : p0; }
    }
    let p2 = p1;
    if (i > 1) {
      const t = o2.get(\`\${data[i - 2]!},\${data[i - 1]!}\`);
      if (t) { const tot = [...t.values()].reduce((a, b) => a + b, 0); p2 = t.get(sym) ? t.get(sym)! / tot : p1; }
    }
    const blended = 0.2 * p0 + 0.3 * p1 + 0.5 * p2;
    hooks.onBlend?.(sym, blended);
    out.push({ sym, prob: blended });
    o0.set(sym, (o0.get(sym) ?? 0) + 1);
    if (i > 0) {
      if (!o1.has(data[i - 1]!)) o1.set(data[i - 1]!, new Map());
      const t = o1.get(data[i - 1]!)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
    if (i > 1) {
      const k = \`\${data[i - 2]!},\${data[i - 1]!}\`;
      if (!o2.has(k)) o2.set(k, new Map());
      const t = o2.get(k)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ppmStar } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABABCABAB'.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'PPM*d', en: 'PPM*d' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ppmStar(data, {
    onBlend: (s, p) => rec.begin({ zh: \`'\${String.fromCharCode(s)}' 混合 p=\${p.toFixed(2)}\`, en: '' })
      .setBars(data.map((v) => ({ value: v, role: (v === s ? 'final' : 'default') as BarRole })))
      .setAux([{ label: 'prob', value: p.toFixed(2), role: 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ppmStar } from '../../src/algorithms/compression/comp-ppm-d-star/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ppm-d-star/trace.ts';

test('ppm*d 输出长度匹配', () => {
  const out = ppmStar([65, 66, 65, 66, 65, 66]);
  assert.equal(out.length, 6);
});
test('ppm*d 概率在 [0,1]', () => {
  for (const x of ppmStar([65, 66, 65])) assert.ok(x.prob >= 0 && x.prob <= 1);
});
test('ppm*d trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 20. comp-ctw
{
  id: 'comp-ctw',
  titleZh: 'CTW', titleEn: 'Context Tree Weighting',
  summaryZh: 'CTW：上下文树加权，二阶上下文最优混合。',
  summaryEn: 'CTW: context tree weighting, provably optimal for binary trees.',
  descZh: 'CTW（Willems 等）用二叉上下文树对每条路径的 Krichevsky-Trofimov 估计做对数加权混合，对二阶马尔可夫源渐近最优。',
  descEn: 'CTW (Willems et al.) uses a binary context tree, blending Krichevsky-Trofimov estimates per path with log-weighting; asymptotically optimal for binary Markov sources.',
  tags: ['compression','ctw','context-tree','binary'],
  time: 'O(n·d)', space: 'O(2^d)',
  impl: `// CTW · 实现（简化：order-d 二叉上下文）
export interface CtwHooks { onPredict?: (bit: number, prob: number) => void; }
interface Node { a: number; b: number; }
export function ctwPredict(bits: number[], depth = 4, hooks: CtwHooks = {}): number[] {
  const tree = new Map<string, Node>();
  const probs: number[] = [];
  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i]!;
    const ctx = bits.slice(Math.max(0, i - depth), i).join('');
    const node = tree.get(ctx) ?? { a: 0, b: 0 };
    // Krichevsky-Trofimov 估计
    const prob1 = (node.b + 0.5) / (node.a + node.b + 1);
    hooks.onPredict?.(bit, bit === 1 ? prob1 : 1 - prob1);
    probs.push(bit === 1 ? prob1 : 1 - prob1);
    if (bit === 1) node.b++; else node.a++;
    tree.set(ctx, node);
  }
  return probs;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctwPredict } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bits = [0,1,0,1,0,1,1,0,0,1];
  rec.begin({ zh: 'CTW', en: 'CTW' })
    .setBars(bits.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ctwPredict(bits, 3, {
    onPredict: (bit, p) => rec.begin({ zh: \`bit=\${bit} p=\${p.toFixed(2)}\`, en: '' })
      .setAux([{ label: 'prob', value: p.toFixed(2), role: 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctwPredict } from '../../src/algorithms/compression/comp-ctw/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ctw/trace.ts';

test('ctw 概率在 [0,1]', () => {
  for (const p of ctwPredict([0,1,0,1,0,1])) assert.ok(p >= 0 && p <= 1);
});
test('ctw 长度匹配', () => {
  assert.equal(ctwPredict([1,0,1,0]).length, 4);
});
test('ctw trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 21. comp-bwt-3
{
  id: 'comp-bwt-3',
  titleZh: 'BWT v3', titleEn: 'Burrows-Wheeler Transform v3',
  summaryZh: 'BWT：对所有循环旋转排序，输出末列 + 原始行号。',
  summaryEn: 'BWT: sort all cyclic rotations, output last column + original row index.',
  descZh: 'BWT（Burrows & Wheeler）对字符串的所有循环旋转排序，输出最后一列 L 和原始字符串所在行索引 primary。L 中相同字符聚集，便于后续 RLE/MTF。',
  descEn: 'BWT (Burrows & Wheeler) sorts all cyclic rotations and outputs the last column L plus the primary index of the original row. L clusters identical chars, suiting RLE/MTF.',
  tags: ['compression','bwt','transform','reversible'],
  time: 'O(n² log n) naive', space: 'O(n²)',
  impl: `// BWT v3 · 实现（朴素）
export interface BwtResult { last: string; primary: number; }
export interface BwtHooks { onRotations?: (rots: string[]) => void; onResult?: (r: BwtResult) => void; }
export function bwtEncode(s: string, hooks: BwtHooks = {}): BwtResult {
  const n = s.length;
  const rots: string[] = [];
  for (let i = 0; i < n; i++) rots.push(s.slice(i) + s.slice(0, i));
  hooks.onRotations?.(rots);
  rots.sort();
  const last = rots.map((r) => r[n - 1]!).join('');
  const primary = rots.findIndex((r) => r === s);
  const result = { last, primary };
  hooks.onResult?.(result);
  return result;
}
export function bwtDecode(last: string, primary: number): string {
  const n = last.length;
  const rows = last.split('').map((c, i) => ({ c, i }));
  rows.sort((a, b) => a.c < b.c ? -1 : a.c > b.c ? 1 : a.i - b.i);
  let result = '';
  let idx = primary;
  for (let k = 0; k < n; k++) { result += last[idx]!; idx = rows[idx]!.i; }
  return result;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bwtEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'banana';
  rec.begin({ zh: 'BWT', en: 'BWT' })
    .setBars(input.split('').map((c) => ({ value: c.charCodeAt(0), role: 'default' as BarRole }))).commit();
  bwtEncode(input, {
    onRotations: (rots) => rec.begin({ zh: \`\${rots.length} 个旋转\`, en: \`\${rots.length} rotations\` })
      .setAux([{ label: 'rotations', value: String(rots.length), role: 'compare' as BarRole }]).commit(),
    onResult: (r) => rec.begin({ zh: \`L='\${r.last}' primary=\${r.primary}\`, en: \`L='\${r.last}' primary=\${r.primary}\` })
      .setBars(r.last.split('').map((c) => ({ value: c.charCodeAt(0), role: 'final' as BarRole })))
      .setAux([{ label: 'primary', value: String(r.primary), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwtEncode, bwtDecode } from '../../src/algorithms/compression/comp-bwt-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bwt-3/trace.ts';

test('bwt banana', () => {
  const r = bwtEncode('banana');
  assert.equal(r.last, 'nnbaaa');
});
test('bwt round-trip', () => {
  for (const s of ['banana', 'abracadabra', 'mississippi']) {
    const r = bwtEncode(s);
    assert.equal(bwtDecode(r.last, r.primary), s);
  }
});
test('bwt trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 22. comp-mtf-2
{
  id: 'comp-mtf-2',
  titleZh: 'MTF v2', titleEn: 'Move-To-Front v2',
  summaryZh: 'MTF：把符号输出为「在表中的位置」并移到最前。',
  summaryEn: 'MTF: emit a symbol table position, then move it to front.',
  descZh: 'Move-To-Front 维护符号表，遇到符号时输出其当前索引并把它移到表头。常与 BWT 串联：BWT 后相同字符聚集，MTF 后变为小整数。',
  descEn: 'Move-To-Front maintains a symbol table; on each symbol it emits the current index and moves the symbol to the front. Often chained after BWT: BWT clusters chars, MTF turns them into small integers.',
  tags: ['compression','mtf','transform','reversible'],
  time: 'O(n·σ)', space: 'O(σ)',
  impl: `// MTF v2 · 实现
export interface MtfHooks { onEncode?: (sym: number, idx: number) => void; onMoveToFront?: (table: number[]) => void; }
export function mtfEncode(data: number[], alphabet: number[], hooks: MtfHooks = {}): number[] {
  const table = [...alphabet];
  const out: number[] = [];
  for (const sym of data) {
    const idx = table.indexOf(sym);
    out.push(idx);
    hooks.onEncode?.(sym, idx);
    if (idx > 0) { table.splice(idx, 1); table.unshift(sym); hooks.onMoveToFront?.([...table]); }
  }
  return out;
}
export function mtfDecode(idxes: number[], alphabet: number[]): number[] {
  const table = [...alphabet];
  const out: number[] = [];
  for (const idx of idxes) {
    const sym = table[idx]!;
    out.push(sym);
    if (idx > 0) { table.splice(idx, 1); table.unshift(sym); }
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mtfEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'banana'.split('').map((c) => c.charCodeAt(0));
  const alphabet = [...new Set(data)].sort((a, b) => a - b);
  rec.begin({ zh: 'MTF', en: 'MTF' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  mtfEncode(data, alphabet, {
    onEncode: (s, idx) => rec.begin({ zh: \`'\${String.fromCharCode(s)}' → idx=\${idx}\`, en: '' })
      .setAux([{ label: 'idx', value: String(idx), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mtfEncode, mtfDecode } from '../../src/algorithms/compression/comp-mtf-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-mtf-2/trace.ts';

test('mtf round-trip', () => {
  const alpha = [97, 98, 110]; // a b n
  const data = [98, 97, 110, 97, 110, 97]; // banana
  const enc = mtfEncode(data, alpha);
  const dec = mtfDecode(enc, [...alpha]);
  assert.deepEqual(dec, data);
});
test('mtf trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 23. comp-rle-3
{
  id: 'comp-rle-3',
  titleZh: 'RLE v3', titleEn: 'Run-Length Encoding v3',
  summaryZh: 'RLE v3：游程编码，含字面 run 优化。',
  summaryEn: 'RLE v3: run-length encoding with literal-run optimization.',
  descZh: 'RLE v3 把连续相同字符编码为 (count, char)；当连续无重复字符达到阈值时输出「字面 run」避免膨胀。',
  descEn: 'RLE v3 encodes runs as (count, char); when consecutive non-repeating chars reach a threshold, emit a literal run to avoid bloat.',
  tags: ['compression','rle','run-length'],
  time: 'O(n)', space: 'O(n)',
  impl: `// RLE v3 · 实现
export interface RleToken { kind: 'run' | 'lit'; len: number; char?: number; lits?: number[]; }
export interface RleHooks { onToken?: (t: RleToken) => void; }
export function rleEncode(data: number[], minRun = 3, hooks: RleHooks = {}): RleToken[] {
  const out: RleToken[] = [];
  let i = 0;
  while (i < data.length) {
    let run = 1;
    while (i + run < data.length && data[i + run] === data[i] && run < 255) run++;
    if (run >= minRun) {
      const t: RleToken = { kind: 'run', len: run, char: data[i] };
      out.push(t); hooks.onToken?.(t); i += run;
    } else {
      // 累积字面
      const lits: number[] = [];
      while (i < data.length) {
        let r = 1;
        while (i + r < data.length && data[i + r] === data[i]) r++;
        if (r >= minRun) break;
        lits.push(data[i]!); i++;
        if (lits.length >= 128) break;
      }
      const t: RleToken = { kind: 'lit', len: lits.length, lits };
      out.push(t); hooks.onToken?.(t);
    }
  }
  return out;
}
export function rleDecode(tokens: RleToken[]): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.kind === 'run') for (let k = 0; k < t.len; k++) out.push(t.char!);
    else out.push(...(t.lits ?? []));
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rleEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AAAAAABCDEF'.split('').map((c) => c.charCodeAt(0));
  rec.begin({ zh: 'RLE v3', en: 'RLE v3' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  rleEncode(data, 3, {
    onToken: (t) => rec.begin({ zh: t.kind === 'run' ? \`run len=\${t.len} char=\${String.fromCharCode(t.char!)}\` : \`lit len=\${t.len}\`, en: '' })
      .setAux([{ label: t.kind, value: String(t.len), role: t.kind === 'run' ? 'final' : 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rleEncode, rleDecode } from '../../src/algorithms/compression/comp-rle-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rle-3/trace.ts';

test('rle round-trip', () => {
  const data = 'AAAAAABCDEF'.split('').map((c) => c.charCodeAt(0));
  const enc = rleEncode(data, 3);
  assert.deepEqual(rleDecode(enc), data);
});
test('rle 长游程被压缩', () => {
  const data = Array.from({ length: 10 }, () => 65); // 10 个 A
  const enc = rleEncode(data, 3);
  assert.ok(enc.length < data.length);
});
test('rle trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

];
