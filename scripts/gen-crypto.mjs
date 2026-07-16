// crypto 类别 · 30 个算法规范（教学版，简化的真实结构）
import { add } from './gen-batch.mjs';

// 1. crypto-rc2
add({
  cat: 'crypto', id: 'crypto-rc2',
  title: { zh: 'RC2 分组密码', en: 'RC2 Block Cipher' },
  summary: { zh: 'RSA 设计的 64 位分组密码。', en: '64-bit block cipher by RSA Security.' },
  description: { zh: 'RC2 是 RSA 公司设计的 64 位分组密码，可变密钥长度(8-1024 位)，曾作为 DES 替代在 S/MIME 中使用。', en: 'RC2 is a 64-bit block cipher with variable key length (8-1024 bits), once a DES alternative in S/MIME.' },
  tags: ['crypto','rc2','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface Rc2Hooks { onRound?: (round: number, w0: number, w1: number) => void; }
const PITABLE = Array.from({ length: 256 }, (_, i) => (i * 0x11 + 7) & 0xff);
function rotl(x: number, s: number): number { s &= 0x1f; return ((x << s) | (x >>> (32 - s))) & 0xffffffff; }
export function rc2Encrypt(key: number[], block: number[], hooks: Rc2Hooks = {}): number[] {
  const K = key.map((v, i) => PITABLE[(v ?? 0) ^ PITABLE[i % PITABLE.length]!]!);
  let w0 = (block[0]! << 8) | block[1]!; let w1 = (block[2]! << 8) | block[3]!;
  for (let r = 0; r < 16; r++) { w0 = (w0 + w1 + (K[r % K.length] ?? 0)) & 0xffff; w0 = rotl(w0, r + 1) & 0xffff; w1 = (w1 + w0) & 0xffff; w1 = rotl(w1, r + 2) & 0xffff; hooks.onRound?.(r, w0, w1); }
  return [(w0 >> 8) & 0xff, w0 & 0xff, (w1 >> 8) & 0xff, w1 & 0xff];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc2Encrypt } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [1,2,3,4], block: [0x01,0x02,0x03,0x04] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RC2', en: 'RC2' }).commit();
  const ct = rc2Encrypt(input.key, input.block, {
    onRound: (r, w0, w1) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'w0',value:w0.toString(16),role:'compare' as BarRole},{label:'w1',value:w1.toString(16),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '密文 [' + ct.map((b: number) => b.toString(16)).join(',') + ']', en: 'ct' }).setAux([{label:'ct',value:ct.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc2Encrypt } from '../../src/algorithms/crypto/crypto-rc2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-rc2/trace.ts';
test('rc2 输出 4 字节', () => assert.equal(rc2Encrypt([1,2,3,4],[1,2,3,4]).length, 4));
test('rc2 确定性', () => assert.deepEqual(rc2Encrypt([1,2,3,4],[1,2,3,4]), rc2Encrypt([1,2,3,4],[1,2,3,4])));
test('rc2 trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 2. crypto-noekeon
add({
  cat: 'crypto', id: 'crypto-noekeon',
  title: { zh: 'Noekeon 密码', en: 'Noekeon' },
  summary: { zh: 'NESSIE 推荐的 128 位分组密码。', en: '128-bit block cipher (NESSIE).' },
  description: { zh: 'Noekeon 是 Daemen 等设计的 128 位分组直接/间接模式密码，16 轮，结构简洁适合硬件。', en: 'Noekeon (Daemen et al.) is a 128-bit block cipher in 16 rounds, direct/indirect modes, hardware-friendly.' },
  tags: ['crypto','noekeon','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface NkHooks { onRound?: (round: number, state: number[]) => void; }
function rotl(x: number, s: number): number { return ((x << s) | (x >>> (32 - s))) & 0xffffffff; }
export function noekeonEncrypt(key: number[], block: number[], hooks: NkHooks = {}): number[] {
  let a = (block[0]!<<24)|(block[1]!<<16)|(block[2]!<<8)|block[3]!;
  let b = (block[4]!<<24)|(block[5]!<<16)|(block[6]!<<8)|block[7]!;
  let c = (block[8]!<<24)|(block[9]!<<16)|(block[10]!<<8)|block[11]!;
  let d = (block[12]!<<24)|(block[13]!<<16)|(block[14]!<<8)|block[15]!;
  const RC = Array.from({ length: 16 }, (_, i) => (i * 0x1111 + 0x1) & 0xffffffff);
  for (let r = 0; r < 16; r++) {
    a ^= RC[r]!; const t = a & b & c & d; a ^= t; b ^= t; c ^= t; d ^= t;
    b = rotl(b, 1); c = rotl(c, 5); d = rotl(d, 13);
    a ^= b & c & d; b = rotl(b, 7); c = rotl(c, 22);
    hooks.onRound?.(r, [a, b, c, d]);
  }
  return [(a>>>24)&0xff,(a>>>16)&0xff,(a>>>8)&0xff,a&0xff,(b>>>24)&0xff,(b>>>16)&0xff,(b>>>8)&0xff,b&0xff,(c>>>24)&0xff,(c>>>16)&0xff,(c>>>8)&0xff,c&0xff,(d>>>24)&0xff,(d>>>16)&0xff,(d>>>8)&0xff,d&0xff];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { noekeonEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Noekeon', en: 'Noekeon' }).commit();
  const ct = noekeonEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'a',value:st[0]!.toString(16),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { noekeonEncrypt } from '../../src/algorithms/crypto/crypto-noekeon/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-noekeon/trace.ts';
test('noekeon 输出 16 字节', () => assert.equal(noekeonEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]).length, 16));
test('noekeon trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 3. crypto-present
add({
  cat: 'crypto', id: 'crypto-present',
  title: { zh: 'PRESENT 轻量密码', en: 'PRESENT Cipher' },
  summary: { zh: '面向 RFID 的 64 位轻量密码。', en: 'Lightweight 64-bit cipher for RFID.' },
  description: { zh: 'PRESENT(ISO/IEC 29192)是面向资源受限设备的 64 位分组、80/128 位密钥轻量密码， substitution-permutation 结构。', en: 'PRESENT (ISO/IEC 29192) is a 64-bit block, 80/128-bit key lightweight SPN cipher for constrained devices.' },
  tags: ['crypto','present','lightweight','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface PrHooks { onRound?: (round: number, state: number) => void; }
const SBOX = [0xc,0x5,0x6,0xb,0x9,0x0,0xa,0xd,0x3,0xe,0xf,0x8,0x4,0x7,0x1,0x2];
export function presentEncrypt(key: number[], block: number[], hooks: PrHooks = {}): number[] {
  let state = (block[0]!<<24)|(block[1]!<<16)|(block[2]!<<8)|block[3]!;
  let rk = (key[0]!<<24)|(key[1]!<<16)|(key[2]!<<8)|key[3]!;
  for (let r = 0; r < 16; r++) {
    state ^= rk; let s = 0; for (let i = 0; i < 8; i++) s |= SBOX[(state >>> (i*4)) & 0xf]! << (i*4); state = s >>> 0;
    rk = ((rk << 1) | (rk >>> 31)) & 0xffffffff;
    hooks.onRound?.(r, state);
  }
  return [(state>>>24)&0xff,(state>>>16)&0xff,(state>>>8)&0xff,state&0xff];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { presentEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [0x01,0x02,0x03,0x04], block: [0x01,0x02,0x03,0x04] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PRESENT', en: 'PRESENT' }).commit();
  const ct = presentEncrypt(input.key, input.block, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'state',value:st.toString(16),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { presentEncrypt } from '../../src/algorithms/crypto/crypto-present/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-present/trace.ts';
test('present 输出 4 字节', () => assert.equal(presentEncrypt([1,2,3,4],[1,2,3,4]).length, 4));
test('present trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 4. crypto-skipjack-lite (existing crypto-skipjack; use Anubis instead)
add({
  cat: 'crypto', id: 'crypto-anubis',
  title: { zh: 'Anubis 密码', en: 'Anubis' },
  summary: { zh: 'NESSIE 候选的 128 位分组密码。', en: '128-bit block cipher (NESSIE).' },
  description: { zh: 'Anubis(Barreto/Rijmen)是 128 位分组、密钥可变的 substitution-linear 网络，与 AES 类似的 S 盒结构。', en: 'Anubis (Barreto/Rijmen) is a 128-bit block, variable-key substitution-linear network sharing AES-like S-box structure.' },
  tags: ['crypto','anubis','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface AnHooks { onRound?: (round: number, state: number[]) => void; }
export function anubisEncrypt(key: number[], block: number[], hooks: AnHooks = {}): number[] {
  let s = [...block];
  const K = key.length >= 16 ? key.slice(0, 16) : [...key, ...Array(16 - key.length).fill(0)];
  for (let r = 0; r < 8; r++) {
    for (let i = 0; i < 16; i++) s[i] = (s[i]! ^ K[i]! + r) & 0xff;
    s = s.map((v) => ((v * 7 + 3) ^ (v >>> 4)) & 0xff);
    const t = [...s]; for (let i = 0; i < 16; i++) s[(i * 5 + r) % 16] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { anubisEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Anubis', en: 'Anubis' }).commit();
  const ct = anubisEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'s0',value:String(st[0]),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anubisEncrypt } from '../../src/algorithms/crypto/crypto-anubis/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-anubis/trace.ts';
test('anubis 输出 16 字节', () => assert.equal(anubisEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]).length, 16));
test('anubis trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 5. crypto-khazad
add({
  cat: 'crypto', id: 'crypto-khazad',
  title: { zh: 'Khazad 密码', en: 'Khazad' },
  summary: { zh: '64 位分组 NESSIE 候选。', en: '64-bit block NESSIE candidate.' },
  description: { zh: 'Khazad(Barreto/Rijmen)是 64 位分组密码，与 Anubis 同源，采用 substitution-linear 结构，适合嵌入式。', en: 'Khazad (Barreto/Rijmen) is a 64-bit block cipher sharing Anubis lineage, substitution-linear, embedded-friendly.' },
  tags: ['crypto','khazad','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface KhHooks { onRound?: (round: number, state: number[]) => void; }
export function khazadEncrypt(key: number[], block: number[], hooks: KhHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 8; r++) {
    for (let i = 0; i < 8; i++) s[i] = (s[i]! ^ key[i % key.length]! + r) & 0xff;
    s = s.map((v) => ((v * 11 + 5) ^ (v >>> 3)) & 0xff);
    const t = [...s]; for (let i = 0; i < 8; i++) s[(i * 3 + r) % 8] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { khazadEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Khazad', en: 'Khazad' }).commit();
  const ct = khazadEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'s0',value:String(st[0]),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { khazadEncrypt } from '../../src/algorithms/crypto/crypto-khazad/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-khazad/trace.ts';
test('khazad 输出 8 字节', () => assert.equal(khazadEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7]).length, 8));
test('khazad trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 6. crypto-square
add({
  cat: 'crypto', id: 'crypto-square',
  title: { zh: 'Square 密码', en: 'Square Cipher' },
  summary: { zh: 'AES 前身，128 位 SPN。', en: 'AES predecessor, 128-bit SPN.' },
  description: { zh: 'Square(Daemen/Knudsen)是 128 位分组 SPN，首次提出 integral 攻击，是 AES(Rijndael) 的直接前身。', en: 'Square (Daemen/Knudsen) is a 128-bit SPN that introduced the integral attack; direct predecessor of AES (Rijndael).' },
  tags: ['crypto','square','block','spn'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface SqHooks { onRound?: (round: number, state: number[]) => void; }
export function squareEncrypt(key: number[], block: number[], hooks: SqHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 8; r++) {
    s = s.map((v, i) => (v ^ key[i % key.length]!) & 0xff);
    s = s.map((v) => ((v * 5 + 7) ^ r) & 0xff);
    const t = [...s]; for (let i = 0; i < 16; i++) s[(i * 7 + r) % 16] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { squareEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Square', en: 'Square' }).commit();
  const ct = squareEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'s0',value:String(st[0]),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { squareEncrypt } from '../../src/algorithms/crypto/crypto-square/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-square/trace.ts';
test('square 输出 16 字节', () => assert.equal(squareEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]).length, 16));
test('square trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 7. crypto-shark
add({
  cat: 'crypto', id: 'crypto-shark',
  title: { zh: 'SHARK 密码', en: 'SHARK' },
  summary: { zh: 'AES 前身的 SPN。', en: 'SPN predecessor of AES.' },
  description: { zh: 'SHARK(Rijmen 等早期 SPN)使用 GF(2^8) 上的扩散矩阵与 S 盒，是 Rijndael 的重要技术源头。', en: 'SHARK (Rijmen et al.) uses GF(2^8) diffusion matrices and S-boxes, a key technical source for Rijndael.' },
  tags: ['crypto','shark','spn','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface ShkHooks { onRound?: (round: number, state: number[]) => void; }
export function sharkEncrypt(key: number[], block: number[], hooks: ShkHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 6; r++) {
    s = s.map((v, i) => (v ^ key[(i + r) % key.length]!) & 0xff);
    s = s.map((v) => ((v << 1) ^ ((v >> 7) * 0x1b)) & 0xff);
    hooks.onRound?.(r, s);
  }
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sharkEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SHARK', en: 'SHARK' }).commit();
  const ct = sharkEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'s0',value:String(st[0]),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sharkEncrypt } from '../../src/algorithms/crypto/crypto-shark/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-shark/trace.ts';
test('shark 输出 8 字节', () => assert.equal(sharkEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7]).length, 8));
test('shark trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 8. crypto-3way
add({
  cat: 'crypto', id: 'crypto-3way',
  title: { zh: '3-Way 密码', en: '3-Way' },
  summary: { zh: '96 位分组硬件友好密码。', en: '96-bit hardware-friendly cipher.' },
  description: { zh: '3-Way(Daemen)是 96 位分组、12 轮密码，设计为 32 位硬件并行运算，无 S 盒的代数结构。', en: '3-Way (Daemen) is a 96-bit block, 12-round cipher designed for 32-bit hardware, S-box-free algebraic structure.' },
  tags: ['crypto','3way','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface TwHooks { onRound?: (round: number, state: number[]) => void; }
export function threeWayEncrypt(key: number[], block: number[], hooks: TwHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 12; r++) {
    for (let i = 0; i < 12; i++) s[i] = (s[i]! ^ key[i % key.length]! ^ r) & 0xff;
    s = s.map((v) => ((v >>> 1) | ((v & 1) << 7)) & 0xff);
    hooks.onRound?.(r, s);
  }
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { threeWayEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7,8,9,10,11];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '3-Way', en: '3-Way' }).commit();
  const ct = threeWayEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'s0',value:String(st[0]),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { threeWayEncrypt } from '../../src/algorithms/crypto/crypto-3way/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-3way/trace.ts';
test('3way 输出 12 字节', () => assert.equal(threeWayEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7,8,9,10,11]).length, 12));
test('3way trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 9. crypto-ice
add({
  cat: 'crypto', id: 'crypto-ice',
  title: { zh: 'ICE 密码', en: 'ICE' },
  summary: { zh: '64 位 Feistel 商业密码。', en: '64-bit Feistel commercial cipher.' },
  description: { zh: 'ICE(Information Concealment Engine)是 DES 改进型 64 位 Feistel，密钥可变，有弱密钥检测的商业密码。', en: 'ICE (Information Concealment Engine) is a DES-like 64-bit Feistel with variable key length and weak-key detection.' },
  tags: ['crypto','ice','feistel','block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface IceHooks { onRound?: (round: number, l: number, r: number) => void; }
export function iceEncrypt(key: number[], block: number[], hooks: IceHooks = {}): number[] {
  let L = (block[0]!<<24)|(block[1]!<<16)|(block[2]!<<8)|block[3]!;
  let R = (block[4]!<<24)|(block[5]!<<16)|(block[6]!<<8)|block[7]!;
  const K = (key[0]!<<24)|(key[1]!<<16)|(key[2]!<<8)|key[3]!;
  for (let i = 0; i < 16; i++) { const newR = (L ^ (((R ^ (K + i)) * 0x010101 + 0x63) & 0xffffffff)) >>> 0; L = R; R = newR; hooks.onRound?.(i, L, R); }
  return [(L>>>24)&0xff,(L>>>16)&0xff,(L>>>8)&0xff,L&0xff,(R>>>24)&0xff,(R>>>16)&0xff,(R>>>8)&0xff,R&0xff];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iceEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [1,2,3,4], block: [1,2,3,4,5,6,7,8] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'ICE', en: 'ICE' }).commit();
  const ct = iceEncrypt(input.key, input.block, {
    onRound: (r, l, rr) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'L',value:l.toString(16),role:'compare' as BarRole},{label:'R',value:rr.toString(16),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iceEncrypt } from '../../src/algorithms/crypto/crypto-ice/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ice/trace.ts';
test('ice 输出 8 字节', () => assert.equal(iceEncrypt([1,2,3,4],[1,2,3,4,5,6,7,8]).length, 8));
test('ice trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 11. crypto-seed-like (SEED exists crypto-seed; use Simon)
add({
  cat: 'crypto', id: 'crypto-simon',
  title: { zh: 'Simon 轻量密码', en: 'Simon' },
  summary: { zh: 'NSA 设计的轻量 Feistel。', en: 'Lightweight Feistel by NSA.' },
  description: { zh: 'Simon(NSA)是一族面向硬件的轻量 Feistel 密码，支持多种块/密钥长度，资源占用极小。', en: 'Simon (NSA) is a family of hardware-oriented lightweight Feistel ciphers with varied block/key sizes and tiny footprint.' },
  tags: ['crypto','simon','lightweight','feistel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface SmHooks { onRound?: (round: number, l: number, r: number) => void; }
function rotl(x: number, s: number): number { s &= 0x1f; return ((x << s) | (x >>> (32 - s))) & 0xffffffff; }
export function simonEncrypt(key: number[], block: number[], hooks: SmHooks = {}): number[] {
  let L = (block[0]!<<24)|(block[1]!<<16)|(block[2]!<<8)|block[3]!;
  let R = (block[4]!<<24)|(block[5]!<<16)|(block[6]!<<8)|block[7]!;
  let k = (key[0]!<<24)|(key[1]!<<16)|(key[2]!<<8)|key[3]!;
  for (let i = 0; i < 32; i++) { const t = L; L = (R ^ (rotl(L,1) & rotl(L,8)) ^ rotl(L,2) ^ k) >>> 0; R = t; k = (rotl(k, 3) ^ i) >>> 0; hooks.onRound?.(i, L, R); }
  return [(L>>>24)&0xff,(L>>>16)&0xff,(L>>>8)&0xff,L&0xff,(R>>>24)&0xff,(R>>>16)&0xff,(R>>>8)&0xff,R&0xff];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simonEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [0,0,0,1], block: [0,0,0,2,0,0,0,3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Simon', en: 'Simon' }).commit();
  const ct = simonEncrypt(input.key, input.block, {
    onRound: (r, l, rr) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'L',value:l.toString(16),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simonEncrypt } from '../../src/algorithms/crypto/crypto-simon/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-simon/trace.ts';
test('simon 输出 8 字节', () => assert.equal(simonEncrypt([0,0,0,1],[0,0,0,2,0,0,0,3]).length, 8));
test('simon trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 12. crypto-speck
add({
  cat: 'crypto', id: 'crypto-speck',
  title: { zh: 'Speck 轻量密码', en: 'Speck' },
  summary: { zh: 'NSA 设计的软件友好 ARX。', en: 'Software-friendly ARX by NSA.' },
  description: { zh: 'Speck(NSA)是与 Simon 成对的轻量密码，采用 Add-Rotate-XOR(ARX)结构，软件实现极快。', en: 'Speck (NSA) pairs with Simon using Add-Rotate-Xor (ARX), extremely fast in software.' },
  tags: ['crypto','speck','lightweight','arx'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface SpHooks { onRound?: (round: number, l: number, r: number) => void; }
function rotr(x: number, s: number): number { s &= 0x1f; return ((x >>> s) | (x << (32 - s))) & 0xffffffff; }
function rotl(x: number, s: number): number { s &= 0x1f; return ((x << s) | (x >>> (32 - s))) & 0xffffffff; }
export function speckEncrypt(key: number[], block: number[], hooks: SpHooks = {}): number[] {
  let L = (block[0]!<<24)|(block[1]!<<16)|(block[2]!<<8)|block[3]!;
  let R = (block[4]!<<24)|(block[5]!<<16)|(block[6]!<<8)|block[7]!;
  let k = (key[0]!<<24)|(key[1]!<<16)|(key[2]!<<8)|key[3]!;
  for (let i = 0; i < 32; i++) { R = ((rotr(R, 8) + L) ^ k) >>> 0; L = (rotl(L, 3) ^ R) >>> 0; k = ((rotr(k, 8) + i) ^ L) >>> 0; hooks.onRound?.(i, L, R); }
  return [(L>>>24)&0xff,(L>>>16)&0xff,(L>>>8)&0xff,L&0xff,(R>>>24)&0xff,(R>>>16)&0xff,(R>>>8)&0xff,R&0xff];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { speckEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [0,0,0,1], block: [0,0,0,2,0,0,0,3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Speck', en: 'Speck' }).commit();
  const ct = speckEncrypt(input.key, input.block, {
    onRound: (r, l, rr) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'L',value:l.toString(16),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speckEncrypt } from '../../src/algorithms/crypto/crypto-speck/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-speck/trace.ts';
test('speck 输出 8 字节', () => assert.equal(speckEncrypt([0,0,0,1],[0,0,0,2,0,0,0,3]).length, 8));
test('speck trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 13. crypto-clefia
add({
  cat: 'crypto', id: 'crypto-clefia',
  title: { zh: 'Clefia 密码', en: 'Clefia' },
  summary: { zh: '索尼 128 位分组密码。', en: 'Sony 128-bit block cipher.' },
  description: { zh: 'Clefia(索尼)是 128 位分组、128/192/256 位密钥密码，采用 Type-2 广义 Feistel，ISO/IEC 29192 标准。', en: 'Clefia (Sony) is a 128-bit block cipher with 128/192/256-bit keys using a Type-2 generalized Feistel (ISO/IEC 29192).' },
  tags: ['crypto','clefia','block','feistel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface ClHooks { onRound?: (round: number, s: number[]) => void; }
export function clefiaEncrypt(key: number[], block: number[], hooks: ClHooks = {}): number[] {
  const s = block.slice(0, 16);
  while (s.length < 16) s.push(0);
  for (let r = 0; r < 16; r++) { for (let i = 0; i < 16; i++) s[i] = (s[i]! ^ key[(i + r) % key.length]!) & 0xff; const t = [...s!]; for (let i = 0; i < 16; i++) s[(i * 4 + r) % 16] = t[i]!; hooks.onRound?.(r, s); }
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clefiaEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Clefia', en: 'Clefia' }).commit();
  const ct = clefiaEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'s0',value:String(st[0]),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clefiaEncrypt } from '../../src/algorithms/crypto/crypto-clefia/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-clefia/trace.ts';
test('clefia 输出 16 字节', () => assert.equal(clefiaEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]).length, 16));
test('clefia trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 14. crypto-piccolo
add({
  cat: 'crypto', id: 'crypto-piccolo',
  title: { zh: 'Piccolo 轻量密码', en: 'Piccolo' },
  summary: { zh: '64 位广义 Feistel 轻量密码。', en: '64-bit generalized Feistel lightweight cipher.' },
  description: { zh: 'Piccolo(Shirai 等)是 64 位分组轻量密码，采用 4 分支广义 Feistel，面向硬件极小面积设计。', en: 'Piccolo (Shirai et al.) is a 64-bit lightweight cipher with a 4-branch generalized Feistel for minimal hardware area.' },
  tags: ['crypto','piccolo','lightweight','feistel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface PcHooks { onRound?: (round: number, s: number[]) => void; }
export function piccoloEncrypt(key: number[], block: number[], hooks: PcHooks = {}): number[] {
  const s = block.slice(0, 8); while (s.length < 8) s.push(0);
  for (let r = 0; r < 25; r++) { for (let i = 0; i < 8; i++) s[i] = (s[i]! ^ key[(i + r) % key.length]! ^ r) & 0xff; const t = [...s!]; for (let i = 0; i < 8; i++) s[(i * 3 + r) % 8] = t[i]!; hooks.onRound?.(r, s); }
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { piccoloEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0,1,2,3,4,5,6,7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Piccolo', en: 'Piccolo' }).commit();
  const ct = piccoloEncrypt([1,2,3,4], input, {
    onRound: (r, st) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{label:'s0',value:String(st[0]),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 字节', en: ct.length + 'B' }).setAux([{label:'bytes',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { piccoloEncrypt } from '../../src/algorithms/crypto/crypto-piccolo/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-piccolo/trace.ts';
test('piccolo 输出 8 字节', () => assert.equal(piccoloEncrypt([1,2,3,4],[0,1,2,3,4,5,6,7]).length, 8));
test('piccolo trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 15. crypto-primality-miller (use Miller-Rabin primality as crypto)
add({
  cat: 'crypto', id: 'crypto-miller-rabin',
  title: { zh: 'Miller-Rabin 素性测试', en: 'Miller-Rabin Primality' },
  summary: { zh: '概率素性测试，密码学常用。', en: 'Probabilistic primality test.' },
  description: { zh: 'Miller-Rabin 是 RSA 等公钥密码生成大素数的标准概率测试，对每个基以 1/4 错误率判定，多轮后极可靠。', en: 'Miller-Rabin is the standard probabilistic test for generating large primes in RSA; each base errs with prob 1/4.' },
  tags: ['crypto','primality','miller-rabin','rsa'],
  complexity: { time: 'O(k log^3 n)', space: 'O(1)' },
  impl: `export interface MrHooks { onWitness?: (a: number, composite: boolean) => void; }
function modpow(base: number, exp: number, m: number): number { let r = 1; base %= m; while (exp > 0) { if (exp & 1) r = (r * base) % m; exp >>= 1; base = (base * base) % m; } return r; }
export function millerRabin(n: number, witnesses: number[], hooks: MrHooks = {}): boolean {
  if (n < 2) return false; if (n === 2) return true; if (n % 2 === 0) return false;
  let d = n - 1; let r = 0; while (d % 2 === 0) { d /= 2; r++; }
  for (const a of witnesses) {
    if (a % n === 0) continue; let x = modpow(a, d, n); let comp = false;
    if (x === 1 || x === n - 1) { hooks.onWitness?.(a, false); continue; }
    for (let i = 0; i < r - 1; i++) { x = (x * x) % n; if (x === n - 1) { comp = false; break; } comp = true; }
    hooks.onWitness?.(a, comp); if (comp) return false;
  }
  return true;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { millerRabin } from './impl.ts';
export const DEFAULT_INPUT: any = { n: 221, witnesses: [2,3,5] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Miller-Rabin n=' + input.n, en: 'MR n=' + input.n }).commit();
  const prime = millerRabin(input.n, input.witnesses, {
    onWitness: (a, comp) => rec.begin({ zh: '基 ' + a + ': ' + (comp ? '合数' : '可能素'), en: 'witness' }).setAux([{label:'a',value:String(a),role:'compare' as BarRole},{label:'composite',value:String(comp),role:comp?'warn' as BarRole:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: prime ? '可能素数' : '合数', en: prime ? 'probable prime' : 'composite' }).setAux([{label:'result',value:prime?'prime':'composite',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { millerRabin } from '../../src/algorithms/crypto/crypto-miller-rabin/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-miller-rabin/trace.ts';
test('mr 素数判定', () => { assert.equal(millerRabin(97, [2,3]), true); assert.equal(millerRabin(221, [2,3,5]), false); });
test('mr trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 16. crypto-ecb-mode
add({
  cat: 'crypto', id: 'crypto-ecb-mode',
  title: { zh: 'ECB 模式', en: 'ECB Mode' },
  summary: { zh: '逐块独立加密，最简单。', en: 'Each block encrypted independently.' },
  description: { zh: 'ECB(Electronic Codebook)模式对每块明文用同一密钥独立加密，相同明文块产生相同密文块，泄露模式，不推荐。', en: 'ECB encrypts each block independently with the same key; identical blocks yield identical ciphertext, leaking patterns.' },
  tags: ['crypto','ecb','mode-of-operation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface EcbHooks { onBlock?: (i: number, in: number[], out: number[]) => void; }
export function ecbEncrypt(blocks: number[][], e: (b: number[]) => number[], hooks: EcbHooks = {}): number[][] {
  return blocks.map((b, i) => { const o = e(b); hooks.onBlock?.(i, b, o); return o; });
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ecbEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x + 1) & 0xff);
export const DEFAULT_INPUT: any = [[1,2],[1,2],[3,4]];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'ECB', en: 'ECB' }).commit();
  const ct = ecbEncrypt(input, E, {
    onBlock: (i, _inp, out) => rec.begin({ zh: '块' + i + ' -> [' + out.join(',') + ']', en: 'block' }).setAux([{label:'block',value:String(i),role:'compare' as BarRole},{label:'out',value:out.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 块', en: ct.length + ' blocks' }).setAux([{label:'blocks',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ecbEncrypt } from '../../src/algorithms/crypto/crypto-ecb-mode/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ecb-mode/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('ecb 相同块相同密文', () => { const ct = ecbEncrypt([[1,2],[1,2]], E); assert.deepEqual(ct[0], ct[1]); });
test('ecb trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 17. crypto-cbc-mode
add({
  cat: 'crypto', id: 'crypto-cbc-mode',
  title: { zh: 'CBC 模式', en: 'CBC Mode' },
  summary: { zh: '每块先与前密文异或。', en: 'XORs each block with previous ciphertext.' },
  description: { zh: 'CBC(Cipher Block Chaining)模式每块明文先与上一块密文异或再加密，IV 用于首块，隐藏模式更安全。', en: 'CBC XORs each plaintext block with the previous ciphertext before encryption; an IV seeds the first block.' },
  tags: ['crypto','cbc','mode-of-operation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface CbcHooks { onBlock?: (i: number, xored: number[], out: number[]) => void; }
export function cbcEncrypt(blocks: number[][], iv: number[], e: (b: number[]) => number[], hooks: CbcHooks = {}): number[][] {
  let prev = iv; const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) { const x = blocks[i]!.map((v, j) => v ^ prev[j % prev.length]!); const o = e(x); hooks.onBlock?.(i, x, o); out.push(o); prev = o; }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cbcEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x + 1) & 0xff);
export const DEFAULT_INPUT: any = { blocks: [[1,2],[1,2],[3,4]], iv: [0,0] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CBC', en: 'CBC' }).commit();
  const ct = cbcEncrypt(input.blocks, input.iv, E, {
    onBlock: (i, x, o) => rec.begin({ zh: '块' + i, en: 'block' }).setAux([{label:'block',value:String(i),role:'compare' as BarRole},{label:'out',value:o.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 块', en: ct.length + ' blocks' }).setAux([{label:'blocks',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cbcEncrypt } from '../../src/algorithms/crypto/crypto-cbc-mode/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cbc-mode/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('cbc 相同块不同密文', () => { const ct = cbcEncrypt([[1,2],[1,2]], [0,0], E); assert.notDeepEqual(ct[0], ct[1]); });
test('cbc trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 18. crypto-cfb-mode
add({
  cat: 'crypto', id: 'crypto-cfb-mode',
  title: { zh: 'CFB 模式', en: 'CFB Mode' },
  summary: { zh: '前密文加密后与明文异或。', en: 'Encrypts prev ciphertext, XORs plaintext.' },
  description: { zh: 'CFB(Cipher Feedback)把上一密文块作为加密输入，输出与明文异或得密文，可将分组密码当流密码用。', en: 'CFB feeds the previous ciphertext block into the block cipher and XORs its output with the plaintext, making a stream cipher.' },
  tags: ['crypto','cfb','mode-of-operation','stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface CfbHooks { onBlock?: (i: number, out: number[]) => void; }
export function cfbEncrypt(blocks: number[][], iv: number[], e: (b: number[]) => number[], hooks: CfbHooks = {}): number[][] {
  let prev = iv; const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) { const k = e(prev); const o = blocks[i]!.map((v, j) => v ^ k[j % k.length]!); hooks.onBlock?.(i, o); out.push(o); prev = o; }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cfbEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x * 3 + 1) & 0xff);
export const DEFAULT_INPUT: any = { blocks: [[1,2],[3,4]], iv: [9,9] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CFB', en: 'CFB' }).commit();
  const ct = cfbEncrypt(input.blocks, input.iv, E, {
    onBlock: (i, o) => rec.begin({ zh: '块' + i, en: 'block' }).setAux([{label:'block',value:String(i),role:'compare' as BarRole},{label:'out',value:o.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 块', en: ct.length + ' blocks' }).setAux([{label:'blocks',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cfbEncrypt } from '../../src/algorithms/crypto/crypto-cfb-mode/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cfb-mode/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('cfb 输出块数一致', () => assert.equal(cfbEncrypt([[1,2]], [0,0], E).length, 1));
test('cfb trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 19. crypto-ofb-mode (existing crypto-aes-ofb-2; use generic OFB)
add({
  cat: 'crypto', id: 'crypto-ofb-mode-generic',
  title: { zh: 'OFB 模式（通用）', en: 'OFB Mode (Generic)' },
  summary: { zh: '密钥流独立于明文。', en: 'Keystream independent of plaintext.' },
  description: { zh: 'OFB(Output Feedback)反复加密反馈寄存器生成密钥流，与明文异或，错误不传播，适合流式。', en: 'OFB repeatedly encrypts a feedback register to form a keystream XORed with plaintext; errors do not propagate.' },
  tags: ['crypto','ofb','mode-of-operation','stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface OfbHooks { onBlock?: (i: number, keystream: number[], out: number[]) => void; }
export function ofbEncrypt(blocks: number[][], iv: number[], e: (b: number[]) => number[], hooks: OfbHooks = {}): number[][] {
  let sr = iv; const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) { sr = e(sr); const o = blocks[i]!.map((v, j) => v ^ sr[j % sr.length]!); hooks.onBlock?.(i, sr, o); out.push(o); }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ofbEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x * 5 + 2) & 0xff);
export const DEFAULT_INPUT: any = { blocks: [[1,2],[3,4]], iv: [7,7] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'OFB', en: 'OFB' }).commit();
  const ct = ofbEncrypt(input.blocks, input.iv, E, {
    onBlock: (i, ks, o) => rec.begin({ zh: '块' + i, en: 'block' }).setAux([{label:'ks',value:ks.join(','),role:'pivot' as BarRole},{label:'out',value:o.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 块', en: ct.length + ' blocks' }).setAux([{label:'blocks',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ofbEncrypt } from '../../src/algorithms/crypto/crypto-ofb-mode-generic/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ofb-mode-generic/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('ofb 确定性', () => { const a = ofbEncrypt([[1,2],[1,2]], [0,0], E); const b = ofbEncrypt([[1,2],[1,2]], [0,0], E); assert.deepEqual(a, b); });
test('ofb trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 20. crypto-ctr-mode
add({
  cat: 'crypto', id: 'crypto-ctr-mode-generic',
  title: { zh: 'CTR 模式（通用）', en: 'CTR Mode (Generic)' },
  summary: { zh: '加密计数器生成密钥流。', en: 'Encrypts a counter as keystream.' },
  description: { zh: 'CTR(Counter)模式加密递增计数器生成密钥流，可并行/预计算，是现代推荐的流式分组模式。', en: 'CTR encrypts an incrementing counter to produce a keystream; parallelizable and precomputable, a modern recommended mode.' },
  tags: ['crypto','ctr','mode-of-operation','stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface CtrHooks { onBlock?: (i: number, counter: number[], out: number[]) => void; }
export function ctrEncrypt(blocks: number[][], nonce: number[], e: (b: number[]) => number[], hooks: CtrHooks = {}): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) { const ctr = [...nonce]; ctr[ctr.length - 1] = (ctr[ctr.length - 1]! + i) & 0xff; const ks = e(ctr); const o = blocks[i]!.map((v, j) => v ^ ks[j % ks.length]!); hooks.onBlock?.(i, ctr, o); out.push(o); }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctrEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x * 7 + 3) & 0xff);
export const DEFAULT_INPUT: any = { blocks: [[1,2],[3,4],[5,6]], nonce: [1,2] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CTR', en: 'CTR' }).commit();
  const ct = ctrEncrypt(input.blocks, input.nonce, E, {
    onBlock: (i, ctr, o) => rec.begin({ zh: '块' + i + ' ctr=[' + ctr.join(',') + ']', en: 'block' }).setAux([{label:'ctr',value:ctr.join(','),role:'pivot' as BarRole},{label:'out',value:o.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: ct.length + ' 块', en: ct.length + ' blocks' }).setAux([{label:'blocks',value:String(ct.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctrEncrypt } from '../../src/algorithms/crypto/crypto-ctr-mode-generic/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ctr-mode-generic/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('ctr 自反', () => { const ct = ctrEncrypt([[5,5]], [0,0], E); const ks = E([0,0]); assert.deepEqual(ct[0], [5^ks[0]!, 5^ks[1]!]); });
test('ctr trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 21-30: hashes/ciphers/misc
add({
  cat: 'crypto', id: 'crypto-peter-pearson',
  title: { zh: 'Peter Pearson 哈希', en: 'Pearson Hash' },
  summary: { zh: '用 256 字节查找表生成 8 位哈希。', en: '8-bit hash via 256-byte table.' },
  description: { zh: 'Pearson 哈希用一张 256 字节随机排列表，逐字节更新哈希，可扩展为 16/32 位，简单快速。', en: 'Pearson hash uses a 256-byte permutation table to fold each byte into an 8-bit hash; extensible to 16/32 bits.' },
  tags: ['crypto','hash','pearson'],
  complexity: { time: 'O(n)', space: 'O(256)' },
  impl: `export interface PhHooks { onByte?: (i: number, h: number) => void; }
const T = Array.from({ length: 256 }, (_, i) => (i * 73 + 11) & 0xff);
export function pearsonHash(data: number[], hooks: PhHooks = {}): number {
  let h = 0; for (let i = 0; i < data.length; i++) { h = T[(h ^ data[i]!) & 0xff]!; hooks.onByte?.(i, h); } return h & 0xff;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pearsonHash } from './impl.ts';
export const DEFAULT_INPUT: any = [72,101,108,108,111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Pearson', en: 'Pearson' }).commit();
  const h = pearsonHash(input, {
    onByte: (i, hh) => rec.begin({ zh: '字节' + i + ' h=' + hh, en: 'byte' }).setAux([{label:'h',value:String(hh),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '哈希 ' + h, en: 'hash ' + h }).setAux([{label:'hash',value:String(h),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pearsonHash } from '../../src/algorithms/crypto/crypto-peter-pearson/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-peter-pearson/trace.ts';
test('pearson 确定性', () => assert.equal(pearsonHash([1,2,3]), pearsonHash([1,2,3]));
test('pearson 0-255', () => assert.ok(pearsonHash([9,9,9]) >= 0 && pearsonHash([9,9,9]) <= 255));
test('pearson trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-fnv1a-32',
  title: { zh: 'FNV-1a 32 位', en: 'FNV-1a 32-bit' },
  summary: { zh: '乘素数再异或的快速哈希。', en: 'XOR-then-multiply fast hash.' },
  description: { zh: 'FNV-1a(Fowler-Noll-Vo)每字节先与哈希异或再乘以 FNV 素数，分布均匀，常用于哈希表与校验。', en: 'FNV-1a XORs each byte then multiplies by the FNV prime; well-distributed, common in hash tables and checksums.' },
  tags: ['crypto','hash','fnv'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface FnvHooks { onByte?: (i: number, h: number) => void; }
const PRIME = 0x01000193;
export function fnv1a32(data: number[], hooks: FnvHooks = {}): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) { h ^= data[i]!; h = Math.imul(h, PRIME) >>> 0; hooks.onByte?.(i, h); }
  return h >>> 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fnv1a32 } from './impl.ts';
export const DEFAULT_INPUT: any = [72,101,108,108,111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'FNV-1a', en: 'FNV-1a' }).commit();
  const h = fnv1a32(input, {
    onByte: (i, hh) => rec.begin({ zh: '字节' + i, en: 'byte' }).setAux([{label:'h',value:hh.toString(16),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '哈希 0x' + h.toString(16), en: 'hash' }).setAux([{label:'hash',value:h.toString(16),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fnv1a32 } from '../../src/algorithms/crypto/crypto-fnv1a-32/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-fnv1a-32/trace.ts';
test('fnv 确定性', () => assert.equal(fnv1a32([1,2,3]), fnv1a32([1,2,3]));
test('fnv 空输入', () => assert.equal(fnv1a32([]), 0x811c9dc5));
test('fnv trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-adler32',
  title: { zh: 'Adler-32 校验', en: 'Adler-32' },
  summary: { zh: 'zlib 用的快速校验和。', en: 'Fast checksum used by zlib.' },
  description: { zh: 'Adler-32 维护两个模 65521 的累加器 s1、s2，比 CRC32 快但弱，zlib 头部使用。', en: 'Adler-32 keeps two accumulators mod 65521 (s1, s2); faster but weaker than CRC32, used in zlib headers.' },
  tags: ['crypto','checksum','adler'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface AdHooks { onByte?: (i: number, s1: number, s2: number) => void; }
export function adler32(data: number[], hooks: AdHooks = {}): number {
  let s1 = 1, s2 = 0;
  for (let i = 0; i < data.length; i++) { s1 = (s1 + data[i]!) % 65521; s2 = (s2 + s1) % 65521; hooks.onByte?.(i, s1, s2); }
  return ((s2 << 16) | s1) >>> 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adler32 } from './impl.ts';
export const DEFAULT_INPUT: any = [87,111,114,108,100];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Adler-32', en: 'Adler-32' }).commit();
  const v = adler32(input, {
    onByte: (i, s1, s2) => rec.begin({ zh: '字节' + i, en: 'byte' }).setAux([{label:'s1',value:String(s1),role:'compare' as BarRole},{label:'s2',value:String(s2),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '0x' + v.toString(16), en: v.toString(16) }).setAux([{label:'adler',value:v.toString(16),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adler32 } from '../../src/algorithms/crypto/crypto-adler32/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-adler32/trace.ts';
test('adler 空输入=1', () => assert.equal(adler32([]), 1));
test('adler 确定性', () => assert.equal(adler32([1,2,3]), adler32([1,2,3]));
test('adler trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-crc16',
  title: { zh: 'CRC-16', en: 'CRC-16' },
  summary: { zh: '16 位循环冗余校验。', en: '16-bit cyclic redundancy check.' },
  description: { zh: 'CRC-16 用 GF(2) 多项式除法生成 16 位校验，广泛用于 Modbus、USB、Bisync 等协议检错。', en: 'CRC-16 produces a 16-bit check via GF(2) polynomial division, widely used in Modbus, USB, and Bisync.' },
  tags: ['crypto','crc','checksum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface Crc16Hooks { onByte?: (i: number, crc: number) => void; }
const POLY = 0xa001;
export function crc16(data: number[], hooks: Crc16Hooks = {}): number {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) { crc ^= data[i]!; for (let b = 0; b < 8; b++) { crc = (crc & 1) ? ((crc >>> 1) ^ POLY) & 0xffff : (crc >>> 1); } hooks.onByte?.(i, crc); }
  return crc & 0xffff;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crc16 } from './impl.ts';
export const DEFAULT_INPUT: any = [1,2,3,4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CRC-16', en: 'CRC-16' }).commit();
  const v = crc16(input, {
    onByte: (i, c) => rec.begin({ zh: '字节' + i, en: 'byte' }).setAux([{label:'crc',value:c.toString(16),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '0x' + v.toString(16), en: v.toString(16) }).setAux([{label:'crc',value:v.toString(16),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc16 } from '../../src/algorithms/crypto/crypto-crc16/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-crc16/trace.ts';
test('crc16 确定性', () => assert.equal(crc16([1,2,3]), crc16([1,2,3])));
test('crc16 0-65535', () => { const v = crc16([9,9,9]); assert.ok(v >= 0 && v <= 65535); });
test('crc16 trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-crc32',
  title: { zh: 'CRC-32', en: 'CRC-32' },
  summary: { zh: '32 位循环冗余校验。', en: '32-bit cyclic redundancy check.' },
  description: { zh: 'CRC-32(IEEE 802.3 多项式 0xEDB88320)广泛用于 ZIP/PNG/Ethernet 帧检错，硬件友好。', en: 'CRC-32 (IEEE 802.3 polynomial) is used in ZIP, PNG, Ethernet frame checks; hardware-friendly.' },
  tags: ['crypto','crc','checksum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface Crc32Hooks { onByte?: (i: number, crc: number) => void; }
const POLY = 0xedb88320;
export function crc32(data: number[], hooks: Crc32Hooks = {}): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) { crc ^= data[i]!; for (let b = 0; b < 8; b++) crc = (crc & 1) ? ((crc >>> 1) ^ POLY) >>> 0 : (crc >>> 1); hooks.onByte?.(i, crc); }
  return (crc ^ 0xffffffff) >>> 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crc32 } from './impl.ts';
export const DEFAULT_INPUT: any = [72,101,108,108,111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CRC-32', en: 'CRC-32' }).commit();
  const v = crc32(input, {
    onByte: (i, c) => rec.begin({ zh: '字节' + i, en: 'byte' }).setAux([{label:'crc',value:c.toString(16),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '0x' + v.toString(16), en: v.toString(16) }).setAux([{label:'crc',value:v.toString(16),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc32 } from '../../src/algorithms/crypto/crypto-crc32/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-crc32/trace.ts';
test('crc32 空输入=0', () => assert.equal(crc32([]), 0));
test('crc32 确定性', () => assert.equal(crc32([1,2,3]), crc32([1,2,3])));
test('crc32 trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-keccak-sponge',
  title: { zh: 'Keccak 海绵结构', en: 'Keccak Sponge' },
  summary: { zh: '吸收-挤压的可变长度哈希。', en: 'Absorb-squeeze variable-length hashing.' },
  description: { zh: 'Keccak 海绵结构先吸收(rate 分块异或+置换)再挤压输出任意长度，是 SHA-3 的基础框架。', en: 'The Keccak sponge absorbs input in rate-sized blocks (XOR + permutation) then squeezes variable-length output; basis of SHA-3.' },
  tags: ['crypto','keccak','sponge','sha3'],
  complexity: { time: 'O(n)', space: 'O(r+c)' },
  impl: `export interface KsHooks { onAbsorb?: (block: number, state: number[]) => void; onSqueeze?: (state: number[]) => void; }
function keccakF(state: number[]): number[] { for (let r = 0; r < 5; r++) for (let i = 0; i < state.length; i++) state[i] = ((state[i]! + r + i) * 0x11) & 0xff; return state; }
export function keccakSponge(data: number[], rate: number, outLen: number, hooks: KsHooks = {}): number[] {
  const state: number[] = new Array(rate).fill(0);
  for (let i = 0; i < data.length; i += rate) { for (let j = 0; j < rate && i + j < data.length; j++) state[j]! ^= data[i + j]!; hooks.onAbsorb?.(i / rate, state); keccakF(state); }
  const out: number[] = state.slice(0, outLen); hooks.onSqueeze?.(state); return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { keccakSponge } from './impl.ts';
export const DEFAULT_INPUT: any = { data: [1,2,3,4,5,6,7,8,9,10], rate: 4, outLen: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Keccak 海绵', en: 'Keccak Sponge' }).commit();
  const out = keccakSponge(input.data, input.rate, input.outLen, {
    onAbsorb: (b, st) => rec.begin({ zh: '吸收块 ' + b, en: 'absorb' }).setAux([{label:'block',value:String(b),role:'compare' as BarRole}]).commit(),
    onSqueeze: (st) => rec.begin({ zh: '挤压', en: 'squeeze' }).setAux([{label:'squeeze',value:'ok',role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' }).setAux([{label:'out',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keccakSponge } from '../../src/algorithms/crypto/crypto-keccak-sponge/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-keccak-sponge/trace.ts';
test('keccak 输出长度', () => assert.equal(keccakSponge([1,2,3], 4, 4).length, 4));
test('keccak trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-cmac',
  title: { zh: 'CMAC 认证码', en: 'CMAC' },
  summary: { zh: '基于分组密码的 MAC。', en: 'MAC based on a block cipher.' },
  description: { zh: 'CMAC(NIST SP 800-38B)用分组密码(AES)和子密钥 K1/K2 对消息认证，末块按是否整块选择子密钥。', en: 'CMAC (NIST SP 800-38B) authenticates a message with a block cipher and subkeys K1/K2, choosing by whether the last block is full.' },
  tags: ['crypto','mac','cmac'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface CmacHooks { onBlock?: (i: number, x: number[]) => void; onTag?: (tag: number[]) => void; }
export function cmacCompute(blocks: number[][], e: (b: number[]) => number[], k1: number[], k2: number[], hooks: CmacHooks = {}): number[] {
  let X = new Array(blocks[0]?.length ?? 4).fill(0);
  for (let i = 0; i < blocks.length - 1; i++) { X = e(blocks[i]!.map((v, j) => v ^ X[j % X.length]!)); hooks.onBlock?.(i, X); }
  const last = blocks[blocks.length - 1]!; const tag = e(last.map((v, j) => v ^ k1[j % k1.length]! ^ X[j % X.length]!)); hooks.onBlock?.(blocks.length - 1, tag); hooks.onTag?.(tag); return tag;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cmacCompute } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x + 7) & 0xff);
export const DEFAULT_INPUT: any = { blocks: [[1,2],[3,4]], k1: [1,1], k2: [2,2] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CMAC', en: 'CMAC' }).commit();
  const tag = cmacCompute(input.blocks, E, input.k1, input.k2, {
    onBlock: (i) => rec.begin({ zh: '块 ' + i, en: 'block' }).setAux([{label:'block',value:String(i),role:'compare' as BarRole}]).commit(),
    onTag: (t) => rec.begin({ zh: 'tag [' + t.join(',') + ']', en: 'tag' }).setAux([{label:'tag',value:t.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cmacCompute } from '../../src/algorithms/crypto/crypto-cmac/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cmac/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('cmac 确定性', () => { const t1 = cmacCompute([[1,2]], E, [0,0],[0,0]); const t2 = cmacCompute([[1,2]], E, [0,0],[0,0]); assert.deepEqual(t1, t2); });
test('cmac trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-poly1305',
  title: { zh: 'Poly1305 MAC', en: 'Poly1305' },
  summary: { zh: '基于模 2^130-5 的一次性 MAC。', en: 'One-time MAC mod 2^130-5.' },
  description: { zh: 'Poly1305(Bernstein)把消息分块视作 17 字节小端整数，对密钥 r 在模 (2^130-5) 下累加并乘以 r，输出 16 字节。', en: 'Poly1305 (Bernstein) treats message blocks as 17-byte little-endian ints, accumulating mod (2^130-5) multiplied by key r; outputs 16 bytes.' },
  tags: ['crypto','mac','poly1305'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface P13Hooks { onBlock?: (i: number, acc: number) => void; }
const P = (1n << 130n) - 5n;
export function poly1305(data: number[], r: bigint, s: bigint, hooks: P13Hooks = {}): number[] {
  let acc = 0n;
  for (let i = 0; i < data.length; i += 16) {
    let n = 1n; for (let j = 0; j < 16 && i + j < data.length; j++) n += BigInt(data[i + j]!) << (8n * BigInt(j));
    acc = ((acc + n) * r) % P; hooks.onBlock?.(i / 16, Number(acc & 0xffffffffn));
  }
  acc = (acc + s) % (1n << 128n);
  const out: number[] = []; for (let j = 0; j < 16; j++) out.push(Number((acc >> (8n * BigInt(j))) & 0xffn));
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { poly1305 } from './impl.ts';
export const DEFAULT_INPUT: any = { data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], r: 0x0000_0000_0000_0000_0000_0000_0000_0003n, s: 0n };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Poly1305', en: 'Poly1305' }).commit();
  const tag = poly1305(input.data, input.r, input.s, {
    onBlock: (i, a) => rec.begin({ zh: '块 ' + i, en: 'block' }).setAux([{label:'block',value:String(i),role:'compare' as BarRole},{label:'acc',value:a.toString(16),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'tag [' + tag.join(',') + ']', en: 'tag' }).setAux([{label:'tag',value:tag.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { poly1305 } from '../../src/algorithms/crypto/crypto-poly1305/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-poly1305/trace.ts';
test('poly1305 16 字节', () => assert.equal(poly1305([1,2,3], 7n, 0n).length, 16));
test('poly1305 确定性', () => assert.deepEqual(poly1305([1,2], 7n, 0n), poly1305([1,2], 7n, 0n)));
test('poly1305 trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-hkdf',
  title: { zh: 'HKDF 密钥派生', en: 'HKDF' },
  summary: { zh: 'HMAC 提取-扩展派生密钥。', en: 'HMAC extract-expand key derivation.' },
  description: { zh: 'HKDF(RFC 5869)先用 HMAC-Extract 把输入密钥材料压缩为伪随机密钥，再用 HMAC-Expand 扩展到任意长度。', en: 'HKDF (RFC 5869) compresses input key material via HMAC-Extract then expands to arbitrary length via HMAC-Expand.' },
  tags: ['crypto','kdf','hkdf','hmac'],
  complexity: { time: 'O(l)', space: 'O(1)' },
  impl: `export interface HkHooks { onBlock?: (i: number, t: number[]) => void; }
function hmac(key: number[], msg: number[]): number[] { const k = key.length ? key : [0]; return msg.map((b, i) => (b ^ k[i % k.length]!) & 0xff).concat(k.slice(0, 4)); }
export function hkdfExpand(prk: number[], info: number[], len: number, hooks: HkHooks = {}): number[] {
  const out: number[] = []; let t: number[] = []; let i = 1;
  while (out.length < len) { t = hmac(prk, [...t, ...info, i]); out.push(...t); hooks.onBlock?.(i, t); i++; }
  return out.slice(0, len);
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hkdfExpand } from './impl.ts';
export const DEFAULT_INPUT: any = { prk: [1,2,3,4], info: [10], len: 16 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'HKDF len=' + input.len, en: 'HKDF' }).commit();
  const out = hkdfExpand(input.prk, input.info, input.len, {
    onBlock: (i, t) => rec.begin({ zh: '块 ' + i, en: 'block' }).setAux([{label:'block',value:String(i),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: out.length + ' 字节', en: out.length + 'B' }).setAux([{label:'len',value:String(out.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hkdfExpand } from '../../src/algorithms/crypto/crypto-hkdf/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-hkdf/trace.ts';
test('hkdf 输出长度', () => assert.equal(hkdfExpand([1,2,3,4], [], 20).length, 20));
test('hkdf trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-pbkdf2',
  title: { zh: 'PBKDF2 密钥派生', en: 'PBKDF2' },
  summary: { zh: '带迭代次数的口令派生。', en: 'Iterated password-based derivation.' },
  description: { zh: 'PBKDF2(RFC 2898)对(口令,盐)反复迭代 HMAC，迭代次数提高暴力破解成本，广泛用于口令存储。', en: 'PBKDF2 (RFC 2898) iterates HMAC over (password, salt) to raise brute-force cost; standard for password storage.' },
  tags: ['crypto','kdf','pbkdf2','password'],
  complexity: { time: 'O(c)', space: 'O(1)' },
  impl: `export interface PbHooks { onIter?: (i: number, u: number[]) => void; }
export function pbkdf2(password: number[], salt: number[], iterations: number, dkLen: number, hooks: PbHooks = {}): number[] {
  const block = (i: number): number[] => { let u = salt.concat([(i >> 24) & 0xff, (i >> 16) & 0xff, (i >> 8) & 0xff, i & 0xff]); let t: number[] = []; for (let it = 0; it < iterations; it++) { u = u.map((b, j) => (b ^ password[j % password.length]!) & 0xff); t = t.map((b, j) => b ^ u[j % u.length]!); if (!t.length) t = [...u]; hooks.onIter?.(it, u); } return t; };
  const out: number[] = []; let i = 1; while (out.length < dkLen) { out.push(...block(i)); i++; } return out.slice(0, dkLen);
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pbkdf2 } from './impl.ts';
export const DEFAULT_INPUT: any = { password: [1,2,3], salt: [9,9,9,9], iterations: 5, dkLen: 8 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PBKDF2 iter=' + input.iterations, en: 'PBKDF2' }).commit();
  const out = pbkdf2(input.password, input.salt, input.iterations, input.dkLen, {
    onIter: (i) => rec.begin({ zh: '迭代 ' + i, en: 'iter' }).setAux([{label:'iter',value:String(i),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: out.length + ' 字节', en: out.length + 'B' }).setAux([{label:'len',value:String(out.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pbkdf2 } from '../../src/algorithms/crypto/crypto-pbkdf2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-pbkdf2/trace.ts';
test('pbkdf2 输出长度', () => assert.equal(pbkdf2([1,2],[9,9,9,9],3,16).length, 16));
test('pbkdf2 trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

add({
  cat: 'crypto', id: 'crypto-trivium',
  title: { zh: 'Trivium 流密码', en: 'Trivium' },
  summary: { zh: 'eSTREAM 硬件友好流密码。', en: 'eSTREAM hardware-friendly stream cipher.' },
  description: { zh: 'Trivium(De Cannière/Preneel)用 3 个互连的 288 位移位寄存器，每轮输出 1 bit，硬件极简速度高。', en: 'Trivium (De Cannière/Preneel) uses 3 interconnected 288-bit shift registers outputting 1 bit per cycle; tiny hardware, high speed.' },
  tags: ['crypto','trivium','stream','hardware'],
  complexity: { time: 'O(n)', space: 'O(288)' },
  impl: `export interface TvHooks { onBit?: (i: number, bit: number) => void; }
export function trivium(key: number[], iv: number[], nBits: number, hooks: TvHooks = {}): number[] {
  const s: number[] = new Array(288).fill(0);
  for (let i = 0; i < 80; i++) s[i] = (key[Math.floor(i / 8)]! >> (i % 8)) & 1;
  for (let i = 0; i < 80; i++) s[93 + i] = (iv[Math.floor(i / 8)]! >> (i % 8)) & 1;
  s[285] = s[286] = s[287] = 1;
  const out: number[] = [];
  for (let i = 0; i < 1152 + nBits; i++) {
    const t1 = s[65]! ^ s[92]!; const t2 = s[161]! ^ s[176]!; const t3 = s[242]! ^ s[287]!;
    if (i >= 1152) { out.push(t1 ^ t2 ^ t3); hooks.onBit?.(i - 1152, t1 ^ t2 ^ t3); }
    const o1 = s[90]! & s[91]!; const o2 = s[174]! & s[175]!; const o3 = s[285]! & s[286]!;
    s.pop(); s.splice(176, 0, (t3 ^ o3) & 1); s.pop(); s.splice(93, 0, (t2 ^ o2) & 1); s.pop(); s.splice(0, 0, (t1 ^ o1) & 1);
  }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trivium } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [0,0,0,0,0,0,0,0,0,1], iv: [0,0,0,0,0,0,0,0,0,0], nBits: 8 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Trivium', en: 'Trivium' }).commit();
  const out = trivium(input.key, input.iv, input.nBits, {
    onBit: (i, b) => rec.begin({ zh: 'bit ' + i + ' = ' + b, en: 'bit' }).setAux([{label:'bit',value:String(b),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: out.length + ' bits', en: out.length + ' bits' }).setAux([{label:'bits',value:String(out.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trivium } from '../../src/algorithms/crypto/crypto-trivium/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-trivium/trace.ts';
test('trivium 输出位数', () => assert.equal(trivium([0,0,0,0,0,0,0,0,0,1], [0,0,0,0,0,0,0,0,0,0], 16).length, 16));
test('trivium bit 为 0/1', () => { for (const b of trivium([1,2,3,4,5,6,7,8,9,10],[0,0,0,0,0,0,0,0,0,0],5)) assert.ok(b === 0 || b === 1); });
test('trivium trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

console.log('crypto specs loaded');
