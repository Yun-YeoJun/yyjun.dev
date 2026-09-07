import { cpSync, rmSync } from "node:fs";
import { validateBuildLinks } from "./validate-build-links.ts";

const errors = validateBuildLinks(
  "dist",
  process.env.BASE_PATH || "/",
  process.env.SITE_URL || "http://localhost:4321"
);
if (errors.length) {
  process.stderr.write(errors.join("\n") + "\n");
  process.exitCode = 1;
} else {
  // Use Node's filesystem API so npm run build also works on Windows.
  rmSync("public/pagefind", { recursive: true, force: true });
  cpSync("dist/pagefind", "public/pagefind", { recursive: true });
  process.stdout.write(
    "빌드된 모든 페이지의 내부 링크, 이미지와 제목 앵커를 확인했습니다.\n"
  );
}
