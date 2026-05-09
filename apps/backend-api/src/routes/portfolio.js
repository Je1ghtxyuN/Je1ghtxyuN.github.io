import { Hono } from 'hono'
import { prisma } from '../db/client.js'
import { requireAuth } from '../middleware/auth.js'
import { slugify } from '../utils/slug.js'

const portfolio = new Hono()

// Public: list portfolio items
portfolio.get('/items', async (c) => {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true, title: true, slug: true, year: true, status: true,
      summary: true, coverImage: true, techStack: true, tags: true,
      links: true, gallery: true, sortOrder: true,
    },
  })

  return c.json({ items })
})

// Public: get single item by slug
portfolio.get('/items/:slug', async (c) => {
  const item = await prisma.portfolioItem.findUnique({
    where: { slug: c.req.param('slug') },
  })

  if (!item) {
    return c.json({ error: 'Item not found' }, 404)
  }

  return c.json({ item })
})

// Admin: list all items
portfolio.get('/admin/items', requireAuth(), async (c) => {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return c.json({ items })
})

// Admin: create item
portfolio.post('/admin/items', requireAuth(), async (c) => {
  let body
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  const { title, slug, year, status, summary, coverImage, techStack, tags, links, gallery, sortOrder } = body ?? {}

  if (!title || !summary) {
    return c.json({ error: 'Title and summary are required' }, 400)
  }

  const finalSlug = slug ? slugify(slug) : slugify(title)
  if (!finalSlug) {
    return c.json({ error: 'Could not generate a valid slug' }, 400)
  }

  const existing = await prisma.portfolioItem.findUnique({ where: { slug: finalSlug } })
  if (existing) {
    return c.json({ error: `Slug "${finalSlug}" already exists` }, 409)
  }

  const item = await prisma.portfolioItem.create({
    data: {
      title,
      slug: finalSlug,
      year: year || null,
      status: status || null,
      summary,
      coverImage: coverImage || null,
      techStack: techStack || [],
      tags: tags || [],
      links: links || {},
      gallery: gallery || [],
      sortOrder: sortOrder ?? 0,
    },
  })

  return c.json({ item }, 201)
})

// Admin: update item
portfolio.put('/admin/items/:id', requireAuth(), async (c) => {
  const id = c.req.param('id')

  let body
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  const existing = await prisma.portfolioItem.findUnique({ where: { id } })
  if (!existing) {
    return c.json({ error: 'Item not found' }, 404)
  }

  const { title, slug, year, status, summary, coverImage, techStack, tags, links, gallery, sortOrder } = body ?? {}

  if (slug && slugify(slug) !== existing.slug) {
    const newSlug = slugify(slug)
    const conflict = await prisma.portfolioItem.findUnique({ where: { slug: newSlug } })
    if (conflict) {
      return c.json({ error: `Slug "${newSlug}" already exists` }, 409)
    }
  }

  const item = await prisma.portfolioItem.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug: slugify(slug) }),
      ...(year !== undefined && { year }),
      ...(status !== undefined && { status }),
      ...(summary !== undefined && { summary }),
      ...(coverImage !== undefined && { coverImage }),
      ...(techStack !== undefined && { techStack }),
      ...(tags !== undefined && { tags }),
      ...(links !== undefined && { links }),
      ...(gallery !== undefined && { gallery }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  })

  return c.json({ item })
})

// Admin: delete item
portfolio.delete('/admin/items/:id', requireAuth(), async (c) => {
  const id = c.req.param('id')

  const existing = await prisma.portfolioItem.findUnique({ where: { id } })
  if (!existing) {
    return c.json({ error: 'Item not found' }, 404)
  }

  await prisma.portfolioItem.delete({ where: { id } })

  return c.json({ ok: true })
})

export { portfolio }
