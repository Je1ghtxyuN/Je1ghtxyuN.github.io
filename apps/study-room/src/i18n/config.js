import siteIdentity from '../../../../packages/shared-config/site-identity.json'
import enLocale from '../../../../packages/shared-assets/locales/site-ui/en.json'
import jaLocale from '../../../../packages/shared-assets/locales/site-ui/ja.json'
import zhCnLocale from '../../../../packages/shared-assets/locales/site-ui/zh-CN.json'
import zhTwLocale from '../../../../packages/shared-assets/locales/site-ui/zh-TW.json'

export const SITE_LOCALE_STORAGE_KEY = 'site-locale'

export const DEFAULT_LOCALE = siteIdentity.i18n?.defaultLocale || 'en'

export const SUPPORTED_LOCALES = Array.isArray(siteIdentity.i18n?.supportedLocales)
  ? siteIdentity.i18n.supportedLocales
  : []

export const SUPPORTED_LOCALE_CODES = SUPPORTED_LOCALES.map((item) => item.code)

export const SHARED_SITE_IDENTITY = siteIdentity

const LOCALE_BUNDLES = Object.freeze({
  en: enLocale,
  ja: jaLocale,
  'zh-CN': zhCnLocale,
  'zh-TW': zhTwLocale,
})

export function getLocaleBundle(locale = DEFAULT_LOCALE) {
  return LOCALE_BUNDLES[locale] || LOCALE_BUNDLES[DEFAULT_LOCALE]
}

export function normalizeLocale(locale) {
  if (SUPPORTED_LOCALE_CODES.includes(locale)) return locale
  if (!locale) return DEFAULT_LOCALE

  const loweredLocale = String(locale).toLowerCase()

  if (loweredLocale.startsWith('ja')) return 'ja'
  if (loweredLocale === 'zh-tw' || loweredLocale === 'zh-hk') return 'zh-TW'
  if (loweredLocale.startsWith('zh')) return 'zh-CN'

  return DEFAULT_LOCALE
}

function getNestedValue(target, keyPath) {
  if (!target || !keyPath) return undefined

  return String(keyPath)
    .split('.')
    .reduce((value, key) => (value && value[key] !== undefined ? value[key] : undefined), target)
}

function interpolateText(value, params) {
  if (typeof value !== 'string') return ''

  return value.replace(/\{(\w+)\}/g, (_, key) =>
    params && params[key] !== undefined ? String(params[key]) : '',
  )
}

export function translateLocale(locale, keyPath, params = {}, fallback = '') {
  const activeBundle = getLocaleBundle(locale)
  const fallbackBundle = getLocaleBundle(DEFAULT_LOCALE)
  const value =
    getNestedValue(activeBundle, keyPath) ??
    getNestedValue(fallbackBundle, keyPath) ??
    fallback

  return interpolateText(value, params)
}
