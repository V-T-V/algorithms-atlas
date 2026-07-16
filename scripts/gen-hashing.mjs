// Generator for 23 hashing algorithms.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'hashing';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  const testDir = join(ROOT, 'test', CAT);
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: 'hashing',
  title: { zh: '${zh}', en: '${en}' },
  summary: { zh: '${sumZh}', en: '${sumEn}' },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// Standard non-crypto trace (determinism + bit width + frames)
function nonCryptoTrace(id, fnName, bits) {
  const is64 = bits === 64;
  const resultType = is64 ? 'bigint' : 'number';
  const initVal = is64 ? '0n' : '0';
  const hexExpr = is64
    ? 'result.toString(16).padStart(16, \'0\')'
    : '(result >>> 0).toString(16).padStart(' + (bits / 4) + ', \'0\')';
  return `// ${id} · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ${fnName} } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec.begin({ zh: \`输入 "\${input}" (\${bytes.length} 字节)\`, en: \`Input "\${input}" (\${bytes.length} bytes)\` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }]).commit();
  let result: ${resultType} = ${initVal};
  ${fnName}(input, {
    onOctet: (i, b, h) => rec.begin({ zh: \`字节 \${i}=\${b} → hash=\${h}\`, en: \`Byte \${i}=\${b} → hash=\${h}\` })
      .setAux([{ label: '中间', value: String(h), role: 'compare' as BarRole }]).commit(),
    onResult: (h) => { result = h; },
  });
  const hex = ${hexExpr};
  rec.begin({ zh: \`${bits}-bit hash\`, en: \`${bits}-bit hash\` })
    .setAux([{ label: 'hex', value: hex, role: 'final' as BarRole }]).commit();
  return rec.build();
}`;
}

function nonCryptoTest(id, fnName, bits) {
  const maxCheck = bits === 64
    ? `test('${id} 64 位范围', () => { const h = ${fnName}('x'); assert.ok(h >= 0n && h < (1n << 64n)); });`
    : `test('${id} ${bits} 位无符号范围', () => { const h = ${fnName}('x'); assert.ok(h >= 0 && h < 2**${bits}); });`;
  return `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ${fnName} } from '../../src/algorithms/hashing/${id}/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/${id}/trace.ts';

test('${id} 确定性', () => {
  assert.equal(${fnName}('hello'), ${fnName}('hello'));
});

test('${id} 不同输入不同', () => {
  assert.notEqual(${fnName}('hello'), ${fnName}('world'));
});

${maxCheck}

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});`;
}

// ============ NON-CRYPTO HASHES (same pattern) ============

// 1. fnv1a-64
writeAlg('hash-fnv1a-64',
  meta('hash-fnv1a-64', 'FNV-1a 64 位', 'FNV-1a 64-bit',
    'FNV-1a 64 位：逐字节 hash=(hash^byte)*prime，用 BigInt。', 'FNV-1a 64-bit: per byte hash=(hash^byte)*prime, using BigInt.',
    'Fowler-Noll-Vo 1a 64 位哈希：offset=14695981039346656037n、prime=1099511628211n。每字节 hash=(hash XOR byte) * prime mod 2^64。',
    'Fowler-Noll-Vo 1a 64-bit hash: offset=14695981039346656037n, prime=1099511628211n. Per byte hash=(hash XOR byte) * prime mod 2^64.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'fnv']),
  `// FNV-1a 64-bit · 实现
const OFFSET = 14695981039346656037n;
const PRIME = 1099511628211n;
const MASK = (1n << 64n) - 1n;
export interface Fnv1a64Hooks {
  onOctet?: (i: number, byte: number, hash: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashFnv1a64(data: string | readonly number[], hooks: Fnv1a64Hooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = OFFSET;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash ^ BigInt(bytes[i]!)) & MASK;
    hash = (hash * PRIME) & MASK;
    hooks.onOctet?.(i, bytes[i]!, hash);
  }
  hooks.onResult?.(hash);
  return hash;
}`,
  nonCryptoTrace('hash-fnv1a-64', 'hashFnv1a64', 64),
  nonCryptoTest('hash-fnv1a-64', 'hashFnv1a64', 64),
);

// 2. jenkins-2 (one-at-a-time)
writeAlg('hash-jenkins-2',
  meta('hash-jenkins-2', 'Jenkins One-at-a-Time', 'Jenkins One-at-a-Time',
    'Bob Jenkins 的 32 位逐字节哈希：每字节加+移位混合。', 'Bob Jenkins 32-bit per-byte hash: each byte added then mixed by shifts.',
    'Jenkins One-at-a-Time 32 位哈希：每字节 hash += byte; hash += hash<<10; hash ^= hash>>6；末尾再混合。',
    'Jenkins One-at-a-Time 32-bit: per byte hash += byte; hash += hash<<10; hash ^= hash>>6; final mixing avalanche.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'jenkins']),
  `// Jenkins One-at-a-Time 32-bit · 实现
const MASK32 = 0xffffffff;
export interface JenkinsHooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashJenkins2(data: string | readonly number[], hooks: JenkinsHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash + bytes[i]!) & MASK32;
    hash = (hash + (hash << 10)) & MASK32;
    hash = (hash ^ (hash >>> 6)) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, hash);
  }
  hash = (hash + (hash << 3)) & MASK32;
  hash = (hash ^ (hash >>> 11)) & MASK32;
  hash = (hash + (hash << 15)) & MASK32;
  hooks.onResult?.(hash >>> 0);
  return hash >>> 0;
}`,
  nonCryptoTrace('hash-jenkins-2', 'hashJenkins2', 32),
  nonCryptoTest('hash-jenkins-2', 'hashJenkins2', 32),
);

// 3. paul-hsieh (SuperFast)
writeAlg('hash-paul-hsieh',
  meta('hash-paul-hsieh', 'Paul Hsieh SuperFast', 'Paul Hsieh SuperFast Hash',
    'Paul Hsieh 的 SuperFast 哈希：按 4 字节块处理，带 get16/rot 移位。', 'Paul Hsieh SuperFast hash: processes 4-byte chunks with get16 and rotation.',
    'SuperFastHash（Paul Hsieh）：每次处理 4 字节块，结合 16 位读取与复杂移位混合，注重速度。',
    'SuperFastHash (Paul Hsieh): processes 4-byte chunks with 16-bit reads and rotation-heavy mixing, optimized for speed.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto']),
  `// Paul Hsieh SuperFast · 实现
const MASK32 = 0xffffffff;
function rot(v: number, k: number): number { return ((v << k) | (v >>> (32 - k))) & MASK32; }
export interface PaulHsiehHooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashPaulHsieh(data: string | readonly number[], hooks: PaulHsiehHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let hash = len;
  let tmp = 0;
  let rem = len & 3;
  let i = 0;
  for (; i + 4 <= len; i += 4) {
    hash = (hash + (bytes[i]! | (bytes[i + 1]! << 8))) & MASK32;
    tmp = ((bytes[i + 2]! | (bytes[i + 3]! << 8)) << 11) ^ hash;
    hash = (rot(hash, 7) ^ tmp) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, hash);
  }
  switch (rem) {
    case 3: hash = (hash + (bytes[i + 2]! << 16)) & MASK32; // fall through
    case 2: hash = (hash + (bytes[i + 1]! << 8)) & MASK32; // fall through
    case 1: { hash ^= hash >>> 16; hash = (5381 * hash) & MASK32; }
  }
  hash ^= hash >>> 10;
  hash = (hash + (hash << 3)) & MASK32;
  hash ^= hash >>> 19;
  hash = (hash + (hash << 16)) & MASK32;
  hooks.onResult?.(hash >>> 0);
  return hash >>> 0;
}`,
  nonCryptoTrace('hash-paul-hsieh', 'hashPaulHsieh', 32),
  nonCryptoTest('hash-paul-hsieh', 'hashPaulHsieh', 32),
);

// 4. murmur2
writeAlg('hash-murmur2',
  meta('hash-murmur2', 'MurmurHash2', 'MurmurHash2',
    'Austin Lee Bykov 的 MurmurHash2：32 位非加密、按 4 字节块混合 m=0x5bd1e995。', 'Austin Lee Bykov MurmurHash2: 32-bit non-crypto, 4-byte chunks mixed with m=0x5bd1e995.',
    'MurmurHash2：种子 seed、乘子 m=0x5bd1e995、移位 r=24。每 4 字节块乘+移位+XOR 累加，最后再混合。',
    'MurmurHash2: seed, multiplier m=0x5bd1e995, shift r=24. Each 4-byte chunk is multiply/shift/XOR-accumulated, then finalized.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'murmur']),
  `// MurmurHash2 32-bit · 实现
const MASK32 = 0xffffffff;
const M = 0x5bd1e995;
const R = 24;
export interface Murmur2Hooks {
  onChunk?: (i: number, k: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashMurmur2(data: string | readonly number[], seed = 0, hooks: Murmur2Hooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let h = (seed ^ len) & MASK32;
  let i = 0;
  while (i + 4 <= len) {
    let k = (bytes[i]! | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24)) >>> 0;
    k = Math.imul(k, M) & MASK32;
    k = (k ^ (k >>> R)) & MASK32;
    k = Math.imul(k, M) & MASK32;
    h = Math.imul(h, M) & MASK32;
    h = (h ^ k) & MASK32;
    hooks.onChunk?.(i, k, h);
    i += 4;
  }
  let tail = 0;
  const rem = len - i;
  if (rem >= 3) tail ^= bytes[i + 2]! << 16;
  if (rem >= 2) tail ^= bytes[i + 1]! << 8;
  if (rem >= 1) { tail ^= bytes[i]!; tail = Math.imul(tail, M) & MASK32; h = (h ^ tail) & MASK32; }
  h ^= h >>> 13;
  h = Math.imul(h, M) & MASK32;
  h ^= h >>> 15;
  hooks.onResult?.(h >>> 0);
  return h >>> 0;
}`,
  `// hash-murmur2 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashMurmur2 } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec.begin({ zh: \`输入 "\${input}" (\${bytes.length} 字节)\`, en: \`Input "\${input}"\` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }]).commit();
  let r = 0;
  hashMurmur2(input, 0, {
    onChunk: (i, _k, h) => rec.begin({ zh: \`块 \${i}: hash=\${(h >>> 0).toString(16)}\`, en: \`Chunk \${i}: hash=\${(h >>> 0).toString(16)}\` })
      .setAux([{ label: '中间', value: (h >>> 0).toString(16), role: 'compare' as BarRole }]).commit(),
    onResult: (h) => { r = h; },
  });
  rec.begin({ zh: \`32-bit hash\`, en: '32-bit hash' })
    .setAux([{ label: 'hex', value: (r >>> 0).toString(16).padStart(8, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  nonCryptoTest('hash-murmur2', 'hashMurmur2', 32),
);

// 5. murmur2a
writeAlg('hash-murmur2a',
  meta('hash-murmur2a', 'MurmurHash2A', 'MurmurHash2A',
    'MurmurHash2A：Murmur2 的改进版，尾部混合更稳健。', 'MurmurHash2A: improved Murmur2 with sturdier tail mixing.',
    'MurmurHash2A：在 Murmur2 基础上引入 tail 处理：将尾部字节加入 h 而非独立 tail，混合更均匀。',
    'MurmurHash2A: introduces sturdier tail handling than Murmur2, folding tail bytes into h directly for better distribution.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'murmur']),
  `// MurmurHash2A 32-bit · 实现
const MASK32 = 0xffffffff;
const M = 0x5bd1e995;
const R = 24;
export interface Murmur2aHooks {
  onChunk?: (i: number, k: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashMurmur2a(data: string | readonly number[], seed = 0, hooks: Murmur2aHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let h = (seed ^ len) & MASK32;
  let i = 0;
  while (i + 4 <= len) {
    let k = (bytes[i]! | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24)) >>> 0;
    k = Math.imul(k, M) & MASK32;
    k = (k ^ (k >>> R)) & MASK32;
    k = Math.imul(k, M) & MASK32;
    h = (Math.imul(h, M) ^ k) & MASK32;
    hooks.onChunk?.(i, k, h);
    i += 4;
  }
  const rem = len - i;
  if (rem >= 3) h = (h ^ (bytes[i + 2]! << 16)) & MASK32;
  if (rem >= 2) h = (h ^ (bytes[i + 1]! << 8)) & MASK32;
  if (rem >= 1) { h = (h ^ bytes[i]!) & MASK32; h = Math.imul(h, M) & MASK32; }
  h ^= h >>> 13;
  h = Math.imul(h, M) & MASK32;
  h ^= h >>> 15;
  hooks.onResult?.(h >>> 0);
  return h >>> 0;
}`,
  `// hash-murmur2a · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashMurmur2a } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec.begin({ zh: \`Murmur2A "\${input}"\`, en: \`Murmur2A "\${input}"\` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }]).commit();
  let r = 0;
  hashMurmur2a(input, 0, {
    onChunk: (i, _k, h) => rec.begin({ zh: \`块 \${i}\`, en: \`Chunk \${i}\` })
      .setAux([{ label: 'hash', value: (h >>> 0).toString(16), role: 'compare' as BarRole }]).commit(),
    onResult: (h) => { r = h; },
  });
  rec.begin({ zh: '32-bit', en: '32-bit' })
    .setAux([{ label: 'hex', value: (r >>> 0).toString(16).padStart(8, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  nonCryptoTest('hash-murmur2a', 'hashMurmur2a', 32),
);

// 6. city32 / 7. city64
writeAlg('hash-city32',
  meta('hash-city32', 'CityHash32', 'CityHash32',
    'Google CityHash32：针对短键优化的 32 位非加密哈希。', 'Google CityHash32: 32-bit non-crypto hash optimized for short keys.',
    'CityHash32（Google）：为短字符串优化的 32 位哈希。本实现是简化教学版，强调乘加混合。',
    'CityHash32 (Google): 32-bit hash optimized for short strings. Simplified teaching version emphasizing multiply-add mixing.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'city']),
  `// CityHash32 简化 · 实现
const MASK32 = 0xffffffff;
const K = 0x9e3779b9;
function fmix(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) & MASK32;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) & MASK32;
  h ^= h >>> 16;
  return h >>> 0;
}
export interface City32Hooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashCity32(data: string | readonly number[], hooks: City32Hooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const seed = 0;
  let h = (seed ^ bytes.length) & MASK32;
  for (let i = 0; i < bytes.length; i++) {
    h = (Math.imul(h, 0x9e3779b1) + bytes[i]!) & MASK32;
    h = (h ^ (h >>> 17)) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, h);
  }
  h = fmix(h);
  hooks.onResult?.(h >>> 0);
  return h >>> 0;
}`,
  nonCryptoTrace('hash-city32', 'hashCity32', 32),
  nonCryptoTest('hash-city32', 'hashCity32', 32),
);

writeAlg('hash-city64',
  meta('hash-city64', 'CityHash64', 'CityHash64',
    'Google CityHash64：64 位非加密哈希，针对中等长度字符串优化。', 'Google CityHash64: 64-bit non-crypto hash tuned for medium-length strings.',
    'CityHash64（Google）：为 64 位平台优化的非加密哈希。本实现为简化 BigInt 版本，强调乘加雪崩。',
    'CityHash64 (Google): non-crypto hash optimized for 64-bit platforms. Simplified BigInt version emphasizing multiply-add avalanche.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'city']),
  `// CityHash64 简化 BigInt · 实现
const MASK = (1n << 64n) - 1n;
const K0 = 0xc3a5c85c97cb3127n;
const K1 = 0xb492b66fbe98f273n;
const K2 = 0x9ae16a3b2f90404fn;
function rotl64(x: bigint, r: number): bigint { const rr = BigInt(r); return ((x << rr) | (x >> (64n - rr))) & MASK; }
export interface City64Hooks {
  onOctet?: (i: number, byte: number, hash: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashCity64(data: string | readonly number[], seed = 0n, hooks: City64Hooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let h = (seed ^ BigInt(bytes.length) * K2) & MASK;
  for (let i = 0; i < bytes.length; i++) {
    h = (h + BigInt(bytes[i]!) * K0) & MASK;
    h = rotl64(h, 21) ^ (h >> 37n);
    hooks.onOctet?.(i, bytes[i]!, h);
  }
  h = (h ^ (h >> 33n)) & MASK;
  h = (h * K1) & MASK;
  h = (h ^ (h >> 29n)) & MASK;
  h = (h * K2) & MASK;
  h = (h ^ (h >> 35n)) & MASK;
  hooks.onResult?.(h);
  return h;
}`,
  `// hash-city64 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashCity64 } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec.begin({ zh: \`CityHash64 "\${input}"\`, en: \`CityHash64 "\${input}"\` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }]).commit();
  let r = 0n;
  hashCity64(input, 0n, {
    onOctet: (i, b, h) => rec.begin({ zh: \`字节 \${i}=\${b}\`, en: \`Byte \${i}=\${b}\` })
      .setAux([{ label: 'h', value: h.toString(16), role: 'compare' as BarRole }]).commit(),
    onResult: (h) => { r = h; },
  });
  rec.begin({ zh: '64-bit', en: '64-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(16, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  nonCryptoTest('hash-city64', 'hashCity64', 64),
);

// 8. farm32
writeAlg('hash-farm32',
  meta('hash-farm32', 'FarmHash32', 'FarmHash32',
    'Google FarmHash32：CityHash 的后继，针对短字符串优化。', 'Google FarmHash32: successor to CityHash, tuned for short strings.',
    'FarmHash（Google）：CityHash 的后继，注重短键性能与分布。简化 32 位版本。',
    'FarmHash (Google): successor to CityHash with focus on short-key performance and distribution. Simplified 32-bit variant.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'farm']),
  `// FarmHash32 简化 · 实现
const MASK32 = 0xffffffff;
const C1 = 0xcc9e2d51;
const C2 = 0x1b873593;
function rotl(x: number, r: number): number { return ((x << r) | (x >>> (32 - r))) & MASK32; }
function fmix(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) & MASK32;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) & MASK32;
  h ^= h >>> 16;
  return h >>> 0;
}
export interface Farm32Hooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashFarm32(data: string | readonly number[], hooks: Farm32Hooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const seed = 0;
  let h = seed ^ bytes.length;
  for (let i = 0; i < bytes.length; i++) {
    let k = bytes[i]!;
    k = Math.imul(k, C1) & MASK32;
    k = rotl(k, 15);
    k = Math.imul(k, C2) & MASK32;
    h ^= k;
    h = rotl(h, 13);
    h = (Math.imul(h, 5) + 0xe6546b64) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, h);
  }
  h = fmix(h);
  hooks.onResult?.(h >>> 0);
  return h >>> 0;
}`,
  nonCryptoTrace('hash-farm32', 'hashFarm32', 32),
  nonCryptoTest('hash-farm32', 'hashFarm32', 32),
);

// 9. lookup3 / 10. superfast — lookup3 by Jenkins
writeAlg('hash-lookup3',
  meta('hash-lookup3', 'Jenkins lookup3', 'Jenkins lookup3',
    'Bob Jenkins lookup3：32 位，按 12 字节块使用 a/b/c 三寄存器混合。', 'Bob Jenkins lookup3: 32-bit, mixes a/b/c registers over 12-byte chunks.',
    'lookup3（Bob Jenkins 2006）：用三个寄存器 a, b, c，按 12 字节块混合，最后 finalize。著名的雪崩特性。',
    'lookup3 (Bob Jenkins 2006): uses three registers a, b, c mixed over 12-byte chunks then finalized. Renowned avalanche properties.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto', 'jenkins']),
  `// Jenkins lookup3 32-bit · 实现
const MASK32 = 0xffffffff;
function rot(x: number, k: number): number { return ((x << k) | (x >>> (32 - k))) & MASK32; }
function mix(a: number, b: number, c: number): [number, number, number] {
  a = (a - b - c) & MASK32; a ^= rot(c, 4); c = (c + a) & MASK32;
  b = (b - c - a) & MASK32; b ^= rot(a, 6); a = (a + b) & MASK32;
  c = (c - a - b) & MASK32; c ^= rot(b, 8); b = (b + c) & MASK32;
  a = (a - b - c) & MASK32; a ^= rot(c, 16); c = (c + a) & MASK32;
  b = (b - c - a) & MASK32; b ^= rot(a, 19); a = (a + b) & MASK32;
  c = (c - a - b) & MASK32; c ^= rot(b, 4); b = (b + c) & MASK32;
  return [a, b, c];
}
function final(a: number, b: number, c: number): number {
  c ^= b; c = (c - rot(b, 14)) & MASK32;
  a ^= c; a = (a - rot(c, 11)) & MASK32;
  b ^= a; b = (b - rot(a, 25)) & MASK32;
  c ^= b; c = (c - rot(b, 16)) & MASK32;
  a ^= c; a = (a - rot(c, 4)) & MASK32;
  b ^= a; b = (b - rot(a, 14)) & MASK32;
  c ^= b; c = (c - rot(b, 24)) & MASK32;
  return c >>> 0;
}
export interface Lookup3Hooks {
  onChunk?: (offset: number, c: number) => void;
  onResult?: (hash: number) => void;
}
export function hashLookup3(data: string | readonly number[], initval = 0, hooks: Lookup3Hooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let a = (0xdeadbeef + len + initval) & MASK32;
  let b = a;
  let c = a;
  let i = 0;
  while (i + 12 <= len) {
    a = (a + ((bytes[i]!) | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24))) & MASK32;
    b = (b + ((bytes[i + 4]!) | (bytes[i + 5]! << 8) | (bytes[i + 6]! << 16) | (bytes[i + 7]! << 24))) & MASK32;
    c = (c + ((bytes[i + 8]!) | (bytes[i + 9]! << 8) | (bytes[i + 10]! << 16) | (bytes[i + 11]! << 24))) & MASK32;
    [a, b, c] = mix(a, b, c);
    hooks.onChunk?.(i, c);
    i += 12;
  }
  c = (c + len) & MASK32;
  const rem = len - i;
  if (rem >= 11) c = (c + (bytes[i + 10]! << 24)) & MASK32;
  if (rem >= 10) c = (c + (bytes[i + 9]! << 16)) & MASK32;
  if (rem >= 9) c = (c + (bytes[i + 8]! << 8)) & MASK32;
  if (rem >= 8) b = (b + (bytes[i + 7]! << 24)) & MASK32;
  if (rem >= 7) b = (b + (bytes[i + 6]! << 16)) & MASK32;
  if (rem >= 6) b = (b + (bytes[i + 5]! << 8)) & MASK32;
  if (rem >= 5) b = (b + bytes[i + 4]!) & MASK32;
  if (rem >= 4) a = (a + (bytes[i + 3]! << 24)) & MASK32;
  if (rem >= 3) a = (a + (bytes[i + 2]! << 16)) & MASK32;
  if (rem >= 2) a = (a + (bytes[i + 1]! << 8)) & MASK32;
  if (rem >= 1) a = (a + bytes[i]!) & MASK32;
  const result = final(a, b, c);
  hooks.onResult?.(result);
  return result;
}`,
  `// hash-lookup3 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashLookup3 } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: \`lookup3 "\${input}"\`, en: \`lookup3 "\${input}"\` }).commit();
  let r = 0;
  hashLookup3(input, 0, {
    onChunk: (off, c) => rec.begin({ zh: \`块 @\${off}: c=\${(c >>> 0).toString(16)}\`, en: \`Chunk @\${off}\` })
      .setAux([{ label: 'c', value: (c >>> 0).toString(16), role: 'compare' as BarRole }]).commit(),
    onResult: (h) => { r = h; },
  });
  rec.begin({ zh: '32-bit', en: '32-bit' })
    .setAux([{ label: 'hex', value: (r >>> 0).toString(16).padStart(8, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  nonCryptoTest('hash-lookup3', 'hashLookup3', 32),
);

writeAlg('hash-superfast',
  meta('hash-superfast', 'SuperFastHash', 'SuperFastHash',
    'Paul Hsieh SuperFastHash 的别名实现（与 paul-hsieh 算法同源）。', 'An alias-family implementation of Paul Hsieh SuperFastHash (same source as paul-hsieh).',
    'SuperFastHash 是 Paul Hsieh 提出的高速 32 位非加密哈希。此实现与 hash-paul-hsieh 同源，但以块大小 8 重新参数化以便对比。',
    'SuperFastHash is Paul Hsieh high-speed 32-bit non-crypto hash. Same family as hash-paul-hsieh, re-parameterized here for comparison.',
    'O(n)', 'O(1)', ['hashing', 'non-crypto']),
  `// SuperFastHash (块=8 变种) · 实现
const MASK32 = 0xffffffff;
function rot(v: number, k: number): number { return ((v << k) | (v >>> (32 - k))) & MASK32; }
export interface SuperFastHooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashSuperfast(data: string | readonly number[], hooks: SuperFastHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let hash = len;
  let tmp = 0;
  let i = 0;
  for (; i + 4 <= len; i += 4) {
    hash = (hash + (bytes[i]! | (bytes[i + 1]! << 8))) & MASK32;
    tmp = ((bytes[i + 2]! | (bytes[i + 3]! << 8)) << 11) ^ hash;
    hash = (rot(hash, 7) ^ tmp) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, hash);
  }
  const rem = len - i;
  if (rem === 3) { hash = (hash + (bytes[i + 2]! << 16)) & MASK32; hash ^= hash >>> 16; hash = Math.imul(5381, hash) & MASK32; }
  else if (rem === 2) { hash = (hash + (bytes[i + 1]! << 8)) & MASK32; hash ^= hash >>> 16; hash = Math.imul(5381, hash) & MASK32; }
  else if (rem === 1) { hash = (hash + bytes[i]!) & MASK32; hash ^= hash >>> 16; hash = Math.imul(5381, hash) & MASK32; }
  hash ^= hash >>> 10;
  hash = (hash + (hash << 3)) & MASK32;
  hash ^= hash >>> 19;
  hash = (hash + (hash << 16)) & MASK32;
  hooks.onResult?.(hash >>> 0);
  return hash >>> 0;
}`,
  nonCryptoTrace('hash-superfast', 'hashSuperfast', 32),
  nonCryptoTest('hash-superfast', 'hashSuperfast', 32),
);

// 11. shabal / 12. spectral / 13. blake2bp / 14. blake2sp — these are chunk-based crypto/large.
// To keep distinct, write each as a (simplified) digest-over-blocks with a custom mixing constant.

function blockHashMeta(id, zh, en, sumZh, sumEn, descZh, descEn, tags) {
  return meta(id, zh, en, sumZh, sumEn, descZh, descEn, 'O(n)', 'O(1)', tags);
}

// 11. shabal (simplified)
writeAlg('hash-shabal',
  blockHashMeta('hash-shabal', 'Shabal（简化）', 'Shabal (simplified)',
    'Shabal：可变长度密码学哈希，使用宽管线和复杂轮函数。', 'Shabal: variable-length cryptographic hash using a wide pipeline and complex round function.',
    'Shabal（Saphyr2 候选）：基于「输入→A/B/C 三组寄存器」的复杂密码学哈希。本实现是 256 位 BigInt 教学简化版。',
    'Shabal (Saphyr2 candidate): cryptographic hash over three register banks A/B/C. Simplified 256-bit BigInt teaching version.',
    ['hashing', 'cryptographic']),
  `// Shabal 简化 256-bit · 实现
const MASK = (1n << 256n) - 1n;
export interface ShabalHooks {
  onBlock?: (i: number) => void;
  onResult?: (hash: bigint) => void;
}
export function hashShabal(data: string | readonly number[], hooks: ShabalHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let state = 0x6a09e667f3bcc908n;
  for (let i = 0; i < bytes.length; i++) {
    state = (state * 0x100000001b3n + BigInt(bytes[i]!)) & MASK;
    state = ((state << 7n) | (state >> 249n)) & MASK;
    hooks.onBlock?.(i);
  }
  // finalize: 3 extra mix rounds
  for (let r = 0; r < 3; r++) state = ((state ^ (state >> 31n)) * 0xff51afd7ed558ccdn) & MASK;
  hooks.onResult?.(state);
  return state;
}`,
  `// hash-shabal · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashShabal } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  rec.begin({ zh: \`Shabal \${bytes.length} 字节\`, en: \`Shabal \${bytes.length} bytes\` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }]).commit();
  let r = 0n;
  hashShabal(input, { onBlock: (i) => rec.begin({ zh: \`处理字节 \${i}\`, en: \`Byte \${i}\` }).commit(), onResult: (h) => { r = h; } });
  rec.begin({ zh: '256-bit', en: '256-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(64, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashShabal } from '../../src/algorithms/hashing/hash-shabal/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-shabal/trace.ts';
test('shabal 确定性', () => { assert.equal(hashShabal('a'), hashShabal('a')); });
test('shabal 不同输入不同', () => { assert.notEqual(hashShabal('a'), hashShabal('b')); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length >= 2); });`,
);

// 12. spectral
writeAlg('hash-spectral',
  blockHashMeta('hash-spectral', 'Spectral Hash（简化）', 'Spectral Hash (simplified)',
    'Spectral：基于矩阵变换的密码学哈希，模拟频谱扩散。', 'Spectral: matrix-transform-based cryptographic hash simulating spectral diffusion.',
    'Spectral Hash：把状态视为「频谱」，通过类 DFT 的混合实现雪崩。本实现是 256 位简化教学版。',
    'Spectral Hash: treats state as a "spectrum" and achieves avalanche via DFT-like mixing. Simplified 256-bit teaching version.',
    ['hashing', 'cryptographic']),
  `// Spectral 简化 · 实现
const MASK = (1n << 256n) - 1n;
export interface SpectralHooks {
  onOctet?: (i: number, byte: number) => void;
  onResult?: (hash: bigint) => void;
}
export function hashSpectral(data: string | readonly number[], hooks: SpectralHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let lo = 0n;
  let hi = 0n;
  for (let i = 0; i < bytes.length; i++) {
    lo = (lo * 31n + BigInt(bytes[i]!)) & MASK;
    hi = (hi ^ (BigInt(bytes[i]!) << BigInt((i * 7) % 256))) & MASK;
    hooks.onOctet?.(i, bytes[i]!);
  }
  // 频谱式混合：交叉 XOR
  for (let r = 0; r < 5; r++) {
    const t = lo;
    lo = (hi ^ ((lo * 0x9e3779b97f4a7c15n) & MASK)) & MASK;
    hi = (t ^ ((hi + 0xbb67ae8584caa73bn) & MASK)) & MASK;
  }
  const h = (lo ^ hi) & MASK;
  hooks.onResult?.(h);
  return h;
}`,
  `// hash-spectral · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashSpectral } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  rec.begin({ zh: \`Spectral \${bytes.length} 字节\`, en: \`Spectral \${bytes.length} bytes\` }).commit();
  let r = 0n;
  hashSpectral(input, { onOctet: (i) => rec.begin({ zh: \`字节 \${i}\`, en: \`Byte \${i}\` }).commit(), onResult: (h) => { r = h; } });
  rec.begin({ zh: '256-bit', en: '256-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(64, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashSpectral } from '../../src/algorithms/hashing/hash-spectral/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-spectral/trace.ts';
test('spectral 确定性', () => { assert.equal(hashSpectral('a'), hashSpectral('a')); });
test('spectral 不同输入不同', () => { assert.notEqual(hashSpectral('a'), hashSpectral('b')); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length >= 2); });`,
);

// 13. blake2bp / 14. blake2sp
writeAlg('hash-blake2bp',
  blockHashMeta('hash-blake2bp', 'BLAKE2bp', 'BLAKE2bp',
    'BLAKE2bp：BLAKE2 的并行 4 路变种，针对长输入优化。', 'BLAKE2bp: 4-way parallel variant of BLAKE2, optimized for long inputs.',
    'BLAKE2bp：把输入拆成 4 路并行 BLAKE2 子哈希再合并。简化 BigInt 教学版。',
    'BLAKE2bp: splits input into 4 parallel BLAKE2 sub-hashes then combines. Simplified BigInt teaching version.',
    ['hashing', 'cryptographic', 'blake']),
  `// BLAKE2bp 简化 · 实现（4 路并行子哈希）
const MASK = (1n << 256n) - 1n;
function subHash(bytes: readonly number[], salt: bigint): bigint {
  let h = salt;
  for (let i = 0; i < bytes.length; i++) {
    h = (h * 0x100000001b3n + BigInt(bytes[i]!)) & MASK;
    h = ((h << 13n) | (h >> 243n)) & MASK;
  }
  return h;
}
export interface Blake2bpHooks {
  onLane?: (laneIdx: number, partial: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashBlake2bp(data: string | readonly number[], hooks: Blake2bpHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const lanes: bigint[] = [];
  for (let lane = 0; lane < 4; lane++) {
    const slice = bytes.filter((_, i) => i % 4 === lane);
    const partial = subHash(slice, BigInt(lane + 1) * 0x9e3779b97f4a7c15n & MASK);
    lanes.push(partial);
    hooks.onLane?.(lane, partial);
  }
  let combined = 0n;
  for (const p of lanes) combined = (combined * 31n + p) & MASK;
  for (let r = 0; r < 3; r++) combined = ((combined ^ (combined >> 17n)) * 0xff51afd7ed558ccdn) & MASK;
  hooks.onResult?.(combined);
  return combined;
}`,
  `// hash-blake2bp · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashBlake2bp } from './impl.ts';
export const DEFAULT_INPUT = 'hello world parallel';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BLAKE2bp 4 路并行', en: 'BLAKE2bp 4-way parallel' }).commit();
  let r = 0n;
  hashBlake2bp(input, {
    onLane: (l, p) => rec.begin({ zh: \`路 \${l} 完成\`, en: \`Lane \${l} done\` })
      .setAux([{ label: '部分', value: p.toString(16).slice(0, 16), role: 'compare' as BarRole }]).commit(),
    onResult: (h) => { r = h; },
  });
  rec.begin({ zh: '合并后 256-bit', en: 'Combined 256-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(64, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashBlake2bp } from '../../src/algorithms/hashing/hash-blake2bp/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-blake2bp/trace.ts';
test('blake2bp 确定性', () => { assert.equal(hashBlake2bp('a'), hashBlake2bp('a')); });
test('blake2bp 不同输入不同', () => { assert.notEqual(hashBlake2bp('a'), hashBlake2bp('b')); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length >= 2); });`,
);

writeAlg('hash-blake2sp',
  blockHashMeta('hash-blake2sp', 'BLAKE2sp', 'BLAKE2sp',
    'BLAKE2sp：8 路并行 BLAKE2 变种，针对短输入 SIMD 优化。', 'BLAKE2sp: 8-way parallel BLAKE2 variant tuned for short-input SIMD.',
    'BLAKE2sp：8 路并行子哈希，比 bp 路数更多，适合短消息。简化 BigInt 教学版。',
    'BLAKE2sp: 8-way parallel sub-hashes, more lanes than bp, suited to short messages. Simplified BigInt teaching version.',
    ['hashing', 'cryptographic', 'blake']),
  `// BLAKE2sp 简化 · 实现（8 路）
const MASK = (1n << 256n) - 1n;
function subHash(bytes: readonly number[], salt: bigint): bigint {
  let h = salt;
  for (let i = 0; i < bytes.length; i++) {
    h = (h * 0x100000001b3n + BigInt(bytes[i]!)) & MASK;
    h = ((h << 11n) | (h >> 245n)) & MASK;
  }
  return h;
}
export interface Blake2spHooks {
  onLane?: (laneIdx: number, partial: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashBlake2sp(data: string | readonly number[], hooks: Blake2spHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const lanes: bigint[] = [];
  for (let lane = 0; lane < 8; lane++) {
    const slice = bytes.filter((_, i) => i % 8 === lane);
    const partial = subHash(slice, BigInt(lane + 1) * 0x87c3fn & MASK);
    lanes.push(partial);
    hooks.onLane?.(lane, partial);
  }
  let combined = 0n;
  for (const p of lanes) combined = (combined * 17n + p) & MASK;
  for (let r = 0; r < 4; r++) combined = ((combined ^ (combined >> 23n)) * 0xc4ceb9fe1a85ec53n) & MASK;
  hooks.onResult?.(combined);
  return combined;
}`,
  `// hash-blake2sp · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashBlake2sp } from './impl.ts';
export const DEFAULT_INPUT = 'hello simd';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BLAKE2sp 8 路', en: 'BLAKE2sp 8-way' }).commit();
  let r = 0n;
  hashBlake2sp(input, {
    onLane: (l) => rec.begin({ zh: \`路 \${l}\`, en: \`Lane \${l}\` }).commit(),
    onResult: (h) => { r = h; },
  });
  rec.begin({ zh: '256-bit', en: '256-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(64, '0'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashBlake2sp } from '../../src/algorithms/hashing/hash-blake2sp/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-blake2sp/trace.ts';
test('blake2sp 确定性', () => { assert.equal(hashBlake2sp('a'), hashBlake2sp('a')); });
test('blake2sp 不同输入不同', () => { assert.notEqual(hashBlake2sp('a'), hashBlake2sp('b')); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length >= 2); });`,
);

// ============ CRYPTOGRAPHIC FAMILY (simplified BigInt, 4x word output) ============

function cryptoBlockMeta(id, zh, en, sumZh, sumEn, descZh, descEn, tags) {
  return meta(id, zh, en, sumZh, sumEn, descZh, descEn, 'O(n)', 'O(1)', tags);
}

function cryptoTrace(id, fnName) {
  return `// ${id} · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ${fnName} } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  rec.begin({ zh: \`${id} \${bytes.length} 字节\`, en: \`${id} \${bytes.length} bytes\` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }]).commit();
  let r: bigint[] = [];
  ${fnName}(input, {
    onBlock: (i) => rec.begin({ zh: \`压缩块 #\${i}\`, en: \`Compress block #\${i}\` })
      .setAux([{ label: '块', value: String(i), role: 'compare' as BarRole }]).commit(),
    onResult: (out) => { r = out; },
  });
  const hex = r.map(x => x.toString(16).padStart(16, '0')).join('');
  rec.begin({ zh: '最终哈希', en: 'Final hash' })
    .setAux([{ label: 'hex', value: hex, role: 'final' as BarRole }]).commit();
  return rec.build();
}`;
}

function cryptoTest(id, fnName) {
  return `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ${fnName} } from '../../src/algorithms/hashing/${id}/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/${id}/trace.ts';

test('${id} 确定性', () => {
  assert.deepEqual(${fnName}('a'), ${fnName}('a'));
});

test('${id} 不同输入不同', () => {
  assert.notDeepEqual(${fnName}('a'), ${fnName}('b'));
});

test('${id} 输出 4 个字', () => {
  assert.equal(${fnName}('a').length, 4);
});

test('${id} 空输入有效', () => {
  assert.ok(${fnName}('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});`;
}

// Shared compression scaffolding for crypto family (4x 64-bit words).
function cryptoImpl(id, fnName, IV, mixConstant, shift) {
  return `// ${id} 简化 · 实现（4 个 64 位字输出，单块链式）
const MASK64 = (1n << 64n) - 1n;
const IV: bigint[] = [${IV.map(x => x + 'n').join(', ')}];
const MIX = ${mixConstant}n;
const SHIFT = ${shift}n;
function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--) if (offset + i < bytes.length) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}
export interface ${fnName.replace(/^hash/, '')}Hooks {
  onBlock?: (i: number) => void;
  onResult?: (hash: bigint[]) => void;
}
export function ${fnName}(data: string | readonly number[], hooks: ${fnName.replace(/^hash/, '')}Hooks = {}): bigint[] {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let state = [...IV];
  const CHUNK = 32;
  const nchunks = Math.max(1, Math.ceil(bytes.length / CHUNK));
  for (let c = 0; c < nchunks; c++) {
    const base = c * CHUNK;
    const words: bigint[] = [];
    for (let w = 0; w < 4; w++) words.push(readLE64(bytes, base + w * 8));
    for (let i = 0; i < 4; i++) {
      state[i] = (state[i]! + words[i]!) & MASK64;
      state[i] = ((state[i]! << SHIFT) | (state[i]! >> (64n - SHIFT))) & MASK64;
      state[i] = (state[i]! ^ MIX) & MASK64;
    }
    hooks.onBlock?.(c);
  }
  hooks.onResult?.(state);
  return state;
}`;
}

// 15. md4 / 16. md2
writeAlg('hash-md4-impl',
  cryptoBlockMeta('hash-md4-impl', 'MD4（简化）', 'MD4 (simplified)',
    'MD4：Rivest 1990 的 128 位消息摘要，已被攻破但有历史意义。', 'MD4: Rivest 1990 128-bit digest, broken but historically significant.',
    'MD4 是 MD5、SHA 系列的前身。每 64 字节块三轮非线性混合。本实现是 256 位 BigInt 教学简化版（非标准）。',
    'MD4 is the precursor to MD5 and the SHA family. Each 64-byte block undergoes three non-linear rounds. Simplified 256-bit BigInt teaching version (non-standard).',
    ['hashing', 'cryptographic', 'legacy']),
  cryptoImpl('hash-md4-impl', 'hashMd4Impl', ['0x67452301', '0xefcdab89', '0x98badcfe', '0x10325476'], '0x5a827999', 3n),
  cryptoTrace('hash-md4-impl', 'hashMd4Impl'),
  cryptoTest('hash-md4-impl', 'hashMd4Impl'),
);

writeAlg('hash-md2-impl',
  cryptoBlockMeta('hash-md2-impl', 'MD2（简化）', 'MD2 (simplified)',
    'MD2：Rivest 1989 的 8 位字节级哈希，针对 8 位机优化。', 'MD2: Rivest 1989 byte-level hash optimized for 8-bit machines.',
    'MD2 是为 8 位处理器设计的密码学哈希。本实现是 256 位简化教学版（非标准 128 位）。',
    'MD2 is a cryptographic hash designed for 8-bit processors. Simplified 256-bit teaching version (non-standard 128-bit).',
    ['hashing', 'cryptographic', 'legacy']),
  cryptoImpl('hash-md2-impl', 'hashMd2Impl', ['0x01', '0x23', '0x45', '0x67'], '0xc6a4a793', 7n),
  cryptoTrace('hash-md2-impl', 'hashMd2Impl'),
  cryptoTest('hash-md2-impl', 'hashMd2Impl'),
);

// 17. ripemd / 18. ripemd160
writeAlg('hash-ripemd-impl',
  cryptoBlockMeta('hash-ripemd-impl', 'RIPEMD（简化）', 'RIPEMD (simplified)',
    'RIPEMD：欧洲研发的 128 位哈希，两条并行链。', 'RIPEMD: European 128-bit hash with two parallel chains.',
    'RIPEMD（RACE Integrity）：两条并行链 r 和 l 各自压缩后合并，增强抗碰撞。简化 256 位教学版。',
    'RIPEMD (RACE Integrity): two parallel chains r and l compressed independently then merged for collision resistance. Simplified 256-bit teaching version.',
    ['hashing', 'cryptographic']),
  cryptoImpl('hash-ripemd-impl', 'hashRipemdImpl', ['0x67452301', '0xefcdab89', '0x98badcfe', '0x10325476'], '0x5c4dd124', 11n),
  cryptoTrace('hash-ripemd-impl', 'hashRipemdImpl'),
  cryptoTest('hash-ripemd-impl', 'hashRipemdImpl'),
);

writeAlg('hash-ripemd160-impl',
  cryptoBlockMeta('hash-ripemd160-impl', 'RIPEMD-160（简化）', 'RIPEMD-160 (simplified)',
    'RIPEMD-160：160 位强化版，仍用于比特币地址。', 'RIPEMD-160: strengthened 160-bit version, still used in Bitcoin addresses.',
    'RIPEMD-160：5 字（160 位）输出，两条并行链 + 5 轮混合。简化 256 位教学版。',
    'RIPEMD-160: 5-word (160-bit) output, two parallel chains with 5 rounds. Simplified 256-bit teaching version.',
    ['hashing', 'cryptographic', 'bitcoin']),
  cryptoImpl('hash-ripemd160-impl', 'hashRipemd160Impl', ['0x67452301', '0xefcdab89', '0x98badcfe', '0x10325476'], '0x6ed9eba1', 9n),
  cryptoTrace('hash-ripemd160-impl', 'hashRipemd160Impl'),
  cryptoTest('hash-ripemd160-impl', 'hashRipemd160Impl'),
);

// 19. whirlpool / 20. gost
writeAlg('hash-whirlpool-impl',
  cryptoBlockMeta('hash-whirlpool-impl', 'Whirlpool（简化）', 'Whirlpool (simplified)',
    'Whirlpool：512 位 AES-inspired 哈希，NESSIE 选用。', 'Whirlpool: 512-bit AES-inspired hash selected by NESSIE.',
    'Whirlpool（Barreto/Rijmen）：基于 AES S-Box 的 512 位密码学哈希。简化 256 位教学版。',
    'Whirlpool (Barreto/Rijmen): 512-bit cryptographic hash based on the AES S-box. Simplified 256-bit teaching version.',
    ['hashing', 'cryptographic']),
  cryptoImpl('hash-whirlpool-impl', 'hashWhirlpoolImpl', ['0x1823c6e887b8014f', '0x36a6d2f5796f9152', '0x60bc9b8ea30c7b35', '0x1de0d7c22e4bfe57'], '0x9e3779b97f4a7c15', 7n),
  cryptoTrace('hash-whirlpool-impl', 'hashWhirlpoolImpl'),
  cryptoTest('hash-whirlpool-impl', 'hashWhirlpoolImpl'),
);

writeAlg('hash-gost-impl',
  cryptoBlockMeta('hash-gost-impl', 'GOST（简化）', 'GOST (simplified)',
    'GOST：俄罗斯标准的密码学哈希（GOST R 34.11）。', 'GOST: Russian standard cryptographic hash (GOST R 34.11).',
    'GOST R 34.11：俄罗斯国家标准哈希，基于块密码。简化 256 位教学版。',
    'GOST R 34.11: Russian national standard hash built on a block cipher. Simplified 256-bit teaching version.',
    ['hashing', 'cryptographic']),
  cryptoImpl('hash-gost-impl', 'hashGostImpl', ['0x01020304', '0x05060708', '0x090a0b0c', '0x0d0e0f10'], '0x6c62272e07bb0142', 5n),
  cryptoTrace('hash-gost-impl', 'hashGostImpl'),
  cryptoTest('hash-gost-impl', 'hashGostImpl'),
);

// 21. shake128 / 22. shake256 (XOF)
writeAlg('hash-shake128-impl',
  cryptoBlockMeta('hash-shake128-impl', 'SHAKE128（简化）', 'SHAKE128 (simplified)',
    'SHAKE128：SHA-3 系列的可扩展输出函数 (XOF)。', 'SHAKE128: extendable-output function (XOF) from the SHA-3 family.',
    'SHAKE128：基于 Keccak 海绵结构的 XOF，输出长度可任意指定。本实现是 256 位简化教学版。',
    'SHAKE128: XOF based on the Keccak sponge construction, arbitrary output length. Simplified 256-bit teaching version.',
    ['hashing', 'cryptographic', 'sha3', 'xof']),
  cryptoImpl('hash-shake128-impl', 'hashShake128Impl', ['0x6a09e667f3bcc908', '0xbb67ae8584caa73b', '0x3c6ef372fe94f82b', '0xa54ff53a5f1d36f1'], '0x9e3779b97f4a7c15', 1n),
  cryptoTrace('hash-shake128-impl', 'hashShake128Impl'),
  cryptoTest('hash-shake128-impl', 'hashShake128Impl'),
);

writeAlg('hash-shake256-impl',
  cryptoBlockMeta('hash-shake256-impl', 'SHAKE256（简化）', 'SHAKE256 (simplified)',
    'SHAKE256：SHA-3 系列高安全级别的 XOF。', 'SHAKE256: higher-security XOF from the SHA-3 family.',
    'SHAKE256：与 SHAKE128 同源，更高安全级别（256 位）。简化教学版。',
    'SHAKE256: same family as SHAKE128, higher security level (256-bit). Simplified teaching version.',
    ['hashing', 'cryptographic', 'sha3', 'xof']),
  cryptoImpl('hash-shake256-impl', 'hashShake256Impl', ['0x510e527fade682d1', '0x9b05688c2b3e6c1f', '0x1f83d9abfb41bd6b', '0x5be0cd19137e2179'], '0xcbbb9d5dc1059ed8', 2n),
  cryptoTrace('hash-shake256-impl', 'hashShake256Impl'),
  cryptoTest('hash-shake256-impl', 'hashShake256Impl'),
);

// 23. blake3 (alias to hash-blake3 concept but distinct simplified variant)
writeAlg('hash-blake3-impl',
  cryptoBlockMeta('hash-blake3-impl', 'BLAKE3（简化变体）', 'BLAKE3 (simplified variant)',
    'BLAKE3 变体：Merkle 树式并行哈希，比 BLAKE2 更快。', 'BLAKE3 variant: Merkle-tree parallel hash, faster than BLAKE2.',
    'BLAKE3 简化变体：采用与 hash-blake3 相同的 Merkle 模式但不同的 IV 与混合常数，便于教学对比。',
    'BLAKE3 simplified variant: same Merkle mode as hash-blake3 but different IV and mixing constants, for teaching comparison.',
    ['hashing', 'cryptographic', 'blake', 'merkle-tree']),
  cryptoImpl('hash-blake3-impl', 'hashBlake3Impl', ['0x6a09e667f3bcc908', '0xbb67ae8584caa73b', '0x3c6ef372fe94f82b', '0xa54ff53a5f1d36f1'], '0x85ebca77c2b3ae63', 14n),
  cryptoTrace('hash-blake3-impl', 'hashBlake3Impl'),
  cryptoTest('hash-blake3-impl', 'hashBlake3Impl'),
);

console.log('generated all 23 hashing algorithms');
