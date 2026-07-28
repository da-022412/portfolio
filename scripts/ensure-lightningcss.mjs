import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function getPackageName() {
  const { platform, arch } = process;

  if (platform === "darwin" && arch === "arm64") return "lightningcss-darwin-arm64";
  if (platform === "darwin" && arch === "x64") return "lightningcss-darwin-x64";
  if (platform === "linux" && arch === "arm64") return "lightningcss-linux-arm64-gnu";
  if (platform === "linux" && arch === "x64") return "lightningcss-linux-x64-gnu";
  if (platform === "win32" && arch === "arm64") return "lightningcss-win32-arm64-msvc";
  if (platform === "win32" && arch === "x64") return "lightningcss-win32-x64-msvc";

  return null;
}

try {
  require("lightningcss");
  process.exit(0);
} catch {
  const pkgName = getPackageName();
  if (!pkgName) {
    console.warn(
      `No lightningcss binary mapping for platform=${process.platform} arch=${process.arch}.`,
    );
    process.exit(0);
  }

  const { version } = require("lightningcss/package.json");
  const installTarget = `${pkgName}@${version}`;

  console.log(`Installing missing optional dependency: ${installTarget}`);
  execSync(`npm install --no-save ${installTarget}`, { stdio: "inherit" });
}
