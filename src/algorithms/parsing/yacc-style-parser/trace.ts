// =============================================================================
// Yacc 风格解析器 · 录制帧序列
// 用 tree 展示逐步构建的 AST，用 aux 展示状态栈、值栈、当前动作。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  yaccParseAst,
  tokenize,
  RULES,
  ACTION_TABLE,
  GOTO_TABLE,
  ACTIONS,
  TERMINALS,
  NONTERMINALS,
  DEMO_SOURCE,
  type YaccHooks,
} from './impl.ts';

export const DEFAULT_INPUT = DEMO_SOURCE;

function cloneTree(n: TreeNode): TreeNode {
  return {
    id: n.id,
    value: n.value,
    role: n.role,
    edgeLabel: n.edgeLabel,
    children: n.children?.map(cloneTree),
  };
}

export function buildTrace(src: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tokens = tokenize(src);

  // 初始帧
  rec
    .begin({ zh: `开始移进-归约解析："${src}"`, en: `Begin shift-reduce parse: "${src}"` })
    .setAux([
      { label: '输入', value: src, role: 'compare' as BarRole },
      { label: '状态栈', value: '[0]', role: 'frontier' as BarRole },
      { label: '值栈', value: '[]', role: 'default' as BarRole },
      { label: '动作', value: '初始化', role: 'default' as BarRole },
    ])
    .commit();

  // 跑一遍解析收集事件 + 用 AST 构造器逐步建树
  const stateStackSnap: string[] = ['[0]'];
  const valueStackSnap: string[] = ['[]'];
  const actionSnap: string[] = ['初始化'];

  const hooks: YaccHooks = {
    onShift: (token, value, state) => {
      actionSnap.push(`移进 '${token}'(=${value}) → S${state}`);
    },
    onReduce: (rule, display, values, result) => {
      actionSnap.push(`归约 #${rule}: ${display} [${values.join(',')}] = ${result}`);
    },
    onResult: (acc, val) => {
      actionSnap.push(acc ? `接受，结果 = ${val}` : '错误');
    },
    onError: (token, state) => {
      actionSnap.push(`错误: token '${token}' @ S${state}`);
    },
  };

  // 为获取逐步栈状态，重写一个带栈追踪的解析循环
  // （复用 ACTION/GOTO 逻辑，但每步记录栈）
  {
    // 直接调用 yaccParse 拿事件；同时用一个并行栈追踪器
    // 为简洁，这里用 yaccParse 的 hook 序列推断栈状态
    // 更稳妥：跑一遍带栈镜像
    const stateStack: number[] = [0];
    const valueStack: number[] = [];
    let pos = 0;
    const snap = (): void => {
      stateStackSnap.push(`[${stateStack.join(',')}]`);
      valueStackSnap.push(`[${valueStack.join(',')}]`);
    };
    // 重新执行解析逻辑（与 impl 一致），每步拍照
    // 为避免重复代码，这里用一个轻量内联循环
    // 导入必要的表
    const ti = (k: string): number => TERMINALS.indexOf(k);
    const ni = (nt: string): number => NONTERMINALS.indexOf(nt);

    let stepCount = 0;
    while (pos < tokens.length && stepCount < 200) {
      stepCount++;
      const token = tokens[pos]!;
      const state = stateStack[stateStack.length - 1]!;
      const idx = ti(token.kind);
      if (idx < 0) break;
      const action = ACTION_TABLE[state]![idx]!;
      if (action.type === 'shift') {
        hooks.onShift?.(token.text, token.value, action.state);
        stateStack.push(action.state);
        valueStack.push(token.value);
        pos++;
        snap();
      } else if (action.type === 'reduce') {
        const def = RULES[action.rule]!;
        const popped: number[] = [];
        for (let i = 0; i < def.rhsLen; i++) {
          stateStack.pop();
          popped.unshift(valueStack.pop()!);
        }
        const newVal = ACTIONS[action.rule]!(popped);
        hooks.onReduce?.(action.rule, def.display, popped, newVal);
        const topState = stateStack[stateStack.length - 1]!;
        const gotoState = GOTO_TABLE[topState]![ni(def.lhs)]!;
        stateStack.push(gotoState);
        valueStack.push(newVal);
        snap();
      } else if (action.type === 'accept') {
        hooks.onResult?.(true, valueStack[valueStack.length - 1]!);
        break;
      } else {
        hooks.onError?.(token.text, state);
        break;
      }
    }
  }

  // 用 AST 构造器拿最终树（用于末帧）
  const astResult = yaccParseAst(tokens);

  // 关键帧录制：取若干代表性步骤（首步、最后几步、归约步）
  const reduceSteps: number[] = [];
  for (let i = 0; i < actionSnap.length; i++) {
    if (actionSnap[i]!.includes('归约') || actionSnap[i]!.includes('移进')) reduceSteps.push(i);
  }
  // 选最多 8 个关键步
  const sampled =
    reduceSteps.length > 8
      ? reduceSteps.filter((_, i) => i % Math.ceil(reduceSteps.length / 8) === 0)
      : reduceSteps;

  for (const stepIdx of sampled) {
    // 对每步，构造到该步为止的部分 AST（简化：仅显示当前栈状态）
    rec
      .begin({ zh: actionSnap[stepIdx]!.split('=')[0]!.trim(), en: actionSnap[stepIdx]! })
      .setAux([
        { label: '输入', value: src, role: 'compare' as BarRole },
        { label: '状态栈', value: stateStackSnap[stepIdx] ?? '[]', role: 'frontier' as BarRole },
        { label: '值栈', value: valueStackSnap[stepIdx] ?? '[]', role: 'default' as BarRole },
        {
          label: '动作',
          value: actionSnap[stepIdx] ?? '',
          role: actionSnap[stepIdx]!.includes('错误')
            ? ('warn' as BarRole)
            : ('default' as BarRole),
        },
      ])
      .commit();
  }

  // 最终帧：完整 AST + 结果
  rec.begin({ zh: '完成', en: 'Done' });
  if (astResult.ast) rec.setTree(cloneTree(astResult.ast));
  rec
    .setAux([
      {
        label: '结果',
        value: String(valueStackSnap[valueStackSnap.length - 1] ?? '错误'),
        role: 'final' as BarRole,
      },
      {
        label: '动作序列',
        value: actionSnap.slice(1).slice(-4).join(' ; '),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
