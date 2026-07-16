import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { VendingContext, IdleState } from './impl.ts';

export const DEFAULT_INPUT = ['insert', 'insert', 'dispense', 'refund'];

type Op = string;

export function buildTrace(input: readonly Op[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const ctx = new VendingContext(new IdleState(), {
    onTransition: (from, to, event) =>
      rec
        .begin({
          zh: `状态 ${from} → ${to}（事件 ${event}）`,
          en: `State ${from} → ${to} (event ${event})`,
        })
        .setAux([
          { label: '从', value: from, role: 'compare' as BarRole },
          { label: '到', value: to, role: 'frontier' as BarRole },
        ])
        .commit(),
    onAction: (state, event, result) =>
      rec
        .begin({ zh: `[${state}] ${event} → ${result}`, en: `[${state}] ${event} → ${result}` })
        .setAux([
          { label: '当前状态', value: state, role: 'pivot' as BarRole },
          { label: '硬币', value: String(ctx.coins), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: `初始状态 idle，硬币 0`, en: `Initial state idle, coins 0` })
    .setAux([{ label: '状态', value: 'idle', role: 'default' as BarRole }])
    .commit();
  for (const op of input) {
    if (op === 'insert') ctx.insertCoin();
    else if (op === 'dispense') ctx.dispense();
    else if (op === 'refund') ctx.refund();
  }
  rec
    .begin({
      zh: `最终状态 ${ctx.state.name}，硬币 ${ctx.coins}`,
      en: `Final state ${ctx.state.name}, coins ${ctx.coins}`,
    })
    .setAux([
      { label: '状态', value: ctx.state.name, role: 'final' as BarRole },
      { label: '硬币', value: String(ctx.coins), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
