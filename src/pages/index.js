import './index.css';
import {
	changeAvatarButton,
	editButton,
	addButton,
	elements,
	popupEditAvatar,
	avatarFormElement,
	avatarChangeSubmit,
	popupEditProfile,
	inputName,
	inputProfession,
	popupAddElement,
	addFormElement,
	openPopupPhotoFullscreen,
	photoFullscreenTitle,
	object,
	createButton,
	saveButton
} from '../js/utils/constants.js';
import Api from '../js/components/Api.js';
import Card from '../js/components/Card.js';
import Section from '../js/components/Section.js';
import PopupWithImage from '../js/components/PopupWithImage.js';
import PopupWithForm from '../js/components/PopupWithForm.js';
import ApproveDelete from '../js/components/ApproveDelete.js';
import UserInfo from '../js/components/UserInfo.js';
import FormValidator from '../js/components/FormValidator.js';

//Создается и вызывается валидация форм
const addFormValidator = new FormValidator(object, popupAddElement);
const editFormValidator = new FormValidator(object, popupEditProfile);
const avatarFormValidator = new FormValidator(object, popupEditAvatar);
const popupApprove = new ApproveDelete('.popup_type_delete-card');
const photoFullscreen = new PopupWithImage('.popup_type_photo-fullscreen', openPopupPhotoFullscreen, photoFullscreenTitle);
addFormValidator.enableValidation();
editFormValidator.enableValidation();
avatarFormValidator.enableValidation();
popupApprove.setEventListeners();
photoFullscreen.setEventListeners();

const api = new Api({
	url: 'https://mesto.nomoreparties.co/v1/cohort-16',
	headers: {
		authorization: '2898ad1c-4456-4857-a6ce-22f1f08bf45a',
		'Content-Type': 'application/json'
	}
})

api.getAppInfo()
.then((infoFromServer) => {

	//Профиль
	const userInfo = new UserInfo({
		profileName: '.profile__name',
		profession: '.profile__profession',
		avatar: '.profile__avatar-image'
	});

	//Аватар
	const popupChangeAvatar = new PopupWithForm({
		submitForm: (inputValues) => {
			popupChangeAvatar.actionBtn('Сохранение...');

			api.patchAvatarInfo(inputValues)
			.then((newAvatr) => {
				userInfo.setUserAvatar(newAvatr.avatar)
			})
			.then(() => popupChangeAvatar.close())
			.catch((err) => console.log(err))
			.finally(() => popupChangeAvatar.actionBtn('Сохранить'));
		}
	}, '.popup_type_edit-avatar');

	changeAvatarButton.addEventListener('click', () => {
		popupChangeAvatar.open();
		avatarFormElement.reset();
		avatarFormValidator.buttonStateDisabled(avatarChangeSubmit);
		avatarFormValidator.errorReset();
	});

	popupChangeAvatar.setEventListeners();
	//Конец Аватар

	//Информация о пользователе
	const editProfile = new PopupWithForm({
		submitForm: (inputValues) => {
			editProfile.actionBtn('Сохранение...');

			api.patchUserInfo(inputValues)
			.then((newUserInfo) => {
				userInfo.setUserInfo(newUserInfo.name, newUserInfo.about);
			})
			.then(() => editProfile.close())
			.catch((err) => console.log(err))
			.finally(() => editProfile.actionBtn('Сохранить'));
		}
	}, '.popup_type_edit-profile');

	editButton.addEventListener('click', () => {
		editFormValidator.buttonStateActive(saveButton);
		editFormValidator.errorReset();

		const userInputState = userInfo.getUserInfo();
		inputName.value = userInputState.name;
		inputProfession.value = userInputState.job;
		editProfile.open();
	});

	editProfile.setEventListeners();
	//Конец информация о пользователе
	//Конец Профиль

	//Получение данных с сервера
	const [userData, cardsData] = infoFromServer;
	userInfo.setUserInfo(userData.name, userData.about);
	userInfo.setUserAvatar(userData.avatar);

	//Создание карточки
	const cardItem = new Section({
		items: cardsData.reverse(),
		renderer: item => addCard(item)
	}, '.elements');
	cardItem.renderItems();

	function addCard(item) {
		const card = new Card({
			data: item,
			user: userData,
			handleCardClick: (cardInfo) => {
				photoFullscreen.open(cardInfo);
			},
			handleCardClickDelete: (cardId) => {
				popupApprove.setSubmitAction(() => {
					popupApprove.actionBtn('Удаление...');
					api.deleteCard(cardId)
					.then(() => card.elementDelete())
					.then(() => {
						popupApprove.actionBtn('Да');
						popupApprove.close();
					})
					.catch((err) => console.log(err))
				}),
				popupApprove.open();
			},
			handleCardLikeClick: (cardId) => {
				api.likeCard(cardId)
				.then(updateLike => {
					card.updateLike(updateLike);
				})
				.catch((err) => console.log(err))
			},
			handleCardDislikeClick: (cardId) => {
				api.dislikeCard(cardId)
				.then(updateLike => {
					card.updateLike(updateLike);
				})
				.catch((err) => console.log(err))
			}
		}, '.element-template');
		const addElement = card.generateCard();
		cardItem.addItem(addElement);
	}
	//Конец создание карточки

	//Popup добавления карточки
	const popupAddCard = new PopupWithForm({
		submitForm: (inputValues) => {
			popupAddCard.actionBtn('Создаётся...');

			api.postCardInfo(inputValues)
			.then((newCard) => {
				cardItem.renderAddCard(newCard)
			})
			.then(() => popupAddCard.close())
			.catch((err) => console.log(err))
			.finally(() => popupAddCard.actionBtn('Создать'));
		}
	}, '.popup_type_add-element');

	addButton.addEventListener('click', () => {
		popupAddCard.open();
		addFormElement.reset();
		addFormValidator.buttonStateDisabled(createButton);
		addFormValidator.errorReset();
	});
	popupAddCard.setEventListeners();
	//Конец popup добавления карточки
})
.catch((err) => console.log(err))