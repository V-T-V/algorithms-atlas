import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Money } from './impl.ts';
export const DEFAULT_INPUT: any = { amount: 10, currency: 'USD' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '不可变值对象', en: 'Immutable' }).commit();
  const m1 = new Money(input.amount, input.currency);
  const m2 = m1.multiply(3);
  rec
    .begin({ zh: 'm1 ' + m1.amount + ' ' + m1.currency, en: 'm1' })
    .setAux([{ label: 'amount', value: String(m1.amount), role: 'compare' as BarRole }])
    .commit();
  rec
    .begin({ zh: 'm2=m1*3 -> ' + m2.amount, en: 'm2' })
    .setAux([{ label: 'amount', value: String(m2.amount), role: 'final' as BarRole }])
    .commit();
  rec
    .begin({ zh: 'm1 不变 ' + m1.amount, en: 'unchanged' })
    .setAux([{ label: 'm1', value: String(m1.amount), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
