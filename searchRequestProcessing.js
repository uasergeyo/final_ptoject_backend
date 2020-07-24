// let searchRequest = {
//             areaName:"Beликобобруйская обл.",
//             cityName:"Великобобруйск",
//             categoryName:"trst",
//             subCategoryName:"test_Subcategory",
//             hasPhoto:true,
//             hasDelivery:true,
//             priceFrom:121,
//             priceTo:435,
//             sort:"price",
//             currency:1,
//             findEverywhere:true,
//         }
//         requestParamsCreator(searchRequest)  

        // areaId:Int,cityId:Int,categoryId:Int,subCategoryId:Int,currencyId:Int,
        // ['defaultScope','withPhoto',{ method: ['findInTitle', "19"] },{method: ['findInBody',"19"] },{ method:['inRange',78,546]}]

module.exports = function requestParamsCreator(obj){
            let queryParams = {"order":[["id", 'DESC']]};
            let paramsForDbSearch ={};
            let scopesForSearch=['defaultScope',]
            try{
            for(let i in obj){
                if(obj[i]){
                    switch(i){
                        case "requestText":
                            if(obj.findEverywhere){
                                scopesForSearch.push({method: ['findInBody',obj["requestText"]] }) 
                            }else{
                                scopesForSearch.push({ method: ['findInTitle',  obj["requestText"]]})
                            }
                            break;
                        case "areaId":
                            paramsForDbSearch["areaId"] = obj["areaId"]
                            break;
                        case "cityId":
                            paramsForDbSearch["cityId"] = obj["cityId"]
                            break;
                        case "categoryId":
                            paramsForDbSearch["categoryId"] = obj["categoryId"]
                            break;
                        case "subCategoryId":
                            paramsForDbSearch["subCategoryId"] = obj["subCategoryId"]
                            break;
                        case "hasPhoto":
                            scopesForSearch.push('withPhoto')
                            break;
                        case "hasDelivery":
                            scopesForSearch.push('withDelivery')
                            break;
                        case "sort":
                                queryParams["order"] = [['announcementPrice', 'ASC']]
                            break;
                        case "currencyId":
                            paramsForDbSearch["currencyId"] = obj["currencyId"];
                            break;
                        // case "findEverywhere":            
                        //     // scopesForSearch.push({method: ['findInBody',obj["requestText"]] }) 
                        //     break;
                        case  "priceFrom":
                            if (obj.priceTo){
                                scopesForSearch.push({ method:['inRange',obj.priceFrom,obj.priceTo]}) 
                            }else{
                                scopesForSearch.push({ method: ['more', obj["priceFrom"]] })
                            }
                            break;
                        case "priceTo":
                            if(!obj.priceFrom){
                                scopesForSearch.push({ method: ['less', obj["priceTo"]] })
                            }
                            break;
                        
                    }
                }
            } 
            console.log([scopesForSearch,{where:paramsForDbSearch,...queryParams}]) 
            return [scopesForSearch,{where:paramsForDbSearch,...queryParams}]
        }catch(e){
            console.log("SearchRequestProcessing",e)
        }

            // "order" in queryParams?console.log("with sort  ",[scopesForSearch,{where:paramsForDbSearch,...queryParams}][1]):console.log("without SORT ",[scopesForSearch,paramsForDbSearch]);
            // return "order" in queryParams?[scopesForSearch,{where:paramsForDbSearch,...queryParams}]:[scopesForSearch,paramsForDbSearch];
            // return [scopesForSearch,{where:paramsForDbSearch,...queryParams}]
        }