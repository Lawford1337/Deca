/*!
 * Deca Framework JavaScript v1.0.0
 * Professional UI Framework for Modern Web Development
 * Copyright 2025 Deca Framework
 * Licensed under MIT
 * https://github.com/deca-framework/deca
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Deca = factory());
})(this, (function () {
    'use strict';

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    const Util = {
        // Get element by selector
        getElement(selector) {
            return typeof selector === 'string' ? document.querySelector(selector) : selector;
        },

        // Get all elements by selector
        getElements(selector) {
            return typeof selector === 'string' ? [...document.querySelectorAll(selector)] : [...selector];
        },

        // Add event listener with delegation support
        on(element, event, selector, handler) {
            if (typeof selector === 'function') {
                handler = selector;
                element.addEventListener(event, handler);
            } else {
                element.addEventListener(event, e => {
                    const target = e.target.closest(selector);
                    if (target) {
                        handler.call(target, e);
                    }
                });
            }
        },

        // Remove event listener
        off(element, event, handler) {
            element.removeEventListener(event, handler);
        },

        // Trigger custom event
        trigger(element, eventName, detail = {}) {
            const event = new CustomEvent(eventName, {
                bubbles: true,
                cancelable: true,
                detail
            });
            return element.dispatchEvent(event);
        },

        // Add class
        addClass(element, className) {
            if (!element) return;
            element.classList.add(...className.split(' '));
        },

        // Remove class
        removeClass(element, className) {
            if (!element) return;
            element.classList.remove(...className.split(' '));
        },

        // Toggle class
        toggleClass(element, className) {
            if (!element) return;
            element.classList.toggle(className);
        },

        // Check if element has class
        hasClass(element, className) {
            if (!element) return false;
            return element.classList.contains(className);
        },

        // Get data attribute
        getData(element, key) {
            if (!element) return null;
            return element.dataset[key];
        },

        // Set data attribute
        setData(element, key, value) {
            if (!element) return;
            element.dataset[key] = value;
        },

        // Slide down animation
        slideDown(element, duration = 300) {
            if (!element) return;
            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;
            if (display === 'none') display = 'block';
            element.style.display = display;
            
            const height = element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            element.offsetHeight;
            element.style.transition = `all ${duration}ms ease`;
            element.style.height = height + 'px';
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            
            setTimeout(() => {
                element.style.removeProperty('height');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition');
            }, duration);
        },

        // Slide up animation
        slideUp(element, duration = 300) {
            if (!element) return;
            element.style.transition = `all ${duration}ms ease`;
            element.style.height = element.offsetHeight + 'px';
            element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition');
            }, duration);
        },

        // Slide toggle
        slideToggle(element, duration = 300) {
            if (!element) return;
            if (window.getComputedStyle(element).display === 'none') {
                this.slideDown(element, duration);
            } else {
                this.slideUp(element, duration);
            }
        },

        // Fade in
        fadeIn(element, duration = 300) {
            if (!element) return;
            element.style.opacity = 0;
            element.style.display = 'block';
            element.style.transition = `opacity ${duration}ms ease`;
            
            setTimeout(() => {
                element.style.opacity = 1;
            }, 10);
            
            setTimeout(() => {
                element.style.removeProperty('transition');
            }, duration);
        },

        // Fade out
        fadeOut(element, duration = 300) {
            if (!element) return;
            element.style.opacity = 1;
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = 0;
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.removeProperty('opacity');
                element.style.removeProperty('transition');
            }, duration);
        },

        // Fade toggle
        fadeToggle(element, duration = 300) {
            if (!element) return;
            if (window.getComputedStyle(element).display === 'none') {
                this.fadeIn(element, duration);
            } else {
                this.fadeOut(element, duration);
            }
        },

        // Debounce function
        debounce(func, wait = 300) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function
        throttle(func, limit = 300) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Get element offset
        offset(element) {
            if (!element) return { top: 0, left: 0 };
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset
            };
        },

        // Check if element is visible
        isVisible(element) {
            if (!element) return false;
            return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        }
    };

    // ========================================
    // DROPDOWN COMPONENT
    // ========================================

    class Dropdown {
        constructor(element, options = {}) {
            this.dropdown = Util.getElement(element);
            this.toggle = this.dropdown.querySelector('[data-toggle="dropdown"]');
            this.menu = this.dropdown.querySelector('.dropdown-menu');
            this.isOpen = false;
            this.options = {
                closeOnClick: true,
                ...options
            };

            this.init();
        }

        init() {
            if (!this.toggle || !this.menu) return;

            Util.on(this.toggle, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });

            Util.on(document, 'click', (e) => {
                if (!this.dropdown.contains(e.target) && this.isOpen) {
                    this.close();
                }
            });

            if (this.options.closeOnClick) {
                const items = this.menu.querySelectorAll('.dropdown-item');
                items.forEach(item => {
                    Util.on(item, 'click', () => {
                        if (!Util.hasClass(item, 'disabled')) {
                            this.close();
                        }
                    });
                });
            }

            Util.on(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                    this.toggle.focus();
                }
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            if (this.isOpen) return;
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                Util.removeClass(menu, 'show');
            });

            Util.addClass(this.menu, 'show');
            this.isOpen = true;
            this.position();
            Util.trigger(this.dropdown, 'dropdown.show');
        }

        close() {
            if (!this.isOpen) return;
            
            Util.removeClass(this.menu, 'show');
            this.isOpen = false;
            Util.trigger(this.dropdown, 'dropdown.hide');
        }

        position() {
            const toggleRect = this.toggle.getBoundingClientRect();
            const menuRect = this.menu.getBoundingClientRect();
            const spaceBelow = window.innerHeight - toggleRect.bottom;
            const spaceAbove = toggleRect.top;

            if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
                this.menu.style.top = 'auto';
                this.menu.style.bottom = '100%';
            } else {
                this.menu.style.top = '100%';
                this.menu.style.bottom = 'auto';
            }
        }

        static init() {
            const dropdowns = Util.getElements('[data-toggle="dropdown"]');
            dropdowns.forEach(toggle => {
                const dropdown = toggle.closest('.dropdown');
                if (dropdown && !Util.getData(dropdown, 'dropdown')) {
                    new Dropdown(dropdown);
                    Util.setData(dropdown, 'dropdown', 'true');
                }
            });
        }
    }

    // ========================================
    // MODAL COMPONENT
    // ========================================

    class Modal {
        constructor(element, options = {}) {
            this.modal = Util.getElement(element);
            this.backdrop = null;
            this.isOpen = false;
            this.options = {
                backdrop: true,
                keyboard: true,
                focus: true,
                ...options
            };

            this.init();
        }

        init() {
            const triggers = Util.getElements(`[data-toggle="modal"][data-target="#${this.modal.id}"]`);
            triggers.forEach(trigger => {
                Util.on(trigger, 'click', (e) => {
                    e.preventDefault();
                    this.show();
                });
            });

            const closeButtons = this.modal.querySelectorAll('[data-dismiss="modal"]');
            closeButtons.forEach(btn => {
                Util.on(btn, 'click', () => this.hide());
            });

            if (this.options.keyboard) {
                Util.on(document, 'keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.hide();
                    }
                });
            }
        }

        show() {
            if (this.isOpen) return;

            const showEvent = Util.trigger(this.modal, 'modal.show');
            if (!showEvent) return;

            if (this.options.backdrop) {
                this.backdrop = document.createElement('div');
                this.backdrop.className = 'modal-backdrop';
                document.body.appendChild(this.backdrop);
                
                setTimeout(() => {
                    Util.addClass(this.backdrop, 'show');
                }, 10);

                if (this.options.backdrop !== 'static') {
                    Util.on(this.backdrop, 'click', () => this.hide());
                }
            }
            
            Util.addClass(this.modal, 'show');
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            if (this.options.focus) {
                const focusable = this.modal.querySelector('[autofocus]') || 
                                this.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable) {
                    setTimeout(() => focusable.focus(), 150);
                }
            }
            
            this.isOpen = true;
            
            setTimeout(() => {
                Util.trigger(this.modal, 'modal.shown');
            }, 150);
        }

        hide() {
            if (!this.isOpen) return;

            const hideEvent = Util.trigger(this.modal, 'modal.hide');
            if (!hideEvent) return;

            Util.removeClass(this.modal, 'show');
            
            setTimeout(() => {
                this.modal.style.display = 'none';
                if (this.backdrop) {
                    Util.removeClass(this.backdrop, 'show');
                    setTimeout(() => {
                        this.backdrop.remove();
                        this.backdrop = null;
                    }, 150);
                }
                document.body.style.overflow = '';
                this.isOpen = false;
                Util.trigger(this.modal, 'modal.hidden');
            }, 150);
        }

        toggle() {
            this.isOpen ? this.hide() : this.show();
        }

        static init() {
            const modals = Util.getElements('.modal');
            modals.forEach(modal => {
                if (!Util.getData(modal, 'modal')) {
                    new Modal(modal);
                    Util.setData(modal, 'modal', 'true');
                }
            });
        }
    }

    // ========================================
    // ACCORDION COMPONENT
    // ========================================

    class Accordion {
        constructor(element, options = {}) {
            this.accordion = Util.getElement(element);
            this.options = {
                multiple: Util.getData(this.accordion, 'multiple') === 'true',
                duration: 300,
                ...options
            };
            this.init();
        }

        init() {
            const buttons = this.accordion.querySelectorAll('.accordion-button');
            
            buttons.forEach((button, index) => {
                const item = button.closest('.accordion-item');
                const collapse = item.querySelector('.accordion-collapse');
                
                if (!Util.hasClass(button, 'collapsed')) {
                    collapse.style.display = 'block';
                } else {
                    collapse.style.display = 'none';
                }

                Util.on(button, 'click', () => {
                    const isCollapsed = Util.hasClass(button, 'collapsed');

                    if (!this.options.multiple) {
                        this.closeAll(item);
                    }

                    if (isCollapsed) {
                        this.open(item);
                    } else {
                        this.close(item);
                    }
                });
            });
        }

        open(item) {
            const button = item.querySelector('.accordion-button');
            const collapse = item.querySelector('.accordion-collapse');
            
            Util.removeClass(button, 'collapsed');
            Util.slideDown(collapse, this.options.duration);
            Util.trigger(item, 'accordion.show');
        }

        close(item) {
            const button = item.querySelector('.accordion-button');
            const collapse = item.querySelector('.accordion-collapse');
            
            Util.addClass(button, 'collapsed');
            Util.slideUp(collapse, this.options.duration);
            Util.trigger(item, 'accordion.hide');
        }

        closeAll(exceptItem = null) {
            const items = this.accordion.querySelectorAll('.accordion-item');
            items.forEach(item => {
                if (item !== exceptItem) {
                    this.close(item);
                }
            });
        }

        static init() {
            const accordions = Util.getElements('.accordion');
            accordions.forEach(accordion => {
                if (!Util.getData(accordion, 'accordion')) {
                    new Accordion(accordion);
                    Util.setData(accordion, 'accordion', 'true');
                }
            });
        }
    }

    // ========================================
    // TABS COMPONENT
    // ========================================

    class Tabs {
        constructor(element, options = {}) {
            this.tabList = Util.getElement(element);
            this.options = {
                animation: 'fade',
                duration: 300,
                ...options
            };
            this.init();
        }

        init() {
            const tabs = this.tabList.querySelectorAll('[data-toggle="tab"]');
            
            tabs.forEach(tab => {
                Util.on(tab, 'click', (e) => {
                    e.preventDefault();
                    const target = Util.getData(tab, 'target') || tab.getAttribute('href');
                    this.show(target, tab);
                });
                
                // Keyboard navigation
                Util.on(tab, 'keydown', (e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const currentIndex = Array.from(tabs).indexOf(tab);
                        const nextIndex = e.key === 'ArrowRight' 
                            ? (currentIndex + 1) % tabs.length 
                            : (currentIndex - 1 + tabs.length) % tabs.length;
                        tabs[nextIndex].click();
                        tabs[nextIndex].focus();
                    }
                });
            });
        }

        show(target, tab) {
            const pane = document.querySelector(target);
            if (!pane) return;

            const tabs = this.tabList.querySelectorAll('[data-toggle="tab"]');
            const container = pane.parentElement;
            const panes = container.querySelectorAll('.tab-pane');
            
            // Update tabs
            tabs.forEach(t => {
                Util.removeClass(t, 'active');
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1');
            });
            
            Util.addClass(tab, 'active');
            tab.setAttribute('aria-selected', 'true');
            tab.removeAttribute('tabindex');
            
            // Update panes
            panes.forEach(p => {
                Util.removeClass(p, 'active');
                if (this.options.animation === 'fade') {
                    Util.fadeOut(p, 0);
                } else {
                    p.style.display = 'none';
                }
            });
            
            Util.addClass(pane, 'active');
            if (this.options.animation === 'fade') {
                Util.fadeIn(pane, this.options.duration);
            } else {
                pane.style.display = 'block';
            }
            
            Util.trigger(pane, 'tab.show', { relatedTarget: tab });
        }

        static init() {
            const tabLists = Util.getElements('[role="tablist"], .nav-tabs');
            tabLists.forEach(tabList => {
                if (!Util.getData(tabList, 'tabs')) {
                    new Tabs(tabList);
                    Util.setData(tabList, 'tabs', 'true');
                }
            });
        }
    }

    // ========================================
    // ALERT COMPONENT
    // ========================================

    class Alert {
        constructor(element, options = {}) {
            this.alert = Util.getElement(element);
            this.options = {
                duration: 150,
                ...options
            };
            this.init();
        }

        init() {
            const closeButton = this.alert.querySelector('[data-dismiss="alert"]');
            if (closeButton) {
                Util.on(closeButton, 'click', () => this.close());
            }
        }

        close() {
            const closeEvent = Util.trigger(this.alert, 'alert.close');
            if (!closeEvent) return;

            Util.fadeOut(this.alert, this.options.duration);
            setTimeout(() => {
                this.alert.remove();
                Util.trigger(document, 'alert.closed');
            }, this.options.duration);
        }

        static init() {
            const alerts = Util.getElements('.alert-dismissible, .alert[data-dismissible]');
            alerts.forEach(alert => {
                if (!Util.getData(alert, 'alert')) {
                    new Alert(alert);
                    Util.setData(alert, 'alert', 'true');
                }
            });
        }

        static create(message, type = 'primary', dismissible = true) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}${dismissible ? ' alert-dismissible' : ''}`;
            alert.setAttribute('role', 'alert');
            
            alert.innerHTML = `
                ${message}
                ${dismissible ? '<button type="button" class="btn-close" data-dismiss="alert" aria-label="Close"></button>' : ''}
            `;
            
            return alert;
        }
    }

    // ========================================
    // TOAST/NOTIFICATION COMPONENT
    // ========================================

    class Toast {
        constructor(element, options = {}) {
            this.toast = Util.getElement(element);
            this.options = {
                autohide: Util.getData(this.toast, 'autohide') !== 'false',
                delay: parseInt(Util.getData(this.toast, 'delay')) || 5000,
                animation: true,
                ...options
            };
            this.init();
        }

        init() {
            const closeButton = this.toast.querySelector('[data-dismiss="toast"]');
            if (closeButton) {
                Util.on(closeButton, 'click', () => this.hide());
            }
        }

        show() {
            if (Util.isVisible(this.toast)) return;

            const showEvent = Util.trigger(this.toast, 'toast.show');
            if (!showEvent) return;

            this.toast.style.display = 'block';
            
            if (this.options.animation) {
                Util.fadeIn(this.toast);
            }

            Util.trigger(this.toast, 'toast.shown');

            if (this.options.autohide) {
                this.autoHideTimeout = setTimeout(() => this.hide(), this.options.delay);
            }
        }

        hide() {
            if (!Util.isVisible(this.toast)) return;

            const hideEvent = Util.trigger(this.toast, 'toast.hide');
            if (!hideEvent) return;

            if (this.autoHideTimeout) {
                clearTimeout(this.autoHideTimeout);
            }

            if (this.options.animation) {
                Util.fadeOut(this.toast);
            } else {
                this.toast.style.display = 'none';
            }

            setTimeout(() => {
                Util.trigger(this.toast, 'toast.hidden');
            }, 150);
        }

        static init() {
            const toasts = Util.getElements('.toast');
            toasts.forEach(toast => {
                if (!Util.getData(toast, 'toast')) {
                    new Toast(toast);
                    Util.setData(toast, 'toast', 'true');
                }
            });
        }

        static create(message, options = {}) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            toast.setAttribute('aria-atomic', 'true');
            
            const header = options.header ? `
                <div class="toast-header">
                    <strong class="mr-auto">${options.header}</strong>
                    ${options.time ? `<small>${options.time}</small>` : ''}
                    <button type="button" class="btn-close" data-dismiss="toast" aria-label="Close"></button>
                </div>
            ` : '';
            
            toast.innerHTML = `
                ${header}
                <div class="toast-body">${message}</div>
            `;
            
            return toast;
        }
    }

    // ========================================
    // TOOLTIP COMPONENT
    // ========================================

    class Tooltip {
        constructor(element, options = {}) {
            this.element = Util.getElement(element);
            this.options = {
                placement: Util.getData(this.element, 'placement') || 'top',
                trigger: Util.getData(this.element, 'trigger') || 'hover',
                delay: parseInt(Util.getData(this.element, 'delay')) || 0,
                html: Util.getData(this.element, 'html') === 'true',
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>',
                ...options
            };
            this.tooltip = null;
            this.timeout = null;
            this.init();
        }

        init() {
            const trigger = this.options.trigger;

            if (trigger.includes('hover')) {
                Util.on(this.element, 'mouseenter', () => this.show());
                Util.on(this.element, 'mouseleave', () => this.hide());
            }
            
            if (trigger.includes('click')) {
                Util.on(this.element, 'click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            }
            
            if (trigger.includes('focus')) {
                Util.on(this.element, 'focus', () => this.show());
                Util.on(this.element, 'blur', () => this.hide());
            }
        }

        show() {
            if (this.tooltip) return;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                const title = this.element.getAttribute('title') || 
                            this.element.getAttribute('data-title') || 
                            this.element.getAttribute('data-original-title');
                
                if (!title) return;

                // Save original title and remove it
                if (this.element.getAttribute('title')) {
                    this.element.setAttribute('data-original-title', title);
                    this.element.removeAttribute('title');
                }

                const showEvent = Util.trigger(this.element, 'tooltip.show');
                if (!showEvent) return;

                this.tooltip = this.createTooltip(title);
                document.body.appendChild(this.tooltip);

                this.position();
                
                setTimeout(() => {
                    Util.addClass(this.tooltip, 'show');
                    Util.trigger(this.element, 'tooltip.shown');
                }, 10);
            }, this.options.delay);
        }

        hide() {
            clearTimeout(this.timeout);
            
            if (!this.tooltip) return;

            const hideEvent = Util.trigger(this.element, 'tooltip.hide');
            if (!hideEvent) return;

            Util.removeClass(this.tooltip, 'show');
            
            setTimeout(() => {
                if (this.tooltip) {
                    this.tooltip.remove();
                    this.tooltip = null;
                    Util.trigger(this.element, 'tooltip.hidden');
                }
            }, 150);
        }

        toggle() {
            this.tooltip ? this.hide() : this.show();
        }

        createTooltip(title) {
            const tooltip = document.createElement('div');
            tooltip.innerHTML = this.options.template;
            const tooltipElement = tooltip.firstChild;
            const inner = tooltipElement.querySelector('.tooltip-inner');
            
            if (this.options.html) {
                inner.innerHTML = title;
            } else {
                inner.textContent = title;
            }
            
            return tooltipElement;
        }

        position() {
            if (!this.tooltip) return;

            const rect = this.element.getBoundingClientRect();
            const tooltipRect = this.tooltip.getBoundingClientRect();
            const offset = 10;
            
            let top, left;
            
            switch (this.options.placement) {
                case 'top':
                    top = rect.top - tooltipRect.height - offset;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    this.tooltip.classList.add('tooltip-top');
                    break;
                case 'bottom':
                    top = rect.bottom + offset;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    this.tooltip.classList.add('tooltip-bottom');
                    break;
                case 'left':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.left - tooltipRect.width - offset;
                    this.tooltip.classList.add('tooltip-left');
                    break;
                case 'right':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.right + offset;
                    this.tooltip.classList.add('tooltip-right');
                    break;
            }

            // Boundary detection
            if (left < 0) left = offset;
            if (left + tooltipRect.width > window.innerWidth) {
                left = window.innerWidth - tooltipRect.width - offset;
            }
            if (top < 0) top = offset;

            this.tooltip.style.top = top + window.pageYOffset + 'px';
            this.tooltip.style.left = left + window.pageXOffset + 'px';
        }

        dispose() {
            clearTimeout(this.timeout);
            this.hide();
            
            // Restore original title
            const originalTitle = this.element.getAttribute('data-original-title');
            if (originalTitle) {
                this.element.setAttribute('title', originalTitle);
                this.element.removeAttribute('data-original-title');
            }
        }

        static init() {
            const elements = Util.getElements('[data-toggle="tooltip"], [title]');
            elements.forEach(element => {
                if (!Util.getData(element, 'tooltip')) {
                    new Tooltip(element);
                    Util.setData(element, 'tooltip', 'true');
                }
            });
        }
    }

    // ========================================
    // POPOVER COMPONENT
    // ========================================

    class Popover {
        constructor(element, options = {}) {
            this.element = Util.getElement(element);
            this.options = {
                placement: Util.getData(this.element, 'placement') || 'top',
                trigger: Util.getData(this.element, 'trigger') || 'click',
                title: Util.getData(this.element, 'title') || '',
                content: Util.getData(this.element, 'content') || '',
                html: Util.getData(this.element, 'html') === 'true',
                template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                ...options
            };
            this.popover = null;
            this.init();
        }

        init() {
            const trigger = this.options.trigger;

            if (trigger === 'hover') {
                Util.on(this.element, 'mouseenter', () => this.show());
                Util.on(this.element, 'mouseleave', () => this.hide());
            } else if (trigger === 'click') {
                Util.on(this.element, 'click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            } else if (trigger === 'focus') {
                Util.on(this.element, 'focus', () => this.show());
                Util.on(this.element, 'blur', () => this.hide());
            }

            Util.on(document, 'click', (e) => {
                if (this.popover && !this.element.contains(e.target) && !this.popover.contains(e.target)) {
                    this.hide();
                }
            });
        }

        show() {
            if (this.popover) return;

            if (!this.options.content) return;

            this.popover = this.createPopover();
            document.body.appendChild(this.popover);
            this.position();

            setTimeout(() => {
                Util.addClass(this.popover, 'show');
                Util.trigger(this.element, 'popover.shown');
            }, 10);
        }

        hide() {
            if (!this.popover) return;

            Util.removeClass(this.popover, 'show');
            setTimeout(() => {
                if (this.popover) {
                    this.popover.remove();
                    this.popover = null;
                    Util.trigger(this.element, 'popover.hidden');
                }
            }, 150);
        }

        toggle() {
            this.popover ? this.hide() : this.show();
        }

        createPopover() {
            const popover = document.createElement('div');
            popover.innerHTML = this.options.template;
            const popoverElement = popover.firstChild;
            
            const header = popoverElement.querySelector('.popover-header');
            const body = popoverElement.querySelector('.popover-body');
            
            if (this.options.title) {
                if (this.options.html) {
                    header.innerHTML = this.options.title;
                } else {
                    header.textContent = this.options.title;
                }
            } else {
                header.remove();
            }
            
            if (this.options.html) {
                body.innerHTML = this.options.content;
            } else {
                body.textContent = this.options.content;
            }
            
            return popoverElement;
        }

        position() {
            if (!this.popover) return;

            const rect = this.element.getBoundingClientRect();
            const popoverRect = this.popover.getBoundingClientRect();
            const offset = 10;
            
            let top, left;
            
            switch (this.options.placement) {
                case 'top':
                    top = rect.top - popoverRect.height - offset;
                    left = rect.left + (rect.width - popoverRect.width) / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + offset;
                    left = rect.left + (rect.width - popoverRect.width) / 2;
                    break;
                case 'left':
                    top = rect.top + (rect.height - popoverRect.height) / 2;
                    left = rect.left - popoverRect.width - offset;
                    break;
                case 'right':
                    top = rect.top + (rect.height - popoverRect.height) / 2;
                    left = rect.right + offset;
                    break;
            }

            this.popover.style.top = top + window.pageYOffset + 'px';
            this.popover.style.left = left + window.pageXOffset + 'px';
        }

        static init() {
            const elements = Util.getElements('[data-toggle="popover"]');
            elements.forEach(element => {
                if (!Util.getData(element, 'popover')) {
                    new Popover(element);
                    Util.setData(element, 'popover', 'true');
                }
            });
        }
    }

    // ========================================
    // CAROUSEL/SLIDER COMPONENT
    // ========================================

    class Carousel {
        constructor(element, options = {}) {
            this.carousel = Util.getElement(element);
            this.items = this.carousel.querySelectorAll('.carousel-item');
            this.currentIndex = 0;
            this.options = {
                interval: parseInt(Util.getData(this.carousel, 'interval')) || 5000,
                autoplay: Util.getData(this.carousel, 'autoplay') !== 'false',
                wrap: Util.getData(this.carousel, 'wrap') !== 'false',
                keyboard: true,
                pause: 'hover',
                ...options
            };
            this.intervalId = null;
            this.isPaused = false;
            this.init();
        }

        init() {
            if (this.items.length === 0) return;

            // Set first item as active
            Util.addClass(this.items[0], 'active');

            // Previous/Next buttons
            const prevBtn = this.carousel.querySelector('[data-slide="prev"]');
            const nextBtn = this.carousel.querySelector('[data-slide="next"]');
            
            if (prevBtn) Util.on(prevBtn, 'click', () => this.prev());
            if (nextBtn) Util.on(nextBtn, 'click', () => this.next());

            // Indicators
            const indicators = this.carousel.querySelectorAll('[data-slide-to]');
            indicators.forEach((indicator, index) => {
                Util.on(indicator, 'click', () => this.goTo(index));
            });

            // Keyboard navigation
            if (this.options.keyboard) {
                Util.on(document, 'keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prev();
                    if (e.key === 'ArrowRight') this.next();
                });
            }

            // Pause on hover
            if (this.options.pause === 'hover') {
                Util.on(this.carousel, 'mouseenter', () => this.pause());
                Util.on(this.carousel, 'mouseleave', () => this.cycle());
            }

            // Autoplay
            if (this.options.autoplay) {
                this.cycle();
            }

            // Touch support
            this.addTouchSupport();
        }

        cycle() {
            if (this.isPaused) return;
            
            this.intervalId = setInterval(() => {
                this.next();
            }, this.options.interval);
        }

        pause() {
            this.isPaused = true;
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }

        next() {
            const nextIndex = this.options.wrap 
                ? (this.currentIndex + 1) % this.items.length
                : Math.min(this.currentIndex + 1, this.items.length - 1);
            this.goTo(nextIndex);
        }

        prev() {
            const prevIndex = this.options.wrap
                ? (this.currentIndex - 1 + this.items.length) % this.items.length
                : Math.max(this.currentIndex - 1, 0);
            this.goTo(prevIndex);
        }

        goTo(index) {
            if (index === this.currentIndex || index < 0 || index >= this.items.length) return;

            const direction = index > this.currentIndex ? 'next' : 'prev';
            const currentItem = this.items[this.currentIndex];
            const nextItem = this.items[index];

            Util.trigger(this.carousel, 'carousel.slide', { 
                direction, 
                relatedTarget: nextItem, 
                from: this.currentIndex, 
                to: index 
            });

            Util.removeClass(currentItem, 'active');
            Util.addClass(nextItem, 'active');

            // Update indicators
            const indicators = this.carousel.querySelectorAll('[data-slide-to]');
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    Util.addClass(indicator, 'active');
                } else {
                    Util.removeClass(indicator, 'active');
                }
            });

            this.currentIndex = index;

            Util.trigger(this.carousel, 'carousel.slid', { 
                direction, 
                relatedTarget: nextItem, 
                from: this.currentIndex, 
                to: index 
            });
        }

        addTouchSupport() {
            let touchStartX = 0;
            let touchEndX = 0;

            Util.on(this.carousel, 'touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            Util.on(this.carousel, 'touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });

            const handleSwipe = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
            };

            this.handleSwipe = handleSwipe;
        }

        static init() {
            const carousels = Util.getElements('.carousel');
            carousels.forEach(carousel => {
                if (!Util.getData(carousel, 'carousel')) {
                    new Carousel(carousel);
                    Util.setData(carousel, 'carousel', 'true');
                }
            });
        }
    }

    // ========================================
    // COLLAPSE COMPONENT
    // ========================================

    class Collapse {
        constructor(element, options = {}) {
            this.element = Util.getElement(element);
            this.options = {
                parent: Util.getData(this.element, 'parent'),
                toggle: true,
                ...options
            };
            this.isTransitioning = false;
            this.init();
        }

        init() {
            const triggers = Util.getElements(`[data-toggle="collapse"][data-target="#${this.element.id}"]`);
            
            triggers.forEach(trigger => {
                Util.on(trigger, 'click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            });

            if (this.options.toggle && !Util.hasClass(this.element, 'show')) {
                this.element.style.display = 'none';
            }
        }

        toggle() {
            if (this.isTransitioning) return;
            Util.hasClass(this.element, 'show') ? this.hide() : this.show();
        }

        show() {
            if (this.isTransitioning || Util.hasClass(this.element, 'show')) return;

            const showEvent = Util.trigger(this.element, 'collapse.show');
            if (!showEvent) return;

            // Close siblings if parent is specified
            if (this.options.parent) {
                const parent = document.querySelector(this.options.parent);
                if (parent) {
                    const siblings = parent.querySelectorAll('.collapse.show');
                    siblings.forEach(sibling => {
                        if (sibling !== this.element) {
                            const siblingCollapse = Util.getData(sibling, 'collapse-instance');
                            if (siblingCollapse) {
                                siblingCollapse.hide();
                            }
                        }
                    });
                }
            }

            this.isTransitioning = true;
            Util.addClass(this.element, 'collapsing');
            Util.removeClass(this.element, 'collapse');
            
            this.element.style.height = '0';
            this.element.style.display = 'block';
            
            const height = this.element.scrollHeight;
            
            setTimeout(() => {
                this.element.style.height = height + 'px';
            }, 10);

            setTimeout(() => {
                Util.removeClass(this.element, 'collapsing');
                Util.addClass(this.element, 'collapse show');
                this.element.style.height = '';
                this.isTransitioning = false;
                Util.trigger(this.element, 'collapse.shown');
            }, 350);
        }

        hide() {
            if (this.isTransitioning || !Util.hasClass(this.element, 'show')) return;

            const hideEvent = Util.trigger(this.element, 'collapse.hide');
            if (!hideEvent) return;

            this.isTransitioning = true;
            this.element.style.height = this.element.scrollHeight + 'px';
            
            setTimeout(() => {
                Util.addClass(this.element, 'collapsing');
                Util.removeClass(this.element, 'collapse show');
                this.element.style.height = '0';
            }, 10);

            setTimeout(() => {
                Util.removeClass(this.element, 'collapsing');
                Util.addClass(this.element, 'collapse');
                this.element.style.display = 'none';
                this.element.style.height = '';
                this.isTransitioning = false;
                Util.trigger(this.element, 'collapse.hidden');
            }, 350);
        }

        static init() {
            const collapses = Util.getElements('.collapse');
            collapses.forEach(collapse => {
                if (!Util.getData(collapse, 'collapse')) {
                    const instance = new Collapse(collapse);
                    Util.setData(collapse, 'collapse', 'true');
                    Util.setData(collapse, 'collapse-instance', instance);
                }
            });
        }
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================

    function initSmoothScroll() {
        const links = Util.getElements('a[href^="#"]:not([href="#"]):not([href="#!"])');
        
        links.forEach(link => {
            Util.on(link, 'click', function(e) {
                const href = this.getAttribute('href');
                if (!href || href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const offset = parseInt(Util.getData(link, 'offset')) || 80;
                const offsetTop = Util.offset(target).top - offset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update URL hash
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    location.hash = href;
                }
            });
        });
    }

    // ========================================
    // FORM VALIDATION
    // ========================================

    function initFormValidation() {
        const forms = Util.getElements('.needs-validation');
        
        forms.forEach(form => {
            Util.on(form, 'submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                Util.addClass(form, 'was-validated');
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                Util.on(input, 'blur', function() {
                    if (Util.hasClass(form, 'was-validated')) {
                        if (this.checkValidity()) {
                            Util.addClass(this, 'is-valid');
                            Util.removeClass(this, 'is-invalid');
                        } else {
                            Util.addClass(this, 'is-invalid');
                            Util.removeClass(this, 'is-valid');
                        }
                    }
                });
            });
        });
    }

    // ========================================
    // SCROLL SPY
    // ========================================

    class ScrollSpy {
        constructor(options = {}) {
            this.options = {
                target: '[data-spy="scroll"]',
                offset: 10,
                ...options
            };
            this.sections = [];
            this.activeSection = null;
            this.init();
        }

        init() {
            const target = document.querySelector(this.options.target);
            if (!target) return;

            const links = target.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                const section = document.querySelector(href);
                if (section) {
                    this.sections.push({
                        link,
                        section,
                        id: href
                    });
                }
            });

            this.update = Util.throttle(() => this.onScroll(), 100);
            window.addEventListener('scroll', this.update);
            this.onScroll();
        }

        onScroll() {
            const scrollPos = window.pageYOffset + this.options.offset;
            
            let current = null;
            
            for (let i = this.sections.length - 1; i >= 0; i--) {
                const item = this.sections[i];
                const sectionTop = Util.offset(item.section).top;
                
                if (scrollPos >= sectionTop) {
                    current = item;
                    break;
                }
            }

            if (current && current.id !== this.activeSection) {
                this.activeSection = current.id;
                this.updateActive(current);
            }
        }

        updateActive(current) {
            this.sections.forEach(item => {
                Util.removeClass(item.link, 'active');
                const parent = item.link.closest('.nav-item');
                if (parent) {
                    Util.removeClass(parent, 'active');
                }
            });

            if (current) {
                Util.addClass(current.link, 'active');
                const parent = current.link.closest('.nav-item');
                if (parent) {
                    Util.addClass(parent, 'active');
                }
            }
        }

        static init() {
            if (document.querySelector('[data-spy="scroll"]')) {
                new ScrollSpy();
            }
        }
    }

    // ========================================
    // LAZY LOADING
    // ========================================

    class LazyLoad {
        constructor(options = {}) {
            this.options = {
                selector: '.lazy',
                root: null,
                rootMargin: '50px',
                threshold: 0.01,
                ...options
            };
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                }, {
                    root: this.options.root,
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                });

                this.observe();
            } else {
                // Fallback for older browsers
                this.loadAllImages();
            }
        }

        observe() {
            const images = document.querySelectorAll(this.options.selector);
            images.forEach(img => this.observer.observe(img));
        }

        loadImage(img) {
            const src = img.dataset.src;
            const srcset = img.dataset.srcset;
            
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
            
            if (srcset) {
                img.srcset = srcset;
                img.removeAttribute('data-srcset');
            }
            
            Util.removeClass(img, 'lazy');
            Util.trigger(img, 'lazy.loaded');
        }

        loadAllImages() {
            const images = document.querySelectorAll(this.options.selector);
            images.forEach(img => this.loadImage(img));
        }

        static init() {
            if (document.querySelector('.lazy')) {
                new LazyLoad();
            }
        }
    }

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================

    class BackToTop {
        constructor(options = {}) {
            this.options = {
                selector: '[data-back-to-top]',
                offset: 300,
                duration: 600,
                ...options
            };
            this.button = document.querySelector(this.options.selector);
            if (this.button) {
                this.init();
            }
        }

        init() {
            this.button.style.display = 'none';
            
            const handleScroll = Util.throttle(() => {
                if (window.pageYOffset > this.options.offset) {
                    Util.fadeIn(this.button, 200);
                } else {
                    Util.fadeOut(this.button, 200);
                }
            }, 100);

            window.addEventListener('scroll', handleScroll);

            Util.on(this.button, 'click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        static init() {
            if (document.querySelector('[data-back-to-top]')) {
                new BackToTop();
            }
        }
    }

    // ========================================
    // STICKY HEADER
    // ========================================

    class StickyHeader {
        constructor(options = {}) {
            this.options = {
                selector: '[data-sticky-header]',
                offset: 100,
                stickyClass: 'sticky-active',
                ...options
            };
            this.header = document.querySelector(this.options.selector);
            if (this.header) {
                this.init();
            }
        }

        init() {
            const handleScroll = Util.throttle(() => {
                if (window.pageYOffset > this.options.offset) {
                    Util.addClass(this.header, this.options.stickyClass);
                } else {
                    Util.removeClass(this.header, this.options.stickyClass);
                }
            }, 100);

            window.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        static init() {
            if (document.querySelector('[data-sticky-header]')) {
                new StickyHeader();
            }
        }
    }

    // ========================================
    // COUNTER/NUMBER ANIMATION
    // ========================================

    class CounterAnimation {
        constructor(element, options = {}) {
            this.element = Util.getElement(element);
            this.options = {
                start: parseInt(Util.getData(this.element, 'start')) || 0,
                end: parseInt(Util.getData(this.element, 'end')) || parseInt(this.element.textContent),
                duration: parseInt(Util.getData(this.element, 'duration')) || 2000,
                separator: Util.getData(this.element, 'separator') || ',',
                decimal: Util.getData(this.element, 'decimal') || '.',
                prefix: Util.getData(this.element, 'prefix') || '',
                suffix: Util.getData(this.element, 'suffix') || '',
                ...options
            };
            this.hasRun = false;
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.hasRun) {
                            this.animate();
                            this.hasRun = true;
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(this.element);
            } else {
                this.animate();
            }
        }

        animate() {
            const { start, end, duration, separator, prefix, suffix } = this.options;
            const range = end - start;
            const increment = end > start ? 1 : -1;
            const stepTime = Math.abs(Math.floor(duration / range));
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                this.element.textContent = prefix + this.formatNumber(current) + suffix;
                
                if (current === end) {
                    clearInterval(timer);
                    Util.trigger(this.element, 'counter.complete');
                }
            }, stepTime);
        }

        formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.options.separator);
        }

        static init() {
            const counters = Util.getElements('[data-counter]');
            counters.forEach(counter => {
                if (!Util.getData(counter, 'counter')) {
                    new CounterAnimation(counter);
                    Util.setData(counter, 'counter', 'true');
                }
            });
        }
    }

    // ========================================
    // INITIALIZE ALL COMPONENTS
    // ========================================

    function init() {
        // Initialize all components
        Dropdown.init();
        Modal.init();
        Accordion.init();
        Tabs.init();
        Alert.init();
        Toast.init();
        Tooltip.init();
        Popover.init();
        Carousel.init();
        Collapse.init();
        ScrollSpy.init();
        LazyLoad.init();
        BackToTop.init();
        StickyHeader.init();
        CounterAnimation.init();
        
        // Initialize utilities
        initSmoothScroll();
        initFormValidation();

        console.log('🚀 Deca Framework v1.0.0 initialized successfully!');
        Util.trigger(document, 'deca.ready');
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================
    // PUBLIC API
    // ========================================

    const Deca = {
        version: '1.0.0',
        Util,
        Dropdown,
        Modal,
        Accordion,
        Tabs,
        Alert,
        Toast,
        Tooltip,
        Popover,
        Carousel,
        Collapse,
        ScrollSpy,
        LazyLoad,
        BackToTop,
        StickyHeader,
        CounterAnimation,
        init
    };

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Deca;
    }

    return Deca;
}));