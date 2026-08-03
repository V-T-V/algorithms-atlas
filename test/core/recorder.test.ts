import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TraceRecorder } from '../../src/core/recorder.ts';

test('recorder：begin/commit 推入帧，build 返回全部帧', () => {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'a', en: 'a' }).commit();
  rec.begin({ zh: 'b', en: 'b' }).commit();
  const frames = rec.build();
  assert.equal(frames.length, 2);
  assert.equal(frames[0]!.note?.zh, 'a');
  assert.equal(frames[1]!.note?.zh, 'b');
});

test('recorder：未 commit 的末尾帧在 build 时自动提交', () => {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'pending', en: 'pending' }).setBars([{ value: 1, role: 'default' }]);
  // 不显式 commit
  const frames = rec.build();
  assert.equal(frames.length, 1);
  assert.equal(frames[0]!.bars?.length, 1);
});

test('recorder：length 反映已提交帧数', () => {
  const rec = new TraceRecorder();
  assert.equal(rec.length, 0);
  rec.begin().commit();
  rec.begin().commit();
  assert.equal(rec.length, 2);
});

test('recorder：begin 继承上一帧的可视化状态（持续高亮）', () => {
  const rec = new TraceRecorder();
  rec.begin().setBars([{ value: 5, role: 'pivot' }]).commit();
  // 第二帧只设 note，不重设 bars → 应继承上一帧的 bars
  rec.begin({ zh: 'step', en: 'step' }).commit();
  const frames = rec.build();
  assert.ok(frames[1]!.bars !== undefined, '应继承上一帧 bars');
  assert.equal(frames[1]!.bars![0]!.value, 5);
});

test('recorder：barsFrom 按索引分配 role 与 label', () => {
  const rec = new TraceRecorder();
  const bars = rec.barsFrom([3, 1, 2], { 1: 'compare' }, { 2: 'two' });
  assert.equal(bars[0]!.role, 'default');
  assert.equal(bars[1]!.role, 'compare');
  assert.equal(bars[2]!.label, 'two');
});

test('recorder：setArray / setGrid / setAux / setGraph / setTree / setMap 写入对应字段', () => {
  const rec = new TraceRecorder();
  rec
    .begin()
    .setArray([1, 2], ['default', 'pivot'], [{ index: 0, label: 'L' }])
    .setAux([{ label: 'x', value: '1' }])
    .commit();
  const f = rec.build()[0]!;
  assert.deepEqual(f.array!.values, [1, 2]);
  assert.equal(f.array!.pointers[0]!.label, 'L');
  assert.equal(f.aux![0]!.label, 'x');

  const rec2 = new TraceRecorder();
  rec2.begin().setGrid(rec2.gridFrom([[1, 2], ['a', undefined]], { '1,1': 'final' })).commit();
  const g = rec2.build()[0]!;
  assert.equal(g.array2d![0]![0]!.v, 1);
  assert.equal(g.array2d![1]![1]!.role, 'final');
});

test('recorder：highlightLines 写入高亮行', () => {
  const rec = new TraceRecorder();
  rec.begin().highlightLines(1, 3, 5).commit();
  assert.deepEqual(rec.build()[0]!.highlightLines, [1, 3, 5]);
});

test('recorder：链式调用返回 this（可拼接）', () => {
  const rec = new TraceRecorder();
  const r = rec.begin({ zh: 'x', en: 'x' }).setBars([]).highlightLines(1).commit();
  assert.equal(r, rec);
});

test('recorder：空 build（无任何帧）返回空数组', () => {
  assert.equal(new TraceRecorder().build().length, 0);
});
