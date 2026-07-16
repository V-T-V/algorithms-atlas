// 消耗战 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameWarOfAttrition } from './impl.ts';
export const DEFAULT_INPUT = { t1: 3, t2: 5, V: 8 };
export function buildTrace(input: { t1?: number; t2?: number; V?: number } = {}): Frame[] {
  const { t1 = DEFAULT_INPUT.t1, t2 = DEFAULT_INPUT.t2, V = DEFAULT_INPUT.V } = input;
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `消耗战：玩家1坚持 ${t1}，玩家2坚持 ${t2}，资源 V=${V}`,
      en: `War of attrition: p1 holds ${t1}, p2 holds ${t2}, V=${V}`,
    })
    .setBars([
      { value: t1, role: 'compare' as BarRole, label: 'p1' },
      { value: t2, role: 'compare' as BarRole, label: 'p2' },
    ])
    .commit();
  const r = gameWarOfAttrition(t1, t2, V);
  const w = r.winner === -1 ? '并列' : `玩家 ${r.winner + 1}`;
  rec
    .begin({
      zh: `${w} 胜，耗时 ${r.duration}，收益 (${r.payoffs[0]}, ${r.payoffs[1]})`,
      en: `${r.winner === -1 ? 'tie' : 'p' + (r.winner + 1)} wins after ${r.duration}, payoffs (${r.payoffs[0]}, ${r.payoffs[1]})`,
    })
    .setBars([
      { value: r.payoffs[0]!, role: 'final' as BarRole, label: 'u1' },
      { value: r.payoffs[1]!, role: 'final' as BarRole, label: 'u2' },
    ])
    .commit();
  return rec.build();
}
