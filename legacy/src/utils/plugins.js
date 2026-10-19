import Utils from './math'
import Storage from './storage'
import Settings from '../components/settings'
import Arrays from './arrays'
// REMOVED: Account, Noty - CUB feature and notification system removed
import Lang from './lang'
import Extensions from '../interaction/extensions'
import Base64 from './base64'
import Request from './reguest'
import Cache from './cache'
import Manifest from './manifest'
import Status from './status'

let _created = []
let _loaded  = []
let _network = new Request()
// REMOVED: let _blacklist = [] - blacklist functionality removed
let _delay_send = []
let _delay_timer

/**
 * Запуск
 */
function init(){
    _loaded = Storage.get('plugins','[]')

    Settings.main().render().find('[data-component="plugins"]').unbind('hover:enter').on('hover:enter',()=>{
        Extensions.show()
    })
}

function get(){
    return _loaded.map(a=>a)
}

function modify(){
    let list = Storage.get('plugins','[]')

    list = list.map(a=>{
        return typeof a == 'string' ? {url: a, status: 1} : a
    })

    // REMOVED: CUB domain replacement - CUB removed
    // list.forEach(a=>{
    //     a.url = (a.url + '').replace('cub.watch', Manifest.cub_domain)
    // })

    console.log('Plugins','modify:', list)

    Storage.set('plugins', list)
}

function remove(plug){
    Arrays.remove(_loaded, plug)

    console.log('Plugins','remove:', plug, 'index:', _loaded.indexOf(plug) ,'from:', _loaded)

    Storage.set('plugins', _loaded)
}

function add(plug){
    _loaded.push(plug)

    console.log('Plugins','add:', plug)

    Storage.set('plugins', _loaded)

    push(plug)
}

function push(plug){
    let find = _created.find(a=>a == plug.url)

    if(!find && plug.status == 1){
        // REMOVED: blacklist check - blacklist functionality removed

        _created.push(plug.url)

        console.log('Plugins','push:', plug)

        Utils.putScriptAsync([addPluginParams(plug.url)],false,()=>{
            // REMOVED: Noty.show( - Notification system removed: // Lang.translate('plugins_check_fail'),{time: 8000})
        },()=>{
            updatePluginDB(plug.url, addPluginParams(plug.url))

            // REMOVED: Noty.show( - Notification system removed: // Lang.translate('plugins_add_success'))
        },false)
    }
}

function save(){
    console.log('Plugins','save:', _loaded)

    Storage.set('plugins', _loaded)
}

function updatePluginDB(name, url){
    let cu = Utils.addUrlComponent(url, 'cache=true')

    _network.native(cu,(str)=>{
        Cache.rewriteData('plugins', name, str).then(()=>{
            console.log('Plugins','update plugin cache:', name)
        }).catch((e)=>{
            console.log('Plugins','add to cache fail:', name, typeof e == 'string' ? e : e ? e.message : 'no details')
        })
    },false,false,{
        dataType: 'text'
    })
}

function createPluginDB(name){
    Cache.getData('plugins',name).then(code=>{
        if(code){
            let s = document.createElement('script')
                s.type = 'text/javascript'

            try {
                s.appendChild(document.createTextNode(code))
                document.body.appendChild(s)
            }
            catch (e) {
                s.text = code
                document.body.appendChild(s)
            }

            console.log('Plugins','add plugin from cache:', name)
        }
        else console.log('Plugins','no find in cache:', name)
    }).catch(e=>{
        console.log('Plugins','include from cache fail:', name, typeof e == 'string' ? e : e.message)
    })
}

function addPluginParams(url){
    let encode = url

    // REMOVED: encode = encode.replace('cub.watch', Manifest.cub_domain) - CUB domain removed

    if(!/[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}/.test(encode)){
        encode = encode.replace(/\{storage_(\w+|\d+|_|-)\}/g,(match,key)=>{
            return encodeURIComponent(Base64.encode(localStorage.getItem(key) || ''))
        })

        // REMOVED: Account.logged() - CUB feature removed
        // No longer adding email or logged parameters

        encode = Utils.addUrlComponent(encode, 'logged=false')
        encode = Utils.addUrlComponent(encode, 'reset='+Math.random())
        encode = Utils.addUrlComponent(encode, 'origin='+encodeURIComponent(Base64.encode(window.location.host)))

        encode = Utils.rewriteIfHTTPS(encode)
    }

    return encode
}

// REMOVED: loadBlackList, analysisPlugins functions - Blacklist and CUB plugin analysis removed

/**
 * Загрузка всех плагинов
 */
function load(call){
    console.log('Plugins','start load')

    modify()

    // REMOVED: loadBlackList, Account.plugins() - Blacklist and CUB plugins removed

    let plugins = []
    let puts = window.lampa_settings.plugins_use ? plugins.filter(plugin=>plugin.status).map(plugin=>plugin.url).concat(Storage.get('plugins','[]').filter(plugin=>plugin.status).map(plugin=>plugin.url)) : []

    // REMOVED: modification.js plugin - file does not exist

    puts = puts.filter((element, index) => {
        return puts.indexOf(element) === index
    })

    console.log('Plugins','load list:', puts)

    // REMOVED: blacklist filtering - functionality completely removed

    console.log('Plugins','final list:', puts)

    let errors   = []
    let original = {}
    let include  = []

    puts.forEach(url=>{
        let encode = addPluginParams(url)

        include.push(encode)

        original[encode] = url
    })

    Utils.putScriptAsync(include,()=>{
        call()

        if(errors.length){
            setTimeout(()=>{
                // REMOVED: Noty.show( - Notification system removed: // Lang.translate('plugins_no_loaded') + ' ('+errors.join(', ')+')',{time: 6000})
            },2000)
        }
    },(u)=>{
        if(u.indexOf('modification.js') == -1){
            console.log('Plugins','error:', original[u])

            errors.push(original[u])

            createPluginDB(original[u], u)
        }
    },(u)=>{
        console.log('Plugins','include:', original[u])

        _created.push(original[u])

        updatePluginDB(original[u], u)

        // REMOVED: analysisPlugins call
    },false)
}

export default {
    init,
    load,
    remove,
    loaded: ()=>_created,
    add,
    get,
    save,
    push
}
