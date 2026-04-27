const createPortalRenderer = require('./portal-renderer')

const portalRenderer = createPortalRenderer(hexo)

hexo.extend.tag.register('portal_portfolio', () => portalRenderer.renderPortfolio())
hexo.extend.tag.register('portal_about', () => portalRenderer.renderAbout())
hexo.extend.tag.register('portal_study_room', () => portalRenderer.renderStudyRoom())

module.exports = portalRenderer
