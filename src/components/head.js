import Template from '../interaction/template'
import Controller from '../interaction/controller'
import Utils from '../utils/math'
// REMOVED: import Notice from '../interaction/notice' - Notification system removed
import Activity from '../interaction/activity'
import Storage from '../utils/storage'
// REMOVED: import Broadcast from '../interaction/broadcast' - Broadcast system removed
import Platform from '../utils/platform'
import Search from './search'
import Filter from '../interaction/content_filter'
import Modal from '../interaction/modal'
// REMOVED: import Account - CUB account system removed
import Lang from '../utils/lang'
import DeviceInput from '../utils/device_input'
import Processing from '../interaction/processing'

let html
let last
let activi = false

function init(){
    html = Template.get('head')

    html.find('.head__actions').prepend(Processing.render())

    Utils.time(html)

    html.find('.selector').data('controller','head').on('hover:focus',(event)=>{
        last = event.target
    })

    html.find('.open--settings').on('hover:enter',()=>{
        Controller.toggle('settings')
    })

    // REMOVED: html.find('.open--notice').on('hover:enter',Notice.open.bind(Notice)) - Notification system removed

    html.find('.open--search').on('hover:enter',Search.open.bind(Search))

    html.find('.open--filter').on('hover:enter',()=>{
        Filter.show()
    })

    html.find('.head__logo-icon,.head__menu-icon').on('click',(e)=>{
        if(DeviceInput.canClick(e.originalEvent)) Controller.toggle('menu')
    })

    Storage.listener.follow('change',(e)=>{
        if(e.name == 'account'){
            html.find('.open--profile').toggleClass('hide',e.value.token && window.lampa_settings.account_use ? false : true)
        }
        // REMOVED: Premium button toggle - Premium features removed
    })

    html.find('.full-screen').on('hover:enter',()=>{
        Utils.toggleFullscreen()
    }).toggleClass('hide',Platform.tv() || Platform.is('android') || !Utils.canFullScreen())

    // REMOVED: Feed button logic - CUB feed system removed

    // REMOVED: Premium modal - CUB premium system removed

    Controller.add('head',{
        toggle: ()=>{
            Controller.collectionSet(html, false, true)
            Controller.collectionFocus(last, html, true)
        },
        right: ()=>{
            Navigator.move('right')
        },
        left: ()=>{
            if(Navigator.canmove('left')) Navigator.move('left')
            else Controller.toggle('menu')
        },
        down: ()=>{
            Controller.toggle('content')
        },
        back: ()=>{
            Activity.backward()
        }
    })

    // REMOVED: Broadcast button logic - Broadcast system removed (WebSocket dependency)
}

function title(title){
    html.find('.head__title').text(title || '')
}

function render(){
    return html
}

export default {
    render,
    title,
    init
}