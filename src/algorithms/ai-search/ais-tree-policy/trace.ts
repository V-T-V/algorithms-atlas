import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treePolicy, makeTPNode, ucb1, type TPNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化树策略`, en: `Init tree policy` })
    .setAux([{ label: '方法', value: 'UCB1 选择+扩展', role: 'compare' as BarRole }])
    .commit();

  // 构造简单树：根有 3 动作
  const root = makeTPNode(null);
  root.untried = [0, 1, 2];
  root.visits = 10; // 模拟已访问
  const legalActions = (): number[] => [0, 1, 2];
  const isTerminal = (n: TPNode): boolean =>
    n.untried.length === 0 && n.children.size === 0 && n.visits > 0;
  const apply = (parent: TPNode, action: number): TPNode => {
    const child = makeTPNode(parent);
    child.visits = 1;
    child.wins = 0;
    void action;
    return child;
  };

  // 先手动扩展 3 个子节点
  for (const a of [0, 1, 2]) {
    const child = apply(root, a);
    child.visits = 3;
    child.wins = a; // 动作 a 赢 a 次
    root.children.set(a, child);
  }
  root.untried = [];

  treePolicy(root, legalActions, isTerminal, apply, {
    onSelect: (action, ucb) => {
      rec
        .begin({
          zh: `选择动作 ${action} UCB=${ucb.toFixed(3)}`,
          en: `select action ${action} UCB=${ucb.toFixed(3)}`,
        })
        .setBars(
          [...root.children.entries()].map(([a, ch]) => ({
            value: ch.wins / ch.visits,
            role: (a === action ? 'final' : 'default') as BarRole,
            label: `a${a}:${ch.wins}/${ch.visits}`,
          })),
        )
        .setAux([{ label: 'UCB', value: ucb.toFixed(3), role: 'compare' as BarRole }])
        .commit();
    },
    onExpand: (action) => {
      rec
        .begin({ zh: `扩展动作 ${action}`, en: `expand action ${action}` })
        .setBars([{ value: 0.5, role: 'final' as BarRole, label: `新节点 a${action}` }])
        .setAux([{ label: '动作', value: String(action), role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([{ label: '说明', value: '树策略演示', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

void ucb1;
