// =============================================================================
// LIS 二分 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lisLength, type LisBinHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 9, 2, 5, 3, 7, 101, 18];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tails: number[] = [];
  let ci = -1;
  let probeMid = -1;
  let placePos = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = nums.map((_, i) =>
      i === ci ? 'pivot' : i < ci ? 'sorted' : 'default',
    );
    rec
      .begin(note)
      .setArray([...nums], roles, [{ index: ci < 0 ? 0 : ci, label: 'i' }])
      .setAux([
        { label: 'tails', value: tails.length ? tails.join(' ') : '∅', role: 'frontier' },
        {
          label: 'probe',
          value:
            probeMid >= 0 ? `mid=${probeMid}, tails[${probeMid}]=${tails[probeMid] ?? '-'}` : '-',
          role: 'compare',
        },
        { label: 'place', value: placePos >= 0 ? `pos=${placePos}` : '-', role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `nums=[${nums.join(', ')}]`, en: `nums=[${nums.join(', ')}]` });

  const hooks: LisBinHooks = {
    onScan: (x, i) => {
      ci = i;
      probeMid = -1;
      placePos = -1;
      snap({ zh: `扫描 x=${x}（i=${i}）`, en: `Scan x=${x} (i=${i})` });
    },
    onProbe: (x, lo, hi, mid) => {
      probeMid = mid;
      snap({
        zh: `二分 x=${x} 范围[${lo},${hi}) mid=${mid}`,
        en: `BinSearch x=${x} [${lo},${hi}) mid=${mid}`,
      });
    },
    onPlace: (x, pos) => {
      placePos = pos;
      snap({
        zh:
          pos === tails.length - 1 && tails[pos] === x
            ? `追加 x=${x} 到 tails`
            : `替换 tails[${pos}]=${x}`,
        en:
          pos === tails.length - 1 && tails[pos] === x
            ? `Append x=${x}`
            : `Replace tails[${pos}]=${x}`,
      });
    },
    onDone: (len) => {
      ci = -1;
      probeMid = -1;
      placePos = -1;
      snap({ zh: `完成：LIS 长度=${len}`, en: `Done: LIS length=${len}` });
    },
  };

  const ans = lisLength(nums, hooks);

  rec
    .begin({ zh: `LIS 长度 = ${ans}`, en: `LIS length = ${ans}` })
    .setBars(nums.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: 'LIS 长度', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
