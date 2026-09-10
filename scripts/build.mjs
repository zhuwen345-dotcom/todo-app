#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadEnvFile(fileName) {
  try {
    const text = readFileSync(path.join(root, fileName), 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq < 1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (key && process.env[key] === undefined) process.env[key] = value
    }
  } catch {
    /* optional */
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

if (!process.env.VITE_SUPABASE_ANON_KEY && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
}

if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
  console.log('已载入 Supabase 配置，构建后可使用云端登录。')
} else {
  console.log('警告：未找到 Supabase 环境变量，线上将无法注册/登录。')
}

function run(bin, args) {
  const result = spawnSync(process.execPath, [bin, ...args], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })
  if (result.status) process.exit(result.status)
}

run(path.join(root, 'node_modules/typescript/bin/tsc'), ['-b'])
run(path.join(root, 'node_modules/vite/bin/vite.js'), ['build'])
