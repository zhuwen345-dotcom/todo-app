#!/usr/bin/env node
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function run(bin, args) {
  const result = spawnSync(process.execPath, [bin, ...args], {
    cwd: root,
    stdio: 'inherit',
  })
  if (result.status) process.exit(result.status)
}

console.log('本地构建 Vite 产物…')
run(path.join(root, 'scripts/build.mjs'), [])

const outputDir = path.join(root, '.vercel', 'output')
rmSync(outputDir, { recursive: true, force: true })
mkdirSync(path.join(outputDir, 'static'), { recursive: true })
cpSync(path.join(root, 'dist'), path.join(outputDir, 'static'), { recursive: true })
writeFileSync(
  path.join(outputDir, 'config.json'),
  `${JSON.stringify(
    {
      version: 3,
      routes: [{ handle: 'filesystem' }, { src: '/(.*)', dest: '/index.html' }],
    },
    null,
    2,
  )}\n`,
)

console.log('已写入 .vercel/output ，可执行 vercel deploy --prebuilt')
