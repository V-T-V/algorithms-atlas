import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Instance, attack, type TypeObj } from './impl.ts';
const dragon: TypeObj = { name: 'dragon', maxHp: 30, attack: 8 };
const hero: TypeObj = { name: 'hero', maxHp: 20, attack: 5 };
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '类型对象', en: 'Type Object' }).commit();
  const d = new Instance(dragon);
  const h = new Instance(hero);
  for (let i = 0; i < 4; i++) {
    attack(h, d, {
      onHit: (_t, dmg, hp) =>
        rec
          .begin({ zh: 'hero -> dragon -' + dmg + ' hp=' + hp, en: 'hit' })
          .setAux([
            { label: 'dmg', value: String(dmg), role: 'compare' as BarRole },
            { label: 'hp', value: String(hp), role: 'final' as BarRole },
          ])
          .commit(),
    });
    if (d.hp === 0) break;
  }
  rec
    .begin({ zh: d.hp === 0 ? 'dragon 死' : 'dragon hp ' + d.hp, en: 'done' })
    .setAux([{ label: 'hp', value: String(d.hp), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
