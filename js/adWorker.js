'use strict'

export default class AdWorker {
    amountAdPosts = 0;
    #workingProcess;
    #selectorToShow;

    get isRunning() {
        return !!this.#workingProcess;
    }

    startWorker(typeWorker) {
        this.#selectorToShow =`span[id] > ${ typeWorker === "adFinder" ? "" : "span" } a[tabindex='0'] > span`;
        if (!this.isRunning)
            this.#workingProcess = setInterval(this.#checkIfWasLoading.bind(this), 200);
    }

    stopWorking() {
        clearInterval(this.#workingProcess);
        this.#workingProcess = null;
    }

    #checkIfWasLoading() {
        if (AdWorker.#allPosts().length > this.amountAdPosts) {
            this.#delPosts();
            this.amountAdPosts = AdWorker.#allPosts().length;
        }
    }

    static #allPosts() {
        return document.querySelectorAll("div[data-pagelet^=FeedUnit_]");
    }

    #delPosts() {
        AdWorker.#allPosts().forEach(e =>
            e.querySelector(this.#selectorToShow) || e.parentNode.removeChild(e)
        );
    }
}