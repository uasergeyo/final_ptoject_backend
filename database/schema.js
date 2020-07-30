const Sequelize = require('sequelize');
const { Op } = require("sequelize");

const sequelize = new Sequelize('buy_and_sale_db', 'root', 'FGghJfgjFJF56565FgsdDDE45gh', {
    dialect: 'mysql',
    host: 'localhost'
})

class Photo extends Sequelize.Model {

}

Photo.init({
    photoLink: Sequelize.STRING,
    isMain: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: "photo" });


class User extends Sequelize.Model {
    get phones(){
        return this.getPhones()
    }

    get photos(){
        return this.getPhotos()
    }

    get announcements(){
        return this.getAnnouncements({where:{isDisabled:false}})
    }
    get city(){
        return this.getCity()
    }
    get area(){
        return this.getArea()
    }
    
    get favourite(){
        return this.getNoted_as_favourites()
    }

}

User.init({
    userName: {
        type: Sequelize.STRING,
    },
    isDisabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    userInfo: Sequelize.TEXT,
    userEmail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userPassword: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'user' });

class Phone extends Sequelize.Model {

}

Phone.init({
    phone: Sequelize.STRING,
}, { sequelize, modelName: 'phone', timestamps: false })

User.hasMany(Phone);
Phone.belongsTo(User);

class Announcement extends Sequelize.Model {
    get photo(){
        return this.getPhotos()
    }
    get city(){
        return this.getCity()
    }
    get area(){
        return this.getArea()
    }
    get category(){
        return this.getCategory()
    }
    get subcategory(){
        return this.getSub_category()
    }
    get currency(){
        return this.getCurrency()
    }
    get user(){
        return this.getUser()
    }
}

Announcement.init({
    announcementHeader: {
        type: Sequelize.STRING,
    },
    announcementText: {
        type: Sequelize.TEXT,
    },
    announcementPrice: {
        type: Sequelize.DECIMAL(9,2),
    },
    isDisabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    hasDelivery: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
},
    {
        sequelize,
        modelName: "announcement",
        defaultScope: {
            where: {
            isDisabled: false
            }
        },
        scopes: {
            inRange(min, max) {
                return {
                    where: {
                        announcementPrice: {
                            [Op.between]: [min, max]
                        }
                    }
                }
            },
            more(min) {
                return {
                    where: {
                        announcementPrice: {
                            [Op.gte]: min
                        }
                    }
                }
            },
            less(max) {
                return {
                    where: {
                        announcementPrice: {
                            [Op.lte]: max
                        }
                    }
                }
            },
            withPhoto:{
                include: [{
                    model: Photo,
                    where:  {
                        announcementId : Sequelize.col('announcement.id')
                    },
               }],
            },
            findInTitle(value){
                return {
                    where:{
                        announcementHeader:{
                            [Op.substring]: value
                        }
                    }
                }
            },
            findInBody(value){
                return {
                    where:{
                        [Op.or]:[
                        {announcementText:{
                            [Op.substring]: value
                        }},
                        {announcementHeader:{
                            [Op.substring]: value
                        }}]
                    }
                }
            },
            withDelivery:{
                    where: {
                        hasDelivery: true
                    }
            }
        }
    }
)


Announcement.belongsTo(User);
User.hasMany(Announcement);

class Noted_as_favourite extends Sequelize.Model {
    get announcement(){
        return this.getAnnouncement()
    }
}

Noted_as_favourite.init({
    
}, { sequelize, modelName: "noted_as_favourite" })

Noted_as_favourite.belongsTo(User);
User.hasMany(Noted_as_favourite);

Announcement.hasMany(Noted_as_favourite);
Noted_as_favourite.belongsTo(Announcement);

//-------------------------------------------------------------------------------------------------------------------------
class Area extends Sequelize.Model {
    get cities(){
        return this.getCities()
    }
}

Area.init({
    areaName: Sequelize.STRING
}, { sequelize, modelName: "area", timestamps: false })

User.belongsTo(Area);
Area.hasMany(User);
Announcement.belongsTo(Area);
Area.hasMany(Announcement);
//---------------------------------------------------------------------------------------------------------------------------
class City extends Sequelize.Model {
    
}

City.init({
    cityName: Sequelize.STRING
}, { sequelize, modelName: "city", timestamps: false })

Area.hasMany(City);
City.belongsTo(Area);
User.belongsTo(City);
City.hasMany(User);
Announcement.belongsTo(City);
City.hasMany(Announcement);
//---------------------------------------------------------------------------------------------------------------------------------------

User.hasMany(Photo);
Photo.belongsTo(User);
Announcement.hasMany(Photo);
Photo.belongsTo(Announcement);

class Currency extends Sequelize.Model {

}

Currency.init({
    currencySymbol: Sequelize.STRING
}, { sequelize, modelName: "currency", timestamps: false });

Announcement.belongsTo(Currency);
Currency.hasMany(Announcement);

class Category extends Sequelize.Model {
    get subcategories(){
        return this.getSub_categories()
    }
}

Category.init({
    categoryName: Sequelize.STRING,
    categoryImage: Sequelize.STRING,
}, { sequelize, modelName: "category", timestamps: false })

Announcement.belongsTo(Category);
Category.hasMany(Announcement);

class Sub_category extends Sequelize.Model {

}

Sub_category.init({
    subCategoryName: Sequelize.STRING
}, { sequelize, modelName: "sub_category", timestamps: false })

Announcement.belongsTo(Sub_category);
Sub_category.hasMany(Announcement);
Sub_category.belongsTo(Category);
Category.hasMany(Sub_category);


sequelize.sync();

module.exports.Photo = Photo;
module.exports.User = User;
module.exports.Phone = Phone;
module.exports.Announcement = Announcement;
module.exports.Noted_as_favourite = Noted_as_favourite;
module.exports.Area = Area;
module.exports.City = City;
module.exports.Currency = Currency;
module.exports.Category = Category;
module.exports.Sub_category = Sub_category;


//         "http://localhost:4000/content/categories/category_baby.png",
//         "http://localhost:4000/content/categories/category_real_estate.png",
//         "http://localhost:4000/content/categories/category_vehicles.png",
//         "http://localhost:4000/content/categories/category_spare_parts.png",
//         "http://localhost:4000/content/categories/category_job.png",
//         "http://localhost:4000/content/categories/category_animals.png",
//         "http://localhost:4000/content/categories/category_house_and_garden.png",
//         "http://localhost:4000/content/categories/category_electronics.png",
//         "http://localhost:4000/content/categories/category_business_and_services.png",
//         "http://localhost:4000/content/categories/category_fashion_and_style.png",
//         "http://localhost:4000/content/categories/category_leisure_relax.png",
//         "http://localhost:4000/content/categories/category_give_for_free.png",
//         "http://localhost:4000/content/categories/category_exchange.png",


// ;(async () => {
//     let currency2 =await Currency.create({ currencySymbol: "UAH" })
//     let currency1 =await Currency.create({currencySymbol: "USD" })
//     let currency =await Currency.create({currencySymbol: "EUR" })
   


//     let cat = ["Детский мир", "Недвижимость", "Транспорт", "Запчасти для транспорта",  "Работа",  "Животные",  "Дом и сад",  "Электроника",  "Бизнес и услуги",  "Мода и стиль", "Хобби, отдых и спорт",  "Отдам даром",  "Обмен"]
//     let categoryImg=[
//         "/content/categories/category_baby.png",
//         "/content/categories/category_real_estate.png",
//         "/content/categories/category_vehicles.png",
//         "/content/categories/category_spare_parts.png",
//         "/content/categories/category_job.png",
//         "/content/categories/category_animals.png",
//         "/content/categories/category_house_and_garden.png",
//         "/content/categories/category_electronics.png",
//         "/content/categories/category_business_and_services.png",
//         "/content/categories/category_fashion_and_style.png",
//         "/content/categories/category_leisure_relax.png",
//         "/content/categories/category_give_for_free.png",
//         "/content/categories/category_exchange.png",
//     ]
// let subcats=[
//         ["Детская одежда","Детская обувь", "Детские коляски","Детские автокресла", "Детская мебель","Игрушки", "Детский транспорт", "Товары для кормления", "Товары для школьников", "Прочие детские товары", ],
//         ["Квартиры, комнаты","Дома","Земля", "Коммерческая недвижимость","Гаражи, парковки","Посуточная аренда жилья","Предложения от застройщиков", "Недвижимость за рубежом"],
//         ["Легковые автомобили","Автомобили из Польши", "Грузовые автомобили", "Автобусы", "Мото", "Спецтехника", "Сельхозтехника", "Водный транспорт", "Воздушный транспорт", "Прицепы / дома на колесах", "Другой транспорт", "Запчасти для транспорта", "Нерастаможенные автомобили","Электромобили" ],
//         ["Автозапчасти и аксессуары", "Шины, диски и колёса","Запчасти для спец / с.х. техники","Мотозапчасти и аксессуары"," Прочие запчасти","Транспорт"],
//         ["Розничная торговля / продажи / закупки", "Транспорт / логистика", "Строительство", "Телекоммуникации / связь", "Бары / рестораны", "Юриспруденция и бухгалтерия", "Управление персоналом / HR", "Охрана / безопасность", "Домашний персонал", "Красота / фитнес / спорт",   "Туризм / отдых / развлечения",   "Образование", "Культура / искусство",   "Медицина / фармация", "ИТ / телеком / компьютеры",  "Банки / финансы / страхование", "Недвижимость", "Маркетинг / реклама / дизайн",  "Производство / энергетика","Сельское хозяйство / агробизнес / лесное хозяйство",  "Cекретариат / АХО",  "Частичная занятость",  "Начало карьеры / Студенты",  "Сервис и быт", "Другие сферы занятий","Работа за рубежом"],
//         ["Бесплатно (животные и вязка)","Собаки","Кошки","Аквариумистика","Птицы","Грызуны", "Рептилии","Сельхоз животные","Другие животные","Зоотовары","Вязка", "Бюро находок"],
//         ["Канцтовары / расходные материалы", "Мебель", " Продукты питания / напитки", "Сад / огород", "Предметы интерьера", "Строительство / ремонт", "Инструменты", "Комнатные растения", "Посуда / кухонная утварь", "Садовый инвентарь", "Хозяйственный инвентарь / бытовая химия","Прочие товары для дома" ],
//         ["Телефоны и аксессуары","Компьютеры и комплектующие","Фото / видео","Тв / видеотехника", "Аудиотехника", " Игры и игровые приставки","Планшеты / эл. книги и аксессуары", "Ноутбуки и аксессуары", "Техника для дома", "Техника для кухни", "Климатическое оборудование", "Индивидуальный уход","Аксессуары и комплектующие", "Прочая электроника", "Ремонт и обслуживание техники" ],
//         ["Строительство / ремонт / уборка","Финансовые услуги / партнерство", " Перевозки / аренда транспорта", "Реклама / полиграфия / маркетинг / интернет", "Няни / сиделки","Сырьё / материалы","Красота / здоровье","Оборудование", "Образование / Спорт","Услуги для животных", "Продажа бизнеса","Развлечения / Искусство / Фото / Видео","Туризм / иммиграция", "Услуги переводчиков / набор текста","Авто / мото услуги","Ремонт и обслуживание техники","Сетевой маркетинг","Юридические услуги", "Прокат товаров","Прочие услуги"],
//         ["Одежда/обувь", "Для свадьбы"," Наручные часы", "Аксессуары","Подарки", "Красота / здоровье","Мода разное"],
//         ["Антиквариат / коллекции","Музыкальные инструменты","Спорт / отдых","Книги / журналы","CD / DVD / пластинки / кассеты","Билеты", "Поиск попутчиков","Поиск групп / музыкантов","Другое"],
//         ["Детские товары","Одежда","Обувь","Мебель","Животные","Электроника","Другое"],
//         ["Недвижимость", "Транспорт", "Запчасти для транспорта","Электроника","Мода и стиль","Другое"],
// ]   
// for(let i=0;i<cat.length;i++){
//     let category = await Category.create({ categoryName: cat[i],categoryImage:categoryImg[i] })
//     for(let y of subcats[i]){
//         let sub_category = await Sub_category.create({ subCategoryName: y,categoryId:category.id })
//     }
// }
//     let areas=["Винницкая обл.","Волынская обл.","Днепропетровская обл.","Донецкая обл.","Житомирская обл.", "Закарпатская обл.","Запорожская обл.","Ивано-Франковская обл.","Киевская обл.","Кировоградская обл.","Крым (АРК)","Луганская обл.","Львовская обл.","Николаевская обл.","Одесская обл.","Полтавская обл.","Ровенская обл.","Сумская обл.","Тернопольская обл.","Харьковская обл.","Херсонская обл.","Хмельницкая обл.","Черкасская обл.","Черниговская обл.", "Черновицкая обл."]
//     let cities=[
//         ["Бар","Бершадь","Винница","Гайсин","Гнивань","Городок", "Жмеринка","Ильинцы","Казатин", "Калиновка","Крыжополь","Ладыжин", "Липовец", "Могилев-Подольский","Немиров","Песочин", "Погребище", "Стрижавка", "Тульчин", "Хмельник", "Чечельник", "Шаргород","Ямполь"],
//         ["Берестечко","Владимир-Волынский","Горохов","Иваничи","Камень-Каширский","Киверцы","Ковель","Луцк","Любешов","Любомль","Маневичи","Нововолынск","Ратно","Рожище","Старая Выжевка","Турийск","Устилуг","Цумань","Шацк"],
//         ["Апостолово","Верхнеднепровск","Вольногорск","Днепр","Желтые Воды","Каменское","Кривой Рог","Марганец","Никополь","Новомосковск","Орджоникидзе","Павлоград","Перещепино","Першотравенск","Подгородное","Пятихатки","Синельниково","Терновка","Чаплинка"],
//         ["Авдеевка","Александровка","Амвросиевка","Артемовск","Волноваха","Горловка","Дебальцево","Дзержинск","Димитров","Доброполье","Докучаевск","Донецк","Дружковка","Енакиево","Ждановка","Зугрэс","Кировское","Константиновка","Краматорск","Красноармейск","Красный Лиман","Майорск","Макеевка","Мариуполь","Марьинка","Новоазовск","Новогродовка","Селидово","Славянск","Снежное","Соледар","Старобешево","Торез","Угледар","Харцызск","Шахтерск","Ясиноватая"],
//         ["Андрушевка","Барановка","Бердичев","Володарск-Волынский","Емильчино","Житомир","Иршанск","Коростень","Коростышев","Малин","Новоград-Волынский","Овруч","Олевск","Попельня","Радомышль","Романов","Черняхов"],
//         ["Берегово","Буштына","Великий Бычков","Виноградов","Вышково","Дубовое","Иршава","Королево","Межгорье","Мукачево","Перечин","Рахов","Свалява","Солотвина","Тячев", "Ужгород","Хуст","Чоп"],
//         ["Акимовка","Беляевка","Бердянск","Васильевка","Веселое","Вольнянск","Гуляйполе","Днепрорудное","Запорожье","Каменка-Днепровская","Куйбышево","Кушугум","Мелитополь","Михайловка","Молочанск","Орехов","Пологи","Приморск","Розовка","Токмак","Энергодар"],
//         ["Богородчаны"," Болехов","Бурштын","Галич","Городенка","Делятин","Долина","Ивано-Франковск","Калуш","Коломыя", "Косов","Ланчин","Надворная","Перегинское", "Рогатин", "Снятын","Тлумач","Тысменица","Яремче"],
//         ["Барышевка","Белая Церковь","Березань","Богуслав","Борисполь","Бородянка","Боярка","Бровары","Буча","Васильков","Вишневое","Володарка","Вышгород","Глеваха","Гостомель","Иванков","Ирпень","Кагарлык","Киев","Коцюбинское","Макаров","Мироновка","Обухов","Переяслав-Хмельницкий","Припять","Ржищев","Рокитное","Сквира","Славутич","Тараща","Тетиев","Узин","Украинка","Фастов","Чернобыль","Яготин"],
//         ["Александрия","Бобринец","Власовка","Гайворон","Долинская","Знаменка","Кропивницкий","Малая Виска","Новая Прага","Новоархангельск","Новое","Новомиргород","Новоукраинка","Первомайск","Петрово","Помошная","Светловодск","Смолино"],
//         ["Алупка","Алушта","Армянск","Бахчисарай","Белогорск","Береговое","Джанкой","Евпатория","Инкерман","Керчь","Красногвардейское","Красноперекопск","Раздольное","Саки","Севастополь","Симферополь","Старый Крым","Судак","Феодосия","Черноморское","Щёлкино","Ялта"],
//         ["Александровск","Алмазная","Алчевск","Антрацит","Артемовск","Брянка","Вахрушево","Горное","Горское","Зимогорье","Золотое","Зоринск","Ирмино","Кировск","Краснодон","Краснопартизанск","Красный Луч","Кременная","Лисичанск","Луганск","Лутугино","Миусинск","Молодогвардейск","Новодружеск","Новопсков","Первомайск","Перевальск","Петровское","Попасная","Приволье","Ровеньки","Рубежное","Сватово","Свердловск","Северодонецк","Станица Луганская","Старобельск","Стаханов","Суходольск","Счастье","Червонопартизанск"],
//         ["Белз","Бобрка","Борислав","Броды","Буск","Великие Мосты","Винники","Глиняны","Городок","Добромиль","Дрогобыч","Дубляны","Жидачев","Жолква","Золочев","Каменка-Бугская","Львов","Мостиска","Николаев","Новояворовск","Новый Роздол","Перемышляны","Рава-Русская","Радехов","Рудки","Самбор","Сколе","Сокаль","Сосновка","Старый Самбор","Стебник","Стрый","Трускавец","Угнев","Хыров","Червоноград","Яворов"],
//         ["Александровка","Арбузинка","Баштанка","Березнеговатое","Братское","Веселиново","Вознесенск","Врадиевка","Доманевка","Еланец","Казанка","Кривое Озеро","Николаев","Новая Одесса","Новый Буг","Очаков","Первомайск","Снигиревка","Южноукраинск"],
//         ["Ананьев","Арциз","Балта","Белгород-Днестровский","Беляевка","Березовка","Болград","Великодолинское","Измаил","Килия","Кодыма","Котовск","Любашевка","Овидиополь","Одесса","Раздельная","Рени","Татарбунары","Теплодар","Черноморск","Ширяево","Южное"],
//         ["Гадяч","Глобино","Горишные Плавни","Градижск","Гребенка","Дергачи","Диканька","Зеньков","Карловка","Кобеляки","Котельва","Кременчуг","Лохвица","Лубны","Миргород","Новые Санжары","Пирятин","Полтава","Решетиловка","Хорол","Червонозаводское","Чутово"],
//         ["Березне","Вараш","Владимирец","Дубно","Дубровица","Заречное","Здолбунов","Квасилов","Клевань","Корец","Костополь","Млинов","Острог","Радивилов","Ровно","Рокитное","Сарны"],
//         ["Ахтырка","Белополье","Бурынь","Ворожба","Воронеж","Глухов","Дружба","Конотоп","Краснополье","Кролевец","Лебедин","Путивль","Ромны","Свесса","Середина-Буда","Сумы","Тростянец","Шостка"],
//         ["Бережаны","Борщев","Бучач","Великая Березовица","Гусятин","Залещики","Збараж","Зборов","Козова","Копычинцы","Кременец","Лановцы","Монастыриска","Подволочиск","Подгайцы","Почаев","Скалат","Теребовля","Тернополь","Хоростков","Чертков","Шумск"],
//         ["Балаклея","Барвенково","Богодухов","Валки","Великий Бурлук","Волчанск","Высокий","Дергачи","Змиев","Изюм","Комсомольское","Красноград","Купянск","Лозовая","Люботин","Мерефа","Новая Водолага","Первомайский","Солоницевка","Харьков","Чугуев"],
//         ["Антоновка","Белозерка","Берислав","Великая Александровка","Великая Лепетиха","Геническ", "Голая Пристань","Каланчак","Камышаны","Каховка","Новая Каховка","Новая Маячка","Новоалексеевка","Новотроицкое","Пойма","Скадовск","Таврийск","Херсон"],
//         ["Виньковцы","Волочиск","Деражня","Дунаевцы","Изяслав","Каменец-Подольский","Красилов","Летичев","Нетешин","Полонное","Понинка","Славута","Староконстантинов","Теофиполь","Хмельницкий","Шепетовка"],
//         ["Ватутино","Городище","Драбов","Жашков","Звенигородка","Золотоноша","Каменка","Канев","Корсунь-Шевченковский","Лысянка","Маньковка","Монастырище","Смела","Тальное","Умань","Христиновка","Черкассы","Чернобай","Чигирин","Шпола"],
//         ["Бахмач","Бобровица","Борзна","Городня","Десна","Ичня","Козелец","Корюковка","Мена","Нежин","Новгород-Северский","Носовка","Прилуки","Седнев","Семеновка","Чернигов","Щорс"],
//         ["Берегомет","Вашковцы","Вижница","Герца","Глыбокая","Заставна","Кельменцы","Кицмань","Красноильск","Новоднестровск","Новоселица","Путила","Сокиряны","Сторожинец","Хотин","Черновцы"]
//         ]

//         for(let i=0;i<areas.length;i++){
//             let area = await Area.create({ areaName: areas[i] })
//             for(let y of cities[i]){
//                 let city = await area.createCity({ cityName:y })
//             }
//         }
// })()


