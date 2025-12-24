import Template from "../../interaction/template"
import Controller from '../../interaction/controller'
import Utils from '../../utils/math'
import Api from '../../interaction/api'
import Lang from '../../utils/lang'
// REMOVED: import Account - CUB account system removed
import Request from '../../utils/reguest'
// REMOVED: import Noty from '../../interaction/noty' - Notification system removed
import Storage from '../../utils/storage'
import Arrays from '../../utils/arrays'
import Modal from '../../interaction/modal'
import Manifest from '../../utils/manifest'

function create(data, params = {}){
    let html
    let last
    // REMOVED: subscribed and network - CUB subscriptions removed

    this.create = function(){
        html = Template.get('person_start',{
            name: data.name,
            birthday: data.birthday ? Utils.parseTime(data.birthday).full : Lang.translate('player_unknown'),
            img: data.profile_path ? Api.img(data.profile_path) : data.img || 'img/img_broken.svg',
            place: data.place_of_birth || Lang.translate('player_unknown')
        })

        // REMOVED: this.substatus() - CUB subscriptions removed

        html.find('.button--info').on('hover:enter',()=>{
            if(data.biography){
                Modal.open({
                    title: data.name,
                    size: 'large',
                    html: $('<div class="about">'+data.biography+'</div>'),
                    onBack: ()=>{
                        Modal.close()

                        Controller.toggle('content')
                    },
                    onSelect: ()=>{
                        Modal.close()

                        Controller.toggle('content')
                    }
                })
            }
            // REMOVED: Empty biography notification - Notification system removed
        }).on('hover:focus',(e)=>{
            last = e.target
        })

        // REMOVED: .button--subscribe handler - CUB subscriptions removed
    }

    // REMOVED: this.substatus() method - CUB subscriptions removed

    this.toggle = function(){
        Controller.add('full_start',{
            toggle: ()=>{
                Controller.collectionSet(this.render())
                Controller.collectionFocus(last, this.render())
            },
            update: ()=>{},
            right: ()=>{
                Navigator.move('right')
            },
            left: ()=>{
                if(Navigator.canmove('left')) Navigator.move('left')
                else Controller.toggle('menu')
            },
            down:this.onDown,
            up: this.onUp,
            gone: ()=>{

            },
            back: this.onBack
        })

        Controller.toggle('full_start')
    }

    this.render = function(){
        return html
    }

    this.destroy = function(){
        last = null

        html.remove()
    }
}

export default create