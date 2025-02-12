export function openModal(popup) {
  if (popup.classList.contains("popup_type_edit")) {
    const nameInput = popup.querySelector(".popup__input_type_name");
    const jobInput = popup.querySelector(".popup__input_type_description");

    const profileTitle = document.querySelector(".profile__title");
    const profileDescription = document.querySelector(".profile__description");

    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
  }

  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeModalOnEsc);
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeModalOnEsc); // Удаляем обработчик при закрытии
}

function closeModalOnEsc(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

export function closeModalOnOverlay(event) {
  if (event.target.classList.contains("popup")) {
    closeModal(event.target);
  }
}
