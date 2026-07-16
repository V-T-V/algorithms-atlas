import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ConfigSingleton } from './impl.ts';

export const DEFAULT_INPUT = [
  'set lang=en',
  'set theme=dark',
  'get lang',
  'get theme',
  'get missing',
];

type Op = string;

export function buildTrace(input: readonly Op[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  ConfigSingleton.reset();
  ConfigSingleton.setHooks({
    onCreate: () =>
      rec
        .begin({ zh: '首次创建单例', en: 'Singleton created (first time)' })
        .setAux([{ label: '事件', value: 'create', role: 'pivot' as BarRole }])
        .commit(),
    onAccess: (accessCount, key, value) =>
      rec
        .begin({
          zh: `读取 ${key} = ${value}（第 ${accessCount} 次访问）`,
          en: `Read ${key} = ${value} (access #${accessCount})`,
        })
        .setAux([
          { label: '访问次数', value: String(accessCount), role: 'frontier' as BarRole },
          { label: 'key', value: key, role: 'compare' as BarRole },
          {
            label: '值',
            value: value,
            role: (value === 'undefined' ? 'warn' : 'final') as BarRole,
          },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '开始使用单例', en: 'Start using singleton' })
    .setAux([{ label: '操作数', value: String(input.length), role: 'default' as BarRole }])
    .commit();
  const inst = ConfigSingleton.getInstance();
  for (const op of input) {
    if (op.startsWith('set ')) {
      const [, kv] = op.split('set ');
      const [k, v] = (kv ?? '').split('=');
      inst.set(k ?? '', v ?? '');
    } else if (op.startsWith('get ')) {
      const [, k] = op.split('get ');
      inst.get(k ?? '');
    }
  }
  rec
    .begin({
      zh: `总访问 ${inst.getAccessCount()} 次，键数 ${inst.keys().length}`,
      en: `${inst.getAccessCount()} total accesses, ${inst.keys().length} keys`,
    })
    .setAux([
      { label: '访问', value: String(inst.getAccessCount()), role: 'final' as BarRole },
      { label: '键', value: String(inst.keys().length), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
