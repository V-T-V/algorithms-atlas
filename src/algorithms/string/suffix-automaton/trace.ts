// =============================================================================
// 后缀自动机 SAM · 录制帧序列
// 用 setGraph 展示 DAWG（后缀自动机的状态转移 DAG）：节点为状态，边为字符转移，
// 用虚线表示 link（后缀链接）。用 setAux 展示 link/len 表 + 匹配进度。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildSuffixAutomaton,
  samMatch,
  type SamHooks,
  type SamState,
  type SuffixAutomaton,
} from './impl.ts';

export const DEFAULT_INPUT = {
  text: 'aabab',
  pattern: 'aba',
};

/** 把状态按 len 做分层布局：x = len/maxLen，y 按同层内顺序均匀分布。 */
function layoutStates(states: SamState[]): Array<{ x: number; y: number }> {
  const n = states.length;
  if (n === 0) return [];
  const maxLen = Math.max(...states.map((s) => s.len)) || 1;
  // 按 len 分组
  const byLen = new Map<number, number[]>();
  for (const st of states) {
    const arr = byLen.get(st.len) ?? [];
    arr.push(st.id);
    byLen.set(st.len, arr);
  }
  const pos: Array<{ x: number; y: number }> = new Array(n);
  const pad = 0.1;
  for (const [, ids] of byLen) {
    const len = states[ids[0]!]!.len;
    const x = pad + (0.5 - pad) * 2 * (len / maxLen);
    const m = ids.length;
    ids.forEach((id, i) => {
      const y = m === 1 ? 0.5 : pad + (0.5 - pad) * 2 * (i / (m - 1));
      pos[id] = { x, y };
    });
  }
  return pos;
}

/** 把 SAM 渲染成 graph 节点与边（实线 = 转移；虚线由 setAux 说明）。 */
function renderSam(
  sam: SuffixAutomaton,
  highlight: Set<number>,
  curState: number,
  matchedLen: number,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const pos = layoutStates(sam.states);
  const nodes: GraphNode[] = sam.states.map((st) => {
    const p = pos[st.id]!;
    let role: BarRole = 'default';
    if (st.id === curState) role = 'compare';
    else if (highlight.has(st.id)) role = 'frontier';
    if (st.accept) role = role === 'default' ? 'sorted' : role;
    return {
      id: `s${st.id}`,
      label: `${st.id}:${st.len}`,
      x: p.x,
      y: p.y,
      role,
    };
  });
  const edges: GraphEdge[] = [];
  // 转移边：字符标签（多字符合并成字符串）暂存到 from-to 串，用于按需渲染；
  // GraphEdge 无 string label 字段，故拓扑用 role 表达，字符细节在 setAux 中查看。
  const labelByPair = new Map<string, string>();
  for (const st of sam.states) {
    for (const [ch, to] of st.next) {
      const key = `${st.id}->${to}`;
      labelByPair.set(key, (labelByPair.get(key) ?? '') + ch);
    }
  }
  for (const key of labelByPair.keys()) {
    const [fromStr, toStr] = key.split('->');
    edges.push({
      from: `s${fromStr}`,
      to: `s${toStr}`,
      role: Number(fromStr) === curState ? 'compare' : 'default',
      directed: true,
    });
  }
  void matchedLen;
  return { nodes, edges };
}

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pattern: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pattern } = input;

  // 边表（字符转移）逐步累积的可视化 SAM；先完整构造一次供渲染
  let live: SuffixAutomaton = buildSuffixAutomaton(text);
  let highlight = new Set<number>();
  let curState = 0;
  let matchedLen = 0;

  const auxRows = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const lenArr = live.states.map((st) => st.len);
    const linkArr = live.states.map((st) => (st.link >= 0 ? st.link : '-'));
    return [
      { label: 'text', value: text, role: 'pivot' },
      { label: 'len', value: `[${lenArr.join(',')}]`, role: 'default' },
      { label: 'link', value: `[${linkArr.join(',')}]`, role: 'default' },
      { label: '当前状态', value: `s${curState}`, role: 'compare' },
      { label: '已匹配', value: String(matchedLen), role: 'frontier' },
    ];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const { nodes, edges } = renderSam(live, highlight, curState, matchedLen);
    rec.begin(note).setGraph(nodes, edges).setAux(auxRows()).commit();
    highlight = new Set();
  };

  snapshot({
    zh: `对串 "${text}" 在线构建 SAM`,
    en: `Build SAM online for "${text}"`,
  });

  // 重新构建并产生步骤帧
  live = buildSuffixAutomaton(text, {
    onCreate: (id) => {
      curState = id;
      snapshot({
        zh: `插入字符 '${text[live.states[id]!.len - 1]}'，新建状态 s${id}（len=${live.states[id]!.len}）`,
        en: `Insert char '${text[live.states[id]!.len - 1]}', create s${id} (len=${live.states[id]!.len})`,
      });
    },
    onClone: (cloneId, originId) => {
      curState = cloneId;
      highlight = new Set([originId]);
      snapshot({
        zh: `克隆 s${originId} → s${cloneId}`,
        en: `Clone s${originId} → s${cloneId}`,
      });
    },
    onLink: (v, to) => {
      curState = v;
      highlight = new Set([to]);
      snapshot({
        zh: `link(s${v}) = s${to}`,
        en: `link(s${v}) = s${to}`,
      });
    },
    onTrans: (from, ch, to) => {
      curState = from;
      highlight = new Set([to]);
      snapshot({
        zh: `转移 trans(s${from}, '${ch}') = s${to}`,
        en: `Transition trans(s${from}, '${ch}') = s${to}`,
      });
    },
  });

  // 匹配阶段
  snapshot({
    zh: `在 SAM 上匹配模式 "${pattern}"`,
    en: `Match pattern "${pattern}" on SAM`,
  });
  curState = 0;
  matchedLen = 0;
  const hooks: SamHooks = {
    onMatchStep: (i, state, next, c, advanced) => {
      curState = next;
      highlight = new Set([state, next]);
      snapshot({
        zh: `读 '${c}'（i=${i}）${advanced ? `→ 跟随转移到 s${next}` : `→ 无转移，匹配中断`}`,
        en: `Read '${c}' (i=${i}) ${advanced ? `→ follow transition to s${next}` : `→ no transition, break`}`,
      });
    },
    onMatchLen: (m) => {
      matchedLen = m;
    },
  };
  const finalLen = samMatch(live, pattern, hooks);

  // 终态
  const full = finalLen === pattern.length;
  const fin = renderSam(live, new Set(), 0, finalLen);
  rec
    .begin({
      zh: full
        ? `"${pattern}" 是 "${text}" 的子串（完整匹配）`
        : `"${pattern}" 最长可匹配前缀长度 = ${finalLen}`,
      en: full
        ? `"${pattern}" is a substring of "${text}"`
        : `longest matchable prefix of "${pattern}" has length ${finalLen}`,
    })
    .setGraph(fin.nodes, fin.edges)
    .setAux([
      { label: '结果', value: full ? '是子串 / substring' : `最长匹配 ${finalLen}`, role: 'final' },
      ...auxRows(),
    ])
    .commit();

  return rec.build();
}
