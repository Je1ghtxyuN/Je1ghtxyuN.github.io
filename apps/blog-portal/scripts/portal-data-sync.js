hexo.extend.filter.register('before_generate', () => {
  const data = hexo.locals.get('data') || {}
  const profile = data.site_profile || {}
  const navigation = data.navigation || {}
  const themeConfig = hexo.theme.config || {}

  if (profile.owner && profile.owner.display_name) {
    hexo.config.author = profile.owner.display_name
  }

  if (profile.subtitle) {
    hexo.config.subtitle = profile.subtitle
  }

  themeConfig.nav = themeConfig.nav || {}
  themeConfig.avatar = themeConfig.avatar || {}
  themeConfig.footer = themeConfig.footer || {}
  themeConfig.footer.owner = themeConfig.footer.owner || {}
  themeConfig.subtitle = themeConfig.subtitle || {}

  if (profile.icon_path) {
    themeConfig.favicon = profile.icon_path
    themeConfig.nav.logo = profile.icon_path
  }

  if (profile.avatar_path) {
    themeConfig.avatar.img = profile.avatar_path
  }

  if (profile.hero_background_path) {
    themeConfig.default_top_img = profile.hero_background_path
    themeConfig.index_img = profile.hero_background_path
    themeConfig.archive_img = profile.hero_background_path
    themeConfig.tag_img = profile.hero_background_path
    themeConfig.category_img = profile.hero_background_path
  }

  if (profile.subtitle) {
    themeConfig.subtitle.sub = [profile.subtitle]
  }

  if (profile.site_started_year) {
    themeConfig.footer.owner.since = profile.site_started_year
  }

  if (profile.footer_note) {
    themeConfig.footer.custom_text = profile.footer_note
  }

  if (Array.isArray(navigation.items) && navigation.items.length) {
    const syncedMenu = {}
    navigation.items.forEach((item) => {
      if (!item || !item.label || !item.path) return
      syncedMenu[item.label] = `${item.path} || ${item.icon || 'fas fa-link'}`
    })
    themeConfig.menu = syncedMenu
  }

  if (Array.isArray(profile.social_links) && profile.social_links.length) {
    const syncedSocial = {}
    profile.social_links.forEach((item) => {
      if (!item || !item.icon || !item.url || !item.label) return
      syncedSocial[item.icon] = `${item.url} || ${item.label} || '${item.color || '#4a7dbe'}'`
    })
    themeConfig.social = syncedSocial
  }

  hexo.theme.config = themeConfig
})
