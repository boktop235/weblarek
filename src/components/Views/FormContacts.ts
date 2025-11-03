import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IFormActions } from '../../types';

export class FormContacts extends Form<IFormActions> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: IFormActions, protected events: any) { // добавили events
        super(container, actions);
        
        this._email = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        
        this.setupEventListeners();
    }

    set email(value: string) {
        this._email.value = value;
        this.events.emit('form:email-change', value); // эмитим событие
        this.checkErrors();
    }

    set phone(value: string) {
        this._phone.value = value;
        this.events.emit('form:phone-change', value); // эмитим событие
        this.checkErrors();
    }

    set submitButtonDisabled(value: boolean) {
        this._submitButton.disabled = value;
    }

    isContactsValid(): boolean {
        const emailValid = this.validateEmail(this._email.value);
        const phoneValid = this.validatePhone(this._phone.value);
        return emailValid && phoneValid;
    }

    checkErrors(): boolean {
        const hasErrors = !this.isContactsValid();
        this.submitButtonDisabled = hasErrors;
        return !hasErrors;
    }

    private validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private validatePhone(phone: string): boolean {
        return /^\+?[\d\s\-\(\)]{10,}$/.test(phone);
    }

    protected setupEventListeners(): void {
        super.setupEventListeners();

        if (this._email) {
            this._email.addEventListener('input', () => {
                this.events.emit('form:email-change', this._email.value); // эмитим при вводе
                this.checkErrors();
            });
        }

        if (this._phone) {
            this._phone.addEventListener('input', () => {
                this.events.emit('form:phone-change', this._phone.value); // эмитим при вводе
                this.checkErrors();
            });
        }

        // Обработчик отправки формы
        if (this._submitButton) {
            this._submitButton.addEventListener('click', (event) => {
                event.preventDefault();
                if (this.isContactsValid() && this.actions.onSubmit) {
                    this.actions.onSubmit();
                }
            });
        }
    }

    render(data?: any): HTMLElement {
        Object.assign(this as object, data ?? {});
        this.checkErrors();
        return this.container;
    }
}