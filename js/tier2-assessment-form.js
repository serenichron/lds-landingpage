(function () {
    'use strict';

    /* ============================================================
       SQUARESPACE FORM FIELD IDS
       These are the stable element IDs from squarespace-form.html.
       When deployed in Squarespace, the form block must be on the
       same page as the assessment code block.
    ============================================================ */

    var FORM_FIELD_IDS = {
        firstName: 'name-c0d2b53d-1ed1-4695-97a8-9e526638e04d-fname-field',
        email:     'email-338ec66d-7e47-416b-a6af-fc335a402111-field',
        role:      'select-5fa11568-415a-4aba-a4c1-75243eefab8c-field',
        /* Questions in quiz display order (positions 0–11).
           The quiz renders slides in array order: q1,q2,...q10,q12,q11.
           These selects are mapped by that same positional order. */
        questions: [
            'select-a93d8af7-9066-4138-90b5-635e1088681a-field',  /* Q1  */
            'select-ea4bb8d1-45de-4936-95b9-2c1d8bd0bfe7-field',  /* Q2  */
            'select-c6c3b72c-8d18-4884-a3bf-3c5271d5180b-field',  /* Q3  */
            'select-60056986-4bcf-4bca-8242-5237bd6f9e64-field',  /* Q4  */
            'select-3760c9a0-3ee7-41ae-a06d-0e597c2f66ea-field',  /* Q5  */
            'select-87ad1ecb-7c8f-44c9-a94e-a8ecdcb2ff2a-field',  /* Q6  */
            'select-ffeee68d-ff40-4777-8e03-89c5d3800835-field',  /* Q7  */
            'select-a2573e0e-b19e-417d-b42f-333a4034369e-field',  /* Q8  */
            'select-5a3d3354-6b22-48be-968f-a9cd5edb9cec-field',  /* Q9  */
            'select-0d52c46a-fae3-4d74-a941-d721f51c9bf4-field',  /* Q10 */
            'select-21d48a25-ddf5-437a-8045-d84ee1099796-field',  /* Q11 (quiz pos 10 = q12) */
            'select-54289c13-69ca-41e7-a4e1-7707ee44e07e-field'   /* Q12 (quiz pos 11 = q11) */
        ]
    };

    /* Answer score → Squarespace option value */
    var SCORE_TO_TEXT = {
        1: 'No',
        2: 'Partially',
        3: 'Largely yes',
        4: 'Yes, comprehensively'
    };

    /* Role card data-role-label → Squarespace select option value */
    var ROLE_VALUE_MAP = {
        'Vice-chancellor / Provost / Principal / CEO':
            'Vice-chancellor / Provost / Principal / CEO - I oversee institutional strategy and major investment decisions',
        'Pro-vice-chancellor / Academic Director (Education / Digital)':
            'Pro-vice-chancellor / Academic Director (Education / Digital) - I lead the education or digital transformation portfolio',
        'Dean / Head of faculty / Head of Programmes':
            'Dean / Head of faculty / Head of Programmes - I manage academic programmes within my faculty or organisation',
        'Director of digital education / Head of online learning':
            'Director of digital education / Head of online learning - I lead the operational delivery of online programmes',
        'Programme director / Course leader':
            'Programme director / Course leader - I manage specific programme development and delivery',
        'Learning designer / Educational technologist':
            'Learning designer / Educational technologist - I design and build online learning experiences'
    };

    /* ============================================================
       UTILITY
    ============================================================ */

    /* Set a value on a React-controlled input/select without being
       ignored by React's synthetic event system. */
    function setFormValue(el, value) {
        if (!el) return;
        var proto = el.tagName === 'SELECT'
            ? window.HTMLSelectElement.prototype
            : window.HTMLInputElement.prototype;
        var nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
        nativeSetter.call(el, value);
        el.dispatchEvent(new Event('input',  { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function getField(id) {
        return document.getElementById(id);
    }

    /* Walk up the DOM tree looking for an element matching the predicate. */
    function findAncestor(el, predicate) {
        while (el) {
            if (predicate(el)) return el;
            el = el.parentElement;
        }
        return null;
    }

    /* ============================================================
       VALIDATION — name + email on the intro slide
    ============================================================ */

    function validateIntroFields() {
        var nameInput  = document.getElementById('bridge-full-name');
        var emailInput = document.getElementById('bridge-email');
        var errorEl    = document.getElementById('intro-field-error');
        var emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        var name  = nameInput  ? nameInput.value.trim()  : '';
        var email = emailInput ? emailInput.value.trim() : '';

        if (!name) {
            showFieldError('Please enter your full name.', nameInput, errorEl);
            return false;
        }
        if (!email || !emailRe.test(email)) {
            showFieldError('Please enter a valid email address.', emailInput, errorEl);
            return false;
        }

        clearFieldError(errorEl);
        return true;
    }

    function showFieldError(msg, inputEl, errorEl) {
        if (errorEl) errorEl.textContent = msg;
        if (inputEl) {
            inputEl.classList.add('is-invalid');
            inputEl.focus();
        }
    }

    function clearFieldError(errorEl) {
        if (errorEl) errorEl.textContent = '';
        var ids = ['bridge-full-name', 'bridge-email'];
        ids.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.classList.remove('is-invalid');
        });
    }

    /* ============================================================
       FORM POPULATION
    ============================================================ */

    function syncNameEmail() {
        var nameInput  = document.getElementById('bridge-full-name');
        var emailInput = document.getElementById('bridge-email');
        setFormValue(getField(FORM_FIELD_IDS.firstName), nameInput  ? nameInput.value.trim()  : '');
        setFormValue(getField(FORM_FIELD_IDS.email),     emailInput ? emailInput.value.trim() : '');
    }

    function syncRole(roleLabel) {
        var el = getField(FORM_FIELD_IDS.role);
        var fullValue = ROLE_VALUE_MAP[roleLabel] || roleLabel;
        setFormValue(el, fullValue);
    }

    function syncAnswer(slideIndex, score) {
        var fieldId = FORM_FIELD_IDS.questions[slideIndex];
        if (!fieldId) return;
        setFormValue(getField(fieldId), SCORE_TO_TEXT[score] || '');
    }

    /* Clear all question selects back to blank (called when user changes role). */
    function resetFormAnswers() {
        FORM_FIELD_IDS.questions.forEach(function (fieldId) {
            var el = getField(fieldId);
            if (el) setFormValue(el, '');
        });
    }

    /* ============================================================
       START BUTTON — capture-phase listener fires before the quiz's
       bubble-phase listener, so we can block navigation on bad input.
    ============================================================ */

    var startBtn = document.getElementById('intro-start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function (e) {
            if (!validateIntroFields()) {
                /* Stop the quiz from navigating to the role slide. */
                e.stopImmediatePropagation();
            } else {
                syncNameEmail();
            }
        }, true /* capture phase */);
    }

    /* ============================================================
       ROLE SELECTION — event delegation on the slide viewport
    ============================================================ */

    var viewport = document.getElementById('slide-viewport');
    if (viewport) {
        viewport.addEventListener('click', function (e) {
            var card = findAncestor(e.target, function (el) {
                return el.classList && el.classList.contains('role-card');
            });
            if (!card) return;

            resetFormAnswers();
            syncRole(card.getAttribute('data-role-label') || '');
        });
    }

    /* ============================================================
       ANSWER SELECTION — MutationObserver watches for is-selected
       being added to any .answer-option inside the viewport.
       This fires every time an answer is chosen or changed via the
       Back button, so the form always reflects the current state.
    ============================================================ */

    if (viewport && window.MutationObserver) {
        var answerObserver = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.type !== 'attributes' || m.attributeName !== 'class') continue;

                var target = m.target;
                /* Only care about answer options that are now selected. */
                if (!target.classList.contains('answer-option')) continue;
                if (!target.classList.contains('is-selected')) continue;

                /* Walk up to find the parent slide-qN element. */
                var slideEl = findAncestor(target, function (el) {
                    return el.id && /^slide-q\d+$/.test(el.id);
                });
                if (!slideEl) continue;

                var qIndex = parseInt(slideEl.id.replace('slide-q', ''), 10);
                var score  = parseInt(target.getAttribute('data-score'), 10);
                if (!isNaN(qIndex) && !isNaN(score)) {
                    syncAnswer(qIndex, score);
                }
            }
        });

        answerObserver.observe(viewport, {
            attributes:      true,
            attributeFilter: ['class'],
            subtree:         true
        });
    }

    /* ============================================================
       FORM SUBMISSION — triggered when the quiz adds results-visible
       to document.body (happens inside showResults()).
    ============================================================ */

    if (window.MutationObserver) {
        var bodyObserver = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].attributeName !== 'class') continue;
                if (!document.body.classList.contains('results-visible')) continue;

                bodyObserver.disconnect();
                /* Small delay to let any pending DOM updates settle. */
                setTimeout(submitSquarespaceForm, 100);
                return;
            }
        });
        bodyObserver.observe(document.body, {
            attributes:      true,
            attributeFilter: ['class']
        });
    }

    function submitSquarespaceForm() {
        /* Re-sync name/email in case the user changed the fields. */
        syncNameEmail();

        var form = document.querySelector('#bridge-form-container .react-form-contents');
        if (!form) {
            /* In Squarespace, the form block renders on the page directly.
               Try finding any react-form-contents on the page. */
            form = document.querySelector('.react-form-contents');
        }
        if (!form) {
            console.warn('form-bridge: Squarespace form element not found. ' +
                'Ensure the form block is on the same Squarespace page as the assessment.');
            return;
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.click();
        } else {
            form.submit();
        }
    }

})();
