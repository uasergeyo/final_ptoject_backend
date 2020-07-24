sequelize.sync();
var schema = buildSchema(`
    type Query {
        getAnnouncement(id:Int!):Announcement
        getAnnouncements:[Announcement]
        searchAnnouncements:[Announcement]
        getUser(id:Int!):User
        getAreas:[Area]
        getArea(id:Int!):Area
        getCategories:[Category]
        getCities(areaId: Int!):[City]
        getCurrencies:[Currency]
        getMessages(inId:Int!,outId:Int!):[Message]
        getFavourite(userId:Int!):[Like]
        getPhones(userId: Int!):[Phone]
        getSubCategories(categoryId:Int!):[SubCategory]
        getPhotos(announcementId:Int!):[Photo]
        getUserPhotos(userId:Int):[Photo]
        getUserAnnouncements(userId:Int):[Announcement]
        
    }
    type Mutation {
        createAnnouncement(  announcementHeader:String!, announcementText:String!, announcementPrice:String,hasDelivery:Boolean!,
                             userId:Int!, areaId:Int!, cityId:Int!, currencyId:Int!, categoryId:Int!, subCategoryId:Int!):Announcement
        editAnnouncement(id:Int!,announcementHeader:String!, announcementText:String!, announcementPrice:String,hasDelivery:Boolean!,
                         isDisabled:Boolean, areaId:Int!, cityId:Int!, currencyId:Int, categoryId:Int, subCategoryId:Int):Announcement
        createUser(userEmail: String!,userPassword: String!):User
        updateUser( userName: String!,isDisabled: Boolean, userInfo: String, userEmail: String,
                    userPassword: String, areaId:Int, cityId: Int,id:Int):User
        createMessage(text: String,inId: Int, outId: Int):Message
        updateMessage(id: Int, text: String, inId: Int, outId: Int):Message
        createLike(announcementId: Int!,userId: Int!):Like
        createPhone(phone: String!, userId: Int!):Phone
        createPhoto(photoLink: String!, userId:Int, announcementId:Int, messageId:Int):Photo
    }

    type Announcement {
        id: Int
        announcementHeader:String
        announcementText:String
        announcementPrice:String
        isDisabled:Boolean 
        hasDelivery:Boolean 
        createdAt:Int
        updatedAt:Int
        user:User
        area:Area
        city:City           
        currency:Currency      
        category:Category     
        subcategory:SubCategory
        photos:[Photo]
    }

    type User {
        id: Int
        userName: String
        isDisabled: Boolean
        userInfo: String
        userDateOfBirth: String
        createdAt: Int
        city:City
        area:Area
        phones:[Phone]
        photos:[Photo]
        announcements:[Announcement]
        messages:[Message]
        favourite:[Like]
    }

    type Area{
        id: Int
        areaName: String
    }

    type Category{
        id: Int
        categoryName: String
    }

    type City{
        id: Int
        cityName: String
        areaId: Int
    }

    type Currency{
        id: Int 
        currencyName: String
        currencySymbol:String
    }
    
    type Message{
        id: Int
        text: String
        createdAt:Int
        updatedAt:Int
        inId: Int
        outId: Int
    }

    type Like{
        id:Int
        announcement:Announcement
        userId: Int
        createdAt: String
    }
     
    type Phone{
        id:Int
        phone: String
        userId: Int
    }

    type Photo{
        id: Int
        photoLink: String
        createdAt: Int     
        userId:Int
        announcementId:Int
        messageId:Int
    }
    
    type SubCategory{
        id: Int
        subCategoryName: String
        categoryId:Int
    }
`);

// ------------------------------ resolvers---------------------------------------------------------------------------------

async function getAnnouncement({ id }) {
    return await Announcement.findByPk(id)
}

async function searchAnnouncements(obj) {
    let scopeSet = ['defaultScope','withPhoto',{ method: ['findInTitle', "19"] },{method: ['findInBody',"19"] },{ method:['inRange',78,546]}]
    return await Announcement.scope(...scopeSet).findAll()
    return await Announcement.scope('withPhoto',{ method: ['findInTitle', "19"] },{method: ['findInBody',"19"] },{ method:['inRange',78,546]}).findAll()

    // let findAll = await Announcement.scope({ method: ['inRange', 19, 130] }).findAll()
    // let findLess = await Announcement.scope({ method: ['less', 530] }).findAll()
    // let findMore = await Announcement.scope({ method: ['more', 530] }).findAll()

}

async function getAnnouncements() {
    return await Announcement.findAll()
}

async function editAnnouncement(obj) {
    let announcement = await Announcement.findByPk(obj.id);
    return announcement.update({ ...obj }, { where: { id: obj.id } })
}
async function createAnnouncement(obj) {
    return Announcement.create({...obj });
}

async function getUser({ id }) {
    return await User.findByPk(id)
}

async function createUser(obj) {
    return await User.create({ ...obj })
}

async function updateUser(obj) {
    let user = await User.findOne({ where: { id: obj.id } })
    return await user.update({ ...obj }, { where: { id: obj.id } })
}

async function getAreas() {
    return await Area.findAll()
}

async function getArea({id}){
    return await Area.findByPk(id)
}

async function getCategories() {
    return await Category.findAll()
}

async function getCities({ areaId }) {
    return await City.findAll({ where: { areaId } })
}
async function getCurrencies() {
    return await Currency.findAll()
}

async function getMessages({ id }) {
    return await Message.findAll({
        where: {
            [Op.or]: [
                { inId: id },
                { outId: id }
            ]
        }
    })
}

async function createMessage(obj) {
    return await Message.create({ ...obj })
}

async function createLike({ announcementId, userId }) {
    let doLikeExists = await Noted_as_favourite.findAll({ where: { announcementId, userId } });
    if (doLikeExists == false) {
        return await Noted_as_favourite.create({ announcementId, userId })
    } else {
        return await Noted_as_favourite.destroy({ where: { announcementId, userId } })
    }
}
async function getFavourite({ userId }) {
    return await Noted_as_favourite.findAll({ where: { userId } })
}

async function updateMessage(obj) {
    let message = await Message.findOne({ where: { id: obj.id } })
    return await message.update({ ...obj }, { where: { id: obj.id } })
}

async function getPhones({ userId }) {
    return await Phone.findAll({ where: { userId } })
}

async function createPhone(obj) {
    return await Phone.create({ ...obj })
}

async function createPhoto(obj) {
    return await Photo.create({ ...obj })
}

async function getSubCategories({ categoryId }) {
    return await Sub_category.findAll({ where: { categoryId } })
}


//  // -------------------------------------hook up------------------------------------------------------------+++++++++++++++++

var root = {//объект соответствия названий в type Query и type Mutation с функциями-резолверами из JS-кода
    getAnnouncement,
    getAnnouncements,
    searchAnnouncements,
    createAnnouncement,
    editAnnouncement,
    getUser,
    createUser,
    updateUser,
    getAreas,
    getArea,
    getCategories,
    getCities,
    getCurrencies,
    getMessages,
    createMessage,
    updateMessage,
    createLike,
    getFavourite,
    getPhones,
    createPhone,
    createPhoto,
    getSubCategories,
      

};

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.listen(3500, console.log("Listen ### 3500"))





