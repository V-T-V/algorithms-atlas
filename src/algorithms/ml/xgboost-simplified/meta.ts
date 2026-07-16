// XGBoost 简化版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'xgboost-simplified',
  categoryId: 'ml',
  title: { zh: 'XGBoost 简化版', en: 'XGBoost (Simplified)' },
  summary: {
    zh: '带 L1/L2 正则与二阶梯度（Newton 提升）的回归树串行集成，目标含叶子数罚项防止过拟合。',
    en: 'A Newton-boosted ensemble of regression trees with L1/L2 regularization and a leaf-count penalty, controlling overfitting.',
  },
  description: {
    zh: 'XGBoost（eXtreme Gradient Boosting）在 GBDT 基础上引入二阶导数（Newton 法）与正则化目标：\n\n  `Obj = Σ_i L(y_i, ŷ_i) + Σ_t [γ·|叶子| + ½λ·Σ wₗ²]`\n\n每轮加一棵回归树拟合当前损失的**梯度 g 与海森 h**：\n- 最优叶子权重 `w*ₗ = −Gₗ/(Hₗ+λ)`（G、H 为叶内梯度和/海森和）；\n- 分裂增益 `= ½[ G_L²/(H_L+λ) + G_R²/(H_R+λ) − G²/(H+λ) ] − γ`。\n\n本简化版：单变量回归树（按阈值二分），L2 正则 λ，叶子数罚 γ。\n\n与普通 GBDT 的区别：用二阶信息使收敛更快、目标内置正则更稳健。',
    en: 'XGBoost (eXtreme Gradient Boosting) extends GBDT with second-order info (Newton boosting) and a regularized objective:\n\n  `Obj = Σ_i L(y_i, ŷ_i) + Σ_t [γ·|leaves| + ½λ·Σ wₗ²]`\n\nEach round adds a regression tree fitting the loss **gradient g and Hessian h**:\n- optimal leaf weight `w*ₗ = −Gₗ/(Hₗ+λ)` (G, H are leaf sums);\n- split gain `= ½[ G_L²/(H_L+λ) + G_R²/(H_R+λ) − G²/(H+λ) ] − γ`.\n\nThis simplified version: single-feature regression trees (threshold splits), L2 λ, leaf-count penalty γ.\n\nCompared with vanilla GBDT, the second-order info converges faster and the regularized objective is more robust.',
  },
  tags: ['ml', 'ensemble', 'boosting', 'tree', 'regularization'],
  complexity: { time: 'O(T·n·d·log n)', space: 'O(n·T)' },
};
