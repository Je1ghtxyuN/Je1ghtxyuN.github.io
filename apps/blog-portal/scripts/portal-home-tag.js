const createPortalRenderer = require('./portal-renderer')
const renderer = createPortalRenderer(hexo)
hexo.extend.tag.register('portal_home', function(args, content) {
  return renderer.renderHome({ siteLocals: hexo.locals })
}, { ends: false, async: false })
