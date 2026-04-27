const { url_for: urlFor } = require('hexo-util')

const resolveInternalUrl = urlFor.bind(hexo)

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const stripHtml = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const splitLines = (value = '') =>
  String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

const normalizeCollection = (collection) => {
  if (!collection) return []
  if (typeof collection.toArray === 'function') return collection.toArray()
  if (Array.isArray(collection.data)) return collection.data.slice()
  if (collection.data && typeof collection.data[Symbol.iterator] === 'function') {
    return Array.from(collection.data)
  }
  return Array.isArray(collection) ? collection.slice() : []
}

const isExternalPath = (path, explicitExternal = false) =>
  Boolean(
    explicitExternal ||
      /^(https?:)?\/\//.test(path || '') ||
      String(path || '').startsWith('mailto:')
  )

const resolveHref = (ctx, path, explicitExternal = false) => {
  if (!path) return '#'
  return isExternalPath(path, explicitExternal) ? path : resolveInternalUrl(path)
}

const renderAttrs = (attrs = {}) =>
  Object.entries(attrs)
    .filter(([, value]) => value !== null && value !== undefined && value !== false && value !== '')
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(' ')

const renderTag = (tag, attrs = {}, content = '') => {
  const attrText = renderAttrs(attrs)
  return attrText ? `<${tag} ${attrText}>${content}</${tag}>` : `<${tag}>${content}</${tag}>`
}

const renderParagraphs = (value = '', className = '') =>
  splitLines(value)
    .map((line) => renderTag('p', className ? { class: className } : {}, escapeHtml(line)))
    .join('')

const renderChips = (items = []) =>
  items.length
    ? renderTag(
        'div',
        { class: 'portal-chip-grid' },
        items.map((item) => renderTag('span', { class: 'portal-chip' }, escapeHtml(item))).join('')
      )
    : renderTag(
        'div',
        { class: 'portal-empty-state' },
        renderTag('p', {}, 'No items configured yet.')
      )

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateTime = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

const getPortalData = () => {
  const data = hexo.locals.get('data') || {}
  return {
    profile: data.site_profile || {},
    navigation: data.navigation || {},
    portfolio: data.portfolio || {},
  }
}

const getRecentPosts = (limit = 4) =>
  normalizeCollection(hexo.locals.get('posts'))
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, limit)

const getProjectLinks = (card = {}) => {
  const links = card.links || {}
  return [
    { label: 'Demo', url: links.demo },
    { label: 'Repository', url: links.repo },
    { label: 'Article', url: links.article },
  ].filter((item) => item.url)
}

const renderSocialLinks = (ctx, links = []) => {
  if (!links.length) {
    return renderTag(
      'p',
      { class: 'portal-card__copy' },
      'No social links configured yet.'
    )
  }

  return renderTag(
    'div',
    { class: 'portal-social-list' },
    links
      .map((link) =>
        renderTag(
          'a',
          {
            class: 'portal-social-pill',
            href: resolveHref(ctx, link.url, true),
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          `${link.icon ? renderTag('i', { class: link.icon }, '') : ''}${renderTag(
            'span',
            {},
            escapeHtml(link.label || 'Link')
          )}`
        )
      )
      .join('')
  )
}

const renderContactMeta = (contact = {}) => {
  const items = []

  if (contact.email) {
    items.push(
      renderTag(
        'li',
        {},
        `${renderTag('strong', {}, 'Email:')} ${escapeHtml(contact.email)}`
      )
    )
  }

  if (contact.location) {
    items.push(
      renderTag(
        'li',
        {},
        `${renderTag('strong', {}, 'Location:')} ${escapeHtml(contact.location)}`
      )
    )
  }

  if (contact.availability_note) {
    items.push(renderTag('li', {}, escapeHtml(contact.availability_note)))
  }

  return items.length
    ? renderTag('ul', { class: 'portal-meta-list' }, items.join(''))
    : renderTag(
        'p',
        { class: 'portal-card__copy' },
        'No contact metadata configured yet.'
      )
}

const renderProjectCard = (ctx, card = {}, linkLabel = 'View Project') => {
  const links = getProjectLinks(card)
  const actions = links.length
    ? renderTag(
        'div',
        { class: 'portal-action-row' },
        links
          .map((link) =>
            renderTag(
              'a',
              {
                class: 'portal-button',
                href: resolveHref(ctx, link.url, true),
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              escapeHtml(link.label || linkLabel)
            )
          )
          .join('')
      )
    : ''

  const tags = Array.isArray(card.tags) && card.tags.length
    ? renderTag(
        'div',
        { class: 'portal-chip-grid portal-chip-grid--compact' },
        card.tags.map((tag) => renderTag('span', { class: 'portal-chip' }, escapeHtml(tag))).join('')
      )
    : ''

  const cover = card.cover_image
    ? renderTag(
        'div',
        { class: 'portal-project-card__cover' },
        `<img src="${escapeHtml(resolveInternalUrl(card.cover_image))}" alt="${escapeHtml(card.title || 'Project cover')}">`
      )
    : ''

  return renderTag(
    'article',
    { class: 'portal-card portal-project-card' },
    `${cover}${renderTag(
      'div',
      { class: 'portal-project-card__body' },
      `${renderTag(
        'div',
        { class: 'portal-inline-meta' },
        `${renderTag('h3', { class: 'portal-card__title' }, escapeHtml(card.title || 'Untitled Project'))}${
          card.year ? renderTag('span', { class: 'portal-badge' }, escapeHtml(card.year)) : ''
        }`
      )}${
        card.status ? renderTag('p', { class: 'portal-card__meta' }, escapeHtml(card.status)) : ''
      }${
        card.summary ? renderTag('p', { class: 'portal-card__copy' }, escapeHtml(card.summary)) : ''
      }${tags}${actions}`
    )}`
  )
}

const renderHome = function () {
  const ctx = this
  const { profile, navigation, portfolio } = getPortalData()
  const home = profile.home || {}
  const shortcuts = navigation.home_shortcuts || {}
  const shortcutItems = Array.isArray(shortcuts.items) ? shortcuts.items : []
  const portfolioSection = portfolio.section || {}
  const portfolioCards = Array.isArray(portfolio.cards) ? portfolio.cards : []
  const previewLimit = portfolioSection.home_preview_limit || 3
  const recentPosts = getRecentPosts(home.recent_posts_limit || 4)
  const ownerName =
    (profile.owner && profile.owner.display_name) || hexo.config.author || hexo.config.title
  const currentYear = new Date().getFullYear()
  const sinceYear = profile.site_started_year || currentYear

  const hero = renderTag(
    'section',
    { class: 'portal-section portal-hero-card' },
    `${renderTag(
      'div',
      { class: 'portal-hero-card__media' },
      `<img class="portal-avatar" src="${escapeHtml(
        resolveInternalUrl(profile.avatar_path || '/shared-assets/images/profile.jpg')
      )}" alt="${escapeHtml(ownerName)}">`
    )}${renderTag(
      'div',
      { class: 'portal-hero-card__body' },
      `${renderTag('p', { class: 'portal-eyebrow' }, escapeHtml(hexo.config.title || ownerName))}${renderTag(
        'h1',
        { class: 'portal-title' },
        escapeHtml(ownerName)
      )}${
        profile.subtitle
          ? renderTag('p', { class: 'portal-subtitle' }, escapeHtml(profile.subtitle))
          : ''
      }${
        profile.intro && profile.intro.short
          ? renderTag('p', { class: 'portal-lead' }, escapeHtml(profile.intro.short))
          : ''
      }${
        profile.intro && profile.intro.long
          ? renderTag('div', { class: 'portal-copy' }, renderParagraphs(profile.intro.long))
          : ''
      }`
    )}`
  )

  const shortcutSection = shortcutItems.length
    ? renderTag(
        'section',
        { class: 'portal-section' },
        `${renderTag(
          'div',
          { class: 'portal-section-heading' },
          `${renderTag(
            'h2',
            {},
            escapeHtml(shortcuts.title || home.shortcuts_title || 'Quick Entry')
          )}${
            shortcuts.description ? renderTag('p', {}, escapeHtml(shortcuts.description)) : ''
          }`
        )}${renderTag(
          'div',
          { class: 'portal-card-grid portal-card-grid--shortcuts' },
          shortcutItems
            .map((item) =>
              renderTag(
                'a',
                {
                  class: 'portal-card portal-shortcut-card',
                  href: resolveHref(ctx, item.path, item.external),
                  target: isExternalPath(item.path, item.external) ? '_blank' : null,
                  rel: isExternalPath(item.path, item.external) ? 'noopener noreferrer' : null,
                },
                `${item.icon ? renderTag('i', { class: item.icon }, '') : ''}${renderTag(
                  'h3',
                  { class: 'portal-card__title' },
                  escapeHtml(item.label || 'Entry')
                )}${
                  item.description
                    ? renderTag('p', { class: 'portal-card__copy' }, escapeHtml(item.description))
                    : ''
                }`
              )
            )
            .join('')
        )}`
      )
    : ''

  const recentPostsSection = renderTag(
    'section',
    { class: 'portal-section' },
    `${renderTag(
      'div',
      { class: 'portal-section-heading' },
      `${renderTag(
        'h2',
        {},
        escapeHtml(home.recent_posts_title || 'Recent Writing')
      )}${renderTag(
        'p',
        {},
        'Latest posts from the portal publishing surface.'
      )}`
    )}${
      recentPosts.length
        ? renderTag(
            'div',
            { class: 'portal-post-list' },
            recentPosts
              .map((post) => {
                const excerptSource = post.description || post.excerpt || post.content || ''
                const excerptBase = stripHtml(excerptSource)
                const excerpt =
                  excerptBase.length > 160 ? `${excerptBase.slice(0, 160)}...` : excerptBase
                return renderTag(
                  'article',
                  { class: 'portal-card portal-post-card' },
                  `${renderTag(
                    'div',
                    { class: 'portal-post-card__meta' },
                    renderTag(
                      'time',
                      { datetime: formatDateTime(post.date) },
                      escapeHtml(formatDate(post.date))
                    )
                  )}${renderTag(
                    'h3',
                    { class: 'portal-card__title' },
                    renderTag(
                      'a',
                      { href: resolveHref(ctx, post.path) },
                      escapeHtml(post.title || 'Untitled Post')
                    )
                  )}${renderTag(
                    'p',
                    { class: 'portal-card__copy' },
                    escapeHtml(excerpt || 'Open the article to read more.')
                  )}`
                )
              })
              .join('')
          )
        : renderTag(
            'div',
            { class: 'portal-empty-state' },
            renderTag(
              'p',
              {},
              escapeHtml(
                home.recent_posts_empty_text ||
                  'No posts are published yet. The portal structure is ready for the first articles.'
              )
            )
          )
    }`
  )

  const portfolioSectionHtml = portfolioCards.length
    ? renderTag(
        'section',
        { class: 'portal-section' },
        `${renderTag(
          'div',
          { class: 'portal-section-heading' },
          `${renderTag(
            'h2',
            {},
            escapeHtml(
              portfolioSection.home_preview_title ||
                home.portfolio_preview_title ||
                portfolioSection.title ||
                'Project Preview'
            )
          )}${
            portfolioSection.home_preview_intro
              ? renderTag('p', {}, escapeHtml(portfolioSection.home_preview_intro))
              : ''
          }`
        )}${renderTag(
          'div',
          { class: 'portal-card-grid portal-card-grid--projects' },
          portfolioCards
            .slice(0, previewLimit)
            .map((card) => renderProjectCard(ctx, card, portfolioSection.page_link_label))
            .join('')
        )}`
      )
    : ''

  const footerInfo = renderTag(
    'section',
    { class: 'portal-section portal-footer-panel' },
    `${renderTag(
      'div',
      { class: 'portal-section-heading' },
      `${renderTag(
        'h2',
        {},
        escapeHtml(home.footer_title || 'Connect')
      )}${renderTag(
        'p',
        {},
        'Keep the public portal and social placeholders easy to update from data files.'
      )}`
    )}${renderTag(
      'div',
      { class: 'portal-footer-panel__grid' },
      `${renderTag(
        'div',
        { class: 'portal-card' },
        `${renderTag('h3', { class: 'portal-card__title' }, 'Social Links')}${renderSocialLinks(
          ctx,
          Array.isArray(profile.social_links) ? profile.social_links : []
        )}`
      )}${renderTag(
        'div',
        { class: 'portal-card' },
        `${renderTag('h3', { class: 'portal-card__title' }, 'Contact')}${renderContactMeta(
          profile.contact || {}
        )}${renderTag(
          'p',
          { class: 'portal-copyright' },
          escapeHtml(
            sinceYear !== currentYear
              ? `© ${sinceYear} - ${currentYear} ${ownerName}`
              : `© ${currentYear} ${ownerName}`
          )
        )}`
      )}`
    )}`
  )

  return renderTag(
    'div',
    { class: 'portal-page portal-home' },
    `${hero}${shortcutSection}${recentPostsSection}${portfolioSectionHtml}${footerInfo}`
  )
}

const renderPortfolio = function () {
  const ctx = this
  const { portfolio } = getPortalData()
  const section = portfolio.section || {}
  const cards = Array.isArray(portfolio.cards) ? portfolio.cards : []

  const body = cards.length
    ? renderTag(
        'div',
        { class: 'portal-card-grid portal-card-grid--projects' },
        cards.map((card) => renderProjectCard(ctx, card, section.page_link_label)).join('')
      )
    : renderTag(
        'div',
        { class: 'portal-empty-state' },
        renderTag('p', {}, 'No portfolio cards configured yet.')
      )

  return renderTag(
    'div',
    { class: 'portal-page portal-portfolio' },
    renderTag(
      'section',
      { class: 'portal-section' },
      `${renderTag(
        'div',
        { class: 'portal-section-heading' },
        `${renderTag('h1', {}, escapeHtml(section.title || 'Portfolio'))}${
          section.intro ? renderTag('p', {}, escapeHtml(section.intro)) : ''
        }`
      )}${body}`
    )
  )
}

const renderAbout = function () {
  const { profile } = getPortalData()
  const about = profile.about || {}
  const skills = Array.isArray(about.skills) ? about.skills : []
  const experience = Array.isArray(about.experience) ? about.experience : []

  const experienceBody = experience.length
    ? renderTag(
        'div',
        { class: 'portal-stack' },
        experience
          .map((item) =>
            renderTag(
              'article',
              { class: 'portal-card' },
              `${renderTag(
                'div',
                { class: 'portal-inline-meta' },
                `${renderTag('h3', { class: 'portal-card__title' }, escapeHtml(item.title || 'Untitled Role'))}${
                  item.period ? renderTag('span', { class: 'portal-badge' }, escapeHtml(item.period)) : ''
                }`
              )}${
                item.description
                  ? renderTag('p', { class: 'portal-card__copy' }, escapeHtml(item.description))
                  : ''
              }`
            )
          )
          .join('')
      )
    : renderTag(
        'div',
        { class: 'portal-empty-state' },
        renderTag('p', {}, 'No experience entries configured yet.')
      )

  return renderTag(
    'div',
    { class: 'portal-page portal-about' },
    `${renderTag(
      'section',
      { class: 'portal-section' },
      `${renderTag(
        'div',
        { class: 'portal-section-heading' },
        `${renderTag(
          'h1',
          {},
          escapeHtml(about.intro_title || 'About Me')
        )}${
          about.intro_summary ? renderTag('p', {}, escapeHtml(about.intro_summary)) : ''
        }`
      )}${renderTag(
        'div',
        { class: 'portal-card portal-copy-card' },
        profile.intro && profile.intro.long
          ? renderTag('div', { class: 'portal-copy' }, renderParagraphs(profile.intro.long))
          : renderTag('p', { class: 'portal-card__copy' }, 'No profile introduction configured yet.')
      )}`
    )}${renderTag(
      'section',
      { class: 'portal-section' },
      `${renderTag(
        'div',
        { class: 'portal-section-heading' },
        `${renderTag(
          'h2',
          {},
          escapeHtml(about.skills_title || 'Skills')
        )}${renderTag(
          'p',
          {},
          'Placeholder structure prepared for future refinement through data editing.'
        )}`
      )}${skills.length ? renderChips(skills) : renderTag(
        'div',
        { class: 'portal-empty-state' },
        renderTag('p', {}, 'No skills configured yet.')
      )}`
    )}${renderTag(
      'section',
      { class: 'portal-section' },
      `${renderTag(
        'div',
        { class: 'portal-section-heading' },
        `${renderTag(
          'h2',
          {},
          escapeHtml(about.experience_title || 'Experience')
        )}${renderTag(
          'p',
          {},
          'Placeholder experience timeline seeded from site_profile.yml.'
        )}`
      )}${experienceBody}`
    )}`
  )
}

const renderStudyRoom = function () {
  const ctx = this
  const { profile } = getPortalData()
  const studyRoom = profile.study_room || {}
  const featureList = Array.isArray(studyRoom.features) ? studyRoom.features : []

  const features = featureList.length
    ? renderTag(
        'div',
        { class: 'portal-chip-grid' },
        featureList.map((item) => renderTag('span', { class: 'portal-chip' }, escapeHtml(item))).join('')
      )
    : renderTag(
        'div',
        { class: 'portal-empty-state' },
        renderTag('p', {}, 'No Study Room features configured yet.')
      )

  return renderTag(
    'div',
    { class: 'portal-page portal-study-room' },
    `${renderTag(
      'section',
      { class: 'portal-section portal-study-room-panel' },
      `${renderTag(
        'div',
        { class: 'portal-section-heading' },
        `${renderTag(
          'h1',
          {},
          escapeHtml(studyRoom.title || 'Study Room')
        )}${
          studyRoom.summary ? renderTag('p', {}, escapeHtml(studyRoom.summary)) : ''
        }`
      )}${
        studyRoom.description
          ? renderTag(
              'div',
              { class: 'portal-card portal-copy-card' },
              renderTag('p', { class: 'portal-lead' }, escapeHtml(studyRoom.description))
            )
          : ''
      }${renderTag(
        'div',
        { class: 'portal-card portal-cta-card' },
        `${renderTag(
          'a',
          {
            class: 'portal-button portal-button--primary',
            href: resolveHref(ctx, studyRoom.cta_path || '/study/', false),
          },
          escapeHtml(studyRoom.cta_label || 'Enter Study Room')
        )}${
          studyRoom.cta_note
            ? renderTag('p', { class: 'portal-card__copy' }, escapeHtml(studyRoom.cta_note))
            : ''
        }`
      )}`
    )}${renderTag(
      'section',
      { class: 'portal-section' },
      `${renderTag(
        'div',
        { class: 'portal-section-heading' },
        `${renderTag('h2', {}, 'Planned Features')}${renderTag(
          'p',
          {},
          'The dedicated application will expand beyond the portal when the separate Study Room app is integrated.'
        )}`
      )}${features}`
    )}`
  )
}

hexo.extend.tag.register('portal_home', renderHome)
hexo.extend.tag.register('portal_portfolio', renderPortfolio)
hexo.extend.tag.register('portal_about', renderAbout)
hexo.extend.tag.register('portal_study_room', renderStudyRoom)
