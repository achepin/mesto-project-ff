import "../pages/index.css";
import { createCard } from "../components/card.js";
import {
  openModal,
  closeModal,
  closeModalOnOverlay,
} from "../components/modal.js";
import { enableValidation, clearValidation } from "../components/validation.js";
import {
  getUserInfo,
  getCards,
  addCard,
  updateUserInfo,
  updateUserAvatar,
  deleteCardFromServer,
} from "../components/api.js";

// Настройки валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__save-button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_visible",
};

// Включение валидации
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    enableValidation(validationConfig);

    // Переменные
    const placesList = document.querySelector(".places__list");
    const editProfileButton = document.querySelector(".profile__edit-button");
    const addCardButton = document.querySelector(".profile__add-button");
    const profileAvatarContainer = document.querySelector(
      ".profile__avatar-container"
    );
    const closeButtons = document.querySelectorAll(".popup__close");

    const profileForm = document.querySelector(".popup_type_edit .popup__form");
    const nameInput = profileForm.querySelector(".popup__input_type_name");
    const jobInput = profileForm.querySelector(
      ".popup__input_type_description"
    );

    const newCardForm = document.querySelector(
      ".popup_type_new-card .popup__form"
    );
    const placeNameInput = newCardForm.querySelector(
      ".popup__input_type_card-name"
    );
    const placeLinkInput = newCardForm.querySelector(".popup__input_type_url");

    const avatarForm = document.querySelector(
      ".popup_type_avatar .popup__form"
    );
    const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");

    let userData;

    // Получение информации о пользователе и карточек с сервера
    Promise.all([getUserInfo(), getCards()])
      .then(([user, cards]) => {
        userData = user;
        document.querySelector(".profile__title").textContent = userData.name;
        document.querySelector(".profile__description").textContent =
          userData.about;
        document.querySelector(".profile__image").src = userData.avatar;

        // Добавляем карточки на страницу
        cards.forEach((card) => {
          const createdCard = createCard(card, userData._id, openImagePopup);
          placesList.append(createdCard);
        });
      })
      .catch((err) => {
        console.error(err);
      });

    // Функция открытия изображения
    function openImagePopup(name, link) {
      const popupImage = document.querySelector(".popup_type_image");
      const popupImageElement = popupImage.querySelector(".popup__image");
      const popupCaption = popupImage.querySelector(".popup__caption");
      popupImageElement.src = link;
      popupImageElement.alt = name;
      popupCaption.textContent = name;
      openModal(popupImage);
    }

    // Обработчик редактирования профиля
    profileForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const saveButton = profileForm.querySelector(".popup__button");
      const originalButtonText = saveButton.textContent; // Сохраняем исходный текст кнопки
      saveButton.textContent = "Сохранение..."; // Меняем текст на "Сохранение..."

      updateUserInfo(nameInput.value.trim(), jobInput.value.trim())
        .then((userData) => {
          document.querySelector(".profile__title").textContent = userData.name;
          document.querySelector(".profile__description").textContent =
            userData.about;
          closeModal(document.querySelector(".popup_type_edit"));
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          saveButton.textContent = originalButtonText; // Возвращаем исходный текст кнопки
        });
    });

    // Открытие попапа "Добавление карточки"
    addCardButton.addEventListener("click", () => {
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
      openModal(document.querySelector(".popup_type_new-card"));
    });

    // Обработчик отправки формы "Добавление карточки"
    newCardForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const saveButton = newCardForm.querySelector(".popup__button");
      const originalButtonText = saveButton.textContent; // Сохраняем исходный текст кнопки
      saveButton.textContent = "Сохранение..."; // Меняем текст на "Сохранение..."

      const name = placeNameInput.value.trim();
      const link = placeLinkInput.value.trim();

      addCard(name, link)
        .then((card) => {
          const newCard = createCard(card, userData._id, openImagePopup);
          placesList.prepend(newCard);
          newCardForm.reset();
          clearValidation(newCardForm, validationConfig);
          closeModal(document.querySelector(".popup_type_new-card"));
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          saveButton.textContent = originalButtonText; // Возвращаем исходный текст кнопки
        });
    });

    // Открытие попапа "Редактирование профиля"
    editProfileButton.addEventListener("click", () => {
      nameInput.value = document.querySelector(".profile__title").textContent;
      jobInput.value = document.querySelector(
        ".profile__description"
      ).textContent;

      clearValidation(profileForm, validationConfig);

      if (profileForm.checkValidity()) {
        profileForm
          .querySelector(".popup__button")
          .classList.remove(validationConfig.inactiveButtonClass);
      } else {
        profileForm
          .querySelector(".popup__button")
          .classList.add(validationConfig.inactiveButtonClass);
      }

      openModal(document.querySelector(".popup_type_edit"));
    });

    // Открытие попапа "Обновление аватара"
    profileAvatarContainer.addEventListener("click", () => {
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
      openModal(document.querySelector(".popup_type_avatar"));
    });

    // Обработчик отправки формы "Обновление аватара"
    avatarForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const saveButton = avatarForm.querySelector(".popup__button");
      const originalButtonText = saveButton.textContent; // Сохраняем исходный текст кнопки
      saveButton.textContent = "Сохранение..."; // Меняем текст на "Сохранение..."

      updateUserAvatar(avatarInput.value.trim())
        .then((userData) => {
          document.querySelector(".profile__image").src = userData.avatar;
          closeModal(document.querySelector(".popup_type_avatar"));
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          saveButton.textContent = originalButtonText; // Возвращаем исходный текст кнопки
        });
    });

    // Закрытие попапа по клику на крестик
    closeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        closeModal(event.target.closest(".popup"));
      });
    });

    // Закрытие попапа по клику на оверлей
    document.querySelectorAll(".popup").forEach((popup) => {
      popup.addEventListener("mousedown", closeModalOnOverlay);
    });

    // Обработчик формы подтверждения удаления карточки
    const confirmForm = document.querySelector(
      ".popup_type_confirm .popup__form"
    );
    if (confirmForm) {
      confirmForm.addEventListener("submit", (evt) => {
        evt.preventDefault();

        if (window.cardToDeleteId) {
          deleteCardFromServer(window.cardToDeleteId)
            .then(() => {
              const cardElement = document.querySelector(
                `[data-card-id="${window.cardToDeleteId}"]`
              );
              if (cardElement) {
                cardElement.remove(); // Удаляем карточку из DOM
              }
              closeModal(document.querySelector(".popup_type_confirm")); // Закрываем попап
              window.cardToDeleteId = null; // Сбрасываем ID
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    }
  });
}
