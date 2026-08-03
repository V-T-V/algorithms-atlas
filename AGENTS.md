# algorithms-atlas · AGENTS.md

## 项目内容（What）
3000 算法图谱——每个算法配 trace 录制 + 通用播放器动画演示。技术教育内容平台，可规模化长期生产。

不做：不做刷题 OJ、不做算法竞赛。

## 目标（Goal）
- 用动画演示让算法可视化、可理解，覆盖主流算法（排序/图/DP/贪心/搜索/...）。
- trace 录制（算法执行步骤快照）+ 通用播放器（前进/后退/步进），任何算法共用一套回放机制。
- 成功标准：高完成度——3000+ 完整算法、每个算法配单元测试、全门禁通过。

## 当前情况（Status）
**high（很高完成度，工作区规模最大）。** 3046 个完整算法（30 大类全覆盖）、3040 份单测文件。
门禁状态以 `npm run product:check` 为准（见下「如何运行」）；数量以 product:check 实际发现为准，文档与 README 需同步。

### R10 深度推进记录（r10-r1 ~ r10-r8）
- **r1**: 修复 radix-msd-dec 栈溢出 bug + 文档计数核对 + 21 个模块 createDemo buildTrace 绑定
- **r2**: 增强 sliding-window/group-knapsack 可视化录制 + 全仓类型错误修复
- **r3**: 补全 7 个算法单元测试 + 修复 math-expression-parser 空白符解析 bug
- **r4**: 修复 counting/radix-sort 负数静默错排 bug + radix 测试补强
- **r5**: 图算法边界覆盖 + 基于属性的随机图测试
- **r6**: 核心基础设施（playback/recorder）单元测试——此前零覆盖
- **r7**: 实现真正的「组合总和」算法 + 分步回溯动画（原为占位 stub）
- **r8**: 修复 bead-sort 混合正负数静默吞 bug（逐元素校验，对齐 counting-sort 模式）+ 5 边界测试

## 技术栈与架构
- **语言**：TypeScript 5.9 strict，Vite
- **核心**：trace 录制 + 通用播放器（算法与渲染解耦）
- 规模：src/ 2629 文件、curriculum/ 学习路径

```
src/        算法实现 + trace + 播放器
curriculum/ learning-paths（学习路径）
test/       2249 测试用例
```

## 如何运行
```bash
npm install
npm run dev           # 开发服务器
npm run build         # 生产构建
npm run type-check
npm run product:check # 产品门禁
npm test              # 测试
```

## 关键约定
- 算法与渲染解耦：算法只产出 trace，播放器通用回放，新算法不改播放器。
- TypeScript strict，测试覆盖充分。

## 与其他项目的关系
独立项目。属技术教育内容平台线。
