import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected _errors: HTMLElement;
    protected _submit: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions: any) {
        super(container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);
        this._submit = ensureElement<HTMLButtonElement>('.button', container);
        this.setupEventListeners();
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    set submitButtonDisabled(value: boolean) {
        this._submit.disabled = value;
    }

    removeErrors(): void {
        this._errors.textContent = '';
    }

    protected setupEventListeners(): void {
        this._submit.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this._submit.disabled && this.actions.onSubmit) {
                this.actions.onSubmit();
            }
        });
    }

    abstract checkErrors(): boolean;
}