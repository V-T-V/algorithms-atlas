// =============================================================================
// 相似字符串组 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numSimilarGroups, type SimilarGroupsHooks } from './impl.ts';

export const DEFAULT_STRS = ['tars', 'rats', 'arts', 'star'];

export function buildTrace(strs: string[] = DEFAULT_STRS): Frame[] {
  const rec = new TraceRecorder();
  let groups = 0;
  let curI = -1;
  let curJ = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = strs.map((_, i) => (i === curI || i === curJ ? 'compare' : 'default'));
    rec
      .begin(note)
      .setBars(strs.map((s, i) => ({ value: s.length, role: roles[i]!, label: s })))
      .setAux([{ label: '分组数', value: String(groups || strs.length), role: 'pivot' }])
      .commit();
  };

  snap({ zh: `${strs.length} 串`, en: `${strs.length} strings` });

  const hooks: SimilarGroupsHooks = {
    onPair: (i, j, sim) => {
      curI = i;
      curJ = j;
      snap({
        zh: `${strs[i]} ~ ${strs[j]} ${sim ? '相似' : '不相似'}`,
        en: `${strs[i]} ~ ${strs[j]} ${sim ? 'similar' : 'not similar'}`,
      });
    },
    onResult: (g) => {
      groups = g;
      curI = -1;
      curJ = -1;
      snap({ zh: `分组 = ${g}`, en: `Groups = ${g}` });
    },
  };

  const result = numSimilarGroups(strs, hooks);

  rec
    .begin({ zh: `完成：${result} 组`, en: `Done: ${result} groups` })
    .setBars(strs.map((s) => ({ value: s.length, role: 'final' as BarRole, label: s })))
    .setAux([{ label: '组数 / groups', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
