/**
 * Protek Enerji - Custom JavaScript for Odoo 19
 * Uses the Interaction pattern (Odoo 19 style)
 */

import { Interaction } from '@web/public/interaction';
import { registry } from '@web/core/registry';

/**
 * Protek Product Card — handles qty counter transform + admin icon
 */
export class ProtekProductCard extends Interaction {
    static selector = '.protek-product-card';

    dynamicContent = {
        '.protek-atc-btn': {
            't-on-click': this.onAddToCart,
        },
        '.protek-qty-plus': {
            't-on-click': this.onQtyPlus,
        },
        '.protek-qty-minus': {
            't-on-click': this.onQtyMinus,
        },
    };

    start() {
        // On page load, check if product is already in cart via localStorage
        const pidInput = this.el.querySelector('input[name="product_template_id"]');
        if (pidInput) {
            const pid = pidInput.value;
            const stored = localStorage.getItem('protek_incart_' + pid);
            if (stored) {
                this.showCounter(parseInt(stored) || 1);
            }
        }
    }

    showCounter(qty) {
        const btn = this.el.querySelector('.protek-atc-btn');
        const counter = this.el.querySelector('.protek-qty-counter');
        const display = this.el.querySelector('.protek-qty-display');
        const input = this.el.querySelector('.protek-qty-value');
        if (btn) btn.style.display = 'none';
        if (counter) counter.style.display = 'flex';
        if (display) display.textContent = qty;
        if (input) input.value = qty;
    }

    hideCounter() {
        const btn = this.el.querySelector('.protek-atc-btn');
        const counter = this.el.querySelector('.protek-qty-counter');
        if (btn) btn.style.display = '';
        if (counter) counter.style.display = 'none';
    }

    getProductId() {
        const input = this.el.querySelector('input[name="product_template_id"]');
        return input ? input.value : null;
    }

    onAddToCart() {
        const pid = this.getProductId();
        if (pid) {
            const cur = parseInt(localStorage.getItem('protek_incart_' + pid)) || 0;
            localStorage.setItem('protek_incart_' + pid, cur + 1);
        }
        // The a-submit class will trigger Odoo's form submission & page reload.
        // On reload, setup() will read localStorage and show the counter.
    }

    onQtyPlus() {
        const display = this.el.querySelector('.protek-qty-display');
        const input = this.el.querySelector('.protek-qty-value');
        const pid = this.getProductId();
        const val = parseInt(display ? display.textContent : '1') + 1;
        if (display) display.textContent = val;
        if (input) input.value = 1; // add 1 more to cart
        if (pid) localStorage.setItem('protek_incart_' + pid, val);
        // The a-submit on the + button will trigger Odoo's form submission
    }

    onQtyMinus() {
        const display = this.el.querySelector('.protek-qty-display');
        const input = this.el.querySelector('.protek-qty-value');
        const pid = this.getProductId();
        const val = parseInt(display ? display.textContent : '1') - 1;
        if (val <= 0) {
            this.hideCounter();
            if (pid) localStorage.removeItem('protek_incart_' + pid);
            return;
        }
        if (display) display.textContent = val;
        if (input) input.value = val;
        if (pid) localStorage.setItem('protek_incart_' + pid, val);
    }
}

registry.category('public.interactions').add('protekenerji.ProtekProductCard', ProtekProductCard);

/**
 * Protek Header — scroll effect
 */
export class ProtekHeader extends Interaction {
    static selector = 'header';

    start() {
        this.addListener(window, 'scroll', this.onScroll.bind(this));
    }

    onScroll() {
        if (window.pageYOffset > 100) {
            this.el.classList.add('protek-header-scrolled');
        } else {
            this.el.classList.remove('protek-header-scrolled');
        }
    }
}

registry.category('public.interactions').add('protekenerji.ProtekHeader', ProtekHeader);
