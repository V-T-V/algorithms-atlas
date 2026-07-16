import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Core, type Role } from './impl.ts';
const buyer: Role = { play: () => 'buy' };
const payer: Role = { play: () => 'pay' };
export const DEFAULT_INPUT: any = [['buyer'], ['payer'], ['buyer']];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '角色对象', en: 'Role Object' }).commit();
  const c = new Core();
  for (const [name] of input) {
    const existing = c.as(name!);
    if (!existing)
      c.addRole(name!, name === 'buyer' ? buyer : payer, {
        onAdd: (n) =>
          rec
            .begin({ zh: '挂载 ' + n, en: 'add role' })
            .setAux([{ label: 'role', value: n, role: 'compare' as BarRole }])
            .commit(),
      });
    else
      rec
        .begin({ zh: '已有 ' + name, en: 'exists' })
        .setAux([{ label: 'role', value: name!, role: 'warn' as BarRole }])
        .commit();
  }
  rec
    .begin({ zh: '共 ' + c.count() + ' 角色', en: c.count() + ' roles' })
    .setAux([{ label: 'roles', value: String(c.count()), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
