import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { murmurFinalizer, avalancheScore } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const seed = 0x12345678;
  rec
    .begin({ zh: `fmix32 seed=0x${seed.toString(16)}`, en: `fmix32 seed=0x${seed.toString(16)}` })
    .commit();
  const out = murmurFinalizer(seed, {
    onStep: (s, h) =>
      rec
        .begin({ zh: `${s}: 0x${h.toString(16)}`, en: `${s}: 0x${h.toString(16)}` })
        .setAux([{ label: s, value: '0x' + h.toString(16), role: 'pivot' as BarRole }])
        .commit(),
  });
  const av = avalancheScore();
  rec
    .begin({
      zh: `hash=0x${out.toString(16)} 雪崩=${av.toFixed(1)}位`,
      en: `hash=0x${out.toString(16)} avalanche=${av.toFixed(1)}bits`,
    })
    .setAux([
      { label: 'hash', value: '0x' + out.toString(16), role: 'final' as BarRole },
      { label: 'avalanche', value: av.toFixed(1), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
