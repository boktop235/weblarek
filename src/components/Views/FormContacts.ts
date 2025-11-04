import { Form } from './Form'; 
import { ensureElement } from '../../utils/utils'; 
import { IFormActions } from '../../types'; 
 
export class FormContacts extends Form<IFormActions> { 
    protected _email: HTMLInputElement; 
    protected _phone: HTMLInputElement; 
    protected _submitButton: HTMLButtonElement; 
 
    constructor(container: HTMLElement, actions: IFormActions, protected events: any) {
        super(container, actions); 
         
        this._email = ensureElement<HTMLInputElement>('input[name="email"]', container); 
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', container); 
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container); 
         
        this.setupEventListeners(); 
    } 
 
    set email(value: string) { 
        this._email.value = value; 
    } 
 
    set phone(value: string) { 
        this._phone.value = value; 
    } 
 
    set submitButtonDisabled(value: boolean) { 
        this._submitButton.disabled = value; 
    }

    // Реализация абстрактного метода из Form
    checkErrors(): boolean {
        return true;
    }

    // Реализация метода clearErrors из Form
    clearErrors(): void {
        this.clearFieldError(this._email);
        this.clearFieldError(this._phone);
    }

    // Метод для установки ошибки поля
    protected setFieldError(field: HTMLInputElement, error: string): void {
        field.classList.add('form__input_error');
        // Можно добавить отображение текста ошибки рядом с полем
        const errorElement = field.parentElement?.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = error;
        }
    }

    // Метод для очистки ошибки поля
    protected clearFieldError(field: HTMLInputElement): void {
        field.classList.remove('form__input_error');
        // Очистить текст ошибки
        const errorElement = field.parentElement?.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    setErrors(errors: { email?: string; phone?: string }): void {
        // Очищаем предыдущие ошибки
        this.clearErrors();
        
        // Устанавливаем новые ошибки
        if (errors.email) {
            this.setFieldError(this._email, errors.email);
        }
        if (errors.phone) {
            this.setFieldError(this._phone, errors.phone);
        }
    }

    protected setupEventListeners(): void { 
        super.setupEventListeners(); 
 
        if (this._email) { 
            this._email.addEventListener('input', () => { 
                this.events.emit('form:email-change', this._email.value);
            }); 
        } 
 
        if (this._phone) { 
            this._phone.addEventListener('input', () => { 
                this.events.emit('form:phone-change', this._phone.value);
            }); 
        } 
 
        // Обработчик отправки формы 
        if (this._submitButton) { 
            this._submitButton.addEventListener('click', (event) => { 
                event.preventDefault(); 
                if (this.actions.onSubmit) { 
                    this.actions.onSubmit(); 
                } 
            }); 
        } 
    } 
 
    render(data?: any): HTMLElement { 
        Object.assign(this as object, data ?? {}); 
        return this.container; 
    }
}