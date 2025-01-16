// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  importMap: "deno.json",
  typeCheck: false,
  shims: {
    deno: true,
  },
  package: {
    name: "@temboplus/frontend-core",
    version: Deno.args[0],
    private: false,
    description: "A JavaScript/TypeScript package providing common utilities and logic shared across front-end TemboPlus projects.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/TemboPlus-Frontend/frontend-core-js.git",
    },
    bugs: {
      url: "https://github.com/TemboPlus-Frontend/frontend-core-js/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
