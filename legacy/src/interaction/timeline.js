import Template from './template'
import Storage from '../utils/storage'
// REMOVED: import Socket - WebSocket removed, local-only mode
import Utils from '../utils/math'
// REMOVED: import Account from '../utils/account' - CUB feature removed
import Subscribe from '../utils/subscribe'
import Arrays from '../utils/arrays'

let listener = Subscribe()

// REMOVED: Account sync logic - now using local storage only
function filename(){
    // Always use local_timecodes storage (no cloud sync)
    return 'local_timecodes'
}

function update(params){
    if(params.hash == 0) return

    let viewed = Storage.cache(filename(),10000,{})
    let road   = viewed[params.hash]

    if(typeof road == 'undefined' || typeof road == 'number'){
        road = {
            duration: 0,
            time: 0,
            percent: 0,
            profile: 0
        }

        viewed[params.hash] = road
    }

    road.percent = params.percent

    if(typeof params.time !== 'undefined')     road.time     = params.time
    if(typeof params.duration !== 'undefined') road.duration = params.duration
    if(typeof params.profile !== 'undefined')  road.profile  = params.profile

    Storage.set(filename(), viewed)

    let line = $('.time-line[data-hash="'+params.hash+'"]').toggleClass('hide', params.percent ? false : true)

    $('> div', line).css({
        width: params.percent + '%'
    })

    $('.time-line-details[data-hash="'+params.hash+'"]').each(function(){
        let f = format(road)

        $(this).find('[a="t"]').text(f.time)
        $(this).find('[a="p"]').text(f.percent)
        $(this).find('[a="d"]').text(f.duration)
        $(this).toggleClass('hide', road.duration ? false : true)
    })

    listener.send('update', {data:{ hash: params.hash, road }})

    // REMOVED: Socket.send('timeline') - no cloud sync, local storage only
}

function view(hash){
    let viewed = Storage.cache(filename(),10000,{}),
        curent = typeof viewed[hash] !== 'undefined' ? viewed[hash] : 0

    // REMOVED: Account.canSync() - CUB feature removed
    let profile = 0

    let road = {
        percent: 0,
        time: 0,
        duration: 0,
        profile: 0
    }

    if(typeof curent == 'object'){
        road.percent  = curent.percent
        road.time     = curent.time
        road.duration = curent.duration
        road.profile  = curent.profile || profile
    }
    else{
        road.percent = curent || 0
        road.profile = profile
    }

    listener.send('view', {data: { hash, road }})

    return {
        hash: hash,
        percent: road.percent,
        time: road.time,
        duration: road.duration,
        profile: road.profile,
        handler: (percent,time,duration) => update({ hash, percent, time, duration, profile: road.profile })
    }
}

function render(params){
    let line = Template.get('timeline', params)

    line.toggleClass('hide',params.percent ? false : true)

    return line
}

function details(params, str = ''){
    let line = Template.get('timeline_details', format(params))

    if(str) line.prepend(str)

    line.attr('data-hash', params.hash)

    line.toggleClass('hide',params.duration ? false : true)

    return line
}

function watched(card){
    let hash = Lampa.Utils.hash(card.original_name ? [1,1,card.original_name].join('') : card.original_title)

    return view(hash).percent
}

function format(params){
    let road = {
        percent: params.percent + '%',
        time: Utils.secondsToTimeHuman(params.time),
        duration: Utils.secondsToTimeHuman(params.duration)
    }

    return road
}

export default {
    listener,
    render,
    update,
    view,
    details,
    format,
    watched
}
