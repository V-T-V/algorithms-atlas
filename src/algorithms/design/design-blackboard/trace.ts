import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runBlackboard, type KnowledgeSource } from './impl.ts';
const sources: KnowledgeSource[] = [
  { name: 'A', canHandle: (b) => !b.has('x'), apply: (b) => b.set('x', '1') },
  { name: 'B', canHandle: (b) => b.get('x') === '1' && !b.has('y'), apply: (b) => b.set('y', '2') },
];
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '黑板', en: 'Blackboard' }).commit();
  const board = new Map<string, string>();
  runBlackboard(board, sources, 5, {
    onRound: (r) =>
      rec
        .begin({ zh: '轮 ' + r, en: 'round' })
        .setAux([{ label: 'round', value: String(r), role: 'pivot' as BarRole }])
        .commit(),
    onApply: (ks) =>
      rec
        .begin({ zh: '应用 ' + ks, en: 'apply' })
        .setAux([{ label: 'ks', value: ks, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '黑板大小 ' + board.size, en: 'size' })
    .setAux([{ label: 'size', value: String(board.size), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
