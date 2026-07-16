// =============================================================================
// 842 压缩 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { compress842, decompress842, type Op842Hooks } from './impl.ts';

export const DEFAULT_INPUT = [
  0, 0, 0, 0, 0, 0, 0, 0, 65, 65, 65, 65, 65, 65, 65, 65, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6,
  7, 8,
];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const opsLog: Array<{ type: string; desc: string }> = [];

  rec
    .begin({
      zh: `输入 ${input.length} 字节，按 8 字节块扫描`,
      en: `Input ${input.length} bytes, 8-byte blocks`,
    })
    .setAux([{ label: '块大小', value: '8', role: 'pivot' as BarRole }])
    .commit();

  const hooks: Op842Hooks = {
    onOp: (op) => {
      let desc = '';
      if (op.type === 'zeros') desc = '8×0';
      else if (op.type === 'repeat') desc = `${op.length}×${op.bytes![0]}`;
      else if (op.type === 'short-match') desc = `d=${op.distance}`;
      else desc = op.bytes!.join(',');
      opsLog.push({ type: op.type, desc });
    },
  };

  const ops = compress842(input, hooks);
  const restored = decompress842(ops);
  const ok = restored.length === input.length && restored.every((v, i) => v === input[i]);

  for (let i = 0; i < opsLog.length; i++) {
    const e = opsLog[i]!;
    rec
      .begin({
        zh: `块[${i}] ${e.type}: ${e.desc}`,
        en: `block[${i}] ${e.type}: ${e.desc}`,
      })
      .setAux([
        { label: '块', value: String(i), role: 'compare' as BarRole },
        { label: '类型', value: e.type, role: 'pivot' as BarRole },
        { label: '内容', value: e.desc, role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${ops.length} op，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${ops.length} ops, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'op 数', value: String(ops.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
