// =============================================================================
// 正则 AST 优化 · 纯算法实现
// 复用 parse-regex-ast 的 RegexAst 类型；做保持语义的等价化简。
// =============================================================================

import type { RegexAst } from '../parse-regex-ast/impl.ts';

/** 判断是否 ε。 */
export function isEmpty(node: RegexAst): boolean {
  return node.kind === 'empty';
}

export interface OptimizeHooks {
  /** 每一轮化简后调用（pass 号、规则数）。 */
  onPass?: (pass: number, ruleCount: number) => void;
  onResult?: (before: RegexAst, after: RegexAst, passes: number, changed: boolean) => void;
}

/**
 * 一轮（递归）自底向上化简。返回 {node, changed}。
 * 不做选择排序去重（需多遍），只做局部等价变换。
 */
function simplifyOnce(node: RegexAst): { node: RegexAst; changed: boolean } {
  let changed = false;
  // 先递归子节点
  const recur = (n: RegexAst): RegexAst => {
    const r = simplifyOnce(n);
    if (r.changed) changed = true;
    return r.node;
  };

  switch (node.kind) {
    case 'empty':
    case 'char':
    case 'anychar':
    case 'class':
      return { node, changed: false };

    case 'concat': {
      const children: RegexAst[] = [];
      for (const ch of node.children) {
        const r = recur(ch);
        if (r.kind === 'empty') {
          changed = true; // 消去 ε
          continue;
        }
        // 扁平化嵌套 concat
        if (r.kind === 'concat') {
          changed = true;
          children.push(...r.children);
        } else {
          children.push(r);
        }
      }
      // 全空 → ε
      if (children.length === 0) return { node: { kind: 'empty' }, changed: true };
      // 单子 → 提升
      if (children.length === 1) return { node: children[0]!, changed: true };
      return { node: { kind: 'concat', children }, changed };
    }

    case 'alt': {
      let children: RegexAst[] = node.children.map(recur);
      // 扁平化嵌套 alt
      const flat: RegexAst[] = [];
      for (const ch of children) {
        if (ch.kind === 'alt') {
          changed = true;
          flat.push(...ch.children);
        } else {
          flat.push(ch);
        }
      }
      children = flat;
      // 单子 → 提升
      if (children.length === 1) return { node: children[0]!, changed: true };
      return { node: { kind: 'alt', children }, changed };
    }

    case 'star': {
      const child = recur(node.child);
      // (x*)* → x*，(x+)* → x*，x?* → x*，ε* → ε
      if (child.kind === 'star' || child.kind === 'plus') {
        changed = true;
        return { node: { kind: 'star', child: child.child }, changed };
      }
      if (child.kind === 'opt') {
        changed = true;
        return { node: { kind: 'star', child: child.child }, changed };
      }
      if (child.kind === 'empty') {
        changed = true;
        return { node: { kind: 'empty' }, changed };
      }
      return { node: { kind: 'star', child }, changed };
    }

    case 'plus': {
      const child = recur(node.child);
      // (x*)+ → x*（a** 可 0 次），(x+)+ → x+，ε+ → ε
      if (child.kind === 'star') {
        changed = true;
        return { node: { kind: 'star', child: child.child }, changed };
      }
      if (child.kind === 'empty') {
        changed = true;
        return { node: { kind: 'empty' }, changed };
      }
      return { node: { kind: 'plus', child }, changed };
    }

    case 'opt': {
      const child = recur(node.child);
      // (x*)? → x*，(x+)? → x*，ε? → ε
      if (child.kind === 'star' || child.kind === 'plus') {
        changed = true;
        return { node: { kind: 'star', child: child.child }, changed };
      }
      if (child.kind === 'empty') {
        changed = true;
        return { node: { kind: 'empty' }, changed };
      }
      return { node: { kind: 'opt', child }, changed };
    }
  }
}

/** alt 选项去重与排序（用规范的序列化串做 key）。需要 serialize 函数。 */
function dedupeAlt(node: RegexAst, serialize: (n: RegexAst) => string): RegexAst {
  switch (node.kind) {
    case 'empty':
    case 'char':
    case 'anychar':
    case 'class':
      return node;
    case 'concat':
      return { kind: 'concat', children: node.children.map((c) => dedupeAlt(c, serialize)) };
    case 'alt': {
      const seen = new Set<string>();
      const opts: RegexAst[] = [];
      for (const ch of node.children) {
        const sub = dedupeAlt(ch, serialize);
        const key = serialize(sub);
        if (!seen.has(key)) {
          seen.add(key);
          opts.push(sub);
        }
      }
      if (opts.length === 1) return opts[0]!;
      return { kind: 'alt', children: opts };
    }
    case 'star':
      return { kind: 'star', child: dedupeAlt(node.child, serialize) };
    case 'plus':
      return { kind: 'plus', child: dedupeAlt(node.child, serialize) };
    case 'opt':
      return { kind: 'opt', child: dedupeAlt(node.child, serialize) };
  }
}

/**
 * 优化正则 AST。最多迭代 maxPasses 轮直到不动点。
 *
 * @param root AST 根
 * @param serialize 序列化函数（用于去重），可传 serializeRegex
 * @param hooks 可选钩子
 */
export function optimizeRegex(
  root: RegexAst,
  serialize: (n: RegexAst) => string,
  maxPasses = 20,
  hooks: OptimizeHooks = {},
): { before: RegexAst; after: RegexAst; passes: number; changed: boolean } {
  const before = root;
  let cur = root;
  let passes = 0;
  let changedAny = false;
  for (let p = 1; p <= maxPasses; p++) {
    const ruleCountBefore = countRules(cur);
    const r = simplifyOnce(cur);
    cur = r.node;
    passes = p;
    if (r.changed) changedAny = true;
    // 去重 alt
    cur = dedupeAlt(cur, serialize);
    hooks.onPass?.(p, countRules(cur));
    if (!r.changed) break;
    // 不动点检测
    const ruleCountAfter = countRules(cur);
    if (ruleCountAfter === ruleCountBefore && p > 1) {
      // 规则数未变且本轮无变化 → 停
    }
  }
  hooks.onResult?.(before, cur, passes, changedAny);
  return { before, after: cur, passes, changed: changedAny };
}

/** 统计节点数（用于报告化简幅度）。 */
export function countRules(node: RegexAst): number {
  switch (node.kind) {
    case 'empty':
    case 'char':
    case 'anychar':
    case 'class':
      return 1;
    case 'concat':
    case 'alt':
      return 1 + node.children.reduce((s, n) => s + countRules(n), 0);
    case 'star':
    case 'plus':
    case 'opt':
      return 1 + countRules(node.child);
  }
}
