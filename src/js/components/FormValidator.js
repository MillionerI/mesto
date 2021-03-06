export default class FormValidator {
	constructor (object, formElement) {
		this._formElement = formElement;
		this._formSelector = object.formSelector,
		this._inputSelector = object.inputSelector,
		this._inputErrorClass = object.inputErrorClass,
		this._submitButtonSelector = object.submitButtonSelector,
		this._inactiveButtonClass = object.inactiveButtonClass,
		this._errorClass = object.errorClass
	};

	_showInputError (inputElement, errorMessage) {
		const errorElement = this._formElement.querySelector(`#${inputElement.id}-error`);
		inputElement.classList.add(this._inputErrorClass);
		errorElement.textContent = errorMessage;
		errorElement.classList.add(this._errorClass);
	};

	_hideInputError(inputElement) {
		const errorElement = this._formElement.querySelector(`#${inputElement.id}-error`);
		inputElement.classList.remove(this._inputErrorClass);
		errorElement.classList.remove(this._errorClass);
		errorElement.textContent = '';
	};

	_checkInputValidity(inputElement) {
		if(!inputElement.validity.valid) {
			this._showInputError(inputElement, inputElement.validationMessage);
		} else {
			this._hideInputError(inputElement);
		}
	};

	_hasInvalidInput(inputList) {
		return inputList.some((inputElement) => {
			return !inputElement.validity.valid;
		})
	};

	_toggleButtonState(inputList, buttonElement) {
		if (this._hasInvalidInput(inputList)) {
			this.buttonStateDisabled(buttonElement);
		} else {
			this.buttonStateActive(buttonElement);
		}
	};

	buttonStateActive(buttonElement) {
		buttonElement.classList.remove(this._inactiveButtonClass);
		buttonElement.disabled = false;
	};

	buttonStateDisabled(buttonElement) {
		buttonElement.classList.add(this._inactiveButtonClass);
		buttonElement.disabled = true;
	};

	_setEventListeners() {
		const inputList = Array.from(this._formElement.querySelectorAll(this._inputSelector));
		const buttonElement = this._formElement.querySelector(this._submitButtonSelector);
		this._toggleButtonState(inputList, buttonElement);
		inputList.forEach((inputElement) => {
			inputElement.addEventListener('input', () => {
				this._checkInputValidity(inputElement);
				this._toggleButtonState(inputList, buttonElement);
			});
		});
	};

	enableValidation() {
		this._formElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
		});
		this._setEventListeners();
	};

	errorReset() {
		const errorInput = Array.from(this._formElement.querySelectorAll(this._inputSelector));
		errorInput.forEach((errorInputElement) => {
			this._hideInputError(errorInputElement);
		});
	};
}