'use strict'

export default class AdWorker {
    amountAdPosts = 0;
    #workingProcess;
    #selectorToShow;

    get isStopped() {
        return !this.#workingProcess;
    }

    startWorking(typeWorker) {
        this.#selectorToShow =`span[id] > ${ typeWorker === "adFinder" ? "" : "span" } a[tabindex='0'] > span`;
        this.#delPostBySelector();
        if (this.isStopped)
            this.#workingProcess = setInterval(this.#checkIfWasLoading.bind(this), 200);
    }

    stopWorking() {
        clearInterval(this.#workingProcess);
        this.#workingProcess = null;
    }

    #checkIfWasLoading() {
        if (AdWorker.#allPosts().length > this.amountAdPosts)
            this.#delPostBySelector();
    }

    static #allPosts() {
        return document.querySelectorAll("div[data-pagelet^=FeedUnit_]");
    }

    #delPostBySelector() {
        AdWorker.#allPosts().forEach(e =>
            e.querySelector(this.#selectorToShow) || e.parentNode.removeChild(e)
        );
        this.amountAdPosts = AdWorker.#allPosts().length;
    }
}