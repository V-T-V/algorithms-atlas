// hashing extra - 1 algorithm to reach 100
export const algos = [
{
  id: 'hash-murmur-finalizer',
  titleZh: 'Murmur 终结子', titleEn: 'Murmur Finalizer',
  summaryZh: 'Murmur3 fmix32 雪崩函数：三次异或-乘法混合，将弱散列打乱为均匀分布。',
  summaryEn: 'Murmur3 fmix32 avalanche: three xor-multiply mixes turn weak hashes into uniform distribution.',
  descZh: 'fmix32：h^=h>>>16; h*=0x85ebca6b; h^=h>>>13; h*=0xc2b2ae35; h^=h>>>16。常用于哈希后置处理提升雪崩。',
  descEn: 'fmix32: h^=h>>>16; h*=0x85ebca6b; h^=h>>>13; h*=0xc2b2ae35; h^=h>>>16. Post-mix to improve avalanche.',
  tags: ['hashing','avalanche','finalizer'],
  time: 'O(1)', space: 'O(1)',
  impl: `// Murmur Finalizer (fmix32) · 实现
export interface MfHooks { onStep?: (step: string, h: number) => void; onConclude?: (hash: number) => void; }
export function murmurFinalizer(h: number, hooks: MfHooks = {}): number {
  let x = h >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); hooks.onStep?.('mix1', x >>> 0);
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); hooks.onStep?.('mix2', x >>> 0);
  x ^= x >>> 16; hooks.onStep?.('final', x >>> 0);
  hooks.onConclude?.(x >>> 0);
  return x >>> 0;
}
export function avalancheScore(hooks: MfHooks = {}): number {
  let diff = 0;
  for (let i = 0; i < 32; i++) {
    const a = murmurFinalizer(0, hooks), b = murmurFinalizer(1 << i, hooks);
    let d = 0, x = a ^ b; while (x) { d += x & 1; x >>>= 1; } diff += d;
  }
  return diff / 32;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { murmurFinalizer, avalancheScore } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const seed = 0x12345678;
  rec.begin({ zh: \`fmix32 seed=0x\${seed.toString(16)}\`, en: \`fmix32 seed=0x\${seed.toString(16)}\` }).commit();
  const out = murmurFinalizer(seed, {
    onStep: (s, h) => rec.begin({ zh: \`\${s}: 0x\${h.toString(16)}\`, en: \`\${s}: 0x\${h.toString(16)}\` })
      .setAux([{ label: s, value: '0x' + h.toString(16), role: 'pivot' as BarRole }]).commit(),
  });
  const av = avalancheScore();
  rec.begin({ zh: \`hash=0x\${out.toString(16)} 雪崩=\${av.toFixed(1)}位\`, en: \`hash=0x\${out.toString(16)} avalanche=\${av.toFixed(1)}bits\` })
    .setAux([{ label: 'hash', value: '0x' + out.toString(16), role: 'final' as BarRole }, { label: 'avalanche', value: av.toFixed(1), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { murmurFinalizer, avalancheScore } from '../../src/algorithms/hashing/hash-murmur-finalizer/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-murmur-finalizer/trace.ts';
test('fmix32 确定性', () => {
  assert.equal(murmurFinalizer(42), murmurFinalizer(42));
});
test('雪崩分数接近 16 位', () => {
  assert.ok(avalancheScore() > 14);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
];
