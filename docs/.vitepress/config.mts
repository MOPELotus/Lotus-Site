import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'

const configDir = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(configDir, '..')

const directoryLabels: Record<string, string> = {
  docs: '文档',
  features: '功能详情',
  coverage: '覆盖状态',
  guide: '指南',
  api: 'API',
  reference: '参考',
  examples: '示例'
}

function cleanTitle(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[＊*_~]/g, '')
    .trim()
}

function getMarkdownTitle(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const frontmatter = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/)
    const titleInFrontmatter = frontmatter?.[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)
    if (titleInFrontmatter?.[1]) return cleanTitle(titleInFrontmatter[1])

    const h1 = content.match(/^#\s+(.+?)\s*$/m)
    if (h1?.[1]) return cleanTitle(h1[1])
  } catch {
    // 使用文件名作为后备标题。
  }

  return path.basename(filePath, path.extname(filePath))
}

function prettyDirectoryName(name: string): string {
  return directoryLabels[name] ?? name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function buildSidebarItems(directory: string, routeBase: string): DefaultTheme.SidebarItem[] {
  if (!fs.existsSync(directory)) return []

  const entries = fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? 1 : -1
      if (a.name.toLowerCase() === 'readme.md') return -1
      if (b.name.toLowerCase() === 'readme.md') return 1
      return a.name.localeCompare(b.name, 'zh-CN')
    })

  const items: DefaultTheme.SidebarItem[] = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      const children = buildSidebarItems(absolutePath, `${routeBase}/${entry.name}`)
      if (children.length > 0) {
        items.push({
          text: prettyDirectoryName(entry.name),
          collapsed: true,
          items: children
        })
      }
      continue
    }

    if (!entry.name.toLowerCase().endsWith('.md')) continue

    const basename = entry.name.slice(0, -3)
    items.push({
      text: getMarkdownTitle(absolutePath),
      link: `${routeBase}/${basename}`
    })
  }

  return items
}

function createProjectSidebar(
  slug: string,
  displayName: string,
  repository: string
): DefaultTheme.SidebarItem[] {
  const projectRoot = path.join(docsRoot, 'projects', slug)
  const docsItems = buildSidebarItems(
    path.join(projectRoot, 'docs'),
    `/projects/${slug}/docs`
  )

  const groups: DefaultTheme.SidebarItem[] = [
    {
      text: displayName,
      items: [
        { text: '项目概览', link: `/projects/${slug}/` },
        { text: '源代码仓库', link: `https://github.com/${repository}` }
      ]
    }
  ]

  if (docsItems.length > 0) {
    groups.push({
      text: '项目文档',
      collapsed: false,
      items: docsItems
    })
  }

  const licensePath = path.join(projectRoot, 'LICENSE.md')
  if (fs.existsSync(licensePath)) {
    groups.push({
      text: '其他',
      items: [{ text: '许可证', link: `/projects/${slug}/LICENSE` }]
    })
  }

  return groups
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'MOPELotus',
  titleTemplate: ':title · MOPELotus',
  description: 'MOPELotus 项目文档',
  base: '/',
  cleanUrls: false,
  srcExclude: ['projects/*/README.source.md'],
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/lotus.svg' }],
    ['meta', { name: 'theme-color', content: '#8b5cf6' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }]
  ],

  markdown: {
    lineNumbers: true
  },

  themeConfig: {
    logo: '/lotus.svg',

    nav: [
      { text: '首页', link: '/' },
      {
        text: '项目',
        items: [
          { text: 'Lotus-Plugin', link: '/projects/lotus-plugin/' },
          { text: 'MusicHud-Paper', link: '/projects/music-hud-paper/' },
          { text: 'TuneWeave', link: '/projects/tuneweave/' }
        ]
      },
      { text: '同步状态', link: '/sync-status' },
      { text: '关于', link: '/about' },
      { text: 'GitHub', link: 'https://github.com/MOPELotus/' }
    ],

    sidebar: {
      '/projects/lotus-plugin/': createProjectSidebar(
        'lotus-plugin',
        'Lotus-Plugin',
        'MOPELotus/Lotus-ReFactor'
      ),
      '/projects/music-hud-paper/': createProjectSidebar(
        'music-hud-paper',
        'MusicHud-Paper',
        'MOPELotus/MusicHud-Paper'
      ),
      '/projects/tuneweave/': createProjectSidebar(
        'tuneweave',
        'TuneWeave',
        'MOPELotus/TuneWeave'
      )
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MOPELotus/' }
    ],

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    footer: {
      message: '项目介绍、使用文档与技术说明',
      copyright: 'Copyright © MOPELotus<br><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">晋ICP备2025054157号-1</a>'
    }
  },

  sitemap: {
    hostname: 'https://lotusshared.cn'
  }
})
