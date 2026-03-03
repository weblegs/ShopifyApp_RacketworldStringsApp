/**
 * Patches @react-router/dev to silently skip EPERM/ENOTEMPTY errors when
 * cleaning the .react-router/types directory on Windows (caused by +types
 * folders getting bad ACLs due to the '+' character in directory names).
 */
const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "@react-router",
  "dev",
  "dist",
  "vite.js"
);

if (!fs.existsSync(target)) {
  console.log("patch-react-router: vite.js not found, skipping.");
  process.exit(0);
}

let content = fs.readFileSync(target, "utf8");
let changed = false;

// Patch 1: watch() initial cleanup
const orig1 =
  "  await import_promises.default.rm(typesDirectory(ctx), { recursive: true, force: true });";
const fix1 =
  "  try { await import_promises.default.rm(typesDirectory(ctx), { recursive: true, force: true }); } catch(e) {}";

if (content.includes(orig1)) {
  content = content.replace(orig1, fix1);
  changed = true;
  console.log("patch-react-router: patch 1 applied (watch cleanup).");
} else if (!content.includes(fix1)) {
  console.log("patch-react-router: patch 1 target not found, skipping.");
}

// Patch 2: clearRouteModuleAnnotations() per-save cleanup
const orig2 =
`async function clearRouteModuleAnnotations(ctx) {
  await import_promises.default.rm(
    Path4.join(typesDirectory(ctx), Path4.basename(ctx.config.appDirectory)),
    { recursive: true, force: true }
  );
}`;
const fix2 =
`async function clearRouteModuleAnnotations(ctx) {
  try {
    await import_promises.default.rm(
      Path4.join(typesDirectory(ctx), Path4.basename(ctx.config.appDirectory)),
      { recursive: true, force: true }
    );
  } catch(e) {}
}`;

if (content.includes(orig2)) {
  content = content.replace(orig2, fix2);
  changed = true;
  console.log("patch-react-router: patch 2 applied (clearRouteModuleAnnotations).");
} else if (!content.includes(fix2)) {
  console.log("patch-react-router: patch 2 target not found, skipping.");
}

// Patch 3: write() - skip files that can't be created (e.g. +types on Windows)
const orig3 =
`async function write(...files) {
  return Promise.all(
    files.map(async ({ filename: filename2, content }) => {
      await import_promises.default.mkdir(Path4.dirname(filename2), { recursive: true });
      await import_promises.default.writeFile(filename2, content);
    })
  );
}`;
const fix3 =
`async function write(...files) {
  return Promise.all(
    files.map(async ({ filename: filename2, content }) => {
      try {
        await import_promises.default.mkdir(Path4.dirname(filename2), { recursive: true });
        await import_promises.default.writeFile(filename2, content);
      } catch(e) {}
    })
  );
}`;

if (content.includes(orig3)) {
  content = content.replace(orig3, fix3);
  changed = true;
  console.log("patch-react-router: patch 3 applied (write).");
} else if (!content.includes(fix3)) {
  console.log("patch-react-router: patch 3 target not found, skipping.");
}

if (changed) {
  fs.writeFileSync(target, content, "utf8");
  console.log("patch-react-router: done.");
} else {
  console.log("patch-react-router: already fully applied.");
}
