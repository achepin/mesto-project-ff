// Получаем HTML-шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;

// Функция для создания карточки
function createCard({ name, link }, deleteCallback) {
 // Клонируем HTML-шаблон карточки
 const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

 // Устанавливаем значения вложенных элементов
 cardElement.querySelector(".card__title").textContent = name;
 cardElement.querySelector(".card__image").src = link;
 cardElement.setAttribute("alt", name);

 // Добавляем обработчик клика на кнопку удаления
 const deleteButton = cardElement.querySelector(".card__delete-button");
 deleteButton.addEventListener("click", deleteCallback);

 // Возвращаем готовую карточку
 return cardElement;
}

// Функция для удаления карточки
function deleteCard(event) {
  const card = event.target.closest(".places__item");
  if (card) {
    card.remove();
  }
}

// Получаем элемент списка для вставки карточек
const placesList = document.querySelector(".places__list");

// Проходим по массиву initialCards и создаем карточки
initialCards.forEach((card) => {
 const createdCard = createCard(card, deleteCard);
 placesList.append(createdCard);
});