import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveRiverCrossing, type RcState } from './impl.ts';

export function buildTrace(opts: { totalM?: number; totalC?: number } = {}): Frame[] {
  const totalM = opts.totalM ?? 3;
  const totalC = opts.totalC ?? 3;
  const rec = new TraceRecorder();
  const sol = solveRiverCrossing(totalM, totalC);

  if (!sol) {
    rec
      .begin({ zh: '无解', en: 'No solution' })
      .setAux([{ label: '结果', value: '无解', role: 'warn' as BarRole }])
      .commit();
    return rec.build();
  }

  const snap = (note: { zh: string; en: string }, s: RcState): void => {
    const bars = [
      { value: s.leftM, role: 'final' as BarRole, label: `左M:${s.leftM}` },
      { value: s.leftC, role: 'warn' as BarRole, label: `左C:${s.leftC}` },
      { value: totalM - s.leftM, role: 'final' as BarRole, label: `右M:${totalM - s.leftM}` },
      { value: totalC - s.leftC, role: 'warn' as BarRole, label: `右C:${totalC - s.leftC}` },
    ];
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '船', value: s.boat === 0 ? '左岸' : '右岸', role: 'pivot' as BarRole },
        { label: '步数', value: sol.steps.toString(), role: 'compare' as BarRole },
      ])
      .commit();
  };

  for (const node of sol.path) {
    const move = node.move;
    const note =
      move === null
        ? { zh: '初始状态', en: 'Initial state' }
        : { zh: `运送 ${move.m} 传教士 ${move.c} 野人`, en: `carry ${move.m}M ${move.c}C` };
    snap(note, node.state);
  }

  rec
    .begin({ zh: `完成：${sol.steps} 步过河`, en: `Done: crossed in ${sol.steps} steps` })
    .setAux([{ label: '结果', value: `共 ${sol.steps} 步`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
