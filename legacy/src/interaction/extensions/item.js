import Template from '../template'
import Lang from '../../utils/lang'

class Item{
    constructor(data, params){
        this.data    = data
        this.params  = params
    }

    create(){
        this.html = Template.js(this.template,{})

        this.html.addEventListener('visible',this.visible.bind(this))
    }

    update(){
        let url = (this.data.url || this.data.link) + ''
        let loc = url.slice(0, 6) == 'https:' || window.location.protocol == 'https:'
        let hts = url.slice(0, 6) == 'https:' || url.slice(0, 5) == 'http:'

        if(window.location.protocol == 'https:' && hts) url = url.replace(/(http:\/\/|https:\/\/)/g, 'https://')

        this.html.querySelector('.extensions__item-name').innerText    = this.data.name || Lang.translate('extensions_no_name')
        // REMOVED: '@cub' default author - now always uses '@lampa' as default
        this.html.querySelector('.extensions__item-author').innerText  = this.data.author || '@lampa'
        this.html.querySelector('.extensions__item-descr').innerText   = (this.data.descr || url).replace(/\n|\t|\r/g,' ')

        let proto = $('.extensions__item-proto')

        if (proto && hts) {
            proto.toggleClass('hide', !Boolean(this.params.type == 'plugins' || this.params.type == 'installs'))
            proto.addClass('protocol-' + (loc ? 'https' : 'http'))
        }

        let status = this.html.querySelector('.extensions__item-disabled')

        status.innerText = Lang.translate('player_disabled')

        if(this.data.status || !this.params.autocheck) status.classList.add('hide')
        else status.classList.remove('hide')
    }

    // REMOVED: cub() method - CUB badge display removed
    // Previously added a "CUB" badge to extensions from CUB marketplace

    visible(){
        this.update()
    }

    render(){
        return this.html
    }

    destroy(){
        this.html.remove()
    }
}

export default Item