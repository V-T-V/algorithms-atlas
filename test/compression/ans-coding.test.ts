import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildModel,
  ransDecode,
  ransDecodeStep,
  ransEncode,
  ransEncodeStep,
} from '../../src/algorithms/compression/ans-coding/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/ans-coding/trace.ts';

function sampleModel() {
  return buildModel(
    new Map([
      [0, 5],
      [1, 3],
      [2, 2],
    ]),
  );
}

test('ans 单步编码后单步解码可逆', () => {
  const m = sampleModel();
  const x0 = m.M;
  const x1 = ransEncodeStep(x0, 1, m);
  const back = ransDecodeStep(x1, m);
  assert.equal(back.symbol, 1);
  assert.equal(back.x, x0);
});

test('ans 编码整条流后解码可逆', () => {
  const m = sampleModel();
  for (const stream of [[0, 1, 0, 0, 1], [1, 2, 0, 1], [0], []]) {
    const finalX = ransEncode(stream, m);
    const decoded = ransDecode(finalX, stream.length, m);
    assert.deepEqual(decoded, stream, `不可逆: ${JSON.stringify(stream)}`);
  }
});

test('ans buildModel 累积频率正确', () => {
  const m = sampleModel();
  assert.equal(m.M, 10);
  assert.equal(m.cumulative.get(0), 0);
  assert.equal(m.cumulative.get(1), 5);
  assert.equal(m.cumulative.get(2), 8);
});

test('ans buildModel 忽略零频率符号', () => {
  const m = buildModel(
    new Map([
      [0, 3],
      [9, 0],
      [1, 2],
    ]),
  );
  assert.deepEqual(m.symbols, [0, 1]);
});

test('ans 编码后 x 单调递增', () => {
  const m = sampleModel();
  let x = m.M;
  for (const s of [0, 1, 0, 2]) {
    const nx = ransEncodeStep(x, s, m);
    assert.ok(nx >= x, `x 应单调不降: ${x} -> ${nx}`);
    x = nx;
  }
});

test('ans 钩子被调用', () => {
  const m = sampleModel();
  const encs: number[] = [];
  ransEncode([0, 1], m, { onEncode: (s) => encs.push(s) });
  assert.deepEqual(encs, [0, 1]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
