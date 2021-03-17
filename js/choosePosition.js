'use strict';

class ChooseWorkerByPosition {
    #currentWorker;

    constructor() {
        this.#startUpWorker();
    }

    async #startUpWorker() {
        const srcAdWorker = chrome.extension.getURL('js/adWorker.js');
        const { default: AdWorker } = await import(srcAdWorker);

        this.#currentWorker = new AdWorker();
        chrome.storage.local.get('textPosition', ({ textPosition }) => this.chooseAction(textPosition));
    }

    chooseAction(textPosition) {
        switch (textPosition) {
            case 'adFinder':
            case 'adBlock':
                this.#currentWorker.startWorker(textPosition);
                break;
            case 'off':
                this.#currentWorker.stopWorking();
                break;
        }
    }

    checkAction() {
        chrome.runtime.onMessage.addListener(textPosition => this.chooseAction(textPosition));
    }
}

const newWorker = new ChooseWorkerByPosition();

newWorker.checkAction();