import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const distDir = path.join(projectRoot, 'dist');
const rootAssetsDir = path.join(projectRoot, 'assets');
const version = process.argv[2] || new Date().toISOString();

async function main() {
  await rm(rootAssetsDir, { recursive: true, force: true });
  await mkdir(rootAssetsDir, { recursive: true });

  await cp(path.join(distDir, 'assets', 'app.js'), path.join(rootAssetsDir, 'app.js'));
  await cp(path.join(distDir, 'assets', 'app.css'), path.join(rootAssetsDir, 'app.css'));

  const buildManifest = {
    version,
    js: 'assets/app.js',
    css: 'assets/app.css',
  };

  await writeFile(path.join(projectRoot, 'build.json'), `${JSON.stringify(buildManifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
