import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstSearch } from './impl.ts';
export const DEFAULT_INPUT = { keys: [50, 30, 70, 20, 40, 60, 80], key: 60 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec.begin({ zh: '查找 ' + input.key, en: 'Search ' + input.key }).commit();
  const found = bstSearch(root, input.key, {
    onCompare: (cur, dir) =>
      rec
        .begin({
          zh: Number.isNaN(cur) ? '未命中' : cur + ' → ' + dir,
          en: Number.isNaN(cur) ? 'miss' : cur + ' → ' + dir,
        })
        .setAux([
          {
            label: 'cur',
            value: Number.isNaN(cur) ? 'null' : String(cur),
            role: 'compare' as BarRole,
          },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '找到？' + found, en: 'found? ' + found })
    .setAux([{ label: 'found', value: String(found), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
