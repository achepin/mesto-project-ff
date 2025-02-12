import "../pages/index.css";
import { initialCards } from "../components/cards.js";
import { createCard, toggleLike, deleteCard } from "../components/cards.js";
import {
  openModal,
  closeModal,
  closeModalOnOverlay,
} from "../components/modal.js";

// Переменные
const placesList = document.querySelector(".places__list");

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

const formElement = document.querySelector(".popup_type_edit .popup__form");
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

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

// Добавляем карточки на страницу
if (Array.isArray(initialCards)) {
  initialCards.forEach((card) => {
    const createdCard = createCard(
      card,
      deleteCard,
      toggleLike,
      openImagePopup
    );
    placesList.append(createdCard);
  });
} else {
  console.error("Ошибка: initialCards не является массивом.");
}

// Обработчик редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(document.querySelector(".popup_type_edit"));
}

formElement.addEventListener("submit", handleFormSubmit);

// Добавляем обработчики на кнопки открытия попапов
editProfileButton.addEventListener("click", () =>
  openModal(document.querySelector(".popup_type_edit"))
);
addCardButton.addEventListener("click", () =>
  openModal(document.querySelector(".popup_type_new-card"))
);

// Закрытие попапа по клику на крестик
closeButtons.forEach((button) => {
  button.addEventListener("click", (event) =>
    closeModal(event.target.closest(".popup"))
  );
});

// Закрытие попапа по клику на оверлей
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", closeModalOnOverlay);
});

// --- ДОБАВЛЕНИЕ КАРТОЧКИ ---
const newCardForm = document.querySelector(".popup_type_new-card .popup__form");
const placeNameInput = newCardForm.querySelector(
  ".popup__input_type_card-name"
);
const placeLinkInput = newCardForm.querySelector(".popup__input_type_url");

function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  const newCard = createCard(
    { name, link },
    deleteCard,
    toggleLike,
    openImagePopup
  );
  placesList.prepend(newCard);

  newCardForm.reset();
  closeModal(document.querySelector(".popup_type_new-card"));
}

newCardForm.addEventListener("submit", handleNewCardSubmit);
