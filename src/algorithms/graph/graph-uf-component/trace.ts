// =============================================================================
// 并查集连通分量 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ufComponentCount, type UfComponentHooks } from './impl.ts';

export const DEFAULT_NODES = ['1', '2', '3', '4', '5', '6', '7'];
export const DEFAULT_EDGES = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '4', to: '5' },
  { from: '6', to: '7' },
];

export function buildTrace(
  nodes: readonly string[] = DEFAULT_NODES,
  edges: ReadonlyArray<{ from: string; to: string }> = DEFAULT_EDGES,
): Frame[] {
  const rec = new TraceRecorder();
  const parentOf = new Map<string, string>();
  nodes.forEach((n) => parentOf.set(n, n));
  let parts = nodes.length;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const mapEntries = nodes.map((n) => {
      const role: BarRole = parentOf.get(n) === n ? 'final' : 'frontier';
      return { key: n, value: `→${parentOf.get(n)}`, role };
    });
    rec
      .begin(note)
      .setMap(mapEntries)
      .setAux([{ label: '连通分量', value: String(parts), role: 'pivot' }])
      .commit();
  };

  snap({
    zh: `${nodes.length} 节点，初始 ${parts} 分量`,
    en: `${nodes.length} nodes, ${parts} parts`,
  });

  const hooks: UfComponentHooks = {
    onUnion: (a, b, root) => {
      parentOf.set(a === root ? b : a, root);
      parts--;
      snap({ zh: `union(${a},${b}) → 根 ${root}`, en: `union(${a},${b}) → root ${root}` });
    },
    onResult: (count) => {
      ans = count;
      snap({ zh: `连通分量数 = ${count}`, en: `Components = ${count}` });
    },
  };

  const result = ufComponentCount(nodes, edges, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setMap(nodes.map((n) => ({ key: n, value: `→${parentOf.get(n)}`, role: 'final' as BarRole })))
    .setAux([{ label: '分量数 / components', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
