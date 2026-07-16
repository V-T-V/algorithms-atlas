import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TreeFactory, Forest } from './impl.ts';

interface TreeSpec {
  name: string;
  color: string;
  texture: string;
  x: number;
  y: number;
}
interface TraceInput {
  trees: TreeSpec[];
}
export const DEFAULT_INPUT: TraceInput = {
  trees: [
    { name: 'oak', color: 'green', texture: 'rough', x: 1, y: 2 },
    { name: 'oak', color: 'green', texture: 'rough', x: 5, y: 6 },
    { name: 'pine', color: 'dark', texture: 'smooth', x: 3, y: 4 },
    { name: 'oak', color: 'green', texture: 'rough', x: 7, y: 8 },
  ],
};

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks = {
    onCreate: (key: string, total: number) =>
      rec
        .begin({
          zh: `新建享元 "${key}"（池大小 ${total}）`,
          en: `Create flyweight "${key}" (pool ${total})`,
        })
        .setAux([
          { label: '池大小', value: String(total), role: 'frontier' as BarRole },
          { label: 'key', value: key, role: 'compare' as BarRole },
        ])
        .commit(),
    onReuse: (key: string, total: number) =>
      rec
        .begin({
          zh: `复用享元 "${key}"（池大小 ${total}）`,
          en: `Reuse flyweight "${key}" (pool ${total})`,
        })
        .setAux([
          { label: '池大小', value: String(total), role: 'sorted' as BarRole },
          { label: 'key', value: key, role: 'compare' as BarRole },
        ])
        .commit(),
    onPlant: (key: string, x: number, y: number, total: number) =>
      rec
        .begin({
          zh: `种树 "${key}" @ (${x},${y})（总树数 ${total}）`,
          en: `Plant "${key}" @ (${x},${y}) (${total} trees)`,
        })
        .setAux([{ label: '树数', value: String(total), role: 'pivot' as BarRole }])
        .commit(),
  };
  const factory = new TreeFactory(hooks);
  const forest = new Forest(factory, hooks);
  rec
    .begin({ zh: '准备种森林', en: 'Ready to plant forest' })
    .setAux([{ label: '总种植', value: String(input.trees.length), role: 'default' as BarRole }])
    .commit();
  for (const t of input.trees) forest.plant(t.name, t.color, t.texture, t.x, t.y);
  rec
    .begin({
      zh: `总树数 ${forest.treeCount()}，独特享元 ${factory.poolSize()}`,
      en: `Total trees ${forest.treeCount()}, unique flyweights ${factory.poolSize()}`,
    })
    .setAux([
      { label: '树数', value: String(forest.treeCount()), role: 'final' as BarRole },
      { label: '享元', value: String(factory.poolSize()), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
