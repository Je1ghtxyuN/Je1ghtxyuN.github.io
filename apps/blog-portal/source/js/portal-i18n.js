(function portalI18nBootstrap() {
  const configNode = document.getElementById('portal-i18n-config')

  if (!configNode) return

  let config = {}

  try {
    config = JSON.parse(configNode.textContent || '{}')
  } catch {
    return
  }

  const defaultLocale = config.defaultLocale || 'en'
  const localeBasePath = config.localeBasePath || '/shared-assets/locales/site-ui'
  const storageKey = config.storageKey || 'site-locale'
  const supportedLocales = Array.isArray(config.supportedLocales)
    ? config.supportedLocales
    : []
  const navMap = config.navMap || {}
  const localeCache = new Map()
  let activeLocale = defaultLocale
  let activeBundle = null
  let activeFallbackBundle = null
  let searchObserver = null

  function getNestedValue(target, keyPath) {
    if (!target || !keyPath) return undefined

    return String(keyPath)
      .split('.')
      .reduce(
        (value, key) =>
          value && value[key] !== undefined ? value[key] : undefined,
        target,
      )
  }

  function formatText(value, params) {
    if (typeof value !== 'string') return ''

    return value.replace(/\{(\w+)\}/g, (_, key) =>
      params && params[key] !== undefined ? params[key] : '',
    )
  }

  function normalizeLocale(locale) {
    const supportedCodes = supportedLocales.map((item) => item.code)

    if (supportedCodes.includes(locale)) return locale

    if (!locale) return defaultLocale

    const loweredLocale = String(locale).toLowerCase()

    if (loweredLocale.startsWith('ja')) return 'ja'
    if (loweredLocale === 'zh-tw' || loweredLocale === 'zh-hk') return 'zh-TW'
    if (loweredLocale.startsWith('zh')) return 'zh-CN'

    return defaultLocale
  }

  function readStoredLocale() {
    try {
      return window.localStorage.getItem(storageKey)
    } catch {
      return null
    }
  }

  function writeStoredLocale(locale) {
    try {
      window.localStorage.setItem(storageKey, locale)
    } catch {
      // Ignore persistence errors so locale switching still works for the session.
    }
  }

  function resolveInitialLocale() {
    return normalizeLocale(readStoredLocale() || defaultLocale)
  }

  async function loadLocaleBundle(locale) {
    if (localeCache.has(locale)) {
      return localeCache.get(locale)
    }

    try {
      const response = await fetch(
        `${localeBasePath}/${encodeURIComponent(locale)}.json`,
        {
          credentials: 'same-origin',
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to load locale bundle: ${locale}`)
      }

      const bundle = await response.json()
      localeCache.set(locale, bundle)
      return bundle
    } catch {
      const fallbackBundle = localeCache.get(defaultLocale) || {}
      localeCache.set(locale, fallbackBundle)
      return fallbackBundle
    }
  }

  function translate(bundle, fallbackBundle, key, fallback = '', params) {
    const value =
      getNestedValue(bundle, key) ??
      getNestedValue(fallbackBundle, key) ??
      fallback

    return formatText(value, params)
  }

  function setTextContent(target, value) {
    if (!target || typeof value !== 'string') return
    target.textContent = value
  }

  function applyDataTranslations(bundle, fallbackBundle) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n')
      const fallback = element.getAttribute('data-i18n-fallback') || element.textContent || ''
      setTextContent(element, translate(bundle, fallbackBundle, key, fallback))
    })

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.getAttribute('data-i18n-placeholder')
      const fallback = element.getAttribute('placeholder') || ''
      element.setAttribute(
        'placeholder',
        translate(bundle, fallbackBundle, key, fallback),
      )
    })

    document.querySelectorAll('[data-i18n-value]').forEach((element) => {
      const key = element.getAttribute('data-i18n-value')
      const fallback = element.getAttribute('value') || ''
      element.setAttribute(
        'value',
        translate(bundle, fallbackBundle, key, fallback),
      )
    })

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const key = element.getAttribute('data-i18n-aria-label')
      const fallback = element.getAttribute('aria-label') || ''
      element.setAttribute(
        'aria-label',
        translate(bundle, fallbackBundle, key, fallback),
      )
    })
  }

  function applyNavigationTranslations(bundle, fallbackBundle) {
    Object.entries(navMap).forEach(([href, key]) => {
      document
        .querySelectorAll(`a[href="${href}"]`)
        .forEach((anchor) => setTextContent(anchor, translate(bundle, fallbackBundle, key, anchor.textContent || '')))
    })
  }

  function applySearchPlaceholder(bundle, fallbackBundle) {
    const placeholder = translate(
      bundle,
      fallbackBundle,
      'portal.searchPlaceholder',
      '',
    )

    if (!placeholder) return

    document
      .querySelectorAll(
        '#local-search input, .local-search-input input, .search-dialog-input, .local-search-box--input',
      )
      .forEach((input) => {
        input.setAttribute('placeholder', placeholder)
        input.setAttribute('data-i18n-placeholder', 'portal.searchPlaceholder')
      })
  }

  function applyCurrentLocaleToDynamicUi() {
    if (!activeBundle || !activeFallbackBundle) return
    applySearchPlaceholder(activeBundle, activeFallbackBundle)
  }

  function ensureSearchObserver() {
    if (searchObserver || !window.MutationObserver) return

    searchObserver = new MutationObserver(() => {
      applyCurrentLocaleToDynamicUi()
    })

    searchObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  function ensureLocaleSwitcher() {
    let switcher = document.querySelector('.portal-locale-switcher')

    if (switcher) return switcher

    switcher = document.createElement('div')
    switcher.className = 'portal-locale-switcher'
    switcher.innerHTML =
      '<label class="portal-locale-switcher__label" for="portal-locale-select"></label>' +
      '<select id="portal-locale-select" class="portal-locale-switcher__select"></select>'

    const select = switcher.querySelector('select')

    supportedLocales.forEach((locale) => {
      const option = document.createElement('option')
      option.value = locale.code
      option.textContent = locale.label
      select.appendChild(option)
    })

    document.body.appendChild(switcher)
    return switcher
  }

  async function applyLocale(locale) {
    const normalizedLocale = normalizeLocale(locale)
    const [fallbackLocaleBundle, nextLocaleBundle] = await Promise.all([
      loadLocaleBundle(defaultLocale),
      loadLocaleBundle(normalizedLocale),
    ])

    activeLocale = normalizedLocale
    activeFallbackBundle = fallbackLocaleBundle
    activeBundle = nextLocaleBundle
    writeStoredLocale(normalizedLocale)
    document.documentElement.lang = normalizedLocale

    applyDataTranslations(nextLocaleBundle, fallbackLocaleBundle)
    applyNavigationTranslations(nextLocaleBundle, fallbackLocaleBundle)
    applySearchPlaceholder(nextLocaleBundle, fallbackLocaleBundle)

    const switcher = ensureLocaleSwitcher()
    const label = switcher.querySelector('.portal-locale-switcher__label')
    const select = switcher.querySelector('.portal-locale-switcher__select')

    label.textContent = translate(
      nextLocaleBundle,
      fallbackLocaleBundle,
      'portal.languageSelectorLabel',
      'Language',
    )
    select.value = normalizedLocale
  }

  const switcher = ensureLocaleSwitcher()
  const select = switcher.querySelector('.portal-locale-switcher__select')

  select.addEventListener('change', (event) => {
    void applyLocale(event.target.value)
  })

  document.addEventListener('pjax:complete', () => {
    void applyLocale(activeLocale)
  })

  ensureSearchObserver()
  void applyLocale(resolveInitialLocale())
})();

(function siteRunningTime() {
  const el = document.getElementById('site-running-time')
  if (!el) return

  const started = el.getAttribute('data-site-started')
  if (!started) return

  const startDate = new Date(started)
  if (isNaN(startDate.getTime())) return

  function formatDuration(diff) {
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const years = Math.floor(days / 365)
    const remainingDays = days - years * 365

    const parts = []
    if (years > 0) parts.push(years + 'y')
    if (remainingDays > 0 || years > 0) parts.push(remainingDays + 'd')
    parts.push(String(hours % 24).padStart(2, '0') + 'h')
    parts.push(String(minutes % 60).padStart(2, '0') + 'm')
    parts.push(String(seconds % 60).padStart(2, '0') + 's')
    return parts.join(' ')
  }

  function update() {
    const now = new Date()
    const diff = now - startDate
    el.textContent = ' · Running for ' + formatDuration(diff)
  }

  update()
  setInterval(update, 1000)
})()
