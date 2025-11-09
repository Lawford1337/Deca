/*!
 * Deca Framework JavaScript v1.0.0
 * Professional UI Framework for Modern Web Development
 * Copyright 2025 Deca Framework
 * Licensed under MIT
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
            return typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
        },

        // Add event listener with delegation support
        on(element, event, selector, handler) {
            if (typeof selector === 'function') {
                handler = selector;
                element.addEventListener(event, handler);
            } else {
                element.addEventListener(event, e => {
                    if (e.target.closest(selector)) {
                        handler.call(e.target.closest(selector), e);
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
            element.dispatchEvent(event);
        },

        // Add class
        addClass(element, className) {
            element.classList.add(...className.split(' '));
        },

        // Remove class
        removeClass(element, className) {
            element.classList.remove(...className.split(' '));
        },

        // Toggle class
        toggleClass(element, className) {
            element.classList.toggle(className);
        },

        // Check if element has class
        hasClass(element, className) {
            return element.classList.contains(className);
        },

        // Get data attribute
        getData(element, key) {
            return element.dataset[key];
        },

        // Set data attribute
        setData(element, key, value) {
            element.dataset[key] = value;
        },

        // Slide down animation
        slideDown(element, duration = 300) {
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

        // Fade in
        fadeIn(element, duration = 300) {
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
            element.style.opacity = 1;
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = 0;
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.removeProperty('opacity');
                element.style.removeProperty('transition');
            }, duration);
        }
    };

    // ========================================
    // DROPDOWN COMPONENT
    // ========================================

    class Dropdown {
        constructor(element) {
            this.dropdown = Util.getElement(element);
            this.toggle = this.dropdown.querySelector('[data-toggle="dropdown"]');
            this.menu = this.dropdown.querySelector('.dropdown-menu');
            this.isOpen = false;

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

            Util.on(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            Util.addClass(this.menu, 'show');
            this.isOpen = true;
            Util.trigger(this.dropdown, 'dropdown.show');
        }

        close() {
            Util.removeClass(this.menu, 'show');
            this.isOpen = false;
            Util.trigger(this.dropdown, 'dropdown.hide');
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
        constructor(element) {
            this.modal = Util.getElement(element);
            this.backdrop = null;
            this.isOpen = false;

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

            Util.on(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.hide();
                }
            });
        }

        show() {
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'modal-backdrop show';
            document.body.appendChild(this.backdrop);
            
            Util.addClass(this.modal, 'show');
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            this.isOpen = true;
            Util.trigger(this.modal, 'modal.show');

            Util.on(this.backdrop, 'click', () => this.hide());
        }

        hide() {
            Util.removeClass(this.modal, 'show');
            
            setTimeout(() => {
                this.modal.style.display = 'none';
                if (this.backdrop) {
                    this.backdrop.remove();
                    this.backdrop = null;
                }
                document.body.style.overflow = '';
                this.isOpen = false;
                Util.trigger(this.modal, 'modal.hide');
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
        constructor(element) {
            this.accordion = Util.getElement(element);
            this.init();
        }

        init() {
            const buttons = this.accordion.querySelectorAll('.accordion-button');
            
            buttons.forEach(button => {
                Util.on(button, 'click', () => {
                    const item = button.closest('.accordion-item');
                    const collapse = item.querySelector('.accordion-collapse');
                    const isCollapsed = Util.hasClass(button, 'collapsed');

                    // Close all other items
                    if (!Util.getData(this.accordion, 'multiple')) {
                        this.closeAll();
                    }

                    if (isCollapsed) {
                        Util.removeClass(button, 'collapsed');
                        Util.slideDown(collapse);
                        Util.trigger(item, 'accordion.show');
                    } else {
                        Util.addClass(button, 'collapsed');
                        Util.slideUp(collapse);
                        Util.trigger(item, 'accordion.hide');
                    }
                });
            });
        }

        closeAll() {
            const buttons = this.accordion.querySelectorAll('.accordion-button');
            buttons.forEach(button => {
                const item = button.closest('.accordion-item');
                const collapse = item.querySelector('.accordion-collapse');
                Util.addClass(button, 'collapsed');
                collapse.style.display = 'none';
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
        constructor(element) {
            this.tabList = Util.getElement(element);
            this.init();
        }

        init() {
            const tabs = this.tabList.querySelectorAll('[data-toggle="tab"]');
            
            tabs.forEach(tab => {
                Util.on(tab, 'click', (e) => {
                    e.preventDefault();
                    const target = Util.getData(tab, 'target') || tab.getAttribute('href');
                    this.show(target);
                    
                    // Update active state
                    tabs.forEach(t => {
                        Util.removeClass(t, 'active');
                        const pane = document.querySelector(Util.getData(t, 'target') || t.getAttribute('href'));
                        if (pane) Util.removeClass(pane, 'active');
                    });
                    
                    Util.addClass(tab, 'active');
                    const activePane = document.querySelector(target);
                    if (activePane) {
                        Util.addClass(activePane, 'active');
                        Util.trigger(activePane, 'tab.show');
                    }
                });
            });
        }

        show(target) {
            const pane = document.querySelector(target);
            if (!pane) return;

            const container = pane.parentElement;
            const panes = container.querySelectorAll('.tab-pane');
            
            panes.forEach(p => {
                Util.removeClass(p, 'active');
                p.style.display = 'none';
            });
            
            Util.addClass(pane, 'active');
            Util.fadeIn(pane);
        }

        static init() {
            const tabLists = Util.getElements('[role="tablist"]');
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
        constructor(element) {
            this.alert = Util.getElement(element);
            this.init();
        }

        init() {
            const closeButton = this.alert.querySelector('[data-dismiss="alert"]');
            if (closeButton) {
                Util.on(closeButton, 'click', () => this.close());
            }
        }

        close() {
            Util.trigger(this.alert, 'alert.close');
            Util.fadeOut(this.alert, 150);
            setTimeout(() => {
                this.alert.remove();
                Util.trigger(this.alert, 'alert.closed');
            }, 150);
        }

        static init() {
            const alerts = Util.getElements('.alert[data-dismissible]');
            alerts.forEach(alert => {
                if (!Util.getData(alert, 'alert')) {
                    new Alert(alert);
                    Util.setData(alert, 'alert', 'true');
                }
            });
        }
    }

    // ========================================
    // TOAST COMPONENT
    // ========================================

    class Toast {
        constructor(element, options = {}) {
            this.toast = Util.getElement(element);
            this.options = {
                autohide: true,
                delay: 5000,
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
            this.toast.style.display = 'block';
            Util.fadeIn(this.toast);
            Util.trigger(this.toast, 'toast.show');

            if (this.options.autohide) {
                setTimeout(() => this.hide(), this.options.delay);
            }
        }

        hide() {
            Util.fadeOut(this.toast);
            setTimeout(() => {
                this.toast.style.display = 'none';
                Util.trigger(this.toast, 'toast.hide');
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
    }

    // ========================================
    // TOOLTIP COMPONENT
    // ========================================

    class Tooltip {
        constructor(element, options = {}) {
            this.element = Util.getElement(element);
            this.options = {
                placement: 'top',
                trigger: 'hover',
                ...options
            };
            this.tooltip = null;
            this.init();
        }

        init() {
            const trigger = this.options.trigger;

            if (trigger === 'hover') {
                Util.on(this.element, 'mouseenter', () => this.show());
                Util.on(this.element, 'mouseleave', () => this.hide());
            } else if (trigger === 'click') {
                Util.on(this.element, 'click', () => this.toggle());
            } else if (trigger === 'focus') {
                Util.on(this.element, 'focus', () => this.show());
                Util.on(this.element, 'blur', () => this.hide());
            }
        }

        show() {
            if (this.tooltip) return;

            const title = this.element.getAttribute('title') || this.element.getAttribute('data-title');
            if (!title) return;

            this.tooltip = document.createElement('div');
            this.tooltip.className = 'tooltip show';
            this.tooltip.innerHTML = `<div class="tooltip-inner">${title}</div>`;
            document.body.appendChild(this.tooltip);

            this.position();
            Util.trigger(this.element, 'tooltip.show');
        }

        hide() {
            if (!this.tooltip) return;

            Util.removeClass(this.tooltip, 'show');
            setTimeout(() => {
                if (this.tooltip) {
                    this.tooltip.remove();
                    this.tooltip = null;
                    Util.trigger(this.element, 'tooltip.hide');
                }
            }, 150);
        }

        toggle() {
            this.tooltip ? this.hide() : this.show();
        }

        position() {
            const rect = this.element.getBoundingClientRect();
            const tooltipRect = this.tooltip.getBoundingClientRect();
            
            let top, left;
            
            switch (this.options.placement) {
                case 'top':
                    top = rect.top - tooltipRect.height - 10;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + 10;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.left - tooltipRect.width - 10;
                    break;
                case 'right':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.right + 10;
                    break;
            }

            this.tooltip.style.top = top + window.pageYOffset + 'px';
            this.tooltip.style.left = left + window.pageXOffset + 'px';
        }

        static init() {
            const elements = Util.getElements('[data-toggle="tooltip"]');
            elements.forEach(element => {
                if (!Util.getData(element, 'tooltip')) {
                    new Tooltip(element);
                    Util.setData(element, 'tooltip', 'true');
                }
            });
        }
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================

    function initSmoothScroll() {
        const links = Util.getElements('a[href^="#"]');
        
        links.forEach(link => {
            Util.on(link, 'click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
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
        });
    }

    // ========================================
    // SCROLL SPY
    // ========================================

    function initScrollSpy() {
        const sections = Util.getElements('section[id]');
        const navLinks = Util.getElements('.nav-link');

        function updateActiveLink() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                Util.removeClass(link, 'active');
                if (link.getAttribute('href') === `#${current}`) {
                    Util.addClass(link, 'active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
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
        
        // Initialize utilities
        initSmoothScroll();
        initFormValidation();
        initScrollSpy();

        console.log('🚀 Deca Framework initialized successfully!');
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

    return {
        version: '1.0.0',
        Util,
        Dropdown,
        Modal,
        Accordion,
        Tabs,
        Alert,
        Toast,
        Tooltip,
        init
    };
}));