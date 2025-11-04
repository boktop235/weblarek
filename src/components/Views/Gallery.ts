import { ensureElement } from "../../utils/utils";

export class Gallery {
    private catalogElement: HTMLElement;

    constructor(private container: HTMLElement) {
        this.catalogElement = container;
    }

    set catalog(items: HTMLElement[]) {
        if (this.catalogElement && items) {
            this.catalogElement.innerHTML = '';
            items.forEach(item => {
                if (item) {
                    this.catalogElement.appendChild(item);
                }
            });
        }
    }
}