const API = ''

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// --- State ---
let currentTab = 'posts'

// --- Views ---
function showView(name) {
  document.querySelectorAll('.view').forEach((v) => (v.style.display = 'none'))
  document.getElementById(`${name}-view`).style.display = ''
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast')
  toast.textContent = message
  toast.className = `toast toast-${type}`
  toast.style.display = ''
  setTimeout(() => (toast.style.display = 'none'), 3000)
}

// --- Auth ---
async function checkSession() {
  try {
    await api('/auth/session')
    showView('dashboard')
    loadTab('posts')
  } catch {
    showView('login')
  }
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  try {
    await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    document.getElementById('login-error').textContent = ''
    showView('dashboard')
    loadTab('posts')
  } catch (err) {
    document.getElementById('login-error').textContent = err.message
  }
})

document.getElementById('logout-btn').addEventListener('click', async () => {
  await api('/auth/logout', { method: 'POST' })
  showView('login')
})

// --- Tabs ---
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'))
    document.querySelectorAll('.tab-content').forEach((tc) => tc.classList.remove('active'))
    tab.classList.add('active')
    const tabName = tab.dataset.tab
    document.getElementById(`tab-${tabName}`).classList.add('active')
    currentTab = tabName
    loadTab(tabName)
  })
})

async function loadTab(name) {
  if (name === 'posts') await loadPosts()
  else if (name === 'portfolio') await loadPortfolio()
  else if (name === 'profile') await loadProfile()
}

// --- Blog Posts ---
async function loadPosts() {
  const { posts } = await api('/blog/admin/posts')
  const list = document.getElementById('posts-list')
  list.innerHTML = posts.length
    ? posts
        .map(
          (p) => `
    <div class="list-item">
      <div class="list-item-info">
        <div class="list-item-title">${esc(p.title)}</div>
        <div class="list-item-meta">
          ${p.slug} &middot; ${new Date(p.updatedAt).toLocaleDateString()}
          &middot; <span class="badge ${p.published ? 'badge-published' : 'badge-draft'}">${p.published ? 'Published' : 'Draft'}</span>
        </div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-ghost btn-sm" onclick="editPost('${p.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deletePost('${p.id}', '${esc(p.title)}')">Delete</button>
      </div>
    </div>`
        )
        .join('')
    : '<p style="color:#8b949e">No posts yet. Create your first post.</p>'
}

window.editPost = async function (id) {
  const { post } = await api(`/blog/admin/posts/${id}`)
  document.getElementById('post-id').value = post.id
  document.getElementById('post-title').value = post.title
  document.getElementById('post-slug').value = post.slug
  document.getElementById('post-description').value = post.description || ''
  document.getElementById('post-categories').value = Array.isArray(post.categories) ? post.categories.join(', ') : ''
  document.getElementById('post-tags').value = Array.isArray(post.tags) ? post.tags.join(', ') : ''
  document.getElementById('post-cover').value = post.coverImage || ''
  document.getElementById('post-content').value = post.content || ''
  document.getElementById('post-published').checked = post.published
  document.getElementById('post-editor-title').textContent = 'Edit Post'
  document.getElementById('post-editor-modal').style.display = ''
}

window.deletePost = async function (id, title) {
  if (!confirm(`Delete "${title}"?`)) return
  await api(`/blog/admin/posts/${id}`, { method: 'DELETE' })
  showToast('Post deleted')
  loadPosts()
}

document.getElementById('new-post-btn').addEventListener('click', () => {
  document.getElementById('post-id').value = ''
  document.getElementById('post-form').reset()
  document.getElementById('post-editor-title').textContent = 'New Post'
  document.getElementById('post-editor-modal').style.display = ''
})

document.getElementById('post-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const id = document.getElementById('post-id').value
  const body = {
    title: document.getElementById('post-title').value,
    slug: document.getElementById('post-slug').value || undefined,
    description: document.getElementById('post-description').value,
    content: document.getElementById('post-content').value,
    categories: splitComma(document.getElementById('post-categories').value),
    tags: splitComma(document.getElementById('post-tags').value),
    coverImage: document.getElementById('post-cover').value || null,
    published: document.getElementById('post-published').checked,
  }

  if (id) {
    await api(`/blog/admin/posts/${id}`, { method: 'PUT', body: JSON.stringify(body) })
    showToast('Post updated')
  } else {
    await api('/blog/admin/posts', { method: 'POST', body: JSON.stringify(body) })
    showToast('Post created')
  }

  document.getElementById('post-editor-modal').style.display = 'none'
  loadPosts()
})

// --- Portfolio ---
async function loadPortfolio() {
  const { items } = await api('/portfolio/admin/items')
  const list = document.getElementById('portfolio-list')
  list.innerHTML = items.length
    ? items
        .map(
          (p) => `
    <div class="list-item">
      <div class="list-item-info">
        <div class="list-item-title">${esc(p.title)}</div>
        <div class="list-item-meta">${p.slug} &middot; ${p.year || 'N/A'} &middot; ${esc(p.status || '')}</div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-ghost btn-sm" onclick="editPortfolio('${p.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deletePortfolio('${p.id}', '${esc(p.title)}')">Delete</button>
      </div>
    </div>`
        )
        .join('')
    : '<p style="color:#8b949e">No portfolio items yet.</p>'
}

window.editPortfolio = async function (id) {
  const { items } = await api('/portfolio/admin/items')
  const item = items.find((i) => i.id === id)
  if (!item) return
  document.getElementById('portfolio-id').value = item.id
  document.getElementById('portfolio-title').value = item.title
  document.getElementById('portfolio-slug').value = item.slug
  document.getElementById('portfolio-year').value = item.year || ''
  document.getElementById('portfolio-status').value = item.status || ''
  document.getElementById('portfolio-summary').value = item.summary
  document.getElementById('portfolio-cover').value = item.coverImage || ''
  document.getElementById('portfolio-tech').value = Array.isArray(item.techStack) ? item.techStack.join(', ') : ''
  document.getElementById('portfolio-tags').value = Array.isArray(item.tags) ? item.tags.join(', ') : ''
  document.getElementById('portfolio-links').value = JSON.stringify(item.links || {})
  document.getElementById('portfolio-sort').value = item.sortOrder ?? 0
  document.getElementById('portfolio-editor-title').textContent = 'Edit Portfolio Item'
  document.getElementById('portfolio-editor-modal').style.display = ''
}

window.deletePortfolio = async function (id, title) {
  if (!confirm(`Delete "${title}"?`)) return
  await api(`/portfolio/admin/items/${id}`, { method: 'DELETE' })
  showToast('Item deleted')
  loadPortfolio()
}

document.getElementById('new-portfolio-btn').addEventListener('click', () => {
  document.getElementById('portfolio-id').value = ''
  document.getElementById('portfolio-form').reset()
  document.getElementById('portfolio-editor-title').textContent = 'New Portfolio Item'
  document.getElementById('portfolio-editor-modal').style.display = ''
})

document.getElementById('portfolio-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const id = document.getElementById('portfolio-id').value
  let links = {}
  try {
    links = JSON.parse(document.getElementById('portfolio-links').value || '{}')
  } catch {
    showToast('Invalid JSON in links field', 'error')
    return
  }

  const body = {
    title: document.getElementById('portfolio-title').value,
    slug: document.getElementById('portfolio-slug').value || undefined,
    year: document.getElementById('portfolio-year').value || null,
    status: document.getElementById('portfolio-status').value || null,
    summary: document.getElementById('portfolio-summary').value,
    coverImage: document.getElementById('portfolio-cover').value || null,
    techStack: splitComma(document.getElementById('portfolio-tech').value),
    tags: splitComma(document.getElementById('portfolio-tags').value),
    links,
    sortOrder: Number(document.getElementById('portfolio-sort').value) || 0,
  }

  if (id) {
    await api(`/portfolio/admin/items/${id}`, { method: 'PUT', body: JSON.stringify(body) })
    showToast('Item updated')
  } else {
    await api('/portfolio/admin/items', { method: 'POST', body: JSON.stringify(body) })
    showToast('Item created')
  }

  document.getElementById('portfolio-editor-modal').style.display = 'none'
  loadPortfolio()
})

// --- Site Profile ---
async function loadProfile() {
  const { profile } = await api('/site-profile')
  document.getElementById('profile-json').value = JSON.stringify(profile, null, 2)
}

document.getElementById('save-profile-btn').addEventListener('click', async () => {
  try {
    const data = JSON.parse(document.getElementById('profile-json').value)
    await api('/site-profile', { method: 'PUT', body: JSON.stringify({ data }) })
    showToast('Profile saved')
  } catch (err) {
    showToast('Invalid JSON: ' + err.message, 'error')
  }
})

// --- Rebuild ---
document.getElementById('rebuild-btn').addEventListener('click', async () => {
  const btn = document.getElementById('rebuild-btn')
  btn.disabled = true
  btn.textContent = 'Rebuilding...'
  try {
    const result = await api('/admin/rebuild', { method: 'POST' })
    showToast(result.message)
  } catch (err) {
    showToast('Rebuild failed: ' + err.message, 'error')
  } finally {
    btn.disabled = false
    btn.textContent = 'Rebuild Portal'
  }
})

// --- Modal close ---
document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none'
  })
})
document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none'
  })
})

// --- Helpers ---
function esc(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function splitComma(str) {
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// --- Init ---
checkSession()
