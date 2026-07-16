// 最后通牒博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameUltimatum } from './impl.ts';

export const DEFAULT_INPUT = { pool: 100, offer: 30, threshold: 40 };

export function buildTrace(
  input: { pool?: number; offer?: number; threshold?: number } = {},
): Frame[] {
  const { pool = 100, offer = 30, threshold = 40 } = input;
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `总额 ${pool}，提议给回应者 ${offer}，回应者阈值 ${threshold}`,
      en: `Pool ${pool}, offer ${offer} to responder, threshold ${threshold}`,
    })
    .setAux([
      { label: '提案', value: String(offer), role: 'pivot' as BarRole },
      { label: '阈值', value: String(threshold), role: 'compare' as BarRole },
    ])
    .commit();
  const r = gameUltimatum(pool, offer, threshold, {
    onRespond: (accepted) => {
      rec
        .begin({
          zh: accepted ? `接受：双方得 (${pool - offer}, ${offer})` : `拒绝：双方得 (0, 0)`,
          en: accepted ? `Accept: (${pool - offer}, ${offer})` : `Reject: (0, 0)`,
        })
        .setAux([
          {
            label: '决定',
            value: accepted ? '接受' : '拒绝',
            role: (accepted ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
  });
  rec
    .begin({
      zh: `提议者 ${r.proposerPayoff}，回应者 ${r.responderPayoff}`,
      en: `Proposer ${r.proposerPayoff}, responder ${r.responderPayoff}`,
    })
    .setAux([
      { label: '提议者', value: String(r.proposerPayoff), role: 'final' as BarRole },
      { label: '回应者', value: String(r.responderPayoff), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
