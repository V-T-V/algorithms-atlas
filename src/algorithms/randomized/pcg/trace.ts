// =============================================================================
// PCG32 · 录制帧序列
// 用 bars 展示生成的 32 位值（归一化柱高），aux 展示序列与状态信息。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PCG32, generatePcgSequence, type PcgHooks } from './impl.ts';

export const DEFAULT_INPUT = { seed: 42n, count: 16 };

interface BuildTraceInput {
  seed?: bigint | number;
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
      { label: '种子', value: seed.toString(), role: 'frontier' },
      { label: '状态位宽', value: '64', role: 'pivot' },
      { label: '输出位宽', value: '32', role: 'pivot' },
      { label: '已生成数', value: String(seq.length), role: 'default' },
    ];
    const bars = seq.map((v, i) => ({
      value: Math.round((v / 0x100000000) * 100),
      role: (i === seq.length - 1 ? 'swap' : 'sorted') as BarRole,
    }));
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  render({
    zh: `PCG32 种子 ${seed}，生成 ${count} 个无符号 32 位数`,
    en: `PCG32 seed ${seed}, generate ${count} unsigned 32-bit numbers`,
  });

  const hooks: PcgHooks = {
    onNext: (v) => {
      seq.push(v);
      render({
        zh: `第 ${seq.length} 个：${v}`,
        en: `#${seq.length}: ${v}`,
      });
    },
  };

  generatePcgSequence(seed, count, undefined, hooks);

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
      { label: '序列长度', value: String(seq.length), role: 'final' as BarRole },
      { label: '最小值', value: String(Math.min(...seq)), role: 'default' as BarRole },
      { label: '最大值', value: String(Math.max(...seq)), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { PCG32 };
