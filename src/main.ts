import './scss/styles.scss'; 
import { ProductList } from './components/Models/ProductList'; 
import { Cart } from './components/Models/Cart'; 
import { Buyer } from './components/Models/Buyer'; 
import { ApiCommunication } from './components/Communication/ApiCommunication'; 
import { Api } from './components/base/Api'; 
import { API_URL, CDN_URL } from './utils/constants'; 
import { EventEmitter } from './components/base/Events'; 
import { ensureElement, cloneTemplate } from './utils/utils'; 
import { Gallery } from './components/Views/Gallery'; 
import { Header } from './components/Views/Header'; 
import { CardCatalog } from './components/Views/CardCatalog'; 
import { CardPreview } from './components/Views/CardPreview'; 
import { Basket } from './components/Views/Basket'; 
import { CardBasket } from './components/Views/CardBasket'; 
import { FormOrder } from './components/Views/FormOrder'; 
import { FormContacts } from './components/Views/FormContacts'; 
import { Success } from './components/Views/Success'; 
import { Modal } from './components/Views/Modal'; 
import { IOrder, IOrderResult } from './types'; 
 
const events = new EventEmitter(); 
 
// Модели 
const productsModel = new ProductList(events); 
const cartModel = new Cart(); 
const buyerModel = new Buyer(); 
 
// API 
const api = new Api(API_URL); 
const apiCommunication = new ApiCommunication(api); 
 
// View компоненты 
let header: Header; 
let gallery: Gallery; 
let modal: Modal; 
 
let cardCatalogTemplate: HTMLTemplateElement; 
let cardPreviewTemplate: HTMLTemplateElement; 
let basketTemplate: HTMLTemplateElement; 
let cardBasketTemplate: HTMLTemplateElement; 
let formOrderTemplate: HTMLTemplateElement; 
let formContactsTemplate: HTMLTemplateElement; 
let successTemplate: HTMLTemplateElement; 
 
// Создание заказа
async function createOrder(): Promise<void> {
    const buyerData = buyerModel.getData(); 
    const cartItems = cartModel.getItems(); 
    
    if (!buyerData) return; 
    
    const orderData: IOrder = { 
        payment: buyerData.payment || 'card', 
        email: buyerData.email || '', 
        phone: buyerData.phone || '', 
        address: buyerData.address || '', 
        total: cartItems.reduce((sum, item) => sum + (item.price || 0), 0), 
        items: cartItems.map(item => item.id) 
    }; 
    
    try { 
        const result = await apiCommunication.createOrder(orderData); 
        events.emit('cart:success', result); 
    } catch (error) { 
        console.error('Ошибка создания заказа:', error); 
    } 
}

document.addEventListener('DOMContentLoaded', () => { 
    header = new Header(ensureElement<HTMLElement>('.header'), events); 
    gallery = new Gallery(ensureElement<HTMLElement>('.gallery')); 
     
    const modalContainer = ensureElement<HTMLElement>('#modal-container'); 
    modal = new Modal(modalContainer, events); 
 
    cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); 
    cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); 
    basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); 
    cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); 
    formOrderTemplate = ensureElement<HTMLTemplateElement>('#order'); 
    formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); 
    successTemplate = ensureElement<HTMLTemplateElement>('#success'); 
 
apiCommunication.getCatalog() 
    .then(catalog => { 
         
        const productsWithImages = catalog.items.map(product => { 
            const imagePath = product.image.startsWith('/') ? product.image.slice(1) : product.image; 
            const imageUrl = `${CDN_URL}/${imagePath}`; 
             
            return { 
                ...product, 
                image: imageUrl 
            }; 
        }); 
         
         
        productsModel.setItems(productsWithImages); 
        events.emit('catalog:changed'); 
    }) 
 
    header.counter = cartModel.getItems().length; 
}); 
 
// Обновление каталога товаров 
events.on('catalog:changed', () => { 
    if (!gallery) return; 
    const items = productsModel.getItems().map(item => { 
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events); 
        return card.render(item);  
    }); 
    gallery.catalog = items; 
}); 
 
// Выбор карточки товара (открывается в модалке) 
events.on('card:select', (event: { id: string }) => { 
    const product = productsModel.getItem(event.id); 
    if (!product) return; 
     
    const productInCart = cartModel.getItems().some(item => item.id === event.id); 
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events); 
     
    const cardElement = card.render({  
        ...product,  
        inCart: productInCart  
    }); 
 
    modal.content = cardElement; 
    modal.open(); 
}); 
 
// Добавление товара в корзину
events.on('card:add-product', (event: any) => {
    const id = typeof event === 'string' ? event : event.id;
    const product = productsModel.getItem(id);
    if (!product) return;
    
    cartModel.addItem(product);
    header.counter = cartModel.getItems().length;
    modal.close();
});

// Удаление товара из корзины
events.on('card:remove-product', (event: any) => {
    const id = typeof event === 'string' ? event : event.id;
    const product = productsModel.getItem(id);
    if (!product) return;
    
    cartModel.removeItem(product);
    
    header.counter = cartModel.getItems().length;
    events.emit('cart:open');
});
 
// Открытие корзины (в модалке) 
events.on('cart:open', () => { 
    const basket = new Basket(cloneTemplate(basketTemplate), events); 
    const basketItems = cartModel.getItems(); 
     
    const basketElements = basketItems.map((item, index) => { 
        const basketCard = new CardBasket(cloneTemplate(cardBasketTemplate), events); 
        return basketCard.render({  
            ...item,  
            data: item,  
            index: index + 1  
        }); 
    }); 
     
    basket.basket = basketElements; 
    basket.total = basketItems.reduce((sum, item) => sum + (item.price || 0), 0); 
    basket.buttonDisabled = basketItems.length === 0; 
     
    modal.content = basket.render(); 
    modal.open(); 
}); 
 
// Оформление заказа  
events.on('cart:order', () => { 
    const formOrder = new FormOrder(cloneTemplate(formOrderTemplate), { 
        onSubmit: () => { 
            events.emit('cart:contacts'); 
        } 
    }, events); 
     
    const buyerData = buyerModel.getData(); 
    if (buyerData && buyerData.payment) { 
        formOrder.payment = buyerData.payment; 
    } 
    if (buyerData && buyerData.address) { 
        formOrder.address = buyerData.address; 
    } 
 
    modal.content = formOrder.render(); 
    modal.open(); 
}); 
 
// Форма контактов (в модалке) 
events.on('cart:contacts', () => { 
    const formContacts = new FormContacts(cloneTemplate(formContactsTemplate), { 
        onSubmit: createOrder 
    }, events); 
     
    const buyerData = buyerModel.getData(); 
    if (buyerData && buyerData.email) { 
        formContacts.email = buyerData.email; 
    } 
    if (buyerData && buyerData.phone) { 
        formContacts.phone = buyerData.phone; 
    } 
     
    modal.content = formContacts.render(); 
    modal.open(); 
}); 
 
// Успешное оформление заказа (в модалке) 
events.on('cart:success', (event: IOrderResult) => { 
    const success = new Success(cloneTemplate(successTemplate), { 
        onClose: () => { 
            modal.close(); 
        } 
    }); 
     
    success.total = event.total; 
     
    modal.content = success.render(); 
    modal.open(); 
}); 
 
// Очистка после успешного заказа 
function cleanupAfterSuccess() { 
    cartModel.clear(); 
    buyerModel.clear(); 
    if (header) { 
        header.counter = 0; 
    } 
} 

// Обработка закрытия модального окна успеха
events.on('modal:close', () => {
    const successElement = document.querySelector('.success');
    if (successElement) {
        cleanupAfterSuccess();
    }
});
 
// Изменение способа оплаты 
events.on('form:payment-change', (event: { payment: 'card' | 'cash' }) => { 
    buyerModel.setData({ payment: event.payment }); 
}); 
 
// Изменение адреса 
events.on('form:address-change', (event: { address: string }) => { 
    buyerModel.setData({ address: event.address }); 
}); 
 
// Изменение email 
events.on('form:email-change', (event: { email: string }) => { 
    buyerModel.setData({ email: event.email }); 
}); 
 
// Изменение телефона 
events.on('form:phone-change', (event: { phone: string }) => { 
    buyerModel.setData({ phone: event.phone }); 
});