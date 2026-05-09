import { Hono } from 'hono'
import { prisma } from '../db/client.js'
import { requireAuth } from '../middleware/auth.js'
import { slugify } from '../utils/slug.js'

const blog = new Hono()

// Public: list published posts
blog.get('/posts', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(c.req.query('limit')) || 10))
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, title: true, slug: true, description: true,
        categories: true, tags: true, coverImage: true,
        publishedAt: true, createdAt: true,
      },
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ])

  return c.json({ posts, total, page, limit })
})

// Public: get single post by slug
blog.get('/posts/:slug', async (c) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug: c.req.param('slug') },
  })

  if (!post || !post.published) {
    return c.json({ error: 'Post not found' }, 404)
  }

  return c.json({ post })
})

// Admin: list all posts (including drafts)
blog.get('/admin/posts', requireAuth(), async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(c.req.query('limit')) || 20))
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count(),
  ])

  return c.json({ posts, total, page, limit })
})

// Admin: get single post (including drafts)
blog.get('/admin/posts/:id', requireAuth(), async (c) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: c.req.param('id') },
  })

  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }

  return c.json({ post })
})

// Admin: create post
blog.post('/admin/posts', requireAuth(), async (c) => {
  let body
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  const { title, slug, description, content, categories, tags, coverImage, published } = body ?? {}

  if (!title || !content) {
    return c.json({ error: 'Title and content are required' }, 400)
  }

  const finalSlug = slug ? slugify(slug) : slugify(title)
  if (!finalSlug) {
    return c.json({ error: 'Could not generate a valid slug' }, 400)
  }

  // Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } })
  if (existing) {
    return c.json({ error: `Slug "${finalSlug}" already exists` }, 409)
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: finalSlug,
      description: description || '',
      content,
      categories: categories || [],
      tags: tags || [],
      coverImage: coverImage || null,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
    },
  })

  return c.json({ post }, 201)
})

// Admin: update post
blog.put('/admin/posts/:id', requireAuth(), async (c) => {
  const id = c.req.param('id')

  let body
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) {
    return c.json({ error: 'Post not found' }, 404)
  }

  const { title, slug, description, content, categories, tags, coverImage, published } = body ?? {}

  // If slug is being changed, check uniqueness
  if (slug && slugify(slug) !== existing.slug) {
    const newSlug = slugify(slug)
    const conflict = await prisma.blogPost.findUnique({ where: { slug: newSlug } })
    if (conflict) {
      return c.json({ error: `Slug "${newSlug}" already exists` }, 409)
    }
  }

  // Determine publishedAt: set if transitioning to published
  let publishedAt = existing.publishedAt
  if (published === true && !existing.published) {
    publishedAt = new Date()
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug: slugify(slug) }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(categories !== undefined && { categories }),
      ...(tags !== undefined && { tags }),
      ...(coverImage !== undefined && { coverImage }),
      ...(published !== undefined && { published }),
      publishedAt,
    },
  })

  return c.json({ post })
})

// Admin: delete post
blog.delete('/admin/posts/:id', requireAuth(), async (c) => {
  const id = c.req.param('id')

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) {
    return c.json({ error: 'Post not found' }, 404)
  }

  await prisma.blogPost.delete({ where: { id } })

  return c.json({ ok: true })
})

export { blog }
