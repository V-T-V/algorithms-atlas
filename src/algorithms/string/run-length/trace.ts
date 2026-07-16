// =============================================================================
// 游程编码 · 录制帧序列
// setArray 展示字符串（字符码），pointer 标注当前游程区间；setAux 展示游程序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runLength, type RunLengthHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aaabbbccaaaa';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  let curStart = -1;
  let curEnd = -1;
  const runs: Array<{ char: string; count: number; start: number }> = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'runs', value: runs.map((r) => `${r.char}${r.count}`).join(' ') || '-' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (curStart >= 0) {
      pointers.push({ index: curStart, label: 'l' });
      if (curEnd >= 0 && curEnd < n) pointers.push({ index: curEnd, label: 'r' });
      for (let k = curStart; k <= curEnd && k < n; k++) roles[k] = 'final';
    }
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux()).commit();
  };

  snap({ zh: `游程编码：${s}`, en: `RLE: ${s}` });

  const hooks: RunLengthHooks = {
    onRun: (run) => {
      curStart = run.start;
      curEnd = run.start + run.count - 1;
      runs.push(run);
      snap({
        zh: `游程 '${run.char}' × ${run.count} [${run.start}..${curEnd}]`,
        en: `Run '${run.char}' x ${run.count}`,
      });
    },
    onDone: () => {},
  };

  runLength(s, hooks);

  curStart = -1;
  curEnd = -1;
  rec
    .begin({ zh: `完成：${runs.length} 个游程`, en: `Done: ${runs.length} runs` })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux(aux())
    .commit();
  return rec.build();
}
