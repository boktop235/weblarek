import { Form } from './Form';
import { ensureElement } from '../../utils/utils';

export class FormOrder extends Form<any> {
    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: any, protected events: any) {
        super(container, actions);
        
        // Исправленные селекторы
        this._paymentCard = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        
        this.setupEventListeners();
    }

    selectPayment(payment: string): void {
        if (payment === 'card') {
            this._paymentCard.classList.add('button_alt-active');
            this._paymentCash.classList.remove('button_alt-active');
        } else {
            this._paymentCash.classList.add('button_alt-active');
            this._paymentCard.classList.remove('button_alt-active');
        }
        this.events.emit('form:payment-change', payment);
        this.checkErrors();
    }

    set payment(value: string) {
        this.selectPayment(value);
    }

    set address(value: string) {
        this._addressInput.value = value;
        this.events.emit('form:address-change', value);
        this.checkErrors();
    }

    set submitButtonDisabled(value: boolean) {
        this._submitButton.disabled = value;
    }

    isAddressValid(): boolean {
        return this._addressInput.value.trim().length > 0;
    }

    checkErrors(): boolean {
        const hasErrors = !this.isAddressValid();
        this.submitButtonDisabled = hasErrors;
        return !hasErrors;
    }

    protected setupEventListeners(): void {
        super.setupEventListeners();

        if (this._paymentCard) {
            this._paymentCard.addEventListener('click', () => {
                this.selectPayment('card');
            });
        }

        if (this._paymentCash) {
            this._paymentCash.addEventListener('click', () => {
                this.selectPayment('cash');
            });
        }

        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => {
                this.events.emit('form:address-change', this._addressInput.value);
                this.checkErrors();
            });
        }

        // Обработчик отправки формы
        if (this._submitButton) {
            this._submitButton.addEventListener('click', (event) => {
                event.preventDefault();
                if (this.isAddressValid() && this.actions.onSubmit) {
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