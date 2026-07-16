// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildCart, predictCart } from './impl.ts';
const X = [
  [1, 1],
  [2, 1],
  [5, 5],
  [6, 5],
];
const y = [0, 0, 1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (function () {
    const t = buildCart(X, y);
    return X.filter((x, i) => predictCart(t, x) === y[i]).length;
  })();
  rec
    .begin({ zh: 'CART 构建完成', en: 'CART built' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
