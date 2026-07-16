import { test } from 'node:test';
import assert from 'node:assert/strict';
import { haversine } from '../../src/algorithms/geometry/geo-spherical-distance/impl.ts';

test('haversine 同点距离 0', () => {
  assert.equal(haversine({ lat: 10, lng: 20 }, { lat: 10, lng: 20 }), 0);
});

test('haversine Paris-London ≈ 343 km', () => {
  const d = haversine({ lat: 48.8566, lng: 2.3522 }, { lat: 51.5074, lng: -0.1278 });
  assert.ok(Math.abs(d - 343.5) < 5, `got ${d}`);
});

test('haversine 纬度差 1 度约 111 km', () => {
  const d = haversine({ lat: 0, lng: 0 }, { lat: 1, lng: 0 });
  assert.ok(Math.abs(d - 111.19) < 1, `got ${d}`);
});

test('haversine 对称性', () => {
  const a = { lat: 35.0, lng: 139.7 };
  const b = { lat: 40.7, lng: -74.0 };
  assert.equal(haversine(a, b), haversine(b, a));
});

test('haversine 半周长', () => {
  // 对蹠点距离约为半周长 π·R ≈ 20015 km
  const d = haversine({ lat: 0, lng: 0 }, { lat: 0, lng: 180 });
  assert.ok(Math.abs(d - 20015.09) < 50, `got ${d}`);
});
