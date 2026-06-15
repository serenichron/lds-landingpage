(function () {
    'use strict';

    /* ============================================================
       SQUARESPACE FORM FIELD IDS
       Must match the field IDs in your Squarespace Form Block.
    ============================================================ */

    var FORM_FIELD_IDS = {
        firstName: 'name-c0d2b53d-1ed1-4695-97a8-9e526638e04d-fname-field',
        email:     'email-338ec66d-7e47-416b-a6af-fc335a402111-field',
        role:      'select-5fa11568-415a-4aba-a4c1-75243eefab8c-field',
        /* Questions in quiz display order (both tracks: q1–q10, then q12, then q11) */
        questions: [
            'select-a93d8af7-9066-4138-90b5-635e1088681a-field',
            'select-ea4bb8d1-45de-4936-95b9-2c1d8bd0bfe7-field',
            'select-c6c3b72c-8d18-4884-a3bf-3c5271d5180b-field',
            'select-60056986-4bcf-4bca-8242-5237bd6f9e64-field',
            'select-3760c9a0-3ee7-41ae-a06d-0e597c2f66ea-field',
            'select-87ad1ecb-7c8f-44c9-a94e-a8ecdcb2ff2a-field',
            'select-ffeee68d-ff40-4777-8e03-89c5d3800835-field',
            'select-a2573e0e-b19e-417d-b42f-333a4034369e-field',
            'select-5a3d3354-6b22-48be-968f-a9cd5edb9cec-field',
            'select-0d52c46a-fae3-4d74-a941-d721f51c9bf4-field',
            'select-21d48a25-ddf5-437a-8045-d84ee1099796-field',
            'select-54289c13-69ca-41e7-a4e1-7707ee44e07e-field'
        ]
    };

    var SCORE_TO_TEXT = {
        1: 'No',
        2: 'Partially',
        3: 'Largely yes',
        4: 'Yes, comprehensively'
    };

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

    /* The HTML includes an off-screen copy of the Squarespace form
       for local testing. Both the copy and the real Squarespace Form
       Block have the same field IDs; getElementById always returns
       the first match in DOM order, which is the copy (it appears
       earlier in the code block). We must skip the copy and prefer
       the real form block when both are present. */
    var localContainer = document.getElementById('bridge-form-container');

    function findAncestor(el, predicate) {
        while (el) {
            if (predicate(el)) return el;
            el = el.parentElement;
        }
        return null;
    }

    /* Return the element with this ID that is NOT inside the local
       testing copy, falling back to any match if only the copy exists. */
    function getField(id) {
        var all = document.querySelectorAll('[id="' + id + '"]');
        for (var i = 0; i < all.length; i++) {
            if (!localContainer || !localContainer.contains(all[i])) {
                return all[i];
            }
        }
        return all[0] || null;
    }

    /* Set a value on a React-controlled input or select.
       React wraps the native value setter so a plain assignment is
       silently ignored. Using the prototype's original setter and
       dispatching events forces React to pick up the change.
       (Same technique used in the working gate form-bridge.js.) */
    function setNativeValue(el, value) {
        if (!el) return;
        var proto = el.tagName === 'SELECT'
            ? window.HTMLSelectElement.prototype
            : window.HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
        el.dispatchEvent(new Event('input',  { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[form-bridge] ' + (el.id || el.tagName) + ' ← ' + JSON.stringify(value));
    }

    /* ============================================================
       VALIDATION
    ============================================================ */

    function validateIntroFields() {
        var nameEl  = document.getElementById('bridge-full-name');
        var emailEl = document.getElementById('bridge-email');
        var errorEl = document.getElementById('intro-field-error');
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        var name  = nameEl  ? nameEl.value.trim()  : '';
        var email = emailEl ? emailEl.value.trim() : '';

        if (!name) {
            if (errorEl) errorEl.textContent = 'Please enter your full name.';
            if (nameEl)  { nameEl.classList.add('is-invalid'); nameEl.focus(); }
            return false;
        }
        if (!email || !emailRe.test(email)) {
            if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
            if (emailEl) { emailEl.classList.add('is-invalid'); emailEl.focus(); }
            return false;
        }

        if (errorEl) errorEl.textContent = '';
        if (nameEl)  nameEl.classList.remove('is-invalid');
        if (emailEl) emailEl.classList.remove('is-invalid');
        return true;
    }

    /* ============================================================
       SYNC HELPERS
    ============================================================ */

    function syncNameEmail() {
        var nameEl  = document.getElementById('bridge-full-name');
        var emailEl = document.getElementById('bridge-email');
        setNativeValue(getField(FORM_FIELD_IDS.firstName), nameEl  ? nameEl.value.trim()  : '');
        setNativeValue(getField(FORM_FIELD_IDS.email),     emailEl ? emailEl.value.trim() : '');
    }

    function syncRole(roleLabel) {
        setNativeValue(getField(FORM_FIELD_IDS.role), ROLE_VALUE_MAP[roleLabel] || roleLabel);
    }

    function syncAnswer(slideIndex, score) {
        if (slideIndex < 0 || slideIndex >= FORM_FIELD_IDS.questions.length) return;
        setNativeValue(getField(FORM_FIELD_IDS.questions[slideIndex]), SCORE_TO_TEXT[score] || '');
    }

    function resetFormAnswers() {
        FORM_FIELD_IDS.questions.forEach(function (id) {
            var el = getField(id);
            if (el) setNativeValue(el, '');
        });
    }

    /* ============================================================
       START BUTTON — capture-phase validation gate
       Capture phase fires before the quiz's bubble-phase listener
       regardless of when each listener was registered. If validation
       fails, stopImmediatePropagation() prevents the quiz from
       advancing to the role slide.
    ============================================================ */

    var startBtn = document.getElementById('intro-start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function (e) {
            if (!validateIntroFields()) {
                e.stopImmediatePropagation();
            } else {
                syncNameEmail();
                console.log('[form-bridge] name/email synced, advancing');
            }
        }, true /* capture phase */);
    }

    /* ============================================================
       CLICK DELEGATION ON VIEWPORT
       Handles role card selection and answer button clicks.
       Delegation catches both initial clicks and Back-button
       re-selections — re-clicking an answer simply overwrites
       the previous sync.
    ============================================================ */

    var viewport = document.getElementById('slide-viewport');
    if (viewport) {
        viewport.addEventListener('click', function (e) {

            /* Role card */
            var roleCard = findAncestor(e.target, function (n) {
                return n.classList && n.classList.contains('role-card');
            });
            if (roleCard) {
                var label = roleCard.getAttribute('data-role-label') || '';
                console.log('[form-bridge] role selected: ' + label);
                resetFormAnswers();
                syncRole(label);
                return;
            }

            /* Answer button */
            var answerBtn = findAncestor(e.target, function (n) {
                return n.classList && n.classList.contains('answer-option');
            });
            if (answerBtn) {
                var slideEl = findAncestor(answerBtn, function (n) {
                    return n.id && /^slide-q\d+$/.test(n.id);
                });
                if (!slideEl) return;
                var qIndex = parseInt(slideEl.id.replace('slide-q', ''), 10);
                var score  = parseInt(answerBtn.getAttribute('data-score'), 10);
                if (!isNaN(qIndex) && !isNaN(score)) {
                    console.log('[form-bridge] Q' + qIndex + ' (slide index) score=' + score);
                    syncAnswer(qIndex, score);
                }
            }
        });
    }

    /* ============================================================
       FORM SUBMISSION
       The quiz adds 'results-visible' to document.body inside
       showResults() — triggered only after all 12 questions are
       answered. We watch for that class, sync name/email one final
       time, then click the Squarespace Form Block's submit button.

       The Squarespace Form Block MUST be on this page for submission
       to work. Configure its success action to "Show inline message"
       (not "Redirect to page") — otherwise Squarespace will navigate
       away after submission and the results will disappear.
    ============================================================ */

    if (window.MutationObserver) {
        var bodyObs = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].attributeName !== 'class') continue;
                if (!document.body.classList.contains('results-visible')) continue;
                bodyObs.disconnect();
                setTimeout(function () {
                    syncNameEmail();
                    submitSquarespaceForm();
                }, 300);
                return;
            }
        });
        bodyObs.observe(document.body, {
            attributes:      true,
            attributeFilter: ['class']
        });
    }

    function submitSquarespaceForm() {
        /* Find the submit button outside the local testing copy.
           The copy has onsubmit="return false;" so clicking it won't
           reload the page, but we still prefer the real form block. */
        var buttons = document.querySelectorAll('.react-form-contents button[type="submit"]');
        var ssSubmit = null;
        for (var i = 0; i < buttons.length; i++) {
            if (!localContainer || !localContainer.contains(buttons[i])) {
                ssSubmit = buttons[i];
                break;
            }
        }
        if (!ssSubmit) {
            console.warn('[form-bridge] Squarespace Form Block not found. ' +
                'Add a Form Block to this Squarespace page for live submission.');
            return;
        }
        console.log('[form-bridge] clicking Squarespace submit');
        ssSubmit.click();
    }

}());
