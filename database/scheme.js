const Sequelize = require('sequelize');
const { Op } = require("sequelize");

// const Sequelize = require('../node_modules/sequelize');
// const { Op } = require("../node_modules/sequelize");

const sequelize = new Sequelize('buy_and_sale_db', 'root', 'FGghJfgjFJF56565FgsdDDE45gh', {
    dialect: 'mysql',
    host: 'localhost'
})

class Photo extends Sequelize.Model {

}

Photo.init({
    photoLink: Sequelize.STRING
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
    get messages(){
            return (async () => {
                let ins = await this.getIns();   
                let outs = await this.getOuts();
                return [...ins,...outs]
            })()
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
    },
    // userDateOfBirth: {
    //     type: Sequelize.DATE,
    // }

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
        type: Sequelize.DECIMAL(6,2),
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
            // findInBody(value){
            //     return {
            //         where:{
            //             announcementText:{
            //                 [Op.substring]: value
            //             }
            //         }
            //     }
            // },
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

class Message extends Sequelize.Model {

}

Message.init({
    text: Sequelize.STRING
}, { sequelize, modelName: "message" })

User.hasMany(Message, { as: 'ins', foreignKey: 'inId' });
User.hasMany(Message, { as: 'outs', foreignKey: 'outId' });

Message.belongsTo(User, { as: 'in', sourceKey: 'inId' });
Message.belongsTo(User, { as: 'out', sourceKey: 'outId' });

//--------------------------------------------------------------------------------------------------------------
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
Message.hasMany(Photo);
Photo.belongsTo(Message);

class Currency extends Sequelize.Model {

}

Currency.init({
    currencyName: Sequelize.STRING,
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
    categoryName: Sequelize.STRING
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
//------------------------------------------------------------------------
//------------------------------------------------------------------



class State extends Sequelize.Model {
    
}
State.init({
    stateName: Sequelize.STRING
},{ sequelize, modelName: "state", timestamps: false })

Announcement.hasMany(State)
State.belongsTo(Announcement)

class Brand extends Sequelize.Model {

}
// Brand.init({
//     brandName: Sequelize.STRING
// },{ sequelize, modelName: "brand", timestamps: false })

// Sub_category.hasMany(Brand)
// Brand.belongsTo(Sub_category)

class Type extends Sequelize.Model{

}

Type.init({
    modelName:Sequelize.STRING
},{ sequelize, modelName: "type", timestamps: false })







// class Role extends Sequelize.Model{

// }

// Role.init({
//     roleName:Sequelize.STRING
// },{sequelize, modelName:"role", timestamps:false})

// Role.hasMany(User);
// User.belongsTo(Role);

// User.hasMany(Role);
// Role.belongsTo(User)



// User.belongsToMany(Role,{through:RoleList});
// Role.belongsToMany(User,{through:RoleList});

sequelize.sync();




module.exports.Photo = Photo;
module.exports.User = User;
module.exports.Phone = Phone;
module.exports.Announcement = Announcement;
module.exports.Noted_as_favourite = Noted_as_favourite;
module.exports.Message = Message;
module.exports.Area = Area;
module.exports.City = City;
module.exports.Currency = Currency;
module.exports.Category = Category;
module.exports.Sub_category = Sub_category;
module.exports.Brand = Brand;
module.exports.Type = Type;
module.exports.State = State;
// module.exports.Role = Role;
