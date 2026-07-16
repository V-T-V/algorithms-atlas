// rec-tribonacci-rec · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recTribonacciRec } from './impl.ts';

export const DEFAULT_INPUT = { n: 8 };

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'rec-tribonacci-rec：开始递归', en: 'rec-tribonacci-rec: start recursion' })
    .setAux([{ label: 'input', value: JSON.stringify(input), role: 'pivot' as BarRole }])
    .commit();
  const events: Array<{
    note: { zh: string; en: string };
    aux: Array<{ label: string; value: string; role?: BarRole }>;
  }> = [];
  const r = recTribonacciRec(input.n, {
    onRecurse: (d, k) => {
      if (events.length < 10)
        events.push({
          note: { zh: `递归 d=${d}: T(${k})`, en: `recurse T(${k})` },
          aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }],
        });
    },
    onBase: (d, v) => events.push({ note: { zh: `基线 d=${d}: ${v}`, en: `base: ${v}` }, aux: [] }),
    onReturn: (d, k, v) => {
      if (events.length < 10)
        events.push({
          note: { zh: `返回 T(${k})=${v}`, en: `T(${k})=${v}` },
          aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }],
        });
    },
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
