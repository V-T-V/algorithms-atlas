// =============================================================================
// 主元素（Boyer-Moore 投票）· 录制帧序列
// 通过 majorityElement 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { type MajorityHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 3, 4, 3, 2, 3, 3, 5, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const visited = new Set<number>(); // 已访问下标
  let candidateIdx = -1; // 当前 candidate 的代表下标
  let candidateVal = NaN;
  let count = 0;
  let curIdx = -1;
  let result = NaN;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const i of visited) {
      if (i === candidateIdx) roles[i] = 'pivot';
      else roles[i] = 'sorted';
    }
    if (curIdx >= 0) roles[curIdx] = 'compare';
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles))
      .setAux([
        {
          label: '候选 candidate',
          value: Number.isNaN(candidateVal) ? '—' : String(candidateVal),
          role: 'pivot' as BarRole,
        },
        { label: '计数 count', value: String(count), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: '初始：count = 0', en: 'Init: count = 0' });

  const hooks: MajorityHooks = {
    onCandidateChange: (val) => {
      candidateVal = val;
      candidateIdx = curIdx;
    },
    onCount: (_val, c) => {
      count = c;
    },
  };

  // 内联 Boyer-Moore 主循环，便于在每步精确高亮当前下标并触发钩子
  for (let i = 0; i < input.length; i++) {
    curIdx = i;
    const x = input[i]!;
    if (count === 0) {
      candidateVal = x;
      candidateIdx = i;
      count = 1;
      hooks.onCandidateChange?.(x);
    } else if (x === candidateVal) {
      count++;
    } else {
      count--;
    }
    hooks.onCount?.(x, count);
    visited.add(i);
    snapshot({
      zh: `访问 [${i}] = ${x}：candidate=${candidateVal}，count=${count}`,
      en: `Visit [${i}] = ${x}: candidate=${candidateVal}, count=${count}`,
    });
  }

  result = candidateVal;
  rec
    .begin({ zh: `主元素 = ${result}`, en: `Majority = ${result}` })
    .setBars(
      input.map((v) => ({
        value: v,
        role: (v === result ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '结果', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
