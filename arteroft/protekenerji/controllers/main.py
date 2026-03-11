# -*- coding: utf-8 -*-
# Part of Protek Enerji. See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request, route
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.addons.website_sale.controllers.cart import Cart
from odoo.addons.website_sale.const import SHOP_PATH


class ProtekEnerjiWebsiteSale(WebsiteSale):
    """
    Override Website Sale controller to enforce login requirement
    and restrict access to shopping functionality only.
    """

    @route(
        [
            SHOP_PATH,
            f'{SHOP_PATH}/page/<int:page>',
            f'{SHOP_PATH}/category/<model("product.public.category"):category>',
            f'{SHOP_PATH}/category/<model("product.public.category"):category>/page/<int:page>',
        ],
        type='http',
        auth="public",
        website=True
    )
    def shop(self, page=0, category=None, search='', min_price=0.0, max_price=0.0, tags='', **post):
        """Override shop to require login"""
        if request.env.user._is_public():
            return request.render('protekenerji.protek_shop_login_required')
        return super().shop(
            page=page, category=category, search=search,
            min_price=min_price, max_price=max_price, tags=tags, **post
        )

    @route(
        [
            f'{SHOP_PATH}/<model("product.template"):product>',
            f'{SHOP_PATH}/<model("product.public.category"):category>/<model("product.template"):product>',
        ],
        type='http',
        auth="public",
        website=True
    )
    def product(self, product, category=None, pricelist=None, **kwargs):
        """Override product page to require login"""
        if request.env.user._is_public():
            return request.render('protekenerji.protek_shop_login_required')
        return super().product(product=product, category=category, pricelist=pricelist, **kwargs)


class ProtekEnerjiCart(Cart):
    """
    Override Cart controller to enforce login requirement.
    """

    @route(route='/shop/cart', type='http', auth='public', website=True, sitemap=False)
    def cart(self, id=None, access_token=None, revive_method='', **post):
        """Override cart to require login"""
        if request.env.user._is_public():
            return request.render('protekenerji.protek_shop_login_required')
        return super().cart(id=id, access_token=access_token, revive_method=revive_method, **post)


class ProtekEnerjiHome(http.Controller):
    """Controller for Protek Enerji custom pages"""

    @route(['/protek', '/protek/home'], type='http', auth='public', website=True)
    def protek_home(self, **kw):
        """Protek Enerji Home Page - accessible to public"""
        return request.render('protekenerji.protek_home_page', {
            'page_name': 'protek_home',
        })

    @route(['/protek/about'], type='http', auth='public', website=True)
    def protek_about(self, **kw):
        """About Protek Enerji Page"""
        return request.render('protekenerji.protek_about_page', {
            'page_name': 'protek_about',
        })

    @route(['/protek/gdpr'], type='http', auth='public', website=True)
    def protek_gdpr(self, **kw):
        """GDPR Privacy Policy Page"""
        return request.render('protekenerji.protek_gdpr_page', {
            'page_name': 'protek_gdpr',
        })

    @route(['/protek/contact'], type='http', auth='public', website=True)
    def protek_contact(self, **kw):
        """Contact Page"""
        return request.render('protekenerji.protek_contact_page', {
            'page_name': 'protek_contact',
        })

    @route(['/contactus'], type='http', auth='public', website=True)
    def contactus(self, **kw):
        """Override default Contact Us page with Protek Enerji contact info"""
        return request.render('protekenerji.protek_contact_page', {
            'page_name': 'contactus',
        })

