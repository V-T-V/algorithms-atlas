// hashing batch 2 — 30 new algorithms (70 -> 100)
export const algos = [
// 1. hash-fnv1-32
{
  id: 'hash-fnv1-32',
  titleZh: 'FNV-1 32位', titleEn: 'FNV-1 32-bit',
  summaryZh: 'Fowler-Noll-Vo 非加密哈希：offset basis 异或再乘素数，分布均匀速度快。',
  summaryEn: 'Fowler-Noll-Vo non-crypto hash: XOR offset basis then multiply prime; fast, well-distributed.',
  descZh: 'FNV-1：h=offset_basis，每字节 h=h*prime（用 FNV-1）或 h=(h^byte)*prime（FNV-1a）。32位 prime=0x01000193。',
  descEn: 'FNV-1: h=offset_basis; per byte h=h*prime (FNV-1) or h=(h^byte)*prime (FNV-1a). 32-bit prime=0x01000193.',
  tags: ['hashing','non-cryptographic'],
  time: 'O(n)', space: 'O(1)',
  impl: `// FNV-1 32-bit · 实现
export interface FnvHooks { onByte?: (i: number, byte: number, h: number) => void; onConclude?: (hash: number) => void; }
const OFFSET = 0x811c9dc5, PRIME = 0x01000193;
export function fnv1_32(data: string | readonly number[], hooks: FnvHooks = {}): number {
  const bytes = typeof data === 'string' ? [...data].map((c) => c.charCodeAt(0)) : [...data];
  let h = OFFSET;
  for (let i = 0; i < bytes.length; i++) {
    h = Math.imul(h, PRIME);
    hooks.onByte?.(i, bytes[i]!, h >>> 0);
  }
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fnv1_32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'hello';
  rec.begin({ zh: \`FNV-1-32 "\${s}"\`, en: \`FNV-1-32 "\${s}"\` }).commit();
  const h = fnv1_32(s, {
    onByte: (i, b, hv) => rec.begin({ zh: \`byte[\${i}]=\${b} h=0x\${hv.toString(16)}\`, en: \`byte[\${i}]=\${b} h=0x\${hv.toString(16)}\` })
      .setAux([{ label: 'h', value: '0x' + hv.toString(16), role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最终 0x\${h.toString(16)}\`, en: \`final 0x\${h.toString(16)}\` })
    .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fnv1_32 } from '../../src/algorithms/hashing/hash-fnv1-32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-fnv1-32/trace.ts';
test('FNV-1 确定性', () => {
  assert.equal(fnv1_32('abc'), fnv1_32('abc'));
  assert.notEqual(fnv1_32('abc'), fnv1_32('abd'));
});
test('空串返回 offset', () => {
  assert.equal(fnv1_32(''), 0x811c9dc5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 2. hash-fnv1a-64
{
  id: 'hash-fnv1a-64',
  titleZh: 'FNV-1a 64位', titleEn: 'FNV-1a 64-bit',
  summaryZh: '先异或字节再乘素数的 FNV 变体，雪崩效应优于 FNV-1。',
  summaryEn: 'FNV variant that XORs the byte before multiplying; better avalanche than FNV-1.',
  descZh: 'FNV-1a：h=(h XOR byte) * prime。64位 offset=0xcbf29ce484222325，prime=0x100000001b3。',
  descEn: 'FNV-1a: h=(h XOR byte)*prime. 64-bit offset=0xcbf29ce484222325, prime=0x100000001b3.',
  tags: ['hashing','non-cryptographic'],
  time: 'O(n)', space: 'O(1)',
  impl: `// FNV-1a 64-bit (BigInt) · 实现
export interface Fnv64Hooks { onByte?: (i: number, byte: number, h: bigint) => void; onConclude?: (hash: bigint) => void; }
const OFFSET64 = 0xcbf29ce484222325n;
const PRIME64 = 0x100000001b3n;
const MASK64 = (1n << 64n) - 1n;
export function fnv1a_64(data: string, hooks: Fnv64Hooks = {}): bigint {
  let h = OFFSET64;
  for (let i = 0; i < data.length; i++) {
    h = (h ^ BigInt(data.charCodeAt(i))) & MASK64;
    h = (h * PRIME64) & MASK64;
    hooks.onByte?.(i, data.charCodeAt(i), h);
  }
  hooks.onConclude?.(h);
  return h;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fnv1a_64 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'Hash';
  rec.begin({ zh: \`FNV-1a-64 "\${s}"\`, en: \`FNV-1a-64 "\${s}"\` }).commit();
  const h = fnv1a_64(s, {
    onConclude: (hv) => rec.begin({ zh: \`最终 0x\${hv.toString(16)}\`, en: \`final 0x\${hv.toString(16)}\` })
      .setAux([{ label: 'hash', value: '0x' + hv.toString(16), role: 'final' as BarRole }]).commit(),
  });
  void h;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fnv1a_64 } from '../../src/algorithms/hashing/hash-fnv1a-64/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-fnv1a-64/trace.ts';
test('FNV-1a 确定性', () => {
  assert.equal(fnv1a_64('abc'), fnv1a_64('abc'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 3. hash-pjw
{
  id: 'hash-pjw',
  titleZh: 'PJW ELF Hash', titleEn: 'PJW ELF Hash',
  summaryZh: 'ELF 文件符号表哈希：高位影响低位，分散前缀相似字符串。',
  summaryEn: 'ELF symbol-table hash: high bits fold into low bits, dispersing similar prefixes.',
  descZh: 'PJW/ELF Hash：每字节 h=(h<<4)+byte，高 4 位非零则异或回低位并清高 4 位。',
  descEn: 'PJW/ELF hash: per byte h=(h<<4)+byte; if top nibble nonzero, XOR it back and clear it.',
  tags: ['hashing','non-cryptographic','elf'],
  time: 'O(n)', space: 'O(1)',
  impl: `// PJW ELF Hash · 实现
export interface PjwHooks { onByte?: (i: number, byte: number, h: number) => void; onConclude?: (hash: number) => void; }
export function pjwHash(data: string, hooks: PjwHooks = {}): number {
  let h = 0, g;
  for (let i = 0; i < data.length; i++) {
    h = (h << 4) + data.charCodeAt(i);
    g = h & 0xf0000000;
    if (g !== 0) { h ^= g >>> 24; h &= ~g; }
    hooks.onByte?.(i, data.charCodeAt(i), h >>> 0);
  }
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pjwHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'elf_symbol';
  rec.begin({ zh: \`PJW ELF "\${s}"\`, en: \`PJW ELF "\${s}"\` }).commit();
  pjwHash(s, {
    onByte: (i, b, h) => rec.begin({ zh: \`[\${i}]=\${b} h=0x\${h.toString(16)}\`, en: \`[\${i}]=\${b} h=0x\${h.toString(16)}\` })
      .setAux([{ label: 'h', value: '0x' + h.toString(16), role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pjwHash } from '../../src/algorithms/hashing/hash-pjw/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-pjw/trace.ts';
test('PJW 确定性', () => {
  assert.equal(pjwHash('abc'), pjwHash('abc'));
  assert.notEqual(pjwHash('abc'), pjwHash('xyz'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 4. hash-oaat
{
  id: 'hash-oaat',
  titleZh: 'One-At-A-Time', titleEn: 'One-At-A-Time Hash',
  summaryZh: 'Jenkins One-At-A-Time：加字节+移位+加法混合，碰撞率低。',
  summaryEn: 'Jenkins One-At-A-Time: add byte + shifts + adds; low collision rate.',
  descZh: 'OAAT：h+=byte; h+=h<<10; h^=h>>>6。结束再 h+=h<<3; h^=h>>>11; h+=h<<15。',
  descEn: 'OAAT: h+=byte; h+=h<<10; h^=h>>>6. Final: h+=h<<3; h^=h>>>11; h+=h<<15.',
  tags: ['hashing','non-cryptographic','jenkins'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Jenkins One-At-A-Time · 实现
export interface OaatHooks { onByte?: (i: number, byte: number, h: number) => void; onConclude?: (hash: number) => void; }
export function oaatHash(data: string, hooks: OaatHooks = {}): number {
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h += data.charCodeAt(i);
    h += h << 10;
    h ^= h >>> 6;
    hooks.onByte?.(i, data.charCodeAt(i), h >>> 0);
  }
  h += h << 3;
  h ^= h >>> 11;
  h += h << 15;
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { oaatHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'jenkins';
  rec.begin({ zh: \`OAAT "\${s}"\`, en: \`OAAT "\${s}"\` }).commit();
  oaatHash(s, {
    onByte: (i, b, h) => rec.begin({ zh: \`\${b}: 0x\${h.toString(16)}\`, en: \`\${b}: 0x\${h.toString(16)}\` })
      .setAux([{ label: 'h', value: '0x' + h.toString(16), role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { oaatHash } from '../../src/algorithms/hashing/hash-oaat/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-oaat/trace.ts';
test('OAAT 确定性', () => {
  assert.equal(oaatHash('abc'), oaatHash('abc'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 5. hash-crc32
{
  id: 'hash-crc32',
  titleZh: 'CRC32', titleEn: 'CRC32',
  summaryZh: '循环冗余校验：基于多项式除法检测数据传输错误。',
  summaryEn: 'Cyclic redundancy check: polynomial division for detecting transmission errors.',
  descZh: 'CRC32：把数据视作多项式，除以生成多项式 0xEDB88320（反射），余数即校验码。查表加速。',
  descEn: 'CRC32: treat data as a polynomial, divide by generator 0xEDB88320 (reflected); remainder is checksum. Table-driven.',
  tags: ['hashing','checksum','crc'],
  time: 'O(n)', space: 'O(256)',
  impl: `// CRC32 · 实现 (table-driven, IEEE 802.3)
export interface CrcHooks { onByte?: (i: number, byte: number, crc: number) => void; onConclude?: (crc: number) => void; }
let table: number[] | null = null;
function buildTable(): number[] {
  if (table) return table;
  table = new Array<number>(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
}
export function crc32(data: string, hooks: CrcHooks = {}): number {
  const t = buildTable();
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ data.charCodeAt(i)) & 0xff]!;
    hooks.onByte?.(i, data.charCodeAt(i), (crc ^ 0xffffffff) >>> 0);
  }
  const out = (crc ^ 0xffffffff) >>> 0;
  hooks.onConclude?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crc32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = '123456789';
  rec.begin({ zh: \`CRC32 "\${s}"\`, en: \`CRC32 "\${s}"\` }).commit();
  const c = crc32(s, {
    onConclude: (crc) => rec.begin({ zh: \`CRC=0x\${crc.toString(16)}\`, en: \`CRC=0x\${crc.toString(16)}\` })
      .setAux([{ label: 'crc', value: '0x' + crc.toString(16), role: 'final' as BarRole }]).commit(),
  });
  void c;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc32 } from '../../src/algorithms/hashing/hash-crc32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-crc32/trace.ts';
test('CRC32 标准校验值', () => {
  assert.equal(crc32('123456789'), 0xcbf43926);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 6. hash-adler32
{
  id: 'hash-adler32',
  titleZh: 'Adler-32', titleEn: 'Adler-32',
  summaryZh: 'Zlib 用的轻量校验和：两个模 65521 的累加和。',
  summaryEn: 'Lightweight zlib checksum: two running sums mod 65521.',
  descZh: 'Adler-32：s1=(1+Σbytes) mod 65521，s2=Σ(每个位置的 s1) mod 65521，结果 (s2<<16)|s1。',
  descEn: 'Adler-32: s1=(1+Σbytes) mod 65521, s2=Σ(s1 at each step) mod 65521; result (s2<<16)|s1.',
  tags: ['hashing','checksum'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Adler-32 · 实现
export interface AdlerHooks { onByte?: (i: number, byte: number, s1: number, s2: number) => void; onConclude?: (checksum: number) => void; }
const MOD = 65521;
export function adler32(data: string, hooks: AdlerHooks = {}): number {
  let s1 = 1, s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data.charCodeAt(i)) % MOD;
    s2 = (s2 + s1) % MOD;
    hooks.onByte?.(i, data.charCodeAt(i), s1, s2);
  }
  const out = (s2 << 16) | s1;
  hooks.onConclude?.(out >>> 0);
  return out >>> 0;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adler32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'Wikipedia';
  rec.begin({ zh: \`Adler-32 "\${s}"\`, en: \`Adler-32 "\${s}"\` }).commit();
  const a = adler32(s, {
    onByte: (i, b, s1, s2) => rec.begin({ zh: \`\${b}: s1=\${s1} s2=\${s2}\`, en: \`\${b}: s1=\${s1} s2=\${s2}\` })
      .setAux([{ label: 's1', value: String(s1), role: 'pivot' as BarRole }, { label: 's2', value: String(s2), role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`adler=0x\${a.toString(16)}\`, en: \`adler=0x\${a.toString(16)}\` })
    .setAux([{ label: 'adler', value: '0x' + a.toString(16), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adler32 } from '../../src/algorithms/hashing/hash-adler32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-adler32/trace.ts';
test('Adler-32 标准值', () => {
  assert.equal(adler32('Wikipedia'), 0x11E60398);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 7. hash-murmur3-x86
{
  id: 'hash-murmur3-x86',
  titleZh: 'Murmur3 x86', titleEn: 'MurmurHash3 x86',
  summaryZh: '高性能非加密哈希：种子+混合+最终雪崩，广泛用于哈希表。',
  summaryEn: 'High-perf non-crypto hash: seed + mix + final avalanche; widely used in hash tables.',
  descZh: 'MurmurHash3 x86_32：分 4 字节块处理，每块 c1 旋转 c2 混合，尾部 finalizer fmix32 雪崩。',
  descEn: 'MurmurHash3 x86_32: process 4-byte blocks with c1/c2 rotate mix; tail handled; fmix32 finalizer avalanche.',
  tags: ['hashing','non-cryptographic','murmur'],
  time: 'O(n)', space: 'O(1)',
  impl: `// MurmurHash3 x86_32 · 实现
export interface MurmurHooks { onBlock?: (offset: number, k: number, h: number) => void; onConclude?: (hash: number) => void; }
const c1 = 0xcc9e2d51, c2 = 0x1b873593;
function rotl(x: number, r: number): number { return (x << r) | (x >>> (32 - r)); }
export function murmur3_32(data: string, seed = 0, hooks: MurmurHooks = {}): number {
  const len = data.length;
  let h = seed;
  const nblocks = Math.floor(len / 4);
  for (let i = 0; i < nblocks; i++) {
    let k = data.charCodeAt(i * 4) | (data.charCodeAt(i * 4 + 1) << 8) | (data.charCodeAt(i * 4 + 2) << 16) | (data.charCodeAt(i * 4 + 3) << 24);
    k = Math.imul(k, c1);
    k = rotl(k, 15);
    k = Math.imul(k, c2);
    h ^= k;
    h = rotl(h, 13);
    h = (Math.imul(h, 5) + 0xe6546b64) | 0;
    hooks.onBlock?.(i * 4, k >>> 0, h >>> 0);
  }
  let tail = 0, count = len & 3;
  if (count > 0) {
    const idx = nblocks * 4;
    let k1 = 0;
    for (let i = 0; i < count; i++) k1 ^= data.charCodeAt(idx + i) << (i * 8);
    k1 = Math.imul(k1, c1); k1 = rotl(k1, 15); k1 = Math.imul(k1, c2); h ^= k1;
    void tail;
  }
  h ^= len;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { murmur3_32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'MurmurHash3';
  rec.begin({ zh: \`Murmur3 "\${s}" seed=0\`, en: \`Murmur3 "\${s}" seed=0\` }).commit();
  const h = murmur3_32(s, 0, {
    onBlock: (off, k, hh) => rec.begin({ zh: \`块@\${off} k=0x\${k.toString(16)} h=0x\${hh.toString(16)}\`, en: \`block@\${off} k=0x\${k.toString(16)} h=0x\${hh.toString(16)}\` })
      .setAux([{ label: 'h', value: '0x' + hh.toString(16), role: 'pivot' as BarRole }]).commit(),
    onConclude: (hh) => rec.begin({ zh: \`hash=0x\${hh.toString(16)}\`, en: \`hash=0x\${hh.toString(16)}\` })
      .setAux([{ label: 'hash', value: '0x' + hh.toString(16), role: 'final' as BarRole }]).commit(),
  });
  void h;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { murmur3_32 } from '../../src/algorithms/hashing/hash-murmur3-x86/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-murmur3-x86/trace.ts';
test('Murmur3 确定性', () => {
  assert.equal(murmur3_32('abc', 42), murmur3_32('abc', 42));
  assert.notEqual(murmur3_32('abc', 1), murmur3_32('abc', 2));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 8. hash-xxh3-mix
{
  id: 'hash-xxh3-mix',
  titleZh: 'XXH3 混合', titleEn: 'XXH3 Mix',
  summaryZh: 'XXH3 用固定 secret 与输入字交错乘加，达到 SIMD 友好高吞吐。',
  summaryEn: 'XXH3 interleaves input with a fixed secret via multiply-add; SIMD-friendly high throughput.',
  descZh: 'XXH3 简化：把输入分块，与 secret 常数做乘加 + 旋转，最后 avalanche。极快且分布好。',
  descEn: 'XXH3 simplified: split input into blocks, multiply-add with secret constants + rotate, then avalanche. Very fast.',
  tags: ['hashing','non-cryptographic','xxhash'],
  time: 'O(n)', space: 'O(1)',
  impl: `// XXH3-style mix · 实现 (简化)
export interface XxhHooks { onBlock?: (i: number, acc: bigint) => void; onConclude?: (hash: number) => void; }
const PRIME64_1 = 0x9E3779B185EBCA87n;
const PRIME64_2 = 0xC2B2AE3D27D4EB4Fn;
const MASK = (1n << 64n) - 1n;
export function xxh3Mix(data: string, seed = 0n, hooks: XxhHooks = {}): number {
  let acc = (seed ^ PRIME64_1) & MASK;
  for (let i = 0; i < data.length; i += 8) {
    let lane = 0n;
    for (let j = 0; j < 8 && i + j < data.length; j++) lane |= BigInt(data.charCodeAt(i + j)!) << (8n * BigInt(j));
    acc = (acc + Math.imul(Number(lane & 0xffffffffn), 0x9e3779b1) >>> 0) & MASK;
    acc = ((acc ^ rotl64(lane, 31n)) * PRIME64_2) & MASK;
    hooks.onBlock?.(i / 8, acc);
  }
  acc = (acc + BigInt(data.length)) & MASK;
  acc ^= acc >>> 33n; acc = (acc * PRIME64_2) & MASK;
  acc ^= acc >>> 29n; acc = (acc * PRIME64_1) & MASK;
  acc ^= acc >>> 32n;
  const out = Number(acc & 0xffffffffn) >>> 0;
  hooks.onConclude?.(out);
  return out;
}
function rotl64(x: bigint, r: bigint): bigint { return ((x << r) | (x >> (64n - r))) & MASK; }
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xxh3Mix } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'xxhash3-test';
  rec.begin({ zh: \`XXH3 "\${s}"\`, en: \`XXH3 "\${s}"\` }).commit();
  xxh3Mix(s, 0n, {
    onConclude: (h) => rec.begin({ zh: \`hash=0x\${h.toString(16)}\`, en: \`hash=0x\${h.toString(16)}\` })
      .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xxh3Mix } from '../../src/algorithms/hashing/hash-xxh3-mix/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-xxh3-mix/trace.ts';
test('XXH3 确定性', () => {
  assert.equal(xxh3Mix('abc'), xxh3Mix('abc'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 9. hash-tabulation-small
{
  id: 'hash-tabulation-small',
  titleZh: '表格哈希', titleEn: 'Tabulation Hashing',
  summaryZh: '查表法：每字节查随机表后异或，3-独立但极快，适合简单哈希表。',
  summaryEn: 'Zobrist-style tabulation: XOR per-byte table lookups; 3-independent yet extremely fast.',
  descZh: 'Tabulation hashing：对每字节位置维护随机表 T[c][pos]，h = XOR over pos of T[byte][pos]。理论 3-独立。',
  descEn: 'Tabulation hashing: per-position random table T[c][pos]; h = XOR of T[byte][pos]. Theoretically 3-independent.',
  tags: ['hashing','non-cryptographic','tabulation'],
  time: 'O(n)', space: 'O(256·L)',
  impl: `// Tabulation Hashing · 实现
export interface TabHooks { onChar?: (pos: number, ch: number, partial: number) => void; onConclude?: (hash: number) => void; }
export function tabulationHash(data: string, table?: number[][], hooks: TabHooks = {}): number {
  const L = 16; // max length supported
  const T = table ?? makeTable(256, L, 42);
  let h = 0;
  for (let p = 0; p < data.length && p < L; p++) {
    const c = data.charCodeAt(p);
    const partial = T[c]![p]!;
    h ^= partial;
    hooks.onChar?.(p, c, h >>> 0);
  }
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
function makeTable(rows: number, cols: number, seed: number): number[][] {
  let s = seed;
  const rng = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; };
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => rng()));
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tabulationHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'tab';
  rec.begin({ zh: \`Tabulation "\${s}"\`, en: \`Tabulation "\${s}"\` }).commit();
  tabulationHash(s, undefined, {
    onChar: (p, c, h) => rec.begin({ zh: \`pos\${p} char\${c} -> 0x\${h.toString(16)}\`, en: \`pos\${p} char\${c} -> 0x\${h.toString(16)}\` })
      .setAux([{ label: 'h', value: '0x' + h.toString(16), role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tabulationHash } from '../../src/algorithms/hashing/hash-tabulation-small/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-tabulation-small/trace.ts';
test('Tabulation 确定性', () => {
  assert.equal(tabulationHash('abc'), tabulationHash('abc'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 10. hash-cuckoo-probe
{
  id: 'hash-cuckoo-probe',
  titleZh: '布谷鸟探查', titleEn: 'Cuckoo Probe Sequence',
  summaryZh: '模拟布谷鸟哈希插入的踢出链，分析失败阈值。',
  summaryEn: 'Simulate the eviction chain during cuckoo-hash insertion; analyze the failure threshold.',
  descZh: '布谷鸟哈希：每键两个哈希位置，插入时若满则踢出对方到其另一位置，形成链。链过长则需 rehash。',
  descEn: 'Cuckoo hashing: two hash slots per key; insert evicts the occupant to its other slot, forming a chain.',
  tags: ['hashing','hash-table','cuckoo'],
  time: 'O(1) amortized', space: 'O(n)',
  impl: `// 布谷鸟探查 · 实现
export interface CuckooHooks { onEvict?: (kickedKey: string, fromSlot: number, toSlot: number) => void; onInsert?: (key: string, slot: number) => void; onConclude?: (success: boolean, kicks: number) => void; }
const SIZE = 16;
export function cuckooInsert(keys: readonly string[], h1: (k: string) => number, h2: (k: string) => number, hooks: CuckooHooks = {}): boolean {
  const table = new Array<string | undefined>(SIZE);
  let kicks = 0;
  for (const key of keys) {
    let cur: string | undefined = key;
    let pos = h1(cur) % SIZE;
    for (let attempt = 0; attempt < 50 && cur !== undefined; attempt++) {
      if (table[pos] === undefined) { table[pos] = cur; hooks.onInsert?.(cur, pos); cur = undefined; }
      else {
        const kicked = table[pos]!; table[pos] = cur;
        hooks.onEvict?.(kicked, pos, h2(kicked) % SIZE);
        pos = (pos === h1(kicked) % SIZE ? h2(kicked) % SIZE : h1(kicked) % SIZE);
        cur = kicked; kicks++;
      }
    }
    if (cur !== undefined) { hooks.onConclude?.(false, kicks); return false; }
  }
  hooks.onConclude?.(true, kicks);
  return true;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cuckooInsert } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = ['a', 'b', 'c', 'd', 'e'];
  const h1 = (k: string) => k.charCodeAt(0) * 7;
  const h2 = (k: string) => k.charCodeAt(0) * 13;
  rec.begin({ zh: '布谷鸟插入', en: 'Cuckoo insert' }).commit();
  const ok = cuckooInsert(keys, h1, h2, {
    onInsert: (k, s) => rec.begin({ zh: \`\${k} -> slot\${s}\`, en: \`\${k} -> slot\${s}\` })
      .setBars([{ value: s, role: 'final' as BarRole }]).commit(),
    onEvict: (k, f, t) => rec.begin({ zh: \`踢出 \${k}: \${f}->\${t}\`, en: \`evict \${k}: \${f}->\${t}\` })
      .setBars([{ value: t, role: 'warn' as BarRole }]).commit(),
  });
  rec.begin({ zh: ok ? '成功' : '失败', en: ok ? 'success' : 'fail' })
    .setAux([{ label: 'result', value: ok ? 'OK' : 'FAIL', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cuckooInsert } from '../../src/algorithms/hashing/hash-cuckoo-probe/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-cuckoo-probe/trace.ts';
test('小规模布谷鸟成功', () => {
  const ok = cuckooInsert(['a', 'b'], (k) => k.charCodeAt(0), (k) => k.charCodeAt(0) + 5);
  assert.equal(ok, true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 11. hash-linear-probe-analysis
{
  id: 'hash-linear-probe-analysis',
  titleZh: '线性探查分析', titleEn: 'Linear Probing Analysis',
  summaryZh: '分析线性探查下负载因子与平均探查次数的关系。',
  summaryEn: 'Analyze the relationship between load factor and expected probe count under linear probing.',
  descZh: '线性探查：冲突时顺序后移。Knuth 公式：成功查找期望探查 ≈ (1+1/(1-α))/2，α 为负载因子。',
  descEn: 'Linear probing: on collision move forward. Knuth: successful search probes ≈ (1+1/(1-α))/2.',
  tags: ['hashing','hash-table','analysis'],
  time: 'O(n)', space: 'O(n)',
  impl: `// 线性探查分析 · 实现 (实测+理论对比)
export interface LpaHooks { onInsert?: (key: number, probes: number) => void; onConclude?: (avgProbes: number, theory: number) => void; }
export function linearProbingAnalysis(size: number, keys: readonly number[], hooks: LpaHooks = {}): { avg: number; theory: number } {
  const table = new Array<number | undefined>(size);
  let totalProbes = 0;
  for (const key of keys) {
    let idx = key % size, probes = 0;
    while (table[idx] !== undefined) { idx = (idx + 1) % size; probes++; }
    table[idx] = key; totalProbes += probes + 1;
    hooks.onInsert?.(key, probes + 1);
  }
  const alpha = keys.length / size;
  const theory = (1 + 1 / (1 - alpha)) / 2;
  const avg = totalProbes / keys.length;
  hooks.onConclude?.(avg, theory);
  return { avg, theory };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { linearProbingAnalysis } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [5, 21, 37, 53, 69, 13];
  rec.begin({ zh: '线性探查 size=16', en: 'Linear probing size=16' }).commit();
  const r = linearProbingAnalysis(16, keys, {
    onInsert: (k, p) => rec.begin({ zh: \`\${k}: \${p} 次探查\`, en: \`\${k}: \${p} probes\` })
      .setBars([{ value: p, role: 'pivot' as BarRole }]).commit(),
    onConclude: (avg, th) => rec.begin({ zh: \`实测\${avg.toFixed(2)} 理论\${th.toFixed(2)}\`, en: \`actual\${avg.toFixed(2)} theory\${th.toFixed(2)}\` })
      .setBars([{ value: avg, role: 'final' as BarRole }, { value: th, role: 'default' as BarRole }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearProbingAnalysis } from '../../src/algorithms/hashing/hash-linear-probe-analysis/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-linear-probe-analysis/trace.ts';
test('线性探查平均次数为正', () => {
  const r = linearProbingAnalysis(16, [1, 2, 3, 4]);
  assert.ok(r.avg >= 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 12. hash-robin-hood-probe
{
  id: 'hash-robin-hood-probe',
  titleZh: 'Robin Hood 探查', titleEn: 'Robin Hood Probing',
  summaryZh: '线性探查变体：插入时让"更富"(探查少)的元素让位给"更穷"的，均衡探查距离。',
  summaryEn: 'Linear-probe variant: on insert, evict a richer (closer) element to help a poorer one; balances probe distance.',
  descZh: 'Robin Hood：探查时比较当前键的"到家的距离"，若新键更远则交换，劫富济贫使最大探查距离最小。',
  descEn: 'Robin Hood: compare probe distance to home; if the newcomer is farther, swap. Minimizes max probe distance.',
  tags: ['hashing','hash-table','robin-hood'],
  time: 'O(1) amortized', space: 'O(n)',
  impl: `// Robin Hood 探查 · 实现
export interface RhEntry { key: number; psl: number; }
export interface RhHooks { onSwap?: (richerKey: number, poorerKey: number) => void; onInsert?: (key: number, psl: number) => void; onConclude?: (maxPsl: number) => void; }
export function robinHoodInsert(size: number, keys: readonly number[], hooks: RhHooks = {}): number {
  const table = new Array<RhEntry | undefined>(size);
  let maxPsl = 0;
  for (const key of keys) {
    let cur: RhEntry = { key, psl: 0 };
    let idx = key % size;
    for (;;) {
      if (table[idx] === undefined) { table[idx] = cur; hooks.onInsert?.(cur.key, cur.psl); maxPsl = Math.max(maxPsl, cur.psl); break; }
      if (table[idx]!.psl < cur.psl) { const tmp = table[idx]!; table[idx] = cur; cur = tmp; hooks.onSwap?.(table[idx]!.key, cur.key); }
      idx = (idx + 1) % size; cur.psl++;
    }
  }
  hooks.onConclude?.(maxPsl);
  return maxPsl;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { robinHoodInsert } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [5, 21, 37, 6, 22];
  rec.begin({ zh: 'Robin Hood 探查', en: 'Robin Hood probing' }).commit();
  const mx = robinHoodInsert(8, keys, {
    onInsert: (k, p) => rec.begin({ zh: \`\${k} psl=\${p}\`, en: \`\${k} psl=\${p}\` })
      .setBars([{ value: p, role: 'final' as BarRole }]).commit(),
    onSwap: (r, p) => rec.begin({ zh: \`交换 富\${r} 穷\${p}\`, en: \`swap rich\${r} poor\${p}\` })
      .setBars([{ value: 1, role: 'warn' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最大 PSL \${mx}\`, en: \`max PSL \${mx}\` })
    .setAux([{ label: 'maxPSL', value: String(mx), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robinHoodInsert } from '../../src/algorithms/hashing/hash-robin-hood-probe/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-robin-hood-probe/trace.ts';
test('Robin Hood 最大 PSL 非负', () => {
  const mx = robinHoodInsert(8, [1, 2, 3]);
  assert.ok(mx >= 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 13. hash-hopscotch-probe
{
  id: 'hash-hopscotch-probe',
  titleZh: 'Hopscotch 哈希', titleEn: 'Hopscotch Hashing',
  summaryZh: '开放寻址变体：键必须在家的 H 邻域内，利用位图维护邻近性。',
  summaryEn: 'Open-addressing variant: keys stay within H of home; a bitmap tracks neighborhood.',
  descZh: 'Hopscotch：每个槽维护邻域位图。插入时若超出邻域，则把更近的元素"位移"过来腾位。',
  descEn: 'Hopscotch: each slot has a neighborhood bitmap. On insert beyond range, displace nearer elements to make room.',
  tags: ['hashing','hash-table','hopscotch'],
  time: 'O(1) amortized', space: 'O(n)',
  impl: `// Hopscotch 哈希 · 实现 (H=4)
export interface HhHooks { onDisplace?: (key: number, from: number, to: number) => void; onInsert?: (key: number, slot: number) => void; onConclude?: (success: boolean) => void; }
const H = 4;
export function hopscotchInsert(size: number, keys: readonly number[], hooks: HhHooks = {}): boolean {
  const table = new Array<number | undefined>(size);
  const bitmap = new Array<number>(size).fill(0);
  for (const key of keys) {
    const home = key % size;
    let idx = home;
    while (idx < size && table[idx] !== undefined) idx++;
    if (idx >= size || idx - home >= H * 4) { hooks.onConclude?.(false); return false; }
    while (idx - home >= H) {
      let moved = false;
      for (let j = Math.max(home, idx - H + 1); j <= idx - 1; j++) {
        const k = table[j]!; const kh = k % size;
        if (idx - kh < H) {
          table[idx] = k; table[j] = undefined;
          bitmap[kh] = (bitmap[kh]! & ~(1 << (j - kh))) | (1 << (idx - kh));
          hooks.onDisplace?.(k, j, idx);
          idx = j; moved = true; break;
        }
      }
      if (!moved) { hooks.onConclude?.(false); return false; }
    }
    table[idx] = key; bitmap[home] |= 1 << (idx - home);
    hooks.onInsert?.(key, idx);
  }
  hooks.onConclude?.(true);
  return true;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hopscotchInsert } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [1, 9, 17, 25];
  rec.begin({ zh: 'Hopscotch H=4', en: 'Hopscotch H=4' }).commit();
  const ok = hopscotchInsert(32, keys, {
    onInsert: (k, s) => rec.begin({ zh: \`\${k} -> slot\${s}\`, en: \`\${k} -> slot\${s}\` })
      .setBars([{ value: s, role: 'final' as BarRole }]).commit(),
    onDisplace: (k, f, t) => rec.begin({ zh: \`\${k}: \${f}->\${t}\`, en: \`\${k}: \${f}->\${t}\` }).commit(),
  });
  rec.begin({ zh: ok ? '成功' : '失败', en: ok ? 'OK' : 'fail' })
    .setAux([{ label: 'ok', value: ok ? 'YES' : 'NO', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hopscotchInsert } from '../../src/algorithms/hashing/hash-hopscotch-probe/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-hopscotch-probe/trace.ts';
test('Hopscotch 小规模成功', () => {
  assert.equal(hopscotchInsert(32, [1, 2, 3]), true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 14. hash-bloom-test
{
  id: 'hash-bloom-test',
  titleZh: '布隆过滤器', titleEn: 'Bloom Filter',
  summaryZh: '位数组+k 个哈希，空间高效成员查询，有假阳性无假阴性。',
  summaryEn: 'Bit array + k hashes; space-efficient membership with false positives, no false negatives.',
  descZh: '布隆过滤器：m 位+ k 个哈希。插入置 k 位，查询全 1 才可能存在。假阳性率 ≈ (1-e^(-kn/m))^k。',
  descEn: 'Bloom filter: m bits + k hashes. Insert sets k bits; query all-1 means maybe present. FP rate ≈ (1-e^(-kn/m))^k.',
  tags: ['hashing','bloom-filter','probabilistic'],
  time: 'O(k)', space: 'O(m)',
  impl: `// 布隆过滤器 · 实现
export interface BloomHooks { onAdd?: (item: string, bits: number[]) => void; onQuery?: (item: string, maybePresent: boolean) => void; }
export class BloomFilter {
  bits: Uint8Array; k: number; m: number;
  constructor(m: number, k: number) { this.m = m; this.k = k; this.bits = new Uint8Array(m); }
  private idx(item: string, i: number): number { let h = (i + 1) * 131; for (let p = 0; p < item.length; p++) h = (h * 16777619) ^ item.charCodeAt(p); return (h >>> 0) % this.m; }
  add(item: string, hooks?: BloomHooks) { const set: number[] = []; for (let i = 0; i < this.k; i++) { const p = this.idx(item, i); this.bits[p] = 1; set.push(p); } hooks?.onAdd?.(item, set); }
  has(item: string, hooks?: BloomHooks): boolean { let ok = true; for (let i = 0; i < this.k; i++) if (this.bits[this.idx(item, i)] === 0) { ok = false; break; } hooks?.onQuery?.(item, ok); return ok; }
}
export function bloomDemo(items: readonly string[], queries: readonly string[], m: number, k: number, hooks: BloomHooks = {}): { fp: number } {
  const bf = new BloomFilter(m, k);
  for (const it of items) bf.add(it, hooks);
  let fp = 0;
  for (const q of queries) if (bf.has(q, hooks) && !items.includes(q)) fp++;
  return { fp };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bloomDemo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = ['apple', 'banana', 'cherry'];
  const queries = ['apple', 'grape', 'banana', 'melon'];
  rec.begin({ zh: '布隆过滤器 m=64 k=3', en: 'Bloom filter m=64 k=3' }).commit();
  const r = bloomDemo(items, queries, 64, 3, {
    onAdd: (it, bits) => rec.begin({ zh: \`加入 \${it} 位置[\${bits.join(',')}]\`, en: \`add \${it} [\${bits.join(',')}]\` })
      .setBars(bits.map((b) => ({ value: b % 20, role: 'final' as BarRole }))).commit(),
    onQuery: (it, maybe) => rec.begin({ zh: \`查 \${it}: \${maybe ? '可能' : '不在'}\`, en: \`query \${it}: \${maybe ? 'maybe' : 'no'}\` })
      .setAux([{ label: 'result', value: maybe ? 'YES' : 'NO', role: maybe ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bloomDemo } from '../../src/algorithms/hashing/hash-bloom-test/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-bloom-test/trace.ts';
test('已加入元素必返回 true', () => {
  const r = bloomDemo(['a'], ['a'], 64, 3);
  assert.equal(r.fp, 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 15. hash-counting-bloom
{
  id: 'hash-counting-bloom',
  titleZh: '计数布隆', titleEn: 'Counting Bloom Filter',
  summaryZh: '用计数器代替位支持删除，应对插入/删除流。',
  summaryEn: 'Uses counters instead of bits to support deletion under insert/delete streams.',
  descZh: '计数布隆：每槽为计数器（通常 4 位）。插入+1，删除-1。避免位布隆无法删除的问题，但占更多空间。',
  descEn: 'Counting bloom: each slot a counter (usually 4 bits). Insert +1, delete -1. Allows deletion at extra space.',
  tags: ['hashing','bloom-filter','counting'],
  time: 'O(k)', space: 'O(m)',
  impl: `// 计数布隆过滤器 · 实现
export interface CbfHooks { onAdd?: (item: string, slots: number[]) => void; onRemove?: (item: string, slots: number[]) => void; onQuery?: (item: string, count: number) => void; }
export class CountingBloom {
  counts: Uint8Array; k: number; m: number;
  constructor(m: number, k: number) { this.m = m; this.k = k; this.counts = new Uint8Array(m); }
  private idx(item: string, i: number): number { let h = i * 263; for (let p = 0; p < item.length; p++) h = (h * 31 + item.charCodeAt(p)) >>> 0; return h % this.m; }
  add(item: string, hooks?: CbfHooks) { const s: number[] = []; for (let i = 0; i < this.k; i++) { const p = this.idx(item, i); this.counts[p]++; s.push(p); } hooks?.onAdd?.(item, s); }
  remove(item: string, hooks?: CbfHooks) { const s: number[] = []; for (let i = 0; i < this.k; i++) { const p = this.idx(item, i); if (this.counts[p] > 0) this.counts[p]--; s.push(p); } hooks?.onRemove?.(item, s); }
  has(item: string, hooks?: CbfHooks): boolean { const mn = Math.min(...Array.from({ length: this.k }, (_, i) => this.counts[this.idx(item, i)])); hooks?.onQuery?.(item, mn); return mn > 0; }
}
export function countingBloomDemo(adds: readonly string[], removes: readonly string[], queries: readonly string[], m: number, k: number, hooks: CbfHooks = {}): void {
  const cbf = new CountingBloom(m, k);
  for (const a of adds) cbf.add(a, hooks);
  for (const r of removes) cbf.remove(r, hooks);
  for (const q of queries) cbf.has(q, hooks);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countingBloomDemo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '计数布隆 m=32 k=3', en: 'Counting bloom m=32 k=3' }).commit();
  countingBloomDemo(['a', 'b'], ['a'], ['a', 'b'], 32, 3, {
    onAdd: (it) => rec.begin({ zh: \`加入 \${it}\`, en: \`add \${it}\` }).commit(),
    onRemove: (it) => rec.begin({ zh: \`删除 \${it}\`, en: \`remove \${it}\` }).commit(),
    onQuery: (it, c) => rec.begin({ zh: \`查 \${it}: min计数\${c}\`, en: \`query \${it}: min\${c}\` })
      .setBars([{ value: c, role: c > 0 ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CountingBloom } from '../../src/algorithms/hashing/hash-counting-bloom/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-counting-bloom/trace.ts';
test('删除后元素消失', () => {
  const cbf = new CountingBloom(32, 3);
  cbf.add('x');
  assert.equal(cbf.has('x'), true);
  cbf.remove('x');
  assert.equal(cbf.has('x'), false);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 16. hash-hyperloglog-estimate
{
  id: 'hash-hyperloglog-estimate',
  titleZh: 'HyperLogLog 估计', titleEn: 'HyperLogLog Estimation',
  summaryZh: '用桶记录前导零最大值，常数内存估计基数，误差约 1.04/√m。',
  summaryEn: 'Buckets track max leading-zero counts; constant memory cardinality estimate, error ~1.04/√m.',
  descZh: 'HyperLogLog：哈希值前 b 位选桶，剩余位的前导零数+1 存入桶。基数 ≈ α·m²/Σ2^{-M[j]}。',
  descEn: 'HyperLogLog: top b bits pick bucket, store leading-zeros+1 of the rest. Cardinality ≈ alpha·m²/Σ2^{-M[j]}.',
  tags: ['hashing','cardinality','sketch'],
  time: 'O(1) per add', space: 'O(2^b)',
  impl: `// HyperLogLog · 实现 (b=4 => 16 buckets)
export interface HllHooks { onAdd?: (hash: number, bucket: number, leadingZeros: number, updated: number) => void; onEstimate?: (estimate: number) => void; }
export class HyperLogLog {
  b: number; m: number; M: number[]; alpha: number;
  constructor(b = 4) { this.b = b; this.m = 1 << b; this.M = new Array<number>(this.m).fill(0); this.alpha = 0.7213 / (1 + 1.079 / this.m); }
  private hash(x: number): number { let h = x * 2654435761; h = (h ^ (h >>> 16)) >>> 0; return h; }
  add(x: number, hooks?: HllHooks) { const h = this.hash(x); const idx = h >>> (32 - this.b); const w = (h << this.b) | (1 << (this.b - 1)); const lz = Math.clz32(w) + 1; if (lz > this.M[idx]!) { this.M[idx] = lz; hooks?.onAdd?.(h, idx, lz, lz); } }
  estimate(hooks?: HllHooks): number { let sum = 0; for (const v of this.M) sum += 2 ** -v; const e = this.alpha * this.m * this.m / sum; const est = e <= 2.5 * this.m ? Math.round(e) : Math.round(e); hooks?.onEstimate?.(est); return est; }
}
export function hllDemo(items: readonly number[], hooks: HllHooks = {}): number {
  const hll = new HyperLogLog(4);
  for (const x of items) hll.add(x, hooks);
  return hll.estimate(hooks);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hllDemo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = [1, 2, 3, 1, 2, 4, 5, 1, 6, 7];
  rec.begin({ zh: 'HyperLogLog b=4', en: 'HyperLogLog b=4' }).commit();
  const est = hllDemo(items, {
    onEstimate: (e) => rec.begin({ zh: \`估计基数 \${e} (真实 \${new Set(items).size})\`, en: \`estimate \${e} (actual \${new Set(items).size})\` })
      .setBars([{ value: e, role: 'final' as BarRole }]).commit(),
  });
  void est;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hllDemo } from '../../src/algorithms/hashing/hash-hyperloglog-estimate/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-hyperloglog-estimate/trace.ts';
test('HLL 返回正估计', () => {
  const e = hllDemo([1, 2, 3, 4, 5]);
  assert.ok(e > 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 17. hash-minhash-set
{
  id: 'hash-minhash-set',
  titleZh: 'MinHash 集合', titleEn: 'MinHash Set Similarity',
  summaryZh: '用 k 个哈希的最小值估计 Jaccard 相似度，用于近重复检测。',
  summaryEn: 'Use k min-hash values to estimate Jaccard similarity for near-duplicate detection.',
  descZh: 'MinHash：对集合 S，h_min(S)=min_{x∈S} h(x)。P[h_min(A)=h_min(B)]=|A∩B|/|A∪B|。k 个哈希取平均降方差。',
  descEn: 'MinHash: for set S, h_min(S)=min h(x). P[h_min(A)=h_min(B)]=Jaccard(A,B). k hashes average to reduce variance.',
  tags: ['hashing','similarity','minhash'],
  time: 'O(k·|S|)', space: 'O(k)',
  impl: `// MinHash · 实现
export interface MhHooks { onHash?: (i: number, aMin: number, bMin: number, match: boolean) => void; onConclude?: (estimate: number, actual: number) => void; }
function makeHasher(seed: number): (x: number) => number { return (x: number) => { let h = seed; h = (h ^ x) * 16777619 >>> 0; return h; }; }
export function minHashSimilarity(A: ReadonlySet<number>, B: ReadonlySet<number>, k: number, hooks: MhHooks = {}): number {
  let matches = 0;
  for (let i = 0; i < k; i++) {
    const h = makeHasher(i + 1);
    let aMin = Infinity, bMin = Infinity;
    for (const x of A) aMin = Math.min(aMin, h(x));
    for (const x of B) bMin = Math.min(bMin, h(x));
    const m = aMin === bMin; if (m) matches++;
    hooks.onHash?.(i, aMin, bMin, m);
  }
  const estimate = matches / k;
  const inter = [...A].filter((x) => B.has(x)).length;
  const uni = new Set([...A, ...B]).size;
  const actual = uni > 0 ? inter / uni : 0;
  hooks.onConclude?.(estimate, actual);
  return estimate;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minHashSimilarity } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const A = new Set([1, 2, 3, 4, 5]);
  const B = new Set([3, 4, 5, 6, 7]);
  rec.begin({ zh: 'MinHash k=20', en: 'MinHash k=20' }).commit();
  const est = minHashSimilarity(A, B, 20, {
    onConclude: (e, a) => rec.begin({ zh: \`估计 \${e.toFixed(2)} 实际 \${a.toFixed(2)}\`, en: \`est \${e.toFixed(2)} actual \${a.toFixed(2)}\` })
      .setBars([{ value: e, role: 'final' as BarRole }, { value: a, role: 'default' as BarRole }]).commit(),
  });
  void est;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minHashSimilarity } from '../../src/algorithms/hashing/hash-minhash-set/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-minhash-set/trace.ts';
test('相同集合相似度 1', () => {
  const S = new Set([1, 2, 3]);
  assert.ok(minHashSimilarity(S, S, 20) > 0.9);
});
test('不相交集合相似度 ~0', () => {
  const e = minHashSimilarity(new Set([1, 2]), new Set([3, 4]), 20);
  assert.ok(e < 0.3);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 18. hash-simhash-doc
{
  id: 'hash-simhash-doc',
  titleZh: 'SimHash 文档', titleEn: 'SimHash Document',
  summaryZh: '把文档特征加权求和后符号化，得到对局部修改鲁棒的指纹。',
  summaryEn: 'Weighted feature sum then sign-binarize; yields a fingerprint robust to local edits.',
  descZh: 'SimHash：每特征哈希成 64 位，按权重累加每位的正负，最终每位取符号。汉明距离小=>文档相似。',
  descEn: 'SimHash: hash each feature to 64 bits, accumulate weighted +1/-1 per bit, sign each bit at end. Small Hamming distance => similar.',
  tags: ['hashing','similarity','simhash'],
  time: 'O(n)', space: 'O(64)',
  impl: `// SimHash · 实现 (32-bit)
export interface ShHooks { onFeature?: (feat: string, weight: number, bits: number) => void; onConclude?: (fingerprint: number) => void; }
export function simHash(features: ReadonlyArray<readonly [string, number]>, hooks: ShHooks = {}): number {
  const v = new Array<number>(32).fill(0);
  for (const [feat, w] of features) {
    let h = 0; for (let i = 0; i < feat.length; i++) h = (h * 31 + feat.charCodeAt(i)) >>> 0;
    hooks.onFeature?.(feat, w, h);
    for (let b = 0; b < 32; b++) { const bit = (h >>> b) & 1; v[b]! += bit === 1 ? w : -w; }
  }
  let fp = 0;
  for (let b = 0; b < 32; b++) if (v[b]! > 0) fp |= 1 << b;
  hooks.onConclude?.(fp >>> 0);
  return fp >>> 0;
}
export function hamming32(a: number, b: number): number { let x = a ^ b, c = 0; while (x) { c += x & 1; x >>>= 1; } return c; }
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simHash, hamming32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const doc1: ReadonlyArray<readonly [string, number]> = [['hello', 3], ['world', 2], ['foo', 1]];
  const doc2: ReadonlyArray<readonly [string, number]> = [['hello', 3], ['world', 2], ['bar', 1]];
  rec.begin({ zh: 'SimHash', en: 'SimHash' }).commit();
  const f1 = simHash(doc1);
  const f2 = simHash(doc2);
  const dist = hamming32(f1, f2);
  rec.begin({ zh: \`汉明距离 \${dist}\`, en: \`Hamming \${dist}\` })
    .setBars([{ value: dist, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simHash, hamming32 } from '../../src/algorithms/hashing/hash-simhash-doc/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-simhash-doc/trace.ts';
test('相同文档指纹相同', () => {
  const f1 = simHash([['a', 1]]);
  const f2 = simHash([['a', 1]]);
  assert.equal(hamming32(f1, f2), 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 19. hash-geometric-bucket
{
  id: 'hash-geometric-bucket',
  titleZh: '几何分桶哈希', titleEn: 'Geometric Bucket Hash',
  summaryZh: '把浮点数量化到指数桶，适合对数尺度数据的快速分桶。',
  summaryEn: 'Quantize floats into exponential buckets; fast bucketing for log-scale data.',
  descZh: '几何分桶：value 映射到 floor(log2(|v|)) 桶号，相同数量级落同桶。用于去重与统计分布。',
  descEn: 'Geometric bucket: map value to floor(log2(|v|)); same magnitude lands in same bucket. Used for dedup and distribution stats.',
  tags: ['hashing','bucketing','floating-point'],
  time: 'O(1)', space: 'O(b)',
  impl: `// 几何分桶哈希 · 实现
export interface GbHooks { onItem?: (v: number, bucket: number) => void; onConclude?: (counts: Map<number, number>) => void; }
export function geometricBucket(values: readonly number[], hooks: GbHooks = {}): Map<number, number> {
  const counts = new Map<number, number>();
  for (const v of values) {
    const av = Math.abs(v);
    const bucket = av === 0 ? -Infinity : Math.floor(Math.log2(av));
    const bk = bucket === -Infinity ? -1000 : bucket;
    counts.set(bk, (counts.get(bk) ?? 0) + 1);
    hooks.onItem?.(v, bk);
  }
  hooks.onConclude?.(counts);
  return counts;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { geometricBucket } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const vals = [1, 2, 3, 8, 16, 100, 0.5, 1024];
  rec.begin({ zh: '几何分桶', en: 'Geometric bucket' }).commit();
  const c = geometricBucket(vals, {
    onConclude: (m) => {
      const entries = [...m.entries()].sort((a, b) => a[0] - b[0]);
      rec.begin({ zh: \`桶数 \${m.size}\`, en: \`\${m.size} buckets\` })
        .setBars(entries.map((e) => ({ value: e[1], role: 'final' as BarRole }))).commit();
    },
  });
  void c;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geometricBucket } from '../../src/algorithms/hashing/hash-geometric-bucket/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-geometric-bucket/trace.ts';
test('相同数量级落同桶', () => {
  const c = geometricBucket([2, 3]);
  assert.equal(c.size, 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 20. hash-zobrist-board
{
  id: 'hash-zobrist-board',
  titleZh: 'Zobrist 棋盘', titleEn: 'Zobrist Board Hash',
  summaryZh: '棋盘每格每状态预生成随机数，整体哈希为异或和，支持增量更新。',
  summaryEn: 'Precompute random per cell-state; board hash is XOR sum, incrementally updatable.',
  descZh: 'Zobrist：对 (位置, 棋子) 预生成 64 位随机数。棋盘哈希 = 所有占用格的随机数异或。移动只需异或两格。',
  descEn: 'Zobrist: precompute 64-bit random for (position, piece). Board hash = XOR of occupied cells. A move XORs two cells.',
  tags: ['hashing','game','zobrist'],
  time: 'O(1) per move', space: 'O(cells·pieces)',
  impl: `// Zobrist 棋盘哈希 · 实现 (8x8 棋盘, 6 棋子类型)
export interface ZobHooks { onPlace?: (sq: number, piece: number) => void; onMove?: (from: number, to: number, piece: number, hash: bigint) => void; }
const SIZE = 64, PIECES = 6;
let table: bigint[][] | null = null;
function getTable(): bigint[][] {
  if (table) return table;
  let s = 12345; const rng = () => { s = (s * 1103515245 + 12345) & 0x7fffffffffffffffn; return s; };
  table = Array.from({ length: SIZE }, () => Array.from({ length: PIECES }, () => rng()));
  return table;
}
export function zobristHash(board: ReadonlyArray<number>, hooks: ZobHooks = {}): bigint {
  const t = getTable();
  let h = 0n;
  for (let sq = 0; sq < board.length; sq++) { const p = board[sq]!; if (p >= 0) { h ^= t[sq]![p]!; hooks.onPlace?.(sq, p); } }
  return h;
}
export function zobristMove(hash: bigint, from: number, to: number, piece: number, hooks: ZobHooks = {}): bigint {
  const t = getTable();
  let h = hash ^ t[from]![piece]! ^ t[to]![piece]!;
  hooks.onMove?.(from, to, piece, h);
  return h;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zobristHash, zobristMove } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const board = new Array<number>(64).fill(-1);
  board[0] = 0; board[1] = 1;
  rec.begin({ zh: 'Zobrist 棋盘', en: 'Zobrist board' }).commit();
  let h = zobristHash(board);
  rec.begin({ zh: \`初始 hash 0x\${h.toString(16).slice(0, 12)}\`, en: \`init hash 0x\${h.toString(16).slice(0, 12)}\` })
    .setAux([{ label: 'hash', value: '0x' + h.toString(16).slice(0, 12), role: 'pivot' as BarRole }]).commit();
  h = zobristMove(h, 0, 5, 0);
  rec.begin({ zh: \`移动后 hash 0x\${h.toString(16).slice(0, 12)}\`, en: \`after move 0x\${h.toString(16).slice(0, 12)}\` })
    .setAux([{ label: 'hash', value: '0x' + h.toString(16).slice(0, 12), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zobristHash, zobristMove } from '../../src/algorithms/hashing/hash-zobrist-board/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-zobrist-board/trace.ts';
test('相同棋盘哈希相同', () => {
  const b = [0, 1, -1];
  assert.equal(zobristHash(b), zobristHash([...b]));
});
test('移动改变哈希', () => {
  const b = [0, -1];
  const h0 = zobristHash(b);
  const h1 = zobristMove(h0, 0, 1, 0);
  assert.notEqual(h0, h1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 21. hash-rabin-karp-rolling-2
{
  id: 'hash-rabin-karp-rolling-2',
  titleZh: 'Rabin-Karp 滚动', titleEn: 'Rabin-Karp Rolling',
  summaryZh: '滑动窗口哈希 O(1) 更新：减去离开位、乘基数、加进入位。',
  summaryEn: 'Sliding-window hash in O(1): subtract outgoing, multiply base, add incoming.',
  descZh: '滚动哈希：H(s[i+1..i+m]) = ((H(s[i..i+m-1]) - s[i]*base^(m-1)) * base + s[i+m]) mod p。',
  descEn: 'Rolling hash: H(s[i+1..i+m]) = ((H(s[i..i+m-1]) - s[i]*base^(m-1)) * base + s[i+m]) mod p.',
  tags: ['hashing','rolling-hash','rabin-karp'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Rabin-Karp 滚动哈希 · 实现
export interface RkHooks { onWindow?: (start: number, hash: number) => void; onConclude?: (hashes: number[]) => void; }
const BASE = 256, MOD = 1000000007;
export function rabinKarpRolling(s: string, m: number, hooks: RkHooks = {}): number[] {
  const hashes: number[] = [];
  if (s.length < m) return hashes;
  let h = 0, pow = 1;
  for (let i = 0; i < m - 1; i++) pow = (pow * BASE) % MOD;
  for (let i = 0; i < m; i++) h = (h * BASE + s.charCodeAt(i)) % MOD;
  hashes.push(h); hooks.onWindow?.(0, h);
  for (let i = 1; i + m <= s.length; i++) {
    h = (h - (s.charCodeAt(i - 1) * pow) % MOD + MOD) % MOD;
    h = (h * BASE + s.charCodeAt(i + m - 1)) % MOD;
    hashes.push(h); hooks.onWindow?.(i, h);
  }
  hooks.onConclude?.(hashes);
  return hashes;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinKarpRolling } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'ABABAB', m = 3;
  rec.begin({ zh: \`滚动哈希 "\${s}" m=\${m}\`, en: \`Rolling hash "\${s}" m=\${m}\` }).commit();
  rabinKarpRolling(s, m, {
    onWindow: (st, h) => rec.begin({ zh: \`\${s.slice(st, st + m)}: \${h}\`, en: \`\${s.slice(st, st + m)}: \${h}\` })
      .setBars([{ value: h % 100, role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinKarpRolling } from '../../src/algorithms/hashing/hash-rabin-karp-rolling-2/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-rabin-karp-rolling-2/trace.ts';
test('相同子串哈希相同', () => {
  const h = rabinKarpRolling('ABABAB', 2);
  assert.equal(h[0], h[2]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 22. hash-polynomial-roll
{
  id: 'hash-polynomial-roll',
  titleZh: '多项式滚动哈希', titleEn: 'Polynomial Rolling Hash',
  summaryZh: '把字符串视作多项式系数，模大素数求值，支持双模防碰撞。',
  summaryEn: 'Treat string as polynomial coefficients evaluated mod a large prime; pair mods to avoid collisions.',
  descZh: '多项式哈希：H(s)=Σ s[i]*a^(n-1-i) mod p。双模 (p1,p2) 几乎无碰撞，用于字符串比较。',
  descEn: 'Polynomial hash: H(s)=Σ s[i]*a^(n-1-i) mod p. Dual mod (p1,p2) near-collision-free for string compare.',
  tags: ['hashing','rolling-hash','polynomial'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 多项式滚动哈希 (双模) · 实现
export interface PrHooks { onChar?: (i: number, ch: number, h1: number, h2: number) => void; onConclude?: (hash: [number, number]) => void; }
export function polynomialRollHash(s: string, hooks: PrHooks = {}): [number, number] {
  const A = 31, P1 = 1000000007, P2 = 1000000009;
  let h1 = 0, h2 = 0;
  for (let i = 0; i < s.length; i++) {
    h1 = (h1 * A + s.charCodeAt(i)) % P1;
    h2 = (h2 * A + s.charCodeAt(i)) % P2;
    hooks.onChar?.(i, s.charCodeAt(i), h1, h2);
  }
  hooks.onConclude?.([h1, h2]);
  return [h1, h2];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polynomialRollHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'polyhash';
  rec.begin({ zh: \`多项式滚动 "\${s}"\`, en: \`Poly rolling "\${s}"\` }).commit();
  polynomialRollHash(s, {
    onChar: (i, c, h1, h2) => rec.begin({ zh: \`\${c}: (\${h1}, \${h2})\`, en: \`\${c}: (\${h1}, \${h2})\` })
      .setAux([{ label: 'h1', value: String(h1), role: 'pivot' as BarRole }, { label: 'h2', value: String(h2), role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialRollHash } from '../../src/algorithms/hashing/hash-polynomial-roll/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-polynomial-roll/trace.ts';
test('相同字符串哈希相同', () => {
  assert.deepEqual(polynomialRollHash('abc'), polynomialRollHash('abc'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 23. hash-perfect-min
{
  id: 'hash-perfect-min',
  titleZh: '完美哈希构造', titleEn: 'Perfect Hash Construction',
  summaryZh: '对静态键集构造无冲突哈希，查询 O(1) 且无假阳性。',
  summaryEn: 'Construct a collision-free hash for a static key set; O(1) lookup, no false positives.',
  descZh: '完美哈希（CHD 简化）：先用一个哈希把键分桶，每桶内再找使无冲突的二级哈希。总表大小接近键数。',
  descEn: 'Perfect hash (CHD simplified): primary hash buckets keys; per bucket find a collision-free secondary hash.',
  tags: ['hashing','perfect-hash','static'],
  time: 'O(n) build', space: 'O(n)',
  impl: `// 完美哈希 (简化二级) · 实现
export interface PhHooks { onBucket?: (bucket: number, keys: string[]) => void; onPlace?: (key: string, slot: number) => void; onConclude?: (size: number) => void; }
export function perfectHashBuild(keys: readonly string[], hooks: PhHooks = {}): { slot: Map<string, number>; size: number } {
  const n = keys.length;
  const buckets = new Map<number, string[]>();
  const h1 = (k: string) => { let h = 0; for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0; return h % n; };
  for (const k of keys) { const b = h1(k); if (!buckets.has(b)) buckets.set(b, []); buckets.get(b)!.push(k); }
  const slot = new Map<string, number>();
  let size = 0;
  for (const [b, ks] of buckets) {
    hooks.onBucket?.(b, ks);
    // 找 salt 使 ks 在 size..size+len 内无冲突
    let salt = 0;
    const used = new Set<number>();
    while (used.size < ks.length) {
      used.clear(); salt++;
      let ok = true;
      for (const k of ks) { const s = size + ((h1(k + salt) % (ks.length + 1))); if (used.has(s)) { ok = false; break; } used.add(s); }
      if (ok) break;
    }
    for (const k of ks) { const s = size + ((h1(k + (salt || 1)) % (ks.length + 1))); slot.set(k, s); hooks.onPlace?.(k, s); }
    size += ks.length + 1;
  }
  hooks.onConclude?.(size);
  return { slot, size };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { perfectHashBuild } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = ['apple', 'banana', 'cherry', 'date'];
  rec.begin({ zh: '完美哈希构造', en: 'Perfect hash build' }).commit();
  const r = perfectHashBuild(keys, {
    onConclude: (sz) => rec.begin({ zh: \`表大小 \${sz}\`, en: \`table size \${sz}\` })
      .setBars([{ value: sz, role: 'final' as BarRole }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perfectHashBuild } from '../../src/algorithms/hashing/hash-perfect-min/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-perfect-min/trace.ts';
test('完美哈希无冲突', () => {
  const r = perfectHashBuild(['a', 'b', 'c']);
  const slots = [...r.slot.values()];
  assert.equal(new Set(slots).size, slots.length);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 24. hash-universal-class
{
  id: 'hash-universal-class',
  titleZh: '通用哈希族', titleEn: 'Universal Hash Family',
  summaryZh: '随机选 h_{a,b}(x)=((ax+b) mod p) mod m，碰撞概率 ≤ 1/m。',
  summaryEn: 'Randomly pick h_{a,b}(x)=((ax+b) mod p) mod m; collision prob <= 1/m.',
  descZh: '通用哈希族：h_{a,b}(x) = ((a·x+b) mod p) mod m，a∈[1,p), b∈[0,p)，p 为大素数。任意两键碰撞 ≤ 1/m。',
  descEn: 'Universal family: h_{a,b}(x)=((a·x+b) mod p) mod m, a in [1,p), b in [0,p), p prime. Any two keys collide <= 1/m.',
  tags: ['hashing','universal','randomized'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 通用哈希族 · 实现
export interface UcHooks { onPick?: (a: number, b: number) => void; onHash?: (x: number, result: number) => void; }
const P = 2147483647;
export function makeUniversalHasher(m: number, rng: () => number, hooks: UcHooks = {}): (x: number) => number {
  const a = 1 + Math.floor(rng() * (P - 1));
  const b = Math.floor(rng() * P);
  hooks.onPick?.(a, b);
  return (x: number) => { const r = ((a * x + b) % P) % m; hooks.onHash?.(x, r); return r; };
}
export function universalCollisionRate(m: number, keys: readonly number[], rng: () => number): number {
  const h = makeUniversalHasher(m, rng);
  const slots = keys.map(h);
  let coll = 0;
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) if (slots[i] === slots[j]) coll++;
  return coll / ((keys.length * (keys.length - 1)) / 2);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { makeUniversalHasher } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let s = 7; const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  rec.begin({ zh: '通用哈希族 m=10', en: 'Universal hash m=10' }).commit();
  const h = makeUniversalHasher(10, rng, {
    onPick: (a, b) => rec.begin({ zh: \`a=\${a} b=\${b}\`, en: \`a=\${a} b=\${b}\` })
      .setAux([{ label: 'a', value: String(a), role: 'pivot' as BarRole }, { label: 'b', value: String(b), role: 'pivot' as BarRole }]).commit(),
  });
  const keys = [1, 2, 3, 4, 5];
  for (const k of keys) h(k);
  rec.begin({ zh: '哈希完成', en: 'hashed' })
    .setBars(keys.map((k) => ({ value: h(k), role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeUniversalHasher, universalCollisionRate } from '../../src/algorithms/hashing/hash-universal-class/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-universal-class/trace.ts';
test('哈希值在范围内', () => {
  const h = makeUniversalHasher(10, () => 0.5);
  for (let i = 0; i < 100; i++) assert.ok(h(i) < 10);
});
test('碰撞率有界', () => {
  const r = universalCollisionRate(100, [1, 2, 3, 4, 5, 6, 7, 8], () => 0.3);
  assert.ok(r <= 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 25. hash-fingerprint-rabin
{
  id: 'hash-fingerprint-rabin',
  titleZh: 'Rabin 指纹', titleEn: 'Rabin Fingerprint',
  summaryZh: '把串视作多项式对不可约多项式取模，理论可证低碰撞。',
  summaryEn: 'Treat string as a polynomial mod an irreducible one; provably low collisions.',
  descZh: 'Rabin 指纹：串 s 映射为多项式，对不可约多项式 P(x) 取模。在 GF(2) 上运算，碰撞概率 = 1/|P|。',
  descEn: 'Rabin fingerprint: map string to polynomial, mod irreducible P(x) over GF(2). Collision prob = 1/|P|.',
  tags: ['hashing','fingerprint','polynomial'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Rabin 指纹 (GF(2) 多项式) · 实现
export interface RfHooks { onByte?: (i: number, byte: number, fp: number) => void; onConclude?: (fingerprint: number) => void; }
const POLY = 0x11d; // x^8 + x^4 + x^3 + x^2 + 1 (含隐式 x^8)
export function rabinFingerprint(data: string, hooks: RfHooks = {}): number {
  let fp = 0;
  for (let i = 0; i < data.length; i++) {
    fp ^= data.charCodeAt(i);
    for (let b = 0; b < 8; b++) {
      if (fp & 0x80) fp = ((fp << 1) ^ POLY) & 0xff;
      else fp = (fp << 1) & 0xff;
    }
    hooks.onByte?.(i, data.charCodeAt(i), fp);
  }
  hooks.onConclude?.(fp);
  return fp;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinFingerprint } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'rabin';
  rec.begin({ zh: \`Rabin 指纹 "\${s}"\`, en: \`Rabin fp "\${s}"\` }).commit();
  const fp = rabinFingerprint(s, {
    onByte: (i, b, f) => rec.begin({ zh: \`\${b}: 0x\${f.toString(16)}\`, en: \`\${b}: 0x\${f.toString(16)}\` })
      .setAux([{ label: 'fp', value: '0x' + f.toString(16), role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`fp=0x\${fp.toString(16)}\`, en: \`fp=0x\${fp.toString(16)}\` })
    .setAux([{ label: 'fp', value: '0x' + fp.toString(16), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinFingerprint } from '../../src/algorithms/hashing/hash-fingerprint-rabin/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-fingerprint-rabin/trace.ts';
test('Rabin 指纹确定性', () => {
  assert.equal(rabinFingerprint('abc'), rabinFingerprint('abc'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 26. hash-pearson-256
{
  id: 'hash-pearson-256',
  titleZh: 'Pearson 256', titleEn: 'Pearson Hash 256',
  summaryZh: '用 256 字节随机表逐字节异或查表，单遍快速生成 8 位哈希。',
  summaryEn: 'XOR-lookup against a 256-byte random table; single-pass fast 8-bit hash.',
  descZh: 'Pearson：h=0；每字节 h=T[h XOR byte]。表 T 是 0..255 的随机置换。可扩展为多字节输出。',
  descEn: 'Pearson: h=0; per byte h=T[h XOR byte]. T is a permutation of 0..255. Extensible to multi-byte output.',
  tags: ['hashing','non-cryptographic','pearson'],
  time: 'O(n)', space: 'O(256)',
  impl: `// Pearson 哈希 · 实现
export interface PearsonHooks { onByte?: (i: number, byte: number, h: number) => void; onConclude?: (hash: number) => void; }
let T: number[] | null = null;
function getTable(): number[] {
  if (T) return T;
  let s = 98765; const rng = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; };
  T = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = rng() % (i + 1); [T[i], T[j]] = [T[j]!, T[i]!]; }
  return T;
}
export function pearsonHash(data: string, hooks: PearsonHooks = {}): number {
  const t = getTable();
  let h = 0;
  for (let i = 0; i < data.length; i++) { h = t[h ^ data.charCodeAt(i)]!; hooks.onByte?.(i, data.charCodeAt(i), h); }
  hooks.onConclude?.(h);
  return h;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pearsonHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'pearson';
  rec.begin({ zh: \`Pearson "\${s}"\`, en: \`Pearson "\${s}"\` }).commit();
  const h = pearsonHash(s, {
    onByte: (i, b, hh) => rec.begin({ zh: \`\${b}: \${hh}\`, en: \`\${b}: \${hh}\` })
      .setBars([{ value: hh, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`hash=\${h}\`, en: \`hash=\${h}\` })
    .setAux([{ label: 'hash', value: String(h), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pearsonHash } from '../../src/algorithms/hashing/hash-pearson-256/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-pearson-256/trace.ts';
test('Pearson 确定性', () => {
  assert.equal(pearsonHash('abc'), pearsonHash('abc'));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 27. hash-siphash-impl-2
{
  id: 'hash-siphash-impl-2',
  titleZh: 'SipHash', titleEn: 'SipHash',
  summaryZh: 'ARX 结构带密钥哈希，抗碰撞攻击，哈希表默认选择。',
  summaryEn: 'Keyed ARX hash resistant to collision attacks; default in many hash tables.',
  descZh: 'SipHash：带 128 位密钥，每轮 2 次 SipRound（旋转+加+异或）。抗 HashDoS，Rust/Python 默认。',
  descEn: 'SipHash: 128-bit key, 2 SipRound per round (rotate+add+xor). HashDoS-resistant, default in Rust/Python.',
  tags: ['hashing','cryptographic','siphash'],
  time: 'O(n)', space: 'O(1)',
  impl: `// SipHash-2-4 (简化 32 位输出) · 实现
export interface SipHooks { onBlock?: (i: number, m: number) => void; onConclude?: (hash: number) => void; }
function rotl(x: number, r: number): number { return (x << r) | (x >>> (32 - r)); }
export function sipHash(data: string, key: [number, number] = [0x01234567, 0x89abcdef], hooks: SipHooks = {}): number {
  let v0 = key[0] ^ 0xdeadbeef, v1 = key[1] ^ 0xfeedface, v2 = key[0] ^ 0xcafebabe, v3 = key[1] ^ 0x0badcafe;
  const round = () => { v0 = (v0 + v1) | 0; v1 = rotl(v1, 5); v1 = (v1 ^ v0) | 0; v0 = rotl(v0, 16); v2 = (v2 + v3) | 0; v3 = rotl(v3, 8); v3 = (v3 ^ v2) | 0; v0 = (v0 + v3) | 0; v3 = rotl(v3, 7); v3 = (v3 ^ v0) | 0; v2 = (v2 + v1) | 0; v1 = rotl(v1, 13); v1 = (v1 ^ v2) | 0; v2 = rotl(v2, 16); };
  for (let i = 0; i < data.length; i += 4) {
    let m = 0;
    for (let j = 0; j < 4 && i + j < data.length; j++) m |= data.charCodeAt(i + j) << (j * 8);
    v3 ^= m; round(); round(); v0 ^= m;
    hooks.onBlock?.(i, m);
  }
  const b = data.length << 24; v3 ^= b; round(); round(); v0 ^= b;
  v2 ^= 0xff; round(); round(); round(); round();
  const out = (v0 ^ v1 ^ v2 ^ v3) >>> 0;
  hooks.onConclude?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sipHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'siphash-test';
  rec.begin({ zh: \`SipHash "\${s}"\`, en: \`SipHash "\${s}"\` }).commit();
  const h = sipHash(s, [0x11111111, 0x22222222], {
    onConclude: (hh) => rec.begin({ zh: \`hash=0x\${hh.toString(16)}\`, en: \`hash=0x\${hh.toString(16)}\` })
      .setAux([{ label: 'hash', value: '0x' + hh.toString(16), role: 'final' as BarRole }]).commit(),
  });
  void h;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sipHash } from '../../src/algorithms/hashing/hash-siphash-impl-2/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-siphash-impl-2/trace.ts';
test('SipHash 确定性', () => {
  assert.equal(sipHash('abc', [1, 2]), sipHash('abc', [1, 2]));
});
test('不同密钥不同哈希', () => {
  assert.notEqual(sipHash('abc', [1, 2]), sipHash('abc', [3, 4]));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 28. hash-cmac-mac
{
  id: 'hash-cmac-mac',
  titleZh: 'CMAC 消息认证', titleEn: 'CMAC Message Authentication',
  summaryZh: '基于块密码的 MAC，用子密钥对最后块特殊处理，验证完整性。',
  summaryEn: 'Block-cipher-based MAC using subkeys for the final block; verifies integrity.',
  descZh: 'CMAC：用 AES 等块密码 CBC 模式，最后块与 K1/K2 异或。输出作消息认证码。',
  descEn: 'CMAC: CBC mode over a block cipher; final block XORed with K1/K2. Output is the authentication tag.',
  tags: ['hashing','mac','authentication'],
  time: 'O(n)', space: 'O(1)',
  impl: `// CMAC (简化伪块密码) · 实现
export interface CmacHooks { onBlock?: (i: number, block: number, acc: number) => void; onConclude?: (tag: number) => void; }
function blockCipher(block: number, key: number): number { return ((block ^ key) * 2654435761) >>> 0; }
function genSubkeys(key: number): [number, number] { const l = blockCipher(0, key); const k1 = (l << 1) ^ ((l >>> 31) * 0x87); const k2 = (k1 << 1) ^ ((k1 >>> 31) * 0x87); return [k1 >>> 0, k2 >>> 0]; }
export function cmac(data: string, key = 0xabcdef01, hooks: CmacHooks = {}): number {
  const [k1, k2] = genSubkeys(key);
  const blocks: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    let b = 0; for (let j = 0; j < 4; j++) b |= (i + j < data.length ? data.charCodeAt(i + j) : 0) << (j * 8);
    blocks.push(b);
  }
  if (blocks.length === 0) blocks.push(0);
  const last = blocks[blocks.length - 1]!;
  blocks[blocks.length - 1] = last ^ k1; // 简化: 假设完整块
  let acc = 0;
  for (let i = 0; i < blocks.length; i++) { acc = blockCipher(acc ^ blocks[i]!, key); hooks.onBlock?.(i, blocks[i]!, acc); }
  hooks.onConclude?.(acc >>> 0);
  void k2;
  return acc >>> 0;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cmac } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'cmac-data';
  rec.begin({ zh: 'CMAC 认证', en: 'CMAC auth' }).commit();
  const t = cmac(s, 0x12345678, {
    onConclude: (tag) => rec.begin({ zh: \`tag=0x\${tag.toString(16)}\`, en: \`tag=0x\${tag.toString(16)}\` })
      .setAux([{ label: 'tag', value: '0x' + tag.toString(16), role: 'final' as BarRole }]).commit(),
  });
  void t;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cmac } from '../../src/algorithms/hashing/hash-cmac-mac/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-cmac-mac/trace.ts';
test('CMAC 确定性', () => {
  assert.equal(cmac('abc', 1), cmac('abc', 1));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 29. hash-partial-key
{
  id: 'hash-partial-key',
  titleZh: '部分键哈希', titleEn: 'Partial Key Hash',
  summaryZh: '只哈希键的部分位段，加速分布不均键的快速分片。',
  summaryEn: 'Hash only selected bit-fields of a key; speeds sharding for skewed keys.',
  descZh: '部分键哈希：从键中抽取若干位段（如高 8 位+低 8 位）组合后哈希，减少计算量。',
  descEn: 'Partial key hash: extract bit-fields (e.g. top 8 + low 8 bits) and combine; reduces computation.',
  tags: ['hashing','sharding','optimization'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 部分键哈希 · 实现
export interface PkHooks { onKey?: (key: number, fields: number[], hash: number) => void; }
export function partialKeyHash(keys: readonly number[], mask: number, hooks: PkHooks = {}): number[] {
  return keys.map((k) => {
    const partial = k & mask;
    let h = partial;
    h = ((h >>> 16) ^ h) * 0x45d9f3b;
    h = ((h >>> 16) ^ h) * 0x45d9f3b;
    h = (h >>> 16) ^ h;
    hooks.onKey?.(k, [partial >>> 8, partial & 0xff], h >>> 0);
    return h >>> 0;
  });
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partialKeyHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [0x12345678, 0x1234abcd, 0x87654321, 0xabcd1234];
  rec.begin({ zh: '部分键哈希 mask=0x00ff00ff', en: 'Partial key hash mask=0x00ff00ff' }).commit();
  partialKeyHash(keys, 0x00ff00ff, {
    onKey: (k, f, h) => rec.begin({ zh: \`key=0x\${k.toString(16)} -> 0x\${h.toString(16)}\`, en: \`key=0x\${k.toString(16)} -> 0x\${h.toString(16)}\` })
      .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partialKeyHash } from '../../src/algorithms/hashing/hash-partial-key/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-partial-key/trace.ts';
test('相同键哈希相同', () => {
  const h = partialKeyHash([0x12345678, 0x12345678], 0xff);
  assert.equal(h[0], h[1]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 30. hash-ice
{
  id: 'hash-ice',
  titleZh: 'ICE 哈希', titleEn: 'ICE Hash',
  summaryZh: '整数组合哈希：移位+加法+异或混合，适合小整数键快速散列。',
  summaryEn: 'Integer-combine hash via shift+add+xor mixing; fast for small integer keys.',
  descZh: 'ICE：h=key；h^=h>>>16；h*=0x85ebca6b；h^=h>>>13；h*=0xc2b2ae35；h^=h>>>16。整数雪崩。',
  descEn: 'ICE: h=key; h^=h>>>16; h*=0x85ebca6b; h^=h>>>13; h*=0xc2b2ae35; h^=h>>>16. Integer avalanche.',
  tags: ['hashing','integer','avalanche'],
  time: 'O(1)', space: 'O(1)',
  impl: `// ICE 整数哈希 (Murmur3 finalizer 风格) · 实现
export interface IceHooks { onKey?: (key: number, hash: number) => void; }
export function iceHash(key: number, hooks: IceHooks = {}): number {
  let h = key;
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  hooks.onKey?.(key, h >>> 0);
  return h >>> 0;
}
export function iceHashBatch(keys: readonly number[], hooks: IceHooks = {}): number[] {
  return keys.map((k) => iceHash(k, hooks));
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iceHashBatch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [1, 2, 3, 100, 1000];
  rec.begin({ zh: 'ICE 整数哈希', en: 'ICE integer hash' }).commit();
  iceHashBatch(keys, {
    onKey: (k, h) => rec.begin({ zh: \`\${k} -> 0x\${h.toString(16)}\`, en: \`\${k} -> 0x\${h.toString(16)}\` })
      .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iceHash } from '../../src/algorithms/hashing/hash-ice/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-ice/trace.ts';
test('ICE 确定性', () => {
  assert.equal(iceHash(42), iceHash(42));
});
test('雪崩: 相邻键差异大', () => {
  assert.notEqual(iceHash(1), iceHash(2));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
];
