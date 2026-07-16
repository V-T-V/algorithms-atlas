// Android 解锁模式枚举 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btAndroidUnlock, type BtAndroidUnlockHooks } from './impl.ts';

export const DEFAULT_INPUT = { length: 3 };

export function buildTrace(input: { length: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { length } = input;

  rec
    .begin({
      zh: `枚举长度 ${length} 的解锁模式`,
      en: `Enumerate unlock patterns of length ${length}`,
    })
    .setAux([{ label: 'length', value: String(length), role: 'pivot' }])
    .commit();

  let count = 0;
  const hooks: BtAndroidUnlockHooks = {
    onPattern: (path) => {
      count++;
      rec
        .begin({ zh: `模式：${path.join('→')}`, en: `Pattern: ${path.join('->')}` })
        .setAux([
          { label: 'pattern', value: path.join('→'), role: 'final' },
          { label: 'count', value: String(count), role: 'pivot' },
        ])
        .commit();
    },
  };

  const result = btAndroidUnlock(length, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个模式`, en: `Done: ${result.length} patterns` })
    .setBars([{ value: result.length, role: 'final' as BarRole }])
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
