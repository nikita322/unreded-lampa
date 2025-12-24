import Item from "./item"
import Controller from '../controller'
import Select from '../select'
import Lang from '../../utils/lang'
import Utils from '../../utils/math'
import Storage from '../../utils/storage'
import Screen from '../screensaver'
import Manifest from '../../utils/manifest'
// REMOVED: import Account - CUB account system removed

class Screensaver extends Item{
    constructor(data, params){
        super(data, params)

        this.template = 'extensions_screensaver'

        // REMOVED: CUB extensions - screensavers no longer loaded from CUB domain
        this.link = ''
    }

    update(){
        this.html.querySelector('.extensions__item-name').innerText    = this.data.name || Lang.translate('extensions_no_name')
        this.html.querySelector('.extensions__item-time').innerText    = Utils.parseTime(Date.now()).time

        if(this.active()) this.html.classList.add('active')
        else this.html.classList.remove('active')
    }

    active(){
        // REMOVED: CUB screensavers - always return false as CUB domain is removed
        return false
    }

    visible(){
        super.visible()

        this.img = this.html.querySelector('.extensions__item-image')

        this.img.onload = ()=>{
            this.img.classList.add('loaded')
        }

        this.img.src = Utils.rewriteIfHTTPS(this.data.image)

        this.html.addEventListener('hover:enter',this.menu.bind(this))
    }

    menu(){
        let menu = []
        let controller = Controller.enabled().name

        menu.push({
            title: Lang.translate('extensions_' + (this.active() ? 'disable': 'enable')),
            toggle: true
        })

        menu.push({
            title: Lang.translate('title_watch'),
            watch: true
        })

        Select.show({
            title: Lang.translate('title_action'),
            items: menu,
            onBack: (a)=>{
                Controller.toggle(controller)
            },
            onSelect: (a)=>{
                Controller.toggle(controller)

                if(a.toggle){
                    // REMOVED: CUB screensavers - functionality disabled
                    // CUB domain removed, screensavers no longer available
                }
                else{
                    // REMOVED: CUB screensaver preview - functionality disabled
                    // Screen.show('cub', {url: this.link})
                }
            }
        })
    }

    destroy(){
        super.destroy()

        if(this.img){
            this.img.onload = false
            this.img.onerror = false
        }
    }
}

export default Screensaver