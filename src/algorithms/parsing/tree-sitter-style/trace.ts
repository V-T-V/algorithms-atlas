// =============================================================================
// 增量解析器（tree-sitter 风格）· 录制帧序列
// 用 tree 可视化展示逐步生长的语法树（含 ERROR/MISSING 节点），
// 用 aux 展示源码、当前 token、事件日志、错误计数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseProgram, type IncrementalHooks, type SyntaxNode, DEMO_SOURCE } from './impl.ts';

export const DEFAULT_INPUT = DEMO_SOURCE;

/** 把 SyntaxNode 转 TreeNode（用于 setTree），同时精简显示。 */
function toTreeNode(n: SyntaxNode): import('../../../types.ts').TreeNode {
  const role: BarRole = n.isError
    ? 'warn'
    : n.isMissing
      ? 'compare'
      : n.children && n.children.length > 0
        ? 'pivot'
        : 'default';
  return {
    id: n.id,
    value: n.value,
    role,
    children: n.children?.map(toTreeNode),
  };
}

/** 深拷贝 TreeNode。 */
function cloneTreeNode(
  n: import('../../../types.ts').TreeNode,
): import('../../../types.ts').TreeNode {
  return {
    id: n.id,
    value: n.value,
    role: n.role,
    edgeLabel: n.edgeLabel,
    children: n.children?.map(cloneTreeNode),
  };
}

export function buildTrace(src: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const events: string[] = [];
  let errorCount = 0;
  let missingCount = 0;
  let curToken = '';

  const snapshot = (note: { zh: string; en: string }, root: SyntaxNode | null): void => {
    rec.begin(note);
    if (root) rec.setTree(cloneTreeNode(toTreeNode(root)));
    rec
      .setAux([
        { label: '源码', value: src, role: 'compare' as BarRole },
        { label: '当前 token', value: curToken || '—', role: 'frontier' as BarRole },
        {
          label: '错误数',
          value: String(errorCount),
          role: errorCount > 0 ? ('warn' as BarRole) : ('default' as BarRole),
        },
        {
          label: '缺失数',
          value: String(missingCount),
          role: missingCount > 0 ? ('compare' as BarRole) : ('default' as BarRole),
        },
        { label: '事件', value: events.slice(-3).join(' ; ') || '—', role: 'default' as BarRole },
      ])
      .commit();
  };

  // 初始帧
  snapshot({ zh: `开始解析："${src}"`, en: `Begin parsing: "${src}"` }, null);

  // 记录最终树，中间帧用事件驱动
  const hooks: IncrementalHooks = {
    onEnter: (rule, p) => {
      events.push(`进入 ${rule}@${p}`);
    },
    onMatch: (token, kind, p) => {
      curToken = `${kind}:'${token}'@${p}`;
      events.push(`匹配 ${curToken}`);
    },
    onError: (token, p, reason) => {
      errorCount++;
      events.push(`错误 '${token}'@${p}: ${reason}`);
    },
    onMissing: (expected, p) => {
      missingCount++;
      events.push(`缺失 ${expected}@${p}`);
    },
    onResult: (root, errs) => {
      events.push(`完成（${errs} 错误）`);
      snapshot({ zh: `解析完成：${errs} 个错误`, en: `Parse complete: ${errs} error(s)` }, root);
    },
  };

  // 跑一遍解析；为录制关键帧，我们在每条语句解析后做快照。
  // 实现：包装 parseProgram 的 onResult 不够细，故这里分两次：
  //   1) 完整跑一遍拿到最终树；
  //   2) 用 onEnter/onMatch 的事件流逐事件回放（每若干事件一帧）。
  // 简化：直接在解析过程中，利用 onEnter 的语句级回调录帧。
  // 为此用计数器：每进入 stmt 规则时截一次当前树。
  // 但 parseProgram 内部树是逐步构建的，外部拿不到中间树。
  // —— 采用更简单且等价的做法：对源码做「逐语句增量解析」模拟中间状态。 ——
  const stmtSources = splitStatements(src);
  let growingRoot: SyntaxNode | null = null;

  for (let i = 0; i < stmtSources.length; i++) {
    const partial = stmtSources.slice(0, i + 1).join('');
    const partialRes = parseProgram(partial);
    growingRoot = partialRes.root;
    errorCount = partialRes.errorCount;
    missingCount = partialRes.missingCount;
    curToken = `语句#${i + 1}`;
    snapshot(
      {
        zh: `解析语句 #${i + 1}："${stmtSources[i]!.trim()}"`,
        en: `Parse statement #${i + 1}: "${stmtSources[i]!.trim()}"`,
      },
      growingRoot,
    );
  }

  // 最终帧：用带 hooks 的完整解析（确保 onResult 事件被记录）
  const final = parseProgram(src, hooks);
  void final;

  return rec.build();
}

/** 把源码按 ';' 分割成语句片段（保留分隔符）。 */
function splitStatements(src: string): string[] {
  const out: string[] = [];
  let cur = '';
  for (const ch of src) {
    cur += ch;
    if (ch === ';') {
      out.push(cur);
      cur = '';
    }
  }
  if (cur.trim().length > 0) out.push(cur);
  return out;
}
