// =============================================================================
// 哈夫曼编码 Huffman Coding · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 哈夫曼树节点。叶子节点 ch 为字符、freq 为频次；内部节点 ch 为 null。 */
export interface HuffmanNode {
  /** 唯一 id（用于可视化与比较）。 */
  id: number;
  /** 叶子节点的字符（内部节点为 null）。 */
  ch: string | null;
  /** 该子树的总频次。 */
  freq: number;
  /** 左右子树。 */
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HuffmanHooks {
  /** 频次统计完成：每个字符的频次表。 */
  onBuildFreq?: (freq: Map<string, number>) => void;
  /** 合并两个最小节点为新节点 merged（频次之和）。 */
  onMerge?: (a: HuffmanNode, b: HuffmanNode, merged: HuffmanNode) => void;
  /** 为字符 ch 赋予编码 code。 */
  onAssignCode?: (ch: string, code: string) => void;
}

export interface HuffmanResult {
  /** 根节点（输入非空时存在）。 */
  root: HuffmanNode | null;
  /** 字符 → 编码 的映射。 */
  codes: Map<string, string>;
  /** 编码后的比特串。 */
  encoded: string;
  /** 原始比特数（每字符按 8 位计）。 */
  originalBits: number;
  /** 编码后比特数。 */
  encodedBits: number;
}

let __id = 0;
/** 生成唯一节点 id（每次构建前需 resetId）。 */
function nextId(): number {
  return __id++;
}

/** 内部：重置 id 计数器，保证多次构建结果可复现。 */
export function resetId(): void {
  __id = 0;
}

/**
 * 构建频次表。
 */
function buildFreq(input: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of input) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  return freq;
}

/** 最小堆（按 freq，freq 相同时按 id 以保证确定顺序）。 */
class MinHeap {
  private data: HuffmanNode[] = [];

  get size(): number {
    return this.data.length;
  }

  push(n: HuffmanNode): void {
    this.data.push(n);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): HuffmanNode | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0]!;
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private less(a: HuffmanNode, b: HuffmanNode): boolean {
    if (a.freq !== b.freq) return a.freq < b.freq;
    return a.id < b.id; // 确定性 tie-break
  }

  private bubbleUp(i: number): void {
    const d = this.data;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.less(d[i]!, d[parent]!)) break;
      const tmp = d[i]!;
      d[i] = d[parent]!;
      d[parent] = tmp;
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const d = this.data;
    const n = d.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && this.less(d[l]!, d[smallest]!)) smallest = l;
      if (r < n && this.less(d[r]!, d[smallest]!)) smallest = r;
      if (smallest === i) break;
      const tmp = d[i]!;
      d[i] = d[smallest]!;
      d[smallest] = tmp;
      i = smallest;
    }
  }
}

/** 从根 DFS 生成编码：左 = '0'，右 = '1'。 */
function buildCodes(root: HuffmanNode, hooks: HuffmanHooks): Map<string, string> {
  const codes = new Map<string, string>();
  const dfs = (node: HuffmanNode, prefix: string): void => {
    if (node.ch !== null) {
      codes.set(node.ch, prefix === '' ? '0' : prefix);
      hooks.onAssignCode?.(node.ch, prefix === '' ? '0' : prefix);
      return;
    }
    if (node.left) dfs(node.left, prefix + '0');
    if (node.right) dfs(node.right, prefix + '1');
  };
  dfs(root, '');
  return codes;
}

/**
 * 哈夫曼编码：基于字符频次构建最优前缀码。
 *
 * @param input 输入文本
 * @param hooks 可选的事件钩子
 * @returns 编码结果（含树、码表、编码串、比特统计）
 */
export function huffman(input: string, hooks: HuffmanHooks = {}): HuffmanResult {
  resetId();
  const freq = buildFreq(input);
  hooks.onBuildFreq?.(freq);

  if (input.length === 0) {
    return { root: null, codes: new Map(), encoded: '', originalBits: 0, encodedBits: 0 };
  }

  // 1. 每个字符建一个叶子节点，入堆
  const heap = new MinHeap();
  for (const [ch, f] of freq) {
    heap.push({ id: nextId(), ch, freq: f, left: null, right: null });
  }

  // 2. 反复取两个最小，合并为新内部节点
  while (heap.size > 1) {
    const a = heap.pop()!;
    const b = heap.pop()!;
    const merged: HuffmanNode = {
      id: nextId(),
      ch: null,
      freq: a.freq + b.freq,
      left: a,
      right: b,
    };
    hooks.onMerge?.(a, b, merged);
    heap.push(merged);
  }

  const root = heap.pop()!;

  // 3. 生成编码
  const codes = buildCodes(root, hooks);

  // 4. 编码输入
  let encoded = '';
  for (const ch of input) {
    encoded += codes.get(ch) ?? '';
  }

  const originalBits = input.length * 8;
  const encodedBits = encoded.length;

  return { root, codes, encoded, originalBits, encodedBits };
}

/** 用码表解码比特串。 */
export function huffmanDecode(encoded: string, codes: Map<string, string>): string {
  // 反转码表：code → ch
  const rev = new Map<string, string>();
  for (const [ch, code] of codes) rev.set(code, ch);
  let out = '';
  let buf = '';
  for (const bit of encoded) {
    buf += bit;
    const ch = rev.get(buf);
    if (ch !== undefined) {
      out += ch;
      buf = '';
    }
  }
  return out;
}
