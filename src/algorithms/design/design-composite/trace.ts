import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { File, Directory } from './impl.ts';

export const DEFAULT_INPUT = 'tree';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks = {
    onVisit: (name: string, kind: 'file' | 'dir', size: number) =>
      rec
        .begin({
          zh: `访问 ${kind === 'dir' ? '目录' : '文件'} "${name}" size=${size}`,
          en: `Visit ${kind} "${name}" size=${size}`,
        })
        .setAux([
          { label: '类型', value: kind, role: (kind === 'dir' ? 'pivot' : 'compare') as BarRole },
          { label: '大小', value: String(size), role: 'frontier' as BarRole },
        ])
        .commit(),
    onResult: (totalSize: number, totalNodes: number) =>
      rec
        .begin({
          zh: `总大小 ${totalSize}，总节点 ${totalNodes}`,
          en: `Total size ${totalSize}, nodes ${totalNodes}`,
        })
        .setAux([
          { label: '大小', value: String(totalSize), role: 'final' as BarRole },
          { label: '节点', value: String(totalNodes), role: 'sorted' as BarRole },
        ])
        .commit(),
  };
  const root = new Directory('root', hooks);
  const src = new Directory('src', hooks)
    .add(new File('a.ts', 100, hooks))
    .add(new File('b.ts', 200, hooks));
  const docs = new Directory('docs', hooks).add(new File('readme.md', 50, hooks));
  root
    .add(src)
    .add(docs)
    .add(new File('package.json', 30, hooks));
  rec
    .begin({ zh: `计算 root 大小（模式 ${input}）`, en: `Compute root size (mode ${input})` })
    .setAux([{ label: '根', value: 'root', role: 'default' as BarRole }])
    .commit();
  const total = root.size();
  hooks.onResult?.(total, root.count());
  return rec.build();
}
