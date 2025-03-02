/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/components/api.js
var config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-33',
  headers: {
    authorization: '3d3498d0-cbfa-4604-8287-294d4f7e2f00',
    'Content-Type': 'application/json'
  }
};

// Проверка ответа сервера
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject("\u041E\u0448\u0438\u0431\u043A\u0430: ".concat(res.status));
}

// Получение информации о пользователе
function getUserInfo() {
  return fetch("".concat(config.baseUrl, "/users/me"), {
    headers: config.headers
  }).then(checkResponse);
}

// Получение карточек
function getCards() {
  return fetch("".concat(config.baseUrl, "/cards"), {
    headers: config.headers
  }).then(checkResponse);
}

// Добавление новой карточки
function addCard(name, link) {
  return fetch("".concat(config.baseUrl, "/cards"), {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  }).then(checkResponse);
}

// Лайк карточки
function likeCard(cardId) {
  return fetch("".concat(config.baseUrl, "/cards/likes/").concat(cardId), {
    method: 'PUT',
    headers: config.headers
  }).then(checkResponse);
}

// Дизлайк карточки
function unlikeCard(cardId) {
  return fetch("".concat(config.baseUrl, "/cards/likes/").concat(cardId), {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
}

// Удаление карточки
function deleteCardFromServer(cardId) {
  return fetch("".concat(config.baseUrl, "/cards/").concat(cardId), {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
}

// Обновление информации о пользователе
function updateUserInfo(name, about) {
  return fetch("".concat(config.baseUrl, "/users/me"), {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  }).then(checkResponse);
}

// Обновление аватара пользователя
function updateUserAvatar(avatar) {
  return fetch("".concat(config.baseUrl, "/users/me/avatar"), {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatar
    })
  }).then(checkResponse);
}
;// ./src/components/modal.js
function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeModalOnEsc);
}
function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeModalOnEsc);
}
function closeModalOnEsc(event) {
  if (event.key === "Escape") {
    var openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}
function closeModalOnOverlay(event) {
  if (event.target.classList.contains("popup")) {
    closeModal(event.target);
  }
}
;// ./src/components/card.js


function createCard(cardData, userId, openImagePopup) {
  // Клонируем шаблон карточки
  var cardElement = document.querySelector('#card-template').content.querySelector('.card').cloneNode(true);

  // Находим элементы карточки
  var cardImage = cardElement.querySelector('.card__image');
  var cardTitle = cardElement.querySelector('.card__title');
  var cardLikeButton = cardElement.querySelector('.card__like-button');
  var cardLikeCount = cardElement.querySelector('.card__like-count');
  var cardDeleteButton = cardElement.querySelector('.card__delete-button');

  // Устанавливаем данные карточки
  cardElement.setAttribute('data-card-id', cardData._id); // Добавляем уникальный ID
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  cardLikeCount.textContent = cardData.likes.length;

  // Проверка, является ли пользователь владельцем карточки
  if (cardData.owner._id !== userId) {
    cardDeleteButton.style.display = 'none'; // Скрываем кнопку удаления
  }

  // Проверка, поставил ли пользователь лайк
  if (cardData.likes.some(function (like) {
    return like._id === userId;
  })) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  // Обработчик удаления карточки
  cardDeleteButton.addEventListener('click', function () {
    // Сохраняем ID карточки для последующего удаления
    window.cardToDeleteId = cardData._id;

    // Открываем попап подтверждения
    openModal(document.querySelector('.popup_type_confirm'));
  });

  // Функция для обновления состояния лайка
  function updateLikeState(updatedCard) {
    cardLikeButton.classList.toggle('card__like-button_is-active');
    cardLikeCount.textContent = updatedCard.likes.length;
  }

  // Обработчик лайка карточки
  cardLikeButton.addEventListener('click', function () {
    if (cardLikeButton.classList.contains('card__like-button_is-active')) {
      // Убираем лайк
      unlikeCard(cardData._id).then(function (updatedCard) {
        updateLikeState(updatedCard);
      })["catch"](function (err) {
        console.error(err);
      });
    } else {
      // Ставим лайк
      likeCard(cardData._id).then(function (updatedCard) {
        updateLikeState(updatedCard);
      })["catch"](function (err) {
        console.error(err);
      });
    }
  });

  // Обработчик открытия изображения
  cardImage.addEventListener('click', function () {
    openImagePopup(cardData.name, cardData.link);
  });
  return cardElement;
}
;// ./src/components/validation.js
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
  var errorElement = formElement.querySelector(".".concat(inputElement.name, "-error"));
  inputElement.setCustomValidity("");
  if (!inputElement.validity.valid) {
    if (inputElement.validity.valueMissing) {
      inputElement.setCustomValidity("Это поле обязательно для заполнения.");
    } else if (inputElement.validity.tooShort || inputElement.validity.tooLong) {
      inputElement.setCustomValidity("\u0414\u043B\u0438\u043D\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043E\u0442 ".concat(inputElement.minLength, " \u0434\u043E ").concat(inputElement.maxLength, " \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432."));
    } else if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.error || "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.");
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
  var button = formElement.querySelector(config.submitButtonSelector);
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
  var inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  inputs.forEach(function (inputElement) {
    inputElement.addEventListener("input", function () {
      validateInput(inputElement, formElement, config);
      toggleButtonState(formElement, config);
    });
  });
  toggleButtonState(formElement, config);
}

// Функция для включения валидации всех форм
function enableValidation(config) {
  var forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach(function (formElement) {
    setEventListeners(formElement, config);
  });
}

// Функция для очистки ошибок валидации и деактивации кнопки
function clearValidation(formElement, config) {
  var inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  var button = formElement.querySelector(config.submitButtonSelector);
  inputs.forEach(function (inputElement) {
    var errorElement = formElement.querySelector(".".concat(inputElement.name, "-error"));
    hideError(inputElement, errorElement, config);
  });
  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
}
;// ./src/scripts/index.js
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }






// Настройки валидации
var validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__save-button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_visible"
};

// Включение валидации
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    enableValidation(validationConfig);

    // Переменные
    var placesList = document.querySelector(".places__list");
    var editProfileButton = document.querySelector(".profile__edit-button");
    var addCardButton = document.querySelector(".profile__add-button");
    var profileAvatarContainer = document.querySelector(".profile__avatar-container");
    var closeButtons = document.querySelectorAll(".popup__close");
    var profileForm = document.querySelector(".popup_type_edit .popup__form");
    var nameInput = profileForm.querySelector(".popup__input_type_name");
    var jobInput = profileForm.querySelector(".popup__input_type_description");
    var newCardForm = document.querySelector(".popup_type_new-card .popup__form");
    var placeNameInput = newCardForm.querySelector(".popup__input_type_card-name");
    var placeLinkInput = newCardForm.querySelector(".popup__input_type_url");
    var avatarForm = document.querySelector(".popup_type_avatar .popup__form");
    var avatarInput = avatarForm.querySelector(".popup__input_type_avatar");
    var userData;

    // Получение информации о пользователе и карточек с сервера
    Promise.all([getUserInfo(), getCards()]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        user = _ref2[0],
        cards = _ref2[1];
      userData = user;
      document.querySelector(".profile__title").textContent = userData.name;
      document.querySelector(".profile__description").textContent = userData.about;
      document.querySelector(".profile__image").src = userData.avatar;

      // Добавляем карточки на страницу
      cards.forEach(function (card) {
        var createdCard = createCard(card, userData._id, openImagePopup);
        placesList.append(createdCard);
      });
    })["catch"](function (err) {
      console.error(err);
    });

    // Функция открытия изображения
    function openImagePopup(name, link) {
      var popupImage = document.querySelector(".popup_type_image");
      var popupImageElement = popupImage.querySelector(".popup__image");
      var popupCaption = popupImage.querySelector(".popup__caption");
      popupImageElement.src = link;
      popupImageElement.alt = name;
      popupCaption.textContent = name;
      openModal(popupImage);
    }

    // Обработчик редактирования профиля
    profileForm.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var saveButton = profileForm.querySelector(".popup__button");
      var originalButtonText = saveButton.textContent; // Сохраняем исходный текст кнопки
      saveButton.textContent = "Сохранение..."; // Меняем текст на "Сохранение..."

      updateUserInfo(nameInput.value.trim(), jobInput.value.trim()).then(function (userData) {
        document.querySelector(".profile__title").textContent = userData.name;
        document.querySelector(".profile__description").textContent = userData.about;
        closeModal(document.querySelector(".popup_type_edit"));
      })["catch"](function (err) {
        console.error(err);
      })["finally"](function () {
        saveButton.textContent = originalButtonText; // Возвращаем исходный текст кнопки
      });
    });

    // Открытие попапа "Добавление карточки"
    addCardButton.addEventListener("click", function () {
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
      openModal(document.querySelector(".popup_type_new-card"));
    });

    // Обработчик отправки формы "Добавление карточки"
    newCardForm.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var saveButton = newCardForm.querySelector(".popup__button");
      var originalButtonText = saveButton.textContent; // Сохраняем исходный текст кнопки
      saveButton.textContent = "Сохранение..."; // Меняем текст на "Сохранение..."

      var name = placeNameInput.value.trim();
      var link = placeLinkInput.value.trim();
      addCard(name, link).then(function (card) {
        var newCard = createCard(card, userData._id, openImagePopup);
        placesList.prepend(newCard);
        newCardForm.reset();
        clearValidation(newCardForm, validationConfig);
        closeModal(document.querySelector(".popup_type_new-card"));
      })["catch"](function (err) {
        console.error(err);
      })["finally"](function () {
        saveButton.textContent = originalButtonText; // Возвращаем исходный текст кнопки
      });
    });

    // Открытие попапа "Редактирование профиля"
    editProfileButton.addEventListener("click", function () {
      nameInput.value = document.querySelector(".profile__title").textContent;
      jobInput.value = document.querySelector(".profile__description").textContent;
      clearValidation(profileForm, validationConfig);
      if (profileForm.checkValidity()) {
        profileForm.querySelector(".popup__button").classList.remove(validationConfig.inactiveButtonClass);
      } else {
        profileForm.querySelector(".popup__button").classList.add(validationConfig.inactiveButtonClass);
      }
      openModal(document.querySelector(".popup_type_edit"));
    });

    // Открытие попапа "Обновление аватара"
    profileAvatarContainer.addEventListener("click", function () {
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
      openModal(document.querySelector(".popup_type_avatar"));
    });

    // Обработчик отправки формы "Обновление аватара"
    avatarForm.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var saveButton = avatarForm.querySelector(".popup__button");
      var originalButtonText = saveButton.textContent; // Сохраняем исходный текст кнопки
      saveButton.textContent = "Сохранение..."; // Меняем текст на "Сохранение..."

      updateUserAvatar(avatarInput.value.trim()).then(function (userData) {
        document.querySelector(".profile__image").src = userData.avatar;
        closeModal(document.querySelector(".popup_type_avatar"));
      })["catch"](function (err) {
        console.error(err);
      })["finally"](function () {
        saveButton.textContent = originalButtonText; // Возвращаем исходный текст кнопки
      });
    });

    // Закрытие попапа по клику на крестик
    closeButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        closeModal(event.target.closest(".popup"));
      });
    });

    // Закрытие попапа по клику на оверлей
    document.querySelectorAll(".popup").forEach(function (popup) {
      popup.addEventListener("mousedown", closeModalOnOverlay);
    });

    // Обработчик формы подтверждения удаления карточки
    var confirmForm = document.querySelector(".popup_type_confirm .popup__form");
    if (confirmForm) {
      confirmForm.addEventListener("submit", function (evt) {
        evt.preventDefault();
        if (window.cardToDeleteId) {
          deleteCardFromServer(window.cardToDeleteId).then(function () {
            var cardElement = document.querySelector("[data-card-id=\"".concat(window.cardToDeleteId, "\"]"));
            if (cardElement) {
              cardElement.remove(); // Удаляем карточку из DOM
            }
            closeModal(document.querySelector(".popup_type_confirm")); // Закрываем попап
            window.cardToDeleteId = null; // Сбрасываем ID
          })["catch"](function (err) {
            console.error(err);
          });
        }
      });
    }
  });
}
/******/ })()
;