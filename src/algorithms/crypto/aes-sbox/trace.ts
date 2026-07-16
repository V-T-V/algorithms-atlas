// AES S盒 · 录制帧序列：逐字节查表代换。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aesSbox, type AesSboxHooks } from './impl.ts';

export const DEFAULT_INPUT = [0x00, 0x01, 0x02, 0x53, 0xab, 0xff];

const hex = (x: number): string => x.toString(16).padStart(2, '0');

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out = [...input];
  const done = new Set<number>();
  let cursor = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = out.map((_, i) =>
      done.has(i) ? 'final' : i === cursor ? 'compare' : 'default',
    );
    const pointers = cursor >= 0 ? [{ index: cursor, label: 'i' }] : [];
    rec
      .begin(note)
      .setArray([...out], roles, pointers)
      .commit();
  };

  snapshot({ zh: `输入字节（${input.length} 字节）`, en: `Input bytes (${input.length} bytes)` });

  const hooks: AesSboxHooks = {
    onSubstitute: (i, b, r) => {
      cursor = i;
      snapshot({ zh: `S-Box[0x${hex(b)}] = 0x${hex(r)}`, en: `S-Box[0x${hex(b)}] = 0x${hex(r)}` });
      out[i] = r;
      snapshot({ zh: `写入第 ${i} 字节`, en: `Write byte ${i}` });
      done.add(i);
    },
  };

  aesSbox(input, hooks);

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
