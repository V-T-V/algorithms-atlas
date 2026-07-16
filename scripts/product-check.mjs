import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const write = process.argv.includes("--write");

function listDirs(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) return [];
  return readdirSync(absolutePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function walkFiles(relativePath, predicate = () => true) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) return [];

  const files = [];
  const stack = [absolutePath];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && entry.name !== "dist") stack.push(next);
      } else if (predicate(next)) {
        files.push(next);
      }
    }
  }
  return files;
}

const categories = listDirs("src/algorithms");
const algorithms = categories.flatMap((category) =>
  listDirs(path.join("src/algorithms", category)).map((id) => ({ category, id })),
);

const completeAlgorithms = algorithms.filter(({ category, id }) =>
  ["meta.ts", "impl.ts", "trace.ts", "index.ts"].every((file) =>
    existsSync(path.join(rootDir, "src/algorithms", category, id, file)),
  ),
);

const testFiles = walkFiles("test", (file) => file.endsWith(".test.ts"));
const readme = readFileSync(path.join(rootDir, "README.md"), "utf8");
const learningPaths = readFileSync(path.join(rootDir, "src/lobby/learningPaths.ts"), "utf8");
const taxonomy = readFileSync(path.join(rootDir, "src/taxonomy.ts"), "utf8");
const curriculumPath = path.join(rootDir, "curriculum", "learning-paths.json");
const curriculumMarkdownPath = path.join(rootDir, "curriculum", "learning-paths.md");
const curriculum = existsSync(curriculumPath) ? JSON.parse(readFileSync(curriculumPath, "utf8")) : null;

const checks = [
  {
    id: "algorithm-count",
    ok: algorithms.length >= 90,
    detail: `${algorithms.length} algorithms discovered`,
  },
  {
    id: "complete-algorithm-modules",
    ok: completeAlgorithms.length === algorithms.length,
    detail: `${completeAlgorithms.length}/${algorithms.length} algorithms include meta/impl/trace/index`,
  },
  {
    id: "category-coverage",
    ok: categories.length >= 30,
    detail: `${categories.length} categories represented`,
  },
  {
    id: "readme-current-count",
    ok: readme.includes(`${algorithms.length} 个完整算法`),
    detail: "README states the current algorithm count",
  },
  {
    id: "learning-paths",
    ok:
      learningPaths.includes("foundation") &&
      learningPaths.includes("interview") &&
      learningPaths.includes("graph-dp") &&
      learningPaths.includes("systems"),
    detail: "Learning path filters are present",
  },
  {
    id: "taxonomy-source",
    ok: taxonomy.includes("export const CATEGORIES") || taxonomy.includes("category"),
    detail: "Taxonomy source is present",
  },
  {
    id: "test-coverage-surface",
    ok: testFiles.length >= 90,
    detail: `${testFiles.length} test files discovered`,
  },
  {
    id: "curriculum-export",
    ok:
      Boolean(curriculum) &&
      curriculum.totalAlgorithms === algorithms.length &&
      curriculum.paths?.length === 4 &&
      curriculum.paths.every((item) => item.algorithmCount > 0 && item.modules?.length > 0),
    detail: curriculum
      ? `${curriculum.paths.length} learning paths exported for ${curriculum.totalAlgorithms} algorithms`
      : "curriculum export is missing",
  },
  {
    id: "curriculum-markdown",
    ok:
      existsSync(curriculumMarkdownPath) &&
      readFileSync(curriculumMarkdownPath, "utf8").includes("Algorithms Atlas 课程路线"),
    detail: "Markdown curriculum handoff is present",
  },
];

const passed = checks.filter((check) => check.ok).length;
const failed = checks.length - passed;
const payload = {
  generatedAt: new Date().toISOString(),
  project: "algorithms-atlas",
  algorithms: algorithms.length,
  categories: categories.length,
  testFiles: testFiles.length,
  passed,
  failed,
  checks,
};

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.id}: ${check.detail}`);
}
console.log(`Product gate: ${passed}/${checks.length} passed`);

if (write) {
  const outputDir = path.join(rootDir, ".algorithms-atlas");
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(path.join(outputDir, "product-status.json"), `${JSON.stringify(payload, null, 2)}\n`);
}

if (failed > 0) {
  process.exitCode = 1;
}
