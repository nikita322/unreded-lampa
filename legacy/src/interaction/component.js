import main from '../components/main'
import full from '../components/full'
import category_full from '../components/category/full'
import category from '../components/category/main'
import actor from '../components/person'
import favorite from '../components/favorite'
import torrents from '../components/torrents'
import mytorrents from '../components/mytorrents'
import nocomponent from '../components/nocomponent'
// REMOVED: import timetable from '../components/timetable' - Timetable component removed
// REMOVED: import subscribes from '../components/subscribes' - CUB subscriptions removed
import company from '../components/company'
// REMOVED: import feed from '../components/feed' - CUB feed system removed
import bookmarks from '../components/bookmarks'
import episodes from '../components/episodes'
// REMOVED: import myperson from '../components/myperson' - Persons component removed

let component = {
    main,
    full,
    category,
    category_full,
    actor,
    favorite,
    torrents,
    mytorrents,
    nocomponent,
    // REMOVED: timetable - Timetable component removed
    // REMOVED: subscribes - CUB subscriptions removed
    company,
    // REMOVED: feed - CUB feed system removed
    bookmarks,
    episodes
    // REMOVED: myperson - Persons component removed
}

/**
 * Создать компонент
 * @param {{component:string}} object 
 * @returns 
 */
function create(object){
    if(component[object.component]){
        try{
            return new component[object.component](object)
        }
        catch(e){
            console.log('Component','create error',e.stack)

            return new component.nocomponent(object)
        }
    }
    else{
        return new component.nocomponent(object)
    }
}

/**
 * Добавить
 * @param {string} name 
 * @param {class} comp 
 */
function add(name, comp){
    component[name] = comp
}

/**
 * Получить компонент
 * @param {string} name 
 * @returns {class}
 */
function get(name){
    return component[name]
}

export default {
    create,
    add,
    get
}