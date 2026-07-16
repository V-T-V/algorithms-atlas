// =============================================================================
// 球面距离（Haversine）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { haversine, type LatLng } from './impl.ts';

export const DEFAULT_INPUT = {
  p1: { lat: 48.8566, lng: 2.3522 }, // Paris
  p2: { lat: 51.5074, lng: -0.1278 }, // London
};

export function buildTrace(input: { p1: LatLng; p2: LatLng } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { p1, p2 } = input;

  rec
    .begin({
      zh: `Haversine：(${p1.lat},${p1.lng}) → (${p2.lat},${p2.lng})`,
      en: `Haversine: (${p1.lat},${p1.lng}) → (${p2.lat},${p2.lng})`,
    })
    .setAux([
      { label: '点 1', value: `${p1.lat}, ${p1.lng}`, role: 'pivot' },
      { label: '点 2', value: `${p2.lat}, ${p2.lng}`, role: 'pivot' },
      { label: '地球半径', value: '6371 km', role: 'frontier' },
    ])
    .commit();

  const result = haversine(p1, p2, {
    onTerm: (a) => {
      rec
        .begin({
          zh: `中间量 a = ${a.toFixed(6)}，c = 2·asin(√a)`,
          en: `intermediate a = ${a.toFixed(6)}, c = 2·asin(√a)`,
        })
        .setAux([
          { label: 'a', value: a.toFixed(6), role: 'compare' },
          { label: '√a', value: Math.sqrt(a).toFixed(6), role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: `完成：大圆距离 ≈ ${result.toFixed(2)} km`,
      en: `Done: great-circle distance ≈ ${result.toFixed(2)} km`,
    })
    .setAux([{ label: '距离', value: result.toFixed(2) + ' km', role: 'final' }])
    .commit();

  return rec.build();
}
