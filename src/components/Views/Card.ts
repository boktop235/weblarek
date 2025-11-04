import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number) {
        this._price.textContent = value + ' синапсов';
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        element.src = src;
        if (alt) {
            element.alt = alt;
        }
    }
}