import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TextEditor } from '../../src/algorithms/design/design-memento/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-memento/trace.ts';

test('memento type 后可保存', () => {
  const e = new TextEditor();
  e.type('abc');
  e.save();
  assert.equal(e.getText(), 'abc');
});
test('memento undo 恢复', () => {
  const e = new TextEditor();
  e.type('ab');
  e.save();
  e.type('cd');
  assert.equal(e.getText(), 'abcd');
  e.undo();
  assert.equal(e.getText(), 'ab');
});
test('memento 多步 undo', () => {
  const e = new TextEditor();
  e.type('1');
  e.save();
  e.type('2');
  e.save();
  e.type('3');
  e.undo();
  assert.equal(e.getText(), '12');
  e.undo();
  assert.equal(e.getText(), '1');
});
test('memento 空栈 undo 返回 false', () => {
  const e = new TextEditor();
  assert.equal(e.undo(), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
