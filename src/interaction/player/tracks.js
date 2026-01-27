import Template from '../template'
import Lang from '../../utils/lang'
import Arrays from '../../utils/arrays'

let list_opened = false
let logs = true

function reguest(params, callback){
    // Работаем только с предоставленными данными ffprobe, без запросов к серверам
    if(params.ffprobe && params.ffprobe.streams){
        setTimeout(()=>{
            callback({streams: params.ffprobe.streams})
        },200)
    }
    else{
        // Если данных нет - возвращаем пустой результат
        setTimeout(()=>{
            callback({streams: []})
        },200)
    }
}

function subscribeTracks(data){
    let inited        = false
    let inited_parse  = false

    function log(){
        if(logs) console.log.apply(console.log, arguments)
    }

    function getTracks(){
        let video = Lampa.PlayerVideo.video()

        return video.audioTracks || []
    }

    function getSubs(){
        let video = Lampa.PlayerVideo.video()

        return video.textTracks || []
    }

    log('Tracks', 'start')

    function setTracks(){
        if(inited_parse){
            let new_tracks   = []
            let video_tracks = getTracks()
            let parse_tracks = inited_parse.streams.filter(a=>a.codec_type == 'audio')
            let minus        = 1

            log('Tracks', 'set tracks:', video_tracks.length)

            if(parse_tracks.length !== video_tracks.length) parse_tracks = parse_tracks.filter(a=>a.codec_name !== 'dts')

            parse_tracks = parse_tracks.filter(a=>a.tags)

            log('Tracks', 'filtred tracks:', parse_tracks.length)

            parse_tracks.forEach(track=>{
                let orig = video_tracks[track.index - minus]
                let elem = {
                    index: track.index - minus,
                    language: track.tags.language,
                    label: track.tags.title || track.tags.handler_name,
                    ghost: orig ? false : true,
                    selected: orig ? orig.selected == true || orig.enabled == true : false
                }

                console.log('Tracks','tracks original', orig)

                Object.defineProperty(elem, "enabled", {
                    set: (v)=>{
                        if(v){
                            let aud = getTracks()
                            let trk = aud[elem.index]

                            for(let i = 0; i < aud.length; i++){
                                aud[i].enabled  = false
                                aud[i].selected = false
                            }

                            if(trk){
                                trk.enabled  = true
                                trk.selected = true
                            }
                        }
                    },
                    get: ()=>{}
                })

                new_tracks.push(elem)
            })

            if(parse_tracks.length) Lampa.PlayerPanel.setTracks(new_tracks)
        }
    }

    function setSubs(){
        if(inited_parse){
            let new_subs   = []
            let video_subs = getSubs()
            let parse_subs = inited_parse.streams.filter(a=>a.codec_type == 'subtitle')
            let minus      = inited_parse.streams.filter(a=>a.codec_type == 'audio').length + 1

            log('Tracks', 'set subs:', video_subs.length)

            parse_subs = parse_subs.filter(a=>a.tags)

            log('Tracks', 'filtred subs:', parse_subs.length)

            parse_subs.forEach(track=>{
                let orig = video_subs[track.index - minus]
                let elem = {
                    index: track.index - minus,
                    language: track.tags.language,
                    label: track.tags.title || track.tags.handler_name,
                    ghost: video_subs[track.index - minus] ? false : true,
                    selected: orig ? orig.selected == true || orig.mode == 'showing' : false
                }

                console.log('Tracks','subs original', orig)

                Object.defineProperty(elem, "mode", {
                    set: (v)=>{
                        if(v){
                            let txt = getSubs()
                            let sub = txt[elem.index]

                            for(let i = 0; i < txt.length; i++){
                                txt[i].mode = 'disabled'
                                txt[i].selected = false
                            }

                            if(sub){
                                sub.mode = 'showing'
                                sub.selected = true
                            }
                        }
                    },
                    get: ()=>{}
                })

                new_subs.push(elem)
            })

            if(parse_subs.length) Lampa.PlayerPanel.setSubs(new_subs)
        }
    }

    function listenTracks(){
        log('Tracks', 'tracks video event')

        setTracks()

        Lampa.PlayerVideo.listener.remove('tracks',listenTracks)
    }

    function listenSubs(){
        log('Tracks', 'subs video event')

        setSubs()

        Lampa.PlayerVideo.listener.remove('subs',listenSubs)
    }

    function canPlay(){
        log('Tracks', 'canplay video event')

        setTracks()
        setSubs()

        Lampa.PlayerVideo.listener.remove('canplay',canPlay)
    }

    function listenStart(){
        inited = true

        reguest(data,(result)=>{
            log('Tracks', 'parsed', inited_parse)

            inited_parse = result

            if(inited){
                setSubs()
                setTracks()
            }
        })
    }

    function listenDestroy(){
        inited = false

        Lampa.Player.listener.remove('destroy',listenDestroy)
        Lampa.PlayerVideo.listener.remove('tracks',listenTracks)
        Lampa.PlayerVideo.listener.remove('subs',listenSubs)
        Lampa.PlayerVideo.listener.remove('canplay',canPlay)

        log('Tracks', 'end')
    }

    Lampa.Player.listener.follow('destroy',listenDestroy)
    Lampa.PlayerVideo.listener.follow('tracks',listenTracks)
    Lampa.PlayerVideo.listener.follow('subs',listenSubs)
    Lampa.PlayerVideo.listener.follow('canplay',canPlay)

    listenStart()
}

function parseMetainfo(data){
    let loading  = Template.get('tracks_loading')

    data.item.after(loading)

    reguest(data.element,(result)=>{
        if(list_opened){
            let video = []
            let audio = []
            let subs  = []

            let codec_video = result.streams.filter(a=>a.codec_type == 'video')
            let codec_audio = result.streams.filter(a=>a.codec_type == 'audio')
            let codec_subs  = result.streams.filter(a=>a.codec_type == 'subtitle')

            codec_video.slice(0,1).forEach(v=>{
                let line = {}

                if(v.width && v.height) line.video = v.width + 'х' + v.height

                if(v.duration){
                    line.duration = new Date(v.duration * 1000)
                    .toISOString()
                    .slice(11, 19);
                }
                else if(v.tags){
                    if(v.tags.DURATION){
                        line.duration = v.tags.DURATION ? v.tags.DURATION.split(".") : ''
                        line.duration.pop()
                    }
                    else if(v.tags["DURATION-eng"]){
                        line.duration = v.tags["DURATION-eng"] ? v.tags["DURATION-eng"].split(".") : ''
                        line.duration.pop()
                    }
                }
                if(v.codec_name)        line.codec = v.codec_name.toUpperCase()
                if(Boolean(v.is_avc))   line.avc = 'AVC'
                let bit = v.bit_rate ? v.bit_rate : v.tags && (v.tags.BPS || v.tags["BPS-eng"]) ? v.tags.BPS || v.tags["BPS-eng"] : '--'
                line.rate = bit == '--' ? bit : Math.round(bit/1000000) + ' ' + Lang.translate('speed_mb')

                if(Arrays.getKeys(line).length) video.push(line)
            })

            codec_audio.forEach((a,i)=>{
                let line = {num: i+1}

                if(a.tags){
                    line.lang = (a.tags.language || '').toUpperCase()
                }

                line.name = a.tags ? (a.tags.title || a.tags.handler_name) : ''

                if(a.codec_name) line.codec = a.codec_name.toUpperCase()
                if(a.channel_layout) line.channels = a.channel_layout.replace('(side)','').replace('stereo','2.0').replace('8 channels (FL+FR+FC+LFE+SL+SR+TFL+TFR)','7.1')

                let bit = a.bit_rate ? a.bit_rate : a.tags && (a.tags.BPS || a.tags["BPS-eng"]) ? a.tags.BPS || a.tags["BPS-eng"] : '--'

                line.rate = bit == '--' ? bit : Math.round(bit/1000) + ' ' + Lang.translate('speed_kb')

                if(Arrays.getKeys(line).length) audio.push(line)
            })

            codec_subs.forEach((a,i)=>{
                let line = {num: i+1}

                if(a.tags){
                    line.lang = (a.tags.language || '').toUpperCase()
                }

                line.name = a.tags ? (a.tags.title || a.tags.handler_name) : ''
                if(a.codec_name) line.codec = a.codec_name.toUpperCase().replace('SUBRIP', 'SRT').replace('HDMV_PGS_SUBTITLE', 'HDMV PGS').replace('MOV_TEXT', 'MOV TEXT')

                if(Arrays.getKeys(line).length) subs.push(line)
            })


            let html = Template.get('tracks_metainfo',{})

            function append(name, fields){
                if(fields.length){
                    let block = Template.get('tracks_metainfo_block',{})

                    block.find('.tracks-metainfo__label').text(Lang.translate(name == 'video' ? 'extensions_hpu_video' : name == 'audio' ? 'player_tracks' : 'player_' + name))

                    fields.forEach(data=>{
                        let item = $('<div class="tracks-metainfo__item tracks-metainfo__item--'+name+' selector"></div>')

                        item.on('hover:focus',(e)=>{
                            Lampa.Modal.scroll().update(item)
                        })

                        for(let i in data){
                            let div = $('<div class="tracks-metainfo__column--'+i+'"></div>')

                            div.text(data[i])

                            item.append(div)
                        }


                        block.find('.tracks-metainfo__info').append(item)
                    })

                    html.append(block)
                }
            }

            append('video',video)
            append('audio',audio)
            append('subs',subs)

            loading.remove()

            if(video.length || audio.length || subs.length){
                data.item.after(html)
            }

            if(Lampa.Controller.enabled().name == 'modal') Lampa.Controller.toggle('modal')
        }
    })
}

function init(){
    Lampa.Player.listener.follow('start', (data)=>{
        if(data.torrent_hash) subscribeTracks(data)
    })

    Lampa.Listener.follow('torrent_file', (data)=>{
        if(data.type == 'list_open')  list_opened = true
        if(data.type == 'list_close') list_opened = false

        if(data.type == 'render' && data.items.length == 1 && list_opened){
            parseMetainfo(data)
        }
    })

    Template.add('tracks_loading', `
        <div class="tracks-loading">
            <span>#{loading}...</span>
        </div>
    `)

    Template.add('tracks_metainfo', `
        <div class="tracks-metainfo"></div>
    `)

    Template.add('tracks_metainfo_block', `
        <div class="tracks-metainfo__line">
            <div class="tracks-metainfo__label"></div>
            <div class="tracks-metainfo__info"></div>
        </div>
    `)
}

export default { init }
