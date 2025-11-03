import { ensureElement } from "../../utils/utils";

export class Gallery {
    private catalogElement: HTMLElement;

    constructor(private container: HTMLElement) {
        // Просто используем переданный контейнер, так как он УЖЕ является .gallery
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