// Функция для скрытия ошибки
function hideError(inputElement, errorElement, config) {
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
}

// Функция для показа ошибки
function showError(inputElement, errorElement, config) {
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(config.errorClass);
}

// Функция для проверки валидности поля
function validateInput(inputElement, formElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.setCustomValidity("");

  if (!inputElement.validity.valid) {
    if (inputElement.validity.valueMissing) {
      inputElement.setCustomValidity("Это поле обязательно для заполнения.");
    } else if (inputElement.validity.tooShort || inputElement.validity.tooLong) {
      inputElement.setCustomValidity(
        `Длина должна быть от ${inputElement.minLength} до ${inputElement.maxLength} символов.`
      );
    } else if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(
        inputElement.dataset.error || "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы."
      );
    } else if (inputElement.validity.typeMismatch) {
      inputElement.setCustomValidity("Пожалуйста, введите корректную ссылку.");
    }

    showError(inputElement, errorElement, config);
  } else {
    hideError(inputElement, errorElement, config);
  }
}

// Функция для переключения состояния кнопки
function toggleButtonState(formElement, config) {
  const button = formElement.querySelector(config.submitButtonSelector);

  if (formElement.checkValidity()) {
    button.classList.remove(config.inactiveButtonClass);
    button.disabled = false;
  } else {
    button.classList.add(config.inactiveButtonClass);
    button.disabled = true;
  }
}

// Функция для установки обработчиков событий на форму
function setEventListeners(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));

  inputs.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      validateInput(inputElement, formElement, config);
      toggleButtonState(formElement, config);
    });
  });

  toggleButtonState(formElement, config);
}

// Функция для включения валидации всех форм
export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
}

// Функция для очистки ошибок валидации и деактивации кнопки
export function clearValidation(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const button = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach((inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
    hideError(inputElement, errorElement, config);
  });

  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
}