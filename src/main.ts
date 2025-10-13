import './scss/styles.scss';
import { ProductList } from './components/Models/ProductList';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { IProduct } from './types';
import { ApiCommunication } from './components/Communication/ApiCommunication';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';

const productsModel = new ProductList();
productsModel.setItems(apiProducts.items);

console.log("Массив товаров из каталога: ", productsModel.getItems());

const cartModel = new Cart();

const newProduct: IProduct = {
    id: "5",
    description: "Test product",
    image: "testimage.png",
    title: "Test product tittle",
    category: "Test category",
    price: 600
};

cartModel.addItem(newProduct);
console.log("Добавлен тестовый новый продукт:", newProduct);

const selectedProductFromCatalog = productsModel.getItem("854cef69-976d-4c2a-a18c-2aa45046c390");
if (selectedProductFromCatalog) {
    productsModel.setSelectedItem(selectedProductFromCatalog);
    cartModel.addItem(selectedProductFromCatalog);
    console.log("Добавлен продукт из каталога, выбранный по id");
} else {
    console.log("Выбранный товар в каталоге отсутствует");
}

const secondProductFromCatalog = productsModel.getItems()[1];
cartModel.addItem(secondProductFromCatalog);
console.log("Добавлен второй продукт из каталога:", secondProductFromCatalog);

const buyer1 = new Buyer();

buyer1.setData({
    payment: 'card',
    email: 'buyer1@gmail.com',
    phone: '89005553535',
    address: 'Test City, 1, 100000'
})

console.log("Добавлен новый покупатель со всеми данными:", buyer1.getData());

const buyer2 = new Buyer();
buyer2.setData({
    email: 'buyer2@icloud.com',
    address: 'Test City, 2, 20000'
})

console.log("Добавлен новый покупатель с частичными данных:", buyer2.getData());

const api = new Api(API_URL);
const apiCommunication = new ApiCommunication(api);

try {
    const catalog = await apiCommunication.getCatalog();
    console.log("Получен каталог с сервера через апи-коммуникатор:", catalog);
} catch (error) {
    console.error("Ошибка получения каталога:", error);
}

try {
    const catalog = await apiCommunication.getCatalog();
    const catalogWithFullPathImages = catalog.items.map(product => ({
        ...product, 
        image: `${CDN_URL}/${product.image}`
    }));
    console.log("Сформированы полные пути изображений товаров в каталоге", catalogWithFullPathImages);
    productsModel.setItems(catalogWithFullPathImages);
    console.log("Сформирован каталог с полными путями к изображениям товаров", productsModel.getItems());
} catch (error) {
    console.error("Ошибка формирования полных путей изображений товаров в каталоге", error);
}