import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..')
const sourceRoot = path.join(rootDir, '.sources')
const docsRoot = path.join(rootDir, 'docs')

const projects = [
  {
    slug: 'lotus-plugin',
    name: 'Lotus-Plugin',
    repository: 'MOPELotus/Lotus-ReFactor',
    branch: 'main',
    readmeCandidates: ['README.md', 'readme.md']
  },
  {
    slug: 'music-hud-paper',
    name: 'MusicHud-Paper',
    repository: 'MOPELotus/MusicHud-Paper',
    branch: '1.21.11',
    readmeCandidates: ['readme.md', 'README.md']
  },
  {
    slug: 'tuneweave',
    name: 'TuneWeave',
    repository: 'MOPELotus/TuneWeave',
    branch: 'main',
    readmeCandidates: ['README.md', 'readme.md']
  }
]

function run(command, args, cwd = rootDir) {
  console.log(`> ${command} ${args.join(' ')}`)
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  }).trim()
}

function removeGenerated(projectDir) {
  const manifestPath = path.join(projectDir, '.generated-files.json')
  if (!fs.existsSync(manifestPath)) return

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    for (const relativePath of manifest.paths ?? []) {
      fs.rmSync(path.join(projectDir, relativePath), {
        recursive: true,
        force: true
      })
    }
  } catch (error) {
    console.warn(`无法读取旧生成清单，将继续覆盖：${error.message}`)
  }

  fs.rmSync(manifestPath, { force: true })
}

function copyIfExists(sourcePath, targetPath, generated, relativeTarget) {
  if (!fs.existsSync(sourcePath)) return false

  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.cpSync(sourcePath, targetPath, { recursive: true, force: true })
  generated.push(relativeTarget)
  return true
}

function findFirstExisting(baseDir, candidates) {
  for (const candidate of candidates) {
    const fullPath = path.join(baseDir, candidate)
    if (fs.existsSync(fullPath)) return fullPath
  }
  return null
}

fs.mkdirSync(sourceRoot, { recursive: true })

const statusRows = []

for (const project of projects) {
  const sourceDir = path.join(sourceRoot, project.slug)
  const projectDir = path.join(docsRoot, 'projects', project.slug)

  fs.mkdirSync(projectDir, { recursive: true })
  removeGenerated(projectDir)
  fs.rmSync(sourceDir, { recursive: true, force: true })

  console.log(`\n=== 同步 ${project.name} ===`)
  run('git', [
    'clone',
    '--depth', '1',
    '--branch', project.branch,
    `https://github.com/${project.repository}.git`,
    sourceDir
  ])

  const commit = run('git', ['rev-parse', 'HEAD'], sourceDir)
  const shortCommit = commit.slice(0, 7)
  const commitTime = run('git', ['show', '-s', '--format=%cI', 'HEAD'], sourceDir)
  const generated = []

  const readme = findFirstExisting(sourceDir, project.readmeCandidates)
  if (!readme) {
    throw new Error(`${project.repository} 未找到 README 文件`)
  }

  copyIfExists(
    readme,
    path.join(projectDir, 'README.source.md'),
    generated,
    'README.source.md'
  )

  // 同时保留 README.md 路由，确保 docs 中指向 ../README.md 的链接可用。
  copyIfExists(
    readme,
    path.join(projectDir, 'README.md'),
    generated,
    'README.md'
  )

  copyIfExists(
    path.join(sourceDir, 'docs'),
    path.join(projectDir, 'docs'),
    generated,
    'docs'
  )

  // 保留 README 可能引用的常见根目录资源。
  for (const assetDir of ['assets', 'images', 'screenshots']) {
    copyIfExists(
      path.join(sourceDir, assetDir),
      path.join(projectDir, assetDir),
      generated,
      assetDir
    )
  }

  // 同步根目录其他 Markdown，例如 THIRD_PARTY_NOTICES.md。
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue
    if (!entry.name.toLowerCase().endsWith('.md')) continue
    if (project.readmeCandidates.some((name) => name.toLowerCase() === entry.name.toLowerCase())) continue
    if (entry.name.toLowerCase() === 'index.md') continue
    if (/^(licen[sc]e|notice)(\.md|\.txt)?$/i.test(entry.name)) continue

    copyIfExists(
      path.join(sourceDir, entry.name),
      path.join(projectDir, entry.name),
      generated,
      entry.name
    )
  }

  const license = findFirstExisting(sourceDir, [
    'LICENSE',
    'LICENSE.md',
    'LICENSE.txt',
    'LICENCE',
    'LICENCE.md',
    'LICENCE.txt'
  ])

  if (license) {
    copyIfExists(
      license,
      path.join(projectDir, 'LICENSE.md'),
      generated,
      'LICENSE.md'
    )
  }

  const notice = findFirstExisting(sourceDir, ['NOTICE', 'NOTICE.md', 'NOTICE.txt'])
  if (notice) {
    copyIfExists(
      notice,
      path.join(projectDir, 'NOTICE.md'),
      generated,
      'NOTICE.md'
    )
  }

  fs.writeFileSync(
    path.join(projectDir, '.generated-files.json'),
    JSON.stringify({ repository: project.repository, branch: project.branch, paths: generated }, null, 2) + '\n',
    'utf8'
  )

  statusRows.push({
    name: project.name,
    repository: project.repository,
    branch: project.branch,
    commit,
    shortCommit,
    commitTime
  })
}

const generatedAt = new Date().toISOString()
const statusPage = `---\ntitle: 文档同步状态\ndescription: 三个项目文档的当前同步版本\noutline: false\n---\n\n# 文档同步状态\n\n本页由 \`npm run docs:sync\` 自动生成。\n\n| 项目 | 分支 | 当前提交 | 源提交时间 |\n| --- | --- | --- | --- |\n${statusRows.map((row) => `| [${row.name}](https://github.com/${row.repository}) | \`${row.branch}\` | [\`${row.shortCommit}\`](https://github.com/${row.repository}/commit/${row.commit}) | ${row.commitTime} |`).join('\n')}\n\n站点同步时间：\`${generatedAt}\`\n`

fs.writeFileSync(path.join(docsRoot, 'sync-status.md'), statusPage, 'utf8')
console.log('\n文档同步完成。')
