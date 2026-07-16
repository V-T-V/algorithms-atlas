import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { windowSearch, type WNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: WNode = {
    id: 'r',
    children: [
      {
        id: 'a',
        children: [
          { id: 'a1', utility: 2 },
          { id: 'a2', utility: 8 },
        ],
      },
      {
        id: 'b',
        children: [
          { id: 'b1', utility: 4 },
          { id: 'b2', utility: 6 },
        ],
      },
    ],
  };
  const bars = (hi: string[] = []) =>
    [2, 8, 4, 6].map((v, i) => ({
      value: v,
      role: (hi.includes(['a1', 'a2', 'b1', 'b2'][i]!) ? 'swap' : 'default') as BarRole,
      label: ['a1', 'a2', 'b1', 'b2'][i],
    }));
  rec.begin({ zh: '初始', en: 'init' }).setBars(bars()).commit();
  windowSearch(tree, 5, 1, 2, {
    onTry: (a, b) => {
      rec
        .begin({ zh: `试窗口 [${a},${b}]`, en: `try [${a},${b}]` })
        .setBars(bars())
        .setAux([{ label: '窗', value: `[${a},${b}]`, role: 'compare' as BarRole }])
        .commit();
    },
    onFail: (bound, v) => {
      rec
        .begin({ zh: `fail-${bound} = ${v}，回退全窗口`, en: `fail-${bound}=${v}, re-search` })
        .setBars(bars())
        .setAux([{ label: '失败', value: bound, role: 'warn' as BarRole }])
        .commit();
    },
    onHit: (v) => {
      rec
        .begin({ zh: `命中：${v}`, en: `hit: ${v}` })
        .setBars(bars())
        .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
        .commit();
    },
  });
  return rec.build();
}
