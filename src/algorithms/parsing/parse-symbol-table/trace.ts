// =============================================================================
// 符号表管理 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSymbolTable, type BuildHooks, type SymbolInfo } from './impl.ts';

interface BuildEvent {
  kind: 'declare' | 'use';
  info?: SymbolInfo;
  name?: string;
}

export const DEFAULT_INPUT: BuildEvent[] = [
  { kind: 'declare', info: { name: 'x', kind: 'var', type: 'int', offset: 0, line: 1 } },
  { kind: 'declare', info: { name: 'y', kind: 'var', type: 'int', offset: 4, line: 2 } },
  { kind: 'declare', info: { name: 'add', kind: 'func', type: 'int->int->int', line: 3 } },
  { kind: 'declare', info: { name: 'x', kind: 'var', type: 'int', line: 4 } }, // 重复
  { kind: 'use', name: 'x' },
  { kind: 'use', name: 'z' }, // 未定义
  { kind: 'use', name: 'add' },
];

export function buildTrace(input: BuildEvent[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `开始构建符号表（作用域 global）。处理 ${input.length} 个事件。`,
      en: `Building symbol table (scope global). ${input.length} events.`,
    })
    .setAux([
      { label: '阶段', value: '初始化', role: 'pivot' as BarRole },
      { label: '事件数', value: String(input.length), role: 'compare' as BarRole },
    ])
    .commit();

  const events = input.map((e) =>
    e.kind === 'declare'
      ? ({ kind: 'declare', info: e.info! } as { kind: 'declare'; info: SymbolInfo })
      : ({ kind: 'use', name: e.name! } as { kind: 'use'; name: string }),
  );

  const hooks: BuildHooks = {
    onEnter: (info, ok) => {
      rec
        .begin({
          zh: ok
            ? `登记符号 ${info.name}（${info.kind} : ${info.type}）`
            : `错误：重复定义 ${info.name}`,
          en: ok
            ? `Enter symbol ${info.name} (${info.kind} : ${info.type})`
            : `Error: redefinition ${info.name}`,
        })
        .setAux([
          { label: '事件', value: 'declare', role: 'pivot' as BarRole },
          { label: '名字', value: info.name, role: 'compare' as BarRole },
          { label: '类型', value: `${info.kind}:${info.type}`, role: 'frontier' as BarRole },
          {
            label: '结果',
            value: ok ? 'OK' : 'REDEFINE',
            role: (ok ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
    onLookup: (name, found) => {
      rec
        .begin({
          zh: found ? `查找 ${name}：命中` : `错误：未定义引用 ${name}`,
          en: found ? `Lookup ${name}: hit` : `Error: undefined ${name}`,
        })
        .setAux([
          { label: '事件', value: 'use', role: 'pivot' as BarRole },
          { label: '名字', value: name, role: 'compare' as BarRole },
          {
            label: '结果',
            value: found ? 'FOUND' : 'UNDEFINED',
            role: (found ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
  };

  const { table, errors } = buildSymbolTable(events, 'global', hooks);

  rec
    .begin({
      zh: `完成：符号表 ${table.size} 项，${errors.length} 个错误。`,
      en: `Done: ${table.size} symbols, ${errors.length} errors.`,
    })
    .setAux([
      { label: '符号总数', value: String(table.size), role: 'final' as BarRole },
      {
        label: '错误数',
        value: String(errors.length),
        role: (errors.length > 0 ? 'warn' : 'final') as BarRole,
      },
      {
        label: '符号表',
        value: table
          .entries()
          .map((s) => `${s.name}=${s.kind}:${s.type}`)
          .join(', '),
        role: 'frontier' as BarRole,
      },
      {
        label: '错误列表',
        value: errors.join('; ') || '—',
        role: 'warn' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
