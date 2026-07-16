// 观察者模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-observer',
  categoryId: 'design',
  title: { zh: '观察者模式', en: 'Observer Pattern' },
  summary: {
    zh: '观察者：主题状态变化时自动通知所有订阅者，实现一对多解耦。',
    en: 'Observer: subject auto-notifies all subscribers on state change, decoupling one-to-many.',
  },
  description: {
    zh: '观察者模式（行为型，又称 Publish-Subscribe）：\n\n- Subject 维护观察者列表，提供 attach/detach/notify。\n- Observer 实现 update 接口。\n- Subject 状态改变时调用 notify，遍历调用每个观察者的 update。\n- 经典应用：事件总线、数据绑定、消息队列、响应式编程。\n\n本实现：气温监测站（Subject）+ 多个显示屏（Observer）。',
    en: 'Observer Pattern (behavioral, a.k.a. Publish-Subscribe):\n\n- Subject keeps an observer list, exposing attach/detach/notify.\n- Observer implements an update interface.\n- On state change Subject calls notify, invoking update on each observer.\n- Classic uses: event buses, data binding, message queues, reactive programming.\n\nThis implementation: a weather station (Subject) + multiple displays (Observer).',
  },
  tags: ['design', 'behavioral-pattern', 'pubsub', 'events'],
  complexity: { time: 'O(observers) notify', space: 'O(observers)' },
};
