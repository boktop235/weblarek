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
import { IOrder} from './types';

// Инициализация событий
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

// Шаблоны
let cardCatalogTemplate: HTMLTemplateElement;
let cardPreviewTemplate: HTMLTemplateElement;
let basketTemplate: HTMLTemplateElement;
let cardBasketTemplate: HTMLTemplateElement;
let formOrderTemplate: HTMLTemplateElement;
let formContactsTemplate: HTMLTemplateElement;
let successTemplate: HTMLTemplateElement;

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация View компонентов
    header = new Header(ensureElement<HTMLElement>('.header'), events);
    gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
    
    // Инициализация Modal с контейнером и events
    const modalContainer = ensureElement<HTMLElement>('#modal-container');
    modal = new Modal(modalContainer, events);

    // Инициализация шаблонов
    cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
    basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
    cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
    formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
    formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    successTemplate = ensureElement<HTMLTemplateElement>('#success');

    // Загрузка каталога с сервера
    // Загрузка каталога с сервера
    // Загрузка каталога с сервера
apiCommunication.getCatalog()
    .then(catalog => {
        console.log('🔗 1. Данные с сервера:', catalog);
        
        const productsWithImages = catalog.items.map(product => {
            // ИСПРАВЬТЕ ФОРМИРОВАНИЕ URL - уберите лишний слеш
            const imagePath = product.image.startsWith('/') ? product.image.slice(1) : product.image;
            const imageUrl = `${CDN_URL}/${imagePath}`;
            
            console.log(`🖼️ Картинка для "${product.title}":`, {
                original: product.image,
                fullUrl: imageUrl,
                productId: product.id
            });
            
            return {
                ...product,
                image: imageUrl
            };
        });
        
        console.log('🔗 2. Данные с изображениями:', productsWithImages);
        
        productsModel.setItems(productsWithImages);
        events.emit('catalog:changed');
    })
    .catch(error => {
        console.error('Ошибка загрузки каталога:', error);
    });

    header.counter = cartModel.getItems().length;
});

// Обработчики событий

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
events.on('card:select', (event: any) => {
    const id = typeof event === 'string' ? event : event.id;
    const product = productsModel.getItem(id);
    if (!product) return;
    
    const productInCart = cartModel.getItems().some(item => item.id === id);
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
    
    const cardElement = card.render({ 
        ...product, 
        inCart: productInCart 
    });
    
    // Исправленный вызов для нового Modal
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
    
    // Передаем объект продукта, а не id
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
    
    // Исправленный вызов для нового Modal
    modal.content = basket.render();
    modal.open();
});

// Оформление заказа (форма оплаты и адреса в модалке)
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
    
    // Исправленный вызов для нового Modal
    modal.content = formOrder.render();
    modal.open();
});

// Форма контактов (в модалке)
events.on('cart:contacts', () => {
    const formContacts = new FormContacts(cloneTemplate(formContactsTemplate), {
        onSubmit: async () => {
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
    }, events);
    
    const buyerData = buyerModel.getData();
    if (buyerData && buyerData.email) {
        formContacts.email = buyerData.email;
    }
    if (buyerData && buyerData.phone) {
        formContacts.phone = buyerData.phone;
    }
    
    // Исправленный вызов для нового Modal
    modal.content = formContacts.render();
    modal.open();
});

// Успешное оформление заказа (в модалке)
events.on('cart:success', (event: any) => {
    const success = new Success(cloneTemplate(successTemplate), {
        onClose: () => {
            modal.close();
            cleanupAfterSuccess();
        }
    });
    
    const total = typeof event === 'number' ? event : event.total;
    success.total = total;
    
    // Исправленный вызов для нового Modal
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

// Изменение способа оплаты
events.on('form:payment-change', (event: any) => {
    const payment = typeof event === 'string' ? event : event.payment;
    buyerModel.setData({ payment });
});

// Изменение адреса
events.on('form:address-change', (event: any) => {
    const address = typeof event === 'string' ? event : event.address;
    buyerModel.setData({ address });
});

// Изменение email
events.on('form:email-change', (event: any) => {
    const email = typeof event === 'string' ? event : event.email;
    buyerModel.setData({ email });
});

// Изменение телефона
events.on('form:phone-change', (event: any) => {
    const phone = typeof event === 'string' ? event : event.phone;
    buyerModel.setData({ phone });
});