#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const wantProd = process.argv.includes('--prod')
const forceTemporary = process.argv.includes('--temporary')
const token = process.env.VERCEL_TOKEN

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

function run(args, inherit = true) {
  const nodeDir = path.dirname(process.execPath)
  const pathKey = process.platform === 'win32' ? 'Path' : 'PATH'
  const currentPath = process.env[pathKey] ?? process.env.PATH ?? ''
  const env = {
    ...process.env,
    CI: 'false',
    VERCEL_TELEMETRY_DISABLED: '1',
    [pathKey]: `${nodeDir}${path.delimiter}${currentPath}`,
  }

  return spawnSync('npx', args, {
    cwd: root,
    shell: process.platform === 'win32',
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    env,
  })
}

function isLoggedIn() {
  if (token) return true
  const result = run(['vercel', 'whoami'], false)
  const text = `${result.stdout ?? ''}${result.stderr ?? ''}`
  return result.status === 0 && !/logged out/i.test(text) && !/error:/i.test(text)
}

console.log('准备部署 Todo App 到 Vercel…')
console.log(`项目目录: ${root}`)

const loggedIn = !forceTemporary && isLoggedIn()
const args = ['vercel', 'deploy', '--yes']

if (token) args.push('--token', token)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
if (supabaseUrl && supabaseKey) {
  args.push('-b', `VITE_SUPABASE_URL=${supabaseUrl}`, '-b', `VITE_SUPABASE_ANON_KEY=${supabaseKey}`)
  args.push('-e', `VITE_SUPABASE_URL=${supabaseUrl}`, '-e', `VITE_SUPABASE_ANON_KEY=${supabaseKey}`)
} else {
  console.log('未找到 VITE_SUPABASE_URL / KEY。线上登录需要在 Vercel 环境变量里配置它们。')
}

if (loggedIn) {
  if (wantProd) args.push('--prod')
  console.log(wantProd ? '已登录，发布生产环境（云端构建）。' : '已登录，发布预览环境（云端构建）。')
} else {
  args.push('--temporary')
  console.log('未检测到 Vercel 登录。将创建可认领的临时部署。')
  console.log('之后可运行 npx vercel login，再执行 npm run deploy 绑定到你的账号。')
}

const result = run(args, true)
process.exit(result.status ?? 1)
