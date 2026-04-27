const createPortalRenderer = require('./portal-renderer')

const portalRenderer = createPortalRenderer(hexo)

hexo.extend.generator.register('portal_home_page', function portalHomePage(locals) {
  // The root homepage must be generated after Hexo has loaded the full post set.
  // Rendering it as a normal source page can expose an incomplete recent-post list.
  return {
    path: 'index.html',
    layout: ['page', 'post', 'index'],
    data: {
      title: 'Home',
      type: 'portal-home',
      top_img: false,
      aside: false,
      comments: false,
      description: 'First branded Butterfly portal foundation for the long-term personal website rebuild.',
      content: portalRenderer.renderHome({ siteLocals: locals }),
    },
  }
})
