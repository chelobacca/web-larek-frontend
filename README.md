# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Главная страница

```
interface IPage {
    counter: number; 
    catalog: HTMLElement[];
    locked: boolean;
}
```

Карточка товара

```
interface ICard {
	id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

Заказ
```
interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number
    items: ICard[];
}    
```

Ответ сервера при отправке заказа
```
export interface IOrderResponse {
    id: string;
    total: number;
}
```

Список товаров  
```
interface ICardList {
    total: number; 
    items: ICard[];
}
```



## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

Методы: 
- `get` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponse` - обработчик (хэндлер) ответа сервера. Возвращает ответ сервера при успешном выполнении запроса, в противном случает возвращает ошибку.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - снятие подписки на событие
- `onAll` - подписка на все события
- `offAll` - снятие подписки на все события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

---
---

### Слой данных

 #### Класс Model 
 Базовая модель, чтобы можно было отличить ее от простых объектов с данными/

```
 abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать
        this.events.emit(event, payload ?? {});
    }
}
```

#### Класс CardsData

Класс отвечает за хранение и логику работы с данными карточек, получаемых с сервера.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _cards: ICard[] - массив объектов карточек
- _preview: string | null - id карточки, выбранной для просмотра в модальном окне

Также класс предоставляет метод для взаимодействия с этими данными.\
```getCard(cardId: string): ICard``` - возвращает карточку по ее id

---
---

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый класс Component 
`abstract class Component<T>` - Необходим для управления DOM-элементами.

`protected constructor(protected readonly container: HTMLElement)` - конструктор принимает родительский элемент.

Методы:

`toggleClass(element: HTMLElement, className: string, force?: boolean)` - Переключить класс

`protected setText(element: HTMLElement, value: unknown)` - Установить текстовое содержимое

`setDisabled(element: HTMLElement, state: boolean)` - Сменить статус блокировки

`protected setHidden(element: HTMLElement)` - Скрыть

`protected setVisible(element: HTMLElement)` - Показать

`protected setImage(element: HTMLImageElement, src: string, alt?: string)` - Установить изображение с алтернативным текстом

`render(data?: Partial<T>): HTMLElement` - Вернуть корневой DOM-элемент


#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс ModalWithForm
Расширяет класс Modal. Предназначен для реализации модального окна с формой содержащей поля ввода. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы
- setError(data: { field: string, value: string, validInformation: string }): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода
- showInputError (field: string, errorMessage: string): void - отображает полученный текст ошибки под указанным полем ввода
- hideInputError (field: string): void - очищает текст ошибки под указанным полем ввода
- close (): void - расширяет родительский метод дополнительно при закрытии очищая поля формы и деактивируя кнопку сохранения
- get form: HTMLElement - геттер для получения элемента формы

#### Класс Page

Отвечает за отображение главной страницы. Расширяет класс Component.\
Поля класса:
- protected _counter: HTMLElement; 
- protected _catalog: HTMLElement;
- protected _wrapper: HTMLElement;
- protected _cart: HTMLElement;

```constructor(container: HTMLElement, protected events: IEvents)``` - Конструктор принимает родительский элемент и обработчик событий\

Методы: 
- ```set counter(value: number)``` - сеттер счетчика товаров в корзине.
- ```set catalog(items: HTMLElement[])``` - сеттер карточек товаров на главной странице.
- ```set locked(value: boolean)``` - сеттер установки и снятия блокировки скролла страницы.


#### Класс Card

Отвечает за отображение карточки товара на главной странице, в модальном окне и в корзине. Расширяет класс Component.

Поля класса: 
 - protected _category: HTMLElement;
 - protected _id: HTMLElement;
 - protected _title: HTMLElement;
 - protected _image: HTMLImageElement;
 - protected _price: HTMLElement;
 - protected _button: HTMLButtonElement;

 ```constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)``` - Конструктор принимает имя блока, родительский элемент и функцию-колбэк.\

 Методы:

 - ```set category(value: string)``` - сеттер цены товара
 - ```set id(value: string)``` - сеттер идентификатора.
 - ```get id(): string``` - геттер идентификатора
 - ```set title(value: string)``` - сеттер названия товара
 - ```get title(): string``` - геттер названия товара
 - ```set image(value: string)``` - сеттер изображения товара
 - ```set price(value: string)``` - сеттер цены товара

 #### Класс CardsContainer
Отвечает за отображение блока с карточками на главной странице. Предоставляет метод `addCard(cardElement: HTMLElement)` для добавления карточек на страницу и сеттер `catalog` для полного обновления содержимого. В конструктор принимает контейнер, в котором размещаются карточки.

---
---

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.




## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `cards:loaded` - получены карточки с сервера
- `cards:changed` - изменился массив карточек

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card:select` - выбор карточки для отображения в модальном окне
- `cart:open` - открытие корзины в модальном окне 
- `payment:validation` - событие, сообщающее о необходимости валидации формы оплаты
- `phone:validation` - событие, сообщающее о необходимости валидации формы телефона
- `email:validation` - событие, сообщающее о необходимости валидации формы почты

- `address:input` - изменение данных в форме с адресом пользователя
- `email:input` - изменение данных в форме с почтой пользователя
- `phone:input` - изменение данных в форме c номером телефона
- `address:submit` - сохранение адреса пользователя в модальном окне
- `contacts:submit` - сохранение почты и телефона пользователя в модальном окне








