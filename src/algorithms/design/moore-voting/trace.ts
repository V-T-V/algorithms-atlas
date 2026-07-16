// Boyer-Moore 多数投票 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mooreVoting, type MooreVotingHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 2, 1, 1, 1, 2, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const arr = input;
  let candidate = arr[0] ?? 0;
  let count = 0;
  let stepIdx = -1;
  let resultVal: number | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((v) =>
      stepIdx >= 0 && v === candidate ? 'final' : 'default',
    );
    if (stepIdx >= 0) roles[stepIdx] = 'compare';
    const pointers: Array<{ index: number; label: string }> = [];
    if (stepIdx >= 0) pointers.push({ index: stepIdx, label: 'i' });
    rec
      .begin(note)
      .setArray([...arr], roles, pointers)
      .setAux([
        { label: '候选 candidate', value: String(candidate), role: 'pivot' as BarRole },
        { label: '计数 count', value: String(count), role: 'swap' as BarRole },
        { label: 'n/2', value: String(Math.floor(arr.length / 2)), role: 'frontier' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `在 [${arr.join(',')}] 中找多数元素（> n/2）`,
    en: `Find majority (> n/2) in [${arr.join(',')}]`,
  });

  const hooks: MooreVotingHooks = {
    onStep: (i, _v, cand, cnt, action) => {
      candidate = cand;
      count = cnt;
      stepIdx = i;
      const act =
        action === 'same'
          ? '相同 → count++'
          : action === 'diff'
            ? '不同 → count--'
            : 'count=0 → 换候选';
      render({
        zh: `a[${i}]=${arr[i]}：${act}`,
        en: `a[${i}]=${arr[i]}: ${action === 'same' ? 'same → count++' : action === 'diff' ? 'diff → count--' : 'count=0 → swap'}`,
      });
    },
    onCandidate: (cand) => {
      candidate = cand;
      stepIdx = -1;
      render({ zh: `候选 = ${cand}，进入验证`, en: `Candidate = ${cand}, verify now` });
    },
    onVerify: (cand, actual, n) => {
      candidate = cand;
      const ok = actual > Math.floor(n / 2);
      resultVal = ok ? cand : null;
      render({
        zh: `验证：${cand} 出现 ${actual} 次 ${ok ? '> ' : '<= '}${Math.floor(n / 2)} → ${ok ? '是多数' : '非多数'}`,
        en: `Verify: ${cand} appears ${actual} ${ok ? '>' : '<='} ${Math.floor(n / 2)} → ${ok ? 'is majority' : 'not majority'}`,
      });
    },
    onResult: (m) => {
      resultVal = m;
    },
  };

  mooreVoting(arr, hooks);

  rec
    .begin({
      zh: resultVal === null ? '无多数元素' : `多数元素 = ${resultVal}`,
      en: resultVal === null ? 'No majority' : `Majority = ${resultVal}`,
    })
    .setArray(
      [...arr],
      arr.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([
      {
        label: '结果',
        value: resultVal === null ? 'null' : String(resultVal),
        role: (resultVal === null ? 'warn' : 'final') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
