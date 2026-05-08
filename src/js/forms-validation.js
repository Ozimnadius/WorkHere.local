const FORM_SELECTOR = '[data-form-validation]';
const EMAIL_INPUT_SELECTOR = '[data-email-input]';
const EMAIL_ERROR_SELECTOR = '[data-email-error]';
const TEL_INPUT_SELECTOR = '[data-tel-input]';
const TEL_ERROR_SELECTOR = '[data-tel-error]';
const INVALID_CLASS = 'is-invalid';
const PHONE_DIGITS_LENGTH = 10;

const getPhoneDigits = (value) => {
  const digits = value.replace(/\D/g, '');
  const trimmedValue = value.trim();

  if (trimmedValue.startsWith('+7') && digits.startsWith('7')) {
    return digits.slice(1, PHONE_DIGITS_LENGTH + 1);
  }

  if (digits.length > PHONE_DIGITS_LENGTH && (digits.startsWith('8') || digits.startsWith('7'))) {
    return digits.slice(1, PHONE_DIGITS_LENGTH + 1);
  }

  return digits.slice(0, PHONE_DIGITS_LENGTH);
};

const formatPhoneDigits = (digits) => {
  const areaCode = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const firstPair = digits.slice(6, 8);
  const secondPair = digits.slice(8, 10);
  let formattedValue = '';

  if (areaCode) {
    formattedValue = `+7 (${areaCode}`;
  }

  if (areaCode.length === 3) {
    formattedValue += ')';
  }

  if (prefix) {
    formattedValue += ` ${prefix}`;
  }

  if (firstPair) {
    formattedValue += `-${firstPair}`;
  }

  if (secondPair) {
    formattedValue += `-${secondPair}`;
  }

  return formattedValue;
};

const formatPhoneValue = (value, previousValue = '', inputType = '') => {
  let digits = getPhoneDigits(value);
  const previousDigits = getPhoneDigits(previousValue);
  const isDeletingMaskChar = inputType === 'deleteContentBackward'
    && value.length < previousValue.length
    && digits === previousDigits;

  if (isDeletingMaskChar) {
    digits = digits.slice(0, -1);
  }

  return formatPhoneDigits(digits);
};

const setFieldInvalidState = (input, error, isInvalid, shouldShowError = isInvalid) => {
  input.setAttribute('aria-invalid', String(isInvalid));

  if (error) {
    error.hidden = !shouldShowError;
  }
};

const getFormFields = (form) => [
  {
    input: form.querySelector(TEL_INPUT_SELECTOR),
    error: form.querySelector(TEL_ERROR_SELECTOR),
    validate: (input) => getPhoneDigits(input.value).length === PHONE_DIGITS_LENGTH,
  },
  {
    input: form.querySelector(EMAIL_INPUT_SELECTOR),
    error: form.querySelector(EMAIL_ERROR_SELECTOR),
    validate: (input) => input.value.trim() !== '' && input.validity.valid,
  },
].filter(({input}) => input);

const resetFormInvalidState = (form, fields) => {
  form.classList.remove(INVALID_CLASS);
  fields.forEach(({input, error}) => setFieldInvalidState(input, error, false));
};

const validateForm = (form, fields) => {
  let isFormValid = true;

  fields.forEach(({input, error, validate}) => {
    const isFieldValid = validate(input);

    setFieldInvalidState(input, error, !isFieldValid);

    if (!isFieldValid) {
      isFormValid = false;
    }
  });

  form.classList.toggle(INVALID_CLASS, !isFormValid);

  return isFormValid;
};

export function initFormsValidation() {
  document.querySelectorAll(FORM_SELECTOR).forEach((form) => {
    const fields = getFormFields(form);
    const telInput = form.querySelector(TEL_INPUT_SELECTOR);
    let previousTelValue = telInput?.value || '';

    if (fields.length === 0) {
      return;
    }

    resetFormInvalidState(form, fields);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      validateForm(form, fields);
    });

    fields.forEach(({input}) => {
      input.addEventListener('input', (event) => {
        if (input === telInput) {
          input.value = formatPhoneValue(input.value, previousTelValue, event.inputType);
          previousTelValue = input.value;
        }

        if (form.classList.contains(INVALID_CLASS)) {
          resetFormInvalidState(form, fields);
        }
      });

      input.addEventListener('focus', () => {
        if (form.classList.contains(INVALID_CLASS)) {
          resetFormInvalidState(form, fields);
        }
      });
    });
  });
}
