import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cmac } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'cmac-data';
  rec.begin({ zh: 'CMAC 认证', en: 'CMAC auth' }).commit();
  const t = cmac(s, 0x12345678, {
    onConclude: (tag) =>
      rec
        .begin({ zh: `tag=0x${tag.toString(16)}`, en: `tag=0x${tag.toString(16)}` })
        .setAux([{ label: 'tag', value: '0x' + tag.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  void t;
  return rec.build();
}
