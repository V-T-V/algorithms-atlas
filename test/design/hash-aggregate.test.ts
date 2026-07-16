import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hashAggregate,
  countAcc,
  sumAcc,
  avgAcc,
  minAcc,
  maxAcc,
} from '../../src/algorithms/design/hash-aggregate/impl.ts';

interface Row {
  dept: string;
  salary: number;
}

const rows: Row[] = [
  { dept: 'A', salary: 100 },
  { dept: 'B', salary: 200 },
  { dept: 'A', salary: 150 },
  { dept: 'C', salary: 300 },
  { dept: 'B', salary: 250 },
  { dept: 'A', salary: 120 },
];

const sortByKey = <K extends string, R>(a: Array<{ key: K; value: R }>) =>
  [...a].sort((x, y) => (x.key < y.key ? -1 : x.key > y.key ? 1 : 0));

test('hashAggregate count by dept', () => {
  const r = sortByKey(
    hashAggregate(
      rows,
      (r) => r.dept,
      () => 1,
      countAcc,
    ),
  );
  assert.deepEqual(r, [
    { key: 'A', value: 3 },
    { key: 'B', value: 2 },
    { key: 'C', value: 1 },
  ]);
});

test('hashAggregate sum by dept', () => {
  const r = sortByKey(
    hashAggregate(
      rows,
      (r) => r.dept,
      (r) => r.salary,
      sumAcc,
    ),
  );
  assert.deepEqual(r, [
    { key: 'A', value: 370 },
    { key: 'B', value: 450 },
    { key: 'C', value: 300 },
  ]);
});

test('hashAggregate avg by dept', () => {
  const r = sortByKey(
    hashAggregate(
      rows,
      (r) => r.dept,
      (r) => r.salary,
      avgAcc,
    ),
  );
  assert.equal(r[0]!.key, 'A');
  assert.equal(r[0]!.value, 370 / 3);
});

test('hashAggregate min by dept', () => {
  const r = sortByKey(
    hashAggregate(
      rows,
      (r) => r.dept,
      (r) => r.salary,
      minAcc,
    ),
  );
  assert.deepEqual(r, [
    { key: 'A', value: 100 },
    { key: 'B', value: 200 },
    { key: 'C', value: 300 },
  ]);
});

test('hashAggregate max by dept', () => {
  const r = sortByKey(
    hashAggregate(
      rows,
      (r) => r.dept,
      (r) => r.salary,
      maxAcc,
    ),
  );
  assert.deepEqual(r, [
    { key: 'A', value: 150 },
    { key: 'B', value: 250 },
    { key: 'C', value: 300 },
  ]);
});

test('hashAggregate 空输入返回空', () => {
  assert.deepEqual(
    hashAggregate(
      [],
      (r: Row) => r.dept,
      () => 0,
      countAcc,
    ),
    [],
  );
});

test('hashAggregate 单组', () => {
  const r = hashAggregate(
    [{ dept: 'X', salary: 1 }],
    (r) => r.dept,
    (r) => r.salary,
    sumAcc,
  );
  assert.deepEqual(r, [{ key: 'X', value: 1 }]);
});

test('hashAggregate onNewGroup 钩子', () => {
  const groups: string[] = [];
  hashAggregate(
    rows,
    (r) => r.dept,
    () => 1,
    countAcc,
    {
      onNewGroup: (k) => groups.push(k),
    },
  );
  assert.equal(new Set(groups).size, 3);
});
