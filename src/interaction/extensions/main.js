import Template from '../template'
import Scroll from '../scroll'
import Controller from '../controller'
import Status from '../../utils/status'
import Line from './line'
import Layer from '../../utils/layer'
import Arrays from '../../utils/arrays'
import Plugins from '../../utils/plugins'
// REMOVED: import Account - CUB account system removed
import Lang from '../../utils/lang'
import Add from './add'
import Extension from './extension'
import HeadBackward from '../head_backward'
import Reguest from '../../utils/reguest'

class Main{
    constructor(params){
        this.items  = []
        this.active = 0
        this.params = params
    }

    create(){
        this.html = Template.js('extensions')

        this.scroll = new Scroll({
            mask: true
        })

        this.scroll.onWheel = (step)=>{
            if(step > 0) this.down()
            else this.up()
        }

        this.scroll.append(HeadBackward(Lang.translate('settings_main_plugins'),true))

        this.scroll.height()

        this.html.querySelector('.extensions__body').appendChild(this.scroll.render(true))

        if(this.params.store) this.loadCustomStore()
        else this.load()
    }

    add(){
        let add = new Add()
        let line = this.items[0]

        add.onAdd = (url)=>{
            if(url){
                let data   = {url:url, status: 1}
                let plugin = new Extension(data, {type: 'installs', autocheck: true})
                    plugin.create()

                Plugins.add(data)

                $(add.render()).after(plugin.render())

                line.last = add.render()

                Layer.visible(line.render())

                line.toggle()
            }
            else{
                line.toggle()
            }
        }

        line.scroll.body(true).appendChild(add.render())
    }

    loadCustomStore(){
        this.appendLoader()

        let net = new Reguest()

        net.silent(this.params.store, (data)=>{
            this.loader.remove()

            net = null

            if(data.results && data.results.length){
                if(this.params.with_installed){
                    this.appendLine(Plugins.get().reverse(), {
                        title: Lang.translate('extensions_from_memory'),
                        type: 'installs',
                        autocheck: true 
                    })
                }

                data.results.forEach(a=>{
                    this.appendLine(a.results, {
                        title: a.title || Lang.translate('player_unknown'),
                        type: 'extensions',
                        hpu: a.hpu,
                        noedit: true
                    })
                })

                if(this.params.with_installed) this.add()

                this.items.slice(0,3).forEach(i=>i.display())

                Layer.visible(this.html)

                this.toggle()
            }
            else{
                this.error()
            }
        },()=>{
            this.loader.remove()

            net = null

            this.error()
        })
    }

    load(){
        this.appendLoader()

        // REMOVED: CUB extensions loading - only local plugins now
        let status = new Status(1)

        status.onComplite = ()=>{
            this.loader.remove()

            this.appendLine(status.data.installs, {
                title: Lang.translate('extensions_from_memory'),
                type: 'installs',
                autocheck: true
            })

            // REMOVED: CUB plugins, best, all, and list - CUB features removed

            this.add()

            this.items.slice(0,3).forEach(i=>i.display())

            Layer.visible(this.html)

            this.toggle()
        }

        status.append('installs', Plugins.get().reverse())

        // REMOVED: Account.plugins() and Account.extensions() - CUB features removed
    }

    appendLoader(){
        this.loader = document.createElement('div')
        this.loader.classList.add('broadcast__scan')
        this.loader.appendChild(document.createElement('div'))

        this.scroll.body(true).appendChild(this.loader)
    }

    error(){
        let empty = new Lampa.Empty()

        this.scroll.body(true).appendChild(empty.render(true))
    }

    appendLine(data, params){
        let line = new Line(data, params)

        line.onBack = this.onBack.bind(this)
        line.onUp   = this.up.bind(this)
        line.onDown = this.down.bind(this)

        line.onToggle = ()=>{
            this.active = this.items.indexOf(line)

            this.scroll.update(line.render(), true)
        }

        line.create()

        this.scroll.body(true).appendChild(line.render())

        this.items.push(line)
    }

    down(){
        this.active++

        if(this.active <= this.items.length-1) this.items[this.active].toggle()

        this.active = Math.min(this.items.length-1,this.active)
    }

    up(){
        this.active--

        if(this.active >= 0) this.items[this.active].toggle()

        this.active = Math.max(0,this.active)
    }

    render(){
        return this.html
    }

    toggle(){
        Controller.add('extensions',{
            toggle: ()=>{
                Controller.collectionSet(this.html)

                if(this.items.length){
                    this.items[this.active].toggle()
                }
            },
            back: this.onBack
        })
        
        Controller.toggle('extensions')
    }

    destroy(){
        Arrays.destroy(this.items)

        this.scroll.destroy()

        this.html.remove()
    }
}

export default Main