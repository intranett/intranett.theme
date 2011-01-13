from Products.CMFCore.utils import getToolByName

from intranett.policy.tests.base import IntranettTestCase


class TestTheme(IntranettTestCase):

    def test_theme(self):
        portal = self.layer['portal']
        skins = getToolByName(portal, 'portal_skins')
        self.assertEquals(skins.getDefaultSkin(), 'Intranett.no base theme')

    def test_icon_visibility(self):
        portal = self.layer['portal']
        pp = getToolByName(portal, 'portal_properties')
        sp = pp.site_properties
        self.assertEquals(sp.getProperty('icon_visibility'), 'disabled')

    def test_home_action_invisible(self):
        portal = self.layer['portal']
        at = getToolByName(portal, 'portal_actions')
        tabs = at.portal_tabs
        id_ = 'index_html'
        self.assertEquals(tabs[id_].visible, False)

    def test_reset_css_first(self):
        portal = self.layer['portal']
        css = getToolByName(portal, 'portal_css')
        self.assertEquals(css.getResources()[0].getId(), 'reset.css')

    def test_css_enabled(self):
        portal = self.layer['portal']
        css = getToolByName(portal, 'portal_css')
        ids = css.getResourcesDict().keys()
        self.assert_('main.css' in ids)
        self.assert_('decogrids-16.css' in ids)

    def test_css_disabled(self):
        portal = self.layer['portal']
        css = getToolByName(portal, 'portal_css')
        self.assertEquals(css.getResource('base.css').getEnabled(), False)
        self.assertEquals(css.getResource('portlets.css').getEnabled(), False)

    def test_js_enabled(self):
        portal = self.layer['portal']
        js = getToolByName(portal, 'portal_javascripts')
        ids = js.getResourcesDict().keys()
        self.assert_('modernizr.js' in ids)
        self.assert_('jquery.easing.js' in ids)
        self.assert_('jquery.jBreadCrumb.js' in ids)
        self.assert_('selectivizr.js' in ids)
        self.assert_('main.js' in ids)

    def test_selectivizr_js(self):
        portal = self.layer['portal']
        js = getToolByName(portal, 'portal_javascripts')
        ids = js.getResourcesDict().keys()
        self.assert_('selectivizr.js' in ids)
        selectivizr = js.getResource('selectivizr.js')
        self.assertEquals(selectivizr.getConditionalcomment(), 'lt IE 9')

        # We need to split the JS files before tiny_mce.js, as it doesn't work
        # if merged together with the rest. We use selectivizr.js here, as it
        # has a conditional comment, which causes the splitting for us
        positions = {}
        for pos, r in enumerate(js.getResources()):
            positions[r.getId()] = pos

        self.assert_(positions['selectivizr.js'] < positions['tiny_mce.js'])

    def test_media_for_maincss(self):
        portal = self.layer['portal']
        css = getToolByName(portal, 'portal_css')
        main = css.getResource('main.css')
        self.assertEquals(main.getMedia(), None)
