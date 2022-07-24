import { createElement } from '../helpers/domHelper.mjs';

const showInputModal = ({ title, onChange = () => {}, onSubmit = () => {} }) => {
	const rootElement = document.querySelector('#root');

	const modalElement = createModalElement(title);

	const submitButton = createElement({
		tagName: 'button',
		className: 'submit-btn',
		innerElements: ['Submit'],
	});
	const inputElement = createElement({
		tagName: 'input',
		className: 'modal-input',
	});

	modalElement.append(getFooter([inputElement, submitButton]));
	rootElement.append(modalElement);

	submitButton.addEventListener('click', () => {
		modalElement.remove();
		onSubmit();
	});
	inputElement.addEventListener('change', e => onChange(e.target.value));
};

const showMessageModal = ({ message, onClose = () => {} }) => {
	const rootElement = document.querySelector('#root');

	const modalElement = createModalElement(message);

	const closeButton = createElement({
		tagName: 'button',
		className: 'submit-btn',
		innerElements: ['Close'],
	});

	modalElement.append(getFooter([closeButton]));
	rootElement.append(modalElement);

	closeButton.addEventListener('click', () => {
		modalElement.remove();
		onClose();
	});
};

const createModalElement = title => {
	const titleElement = createElement({
		tagName: 'h1',
		className: 'title',
		innerElements: [title],
	});

	const modal = createElement({
		tagName: 'div',
		className: 'modal',
		innerElements: [titleElement],
	});

	return modal;
};

const getFooter = children => {
	return createElement({
		tagName: 'div',
		className: 'inputs-wrapper',
		innerElements: children,
	});
};

export { showInputModal, showMessageModal };
