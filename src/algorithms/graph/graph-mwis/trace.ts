// =============================================================================
// 树上最大权独立集 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeMwis, type MwisHooks, type TreeInput } from './impl.ts';

export const DEFAULT_INPUT: TreeInput = {
  nodes: [
    { id: 'R', weight: 5 },
    { id: 'A', weight: 3 },
    { id: 'B', weight: 4 },
    { id: 'C', weight: 1 },
    { id: 'D', weight: 2 },
  ],
  children: [
    { parent: 'R', child: 'A' },
    { parent: 'R', child: 'B' },
    { parent: 'A', child: 'C' },
    { parent: 'B', child: 'D' },
  ],
  root: 'R',
};

export function buildTrace(input: TreeInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let result = { best: 0, chosen: [] as string[] };

  rec
    .begin({ zh: `根=${input.root}`, en: `root=${input.root}` })
    .setAux(
      input.nodes.map((n) => ({ label: n.id, value: `w=${n.weight}`, role: 'frontier' as const })),
    )
    .commit();

  const hooks: MwisHooks = {
    onNode: (id, take, skip) => {
      rec
        .begin({ zh: `${id}: take=${take} skip=${skip}`, en: `${id}: take=${take} skip=${skip}` })
        .setAux([
          { label: '节点', value: id, role: 'pivot' },
          { label: 'take', value: String(take), role: 'compare' },
          { label: 'skip', value: String(skip), role: 'default' },
        ])
        .commit();
    },
    onDone: (best, chosen) => {
      result = { best, chosen };
      rec
        .begin({
          zh: `最优=${best} 选中=[${chosen.join(',')}]`,
          en: `best=${best} chosen=[${chosen.join(',')}]`,
        })
        .setAux([
          { label: '最大权和', value: String(best), role: 'final' },
          { label: '选中节点', value: chosen.join(','), role: 'final' },
        ])
        .commit();
    },
  };

  treeMwis(input, hooks);
  return rec.build();
}
