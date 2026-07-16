// =============================================================================
// 李超线段树 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LiChao3 } from './impl.ts';

export const DEFAULT_INPUT = [
  { ql: 0, qr: 10, k: 1, b: 0, name: 'y=x' },
  { ql: 0, qr: 10, k: -1, b: 10, name: 'y=-x+10' },
  { ql: 0, qr: 10, k: 0, b: 6, name: 'y=6' },
];

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const M = 10;
  const lc = new LiChao3(M);

  for (const seg of input) {
    lc.insert(seg.ql, seg.qr, seg.k, seg.b);
    // 在 x=0..M 上采样最大值
    const samples: number[] = [];
    for (let x = 0; x <= M; x++) samples.push(lc.query(x));
    rec
      .begin({ zh: `插入 ${seg.name}`, en: `Insert ${seg.name}` })
      .setBars(samples.map((v) => ({ value: v, role: 'frontier' })))
      .setAux([{ label: 'line', value: seg.name, role: 'pivot' }])
      .commit();
  }

  // 最终最大值包络
  const samples: number[] = [];
  for (let x = 0; x <= M; x++) samples.push(lc.query(x));
  rec
    .begin({ zh: '上包络线', en: 'Upper envelope' })
    .setBars(samples.map((v) => ({ value: v, role: 'final' })))
    .commit();

  return rec.build();
}
