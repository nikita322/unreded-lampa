import Template from '../../interaction/template'
import Controller from '../../interaction/controller'
import Scroll from '../../interaction/scroll'
import Api from './api'

function Main(){
    let comp
    let scrl = new Scroll({mask:true,over:true,step:200})
    let last

    /**
     * Создать
     */
    this.create = ()=>{
        comp = Template.get('settings_main')

        // REMOVED: account check - account tab already removed from template
        if(!window.lampa_settings.plugins_use) comp.find('[data-component="plugins"]').remove()

        scrl.render().css('max-height', window.innerWidth <= 480 ? window.innerHeight * 0.6 : 'unset')
        scrl.append(comp)
        scrl.addSwipeDown(this.swipeAction)

        this.update()
    }

    /**
     * Обновить события
     */
    this.update = ()=>{
        let components = Api.allComponents()

        for(let name in components){
            let aded = components[name]

            if(!comp.find('[data-component="'+name+'"]').length){
                let item = $(`<div class="settings-folder selector" data-component="${name}">
                    <div class="settings-folder__icon">
                        ${aded.icon}
                    </div>
                    <div class="settings-folder__name">${aded.name}</div>
                </div>`)

                comp.append(item)
            }
        }

        comp.find('.selector').unbind('hover:focus').on('hover:focus',(event)=>{
            last = event.target

            scrl.update($(event.target),true)
        }).unbind('hover:hover hover:touch').on('hover:hover hover:touch',(event)=>{
            last = event.target

            Navigator.focused(event.target)
        }).not('[data-static]').unbind('hover:enter').on('hover:enter',(event)=>{
            let component_name = $(event.target).data('component')

            // Special handling for console - open console controller instead of component
            if(component_name === 'console'){
                Controller.toggle('console')
            }
            else{
                this.render().detach()
                this.onCreate(component_name)
            }
        })
    }

    /**
     * Сделать активным
     */
    this.active = function(){
        Controller.collectionSet(comp)
        Controller.collectionFocus(last,comp)

        scrl.height($('.settings__head'))
    }

    /**
     * Рендер
     * @returns {object}
     */
    this.render = ()=>{
        return scrl.render()
    }
}

export default Main