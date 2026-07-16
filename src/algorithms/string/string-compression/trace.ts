// =============================================================================
// 字符串压缩 · 录制帧序列
// setArray 展示字符串（字符码），pointer 标注当前游程；setAux 展示压缩结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stringCompression, type StringCompressionHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabcccccaaa';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  let curStart = -1;
  let curEnd = -1;
  let roleTip: BarRole = 'default';
  let compressed = '';

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'out', value: compressed || '-', role: 'frontier' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (curStart >= 0) {
      pointers.push({ index: curStart, label: 'l' });
      if (curEnd < n) pointers.push({ index: curEnd, label: 'r' });
      for (let k = curStart; k <= curEnd && k < n; k++) roles[k] = roleTip;
    }
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux()).commit();
    roleTip = 'default';
  };

  snap({ zh: `压缩：${s}`, en: `Compress: ${s}` });

  const hooks: StringCompressionHooks = {
    onSegment: (ch, count) => {
      curStart = curEnd + 1;
      curEnd = curStart + count - 1;
      roleTip = 'compare';
      snap({ zh: `段 '${ch}' × ${count}`, en: `Segment '${ch}' x ${count}` });
    },
    onWrite: (ch) => {
      compressed += ch;
      roleTip = 'final';
      snap({ zh: `写入 '${ch}'`, en: `Write '${ch}'` });
    },
    onDone: () => {},
  };

  stringCompression(s, hooks);

  curStart = -1;
  curEnd = -1;
  rec
    .begin({ zh: `完成：'${compressed}'`, en: `Done: '${compressed}'` })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux(aux())
    .commit();
  return rec.build();
}
