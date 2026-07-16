// =============================================================================
// 拒绝采样 · 录制帧序列
// 用 bars 展示密度柱状图，aux 展示候选点 (x,y) 与接受/拒绝、累计频率。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sampleMany, makeRng, type RejectionHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 三角密度：中间高
  density: [1, 2, 3, 4, 5, 4, 3, 2, 1],
  count: 200,
  seed: 42,
};

interface BuildTraceInput {
  density?: number[];
  count?: number;
  seed?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const density = input.density ?? DEFAULT_INPUT.density;
  const count = input.count ?? DEFAULT_INPUT.count;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();
  const rng = makeRng(seed);
  const counts = new Array<number>(density.length).fill(0);
  let tries = 0;
  let accepts = 0;
  let curX = -1;
  let curY = -1;
  let curAccepted = false;
  let maxD = 0;
  for (const d of density) if (d > maxD) maxD = d;

  const render = (note: { zh: string; en: string }): void => {
    // bars：密度柱（归一化到 0-100）
    const bars = density.map((d, i) => ({
      value: Math.round((d / maxD) * 100),
      role: (i === curX ? (curAccepted ? 'final' : 'warn') : 'sorted') as BarRole,
    }));
    const total = counts.reduce((a, b) => a + b, 0);
    const freq = counts.map((c) => (total > 0 ? ((c / total) * 100).toFixed(0) : '0'));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '候选 x', value: String(curX), role: 'compare' as BarRole },
        { label: '随机高度 y', value: curY.toFixed(2), role: 'pivot' as BarRole },
        {
          label: 'f(x)',
          value: String(curX >= 0 ? density[curX] : 0),
          role: 'frontier' as BarRole,
        },
        {
          label: '本次',
          value: curAccepted ? '接受' : '拒绝',
          role: (curAccepted ? 'final' : 'warn') as BarRole,
        },
        { label: '尝试数', value: String(tries), role: 'default' as BarRole },
        { label: '已接受', value: String(accepts), role: 'final' as BarRole },
        {
          label: '接受率',
          value: tries > 0 ? ((accepts / tries) * 100).toFixed(0) + '%' : '-',
          role: 'default' as BarRole,
        },
        ...freq.map((f, i) => ({ label: `freq[${i}]`, value: `${f}%`, role: 'sorted' as BarRole })),
      ])
      .commit();
  };

  render({
    zh: `拒绝采样：密度 [${density.join(',')}]，目标 ${count} 个样本。在包围框 ${density.length}×${maxD} 中投掷。`,
    en: `Rejection sampling: density [${density.join(',')}], target ${count} samples. Throw darts in box ${density.length}×${maxD}.`,
  });

  const hooks: RejectionHooks = {
    onTry: (x, y, accepted) => {
      tries++;
      curX = x;
      curY = y;
      curAccepted = accepted;
    },
    onAccept: (x) => {
      counts[x]!++;
      accepts++;
      // 每 ~5 个样本记录一帧（避免帧过多）
      if (accepts % Math.max(1, Math.floor(count / 20)) === 0) {
        render({
          zh: `接受 ${accepts}/${count}：候选 x=${curX}, y=${curY.toFixed(2)} ≤ f(${curX})=${density[curX]!}`,
          en: `Accepted ${accepts}/${count}: candidate x=${curX}, y=${curY.toFixed(2)} ≤ f(${curX})=${density[curX]!}`,
        });
      }
    },
  };

  sampleMany(density, count, rng, hooks);

  // 终态
  const total = counts.reduce((a, b) => a + b, 0);
  const freq = counts.map((c) => (total > 0 ? ((c / total) * 100).toFixed(1) : '0'));
  rec
    .begin({
      zh: `完成：采样 ${count} 个（尝试 ${tries} 次，接受率 ${((accepts / tries) * 100).toFixed(0)}%）`,
      en: `Done: sampled ${count} (${tries} tries, acceptance ${((accepts / tries) * 100).toFixed(0)}%)`,
    })
    .setBars(
      density.map((d) => ({
        value: Math.round((d / maxD) * 100),
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      { label: '总采样', value: String(count), role: 'final' as BarRole },
      { label: '总尝试', value: String(tries), role: 'default' as BarRole },
      {
        label: '接受率',
        value: ((accepts / tries) * 100).toFixed(1) + '%',
        role: 'final' as BarRole,
      },
      ...freq.map((f, i) => ({ label: `freq[${i}]`, value: `${f}%`, role: 'final' as BarRole })),
    ])
    .commit();

  return rec.build();
}

export { makeRng };
