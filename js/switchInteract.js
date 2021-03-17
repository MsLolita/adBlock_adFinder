'use strict'

import * as html from './elements.js'

class SwitchInteract {
	fixPosition(textPosition) {
		const sliderPosition = html[textPosition + 'Slider'],
			sliderPositionText = html[textPosition + 'Text'],
			backgroundColor = {
				'adFinder': '#44b3f0',
				'off': '#333',
				'adBlock': '#E50D0D'
			};

		SwitchInteract.#deleteAllHighlight();

		chrome.storage.local.set({ textPosition });

		sliderPosition.checked = true;
		sliderPositionText.style.background = backgroundColor[textPosition];

		this.#sendPositionToWorker(textPosition);
	}

	static #deleteAllHighlight() {
		html.switchPosition.forEach(positionText => positionText.style.background = 'none');
	}

	#sendPositionToWorker(textPosition) {
		chrome.tabs.query({currentWindow: true, active: true},
			([activeTab]) => chrome.tabs.sendMessage(activeTab.id, textPosition)
		);
	}

	restorePositionOnEntering () {
		chrome.storage.local.get('textPosition', ({ textPosition }) => this.fixPosition(textPosition));
	}

	checkChangeSwitch() {
		html.switchSlider.forEach(sliderPosition =>
			sliderPosition.addEventListener('change', e => this.fixPosition(e.path[0].value), false)
		);
	}

	checkClickSwitch() {
		html.switchPosition.forEach(textPosition =>
			textPosition.addEventListener('click', e => this.fixPosition(e.path[0].innerText), false)
		);
	}
}

const openPopup = new SwitchInteract();

openPopup.restorePositionOnEntering();

openPopup.checkClickSwitch();

openPopup.checkChangeSwitch();

