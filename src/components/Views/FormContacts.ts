import { Form } from './Form'; 
import { ensureElement } from '../../utils/utils'; 
import { IFormContactsActions } from '../../types'; 
 
export class FormContacts extends Form<IFormContactsActions> { 
    protected _email: HTMLInputElement; 
    protected _phone: HTMLInputElement; 
    protected _submitButton: HTMLButtonElement; 
 
    constructor(container: HTMLElement, actions: IFormContactsActions, protected events: any) {
        super(container, actions); 
         
        this._email = ensureElement<HTMLInputElement>('input[name="email"]', container); 
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', container); 
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container); 
         
        this.setupEventListeners(); 
    } 
 
    set email(value: string) { 
        this._email.value = value; 
        this.enableSubmitButton();
    } 
 
    set phone(value: string) { 
        this._phone.value = value; 
        this.enableSubmitButton();
    } 
 
    set submitButtonDisabled(value: boolean) { 
        this._submitButton.disabled = value; 
    }

    enableSubmitButton(): void {
        const isEmailFilled = this._email.value.trim() !== '';
        const isPhoneFilled = this._phone.value.trim() !== '';
        
        this.submitButtonDisabled = !(isEmailFilled && isPhoneFilled);
    }

    isContactsValid(errors: { email?: string; phone?: string }): void {
        this.setErrors(errors);
        this.enableSubmitButton();
    }

    checkErrors(): boolean {
        return true;
    }

    
    clearErrors(): void {
        this.clearFieldError(this._email);
        this.clearFieldError(this._phone);
    }

    protected setFieldError(field: HTMLInputElement, error: string): void {
        field.classList.add('form__input_error');
        const errorElement = field.parentElement?.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = error;
        }
    }

    protected clearFieldError(field: HTMLInputElement): void {
        field.classList.remove('form__input_error');
        const errorElement = field.parentElement?.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    setErrors(errors: { email?: string; phone?: string }): void {
        this.clearErrors();
        
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
                this.enableSubmitButton();
                if (this.actions.onEmailInput) {
                    this.actions.onEmailInput(this._email.value);
                }
            }); 
        } 
 
        if (this._phone) { 
            this._phone.addEventListener('input', () => { 
                this.enableSubmitButton();
                if (this.actions.onPhoneInput) {
                    this.actions.onPhoneInput(this._phone.value);
                }
            }); 
        } 
 
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
        this.enableSubmitButton();
        return this.container; 
    }
}