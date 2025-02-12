import "../pages/index.css";
import { initialCards } from "../components/cards.js";
import { createCard, toggleLike, deleteCard } from "../components/card.js";
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

const profileForm = document.querySelector(".popup_type_edit .popup__form");
const nameInput = profileForm.querySelector(".popup__input_type_name");
const jobInput = profileForm.querySelector(".popup__input_type_description");

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
function profileEditingHandler(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value.trim();
  profileDescription.textContent = jobInput.value.trim();

  closeModal(document.querySelector(".popup_type_edit"));
}

profileForm.addEventListener("submit", profileEditingHandler);

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

  const name = placeNameInput.value.trim();
  const link = placeLinkInput.value.trim();

  if (name && link) {
    const newCard = createCard(
      { name, link },
      deleteCard,
      toggleLike,
      openImagePopup
    );
    placesList.prepend(newCard);
  }

  newCardForm.reset();
  closeModal(document.querySelector(".popup_type_new-card"));
}

newCardForm.addEventListener("submit", handleNewCardSubmit);

editProfileButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(document.querySelector(".popup_type_edit"));
});