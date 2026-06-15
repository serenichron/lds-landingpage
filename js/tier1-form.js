(function () {

  // Maps working-form select values to the exact Squarespace option text
  var ROLE_MAP = {
    vc:        'Vice-chancellor / Provost / Principal / CEO',
    provc:     'Pro-vice-chancellor / Academic Director (Education/Digital)',
    dean:      'Dean / Head of faculty / Head of Programmes',
    director:  'Director of digital education / Head of online learning',
    programme: 'Programme director / Course leader',
    designer:  'Learning designer / Educational technologist',
    other:     'Other',
  };

  // Squarespace uses React-controlled inputs, so plain .value assignment is ignored.
  // Using the native prototype setter + dispatching events forces React to pick up the change.
  function setNativeValue(el, value) {
    var proto = el.tagName === 'SELECT'
      ? window.HTMLSelectElement.prototype
      : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function syncToSquarespace() {
    var email = document.getElementById('gate-email');
    var name  = document.getElementById('gate-name');
    var inst  = document.getElementById('gate-institution');
    var role  = document.getElementById('gate-position');

    var ssEmail = document.getElementById('email-56aaf22a-55c6-4166-b5a3-4b0cded05930-field');
    var ssFname = document.getElementById('name-c37752e1-fe71-4073-9a49-f37fa8b78825-fname-field');
    var ssInst  = document.getElementById('text-a096ae75-f55e-4963-952e-f41d02ae9fc6-field');
    var ssRole  = document.getElementById('select-82b56b3c-fc88-4526-bacc-f8bfcf56d56c-field');

    if (ssEmail) setNativeValue(ssEmail, email ? email.value : '');
    if (ssFname) setNativeValue(ssFname, name  ? name.value  : '');
    if (ssInst)  setNativeValue(ssInst,  inst  ? inst.value  : '');
    if (ssRole && role) setNativeValue(ssRole, ROLE_MAP[role.value] || '');
  }

  var workingForm = document.getElementById('gate-inline-form');
  if (!workingForm) return;

  // Keep Squarespace form in sync as the user types / changes fields
  workingForm.addEventListener('input',  syncToSquarespace);
  workingForm.addEventListener('change', syncToSquarespace);

  // On submit: do a final sync then trigger the Squarespace submit button
  workingForm.addEventListener('submit', function () {
    syncToSquarespace();
    var ssSubmit = document.querySelector('.react-form-contents button[type="submit"]');
    if (ssSubmit) ssSubmit.click();
  });

})();
