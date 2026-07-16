import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bloomDemo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = ['apple', 'banana', 'cherry'];
  const queries = ['apple', 'grape', 'banana', 'melon'];
  rec.begin({ zh: '布隆过滤器 m=64 k=3', en: 'Bloom filter m=64 k=3' }).commit();
  const r = bloomDemo(items, queries, 64, 3, {
    onAdd: (it, bits) =>
      rec
        .begin({ zh: `加入 ${it} 位置[${bits.join(',')}]`, en: `add ${it} [${bits.join(',')}]` })
        .setBars(bits.map((b) => ({ value: b % 20, role: 'final' as BarRole })))
        .commit(),
    onQuery: (it, maybe) =>
      rec
        .begin({
          zh: `查 ${it}: ${maybe ? '可能' : '不在'}`,
          en: `query ${it}: ${maybe ? 'maybe' : 'no'}`,
        })
        .setAux([
          {
            label: 'result',
            value: maybe ? 'YES' : 'NO',
            role: maybe ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  void r;
  return rec.build();
}
