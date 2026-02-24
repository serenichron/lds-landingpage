// Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });


        // Glass overlay: fade out on click and trigger autoplay
        document.getElementById('video-placeholder').addEventListener('click', function() {
            const placeholder = document.getElementById('video-placeholder');
            const iframe = document.getElementById('video-iframe');

            iframe.src = 'https://www.youtube.com/embed/u6BeEAfHEsE?si=Hllm4ERxM6mFFzyC&autoplay=1';
            placeholder.style.opacity = '0';
            placeholder.style.pointerEvents = 'none';
        });

// Testimonial carousel: fixed height + dots sync
(function () {
    const carousel = document.getElementById('testimonialCarousel');
    if (!carousel) return;

    const inner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const dots  = document.querySelectorAll('.testimonial-dots button');

    // Measure tallest slide and lock carousel-inner to that height
    function fixHeight() {
        inner.style.height = '';
        let max = 0;
        items.forEach(function (item) {
            const isActive = item.classList.contains('active');
            if (!isActive) {
                item.style.display    = 'block';
                item.style.visibility = 'hidden';
                item.style.position   = 'static';
            }
            max = Math.max(max, item.offsetHeight);
            if (!isActive) {
                item.style.display    = '';
                item.style.visibility = '';
                item.style.position   = '';
            }
        });
        inner.style.height = max + 'px';
    }

    fixHeight();
    window.addEventListener('resize', fixHeight, { passive: true });
    if (document.fonts) { document.fonts.ready.then(fixHeight); }

    // Sync external dots active state
    carousel.addEventListener('slid.bs.carousel', function (e) {
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === e.to);
        });
    });
})();

// Back to top button
(function () {
    const btn = document.getElementById('back-to-top');
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

// Navbar: compact + opaque on scroll
(function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function handleScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load in case page is already scrolled
})();
