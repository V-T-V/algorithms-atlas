// =============================================================================
// 线性同余生成器 · 录制帧序列
// 用 aux 展示生成序列，bars 展示数值分布（归一化柱高）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LCG, type LcgHooks } from './impl.ts';

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
      { label: '参数 a', value: '1103515245', role: 'pivot' },
      { label: '参数 c', value: '12345', role: 'pivot' },
      { label: '参数 m', value: String(2 ** 31), role: 'pivot' },
      { label: '已生成数', value: String(seq.length), role: 'default' },
    ];
    // bars：归一化到 0..1 的柱（值 = x/m），高亮最新
    const bars = seq.map((v, i) => ({
      value: Math.round((v / 2 ** 31) * 100),
      role: (i === seq.length - 1 ? 'swap' : 'sorted') as BarRole,
    }));
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  render({
    zh: `LCG（glibc 参数）种子 ${seed}，生成 ${count} 个数`,
    en: `LCG (glibc params) seed ${seed}, generate ${count} numbers`,
  });

  const hooks: LcgHooks = {
    onNext: (v) => {
      seq.push(v);
      render({
        zh: `X${seq.length} = ${v}`,
        en: `X${seq.length} = ${v}`,
      });
    },
  };

  const gen = new LCG(seed);
  for (let i = 0; i < count; i++) {
    hooks.onNext?.(gen.next());
  }

  // 终态：展示序列统计
  rec
    .begin({
      zh: `完成：生成 ${seq.length} 个数，范围 [${Math.min(...seq)}, ${Math.max(...seq)}]`,
      en: `Done: ${seq.length} numbers, range [${Math.min(...seq)}, ${Math.max(...seq)}]`,
    })
    .setBars(
      seq.map((v) => ({
        value: Math.round((v / 2 ** 31) * 100),
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      { label: '序列长度', value: String(seq.length), role: 'final' },
      { label: '最小值', value: String(Math.min(...seq)), role: 'default' },
      { label: '最大值', value: String(Math.max(...seq)), role: 'default' },
      {
        label: '均值',
        value: String(Math.round(seq.reduce((a, b) => a + b, 0) / seq.length)),
        role: 'pivot',
      },
    ])
    .commit();

  return rec.build();
}
