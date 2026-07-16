// rec-lcm-rec · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recLcmRec } from './impl.ts';

export const DEFAULT_INPUT = { a: 12, b: 18 };

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'rec-lcm-rec：开始递归', en: 'rec-lcm-rec: start recursion' })
    .setAux([{ label: 'input', value: JSON.stringify(input), role: 'pivot' as BarRole }])
    .commit();
  const events: Array<{
    note: { zh: string; en: string };
    aux: Array<{ label: string; value: string; role?: BarRole }>;
  }> = [];
  const r = recLcmRec(input.a, input.b, {
    onGcd: (d, x, y) =>
      events.push({
        note: { zh: `gcd(${x},${y})`, en: `gcd(${x},${y})` },
        aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }],
      }),
    onReturn: (v) =>
      events.push({
        note: { zh: `lcm = ${v}`, en: `lcm = ${v}` },
        aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }],
      }),
  });

  for (const ev of events) {
    rec.begin(ev.note).setAux(ev.aux).commit();
  }
  rec
    .begin({
      zh: `结果: ${r.result}, 最大深度 ${r.depth}, 调用 ${r.calls} 次`,
      en: `Result: ${r.result}, depth ${r.depth}, ${r.calls} calls`,
    })
    .setAux([
      { label: 'result', value: String(r.result), role: 'final' as BarRole },
      { label: 'depth', value: String(r.depth), role: 'compare' as BarRole },
      { label: 'calls', value: String(r.calls), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
