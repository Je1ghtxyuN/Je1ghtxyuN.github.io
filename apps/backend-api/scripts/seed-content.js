import 'dotenv/config'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { prisma } from '../src/db/client.js'
import { slugify } from '../src/utils/slug.js'

const require = createRequire(import.meta.url)
const yaml = require('js-yaml')

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..', '..')
const portalRoot = join(repoRoot, 'apps', 'blog-portal')
const dataDir = join(portalRoot, 'source', '_data')
const postsDir = join(portalRoot, 'source', '_posts')

async function seedSiteProfile() {
  const content = readFileSync(join(dataDir, 'site_profile.yml'), 'utf-8')
  const data = yaml.load(content)

  console.log('[seed] Importing site profile...')
  await prisma.siteProfile.upsert({
    where: { id: 'default' },
    update: { data },
    create: { id: 'default', data },
  })
  console.log('[seed] Site profile imported.')
}

async function seedPortfolio() {
  const content = readFileSync(join(dataDir, 'portfolio.yml'), 'utf-8')
  const parsed = yaml.load(content)

  const cards = parsed?.cards || []
  if (!Array.isArray(cards) || cards.length === 0) {
    console.log('[seed] No portfolio cards found.')
    return
  }

  console.log(`[seed] Importing ${cards.length} portfolio items...`)
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const slug = card.slug || slugify(card.title || 'untitled')

    await prisma.portfolioItem.upsert({
      where: { slug },
      update: {
        title: card.title || 'Untitled',
        year: String(card.year || ''),
        status: card.status || '',
        summary: card.summary || '',
        coverImage: card.cover_image || null,
        techStack: Array.isArray(card.tech_stack) ? card.tech_stack : [],
        tags: Array.isArray(card.tags) ? card.tags : [],
        links: card.links || {},
        gallery: Array.isArray(card.gallery) ? card.gallery : [],
        sortOrder: i,
      },
      create: {
        title: card.title || 'Untitled',
        slug,
        year: String(card.year || ''),
        status: card.status || '',
        summary: card.summary || '',
        coverImage: card.cover_image || null,
        techStack: Array.isArray(card.tech_stack) ? card.tech_stack : [],
        tags: Array.isArray(card.tags) ? card.tags : [],
        links: card.links || {},
        gallery: Array.isArray(card.gallery) ? card.gallery : [],
        sortOrder: i,
      },
    })
  }
  console.log('[seed] Portfolio items imported.')
}

async function seedBlogPosts() {
  let files
  try {
    files = readdirSync(postsDir)
  } catch {
    console.log('[seed] No posts directory found.')
    return
  }

  const mdFiles = files.filter((f) => f.endsWith('.md'))
  let count = 0

  for (const file of mdFiles) {
    const filePath = join(postsDir, file)
    const content = readFileSync(filePath, 'utf-8')

    if (content.startsWith('<!-- managed-by-backend-api -->')) continue

    // Parse Hexo frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    if (!match) {
      console.log(`[seed] Skipping ${file}: no frontmatter found`)
      continue
    }

    const frontmatter = yaml.load(match[1])
    const body = match[2].trim()
    const slug = file.replace(/\.md$/, '')

    console.log(`[seed] Importing post: ${frontmatter.title || slug}`)

    await prisma.blogPost.upsert({
      where: { slug },
      update: {
        title: frontmatter.title || slug,
        description: frontmatter.description || '',
        content: body,
        categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : (frontmatter.categories ? [frontmatter.categories] : []),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? [frontmatter.tags] : []),
        published: true,
        publishedAt: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      },
      create: {
        title: frontmatter.title || slug,
        slug,
        description: frontmatter.description || '',
        content: body,
        categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : (frontmatter.categories ? [frontmatter.categories] : []),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? [frontmatter.tags] : []),
        published: true,
        publishedAt: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      },
    })
    count++
  }
  console.log(`[seed] ${count} blog posts imported.`)
}

async function main() {
  console.log('[seed] Starting content import...')

  await seedSiteProfile()
  await seedPortfolio()
  await seedBlogPosts()

  // Clean up the test entries we created earlier
  const testPosts = await prisma.blogPost.findMany({
    where: { slug: { in: ['hello-world', 'my-first-blog-post'] } },
  })
  if (testPosts.length > 0) {
    await prisma.blogPost.deleteMany({
      where: { slug: { in: ['hello-world', 'my-first-blog-post'] } },
    })
    console.log(`[seed] Cleaned up ${testPosts.length} test posts.`)
  }

  console.log('[seed] Content import complete.')
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('[seed] Import failed:', err)
  process.exit(1)
})
