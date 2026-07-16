import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isLeapYear, leapYearsIn } from '../../src/algorithms/misc/leap-year-check/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/leap-year-check/trace.ts';

test('isLeapYear 被 400 整除是闰年', () => {
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(1600), true);
});

test('isLeapYear 被 100 但不被 400 整除不是闰年', () => {
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(2100), false);
  assert.equal(isLeapYear(1800), false);
});

test('isLeapYear 被 4 但不被 100 整除是闰年', () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(2020), true);
  assert.equal(isLeapYear(1996), true);
});

test('isLeapYear 不被 4 整除不是闰年', () => {
  assert.equal(isLeapYear(2023), false);
  assert.equal(isLeapYear(2021), false);
  assert.equal(isLeapYear(1999), false);
});

test('isLeapYear 负年份（公元前）合法', () => {
  // 历法上规则仍适用于负数表示的年份
  assert.equal(isLeapYear(-4), true);
  assert.equal(isLeapYear(-100), false);
});

test('isLeapYear 非整数抛错', () => {
  assert.throws(() => isLeapYear(2020.5));
});

test('isLeapYear 确定性', () => {
  assert.equal(isLeapYear(2024), isLeapYear(2024));
});

test('leapYearsIn 区间内闰年正确', () => {
  const out = leapYearsIn(2000, 2024);
  assert.deepEqual(out, [2000, 2004, 2008, 2012, 2016, 2020, 2024]);
});

test('leapYearsIn 单年区间', () => {
  assert.deepEqual(leapYearsIn(2024, 2024), [2024]);
  assert.deepEqual(leapYearsIn(2023, 2023), []);
});

test('leapYearsIn 非法区间抛错', () => {
  assert.throws(() => leapYearsIn(2024, 2020));
  assert.throws(() => leapYearsIn(1.5, 2));
});

test('isLeapYear 钩子触发', () => {
  let checked = false;
  isLeapYear(2000, { onCheck: () => (checked = true) });
  assert.equal(checked, true);
});

test('buildTrace 含 aux，末帧含闰年数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '闰年数');
  assert.ok(c, '末帧应含闰年数');
});
