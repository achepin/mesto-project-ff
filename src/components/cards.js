export function createCard(
  { name, link },
  deleteCallback,
  likeCallback,
  imageClickCallback
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

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

export const initialCards = [
  {
    name: "Архыз",
    link: "https://psv4.userapi.com/s/v1/d/bAc-FFdSYKuucsn_C5NUPGehlFesLTsRmrdzQZAsm0T0Zmwvde-tQ7zsU4OMyab2B5U6LeEalbjW7hhLODSJZbxTdMZbImNyTZwIJmTBkU3QZcrCw1sylQ/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://psv4.userapi.com/s/v1/d/H27JWckz33wNeOUVpO7xnABymJqDJMsfbBmDBLe4IKY-7xElB-KJwLjMINLR4-8SU5SfyXwes16cCKQjS_MnmqEfRBtMJu9v2QhwS_8Cb2gLNpiNNcHLHg/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://psv4.userapi.com/s/v1/d/x-eVT9WgZhgeytC830YnDtqhso5zEhqW1HoGTlXKEzGHx7AZHZuxyZSEigsJk1bk9CVpSUAbyYPyKZvC7YSDjrOyMBZD2LWW0Bt8njZ_VZ4qwNE08ZJPMQ/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://psv4.userapi.com/s/v1/d/3pxIfSPeWhhXHbksi4Bz3iZexRfPgMMhFIM1dkRGIwJSre0eUZuF-2eV-DOsHnRTAW1r1kdk94Un8EkqQsFPZECmypBPaL7Cz-cBrLZ6EhI8GP0sd3rfgg/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://psv4.userapi.com/s/v1/d/gAPHug7jR_xuuTSKTLjgQCHsBmWg_KyWDyBCELbGHVdGq-mXNDyJvM57u2a4rBHQ3ndQI6AfqK8w-aKgujJ950-D-cRWWhT2_URG-HAwkQKgp3BA6sLWuQ/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://psv4.userapi.com/s/v1/d/WDKRqOoFzOD0e_pyNcZAGg08UlN9WfTfrd9ziOxq7L8RLvCPBcDPyV5UNcLXRyxUcDCsu3KqbLH3_oEDVySkvMKn7F3UoKgZJSpiVILpTkkn1fyLbIZfgw/baikal.jpg",
  },
];
