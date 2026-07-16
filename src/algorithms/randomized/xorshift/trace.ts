// =============================================================================
// Xorshift128 生成器 · 录制帧序列
// 用 bars 展示生成的无符号 32 位值（归一化柱高），aux 展示序列统计。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Xorshift, type XorshiftHooks } from './impl.ts';

export const DEFAULT_INPUT = { seed: 42, count: 16 };

interface BuildTraceInput {
  seed?: number;
  count?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const seed = input.seed ?? DEFAULT_INPUT.seed;
  const count = input.count ?? DEFAULT_INPUT.count;

  const rec = new TraceRecorder();
  const seq: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '种子', value: String(seed), role: 'frontier' },
      { label: '算法', value: 'Xorshift128', role: 'pivot' },
      { label: '移位', value: '<<11, >>19, >>8', role: 'pivot' },
      { label: '已生成数', value: String(seq.length), role: 'default' },
    ];
    const bars = seq.map((v, i) => ({
      value: Math.round((v / 0x100000000) * 100),
      role: (i === seq.length - 1 ? 'swap' : 'sorted') as BarRole,
    }));
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  render({
    zh: `Xorshift128 种子 ${seed}，生成 ${count} 个无符号 32 位数`,
    en: `Xorshift128 seed ${seed}, generate ${count} unsigned 32-bit numbers`,
  });

  const hooks: XorshiftHooks = {
    onNext: (v) => {
      seq.push(v);
      render({
        zh: `第 ${seq.length} 个：${v}`,
        en: `#${seq.length}: ${v}`,
      });
    },
  };

  const gen = new Xorshift(seed);
  for (let i = 0; i < count; i++) {
    hooks.onNext?.(gen.next());
  }

  // 终态
  rec
    .begin({
      zh: `完成：生成 ${seq.length} 个数`,
      en: `Done: generated ${seq.length} numbers`,
    })
    .setBars(
      seq.map((v) => ({
        value: Math.round((v / 0x100000000) * 100),
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      { label: '序列长度', value: String(seq.length), role: 'final' },
      { label: '最小值', value: String(Math.min(...seq)), role: 'default' },
      { label: '最大值', value: String(Math.max(...seq)), role: 'default' },
    ])
    .commit();

  return rec.build();
}
