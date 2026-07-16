// =============================================================================
// 作用域解析 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runScopes, type ScopeEvent, type ScopeHooks } from './impl.ts';

export const DEFAULT_INPUT: ScopeEvent[] = [
  { kind: 'declare', name: 'x', type: 'int' }, // global x
  { kind: 'push', name: 'func_body' },
  { kind: 'declare', name: 'x', type: 'string' }, // 屏蔽外层
  { kind: 'declare', name: 'y', type: 'int' },
  { kind: 'use', name: 'x' }, // 应解析到 func_body 的 string
  { kind: 'push', name: 'inner_block' },
  { kind: 'declare', name: 'z', type: 'bool' },
  { kind: 'use', name: 'x' }, // 仍是 func_body 的 string（链上找）
  { kind: 'use', name: 'w' }, // 未定义
  { kind: 'pop' },
  { kind: 'pop' },
  { kind: 'use', name: 'x' }, // 回到 global 的 int
];

export function buildTrace(input: ScopeEvent[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `建立全局作用域，开始处理 ${input.length} 个事件。`,
      en: `Create global scope, processing ${input.length} events.`,
    })
    .setAux([
      { label: '事件数', value: String(input.length), role: 'compare' as BarRole },
      { label: '当前深度', value: '0', role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: ScopeHooks = {
    onPush: (scope) => {
      rec
        .begin({
          zh: `进入作用域 ${scope.name}（深度 ${scope.depth}）`,
          en: `Enter scope ${scope.name} (depth ${scope.depth})`,
        })
        .setAux([
          { label: '事件', value: 'push', role: 'pivot' as BarRole },
          { label: '作用域', value: scope.name, role: 'compare' as BarRole },
          { label: '深度', value: String(scope.depth), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onPop: (scope) => {
      rec
        .begin({ zh: `退出作用域 ${scope.name}`, en: `Leave scope ${scope.name}` })
        .setAux([
          { label: '事件', value: 'pop', role: 'pivot' as BarRole },
          { label: '作用域', value: scope.name, role: 'compare' as BarRole },
        ])
        .commit();
    },
    onDeclare: (info, scope) => {
      rec
        .begin({
          zh: `${scope.name}：声明 ${info.name}:${info.type}`,
          en: `${scope.name}: declare ${info.name}:${info.type}`,
        })
        .setAux([
          { label: '事件', value: 'declare', role: 'pivot' as BarRole },
          { label: '名字', value: info.name, role: 'compare' as BarRole },
          { label: '类型', value: info.type, role: 'frontier' as BarRole },
          { label: '作用域', value: scope.name, role: 'default' as BarRole },
        ])
        .commit();
    },
    onResolve: (name, found, depth) => {
      rec
        .begin({
          zh: found ? `解析 ${name}：在深度 ${depth} 命中` : `错误：未定义 ${name}`,
          en: found ? `Resolve ${name}: hit at depth ${depth}` : `Error: undefined ${name}`,
        })
        .setAux([
          { label: '事件', value: 'use', role: 'pivot' as BarRole },
          { label: '名字', value: name, role: 'compare' as BarRole },
          {
            label: '结果',
            value: found ? `FOUND@${depth}` : 'UNDEFINED',
            role: (found ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
  };

  const { errors, shadows } = runScopes(input, hooks);

  rec
    .begin({
      zh: `完成：${errors.length} 个未定义错误，${shadows.length} 处屏蔽。`,
      en: `Done: ${errors.length} undefined, ${shadows.length} shadows.`,
    })
    .setAux([
      {
        label: '未定义错误',
        value: String(errors.length),
        role: (errors.length > 0 ? 'warn' : 'final') as BarRole,
      },
      { label: '屏蔽次数', value: String(shadows.length), role: 'compare' as BarRole },
      {
        label: '屏蔽列表',
        value: shadows.map((s) => `${s.name}@${s.inner}↹${s.outer}`).join(', ') || '—',
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
