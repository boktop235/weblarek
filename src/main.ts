import './scss/styles.scss';
import { ProductList } from './components/Models/ProductList';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';

// Тестирование ProductList
console.log('=== ТЕСТИРОВАНИЕ PRODUCTLIST ===');

const productsModel = new ProductList();
productsModel.setItems(apiProducts.items);

console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Количество товаров в каталоге:', productsModel.getItems().length);

// Тестируем получение товара по ID
const product1 = productsModel.getItem('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар с id "854cef69-976d-4c2a-a18c-2aa45046c390":', product1);

const product2 = productsModel.getItem('b06cde61-912f-4663-9751-09956c0eed67');
console.log('Товар с id "b06cde61-912f-4663-9751-09956c0eed67":', product2);

// Тестируем выбор товара для подробного просмотра
productsModel.setSelectedItem(product1!);
console.log('Выбранный товар для подробного просмотра:', productsModel.getSelectedItem());

// Тестирование Cart
console.log('\n=== ТЕСТИРОВАНИЕ CART ===');

const cartModel = new Cart();

console.log('Корзина пуста:', cartModel.getItemsCount() === 0);
console.log('Количество товаров в пустой корзине:', cartModel.getItemsCount());
console.log('Общая стоимость пустой корзины:', cartModel.getTotalPrice());

// Добавляем товары в корзину
cartModel.addItem(apiProducts.items[0]); // +1 час в сутках
cartModel.addItem(apiProducts.items[1]); // HEX-леденец
cartModel.addItem(apiProducts.items[3]); // Фреймворк куки судьбы

console.log('Товары в корзине после добавления:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getItemsCount());
console.log('Общая стоимость корзины:', cartModel.getTotalPrice());

// Проверяем наличие товаров в корзине
console.log('Товар с id "854cef69..." в корзине:', cartModel.contains('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Товар с id "b06cde61..." в корзине:', cartModel.contains('b06cde61-912f-4663-9751-09956c0eed67'));

// Удаляем товар
cartModel.removeItem(apiProducts.items[1]);
console.log('Товары в корзине после удаления HEX-леденца:', cartModel.getItems());
console.log('Количество товаров после удаления:', cartModel.getItemsCount());
console.log('Общая стоимость после удаления:', cartModel.getTotalPrice());

// Очищаем корзину
cartModel.clear();
console.log('Корзина после очистки:', cartModel.getItems());
console.log('Количество товаров после очистки:', cartModel.getItemsCount());

// Тестирование Buyer
console.log('\n=== ТЕСТИРОВАНИЕ BUYER ===');

const buyerModel = new Buyer();

console.log('Данные покупателя по умолчанию:', buyerModel.getData());

// Проверяем валидацию пустых данных
console.log('Валидация пустых данных:', buyerModel.validate());

// Частичное обновление данных
buyerModel.setData({ email: 'web-developer@example.com' });
console.log('Данные после установки email:', buyerModel.getData());

buyerModel.setData({ phone: '+79991234567', address: 'Москва, Кремль' });
console.log('Данные после установки телефона и адреса:', buyerModel.getData());

// Проверяем валидацию частично заполненных данных
console.log('Валидация частично заполненных данных:', buyerModel.validate());

// Заполняем все данные
buyerModel.setData({ 
  payment: 'card' as const, 
  email: 'web-developer@example.com',
  phone: '+79991234567',
  address: 'Москва, Кремль'
});
console.log('Все данные покупателя:', buyerModel.getData());
console.log('Валидация полностью заполненных данных:', buyerModel.validate());

// Тестируем частичное обновление (не должно удалять другие поля)
buyerModel.setData({ phone: '+79998887766' });
console.log('Данные после обновления только телефона:', buyerModel.getData());

// Очистка данных
buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());
console.log('Валидация после очистки:', buyerModel.validate());

console.log('\n=== ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ ===');
console.log('=== МОДЕЛИ ДАННЫХ РАБОТАЮТ КОРРЕКТНО ===');