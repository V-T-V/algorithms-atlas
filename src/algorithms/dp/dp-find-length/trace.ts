// =============================================================================
// 最长重复子数组 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findLength, type FindLengthHooks } from './impl.ts';

export const DEFAULT_INPUT_A = [1, 2, 3, 2, 1];
export const DEFAULT_INPUT_B = [3, 2, 1, 4, 7];

export function buildTrace(
  a: readonly number[] = DEFAULT_INPUT_A,
  b: readonly number[] = DEFAULT_INPUT_B,
): Frame[] {
  const rec = new TraceRecorder();
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  let curI = -1;
  let curJ = -1;
  let best = 0;

  const renderGrid = (): Cell[][] => {
    // 表头一行 nums2，首列 nums1
    const header: Cell[] = [{ v: 'i\\j', role: 'pivot' }];
    for (let j = 0; j < n; j++) header.push({ v: b[j]!, role: 'default' });
    const rows: Cell[][] = [header];
    for (let i = 0; i <= m; i++) {
      const row: Cell[] = [{ v: i === 0 ? '0' : a[i - 1]!, role: 'pivot' }];
      for (let j = 0; j <= n; j++) {
        let role: BarRole = 'default';
        if (i === curI && j === curJ) role = 'compare';
        else if (dp[i]![j]! === best && best > 0) role = 'final';
        row.push({ v: i === 0 || j === 0 ? '0' : `${dp[i]![j]}`, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({
    zh: `A=[${a.join(', ')}] B=[${b.join(', ')}]`,
    en: `A=[${a.join(', ')}] B=[${b.join(', ')}]`,
  });

  const hooks: FindLengthHooks = {
    onCompare: (i, j, equal, val) => {
      curI = i + 1;
      curJ = j + 1;
      if (equal) dp[i + 1]![j + 1] = val;
      best = Math.max(best, val);
      snap({
        zh: `A[${i}]=${a[i]} vs B[${j}]=${b[j]} → ${equal ? `dp=${val}` : '不等'}`,
        en: `A[${i}]=${a[i]} vs B[${j}]=${b[j]} → ${equal ? `dp=${val}` : 'mismatch'}`,
      });
    },
    onResult: (len) => {
      curI = -1;
      curJ = -1;
      snap({ zh: `最长重复子数组 = ${len}`, en: `Repeated subarray = ${len}` });
    },
  };

  const result = findLength(a, b, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大长度 / max len', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
