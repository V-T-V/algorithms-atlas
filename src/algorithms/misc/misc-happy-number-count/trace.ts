// =============================================================================
// 快乐数计数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countHappyNumbers, type HappyHooks } from './impl.ts';

export const DEFAULT_INPUT = 20;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const results: Array<{ n: number; happy: boolean }> = [];

  rec
    .begin({ zh: `统计 1..${input} 的快乐数`, en: `Count happy numbers in 1..${input}` })
    .setAux([{ label: '上界', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: HappyHooks = {
    onCheck: (n, happy) => results.push({ n, happy }),
  };

  const total = countHappyNumbers(input, hooks);
  const happyOnes = results.filter((r) => r.happy);

  // 展示部分结果
  const show = happyOnes.length <= 10 ? happyOnes : happyOnes.slice(0, 10);
  rec
    .begin({
      zh: `快乐数（前 ${show.length} 个）：[${show.map((r) => r.n).join(', ')}]`,
      en: `Happy (first ${show.length}): [${show.map((r) => r.n).join(', ')}]`,
    })
    .setAux(show.map((r) => ({ label: String(r.n), value: 'happy', role: 'final' as BarRole })))
    .commit();

  rec
    .begin({ zh: `共 ${total} 个快乐数`, en: `${total} happy numbers` })
    .setAux([{ label: '总数', value: String(total), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
