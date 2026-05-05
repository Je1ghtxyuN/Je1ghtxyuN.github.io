const path = require('path')
const siteIdentity = require('../../../packages/shared-config/site-identity.json')

const defaultLocale = siteIdentity.i18n?.defaultLocale || 'en'
const supportedLocales = Array.isArray(siteIdentity.i18n?.supportedLocales)
  ? siteIdentity.i18n.supportedLocales
  : []
const localeBasePath = '/shared-assets/locales/site-ui'
const studyRoomLandingPath =
  siteIdentity.routes?.studyRoomLandingPath || '/study-room/'
const studyRoomAppPath = siteIdentity.routes?.studyRoomAppPath || '/study-app/'
const defaultLocaleBundle = require(path.join(
  __dirname,
  `../../../packages/shared-assets/locales/site-ui/${defaultLocale}.json`,
))

function getNestedValue(target, keyPath) {
  if (!target || !keyPath) return undefined

  return String(keyPath)
    .split('.')
    .reduce((value, key) => (value && value[key] !== undefined ? value[key] : undefined), target)
}

function getDefaultLocaleText(keyPath, fallback = '') {
  const value = getNestedValue(defaultLocaleBundle, keyPath)
  return typeof value === 'string' ? value : fallback
}

function resolveStudyRoomPublicUrl() {
  return studyRoomAppPath
}

module.exports = {
  siteIdentity,
  defaultLocale,
  supportedLocales,
  localeBasePath,
  studyRoomLandingPath,
  studyRoomAppPath,
  defaultLocaleBundle,
  getNestedValue,
  getDefaultLocaleText,
  resolveStudyRoomPublicUrl,
}
