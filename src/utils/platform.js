import Storage from './storage'
import Manifest from './manifest'
import Utils from './math'
import Modal from '../interaction/modal'
import Template from '../interaction/template'
import Controller from '../interaction/controller'
import Lang from './lang'

function init(){
    let agent = navigator.userAgent.toLowerCase()

    if(agent.indexOf("lampa_client") > -1){
        Storage.set('platform', 'android')
    }
    else if(typeof nw !== 'undefined') {
        Storage.set('platform', 'nw')
    }
    else if(agent.indexOf("electron") > -1) {
        Storage.set('platform', 'electron')
    }
    else if(agent.indexOf("windows nt") > -1 || (agent.indexOf("macintosh") > -1 && !Utils.isTouchDevice())) {
        Storage.set('platform', 'browser')
    }
    else{
        Storage.set('platform','')
    }

    Storage.set('native',Storage.get('platform') ? true : false)
}

/**
 * Какая платформа
 * @returns String
 */
function get(){
    return Storage.get('platform','')
}

/**
 * Если это платформа
 * @param {String} need - какая нужна? android
 * @returns Boolean
 */
function is(need){
    return get() == need ? true : false
}

/**
 * Если хоть одна из платформ android
 * @returns Boolean
 */
function any(){
    return is('android') || macOS() || desktop() ? true : false
}

/**
 * Если это именно телек
 * @returns Boolean
 */
function tv(){
    return false
}

/**
 * Если это NW.js или Electron
 * @returns Boolean
 */
function desktop() {
    return is('nw') || is('electron') ? true : false
}

function macOS(){
    let agent = navigator.userAgent.toLowerCase()

    return agent.indexOf("mac os x") > -1 && !Utils.isTouchDevice()
}

function version(name){
    if (name == 'app') {
        return Manifest.app_version
    } else if (name == 'android') {
        return AndroidJS.appVersion()
    } else {
        return ''
    }
}

function screen(need){
    if(need == 'light'){
        return Storage.field('light_version') && screen('tv')
    }

    let is_tv = true

    if(!tv()){
        if(Storage.get('is_true_mobile', 'false')) is_tv = false
        else if(Boolean(Storage.get('platform', '') == 'apple')) is_tv = false
        else if(Boolean(navigator.userAgent.toLowerCase().match(/iphone|ipad/i))) is_tv = false
        else if(Utils.isTouchDevice()){
            if(!Boolean(navigator.userAgent.toLowerCase().match(/(large screen)|googletv|mibox|mitv|smarttv|google tv/i))){
                let ratio  = window.devicePixelRatio || 1
                let width  = window.innerWidth * ratio
                let height = window.innerHeight * ratio


                is_tv = width > height && width >= 1280
            }
        }
    }
    
    if(need == 'tv') return is_tv
    if(need == 'mobile') return !is_tv

    return false
}

function install(what){
    if($('.modal').length) Modal.close()

    if(what == 'apk'){
        // Create simple install dialog (about template removed)
        let install_html = $(`
            <div class="about">
                <div>${Lang.translate('install_app_apk_text')}</div>
                <div class="about__contacts">
                    <div>
                        <small>Telegram</small><br>
                        @lampa_android
                    </div>
                    <!-- REMOVED: CUB domain link - CUB service removed -->
                </div>
            </div>
        `)

        Modal.open({
            title: '',
            html: install_html,
            size: 'medium',
            onBack: ()=>{
                Modal.close()

                Controller.toggle('content')
            }
        })
    }
}

export default {
    init,
    get,
    any,
    is,
    tv,
    desktop,
    version,
    screen,
    install,
    macOS
}
