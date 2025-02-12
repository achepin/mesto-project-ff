export function createCard({ name, link }, deleteCallback, likeCallback, imageClickCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = link;
  cardImage.alt = name;
  cardImage.addEventListener("click", () => imageClickCallback(name, link));

  cardElement.querySelector(".card__title").textContent = name;

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", likeCallback);

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", deleteCallback);

  return cardElement;
}

export function toggleLike(event) {
  event.preventDefault();
  event.target.classList.toggle("card__like-button_is-active");
}

export function deleteCard(event) {
  const card = event.target.closest(".places__item");
  if (card) {
    card.remove();
  }
}