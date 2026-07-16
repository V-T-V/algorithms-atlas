import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Broker } from './impl.ts';
export const DEFAULT_INPUT: any = [
  ['greet', 'hi'],
  ['add', '1,2'],
];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '代理中介', en: 'Broker' }).commit();
  const b = new Broker();
  b.register('greet', (r) => 'hello ' + r);
  b.register('add', (r) => {
    const nums = r.split(',').map(Number);
    return String((nums[0] ?? 0) + (nums[1] ?? 0));
  });
  for (const [name, req] of input)
    b.call(name!, req!, {
      onCall: (n, resp) =>
        rec
          .begin({ zh: n + ' -> ' + resp, en: 'call' })
          .setAux([
            { label: 'svc', value: n, role: 'compare' as BarRole },
            { label: 'resp', value: resp, role: 'final' as BarRole },
          ])
          .commit(),
    });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
