import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const algorithmsDir = path.join(rootDir, "src", "algorithms");
const outputDir = path.join(rootDir, "curriculum");

const learningPaths = [
  {
    id: "foundation",
    label: "入门基础",
    description: "面向零到一学习者，先建立排序、搜索、数据结构和递归的基本执行模型。",
    categories: ["sorting", "searching", "ds", "list", "recursion"],
  },
  {
    id: "interview",
    label: "面试高频",
    description: "按面试高频主题组织，覆盖数组、图、动态规划、字符串、贪心与回溯。",
    categories: ["sorting", "searching", "ds", "dp", "graph", "string", "greedy", "backtracking"],
    tags: [
      "two-pointers",
      "sliding-window",
      "divide-and-conquer",
      "shortest-path",
      "minimum-spanning-tree",
      "dynamic-programming",
      "backtracking",
    ],
  },
  {
    id: "graph-dp",
    label: "图论 / DP",
    description: "聚焦图搜索、最短路、连通性、博弈搜索和动态规划，适合作为进阶专题课。",
    categories: ["graph", "dp", "ai-search", "game"],
  },
  {
    id: "systems",
    label: "工程系统",
    description: "把解析、调度、网络、压缩、哈希、密码学和并发整理为工程向算法模块。",
    categories: ["parsing", "scheduling", "network", "compression", "crypto", "hashing", "concurrency"],
  },
];

function listDirs(absolutePath) {
  if (!existsSync(absolutePath)) return [];
  return readdirSync(absolutePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function decodeString(value = "") {
  return value.replace(/\\n/g, "\n").replace(/\\'/g, "'").replace(/\\"/g, '"');
}

function extractString(source, field) {
  const match = source.match(new RegExp(`${field}:\\s*(['"])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`));
  return match ? decodeString(match[2]) : "";
}

function extractLocalized(source, field) {
  const block = source.match(new RegExp(`${field}:\\s*\\{([\\s\\S]*?)\\}\\s*,`));
  if (!block) return { zh: "", en: "" };
  return {
    zh: extractString(block[1], "zh"),
    en: extractString(block[1], "en"),
  };
}

function extractTags(source) {
  const match = source.match(/tags:\s*\[([\s\S]*?)\]/);
  if (!match) return [];
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((tag) => tag[1]).sort((a, b) => a.localeCompare(b));
}

function extractComplexity(source) {
  const block = source.match(/complexity:\s*\{([\s\S]*?)\}/);
  if (!block) return { time: "", space: "" };
  return {
    time: extractString(block[1], "time"),
    space: extractString(block[1], "space"),
  };
}

function readAlgorithms() {
  return listDirs(algorithmsDir).flatMap((categoryId) =>
    listDirs(path.join(algorithmsDir, categoryId)).map((algorithmId) => {
      const metaPath = path.join(algorithmsDir, categoryId, algorithmId, "meta.ts");
      const source = readFileSync(metaPath, "utf8");
      return {
        id: extractString(source, "id") || algorithmId,
        categoryId: extractString(source, "categoryId") || categoryId,
        title: extractLocalized(source, "title"),
        summary: extractLocalized(source, "summary"),
        tags: extractTags(source),
        complexity: extractComplexity(source),
      };
    }),
  );
}

function matchesPath(algorithm, learningPath) {
  if (learningPath.categories.includes(algorithm.categoryId)) return true;
  if (!learningPath.tags) return false;
  return algorithm.tags.some((tag) => learningPath.tags.includes(tag));
}

function buildModules(algorithms) {
  const byCategory = new Map();
  for (const algorithm of algorithms) {
    const bucket = byCategory.get(algorithm.categoryId) ?? [];
    bucket.push(algorithm);
    byCategory.set(algorithm.categoryId, bucket);
  }
  return [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([categoryId, items]) => ({
      categoryId,
      algorithmCount: items.length,
      algorithms: items
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((algorithm) => ({
          id: algorithm.id,
          title: algorithm.title,
          summary: algorithm.summary,
          tags: algorithm.tags,
          complexity: algorithm.complexity,
        })),
    }));
}

function buildCurriculum(algorithms) {
  return {
    generatedAt: new Date().toISOString(),
    project: "algorithms-atlas",
    totalAlgorithms: algorithms.length,
    paths: learningPaths.map((learningPath) => {
      const selected = algorithms.filter((algorithm) => matchesPath(algorithm, learningPath));
      return {
        id: learningPath.id,
        label: learningPath.label,
        description: learningPath.description,
        categories: learningPath.categories,
        algorithmCount: selected.length,
        modules: buildModules(selected),
        recommendedFirst: selected
          .slice()
          .sort((a, b) => a.categoryId.localeCompare(b.categoryId) || a.id.localeCompare(b.id))
          .slice(0, 12)
          .map((algorithm) => ({
            id: algorithm.id,
            categoryId: algorithm.categoryId,
            title: algorithm.title,
            summary: algorithm.summary,
          })),
      };
    }),
  };
}

function renderMarkdown(curriculum) {
  const lines = [
    "# Algorithms Atlas 课程路线",
    "",
    `生成时间：${curriculum.generatedAt}`,
    "",
    `当前算法总量：${curriculum.totalAlgorithms}`,
    "",
  ];

  for (const learningPath of curriculum.paths) {
    lines.push(`## ${learningPath.label}`, "", learningPath.description, "");
    lines.push(`- 路线 ID：\`${learningPath.id}\``);
    lines.push(`- 算法数量：${learningPath.algorithmCount}`);
    lines.push(`- 覆盖分类：${learningPath.categories.map((category) => `\`${category}\``).join(" · ")}`);
    lines.push("");
    lines.push("| 模块 | 数量 | 推荐起点 |");
    lines.push("| --- | ---: | --- |");
    for (const module of learningPath.modules) {
      const starters = module.algorithms
        .slice(0, 3)
        .map((algorithm) => algorithm.title.zh || algorithm.id)
        .join("、");
      lines.push(`| \`${module.categoryId}\` | ${module.algorithmCount} | ${starters} |`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

const algorithms = readAlgorithms();
const curriculum = buildCurriculum(algorithms);
mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, "learning-paths.json"), `${JSON.stringify(curriculum, null, 2)}\n`);
writeFileSync(path.join(outputDir, "learning-paths.md"), renderMarkdown(curriculum));

console.log(
  `Exported ${curriculum.paths.length} learning paths with ${curriculum.totalAlgorithms} algorithms to curriculum/`,
);
