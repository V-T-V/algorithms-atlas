import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAcAutomaton,
  acSearch,
  ahoCorasick,
} from '../../src/algorithms/string/ac-automaton/impl.ts';

test('AC 经典用例 ushers', () => {
  // text="ushers", patterns=['he','she','his','hers']
  // she 在 [1..3], he 在 [2..3], hers 在 [2..5]
  const hits = ahoCorasick('ushers', ['he', 'she', 'his', 'hers']);
  const found = hits.map((h) => `${h.pattern}@${h.start}`).sort();
  assert.deepEqual(found, ['he@2', 'hers@2', 'she@1']);
});

test('AC 多次出现 + 重叠', () => {
  // 'he' 在 'hehehe' 出现在 0,2,4
  const hits = ahoCorasick('hehehe', ['he']);
  assert.deepEqual(
    hits.map((h) => h.start).sort((a, b) => a - b),
    [0, 2, 4],
  );
});

test('AC 无匹配返回空', () => {
  assert.deepEqual(ahoCorasick('abcdef', ['xyz', 'qq']), []);
});

test('AC 空模式集 / 空文本', () => {
  assert.deepEqual(ahoCorasick('abc', []), []);
  assert.deepEqual(ahoCorasick('', ['a']), []);
});

test('AC 与朴素多模式一致', () => {
  const text = 'abcababcabcaabcabcab';
  const patterns = ['ab', 'cab', 'abcab'];
  const ac = buildAcAutomaton(patterns);
  const raw = acSearch(text, ac);
  // 朴素：每个模式用 indexOf 收集所有起点
  const naive: Array<{ patternIdx: number; start: number }> = [];
  for (let pi = 0; pi < patterns.length; pi++) {
    const p = patterns[pi]!;
    let from = 0;
    while (true) {
      const idx = text.indexOf(p, from);
      if (idx < 0) break;
      naive.push({ patternIdx: pi, start: idx });
      from = idx + 1;
    }
  }
  // 比较 (pattern, start) 集合
  const setA = new Set(
    raw.map((r) => `${r.patternIdx}:${r.end - patterns[r.patternIdx]!.length + 1}`),
  );
  const setB = new Set(naive.map((r) => `${r.patternIdx}:${r.start}`));
  assert.deepEqual([...setA].sort(), [...setB].sort());
});

test('AC fail 指针：根的子节点 fail=0', () => {
  const ac = buildAcAutomaton(['he', 'she', 'his']);
  // 节点 1 (h) 和 节点 (s) 都是根的直接子节点，fail 应为 0
  for (const childId of ac.nodes[0]!.children.values()) {
    assert.equal(ac.nodes[childId]!.fail, 0);
  }
});

test('AC output 包含字典后缀链接', () => {
  // 'he' 是 'she' 的后缀 → 'she' 末节点的 output 应同时含 'she' 和 'he'
  const ac = buildAcAutomaton(['he', 'she']);
  const sheEnd = ac.nodes.findIndex((n) => n.output.includes(1) /* she 是 patterns[1] */);
  assert.ok(sheEnd >= 0);
  assert.ok(ac.nodes[sheEnd]!.output.includes(0), 'she 末节点应继承 he 的输出');
});

test('AC 钩子被调用', () => {
  let edges = 0;
  let fails = 0;
  let found = 0;
  const ac = buildAcAutomaton(['he', 'she'], {
    onInsertEdge: () => edges++,
  });
  assert.ok(edges >= 2);
  // 构建 fail 重新触发
  buildAcAutomaton(['he', 'she', 'hers'], {
    onFail: () => fails++,
  });
  assert.ok(fails >= 1);
  acSearch('ushers', ac, {
    onFound: () => found++,
  });
  // she, he, hers → 3
  assert.ok(found >= 2, '应至少命中 she 与 he');
});
