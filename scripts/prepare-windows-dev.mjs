import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.platform !== "win32") {
  console.log("[paperclip] Windows dev preparation skipped on non-Windows host.");
  process.exit(0);
}

const embeddedVersion = "18.1.0-beta.16";
const pnpmRoot = path.join(repoRoot, "node_modules", ".pnpm");
const bundleRoot =
  process.env.PAPERCLIP_EMBEDDED_POSTGRES_WINDOWS_X64_ROOT ||
  path.join(os.homedir(), "paperclip-embedded-postgres-windows-x64");

async function findPackageDir(prefix) {
  const entries = await fs.readdir(pnpmRoot);
  const match = entries.find((entry) => entry.startsWith(prefix));
  if (!match) {
    throw new Error(`Could not find pnpm package directory for ${prefix}. Run pnpm install first.`);
  }
  return path.join(pnpmRoot, match);
}

function replaceOnce(content, search, replacement, label) {
  if (!content.includes(search)) {
    throw new Error(`Could not patch ${label}: expected snippet was not found.`);
  }
  return content.replace(search, replacement);
}

async function ensureWindowsBundleCopy(sourceDir, targetDir) {
  const postgresExe = path.join(targetDir, "native", "bin", "postgres.exe");
  if (existsSync(postgresExe)) {
    return;
  }

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(path.dirname(targetDir), { recursive: true });
  await fs.cp(sourceDir, targetDir, { recursive: true });
}

async function patchBinary(binaryPath) {
  let content = await fs.readFile(binaryPath, "utf8");
  if (content.includes("PAPERCLIP_EMBEDDED_POSTGRES_WINDOWS_X64_ROOT")) {
    return false;
  }

  content = replaceOnce(
    content,
    "import os from 'os';",
    "import os from 'os';\nimport path from 'path';",
    "embedded-postgres dist/binary.js import block",
  );

  content = replaceOnce(
    content,
    "                case 'x64':\n                    return import('@embedded-postgres/windows-x64');",
    [
      "                case 'x64':",
      "                    if (process.env.PAPERCLIP_EMBEDDED_POSTGRES_WINDOWS_X64_ROOT) {",
      "                        const root = path.resolve(process.env.PAPERCLIP_EMBEDDED_POSTGRES_WINDOWS_X64_ROOT);",
      "                        return Promise.resolve({",
      "                            pg_ctl: path.join(root, 'native', 'bin', 'pg_ctl.exe'),",
      "                            initdb: path.join(root, 'native', 'bin', 'initdb.exe'),",
      "                            postgres: path.join(root, 'native', 'bin', 'postgres.exe'),",
      "                        });",
      "                    }",
      "                    return import('@embedded-postgres/windows-x64');",
    ].join("\n"),
    "embedded-postgres dist/binary.js win32/x64 resolution",
  );

  await fs.writeFile(binaryPath, content);
  return true;
}

async function patchIndex(indexPath) {
  let content = await fs.readFile(indexPath, "utf8");
  if (content.includes("this.startedWithPgCtl = true;")) {
    return false;
  }

  content = replaceOnce(
    content,
    "            const { postgres } = yield bin;",
    "            const { pg_ctl, postgres } = yield bin;",
    "embedded-postgres dist/index.js start() bin import",
  );

  content = replaceOnce(
    content,
    "            ensureBinIsExecutable(postgres);\n            yield new Promise((resolve, reject) => {",
    [
      "            ensureBinIsExecutable(postgres);",
      "            ensureBinIsExecutable(pg_ctl);",
      "            if (platform() === 'win32') {",
      "                this.startedWithPgCtl = true;",
      "                const logFile = path.resolve(this.options.databaseDir, 'postgres.log');",
      "                yield new Promise((resolve, reject) => {",
      "                    var _a, _b;",
      "                    let output = '';",
      "                    const controller = spawn(pg_ctl, [",
      "                        '-D',",
      "                        this.options.databaseDir,",
      "                        '-l',",
      "                        logFile,",
      "                        '-o',",
      "                        `-p ${this.options.port.toString()}`,",
      "                        '-w',",
      "                        'start',",
      "                    ], { env: Object.assign(Object.assign({}, globalThis.process.env), { LC_MESSAGES: LC_MESSAGES_LOCALE }) });",
      "                    (_a = controller.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (chunk) => {",
      "                        const message = chunk.toString('utf-8');",
      "                        output += message;",
      "                        this.options.onLog(message);",
      "                    });",
      "                    (_b = controller.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (chunk) => {",
      "                        const message = chunk.toString('utf-8');",
      "                        output += message;",
      "                        this.options.onLog(message);",
      "                    });",
      "                    controller.on('error', reject);",
      "                    controller.on('exit', (code) => {",
      "                        if (code === 0) {",
      "                            resolve();",
      "                            return;",
      "                        }",
      "                        reject(new Error(output.trim() || `pg_ctl start exited with code ${code}`));",
      "                    });",
      "                });",
      "                return;",
      "            }",
      "            yield new Promise((resolve, reject) => {",
    ].join("\n"),
    "embedded-postgres dist/index.js start() Windows pg_ctl block",
  );

  content = replaceOnce(
    content,
    "            // GUARD: If no database is running, immdiately return the function.",
    [
      "            if (platform() === 'win32' && this.startedWithPgCtl) {",
      "                const { pg_ctl } = yield bin;",
      "                ensureBinIsExecutable(pg_ctl);",
      "                yield new Promise((resolve, reject) => {",
      "                    var _a, _b;",
      "                    const controller = spawn(pg_ctl, [",
      "                        '-D',",
      "                        this.options.databaseDir,",
      "                        '-m',",
      "                        'fast',",
      "                        'stop',",
      "                    ], { env: Object.assign(Object.assign({}, globalThis.process.env), { LC_MESSAGES: LC_MESSAGES_LOCALE }) });",
      "                    (_a = controller.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (chunk) => {",
      "                        this.options.onLog(chunk.toString('utf-8'));",
      "                    });",
      "                    (_b = controller.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (chunk) => {",
      "                        this.options.onLog(chunk.toString('utf-8'));",
      "                    });",
      "                    controller.on('error', reject);",
      "                    controller.on('exit', () => resolve());",
      "                });",
      "                this.startedWithPgCtl = false;",
      "                if (this.options.persistent === false) {",
      "                    yield fs.rm(this.options.databaseDir, { recursive: true, force: true });",
      "                }",
      "                return;",
      "            }",
      "            // GUARD: If no database is running, immdiately return the function.",
    ].join("\n"),
    "embedded-postgres dist/index.js stop() Windows pg_ctl block",
  );

  await fs.writeFile(indexPath, content);
  return true;
}

async function main() {
  if (!existsSync(pnpmRoot)) {
    throw new Error("node_modules/.pnpm was not found. Run pnpm install first.");
  }

  const embeddedDir = await findPackageDir(`embedded-postgres@${embeddedVersion}`);
  const windowsBundleDir = await findPackageDir(`@embedded-postgres+windows-x64@${embeddedVersion}`);

  const binaryPath = path.join(embeddedDir, "node_modules", "embedded-postgres", "dist", "binary.js");
  const indexPath = path.join(embeddedDir, "node_modules", "embedded-postgres", "dist", "index.js");
  const sourceBundle = path.join(
    windowsBundleDir,
    "node_modules",
    "@embedded-postgres",
    "windows-x64",
  );

  await ensureWindowsBundleCopy(sourceBundle, bundleRoot);
  const binaryPatched = await patchBinary(binaryPath);
  const indexPatched = await patchIndex(indexPath);

  console.log(`[paperclip] Embedded Postgres bundle: ${bundleRoot}`);
  console.log(
    `[paperclip] embedded-postgres patches: binary=${binaryPatched ? "applied" : "ok"} index=${indexPatched ? "applied" : "ok"}`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(`[paperclip] Windows dev preparation failed: ${message}`);
  process.exit(1);
});
