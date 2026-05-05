const FORM_SELECTOR = '[data-email-form]';
const INPUT_SELECTOR = '[data-email-input]';
const ERROR_SELECTOR = '[data-email-error]';
const INVALID_CLASS = 'is-invalid';

const setInvalidState = (form, input, error, isInvalid) => {
  form.classList.toggle(INVALID_CLASS, isInvalid);
  input.setAttribute('aria-invalid', String(isInvalid));

  if (error) {
    error.hidden = !isInvalid;
  }
};

const validateForm = (form) => {
  const input = form.querySelector(INPUT_SELECTOR);
  const error = form.querySelector(ERROR_SELECTOR);

  if (!input) {
    return true;
  }

  const isValid = input.value.trim() !== '' && input.validity.valid;

  setInvalidState(form, input, error, !isValid);

  return isValid;
};

export function initEmailFormsValidation() {
  document.querySelectorAll(FORM_SELECTOR).forEach((form) => {
    const input = form.querySelector(INPUT_SELECTOR);
    const error = form.querySelector(ERROR_SELECTOR);

    if (!input) {
      return;
    }

    setInvalidState(form, input, error, false);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      validateForm(form);
    });

    input.addEventListener('input', () => {
      if (form.classList.contains(INVALID_CLASS)) {
        setInvalidState(form, input, error, false);
      }
    });

    input.addEventListener('focus', () => {
      if (form.classList.contains(INVALID_CLASS)) {
        setInvalidState(form, input, error, false);
      }
    });
  });
}
