// =============================================================================
// LIS 计数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lisCount, type LisCountHooks, type LisCountResult } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 4, 7];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = nums.length;
  const len = new Array<number>(n).fill(1);
  const cnt = new Array<number>(n).fill(1);
  let ci = -1;
  let cj = -1;
  let ans: LisCountResult = { maxLen: 0, count: 0 };

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = nums.map((_, i) =>
      i === ci ? 'pivot' : i === cj ? 'compare' : 'default',
    );
    rec
      .begin(note)
      .setArray([...nums], roles, [
        { index: ci < 0 ? 0 : ci, label: 'i' },
        ...(cj >= 0 ? [{ index: cj, label: 'j' }] : []),
      ])
      .setAux([
        { label: 'len', value: len.map((v) => `${v}`).join(' '), role: 'frontier' },
        { label: 'cnt', value: cnt.map((v) => `${v}`).join(' '), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `nums=[${nums.join(', ')}]`, en: `nums=[${nums.join(', ')}]` });

  const hooks: LisCountHooks = {
    onInit: () => snap({ zh: '初始化 len[i]=cnt[i]=1', en: 'Init len[i]=cnt[i]=1' }),
    onCompare: (i, j) => {
      ci = i;
      cj = j;
      snap({ zh: `比较 i=${i} j=${j}`, en: `Compare i=${i} j=${j}` });
    },
    onUpdate: (i, l, c) => {
      len[i] = l;
      cnt[i] = c;
      cj = -1;
      snap({
        zh: `更新 len[${i}]=${l} cnt[${i}]=${c}`,
        en: `Update len[${i}]=${l} cnt[${i}]=${c}`,
      });
    },
    onDone: (ml, t) => {
      ans = { maxLen: ml, count: t };
      ci = -1;
      cj = -1;
      snap({ zh: `最长=${ml} 方案数=${t}`, en: `maxLen=${ml} count=${t}` });
    },
  };

  lisCount(nums, hooks);

  rec
    .begin({
      zh: `完成：长度=${ans.maxLen} 方案数=${ans.count}`,
      en: `Done: len=${ans.maxLen} count=${ans.count}`,
    })
    .setBars(nums.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([
      { label: '最长长度', value: String(ans.maxLen), role: 'final' },
      { label: '方案数', value: String(ans.count), role: 'final' },
    ])
    .commit();

  return rec.build();
}
