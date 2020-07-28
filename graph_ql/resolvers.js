const { Photo, User, Phone, Announcement, Noted_as_favourite, Message, Area, City, Currency, Category, Sub_category, } = require('../database/schema.js')
let requestParamsCreator = require('../searchRequestProcessing.js')
const secret = require('../constants/salt')
const unauthorizedUser = require('../constants/unauthorizedUser')
const jwt = require('jsonwebtoken');
// const isAuth = require('../middleware/isAuth')

// const Sequelize = require('../node_modules/sequelize');
// const { Op } = require("../node_modules/sequelize");

async function getAnnouncement({ id }) {
    return await Announcement.findByPk(id)
}


async function searchAnnouncements({ limit, offset, ...rest }) {     ///+++++++
    try {
        let credentials = requestParamsCreator(rest)
        return await Announcement.scope([...credentials[0]]).findAndCountAll({ ...credentials[1], limit, offset })
    } catch (e) {
        console.log("Resolvers searchAnnouncements", e)
    }
    // let credentials = requestParamsCreator(obj)
    // console.log("My data ",obj)
    // let scopeSet = ['defaultScope','withPhoto',{ method: ['findInTitle', "19"] },{method: ['findInBody',"19"] },{ method:['inRange',78,546]}]

    // return await Announcement.scope([...credentials[0]]).findAll({...credentials[1]})

    // return await Announcement.scope(...scopeSet).findAll({where:{areaId:3,cityId:1,categoryId:3,subCategoryId:4,currencyId:1}})
    // return await Announcement.scope('withPhoto',{ method: ['findInTitle', "19"] },{method: ['findInBody',"19"] },{ method:['inRange',78,546]}).findAll()

    // // let findAll = await Announcement.scope({ method: ['inRange', 19, 130] }).findAll()
    // // let findLess = await Announcement.scope({ method: ['less', 530] }).findAll()
    // // let findMore = await Announcement.scope({ method: ['more', 530] }).findAll()

}

async function getAnnouncements({ limit, offset }) {      ///+++++++++++++++
    // console.log(limit,'sdsdsdsd',offset)
    return await Announcement.findAndCountAll({
        // let i=await Announcement.findAndCountAll({
        // where: {...},
        // order: [...],
        limit,
        offset,
    })
    // getAnnouncements(limit:Int):[Announcement]
    // console.log("getAnnouncements(limit:Int):[Announcement]",i)


}

// async function getAnnouncements() {         ///+++++++++++++++
//     return await Announcement.findAll()
// }

async function editAnnouncement(obj, req) {          ///+++++++
    if (req.isAuth && req.userId == obj.userId) {
        try {
            let announcement = await Announcement.findByPk(obj.id);
            return await announcement.update({ ...obj }, { where: { id: obj.id } })
        } catch (e) {
            console.log('resolvers editAnnouncement ', e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

async function createAnnouncement({ photoLink, ...data }, req) {   ///+++++++
    if (req.isAuth) {
        try {
            let user = await User.findByPk(req.userId)
            let announcement = await user.createAnnouncement({ ...data })
            if (photoLink.length) {
                for (let a of photoLink)
                    await announcement.createPhoto({ photoLink: a })
            }
            return announcement
        } catch (e) {
            console.log("Resolvers create annoncement ", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

// async function getUser({ id }) {
//     try {
//         return await User.findByPk(id)
//     } catch (e) {
//         console.log('resolvers getUser', e)
//     }
// }

async function getUser({ id }, req) {
    if (req.isAuth) {
        try {
            return await User.findByPk(req.userId)
        } catch (e) {
            console.log('resolvers getUser', e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}


async function createUser(obj) {
    const doUserExists = await User.findOne({ where: { userEmail: obj.userEmail } });
    if (doUserExists) {
        throw new Error('Этот email уже используется !')
    } else {
        try {
            return await User.create({ ...obj })
        } catch (e) {
            console.log("Resolvers createUser ", e)
        }
    }
}
async function logInAuth({ userEmail, userPassword }) {
    const user = await User.findOne({ where: { userEmail, isDisabled: false } });
    if (!user) {
        throw new Error('Пользователя не существует !');
    }
    const isEqual = userPassword === user.userPassword;
    if (!isEqual) {
        throw new Error('Неверный пароль !');
    }
    const token = jwt.sign(
        { id: user.id, userName: user.userName }, secret);
    return { id: user.id, token: token };
}

async function updateUser(obj, req) {
    if (req.isAuth) {
        console.log(obj,obj.userEmail)
        if (obj.userEmail) {
            let users = await User.findAll({ where: { userEmail: obj.userEmail } })
            if (users.length > 0 && users[0].dataValues.id !== req.userId) {
                throw new Error('Этот email уже используется !')
            } else {
                try {
                    let user = await User.findByPk(req.userId)
                    return await user.update({ ...obj })
                } catch (e) {
                    console.log("resolvers updateUser", e)
                }
            }
        } else {
            try {
                let user = await User.findByPk(req.userId)
                return await user.update({ ...obj })
            } catch (e) {
                console.log("resolvers updateUser", e)
            }
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

async function getAreas() {
    try {
        return await Area.findAll()
    } catch (e) {
        console.log("resolvers getAreas ", e)
    }
}

async function getCategories() {
    return await Category.findAll()
}

async function getCurrencies() {
    try {
        return await Currency.findAll()
    } catch (e) {
        console.log('resolveers getCurrencies', e)
    }
}

async function createMessage(obj, req) {
    if (req.isAuth) {
        try {
            obj.outId = req.userId;
            return await Message.create({ ...obj })
        } catch (e) {
            console.log("Resolvers createMessage ", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

async function createLike({ announcementId }, { isAuth, userId }) {
    if (isAuth) {
        try {
            let doLikeExists = await Noted_as_favourite.findAll({ where: { announcementId, userId } });
            if (doLikeExists == false) {
                return await Noted_as_favourite.create({ announcementId, userId })
            } else {
                await Noted_as_favourite.destroy({ where: { announcementId, userId } })
                return undefined
            }
        } catch (e) {
            console.log('Resolvers  createLike', e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }

}

async function getPhones({ userId }) {
    return await Phone.findAll({ where: { userId } })
}

async function getUserPhotos({ userId }) {
    return await Photo.findAll({ where: { userId } })
}

async function createPhone(obj, req) {
    if (req.isAuth) {
        try {
            let phone = await Phone.create({ ...obj })
            if (phone) {
                return await Phone.findAll({ where: { userId: req.userId } })
            }
        } catch (e) {
            console.log("resolvers removeUser", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

async function createPhoto(obj, req) {
    if (req.isAuth) {
        try {
            return await Photo.create({ ...obj })
        } catch (e) {
            console.log("resolvers createPhoto", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

async function getSubCategories({ categoryId }, context) {
    return await Sub_category.findAll({ where: { categoryId } })
}

async function removeUser(obj, req) {
    if (req.isAuth) {
        try {
            let user = await User.findByPk(obj.id)
            if (user) {
                await Announcement.update({ isDisabled: true }, { where: { userId: obj.id } })
                return await user.update({ isDisabled: true })
            } else {
                return null
            }
        } catch (e) {
            console.log("resolvers removeUser", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

async function removePhone(obj, req) {
    if (req.isAuth) {
        try {
            await Phone.destroy({ where: { id: obj.id } })
            return await Phone.findAll({ where: { userId: req.userId } })

        } catch (e) {
            console.log("resolvers removePhone", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

async function removePhoto(obj, req) {
    if (req.isAuth) {
        try {
            let photo = await Photo.findByPk(obj.id)
            let isDestroyed = await Photo.destroy({ where: { id: obj.id } })
            if (isDestroyed) {
                return photo
            } else {
                return null
            }
        } catch (e) {
            console.log("resolvers removePhoto", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}
async function setPhotoMain(obj, req) {
    if (req.isAuth) {
        try {
            if (obj.userId) {
                await Photo.update({ isMain: false }, { where: { userId: obj.userId } })
                await Photo.update({ isMain: true }, { where: { id: obj.id } })
                return await Photo.findAll({ where: { userId: obj.userId } })
            } else if (obj.announcementId) {
                await Photo.update({ isMain: false }, { where: { announcementId: obj.announcementId } })
                await Photo.update({ isMain: true }, { where: { id: obj.id } })
                return await Photo.findAll({ where: { announcementId: obj.announcementId } })
            }
        } catch (e) {
            console.log("resolvers removePhoto", e)
        }
    } else {
        throw new Error(unauthorizedUser)
    }
}

var root = {//объект соответствия названий в type Query и type Mutation с функциями-резолверами из JS-кода
    getAnnouncement,
    getAnnouncements,
    searchAnnouncements,
    createAnnouncement,
    editAnnouncement,
    getUser,
    createUser,
    logInAuth,
    updateUser,
    getAreas,
    // getArea,
    getCategories,
    // getCities,
    getCurrencies,
    // getMessages,
    createMessage,
    // updateMessage,
    createLike,
    // getFavourite,
    getPhones,
    createPhone,
    createPhoto,
    getSubCategories,
    removeUser,
    removePhone,
    removePhoto,
    getUserPhotos,
    setPhotoMain,
};

module.exports.root = root;
// module.exports.getUser = getUser;
// module.exports.searchAnnouncements = searchAnnouncements;
// module.exports.getAreas = getAreas;
// module.exports.getArea = getArea;
// module.exports.editAnnouncement = editAnnouncement
// module.exports.createAnnouncement = createAnnouncement