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

  function resolveInitialLocale() {
    const queryLocale = new URLSearchParams(window.location.search).get('lang')

    if (queryLocale) return normalizeLocale(queryLocale)

    const storedLocale = window.localStorage.getItem(storageKey)

    if (storedLocale) return normalizeLocale(storedLocale)

    return normalizeLocale(window.navigator.language)
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
        '#local-search input, .search-dialog-input, .local-search-box--input',
      )
      .forEach((input) => {
        input.setAttribute('placeholder', placeholder)
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
    const [fallbackBundle, activeBundle] = await Promise.all([
      loadLocaleBundle(defaultLocale),
      loadLocaleBundle(normalizedLocale),
    ])

    window.localStorage.setItem(storageKey, normalizedLocale)
    document.documentElement.lang = normalizedLocale

    applyDataTranslations(activeBundle, fallbackBundle)
    applyNavigationTranslations(activeBundle, fallbackBundle)
    applySearchPlaceholder(activeBundle, fallbackBundle)

    const switcher = ensureLocaleSwitcher()
    const label = switcher.querySelector('.portal-locale-switcher__label')
    const select = switcher.querySelector('.portal-locale-switcher__select')

    label.textContent = translate(
      activeBundle,
      fallbackBundle,
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

  void applyLocale(resolveInitialLocale())
})()
