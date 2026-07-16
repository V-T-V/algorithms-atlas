import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Goblin, Dragon, MonsterProtoRegistry } from './impl.ts';

export const DEFAULT_INPUT = 'spawn';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  MonsterProtoRegistry.reset();
  MonsterProtoRegistry.setHooks({
    onClone: (typeName, originalId, newId) =>
      rec
        .begin({
          zh: `克隆 ${typeName}：#${originalId} → #${newId}`,
          en: `Clone ${typeName}: #${originalId} → #${newId}`,
        })
        .setAux([
          { label: '类型', value: typeName, role: 'compare' as BarRole },
          { label: '新 ID', value: String(newId), role: 'frontier' as BarRole },
        ])
        .commit(),
    onRegister: (typeName, total) =>
      rec
        .begin({
          zh: `注册原型 ${typeName}（共 ${total} 个）`,
          en: `Register ${typeName} (${total} total)`,
        })
        .setAux([{ label: '原型数', value: String(total), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '注册怪物原型', en: 'Register monster prototypes' })
    .setAux([{ label: '操作', value: input, role: 'default' as BarRole }])
    .commit();
  MonsterProtoRegistry.register('goblin', new Goblin(0, 'goblin', 30, { x: 0, y: 0 }));
  MonsterProtoRegistry.register(
    'dragon',
    new Dragon(0, 'dragon', 200, { x: 5, y: 5 }, ['gold', 'gem']),
  );
  const spawns: string[] = [];
  for (let i = 0; i < 3; i++) {
    const m = MonsterProtoRegistry.create('goblin');
    if (m) spawns.push(`${m.type}#${m.id}`);
  }
  const d = MonsterProtoRegistry.create('dragon');
  if (d) spawns.push(`${d.type}#${d.id}`);
  rec
    .begin({ zh: `生成：${spawns.join(', ')}`, en: `Spawned: ${spawns.join(', ')}` })
    .setAux([{ label: '生成数', value: String(spawns.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
