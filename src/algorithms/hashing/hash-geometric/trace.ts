import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { geometricHash, type Pt } from './impl.ts';

export const DEFAULT_INPUT: Pt[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0.5, y: 0.866 },
  { x: 0.5, y: 0.288 },
];

export function buildTrace(input: readonly Pt[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `输入 ${input.length} 个 2D 点`, en: `Input ${input.length} 2D points` })
    .setAux([{ label: '点数', value: String(input.length), role: 'pivot' as BarRole }])
    .commit();
  let basisCount = 0;
  let lastCells = 0;
  const hooks = {
    onBasis: (p1: Pt, p2: Pt, count: number) => {
      if (count > 0) {
        basisCount++;
        rec
          .begin({
            zh: `基准 (${p1.x},${p1.y})-(${p2.x},${p2.y}) 投影了 ${count} 个点`,
            en: `Basis (${p1.x},${p1.y})-(${p2.x},${p2.y}) projected ${count} points`,
          })
          .setAux([{ label: '基准', value: String(basisCount), role: 'compare' as BarRole }])
          .commit();
      }
    },
    onResult: (msg: string) => {
      rec
        .begin({ zh: msg, en: msg })
        .setAux([{ label: 'cells', value: msg, role: 'final' as BarRole }])
        .commit();
    },
  };
  const table = geometricHash(input, 1, hooks);
  lastCells = table.size;
  rec
    .begin({ zh: `最终哈希表 ${lastCells} 个单元`, en: `Final hash table ${lastCells} cells` })
    .setAux([{ label: 'cells', value: String(lastCells), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
