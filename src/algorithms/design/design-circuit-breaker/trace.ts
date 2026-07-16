import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';

// 同步模拟熔断器状态机以录制交互帧（真实 cb.call 是 async，trace 须同步返回）。
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  let failures = 0;
  const call = (ok: boolean): void => {
    if (state === 'OPEN') {
      rec
        .begin({ zh: `[OPEN] 拒绝`, en: `[OPEN] reject` })
        .setAux([{ label: 'reject', value: 'OPEN', role: 'warn' as BarRole }])
        .commit();
      return;
    }
    if (ok) {
      const prev = state;
      state = 'CLOSED';
      failures = 0;
      rec
        .begin({ zh: `[${prev}] 成功 → CLOSED`, en: `[${prev}] ok → CLOSED` })
        .setAux([{ label: 'ok', value: 'CLOSED', role: 'final' as BarRole }])
        .commit();
    } else {
      failures++;
      if (state === 'HALF_OPEN') {
        state = 'OPEN';
        rec
          .begin({ zh: `[HALF_OPEN] 失败 → OPEN`, en: `[HALF_OPEN] fail → OPEN` })
          .setAux([{ label: 'fail', value: 'OPEN', role: 'warn' as BarRole }])
          .commit();
      } else if (failures >= 2) {
        state = 'OPEN';
        rec
          .begin({ zh: `[CLOSED] 失败×${failures} → OPEN`, en: `[CLOSED] fail×${failures} → OPEN` })
          .setAux([{ label: 'fail', value: 'OPEN', role: 'warn' as BarRole }])
          .commit();
      } else {
        rec
          .begin({ zh: `[CLOSED] 失败 ${failures}/2`, en: `[CLOSED] fail ${failures}/2` })
          .setAux([{ label: 'fail', value: String(failures), role: 'warn' as BarRole }])
          .commit();
      }
    }
  };
  rec.begin({ zh: '熔断器模拟', en: 'Circuit Breaker' }).commit();
  call(false);
  call(false); // 2 次失败触发 OPEN
  call(true); // OPEN 状态下被拒绝
  rec.begin({ zh: '超时后转 HALF_OPEN 试探', en: 'timeout → HALF_OPEN probe' }).commit();
  state = 'HALF_OPEN';
  call(true); // 试探成功 → CLOSED
  return rec.build();
}
