// =============================================================================
// 优美排列 · 录制帧序列
// 可视化：setArray 渲染当前排列（0 表示未填）；setAux 展示当前位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beautifulArrangement, type BeautifulArrangementHooks } from './impl.ts';

export const DEFAULT_INPUT = 4;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const arr: number[] = new Array<number>(n).fill(0);
  let count = 0;

  const render = (note: { zh: string; en: string }, pos: number | null, final: boolean): void => {
    const roles: BarRole[] = arr.map((v, idx) => {
      if (final) return 'final';
      if (v === 0) return 'default';
      if (pos !== null && idx === pos - 1) return 'pivot';
      return 'sorted';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos !== null && !final) pointers.push({ index: pos - 1, label: `pos ${pos}` });
    rec
      .begin(note)
      .setArray([...arr], roles, pointers)
      .setAux([
        { label: '当前位置 pos', value: pos !== null ? String(pos) : '-', role: 'pivot' },
        { label: '已找到', value: String(count), role: 'default' },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `统计 1..${n} 的优美排列（第 i 位满足整除约束）`,
      en: `Count beautiful arrangements of 1..${n}`,
    })
    .setArray(
      arr,
      arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: BeautifulArrangementHooks = {
    onPlace: (pos, value, a) => {
      arr.length = 0;
      arr.push(...a);
      render({ zh: `pos ${pos} 放入 ${value}`, en: `pos ${pos} = ${value}` }, pos, false);
    },
    onReject: (_pos, _value) => {
      void 0;
    },
    onBacktrack: (pos, _value, a) => {
      arr.length = 0;
      arr.push(...a);
      render({ zh: `回溯 pos ${pos}`, en: `Backtrack pos ${pos}` }, pos, false);
    },
    onArrangement: (a) => {
      count++;
      arr.length = 0;
      arr.push(...a);
      render(
        {
          zh: `优美排列 #${count}：[${a.join(', ')}]`,
          en: `Arrangement #${count}: [${a.join(', ')}]`,
        },
        null,
        true,
      );
    },
  };

  const total = beautifulArrangement(n, hooks);

  rec
    .begin({ zh: `完成：共 ${total} 个优美排列`, en: `Done: ${total} beautiful arrangements` })
    .setArray(new Array(n).fill(total), new Array(n).fill('final' as BarRole), [])
    .setAux([{ label: '优美排列总数', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
