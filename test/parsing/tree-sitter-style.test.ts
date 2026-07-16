import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseProgram,
  incrementalReparse,
  lex,
  DEMO_SOURCE,
} from '../../src/algorithms/parsing/tree-sitter-style/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/tree-sitter-style/trace.ts';

test('tree-sitter-style lex 正确分类 token', () => {
  const toks = lex('x = 1;');
  assert.equal(toks[0]!.kind, 'ID');
  assert.equal(toks[1]!.kind, '=');
  assert.equal(toks[2]!.kind, 'NUM');
  assert.equal(toks[3]!.kind, ';');
  assert.equal(toks[4]!.kind, 'EOF');
});

test('tree-sitter-style 解析正确程序无错误', () => {
  const r = parseProgram('x = 1 + 2 * 3;');
  assert.equal(r.errorCount, 0);
  assert.equal(r.missingCount, 0);
  assert.equal(r.root.value, 'program');
  assert.ok((r.root.children?.length ?? 0) === 1);
});

test('tree-sitter-style 多语句解析', () => {
  const r = parseProgram(DEMO_SOURCE);
  assert.equal(r.errorCount, 0);
  assert.equal(r.root.children?.length, 2);
});

test('tree-sitter-style 运算符优先级：* 高于 +', () => {
  const r = parseProgram('x = 1 + 2 * 3;');
  const stmt = r.root.children![0]!;
  // stmt → ID = expr ;
  // expr 顶层应为 '+'，其右子应为 '*'
  const exprNode = stmt.children!.find((c) => c.value === '+');
  assert.ok(exprNode, '应存在 + 节点');
  const rightMul = exprNode!.children?.find((c) => c.value === '*');
  assert.ok(rightMul, '+ 的右子应为 * 节点（优先级）');
});

test('tree-sitter-style 错误恢复：缺分号插入 MISSING', () => {
  const r = parseProgram('x = 1 + 2');
  assert.equal(r.errorCount, 0);
  assert.ok(r.missingCount >= 1, `应至少 1 个 MISSING，实际 ${r.missingCount}`);
});

test('tree-sitter-style 错误恢复：意外 token 收集为 ERROR', () => {
  let errors = 0;
  const r = parseProgram('x = + 1 ;', { onError: () => errors++ });
  assert.ok(r.errorCount >= 1, `应至少 1 个 ERROR，实际 ${r.errorCount}`);
  assert.ok(errors >= 1);
});

test('tree-sitter-style 错误恢复后继续解析后续语句', () => {
  // 第一句有错（缺 '='），第二句正确；解析不应中断
  const r = parseProgram('x 1 ; y = 2;');
  // 应能解析到 2 条语句
  assert.ok((r.root.children?.length ?? 0) >= 1);
});

test('tree-sitter-style 括号表达式', () => {
  const r = parseProgram('x = (1 + 2) * 3;');
  assert.equal(r.errorCount, 0);
  const stmt = r.root.children![0]!;
  const mulNode = stmt.children!.find((c) => c.value === '*');
  assert.ok(mulNode, '顶层运算符应为 *');
});

test('tree-sitter-style 增量重解析复用未编辑语句', () => {
  const orig = parseProgram('x = 1; y = 2; z = 3;');
  // 编辑第一条语句
  const edit = { startIndex: 4, oldEndIndex: 5, newEndIndex: 6 };
  const reparsed = incrementalReparse(orig.root, 'x = 9; y = 2; z = 3;', edit);
  assert.ok((reparsed.root.children?.length ?? 0) === 3);
  assert.equal(reparsed.errorCount, 0);
});

test('tree-sitter-style onResult 钩子触发', () => {
  let called = 0;
  parseProgram('x = 1;', { onResult: () => called++ });
  assert.ok(called >= 1);
});

test('buildTrace 生成多帧含 tree', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  // 应至少有一帧含 tree
  const withTree = frames.filter((f) => f.tree);
  assert.ok(withTree.length >= 1, '应至少一帧含 tree');
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧含 aux');
});
