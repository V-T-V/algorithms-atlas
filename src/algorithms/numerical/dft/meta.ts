// 离散傅里叶变换（DFT）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-dft',
  categoryId: 'numerical',
  title: { zh: '离散傅里叶变换（DFT）', en: 'Discrete Fourier Transform (DFT)' },
  summary: {
    zh: '把长度 N 的复数序列变换到频域：X_k = Σ x_n · e^(−2πi·kn/N)。',
    en: 'Transform an N-length complex sequence to frequency domain: X_k = Σ x_n · e^(−2πi·kn/N).',
  },
  description: {
    zh:
      '离散傅里叶变换（Discrete Fourier Transform, DFT）：把时域离散序列 x_n（n=0..N−1）' +
      '映射到频域复序列 X_k（k=0..N−1）。' +
      '\n- 公式：X_k = Σ_{n=0}^{N−1} x_n · e^(−2πi·kn/N)' +
      '\n- 实数序列视作虚部为 0 的复数；结果为复数（含幅度与相位）' +
      '\n- 基本实现复杂度 O(N²)；FFT 可降至 O(N log N)' +
      '\n- 应用：频谱分析、滤波、卷积、音频/图像压缩。' +
      '\n- 本实现为直观 O(N²) 版本，便于教学可视化。',
    en:
      'Discrete Fourier Transform (DFT): map a time-domain sequence x_n (n=0..N−1) to a frequency-domain ' +
      'complex sequence X_k (k=0..N−1). ' +
      '\n- Formula: X_k = Σ_{n=0}^{N−1} x_n · e^(−2πi·kn/N) ' +
      '\n- Real sequences are treated as complex with zero imaginary part; output is complex (magnitude + phase) ' +
      '\n- Naive complexity O(N²); FFT reduces to O(N log N) ' +
      '\n- Applications: spectral analysis, filtering, convolution, audio/image compression. ' +
      '\nThis is an intuitive O(N²) implementation for visualization.',
  },
  tags: ['numerical', 'dft', 'fourier', 'signal', 'frequency'],
  complexity: { time: 'O(N²)', space: 'O(N)' },
};
