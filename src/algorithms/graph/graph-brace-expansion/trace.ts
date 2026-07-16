// =============================================================================
// 花括号展开 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { expandBraces, type BraceExpansionHooks } from './impl.ts';

export const DEFAULT_INPUT = '{a,b}c{d,e}f';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let result: string[] = [];

  const snap = (note: { zh: string; en: string }, partial: string[]): void => {
    const roles: BarRole[] = partial.map(() => 'frontier');
    rec
      .begin(note)
      .setBars(partial.map((w, i) => ({ value: w.length, role: roles[i]!, label: w })))
      .setAux([{ label: '当前结果数', value: String(partial.length), role: 'pivot' }])
      .commit();
  };

  snap({ zh: `展开 "${input}"`, en: `Expand "${input}"` }, []);

  const partial: string[] = [];
  const hooks: BraceExpansionHooks = {
    onBlock: () => {
      // 重算当前部分笛卡尔积（简化：只展示最终）
    },
    onResult: (words) => {
      result = words;
      snap({ zh: `共 ${words.length} 个结果`, en: `${words.length} results` }, words);
    },
  };
  void partial;

  result = expandBraces(input, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个`, en: `Done: ${result.length} words` })
    .setBars(result.map((w) => ({ value: w.length, role: 'final' as BarRole, label: w })))
    .setMap(result.map((w, i) => ({ key: `${i + 1}`, value: w, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
