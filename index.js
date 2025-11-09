/*!
 * Deca Framework JavaScript v1.0.0
 * Professional UI Framework for Modern Web Development
 * Copyright 2025 Deca Framework
 * Licensed under MIT
 */

(function() {
    'use strict';

    // ========================================
    // MOBILE MENU
    // ========================================
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuToggle || !navLinks) return;

        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignore empty anchors
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    function initNavbarScroll() {
        const navbar = document.querySelector('nav');
        if (!navbar) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide navbar on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }

    // ========================================
    // BUTTON RIPPLE EFFECT
    // ========================================
    function initButtonRipple() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Remove existing ripple
                const existingRipple = this.querySelector('.ripple');
                if (existingRipple) {
                    existingRipple.remove();
                }

                // Create ripple
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                // Calculate position and size
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe columns and cards
        const elements = document.querySelectorAll('.column, .card');
        elements.forEach(el => observer.observe(el));
    }

    // ========================================
    // FORM VALIDATION
    // ========================================
    function initFormValidation() {
        const forms = document.querySelectorAll('.needs-validation');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    }

    // ========================================
    // DROPDOWN
    // ========================================
    function initDropdowns() {
        const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.closest('.dropdown');
                const menu = dropdown.querySelector('.dropdown-menu');
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.classList.remove('show');
                    }
                });
                
                menu.classList.toggle('show');
            });
        });

        // Close dropdowns on outside click
        document.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        });
    }

    // ========================================
    // MODAL
    // ========================================
    function initModals() {
        const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('data-target');
                const modal = document.querySelector(target);
                
                if (modal) {
                    openModal(modal);
                }
            });
        });

        // Close buttons
        const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                closeModal(modal);
            });
        });

        function openModal(modal) {
            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop show';
            document.body.appendChild(backdrop);
            
            modal.style.display = 'block';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Close on backdrop click
            backdrop.addEventListener('click', function() {
                closeModal(modal);
            });

            // Close on ESC key
            const escHandler = function(e) {
                if (e.key === 'Escape') {
                    closeModal(modal);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        function closeModal(modal) {
            const backdrop = document.querySelector('.modal-backdrop');
            
            modal.classList.remove('show');
            
            setTimeout(function() {
                modal.style.display = 'none';
                if (backdrop) {
                    backdrop.remove();
                }
                document.body.style.overflow = '';
            }, 150);
        }
    }

    // ========================================
    // TABS
    // ========================================
    function initTabs() {
        const tabLinks = document.querySelectorAll('[data-toggle="tab"]');
        
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const target = this.getAttribute('data-target') || this.getAttribute('href');
                const tabPane = document.querySelector(target);
                
                if (!tabPane) return;
                
                // Remove active from all tabs and panes
                const tabList = this.closest('[role="tablist"]');
                const allLinks = tabList.querySelectorAll('[data-toggle="tab"]');
                const container = tabPane.parentElement;
                const allPanes = container.querySelectorAll('.tab-pane');
                
                allLinks.forEach(l => l.classList.remove('active'));
                allPanes.forEach(p => p.classList.remove('active'));
                
                // Add active to current
                this.classList.add('active');
                tabPane.classList.add('active');
            });
        });
    }

    // ========================================
    // ACCORDION
    // ========================================
    function initAccordions() {
        const accordionButtons = document.querySelectorAll('.accordion-button');
        
        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const accordion = this.closest('.accordion');
                const item = this.closest('.accordion-item');
                const collapse = item.querySelector('.accordion-collapse');
                const isCollapsed = this.classList.contains('collapsed');
                
                // Check if multiple items can be open
                const allowMultiple = accordion.hasAttribute('data-multiple');
                
                if (!allowMultiple) {
                    // Close all other items
                    accordion.querySelectorAll('.accordion-button').forEach(btn => {
                        if (btn !== this) {
                            btn.classList.add('collapsed');
                            const otherCollapse = btn.closest('.accordion-item').querySelector('.accordion-collapse');
                            otherCollapse.style.display = 'none';
                        }
                    });
                }
                
                // Toggle current item
                if (isCollapsed) {
                    this.classList.remove('collapsed');
                    collapse.style.display = 'block';
                } else {
                    this.classList.add('collapsed');
                    collapse.style.display = 'none';
                }
            });
        });
    }

    // ========================================
    // ALERTS
    // ========================================
    function initAlerts() {
        const closeButtons = document.querySelectorAll('[data-dismiss="alert"]');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const alert = this.closest('.alert');
                alert.style.opacity = '0';
                alert.style.transition = 'opacity 0.15s';
                
                setTimeout(function() {
                    alert.remove();
                }, 150);
            });
        });
    }

    // ========================================
    // BACK TO TOP
    // ========================================
    function initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // LAZY LOADING
    // ========================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ========================================
    // SCROLL SPY
    // ========================================
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0) return;

        function updateActiveLink() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    // ========================================
    // INITIALIZE ALL
    // ========================================
    function init() {
        initMobileMenu();
        initSmoothScroll();
        initNavbarScroll();
        initButtonRipple();
        initScrollAnimations();
        initFormValidation();
        initDropdowns();
        initModals();
        initTabs();
        initAccordions();
        initAlerts();
        initBackToTop();
        initLazyLoading();
        initScrollSpy();

        console.log('🚀 Deca Framework v1.0.0 initialized successfully!');
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();