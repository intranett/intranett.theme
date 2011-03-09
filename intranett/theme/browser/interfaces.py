from plone.theme.interfaces import IDefaultPloneLayer
from zope.viewlet.interfaces import IViewletManager


class IThemeSpecific(IDefaultPloneLayer):
    """Marker interface that defines a Zope browser layer.
    """


class IAboveColumns(IViewletManager):
    """A viewlet manager that sits above the columns
    """


class IAboveContent(IViewletManager):
    """A viewlet manager that sits between content and portal header
    """


class ITopBar(IViewletManager):
    """A viewlet manager that sits on top of everything
       else in the site and is rendered as the bar across the
       screen at the top
    """
