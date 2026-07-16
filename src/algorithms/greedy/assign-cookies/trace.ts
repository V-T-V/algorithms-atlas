// 分发饼干 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { assignCookies, type AssignCookiesHooks } from './impl.ts';

export interface AcInput {
  g: number[];
  s: number[];
}

export const DEFAULT_INPUT: AcInput = { g: [1, 2, 3], s: [1, 1] };

/** 录制演示帧序列。 */
export function buildTrace(input: AcInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { g, s } = input;
  const children = [...g].sort((a, b) => a - b);
  const _cookies = [...s].sort((a, b) => a - b);
  void _cookies;
  const fed = new Set<number>();

  rec
    .begin({
      zh: `孩子 ${g.join(',')}，饼干 ${s.join(',')}`,
      en: `Children ${g.join(',')}, cookies ${s.join(',')}`,
    })
    .setArray(
      children,
      children.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: AssignCookiesHooks = {
    onMatch: (ci) => {
      fed.add(ci);
      rec
        .begin({ zh: `满足孩子 #${ci}`, en: `Feed child #${ci}` })
        .setArray(
          children,
          children.map((_, i) => (fed.has(i) ? 'final' : 'default') as BarRole),
          [{ index: ci, label: 'c' }],
        )
        .commit();
    },
  };
  const { count } = assignCookies(g, s, hooks);

  rec
    .begin({ zh: `完成：满足 ${count} 个孩子`, en: `Done: ${count} children fed` })
    .setMap([{ key: '满足数', value: String(count), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
