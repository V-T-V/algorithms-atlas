import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { existCopy } from './impl.ts';

export const DEFAULT_BOARD = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];
export const DEFAULT_WORD = 'ABCCED';

export function buildTrace(opts: { board?: string[][]; word?: string } = {}): Frame[] {
  const board = opts.board ?? DEFAULT_BOARD;
  const word = opts.word ?? DEFAULT_WORD;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 搜"${word}"`, en: `Init search "${word}"` })
    .setGrid(board.map((row) => row.map((ch) => ({ v: ch, role: 'default' as BarRole }))))
    .setAux([{ label: '单词', value: word, role: 'compare' as BarRole }])
    .commit();

  existCopy(board, word, {
    onStep: (r, c, idx, path) => {
      rec
        .begin({
          zh: `匹配 [${idx}]='${word[idx]}' 于 (${r},${c})`,
          en: `match [${idx}]='${word[idx]}' at (${r},${c})`,
        })
        .setGrid(
          board.map((row, ri) =>
            row.map((ch, ci) => ({
              v: ch,
              role: (path.some(([pr, pc]) => pr === ri && pc === ci)
                ? 'sorted'
                : ri === r && ci === c
                  ? 'swap'
                  : 'default') as BarRole,
            })),
          ),
        )
        .setAux([{ label: '进度', value: `${idx + 1}/${word.length}`, role: 'compare' as BarRole }])
        .commit();
    },
  });

  const result = existCopy(board, word);
  rec
    .begin({
      zh: `完成：${result ? '找到' : '未找到'}`,
      en: `Done: ${result ? 'found' : 'not found'}`,
    })
    .setGrid(
      board.map((row, ri) =>
        row.map((ch, ci) => ({
          v: ch,
          role: (result
            ? result.some(([pr, pc]) => pr === ri && pc === ci)
              ? 'final'
              : 'default'
            : 'default') as BarRole,
        })),
      ),
    )
    .setAux([{ label: '结果', value: result ? '存在' : '不存在', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
