// Navbar: compact + opaque on scroll
        (function () {
            var navbar = document.querySelector('.navbar');
            if (!navbar) return;
            function handleScroll() {
                if (window.scrollY > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        })();

        // Back to top button
        (function () {
            var btn = document.getElementById('back-to-top');
            if (!btn) return;
            function handleVisibility() {
                if (window.scrollY > window.innerHeight * 0.7) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            }
            window.addEventListener('scroll', handleVisibility, { passive: true });
            handleVisibility();
            btn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        })();
