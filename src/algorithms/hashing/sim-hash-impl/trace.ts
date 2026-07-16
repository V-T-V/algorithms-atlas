// =============================================================================
// SimHash 文档指纹 · 录制帧序列
// 处理两份文档，展示累加器演化与最终指纹；setAux 展示汉明距离。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simHash, hammingDistance, fingerprintToString, type SimHashHooks } from './impl.ts';

export const DEFAULT_INPUT: { docA: string; docB: string; bits: number } = {
  docA: 'the quick brown fox jumps over the lazy dog',
  docB: 'the quick brown fox jumps over a lazy cat',
  bits: 16,
};

function renderAccum(accum: number[], maxAbs: number): { values: number[]; roles: BarRole[] } {
  const values = accum.map((v) => v);
  const roles: BarRole[] = accum.map((v) => {
    if (v > 0) return 'frontier';
    if (v < 0) return 'compare';
    return 'default';
  });
  void maxAbs;
  return { values, roles };
}

function renderFingerprint(fp: number[]): { values: number[]; roles: BarRole[] } {
  return {
    values: fp,
    roles: fp.map((b) => (b === 1 ? 'final' : 'default') as BarRole),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { docA, docB, bits } = input;

  rec
    .begin({
      zh: `两份文档对比（指纹位宽 ${bits}）：\nA="${docA}"\nB="${docB}"`,
      en: `Two documents compared (fingerprint width ${bits}):\nA="${docA}"\nB="${docB}"`,
    })
    .setAux([
      { label: '位宽 bits', value: String(bits), role: 'pivot' as BarRole },
      { label: '阶段', value: '处理文档 A', role: 'frontier' as BarRole },
    ])
    .commit();

  // —— 处理文档 A ——
  const hooksA: SimHashHooks = {
    onFeature: (feat, weight, hash, accum) => {
      const { values, roles } = renderAccum(accum, 0);
      rec
        .begin({
          zh: `A · 特征 "${feat}"（权重 ${weight}，哈希 0x${hash.toString(16)}）：各位 ± 加权累加`,
          en: `A · feature "${feat}" (weight ${weight}, hash 0x${hash.toString(16)}): ± weighted accumulation per bit`,
        })
        .setArray(values, roles, [])
        .setAux([
          { label: '当前特征', value: feat, role: 'pivot' as BarRole },
          { label: '权重', value: String(weight), role: 'compare' as BarRole },
          { label: '阶段', value: '处理文档 A', role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  const fpA = simHash(docA, bits, hooksA);
  const { values: vA, roles: rA } = renderFingerprint(fpA);
  rec
    .begin({
      zh: `A 取符号 → 指纹：${fingerprintToString(fpA)}`,
      en: `A take sign → fingerprint: ${fingerprintToString(fpA)}`,
    })
    .setArray(vA, rA, [])
    .setAux([
      { label: 'A 指纹', value: fingerprintToString(fpA), role: 'final' as BarRole },
      { label: '阶段', value: '文档 A 完成', role: 'frontier' as BarRole },
    ])
    .commit();

  // —— 处理文档 B ——
  rec
    .begin({
      zh: `开始处理文档 B："${docB}"`,
      en: `Start processing document B: "${docB}"`,
    })
    .setAux([{ label: '阶段', value: '处理文档 B', role: 'frontier' as BarRole }])
    .commit();

  const hooksB: SimHashHooks = {
    onFeature: (feat, weight, hash, accum) => {
      const { values, roles } = renderAccum(accum, 0);
      rec
        .begin({
          zh: `B · 特征 "${feat}"（权重 ${weight}，哈希 0x${hash.toString(16)}）：各位 ± 加权累加`,
          en: `B · feature "${feat}" (weight ${weight}, hash 0x${hash.toString(16)}): ± weighted accumulation per bit`,
        })
        .setArray(values, roles, [])
        .setAux([
          { label: '当前特征', value: feat, role: 'pivot' as BarRole },
          { label: '权重', value: String(weight), role: 'compare' as BarRole },
          { label: '阶段', value: '处理文档 B', role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  const fpB = simHash(docB, bits, hooksB);
  const { values: vB, roles: rB } = renderFingerprint(fpB);
  rec
    .begin({
      zh: `B 取符号 → 指纹：${fingerprintToString(fpB)}`,
      en: `B take sign → fingerprint: ${fingerprintToString(fpB)}`,
    })
    .setArray(vB, rB, [])
    .setAux([
      { label: 'B 指纹', value: fingerprintToString(fpB), role: 'final' as BarRole },
      { label: '阶段', value: '文档 B 完成', role: 'frontier' as BarRole },
    ])
    .commit();

  // —— 比较汉明距离 ——
  const dist = hammingDistance(fpA, fpB);
  rec
    .begin({
      zh: `汉明距离 = ${dist}（共 ${bits} 位）。距离越小越相似。`,
      en: `Hamming distance = ${dist} (of ${bits} bits). Smaller = more similar.`,
    })
    .setArray(
      fpA.map((_, i) => (fpA[i] === fpB[i] ? 0 : 1)),
      fpA.map((_, i) => (fpA[i] === fpB[i] ? 'sorted' : 'warn') as BarRole),
      [],
    )
    .setAux([
      { label: 'A 指纹', value: fingerprintToString(fpA), role: 'final' as BarRole },
      { label: 'B 指纹', value: fingerprintToString(fpB), role: 'final' as BarRole },
      {
        label: '汉明距离',
        value: String(dist),
        role: (dist <= bits / 4 ? 'final' : 'warn') as BarRole,
      },
      {
        label: '判定',
        value: dist <= bits / 4 ? '近似重复' : '不相似',
        role: (dist <= bits / 4 ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
