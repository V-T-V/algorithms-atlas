// crypto data — 23 algorithms (block ciphers, modes, hashes)

export const algos = [
// 1. crypto-aes-gcm
{
  id: 'crypto-aes-gcm',
  titleZh: 'AES-GCM', titleEn: 'AES-GCM',
  summaryZh: 'AES-GCM：认证加密模式，CTR + GHASH 认证。',
  summaryEn: 'AES-GCM: authenticated encryption, CTR mode + GHASH tag.',
  descZh: 'AES-GCM（Galois/Counter Mode）= AES-CTR 加密 + GHASH 多项式认证标签，提供机密性与完整性，是 TLS 1.3 默认 AEAD。',
  descEn: 'AES-GCM (Galois/Counter Mode) = AES-CTR encryption + GHASH polynomial authentication tag, providing confidentiality and integrity; the TLS 1.3 default AEAD.',
  tags: ['crypto','aes','gcm','aead','authenticated'],
  time: 'O(n)', space: 'O(1)',
  impl: `// AES-GCM · 实现（简化：CTR + GHASH over GF(2^128)，自带 toy block cipher）
export interface GcmHooks { onCtr?: (counter: number[], ks: number[]) => void; onGhash?: (acc: bigint) => void; onTag?: (tag: number[]) => void; }
// 自带教学 16 字节块加密（toy：基于密钥的伪随机置换，非真实 AES）
function blockEnc(key: number[], blk: number[]): number[] {
  const out = blk.slice();
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < 16; i++) out[i] = ((out[i]! + key[(i + r) % key.length]! + r * 0x11) ^ (out[i]! << 1)) & 0xff;
    for (let i = 0; i < 16; i++) out[i] = out[i]! ^ out[(i + 7) % 16]!;
  }
  return out;
}
// GF(2^128) 乘法，使用 reversed-bit 表示
function gfMul(x: bigint, y: bigint): bigint {
  const R = 0xe1000000000000000000000000000000n;
  let z = 0n;
  for (let i = 0; i < 128; i++) {
    if ((y >> BigInt(i)) & 1n) z ^= x;
    const lsb = x & 1n;
    x >>= 1n;
    if (lsb) x ^= R;
  }
  return z;
}
function bytesToBig(b: number[]): bigint { let v = 0n; for (const x of b) v = (v << 8n) | BigInt(x); return v; }
function bigToBytes(v: bigint, n: number): number[] { const out: number[] = []; for (let i = n - 1; i >= 0; i--) out.push(Number((v >> BigInt(i * 8)) & 0xffn)); return out; }
export function gcmEncrypt(key: number[], iv: number[], plaintext: number[], aad: number[] = [], hooks: GcmHooks = {}): { ciphertext: number[]; tag: number[] } {
  const H = blockEnc(key, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  const j0 = [...iv, 0, 0, 0, 1];
  const eJ0 = blockEnc(key, j0);
  const ciphertext: number[] = [];
  let counter = j0.slice();
  for (let i = 0; i < plaintext.length; i += 16) {
    for (let k = 15; k >= 12; k--) { counter[k] = (counter[k]! + 1) & 0xff; if (counter[k] !== 0) break; }
    const ks = blockEnc(key, counter);
    hooks.onCtr?.([...counter], ks);
    for (let k = 0; k < 16 && i + k < plaintext.length; k++) ciphertext.push(plaintext[i + k]! ^ ks[k]!);
  }
  let acc = 0n;
  const ghashBlock = (blk: number[]) => { acc ^= bytesToBig(blk); acc = gfMul(acc, bytesToBig(H)); hooks.onGhash?.(acc); };
  for (let i = 0; i < aad.length; i += 16) ghashBlock([...aad.slice(i, i + 16), ...Array(16 - (Math.min(i + 16, aad.length) - i)).fill(0)]);
  for (let i = 0; i < ciphertext.length; i += 16) ghashBlock([...ciphertext.slice(i, i + 16), ...Array(16 - (Math.min(i + 16, ciphertext.length) - i)).fill(0)]);
  ghashBlock([...bigToBytes(BigInt(aad.length) * 8n, 8), ...bigToBytes(BigInt(ciphertext.length) * 8n, 8)]);
  const tagBig = acc ^ bytesToBig(eJ0);
  const tag = bigToBytes(tagBig, 16);
  hooks.onTag?.(tag);
  return { ciphertext, tag };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gcmEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i);
  const iv = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const pt = Array.from({ length: 32 }, (_, i) => (i * 7) & 0xff);
  rec.begin({ zh: 'AES-GCM', en: 'AES-GCM' })
    .setBars(pt.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  gcmEncrypt(key, iv, pt, [], {
    onCtr: (c, ks) => rec.begin({ zh: \`CTR \${c.slice(12,16).map((b)=>b.toString(16).padStart(2,'0')).join('')}\`, en: '' })
      .setBars(ks.map((v) => ({ value: v, role: 'compare' as BarRole }))).commit(),
    onTag: (t) => rec.begin({ zh: '认证标签', en: 'auth tag' })
      .setBars(t.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gcmEncrypt } from '../../src/algorithms/crypto/crypto-aes-gcm/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-aes-gcm/trace.ts';

test('gcm 密文长度 = 明文长度', () => {
  const key = Array.from({ length: 16 }, (_, i) => i);
  const iv = [1,2,3,4,5,6,7,8,9,10,11,12];
  const pt = Array.from({ length: 40 }, (_, i) => i);
  const { ciphertext, tag } = gcmEncrypt(key, iv, pt);
  assert.equal(ciphertext.length, pt.length);
  assert.equal(tag.length, 16);
});
test('gcm 同输入同输出（确定性）', () => {
  const key = Array.from({ length: 16 }, () => 0);
  const iv = [0,0,0,0,0,0,0,0,0,0,0,0];
  const pt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  const a = gcmEncrypt(key, iv, pt);
  const b = gcmEncrypt(key, iv, pt);
  assert.deepEqual(a.ciphertext, b.ciphertext);
  assert.deepEqual(a.tag, b.tag);
});
test('gcm trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 2. crypto-aes-ctr
{
  id: 'crypto-aes-ctr',
  titleZh: 'AES-CTR', titleEn: 'AES-CTR',
  summaryZh: 'AES-CTR：计数器模式，加密 nonce++ 后与明文异或。',
  summaryEn: 'AES-CTR: counter mode, encrypt nonce++ then XOR with plaintext.',
  descZh: 'AES-CTR 把计数器 nonce||counter 作为 AES 输入，生成密钥流与明文异或。流式可并行，加解密相同操作。',
  descEn: 'AES-CTR feeds nonce||counter into AES to produce a keystream XORed with plaintext; streamable, parallelizable, encrypt = decrypt.',
  tags: ['crypto','aes','ctr','stream'],
  time: 'O(n)', space: 'O(1)',
  impl: `// AES-CTR · 实现（自带 toy 块加密）
export interface CtrHooks { onCounter?: (counter: number[]) => void; onStream?: (ks: number[]) => void; }
function blockEnc(key: number[], blk: number[]): number[] {
  const out = blk.slice();
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < 16; i++) out[i] = ((out[i]! + key[(i + r) % key.length]! + r * 0x11) ^ (out[i]! << 1)) & 0xff;
    for (let i = 0; i < 16; i++) out[i] = out[i]! ^ out[(i + 7) % 16]!;
  }
  return out;
}
export function ctrCrypt(key: number[], nonce: number[], data: number[], hooks: CtrHooks = {}): number[] {
  const out: number[] = [];
  const counter = [...nonce];
  for (let i = 0; i < data.length; i += 16) {
    hooks.onCounter?.([...counter]);
    const ks = blockEnc(key, counter);
    hooks.onStream?.(ks);
    for (let k = 0; k < 16 && i + k < data.length; k++) out.push(data[i + k]! ^ ks[k]!);
    for (let k = 15; k >= 0; k--) { counter[k] = (counter[k]! + 1) & 0xff; if (counter[k] !== 0) break; }
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctrCrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const nonce = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
  const pt = Array.from({ length: 48 }, (_, i) => (i * 3) & 0xff);
  rec.begin({ zh: 'AES-CTR', en: 'AES-CTR' })
    .setBars(pt.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ctrCrypt(key, nonce, pt, {
    onStream: (ks) => rec.begin({ zh: '密钥流块', en: 'keystream' })
      .setBars(ks.map((v) => ({ value: v, role: 'compare' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctrCrypt } from '../../src/algorithms/crypto/crypto-aes-ctr/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-aes-ctr/trace.ts';

test('ctr 加密解密互逆', () => {
  const key = Array.from({ length: 16 }, () => 7);
  const nonce = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
  const pt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
  const ct = ctrCrypt(key, nonce, pt);
  const dec = ctrCrypt(key, nonce, ct);
  assert.deepEqual(dec, pt);
});
test('ctr trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 3. crypto-aes-ofb-2
{
  id: 'crypto-aes-ofb-2',
  titleZh: 'AES-OFB v2', titleEn: 'AES-OFB v2',
  summaryZh: 'AES-OFB：输出反馈模式，前一块密钥流作下一块输入。',
  summaryEn: 'AES-OFB: output feedback; previous keystream block feeds next.',
  descZh: 'AES-OFB 用 AES(IV) 生成第一块密钥流，之后每次把上一块密钥流再喂入 AES。错误不扩散，适合噪声信道。',
  descEn: 'AES-OFB uses AES(IV) for the first keystream block then feeds the previous keystream block back into AES; errors do not propagate, suited to noisy channels.',
  tags: ['crypto','aes','ofb','stream'],
  time: 'O(n)', space: 'O(1)',
  impl: `// AES-OFB v2 · 实现（自带 toy 块加密）
export interface OfbHooks { onFeedback?: (fb: number[]) => void; onStream?: (ks: number[]) => void; }
function blockEnc(key: number[], blk: number[]): number[] {
  const out = blk.slice();
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < 16; i++) out[i] = ((out[i]! + key[(i + r) % key.length]! + r * 0x11) ^ (out[i]! << 1)) & 0xff;
    for (let i = 0; i < 16; i++) out[i] = out[i]! ^ out[(i + 7) % 16]!;
  }
  return out;
}
export function ofbCrypt(key: number[], iv: number[], data: number[], hooks: OfbHooks = {}): number[] {
  const out: number[] = [];
  let feedback = [...iv];
  for (let i = 0; i < data.length; i += 16) {
    feedback = blockEnc(key, feedback);
    hooks.onFeedback?.([...feedback]);
    hooks.onStream?.(feedback);
    for (let k = 0; k < 16 && i + k < data.length; k++) out.push(data[i + k]! ^ feedback[k]!);
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ofbCrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const iv = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160];
  const pt = Array.from({ length: 32 }, (_, i) => i);
  rec.begin({ zh: 'AES-OFB', en: 'AES-OFB' })
    .setBars(pt.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ofbCrypt(key, iv, pt, {
    onFeedback: (fb) => rec.begin({ zh: '反馈', en: 'feedback' })
      .setBars(fb.map((v) => ({ value: v, role: 'compare' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ofbCrypt } from '../../src/algorithms/crypto/crypto-aes-ofb-2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-aes-ofb-2/trace.ts';

test('ofb 加密解密互逆', () => {
  const key = Array.from({ length: 16 }, () => 3);
  const iv = Array.from({ length: 16 }, (_, i) => i);
  const pt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  const ct = ofbCrypt(key, iv, pt);
  assert.deepEqual(ofbCrypt(key, iv, ct), pt);
});
test('ofb trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 4. crypto-des-3des
{
  id: 'crypto-des-3des',
  titleZh: 'DES / 3DES', titleEn: 'DES / Triple DES',
  summaryZh: 'DES 16 轮 Feistel；3DES 三次 DES 提升安全。',
  summaryEn: 'DES 16-round Feistel; 3DES applies DES three times for security.',
  descZh: 'DES（IBM/NIST 1977）64 位分组 56 位密钥 16 轮 Feistel。3DES = E(K1)→D(K2)→E(K1) 提升有效密钥长度。',
  descEn: 'DES (IBM/NIST 1977): 64-bit block, 56-bit key, 16-round Feistel. 3DES = E(K1)→D(K2)→E(K1) raises the effective key length.',
  tags: ['crypto','des','3des','feistel','block'],
  time: 'O(n)', space: 'O(1)',
  impl: `// DES / 3DES · 实现（教学版简化轮函数）
export interface DesHooks { onRound?: (round: number, l: number, r: number) => void; }
// 简化 DES：8 位分组，4 轮，纯教学（不是真实 DES）
function feistel8(block: number[], key: number[], rounds: number, decrypt: boolean, hooks?: DesHooks): number[] {
  let l = (block[0]! << 4) | (block[1]! & 0xf);
  let r = ((block[1]! >> 4) & 0xf) | (block[2]! & 0xf0) | block[3]!;
  // 简化：把 32 位拆成两个 16 位半
  void l; void r;
  // 真实教学：用 16 位半字
  let L = ((block[0]! << 8) | block[1]!) & 0xffff;
  let R = ((block[2]! << 8) | block[3]!) & 0xffff;
  const K = (key[0]! << 8) | (key[1] ?? 0);
  for (let i = 0; i < rounds; i++) {
    const rk = decrypt ? (K + (rounds - 1 - i)) & 0xffff : (K + i) & 0xffff;
    const f = ((R * 0x517 + rk) ^ ((R << 3) | (R >>> 13))) & 0xffff;
    const newR = L ^ f;
    L = R; R = newR;
    hooks?.onRound?.(decrypt ? rounds - 1 - i : i, L, R);
  }
  return [(L >>> 8) & 0xff, L & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
export function desEncrypt(key: number[], block: number[], hooks: DesHooks = {}): number[] {
  return feistel8(block, key, 4, false, hooks);
}
export function desDecrypt(key: number[], block: number[], hooks: DesHooks = {}): number[] {
  return feistel8(block, key, 4, true, hooks);
}
export function tripleDesEncrypt(k1: number[], k2: number[], block: number[], hooks: DesHooks = {}): number[] {
  return desEncrypt(k1, desDecrypt(k2, desEncrypt(k1, block, hooks), hooks), hooks);
}
export function tripleDesDecrypt(k1: number[], k2: number[], block: number[], hooks: DesHooks = {}): number[] {
  return desDecrypt(k1, desEncrypt(k2, desDecrypt(k1, block, hooks), hooks), hooks);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { desEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x12, 0x34];
  const block = [0x41, 0x42, 0x43, 0x44];
  rec.begin({ zh: 'DES（教学简化）', en: 'DES (teaching)' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  desEncrypt(key, block, {
    onRound: (r, l, rr) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'L', value: l.toString(16), role: 'compare' as BarRole }, { label: 'R', value: rr.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desEncrypt, desDecrypt, tripleDesEncrypt, tripleDesDecrypt } from '../../src/algorithms/crypto/crypto-des-3des/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-des-3des/trace.ts';

test('des 单分组往返', () => {
  const key = [0x12, 0x34];
  const block = [0x41, 0x42, 0x43, 0x44];
  const ct = desEncrypt(key, block);
  assert.deepEqual(desDecrypt(key, ct), block);
});
test('3des 往返', () => {
  const k1 = [0xab, 0xcd]; const k2 = [0x12, 0x34];
  const block = [0x01, 0x02, 0x03, 0x04];
  const ct = tripleDesEncrypt(k1, k2, block);
  assert.deepEqual(tripleDesDecrypt(k1, k2, ct), block);
});
test('des trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 5. crypto-blowfish-full
{
  id: 'crypto-blowfish-full',
  titleZh: 'Blowfish 完整版', titleEn: 'Blowfish Full',
  summaryZh: 'Blowfish：16 轮 Feistel，密钥相关 S 盒。',
  summaryEn: 'Blowfish: 16-round Feistel with key-dependent S-boxes.',
  descZh: 'Blowfish（Schneier 1993）64 位分组，16 轮 Feistel，P 数组与 S 盒在密钥扩展阶段被改动，对小型分组加密高效。',
  descEn: 'Blowfish (Schneier 1993): 64-bit block, 16-round Feistel whose P-array and S-boxes are mutated during key schedule; efficient for small messages.',
  tags: ['crypto','blowfish','feistel','block'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Blowfish 完整版 · 实现（基于已有 blowfish-schedule）
import { blowfishKeySchedule, blowfishEncrypt } from '../blowfish-schedule/impl.ts';
export interface BfHooks { onEncrypt?: (l: number, r: number) => void; }
export function blowfishEncryptBlock(key: number[], block: number[], hooks: BfHooks = {}): number[] {
  const keyStr = String.fromCharCode(...key.map((b) => b & 0xff));
  const state = blowfishKeySchedule(keyStr);
  const lIn = ((block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!) >>> 0;
  const rIn = ((block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!) >>> 0;
  const { l, r } = blowfishEncrypt(state, lIn, rIn);
  hooks.onEncrypt?.(l, r);
  return [(l >>> 24) & 0xff, (l >>> 16) & 0xff, (l >>> 8) & 0xff, l & 0xff,
          (r >>> 24) & 0xff, (r >>> 16) & 0xff, (r >>> 8) & 0xff, r & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { blowfishEncryptBlock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x23, 0x45, 0x67, 0x89];
  const block = [0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xef];
  rec.begin({ zh: 'Blowfish', en: 'Blowfish' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  blowfishEncryptBlock(key, block, {
    onEncrypt: (l, r) => rec.begin({ zh: '加密结果', en: 'result' })
      .setAux([{ label: 'L', value: l.toString(16), role: 'compare' as BarRole }, { label: 'R', value: r.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blowfishEncryptBlock } from '../../src/algorithms/crypto/crypto-blowfish-full/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-blowfish-full/trace.ts';

test('blowfish full 输出 8 字节', () => {
  const key = [0x01, 0x23, 0x45, 0x67, 0x89];
  const block = [0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xef];
  const ct = blowfishEncryptBlock(key, block);
  assert.equal(ct.length, 8);
});
test('blowfish full 确定性', () => {
  const key = [0xaa, 0xbb];
  const block = [1,2,3,4,5,6,7,8];
  assert.deepEqual(blowfishEncryptBlock(key, block), blowfishEncryptBlock(key, block));
});
test('blowfish full trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 6. crypto-twofish
{
  id: 'crypto-twofish',
  titleZh: 'Twofish', titleEn: 'Twofish',
  summaryZh: 'Twofish：AES 候选，Feistel + 密钥相关 S 盒。',
  summaryEn: 'Twofish: AES finalist, Feistel with key-dependent S-boxes.',
  descZh: 'Twofish（Schneier 等）128 位分组 AES 候选：16 轮 Feistel + 4 个密钥相关 S 盒 + Pseudo-Hadamard 变换。',
  descEn: 'Twofish (Schneier et al.) is a 128-bit-block AES finalist: 16-round Feistel + 4 key-dependent S-boxes + Pseudo-Hadamard transform.',
  tags: ['crypto','twofish','aes-finalist','feistel'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Twofish · 实现（教学极简：4 轮 Feistel 32 位半字）
export interface TfHooks { onRound?: (round: number, l: number, r: number) => void; }
function g(x: number, k: number): number {
  // 简化：4 个字节经 S 盒（依赖 k）+ MDS 风格混合
  const b0 = ((x * 0x9e + k) ^ (x << 3)) & 0xff;
  const b1 = ((x >>> 8) ^ k ^ (x >>> 3)) & 0xff;
  const b2 = ((x + k * 7) ^ (x >>> 5)) & 0xff;
  const b3 = ((x ^ (k << 2)) + 0x5b) & 0xff;
  return (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
}
export function twofishEncrypt(key: number[], block: number[], hooks: TfHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let R0 = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R1 = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let R2 = (block[8]! << 24) | (block[9]! << 16) | (block[10]! << 8) | block[11]!;
  let R3 = (block[12]! << 24) | (block[13]! << 16) | (block[14]! << 8) | block[15]!;
  for (let i = 0; i < 16; i++) {
    const t0 = g(R0, K + i);
    const t1 = g(R1, K + i + 1);
    const f0 = ((t0 + t1 + (((K + i) * 2) >>> 0)) >>> 0) & 0xffffffff;
    const f1 = ((t0 + 2 * t1 + (((K + i + 1) * 3) >>> 0)) >>> 0) & 0xffffffff;
    const newR2 = R2 ^ (f0 >>> 0);
    const newR3 = R3 ^ (f1 >>> 0);
    R0 = newR2; R1 = newR3; R2 = R0; void R2;
    hooks.onRound?.(i, R0, R1);
  }
  // 最终 swap + 输出（简化）
  return [(R0 >>> 24) & 0xff, (R0 >>> 16) & 0xff, (R0 >>> 8) & 0xff, R0 & 0xff,
          (R1 >>> 24) & 0xff, (R1 >>> 16) & 0xff, (R1 >>> 8) & 0xff, R1 & 0xff,
          (R2 >>> 24) & 0xff, (R2 >>> 16) & 0xff, (R2 >>> 8) & 0xff, R2 & 0xff,
          (R3 >>> 24) & 0xff, (R3 >>> 16) & 0xff, (R3 >>> 8) & 0xff, R3 & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twofishEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = Array.from({ length: 16 }, (_, i) => i + 1);
  rec.begin({ zh: 'Twofish', en: 'Twofish' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  twofishEncrypt(key, block, {
    onRound: (r, l, rr) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'R0', value: l.toString(16), role: 'compare' as BarRole }, { label: 'R1', value: rr.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twofishEncrypt } from '../../src/algorithms/crypto/crypto-twofish/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-twofish/trace.ts';

test('twofish 输出 16 字节', () => {
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = Array.from({ length: 16 }, (_, i) => i + 1);
  const ct = twofishEncrypt(key, block);
  assert.equal(ct.length, 16);
});
test('twofish 确定性', () => {
  const key = [1, 2];
  const block = Array.from({ length: 16 }, (_, i) => i);
  assert.deepEqual(twofishEncrypt(key, block), twofishEncrypt(key, block));
});
test('twofish trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 7. crypto-serpent
{
  id: 'crypto-serpent',
  titleZh: 'Serpent', titleEn: 'Serpent',
  summaryZh: 'Serpent：AES 候选，32 轮 SPN，保守安全裕度。',
  summaryEn: 'Serpent: AES finalist, 32-round SPN, conservative security margin.',
  descZh: 'Serpent（Anderson 等）128 位分组，32 轮 SPN，每轮 8 个 4×4 S 盒并行 + 线性变换 + 轮密钥异或。',
  descEn: 'Serpent (Anderson et al.): 128-bit block, 32-round SPN; each round applies 8 parallel 4×4 S-boxes, a linear transform, and a round-key XOR.',
  tags: ['crypto','serpent','aes-finalist','spn'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Serpent · 实现（教学极简：4 轮 SPN 16 位状态）
export interface SpHooks { onRound?: (round: number, state: number) => void; }
const SBOX: number[] = [0x3,0xa,0xd,0xc,0x1,0x2,0x0,0xb,0x7,0x5,0x9,0x4,0x6,0xf,0x8,0xe];
export function serpentEncrypt(key: number[], block: number[], hooks: SpHooks = {}): number[] {
  let state = ((block[0]! << 8) | block[1]!) & 0xffff;
  const K = ((key[0] ?? 0) << 8) | (key[1] ?? 0);
  for (let r = 0; r < 32; r++) {
    state ^= (K + r) & 0xffff;
    // S 盒层：4 个 4-bit 盒
    let s = 0;
    for (let i = 0; i < 4; i++) s |= SBOX[(state >>> (i * 4)) & 0xf]! << (i * 4);
    state = s;
    // 线性变换（旋转）
    state = ((state << 5) | (state >>> 11)) & 0xffff;
    state ^= (state >>> 3) & 0xffff;
    hooks.onRound?.(r, state);
  }
  state ^= K;
  return [(state >>> 8) & 0xff, state & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { serpentEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0xab, 0xcd];
  const block = [0x12, 0x34];
  rec.begin({ zh: 'Serpent', en: 'Serpent' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  serpentEncrypt(key, block, {
    onRound: (r, s) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'state', value: s.toString(16), role: 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serpentEncrypt } from '../../src/algorithms/crypto/crypto-serpent/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-serpent/trace.ts';

test('serpent 输出 2 字节', () => {
  const ct = serpentEncrypt([0xab, 0xcd], [0x12, 0x34]);
  assert.equal(ct.length, 2);
});
test('serpent 确定性', () => {
  assert.deepEqual(serpentEncrypt([1, 2], [3, 4]), serpentEncrypt([1, 2], [3, 4]));
});
test('serpent trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 8. crypto-camellia
{
  id: 'crypto-camellia',
  titleZh: 'Camellia', titleEn: 'Camellia',
  summaryZh: 'Camellia：NTT/Mitsubishi 的 Feistel 分组密码。',
  summaryEn: 'Camellia: NTT/Mitsubishi Feistel block cipher.',
  descZh: 'Camellia（NTT & Mitsubishi）128 位分组 Feistel，与 AES 并列的 CRYPTREC/NESSIE 推荐算法，使用 18/24 轮。',
  descEn: 'Camellia (NTT & Mitsubishi) is a 128-bit-block Feistel cipher recommended by CRYPTREC/NESSIE alongside AES; uses 18/24 rounds.',
  tags: ['crypto','camellia','feistel','block'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Camellia · 实现（教学极简：6 轮 Feistel 32 位半字）
export interface CaHooks { onRound?: (round: number, l: number, r: number) => void; }
function f(x: number, k: number): number {
  // 简化：S 函数 + P 变换
  const s = ((x ^ k) * 0x010101 + 0x63) & 0xffffffff;
  return ((s << 7) | (s >>> 25)) & 0xffffffff;
}
export function camelliaEncrypt(key: number[], block: number[], hooks: CaHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  for (let i = 0; i < 6; i++) {
    const newR = L ^ f(R, K + i);
    L = R; R = newR;
    hooks.onRound?.(i, L, R);
  }
  return [(L >>> 24) & 0xff, (L >>> 16) & 0xff, (L >>> 8) & 0xff, L & 0xff,
          (R >>> 24) & 0xff, (R >>> 16) & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { camelliaEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08];
  rec.begin({ zh: 'Camellia', en: 'Camellia' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  camelliaEncrypt(key, block, {
    onRound: (r, l, rr) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'L', value: l.toString(16), role: 'compare' as BarRole }, { label: 'R', value: rr.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { camelliaEncrypt } from '../../src/algorithms/crypto/crypto-camellia/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-camellia/trace.ts';

test('camellia 输出 8 字节', () => {
  const ct = camelliaEncrypt([1,2,3,4], [1,2,3,4,5,6,7,8]);
  assert.equal(ct.length, 8);
});
test('camellia 确定性', () => {
  assert.deepEqual(camelliaEncrypt([1,2,3,4], [1,2,3,4,5,6,7,8]), camelliaEncrypt([1,2,3,4], [1,2,3,4,5,6,7,8]));
});
test('camellia trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 9. crypto-cast5
{
  id: 'crypto-cast5',
  titleZh: 'CAST-5', titleEn: 'CAST-5',
  summaryZh: 'CAST-5：12/16 轮 Feistel，3 种轮函数。',
  summaryEn: 'CAST-5: 12/16-round Feistel with three round-function types.',
  descZh: 'CAST-5（Adams 1996）64 位分组 Feistel，根据轮次使用三种不同轮函数（含加/减/异或 + 旋转），密钥扩展用 S 盒。',
  descEn: 'CAST-5 (Adams 1996) is a 64-bit-block Feistel cipher using three distinct round functions per round (with add/sub/xor and rotation); key schedule uses S-boxes.',
  tags: ['crypto','cast5','feistel','block'],
  time: 'O(n)', space: 'O(1)',
  impl: `// CAST-5 · 实现（教学简化：4 轮 32 位 Feistel，3 种轮函数）
export interface CastHooks { onRound?: (round: number, type: number, l: number, r: number) => void; }
function rotl(x: number, n: number): number { n &= 31; return ((x << n) | (x >>> (32 - n))) & 0xffffffff; }
function f(x: number, k: number, type: number): number {
  switch (type) {
    case 0: return rotl(((x + k) & 0xffffffff) ^ 0xa5a5a5a5, 7);
    case 1: return rotl((x ^ k) - 0x55555555, 11);
    default: return rotl(((x - k) & 0xffffffff) + 0x33333333, 17);
  }
}
export function cast5Encrypt(key: number[], block: number[], hooks: CastHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  for (let i = 0; i < 12; i++) {
    const type = i % 3;
    const newR = L ^ f(R, K + i * 0x010101, type);
    L = R; R = newR;
    hooks.onRound?.(i, type, L, R);
  }
  return [(L >>> 24) & 0xff, (L >>> 16) & 0xff, (L >>> 8) & 0xff, L & 0xff,
          (R >>> 24) & 0xff, (R >>> 16) & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cast5Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [0x10,0x20,0x30,0x40,0x50,0x60,0x70,0x80];
  rec.begin({ zh: 'CAST-5', en: 'CAST-5' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  cast5Encrypt(key, block, {
    onRound: (r, type, l, rr) => rec.begin({ zh: \`第 \${r} 轮 T\${type}\`, en: \`round \${r} T\${type}\` })
      .setAux([{ label: 'L', value: l.toString(16), role: 'compare' as BarRole }, { label: 'R', value: rr.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cast5Encrypt } from '../../src/algorithms/crypto/crypto-cast5/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cast5/trace.ts';

test('cast5 输出 8 字节', () => {
  const ct = cast5Encrypt([1,2,3,4], [1,2,3,4,5,6,7,8]);
  assert.equal(ct.length, 8);
});
test('cast5 确定性', () => {
  assert.deepEqual(cast5Encrypt([1,2,3,4], [1,2,3,4,5,6,7,8]), cast5Encrypt([1,2,3,4], [1,2,3,4,5,6,7,8]));
});
test('cast5 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 10. crypto-idea
{
  id: 'crypto-idea',
  titleZh: 'IDEA', titleEn: 'IDEA',
  summaryZh: 'IDEA：8.5 轮，混合模 2^16 加/乘/异或。',
  summaryEn: 'IDEA: 8.5 rounds mixing mod-2^16 add/mul/xor.',
  descZh: 'IDEA（Lai & Massey 1991）64 位分组，8 轮 + 输出变换，三种运算（模 2^16 加、模 2^16+1 乘、异或）混合提供安全。',
  descEn: 'IDEA (Lai & Massey 1991) is a 64-bit-block cipher: 8 rounds + output transform, mixing three operations (mod-2^16 add, mod-2^16+1 mul, xor) for security.',
  tags: ['crypto','idea','block','group-ops'],
  time: 'O(n)', space: 'O(1)',
  impl: `// IDEA · 实现（教学简化：模 2^16 运算 + 4 轮）
export interface IdeaHooks { onRound?: (round: number, vals: number[]) => void; }
function mulMod(a: number, b: number): number {
  if (a === 0) a = 0x10000;
  if (b === 0) b = 0x10000;
  const r = (a * b) % 0x10001;
  return r === 0x10000 ? 0 : r & 0xffff;
}
function addMod(a: number, b: number): number { return (a + b) & 0xffff; }
export function ideaEncrypt(key: number[], block: number[], hooks: IdeaHooks = {}): number[] {
  const K: number[] = [];
  for (let i = 0; i < 8; i++) K.push(((key[i * 2] ?? 0) << 8) | (key[i * 2 + 1] ?? 0));
  let [x1, x2, x3, x4] = [(block[0]! << 8) | block[1]!, (block[2]! << 8) | block[3]!, (block[4]! << 8) | block[5]!, (block[6]! << 8) | block[7]!];
  for (let r = 0; r < 4; r++) {
    const k = K.slice((r * 6) % 8, (r * 6) % 8 + 6); while (k.length < 6) k.push(K[(r * 6 + k.length) % 8]!);
    x1 = mulMod(x1, k[0]!);
    x2 = addMod(x2, k[1]!);
    x3 = addMod(x3, k[2]!);
    x4 = mulMod(x4, k[3]!);
    const s1 = x1 ^ x3;
    const s2 = x2 ^ x4;
    const t1 = mulMod(s1, k[4]!);
    const t2 = addMod(s2, t1);
    const t3 = mulMod(t2, k[5]!);
    const t4 = addMod(t1, t3);
    x1 ^= t3; x2 ^= t4; x3 ^= t3; x4 ^= t4;
    [x2, x3] = [x3, x2];
    hooks.onRound?.(r, [x1, x2, x3, x4]);
  }
  return [(x1 >>> 8) & 0xff, x1 & 0xff, (x2 >>> 8) & 0xff, x2 & 0xff, (x3 >>> 8) & 0xff, x3 & 0xff, (x4 >>> 8) & 0xff, x4 & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ideaEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x10,0x20,0x30,0x40,0x50,0x60,0x70,0x80];
  rec.begin({ zh: 'IDEA', en: 'IDEA' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ideaEncrypt(key, block, {
    onRound: (r, vals) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setBars(vals.map((v) => ({ value: v, role: 'compare' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ideaEncrypt } from '../../src/algorithms/crypto/crypto-idea/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-idea/trace.ts';

test('idea 输出 8 字节', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const ct = ideaEncrypt(key, [1,2,3,4,5,6,7,8]);
  assert.equal(ct.length, 8);
});
test('idea 确定性', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  assert.deepEqual(ideaEncrypt(key, [1,2,3,4,5,6,7,8]), ideaEncrypt(key, [1,2,3,4,5,6,7,8]));
});
test('idea trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 11. crypto-mars
{
  id: 'crypto-mars',
  titleZh: 'MARS', titleEn: 'MARS',
  summaryZh: 'MARS：IBM AES 候选，分层结构（前向/核心/后向）。',
  summaryEn: 'MARS: IBM AES finalist with layered structure (forward/core/backward).',
  descZh: 'MARS（IBM）128 位分组 AES 候选，分 4 层：密钥加 + 8 轮前向混合 + 16 轮核心 + 8 轮后向混合 + 密钥加。',
  descEn: 'MARS (IBM) is a 128-bit-block AES finalist with 4 layers: key-add + 8 forward-mix rounds + 16 core rounds + 8 backward-mix rounds + key-add.',
  tags: ['crypto','mars','aes-finalist','layered'],
  time: 'O(n)', space: 'O(1)',
  impl: `// MARS · 实现（教学极简：8 轮核心 32 位字）
export interface MarsHooks { onRound?: (round: number, val: number) => void; }
export function marsEncrypt(key: number[], block: number[], hooks: MarsHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let A = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let B = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let C = (block[8]! << 24) | (block[9]! << 16) | (block[10]! << 8) | block[11]!;
  let D = (block[12]! << 24) | (block[13]! << 16) | (block[14]! << 8) | block[15]!;
  A = (A + K) >>> 0;
  for (let r = 0; r < 8; r++) {
    const f = (((A * 0x5bd1e995) ^ (A >>> 13)) + r * K) >>> 0;
    D = ((D ^ f) + r) >>> 0;
    [A, B, C, D] = [B, C, D, A];
    hooks.onRound?.(r, D);
  }
  D = (D - K) >>> 0;
  return [(A >>> 24) & 0xff, (A >>> 16) & 0xff, (A >>> 8) & 0xff, A & 0xff,
          (B >>> 24) & 0xff, (B >>> 16) & 0xff, (B >>> 8) & 0xff, B & 0xff,
          (C >>> 24) & 0xff, (C >>> 16) & 0xff, (C >>> 8) & 0xff, C & 0xff,
          (D >>> 24) & 0xff, (D >>> 16) & 0xff, (D >>> 8) & 0xff, D & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { marsEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = Array.from({ length: 16 }, (_, i) => i + 1);
  rec.begin({ zh: 'MARS', en: 'MARS' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  marsEncrypt(key, block, {
    onRound: (r, v) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'D', value: v.toString(16), role: 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { marsEncrypt } from '../../src/algorithms/crypto/crypto-mars/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-mars/trace.ts';

test('mars 输出 16 字节', () => {
  const ct = marsEncrypt([1,2,3,4], Array.from({ length: 16 }, (_, i) => i + 1));
  assert.equal(ct.length, 16);
});
test('mars 确定性', () => {
  assert.deepEqual(marsEncrypt([1,2,3,4], Array.from({ length: 16 }, (_, i) => i + 1)),
                   marsEncrypt([1,2,3,4], Array.from({ length: 16 }, (_, i) => i + 1)));
});
test('mars trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 12. crypto-rc5
{
  id: 'crypto-rc5',
  titleZh: 'RC5', titleEn: 'RC5',
  summaryZh: 'RC5：Rivest 的参数化 Feistel，加法 + 数据依赖旋转。',
  summaryEn: 'RC5: Rivest parameterized Feistel with addition + data-dependent rotation.',
  descZh: 'RC5（Rivest 1994）参数化（w/r/b）分组密码，运算仅加法、异或、数据依赖旋转；适合软硬件。',
  descEn: 'RC5 (Rivest 1994) is a parameterized (w/r/b) Feistel cipher using only addition, xor, and data-dependent rotation; well-suited to hardware and software.',
  tags: ['crypto','rc5','feistel','rotation'],
  time: 'O(n)', space: 'O(1)',
  impl: `// RC5 · 实现（w=16, r=4 简化版）
export interface Rc5Hooks { onRound?: (round: number, a: number, b: number) => void; }
function rotl16(x: number, n: number): number { n &= 15; return ((x << n) | (x >>> (16 - n))) & 0xffff; }
export function rc5KeyExpand(key: number[], r: number): number[] {
  // 简化魔数常量（w=16）
  const P = 0xb7e1; const Q = 0x9e37;
  const L: number[] = [];
  for (let i = 0; i < key.length; i += 2) L.push(((key[i] ?? 0) << 8) | (key[i + 1] ?? 0));
  if (L.length === 0) L.push(0);
  const S: number[] = [P];
  for (let i = 1; i < 2 * (r + 1); i++) S.push((S[i - 1]! + Q) & 0xffff);
  let i = 0; let j = 0; let A = 0; let B = 0;
  const n = Math.max(8, 3 * Math.max(S.length, L.length));
  for (let k = 0; k < n; k++) {
    S[i] = rotl16((S[i]! + A + B) & 0xffff, 3); A = S[i]!;
    L[j] = rotl16((L[j]! + A + B) & 0xffff, (A + B) & 15); B = L[j]!;
    i = (i + 1) % S.length; j = (j + 1) % L.length;
  }
  return S;
}
export function rc5Encrypt(key: number[], block: number[], r: number = 4, hooks: Rc5Hooks = {}): number[] {
  const S = rc5KeyExpand(key, r);
  let A = ((block[0]! << 8) | block[1]!);
  let B = ((block[2]! << 8) | block[3]!);
  A = (A + S[0]!) & 0xffff;
  B = (B + S[1]!) & 0xffff;
  for (let i = 1; i <= r; i++) {
    A = (rotl16(A ^ B, B) + S[2 * i]!) & 0xffff;
    B = (rotl16(B ^ A, A) + S[2 * i + 1]!) & 0xffff;
    hooks.onRound?.(i, A, B);
  }
  return [(A >>> 8) & 0xff, A & 0xff, (B >>> 8) & 0xff, B & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc5Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x23, 0x45, 0x67];
  const block = [0x12, 0x34, 0x56, 0x78];
  rec.begin({ zh: 'RC5', en: 'RC5' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  rc5Encrypt(key, block, 4, {
    onRound: (r, a, b) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'A', value: a.toString(16), role: 'compare' as BarRole }, { label: 'B', value: b.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc5Encrypt, rc5KeyExpand } from '../../src/algorithms/crypto/crypto-rc5/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-rc5/trace.ts';

test('rc5 输出 4 字节', () => {
  const ct = rc5Encrypt([0x01, 0x23, 0x45, 0x67], [0x12, 0x34, 0x56, 0x78]);
  assert.equal(ct.length, 4);
});
test('rc5 密钥扩展长度正确', () => {
  const S = rc5KeyExpand([1, 2, 3, 4], 4);
  assert.equal(S.length, 10);
});
test('rc5 确定性', () => {
  assert.deepEqual(rc5Encrypt([1,2,3,4], [5,6,7,8]), rc5Encrypt([1,2,3,4], [5,6,7,8]));
});
test('rc5 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 13. crypto-rc6
{
  id: 'crypto-rc6',
  titleZh: 'RC6', titleEn: 'RC6',
  summaryZh: 'RC6：RC6 加入乘法运算与 4 个寄存器。',
  summaryEn: 'RC6: extends RC5 with multiplication and 4 working registers.',
  descZh: 'RC6（Rivest 等）AES 候选，在 RC5 基础上引入乘法（用于旋转量）并使用 4 个 32 位寄存器 A,B,C,D。',
  descEn: 'RC6 (Rivest et al.) is an AES finalist extending RC5 with multiplication (for rotation amounts) and four 32-bit registers A,B,C,D.',
  tags: ['crypto','rc6','aes-finalist','rotation'],
  time: 'O(n)', space: 'O(1)',
  impl: `// RC6 · 实现（w=16, r=4 简化版）
export interface Rc6Hooks { onRound?: (round: number, a: number, b: number, c: number, d: number) => void; }
function rotl16(x: number, n: number): number { n &= 15; return ((x << n) | (x >>> (16 - n))) & 0xffff; }
function mul16(x: number, y: number): number { return (x * y) & 0xffff; }
export function rc6Encrypt(key: number[], block: number[], r: number = 4, hooks: Rc6Hooks = {}): number[] {
  const P = 0xb7e1; const Q = 0x9e37;
  const S: number[] = [P];
  for (let i = 1; i < 2 * r + 4; i++) S.push((S[i - 1]! + Q) & 0xffff);
  let A = (block[0]! << 8) | block[1]!;
  let B = (block[2]! << 8) | block[3]!;
  let C = (block[4]! << 8) | block[5]!;
  let D = (block[6]! << 8) | block[7]!;
  void key;
  B = (B + S[0]!) & 0xffff; D = (D + S[1]!) & 0xffff;
  for (let i = 1; i <= r; i++) {
    const t = rotl16(mul16(B, 2 * B + 1), 4) & 0xffff;
    const u = rotl16(mul16(D, 2 * D + 1), 4) & 0xffff;
    A = rotl16(A ^ t, u) & 0xffff;
    C = rotl16(C ^ u, t) & 0xffff;
    [A, B, C, D] = [B, C, D, A];
    hooks.onRound?.(i, A, B, C, D);
  }
  B = (B + S[2 * r + 2]!) & 0xffff; D = (D + S[2 * r + 3]!) & 0xffff;
  return [(A >>> 8) & 0xff, A & 0xff, (B >>> 8) & 0xff, B & 0xff,
          (C >>> 8) & 0xff, C & 0xff, (D >>> 8) & 0xff, D & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc6Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0];
  rec.begin({ zh: 'RC6', en: 'RC6' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  rc6Encrypt(key, block, 4, {
    onRound: (rr, a, b, c, d) => rec.begin({ zh: \`第 \${rr} 轮\`, en: \`round \${rr}\` })
      .setAux([{ label: 'A', value: a.toString(16), role: 'compare' as BarRole }, { label: 'C', value: c.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc6Encrypt } from '../../src/algorithms/crypto/crypto-rc6/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-rc6/trace.ts';

test('rc6 输出 8 字节', () => {
  const ct = rc6Encrypt([1,2,3,4], [1,2,3,4,5,6,7,8]);
  assert.equal(ct.length, 8);
});
test('rc6 确定性', () => {
  assert.deepEqual(rc6Encrypt([1,2,3,4], [1,2,3,4,5,6,7,8]), rc6Encrypt([1,2,3,4], [1,2,3,4,5,6,7,8]));
});
test('rc6 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 14. crypto-seed
{
  id: 'crypto-seed',
  titleZh: 'SEED', titleEn: 'SEED',
  summaryZh: 'SEED：韩国 KISA 标准 16 轮 Feistel。',
  summaryEn: 'SEED: Korean KISA-standard 16-round Feistel.',
  descZh: 'SEED（KISA 1998）128 位分组 16 轮 Feistel，使用两个 8×8 S 盒与加法/异或混合轮函数。',
  descEn: 'SEED (KISA 1998) is a 128-bit-block 16-round Feistel using two 8×8 S-boxes and an add/xor-mixed round function.',
  tags: ['crypto','seed','feistel','kisa'],
  time: 'O(n)', space: 'O(1)',
  impl: `// SEED · 实现（教学极简：4 轮 32 位 Feistel）
export interface SeedHooks { onRound?: (round: number, l: number, r: number) => void; }
const SS1: number[] = Array.from({ length: 256 }, (_, i) => ((i * 0x5d + 0x1b) & 0xff) ^ ((i << 2) & 0xff));
const SS2: number[] = Array.from({ length: 256 }, (_, i) => ((i * 0x7b + 0x33) & 0xff) ^ ((i >>> 3) & 0xff));
function g(x: number): number { return (SS1[x & 0xff]! << 8) | SS2[(x >>> 8) & 0xff]!; }
export function seedEncrypt(key: number[], block: number[], hooks: SeedHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  for (let i = 0; i < 16; i++) {
    const t = g(R ^ (K + i * 0x101));
    const newR = L ^ (((t * 0x10001) ^ ((t << 7) | (t >>> 25))) & 0xffffffff);
    L = R; R = newR;
    hooks.onRound?.(i, L, R);
  }
  return [(L >>> 24) & 0xff, (L >>> 16) & 0xff, (L >>> 8) & 0xff, L & 0xff,
          (R >>> 24) & 0xff, (R >>> 16) & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { seedEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [1,2,3,4,5,6,7,8];
  rec.begin({ zh: 'SEED', en: 'SEED' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  seedEncrypt(key, block, {
    onRound: (r, l, rr) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'L', value: l.toString(16), role: 'compare' as BarRole }, { label: 'R', value: rr.toString(16), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedEncrypt } from '../../src/algorithms/crypto/crypto-seed/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-seed/trace.ts';

test('seed 输出 8 字节', () => {
  const ct = seedEncrypt([1,2,3,4], [1,2,3,4,5,6,7,8]);
  assert.equal(ct.length, 8);
});
test('seed 确定性', () => {
  assert.deepEqual(seedEncrypt([1,2,3,4], [1,2,3,4,5,6,7,8]), seedEncrypt([1,2,3,4], [1,2,3,4,5,6,7,8]));
});
test('seed trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 15. crypto-skipjack
{
  id: 'crypto-skipjack',
  titleZh: 'Skipjack', titleEn: 'Skipjack',
  summaryZh: 'Skipjack：NSA 设计 80 位密钥 32 轮，A/B 两类规则。',
  summaryEn: 'Skipjack: NSA-designed 80-bit-key 32-round cipher with Rule A/B.',
  descZh: 'Skipjack（NSA，Clipper 芯片）80 位密钥，64 位分组，32 轮交替使用 Rule A（加密）与 Rule B（解密）。',
  descEn: 'Skipjack (NSA, Clipper chip): 80-bit key, 64-bit block, 32 rounds alternating Rule A (encrypt) and Rule B (decrypt).',
  tags: ['crypto','skipjack','nsa','block'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Skipjack · 实现（教学：Rule A 32 轮 16 位子字）
export interface SkipHooks { onRound?: (round: number, w: number[]) => void; }
const F: number[] = Array.from({ length: 256 }, (_, i) => ((i * 0x1f + 0x63) ^ (i << 2) ^ (i >>> 5)) & 0xff);
export function skipjackEncrypt(key: number[], block: number[], hooks: SkipHooks = {}): number[] {
  // 80-bit key → 10 字节，扩展为 20 个 16-bit 子密钥（简化循环）
  const K: number[] = [];
  for (let i = 0; i < 10; i++) K.push(((key[i] ?? 0) << 8) | (key[(i + 1) % 10] ?? 0));
  let w0 = (block[0]! << 8) | block[1]!;
  let w1 = (block[2]! << 8) | block[3]!;
  let w2 = (block[4]! << 8) | block[5]!;
  let w3 = (block[6]! << 8) | block[7]!;
  for (let r = 0; r < 32; r++) {
    const k1 = K[(r * 2) % 10]!; const k2 = K[(r * 2 + 1) % 10]!;
    const t = w0;
    w0 = (F[(w0 & 0xff)]! ^ ((w0 >>> 8) & 0xff) ^ (k1 & 0xff) ^ (w1 & 0xff)) & 0xff;
    w0 = ((w0 << 8) | ((F[(t >>> 8) & 0xff]! ^ (k2 & 0xff)) & 0xff)) & 0xffff;
    w0 = (w0 ^ w1) & 0xffff;
    [w0, w1, w2, w3] = [w1, w2, w3, w0];
    hooks.onRound?.(r, [w0, w1, w2, w3]);
  }
  return [(w0 >>> 8) & 0xff, w0 & 0xff, (w1 >>> 8) & 0xff, w1 & 0xff,
          (w2 >>> 8) & 0xff, w2 & 0xff, (w3 >>> 8) & 0xff, w3 & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { skipjackEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 10 }, (_, i) => i + 1);
  const block = [1,2,3,4,5,6,7,8];
  rec.begin({ zh: 'Skipjack', en: 'Skipjack' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  skipjackEncrypt(key, block, {
    onRound: (r, w) => rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setBars(w.map((v) => ({ value: v, role: 'compare' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skipjackEncrypt } from '../../src/algorithms/crypto/crypto-skipjack/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-skipjack/trace.ts';

test('skipjack 输出 8 字节', () => {
  const key = Array.from({ length: 10 }, (_, i) => i + 1);
  const ct = skipjackEncrypt(key, [1,2,3,4,5,6,7,8]);
  assert.equal(ct.length, 8);
});
test('skipjack 确定性', () => {
  const key = Array.from({ length: 10 }, (_, i) => i + 1);
  assert.deepEqual(skipjackEncrypt(key, [1,2,3,4,5,6,7,8]), skipjackEncrypt(key, [1,2,3,4,5,6,7,8]));
});
test('skipjack trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 16. crypto-tea-full
{
  id: 'crypto-tea-full',
  titleZh: 'TEA 完整版', titleEn: 'TEA Full',
  summaryZh: 'TEA：32 轮 Feistel，加法 + 移位 + delta 常量。',
  summaryEn: 'TEA: 32-round Feistel with add + shift + delta constant.',
  descZh: 'TEA（Wheeler & Needham 1994）64 位分组 128 位密钥，32 轮（= 64 周期），每轮加法+移位+密钥相加，使用 delta=0x9E3779B9 黄金分割常量。',
  descEn: 'TEA (Wheeler & Needham 1994): 64-bit block, 128-bit key, 32 rounds (= 64 cycles); each round uses add+shift+key-add with delta=0x9E3779B9 (golden ratio).',
  tags: ['crypto','tea','feistel','block'],
  time: 'O(n)', space: 'O(1)',
  impl: `// TEA 完整版 · 实现（标准 32 轮）
export interface TeaHooks { onRound?: (round: number, v0: number, v1: number) => void; }
const DELTA = 0x9e3779b9;
export function teaEncrypt(key: number[], block: number[], hooks: TeaHooks = {}): number[] {
  const K = [((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0),
             ((key[4] ?? 0) << 24) | ((key[5] ?? 0) << 16) | ((key[6] ?? 0) << 8) | (key[7] ?? 0),
             ((key[8] ?? 0) << 24) | ((key[9] ?? 0) << 16) | ((key[10] ?? 0) << 8) | (key[11] ?? 0),
             ((key[12] ?? 0) << 24) | ((key[13] ?? 0) << 16) | ((key[14] ?? 0) << 8) | (key[15] ?? 0)];
  let v0 = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let v1 = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let sum = 0;
  for (let i = 0; i < 32; i++) {
    sum = (sum + DELTA) >>> 0;
    v0 = (v0 + (((v1 << 4) + K[0]!) ^ (v1 + sum) ^ ((v1 >>> 5) + K[1]!))) >>> 0;
    v1 = (v1 + (((v0 << 4) + K[2]!) ^ (v0 + sum) ^ ((v0 >>> 5) + K[3]!))) >>> 0;
    hooks.onRound?.(i, v0, v1);
  }
  return [(v0 >>> 24) & 0xff, (v0 >>> 16) & 0xff, (v0 >>> 8) & 0xff, v0 & 0xff,
          (v1 >>> 24) & 0xff, (v1 >>> 16) & 0xff, (v1 >>> 8) & 0xff, v1 & 0xff];
}
export function teaDecrypt(key: number[], block: number[], hooks: TeaHooks = {}): number[] {
  const K = [((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0),
             ((key[4] ?? 0) << 24) | ((key[5] ?? 0) << 16) | ((key[6] ?? 0) << 8) | (key[7] ?? 0),
             ((key[8] ?? 0) << 24) | ((key[9] ?? 0) << 16) | ((key[10] ?? 0) << 8) | (key[11] ?? 0),
             ((key[12] ?? 0) << 24) | ((key[13] ?? 0) << 16) | ((key[14] ?? 0) << 8) | (key[15] ?? 0)];
  let v0 = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let v1 = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let sum = (DELTA * 32) >>> 0;
  for (let i = 0; i < 32; i++) {
    v1 = (v1 - (((v0 << 4) + K[2]!) ^ (v0 + sum) ^ ((v0 >>> 5) + K[3]!))) >>> 0;
    v0 = (v0 - (((v1 << 4) + K[0]!) ^ (v1 + sum) ^ ((v1 >>> 5) + K[1]!))) >>> 0;
    sum = (sum - DELTA) >>> 0;
    hooks.onRound?.(i, v0, v1);
  }
  return [(v0 >>> 24) & 0xff, (v0 >>> 16) & 0xff, (v0 >>> 8) & 0xff, v0 & 0xff,
          (v1 >>> 24) & 0xff, (v1 >>> 16) & 0xff, (v1 >>> 8) & 0xff, v1 & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { teaEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xef];
  rec.begin({ zh: 'TEA 完整版', en: 'TEA full' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  teaEncrypt(key, block, {
    onRound: (r, v0, v1) => { if (r % 8 === 0) rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'v0', value: v0.toString(16), role: 'compare' as BarRole }, { label: 'v1', value: v1.toString(16), role: 'final' as BarRole }]).commit(); },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { teaEncrypt, teaDecrypt } from '../../src/algorithms/crypto/crypto-tea-full/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-tea-full/trace.ts';

test('tea 往返一致', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xef];
  const ct = teaEncrypt(key, block);
  assert.deepEqual(teaDecrypt(key, ct), block);
});
test('tea 确定性', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [1,2,3,4,5,6,7,8];
  assert.deepEqual(teaEncrypt(key, block), teaEncrypt(key, block));
});
test('tea trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 17. crypto-gost
{
  id: 'crypto-gost',
  titleZh: 'GOST 28147', titleEn: 'GOST 28147',
  summaryZh: 'GOST：俄罗斯标准 32 轮 Feistel，S 盒可由用户定义。',
  summaryEn: 'GOST: Russian standard 32-round Feistel with user-supplied S-boxes.',
  descZh: 'GOST 28147-89（苏联/俄罗斯标准）64 位分组 256 位密钥 32 轮 Feistel，使用 8 个 4×4 S 盒（可选密钥相关 S 盒）。',
  descEn: 'GOST 28147-89 (Soviet/Russian standard) is a 64-bit-block 256-bit-key 32-round Feistel using eight 4×4 S-boxes (optionally key-dependent).',
  tags: ['crypto','gost','feistel','russian'],
  time: 'O(n)', space: 'O(1)',
  impl: `// GOST 28147 · 实现（教学简化：8 轮 16 位状态，4 个 4-bit S 盒）
export interface GostHooks { onRound?: (round: number, l: number, r: number) => void; }
const SBOX: number[][] = [
  [4,10,9,2,13,8,0,14,6,11,1,12,7,15,5,3].map((x) => x & 0xf),
  [14,11,4,12,6,13,15,10,2,3,8,1,0,7,5,9].map((x) => x & 0xf),
  [5,8,1,13,10,3,4,2,14,15,12,7,6,0,9,11].map((x) => x & 0xf),
  [7,13,10,1,0,8,9,15,14,4,6,12,11,2,5,3].map((x) => x & 0xf),
];
export function gostEncrypt(key: number[], block: number[], hooks: GostHooks = {}): number[] {
  let L = (block[0]! << 8) | block[1]!;
  let R = (block[2]! << 8) | block[3]!;
  const K: number[] = [];
  for (let i = 0; i < 8; i++) K.push(((key[i * 2] ?? 0) << 8) | (key[i * 2 + 1] ?? 0));
  for (let r = 0; r < 32; r++) {
    const k = K[r % 8]! << 11; // 简化：移位代替 32 位加
    let s = ((R + k) & 0xffff) >>> 0;
    // 4 个 4-bit S 盒
    let out = 0;
    for (let i = 0; i < 4; i++) out |= SBOX[i]![(s >>> (i * 4)) & 0xf]! << (i * 4);
    s = ((out << 11) | (out >>> 5)) & 0xffff; // 16 位旋转
    const newR = L ^ s; L = R; R = newR;
    hooks.onRound?.(r, L, R);
  }
  return [(L >>> 8) & 0xff, L & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gostEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x12, 0x34, 0x56, 0x78];
  rec.begin({ zh: 'GOST 28147', en: 'GOST 28147' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  gostEncrypt(key, block, {
    onRound: (r, l, rr) => { if (r % 4 === 0) rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'L', value: l.toString(16), role: 'compare' as BarRole }, { label: 'R', value: rr.toString(16), role: 'final' as BarRole }]).commit(); },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gostEncrypt } from '../../src/algorithms/crypto/crypto-gost/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-gost/trace.ts';

test('gost 输出 4 字节', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const ct = gostEncrypt(key, [0x12, 0x34, 0x56, 0x78]);
  assert.equal(ct.length, 4);
});
test('gost 确定性', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  assert.deepEqual(gostEncrypt(key, [1,2,3,4]), gostEncrypt(key, [1,2,3,4]));
});
test('gost trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 18. crypto-shacal
{
  id: 'crypto-shacal',
  titleZh: 'SHACAL', titleEn: 'SHACAL',
  summaryZh: 'SHACAL：把 SHA-1 当分组密码（密钥=消息）。',
  summaryEn: 'SHACAL: SHA-1 used as a block cipher (key = message).',
  descZh: 'SHACAL-1（Handschuh & Naccache）把 SHA-1 的压缩函数当作分组密码：160 位状态作明文，512 位消息块作密钥，反向运行 SHA-1 round 函数解密。',
  descEn: 'SHACAL-1 (Handschuh & Naccache) treats the SHA-1 compression function as a block cipher: the 160-bit state is the plaintext, the 512-bit message block is the key, decryption runs the SHA-1 round function in reverse.',
  tags: ['crypto','shacal','sha1','block','neessie'],
  time: 'O(1)', space: 'O(1)',
  impl: `// SHACAL-1 · 实现（80 轮）
export interface ShacalHooks { onRound?: (round: number, a: number, b: number, c: number, d: number, e: number) => void; }
function rotl(x: number, n: number): number { n &= 31; return ((x << n) | (x >>> (32 - n))) >>> 0; }
export function shacal1Encrypt(key: number[], block: number[], hooks: ShacalHooks = {}): number[] {
  // key = 16 个 32 位字 (512 bit)
  const W: number[] = [];
  for (let i = 0; i < 16; i++) W.push(((key[i * 4] ?? 0) << 24) | ((key[i * 4 + 1] ?? 0) << 16) | ((key[i * 4 + 2] ?? 0) << 8) | (key[i * 4 + 3] ?? 0));
  for (let i = 16; i < 80; i++) W.push(rotl(W[i - 3]! ^ W[i - 8]! ^ W[i - 14]! ^ W[i - 16]!, 1));
  let [a, b, c, d, e] = [
    (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!,
    (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!,
    (block[8]! << 24) | (block[9]! << 16) | (block[10]! << 8) | block[11]!,
    (block[12]! << 24) | (block[13]! << 16) | (block[14]! << 8) | block[15]!,
    (block[16]! << 24) | (block[17]! << 16) | (block[18]! << 8) | block[19]!,
  ];
  for (let i = 0; i < 80; i++) {
    let f: number; let k: number;
    if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
    else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
    else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
    else { f = b ^ c ^ d; k = 0xca62c1d6; }
    const t = (rotl(a, 5) + f + e + k + W[i]!) >>> 0;
    e = d; d = c; c = rotl(b, 30); b = a; a = t;
    hooks.onRound?.(i, a, b, c, d, e);
  }
  return [(a >>> 24) & 0xff, (a >>> 16) & 0xff, (a >>> 8) & 0xff, a & 0xff,
          (b >>> 24) & 0xff, (b >>> 16) & 0xff, (b >>> 8) & 0xff, b & 0xff,
          (c >>> 24) & 0xff, (c >>> 16) & 0xff, (c >>> 8) & 0xff, c & 0xff,
          (d >>> 24) & 0xff, (d >>> 16) & 0xff, (d >>> 8) & 0xff, d & 0xff,
          (e >>> 24) & 0xff, (e >>> 16) & 0xff, (e >>> 8) & 0xff, e & 0xff];
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shacal1Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 64 }, (_, i) => i + 1);
  const block = Array.from({ length: 20 }, (_, i) => i + 1);
  rec.begin({ zh: 'SHACAL-1', en: 'SHACAL-1' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  shacal1Encrypt(key, block, {
    onRound: (r, a, b, c, d, e) => { if (r % 20 === 0) rec.begin({ zh: \`第 \${r} 轮\`, en: \`round \${r}\` })
      .setAux([{ label: 'A', value: a.toString(16), role: 'compare' as BarRole }, { label: 'E', value: e.toString(16), role: 'final' as BarRole }]).commit(); },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shacal1Encrypt } from '../../src/algorithms/crypto/crypto-shacal/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-shacal/trace.ts';

test('shacal 输出 20 字节', () => {
  const key = Array.from({ length: 64 }, (_, i) => i + 1);
  const block = Array.from({ length: 20 }, (_, i) => i + 1);
  const ct = shacal1Encrypt(key, block);
  assert.equal(ct.length, 20);
});
test('shacal 确定性', () => {
  const key = Array.from({ length: 64 }, (_, i) => i + 1);
  const block = Array.from({ length: 20 }, (_, i) => i + 1);
  assert.deepEqual(shacal1Encrypt(key, block), shacal1Encrypt(key, block));
});
test('shacal trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 19. crypto-md2
{
  id: 'crypto-md2',
  titleZh: 'MD2', titleEn: 'MD2',
  summaryZh: 'MD2：Rivest 8 位哈希，针对 8 位机优化。',
  summaryEn: 'MD2: Rivest 8-bit hash optimized for 8-bit machines.',
  descZh: 'MD2（Rivest 1989）字节级哈希，使用 256 字节伪随机 S 盒（π）与 48 字节状态 X/A/C，针对 8 位机优化。',
  descEn: 'MD2 (Rivest 1989) is a byte-level hash using a 256-byte pseudorandom S-box (π) and 48-byte state X/A/C; optimized for 8-bit machines.',
  tags: ['crypto','md2','hash','8-bit'],
  time: 'O(n)', space: 'O(1)',
  impl: `// MD2 · 实现（教学：48 字节状态 + π S 盒）
export interface Md2Hooks { onUpdate?: (round: number, x: number[]) => void; onResult?: (hash: number[]) => void; }
const PI: number[] = [
  41,46,67,201,162,216,124,1,61,54,84,161,236,240,6,19,
  98,167,5,243,192,199,115,140,152,147,43,217,188,76,130,202,
  30,155,87,60,253,212,224,22,103,66,111,24,138,23,229,18,
  190,78,196,214,218,158,222,73,160,251,245,142,187,47,238,122,
  169,104,121,145,21,178,7,63,148,194,16,137,11,34,95,33,
  128,127,93,154,90,144,50,39,53,62,204,231,191,247,151,3,
  255,25,48,179,72,165,181,209,215,94,146,42,172,86,170,198,
  79,184,56,210,150,164,125,182,118,252,107,226,156,116,4,241,
  69,157,112,89,100,113,135,32,134,91,207,101,230,45,168,2,
  27,96,37,173,174,176,185,246,28,70,97,105,52,64,126,15,
  66,108,68,150,221,5,163,159,71,244,75,81,117,36,159,83,
  92,189,191,114,244,219,141,51,149,4,248,195,40,97,193,20,
  9,108,53,156,58,55,44,12,88,104,230,65,13,210,30,141,
  88,21,8,112,35,177,85,57,191,210,118,10,191,95,96,120,
  170,69,110,144,57,139,28,222,63,127,238,99,80,165,1,229,
  247,114,141,8,55,75,68,244,165,210,95,81,49,218,164,213,
];
// （注：教学 S 盒非真实 MD2，仅为可重复伪随机替代）
export function md2(data: number[], hooks: Md2Hooks = {}): number[] {
  // padding to multiple of 16, then checksum 16 bytes
  const pad = 16 - (data.length % 16);
  const padded = [...data, ...Array(pad).fill(pad)];
  const checksum = new Array<number>(16).fill(0);
  let l = 0;
  for (let i = 0; i < padded.length; i += 16) {
    for (let j = 0; j < 16; j++) {
      padded[i + j] = padded[i + j]! ^ l;
      l = PI[padded[i + j]!]!;
      checksum[j] = checksum[j]! ^ l;
    }
  }
  const state = [...padded, ...checksum];
  const X = new Array<number>(48).fill(0);
  for (let blk = 0; blk < state.length; blk += 16) {
    for (let j = 0; j < 16; j++) X[16 + j] = state[blk + j]!;
    for (let j = 0; j < 16; j++) X[32 + j] = X[16 + j]! ^ X[j]!;
    let t = 0;
    for (let j = 0; j < 18; j++) {
      for (let k = 0; k < 48; k++) { X[k] = X[k]! ^ PI[t]!; t = X[k]!; }
      t = (t + j) & 0xff;
    }
    hooks.onUpdate?.(blk / 16, [...X.slice(0, 16)]);
  }
  const hash = X.slice(0, 16);
  hooks.onResult?.(hash);
  return hash;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { md2 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('hello', (c) => c.charCodeAt(0));
  rec.begin({ zh: 'MD2', en: 'MD2' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  md2(data, {
    onUpdate: (r, x) => rec.begin({ zh: \`块 \${r}\`, en: \`block \${r}\` })
      .setBars(x.map((v) => ({ value: v, role: 'compare' as BarRole }))).commit(),
    onResult: (h) => rec.begin({ zh: '哈希', en: 'hash' })
      .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { md2 } from '../../src/algorithms/crypto/crypto-md2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-md2/trace.ts';

test('md2 输出 16 字节', () => {
  assert.equal(md2([1, 2, 3]).length, 16);
});
test('md2 雪崩效应', () => {
  const a = md2([1, 2, 3]);
  const b = md2([1, 2, 4]);
  let diff = 0;
  for (let i = 0; i < 16; i++) if (a[i] !== b[i]) diff++;
  assert.ok(diff > 0);
});
test('md2 确定性', () => {
  assert.deepEqual(md2([1, 2, 3]), md2([1, 2, 3]));
});
test('md2 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 20. crypto-md4
{
  id: 'crypto-md4',
  titleZh: 'MD4', titleEn: 'MD4',
  summaryZh: 'MD4：Rivest 128 位哈希，3 轮 16 步。',
  summaryEn: 'MD4: Rivest 128-bit hash, 3 rounds of 16 steps.',
  descZh: 'MD4（Rivest 1990）128 位哈希，3 轮 × 16 步，使用 F/G/H 布尔函数与模 2^32 加法。MD5/SHA 系列的基础。',
  descEn: 'MD4 (Rivest 1990) is a 128-bit hash with 3 rounds × 16 steps using F/G/H Boolean functions and mod-2^32 addition; basis for MD5/SHA family.',
  tags: ['crypto','md4','hash','merkle-damgard'],
  time: 'O(n)', space: 'O(1)',
  impl: `// MD4 · 实现
export interface Md4Hooks { onRound?: (round: number, a: number, b: number, c: number, d: number) => void; onResult?: (hash: number[]) => void; }
function rotl(x: number, n: number): number { n &= 31; return ((x << n) | (x >>> (32 - n))) >>> 0; }
export function md4(data: number[], hooks: Md4Hooks = {}): number[] {
  const padding = [0x80, ...Array.from({ length: 64 }, () => 0)];
  const origLen = data.length;
  const padded = [...data, ...padding];
  const totalBits = origLen * 8;
  let len = padded.length;
  while (len % 64 !== 56) { padded.push(0); len++; }
  padded.push(totalBits & 0xff, (totalBits >>> 8) & 0xff, (totalBits >>> 16) & 0xff, (totalBits >>> 24) & 0xff);
  padded.push(0, 0, 0, 0);
  let [A, B, C, D] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  for (let blk = 0; blk < padded.length; blk += 64) {
    const X: number[] = [];
    for (let i = 0; i < 16; i++) X.push((padded[blk + i * 4]! | (padded[blk + i * 4 + 1]! << 8) | (padded[blk + i * 4 + 2]! << 16) | (padded[blk + i * 4 + 3]! << 24)) >>> 0);
    const [AA, BB, CC, DD] = [A, B, C, D];
    const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
    const G = (x: number, y: number, z: number) => (x & y) | (x & z) | (y & z);
    const H = (x: number, y: number, z: number) => x ^ y ^ z;
    const r1 = (a: number, b: number, c: number, d: number, k: number, s: number) => rotl((a + F(b, c, d) + X[k]!) >>> 0, s);
    const r2 = (a: number, b: number, c: number, d: number, k: number, s: number) => rotl((a + G(b, c, d) + X[k]! + 0x5a827999) >>> 0, s);
    const r3 = (a: number, b: number, c: number, d: number, k: number, s: number) => rotl((a + H(b, c, d) + X[k]! + 0x6ed9eba1) >>> 0, s);
    [A, B, C, D] = [r1(A,B,C,D,0,3), r1(D,A,B,C,1,7), r1(C,D,A,B,2,11), r1(B,C,D,A,3,19),
                    r1(A,B,C,D,4,3), r1(D,A,B,C,5,7), r1(C,D,A,B,6,11), r1(B,C,D,A,7,19),
                    r1(A,B,C,D,8,3), r1(D,A,B,C,9,7), r1(C,D,A,B,10,11), r1(B,C,D,A,11,19),
                    r1(A,B,C,D,12,3), r1(D,A,B,C,13,7), r1(C,D,A,B,14,11), r1(B,C,D,A,15,19)];
    [A, B, C, D] = [r2(A,B,C,D,0,3), r2(D,A,B,C,4,5), r2(C,D,A,B,8,9), r2(B,C,D,A,12,13),
                    r2(A,B,C,D,1,3), r2(D,A,B,C,5,5), r2(C,D,A,B,9,9), r2(B,C,D,A,13,13),
                    r2(A,B,C,D,2,3), r2(D,A,B,C,6,5), r2(C,D,A,B,10,9), r2(B,C,D,A,14,13),
                    r2(A,B,C,D,3,3), r2(D,A,B,C,7,5), r2(C,D,A,B,11,9), r2(B,C,D,A,15,13)];
    [A, B, C, D] = [r3(A,B,C,D,0,3), r3(D,A,B,C,8,9), r3(C,D,A,B,4,11), r3(B,C,D,A,12,15),
                    r3(A,B,C,D,2,3), r3(D,A,B,C,10,9), r3(C,D,A,B,6,11), r3(B,C,D,A,14,15),
                    r3(A,B,C,D,1,3), r3(D,A,B,C,9,9), r3(C,D,A,B,5,11), r3(B,C,D,A,13,15),
                    r3(A,B,C,D,3,3), r3(D,A,B,C,11,9), r3(C,D,A,B,7,11), r3(B,C,D,A,15,15)];
    A = (A + AA) >>> 0; B = (B + BB) >>> 0; C = (C + CC) >>> 0; D = (D + DD) >>> 0;
    hooks.onRound?.(blk / 64, A, B, C, D);
  }
  const out: number[] = [];
  for (const v of [A, B, C, D]) { out.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff); }
  hooks.onResult?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { md4 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('abc', (c) => c.charCodeAt(0));
  rec.begin({ zh: 'MD4', en: 'MD4' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  md4(data, {
    onResult: (h) => rec.begin({ zh: '哈希', en: 'hash' })
      .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { md4 } from '../../src/algorithms/crypto/crypto-md4/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-md4/trace.ts';

test('md4("abc") 已知值', () => {
  // RFC 1320 测试向量: MD4("abc") = a448017aaf21d8525fc10ae87aa6729d
  const h = md4([97, 98, 99]).map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.equal(h, 'a448017aaf21d8525fc10ae87aa6729d');
});
test('md4 空串已知值', () => {
  // MD4("") = 31d6cfe0d16ae931b73c59d7e0c089c0
  const h = md4([]).map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.equal(h, '31d6cfe0d16ae931b73c59d7e0c089c0');
});
test('md4 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 21. crypto-ripemd160
{
  id: 'crypto-ripemd160',
  titleZh: 'RIPEMD-160', titleEn: 'RIPEMD-160',
  summaryZh: 'RIPEMD-160：双并行 MD4 风格 160 位哈希。',
  summaryEn: 'RIPEMD-160: dual parallel MD4-style 160-bit hash.',
  descZh: 'RIPEMD-160（Dobbertin 等 1996）两条并行 MD4 改进链（左/右各 5 轮 16 步）后合并，输出 160 位。',
  descEn: 'RIPEMD-160 (Dobbertin et al. 1996) runs two parallel MD4-improved chains (left/right, each 5 rounds × 16 steps) and combines them to produce 160 bits.',
  tags: ['crypto','ripemd','hash','parallel'],
  time: 'O(n)', space: 'O(1)',
  impl: `// RIPEMD-160 · 实现
export interface RmHooks { onResult?: (hash: number[]) => void; }
function rotl(x: number, n: number): number { n &= 31; return ((x << n) | (x >>> (32 - n))) >>> 0; }
const F = (x: number, y: number, z: number) => x ^ y ^ z;
const G = (x: number, y: number, z: number) => (x & y) | (~x & z);
const H = (x: number, y: number, z: number) => (x | ~y) ^ z;
const I = (x: number, y: number, z: number) => (x & z) | (y & ~z);
const J = (x: number, y: number, z: number) => x ^ (y | ~z);
const RL = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
const RR = [5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
const SL = [11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
const SR = [8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];
const KL = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
const KR = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];
export function ripemd160(data: number[], hooks: RmHooks = {}): number[] {
  const origBits = data.length * 8;
  const padded = [...data, 0x80];
  while (padded.length % 64 !== 56) padded.push(0);
  padded.push(origBits & 0xff, (origBits >>> 8) & 0xff, (origBits >>> 16) & 0xff, (origBits >>> 24) & 0xff, 0, 0, 0, 0);
  let [al, bl, cl, dl, el] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  for (let blk = 0; blk < padded.length; blk += 64) {
    const X: number[] = [];
    for (let i = 0; i < 16; i++) X.push((padded[blk + i * 4]! | (padded[blk + i * 4 + 1]! << 8) | (padded[blk + i * 4 + 2]! << 16) | (padded[blk + i * 4 + 3]! << 24)) >>> 0);
    let [aL, bL, cL, dL, eL] = [al, bl, cl, dl, el];
    let [aR, bR, cR, dR, eR] = [al, bl, cl, dl, el];
    const fLs = [F, G, H, I, J];
    const fRs = [J, I, H, G, F];
    for (let j = 0; j < 80; j++) {
      const round = Math.floor(j / 16);
      const tL = (aL + fLs[round]!(bL, cL, dL) + X[RL[j]!]! + KL[round]!) >>> 0;
      aL = eL; eL = dL; dL = cL; cL = bL; bL = (bL + rotl(tL, SL[j]!)) >>> 0;
      const tR = (aR + fRs[round]!(bR, cR, dR) + X[RR[j]!]! + KR[round]!) >>> 0;
      aR = eR; eR = dR; dR = cR; cR = bR; bR = (bR + rotl(tR, SR[j]!)) >>> 0;
    }
    const t = (el + cR + dl) >>> 0;
    el = (dl + dR + cL) >>> 0; dl = (cl + eR + bL) >>> 0; cl = (bl + aR + aL) >>> 0; bl = (al + bR + eL) >>> 0; al = t;
  }
  const out: number[] = [];
  for (const v of [al, bl, cl, dl, el]) { out.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff); }
  hooks.onResult?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ripemd160 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('abc', (c) => c.charCodeAt(0));
  rec.begin({ zh: 'RIPEMD-160', en: 'RIPEMD-160' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  ripemd160(data, {
    onResult: (h) => rec.begin({ zh: '哈希', en: 'hash' })
      .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ripemd160 } from '../../src/algorithms/crypto/crypto-ripemd160/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ripemd160/trace.ts';

test('ripemd160("abc") 已知值', () => {
  // RIPEMD-160("abc") = 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
  const h = ripemd160([97, 98, 99]).map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.equal(h, '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc');
});
test('ripemd160("") 已知值', () => {
  // RIPEMD-160("") = 9c1185a5c5e9fc54612808977ee8f548b2258d31
  const h = ripemd160([]).map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.equal(h, '9c1185a5c5e9fc54612808977ee8f548b2258d31');
});
test('ripemd160 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 22. crypto-whirlpool
{
  id: 'crypto-whirlpool',
  titleZh: 'Whirlpool', titleEn: 'Whirlpool',
  summaryZh: 'Whirlpool：NESSIE 推荐的 512 位海绵/分组哈希。',
  summaryEn: 'Whirlpool: NESSIE-recommended 512-bit sponge/block hash.',
  descZh: 'Whirlpool（Barreto & Rijmen 2000）基于 8×8 字节状态 + 类 AES S 盒 + MixRows/ShiftColumns 的 10 轮变换，输出 512 位。',
  descEn: 'Whirlpool (Barreto & Rijmen 2000) uses an 8×8 byte state with AES-like S-box and MixRows/ShiftColumns in a 10-round transform; outputs 512 bits.',
  tags: ['crypto','whirlpool','hash','nessie','512-bit'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Whirlpool · 实现（教学简化：8 轮 16 字节状态）
export interface WhHooks { onRound?: (round: number, state: number[]) => void; onResult?: (hash: number[]) => void; }
const SBOX: number[] = Array.from({ length: 256 }, (_, i) => ((i * 0x1b + 0x63) ^ ((i << 3) | (i >>> 5))) & 0xff);
export function whirlpool(data: number[], hooks: WhHooks = {}): number[] {
  // padding
  const padded = [...data, 0x80];
  while (padded.length % 32 !== 24) padded.push(0);
  const bits = data.length * 8;
  padded.push((bits >>> 24) & 0xff, (bits >>> 16) & 0xff, (bits >>> 8) & 0xff, bits & 0xff, 0, 0, 0, 0);
  let H = new Array<number>(32).fill(0);
  for (let blk = 0; blk < padded.length; blk += 32) {
    let state = new Array<number>(32);
    for (let i = 0; i < 32; i++) state[i] = padded[blk + i]! ^ H[i]!;
    for (let r = 0; r < 10; r++) {
      // SubBytes
      state = state.map((b) => SBOX[b]!);
      // Shift（简化：旋转每 4 字节）
      for (let row = 0; row < 8; row++) {
        const off = row * 4;
        const tmp = state.slice(off, off + 4);
        for (let c = 0; c < 4; c++) state[off + c] = tmp[(c + row) % 4]!;
      }
      // MixRows（简化：GF(2^8) 风格异或链）
      for (let row = 0; row < 8; row++) {
        const off = row * 4;
        const t = state[off]!;
        for (let c = 0; c < 3; c++) state[off + c] = state[off + c + 1]!;
        state[off + 3] = t;
      }
      // AddRoundKey（H 作密钥）
      state = state.map((b, i) => b ^ H[i % 32]! ^ (r * 0x11));
      hooks.onRound?.(r, [...state]);
    }
    H = H.map((h, i) => h ^ padded[blk + i]! ^ state[i]!);
  }
  // 取前 32 字节（256 位，简化版）
  const hash = H.slice(0, 32);
  hooks.onResult?.(hash);
  return hash;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { whirlpool } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('hello', (c) => c.charCodeAt(0));
  rec.begin({ zh: 'Whirlpool（简化）', en: 'Whirlpool (simplified)' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  whirlpool(data, {
    onResult: (h) => rec.begin({ zh: '哈希', en: 'hash' })
      .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whirlpool } from '../../src/algorithms/crypto/crypto-whirlpool/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-whirlpool/trace.ts';

test('whirlpool 输出 32 字节', () => {
  assert.equal(whirlpool([1, 2, 3]).length, 32);
});
test('whirlpool 确定性', () => {
  assert.deepEqual(whirlpool([1, 2, 3]), whirlpool([1, 2, 3]));
});
test('whirlpool 雪崩', () => {
  const a = whirlpool([1, 2, 3]);
  const b = whirlpool([1, 2, 4]);
  assert.ok(a.some((v, i) => v !== b[i]));
});
test('whirlpool trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 23. crypto-shake128
{
  id: 'crypto-shake128',
  titleZh: 'SHAKE128', titleEn: 'SHAKE128',
  summaryZh: 'SHAKE128：基于 Keccak 的可扩展输出函数（XOF）。',
  summaryEn: 'SHAKE128: Keccak-based extendable output function (XOF).',
  descZh: 'SHAKE128（NIST FIPS 202）基于 Keccak-f[1600] 海绵结构，输出长度任意。capacity=256 位，rate=1344 位。',
  descEn: 'SHAKE128 (NIST FIPS 202) is a Keccak-f[1600] sponge with arbitrary output length; capacity = 256 bits, rate = 1344 bits.',
  tags: ['crypto','shake','keccak','xof','sponge'],
  time: 'O(n + out)', space: 'O(1)',
  impl: `// SHAKE128 · 实现（自带教学 sponge：toy 置换 + rate=32 capacity=32）
export interface ShakeHooks { onAbsorb?: (block: number[]) => void; onSqueeze?: (out: number[]) => void; }
// toy 64 字节状态置换（非真实 Keccak-f，仅为可重复伪随机）
function permute(state: number[]): void {
  const S = state.slice();
  for (let r = 0; r < 12; r++) {
    for (let i = 0; i < 64; i++) state[i] = ((S[i]! + S[(i + 7) % 64]!) ^ (S[(i + 21) % 64]! << 1)) & 0xff;
    for (let i = 0; i < 64; i++) state[i] = state[i]! ^ ((i * 0x1f + r * 0x3b) & 0xff);
    for (let i = 0; i < 64; i++) { const j = (i * 5 + r) % 64; state[i] = state[i]! ^ state[j]!; }
    S.splice(0, 64, ...state);
  }
}
export function shake128(data: number[], outLen: number, hooks: ShakeHooks = {}): number[] {
  const rate = 32; // 简化：rate=32 字节（真实 SHAKE128=168）
  // padding：0x1F (SHAKE 域分隔) + 0x80 末位
  const padded = [...data, 0x1f];
  while (padded.length % rate !== rate - 1) padded.push(0);
  padded.push(0x80);
  const state = new Array<number>(64).fill(0);
  for (let i = 0; i < padded.length; i += rate) {
    for (let k = 0; k < rate; k++) state[k] = state[k]! ^ padded[i + k]!;
    hooks.onAbsorb?.(padded.slice(i, i + rate));
    permute(state);
  }
  const out: number[] = [];
  while (out.length < outLen) {
    const chunk = state.slice(0, Math.min(rate, outLen - out.length));
    hooks.onSqueeze?.(chunk);
    out.push(...chunk);
    if (out.length < outLen) permute(state);
  }
  return out.slice(0, outLen);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shake128 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('hello', (c) => c.charCodeAt(0));
  rec.begin({ zh: 'SHAKE128', en: 'SHAKE128' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  shake128(data, 32, {
    onSqueeze: (out) => rec.begin({ zh: '输出', en: 'output' })
      .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shake128 } from '../../src/algorithms/crypto/crypto-shake128/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-shake128/trace.ts';

test('shake128 任意长度输出', () => {
  assert.equal(shake128([1, 2, 3], 16).length, 16);
  assert.equal(shake128([1, 2, 3], 64).length, 64);
});
test('shake128 确定性', () => {
  assert.deepEqual(shake128([1, 2, 3], 32), shake128([1, 2, 3], 32));
});
test('shake128 雪崩', () => {
  const a = shake128([1, 2, 3], 32);
  const b = shake128([1, 2, 4], 32);
  assert.ok(a.some((v, i) => v !== b[i]));
});
test('shake128 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

];
