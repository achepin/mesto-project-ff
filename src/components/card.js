export function createCard(cardData, userId, openImagePopup, handleLike, handleDelete) {
  // Клонируем шаблон карточки
  const cardElement = document
    .querySelector('#card-template')
    .content.querySelector('.card')
    .cloneNode(true);

  // Находим элементы карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardLikeCount = cardElement.querySelector('.card__like-count');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');

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
  if (cardData.likes.some((like) => like._id === userId)) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  // Обработчик удаления карточки
  cardDeleteButton.addEventListener('click', () => {
    handleDelete(cardData._id);
  });

  // Обработчик лайка карточки
  cardLikeButton.addEventListener('click', () => {
    handleLike(cardData, cardLikeButton, (updatedCard) => {
      cardLikeCount.textContent = updatedCard.likes.length;
      cardLikeButton.classList.toggle('card__like-button_is-active');
    });
  });

  // Обработчик открытия изображения
  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.name, cardData.link);
  });

  return cardElement;
}