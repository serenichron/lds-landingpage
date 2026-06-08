(function () {
    'use strict';

    /* ================================================================
       CONSTANTS
    ================================================================ */
    var LESSONS     = ['intro', 'lesson-1', 'lesson-2', 'gate', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'summary'];
    var GATED       = ['gate', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'summary'];
    var COMPLETABLE = ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7'];

    var TRACK_MAP = {
        'vc': 'strategic', 'provc': 'strategic', 'dean': 'strategic',
        'director': 'operational', 'programme': 'operational',
        'designer': 'operational', 'other': 'operational'
    };

    var CONFIDENCE_FEEDBACK = {
        low:    'That\'s a useful starting point. The lessons ahead provide frameworks to build your confidence.',
        medium: 'Good — you\'re building a clear picture. The reflection prompts will help you sharpen your thinking.',
        high:   'Excellent. Consider how you might share these insights with colleagues facing the same challenges.'
    };

    var completed     = {};
    var currentLesson = 'intro';
    var gateUnlocked  = !!sessionStorage.getItem('lds_email');

    /* ================================================================
       COVER SCREEN
    ================================================================ */
    var coverScreen    = document.getElementById('cover-screen');
    var coursePlatform = document.getElementById('course-platform');
    var coverStartBtn  = document.getElementById('cover-start-btn');

    coverStartBtn.addEventListener('click', function () {
        coverScreen.style.opacity = '0';
        coverScreen.style.transition = 'opacity 0.3s ease';
        setTimeout(function () {
            coverScreen.style.display = 'none';
            coursePlatform.style.display = 'block';
            var h = document.getElementById('intro-heading');
            if (h) h.focus();
        }, 300);
    });

    /* ================================================================
       GATE FORM
    ================================================================ */
    var gateForm = document.getElementById('gate-inline-form');

    if (gateForm) {
        gateForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var email    = document.getElementById('gate-email');
            var name     = document.getElementById('gate-name');
            var inst     = document.getElementById('gate-institution');
            var pos      = document.getElementById('gate-position');

            var emailErr = document.getElementById('gate-email-error');
            var nameErr  = document.getElementById('gate-name-error');
            var instErr  = document.getElementById('gate-institution-error');
            var posErr   = document.getElementById('gate-position-error');

            var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var valid = true;

            function setError(input, errEl, show) {
                errEl.style.display = show ? 'block' : 'none';
                if (show) { input.setAttribute('aria-invalid', 'true'); valid = false; }
                else { input.removeAttribute('aria-invalid'); }
            }

            setError(email, emailErr, !emailRe.test(email.value.trim()));
            setError(name,  nameErr,  !name.value.trim());
            setError(inst,  instErr,  !inst.value.trim());
            setError(pos,   posErr,   !pos.value);

            if (!valid) return;

            sessionStorage.setItem('lds_email',       email.value.trim());
            sessionStorage.setItem('lds_name',        name.value.trim());
            sessionStorage.setItem('lds_institution', inst.value.trim());
            sessionStorage.setItem('lds_position',    pos.value);
            sessionStorage.setItem('lds_assessment_track', TRACK_MAP[pos.value] || 'operational');

            gateUnlocked = true;
            unlockSidebarIcons();
            showLesson('lesson-3');
        });
    }

    /* ================================================================
       SIDEBAR UNLOCK
    ================================================================ */
    function unlockSidebarIcons() {
        document.querySelectorAll('.sidebar-nav__btn[data-gated="true"]').forEach(function (btn) {
            btn.classList.remove('is-locked');
            btn.removeAttribute('data-gated');
            var key  = btn.getAttribute('data-lesson');
            var icon = btn.querySelector('.sidebar-nav__icon');
            if (icon) {
                if (key === 'summary')      { icon.innerHTML = '<i class="bi bi-flag" aria-hidden="true"></i>'; }
                else if (key === 'gate')    { icon.innerHTML = '<i class="bi bi-pencil-square" aria-hidden="true"></i>'; }
                else                        { icon.textContent = key.replace('lesson-', ''); }
            }
            var lbl = btn.getAttribute('aria-label') || '';
            btn.setAttribute('aria-label', lbl.replace(' (locked)', '').replace(' (locked until Lesson 2 complete)', ''));
        });
    }

    /* ================================================================
       SIDEBAR TOGGLE (mobile)
    ================================================================ */
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var sidebar       = document.getElementById('course-sidebar');
    var overlay       = document.getElementById('sidebar-overlay');

    function openSidebar() {
        sidebar.classList.add('is-open');
        overlay.classList.add('is-visible');
        overlay.removeAttribute('aria-hidden');
        sidebarToggle.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        overlay.setAttribute('aria-hidden', 'true');
        sidebarToggle.setAttribute('aria-expanded', 'false');
    }

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
            closeSidebar();
            sidebarToggle.focus();
        }
    });

    /* ================================================================
       LESSON NAVIGATION
    ================================================================ */
    function showLesson(key) {
        if (!document.getElementById('panel-' + key)) return;

        /* Gate intercept */
        if (!gateUnlocked && GATED.indexOf(key) !== -1) {
            key = 'gate';
        }

        /* Hide all panels */
        document.querySelectorAll('.lesson-panel').forEach(function (p) {
            p.classList.remove('is-active');
            p.setAttribute('aria-hidden', 'true');
        });

        /* Show target */
        var target = document.getElementById('panel-' + key);
        target.classList.add('is-active');
        target.removeAttribute('aria-hidden');

        /* Update sidebar */
        document.querySelectorAll('.sidebar-nav__btn').forEach(function (btn) {
            var active = btn.getAttribute('data-lesson') === key;
            btn.classList.toggle('is-active', active);
            active ? btn.setAttribute('aria-current', 'true') : btn.removeAttribute('aria-current');
        });

        currentLesson = key;
        window.scrollTo(0, 0);
        if (window.innerWidth < 992) closeSidebar();
        updateProgress();

        /* Trigger scroll-reveal for newly visible phases */
        setTimeout(revealVisiblePhases, 50);
    }

    /* Wire sidebar buttons */
    document.querySelectorAll('.sidebar-nav__btn').forEach(function (btn) {
        btn.addEventListener('click', function () { showLesson(btn.getAttribute('data-lesson')); });
    });

    /* Wire prev/next buttons */
    document.querySelectorAll('.lesson-nav-btn[data-goto]').forEach(function (btn) {
        btn.addEventListener('click', function () { showLesson(btn.getAttribute('data-goto')); });
    });

    /* ================================================================
       MARK AS COMPLETE
    ================================================================ */
    COMPLETABLE.forEach(function (key) {
        var row = document.getElementById('complete-' + key);
        if (!row) return;

        function toggle() {
            var now = !completed[key];
            completed[key] = now;
            row.classList.toggle('is-checked', now);
            row.setAttribute('aria-checked', String(now));

            /* Save to sessionStorage */
            sessionStorage.setItem('lds_complete_' + key, now ? '1' : '');

            var navBtn = document.querySelector('.sidebar-nav__btn[data-lesson="' + key + '"]');
            if (navBtn) {
                navBtn.classList.toggle('is-complete', now);
                var icon = navBtn.querySelector('.sidebar-nav__icon');
                if (icon) {
                    icon.innerHTML = now
                        ? '<i class="bi bi-check2" aria-hidden="true"></i>'
                        : key.replace('lesson-', '');
                }
            }
            updateProgress();
        }

        row.addEventListener('click', toggle);
        row.addEventListener('keydown', function (e) {
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
        });
    });

    /* ================================================================
       PROGRESS
    ================================================================ */
    function updateProgress() {
        var done = COMPLETABLE.filter(function (k) { return completed[k]; }).length;
        var pct  = Math.round((done / COMPLETABLE.length) * 100);

        var fill  = document.getElementById('topbar-progress-fill');
        var wrap  = document.getElementById('progress-bar');

        if (fill) fill.style.width = pct + '%';
        if (wrap) wrap.setAttribute('aria-valuenow', pct);

        var sFill = document.getElementById('sidebar-progress-fill');
        var sPct  = document.getElementById('sidebar-progress-pct');
        if (sFill) sFill.style.width  = pct + '%';
        if (sPct)  sPct.textContent   = pct + '%';

        /* Update header meta for mobile */
        var meta = document.getElementById('header-meta');
        if (meta) meta.textContent = pct > 0 ? 'Free course \u00b7 ' + pct + '%' : 'Free course';
    }

    /* ================================================================
       DIAGNOSTIC CHECKLISTS
    ================================================================ */
    document.querySelectorAll('.diagnostic-checklist__item').forEach(function (item) {
        function toggle() {
            var checked = item.getAttribute('aria-checked') === 'true';
            var nowChecked = !checked;
            item.setAttribute('aria-checked', String(nowChecked));
            item.classList.toggle('is-checked', nowChecked);

            /* Pulse animation */
            item.classList.remove('pulse');
            void item.offsetWidth; /* reflow */
            item.classList.add('pulse');

            /* Update summary count */
            var group = item.getAttribute('data-checklist');
            var groupEl = item.closest('.diagnostic-checklist');
            if (groupEl) {
                var total   = groupEl.querySelectorAll('.diagnostic-checklist__item.is-checked').length;
                var summary = groupEl.querySelector('.diagnostic-checklist__summary');
                if (summary) {
                    summary.textContent = total === 0 ? 'Select all that apply' : total + ' selected';
                }
            }
        }

        item.addEventListener('click', toggle);
        item.addEventListener('keydown', function (e) {
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
        });
    });

    /* ================================================================
       WRITING PROMPTS — debounced sessionStorage save
    ================================================================ */
    var writeTimers = {};

    document.querySelectorAll('.writing-prompt__textarea').forEach(function (ta) {
        var key = ta.id;
        /* Restore saved value */
        var saved = sessionStorage.getItem('lds_writing_' + key);
        if (saved) ta.value = saved;

        ta.addEventListener('input', function () {
            clearTimeout(writeTimers[key]);
            writeTimers[key] = setTimeout(function () {
                sessionStorage.setItem('lds_writing_' + key, ta.value);
            }, 600);
        });
    });

    /* ================================================================
       CONFIDENCE CHECK
    ================================================================ */
    document.querySelectorAll('.confidence-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var level  = btn.getAttribute('data-level');
            var lesson = btn.getAttribute('data-lesson');

            /* Clear siblings */
            btn.closest('.confidence-check__buttons').querySelectorAll('.confidence-btn').forEach(function (b) {
                b.classList.remove('is-selected-low', 'is-selected-medium', 'is-selected-high');
                b.setAttribute('aria-pressed', 'false');
            });

            btn.classList.add('is-selected-' + level);
            btn.setAttribute('aria-pressed', 'true');

            /* Show feedback */
            var feedback = document.getElementById('conf-feedback-' + lesson);
            if (feedback) {
                feedback.textContent = CONFIDENCE_FEEDBACK[level] || '';
                feedback.classList.add('is-visible');
            }

            /* Persist */
            sessionStorage.setItem('lds_confidence_' + lesson, level);
        });
    });

    /* ================================================================
       SCROLL-REVEAL (IntersectionObserver)
    ================================================================ */
    function revealVisiblePhases() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.lesson-phase').forEach(function (p) {
                p.classList.add('is-visible');
            });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.lesson-phase:not(.is-visible)').forEach(function (p) {
            observer.observe(p);
        });
    }

    /* ================================================================
       RESTORE SESSION STATE
    ================================================================ */
    if (gateUnlocked) {
        unlockSidebarIcons();
    }

    /* Restore completions */
    COMPLETABLE.forEach(function (key) {
        if (sessionStorage.getItem('lds_complete_' + key) === '1') {
            completed[key] = true;
            var row = document.getElementById('complete-' + key);
            if (row) {
                row.classList.add('is-checked');
                row.setAttribute('aria-checked', 'true');
            }
            var navBtn = document.querySelector('.sidebar-nav__btn[data-lesson="' + key + '"]');
            if (navBtn) {
                navBtn.classList.add('is-complete');
                var icon = navBtn.querySelector('.sidebar-nav__icon');
                if (icon) icon.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i>';
            }
        }
    });

    /* Restore confidence selections */
    ['l1','l2','l3','l4','l5','l6','l7'].forEach(function (lesson) {
        var saved = sessionStorage.getItem('lds_confidence_' + lesson);
        if (saved) {
            var btn = document.querySelector('.confidence-btn[data-level="' + saved + '"][data-lesson="' + lesson + '"]');
            if (btn) btn.classList.add('is-selected-' + saved);
            var feedback = document.getElementById('conf-feedback-' + lesson);
            if (feedback) {
                feedback.textContent = CONFIDENCE_FEEDBACK[saved] || '';
                feedback.classList.add('is-visible');
            }
        }
    });

    /* Ensure all panels except intro hidden */
    document.querySelectorAll('.lesson-panel').forEach(function (p) {
        if (!p.classList.contains('is-active')) p.setAttribute('aria-hidden', 'true');
    });

    updateProgress();
    revealVisiblePhases();

    /* ================================================================
       JOURNEY BREADCRUMB
    ================================================================ */
    var JOURNEY_STEPS = [
        { id: 'home',       label: 'LDS home',      href: 'index.html' },
        { id: 'course',     label: 'Free course',   href: null },
        { id: 'assessment', label: 'Assessment',     href: 'tier2-assessment.html' },
        { id: 'call',       label: 'Book a call',    href: 'book-a-call.html' }
    ];

    function renderBreadcrumb() {
        var nav = document.getElementById('journey-nav');
        if (!nav) return;

        var currentIdx = 1; /* 'course' is current */

        var html = '<button class="journey-breadcrumb__back" id="breadcrumb-back-btn" aria-label="Go back">'
                 + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
                 + ' Back'
                 + '</button>';

        html += '<ol class="journey-breadcrumb" aria-label="Your journey">';

        JOURNEY_STEPS.forEach(function (step, idx) {
            var isFirst = (idx === 0);
            var isCurrent = (idx === currentIdx);
            var isPast = (idx < currentIdx);
            var isFuture = (idx > currentIdx);
            var hideOnMobile = (!isCurrent && idx !== currentIdx - 1);

            var itemClass = 'journey-breadcrumb__item' + (hideOnMobile ? ' journey-breadcrumb__item--hide-mobile' : '');
            html += '<li class="' + itemClass + '">';

            if (!isFirst) {
                var sepClass = 'journey-breadcrumb__sep' + (hideOnMobile ? ' journey-breadcrumb__sep--hide-mobile' : '');
                html += '<span class="' + sepClass + '" aria-hidden="true">&#8250;</span>';
            }

            if (step.id === 'call') {
                html += '<a href="' + step.href + '" class="journey-breadcrumb__cta">' + step.label + '</a>';
            } else if (isPast && step.href) {
                html += '<a href="' + step.href + '" class="journey-breadcrumb__link">' + step.label + '</a>';
            } else if (isCurrent) {
                html += '<span class="journey-breadcrumb__current" aria-current="step">' + step.label + '</span>';
            } else if (isFuture && step.href) {
                html += '<span class="journey-breadcrumb__future">' + step.label + '</span>';
            } else {
                html += '<span class="journey-breadcrumb__future">' + step.label + '</span>';
            }

            html += '</li>';
        });

        html += '</ol>';
        nav.textContent = '';
        nav.insertAdjacentHTML('beforeend', html);

        /* Wire up back button */
        var backBtn = document.getElementById('breadcrumb-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function () {
                window.location.href = 'index.html';
            });
        }
    }

    renderBreadcrumb();

    /* ================================================================
       AUTO-MARK INTRO AND GATE AS VISITED
    ================================================================ */
    /* Mark intro as complete when user navigates away from it */
    var origShowLesson = showLesson;
    /* Intro is auto-completed the first time user leaves it */

})();
