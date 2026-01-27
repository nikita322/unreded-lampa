import BaseProvider from './base'
import Reguest from '../../reguest'
import Storage from '../../storage'
import Lang from '../../lang'
import Utils from '../../math'
import Status from '../../status'
import Arrays from '../../arrays'
import MetadataUtils from '../../metadata'

/**
 * CUB Metadata Provider
 *
 * Uses CUB API (tmdb.cub.red) - TMDB proxy with additional features
 * Requires VPN/proxy in blocked regions
 *
 * Original API: https://tmdb.cub.red/
 */
class CUBProvider extends BaseProvider {
    constructor(){
        super()
        this.name = 'CUB'
        this.network = new Reguest()
        this.source = 'cub'
        this.day = 60 * 24 // minutes in day

        // CUB uses TMDB genres
        this.genres = {
            movie: [
                {"id":28,"title":"#{filter_genre_ac}"},
                {"id":12,"title":"#{filter_genre_ad}"},
                {"id":16,"title":"#{filter_genre_mv}"},
                {"id":35,"title":"#{filter_genre_cm}"},
                {"id":80,"title":"#{filter_genre_cr}"},
                {"id":99,"title":"#{filter_genre_dc}"},
                {"id":18,"title":"#{filter_genre_dr}"},
                {"id":10751,"title":"#{filter_genre_fm}"},
                {"id":14,"title":"#{filter_genre_fe}"},
                {"id":36,"title":"#{filter_genre_hi}"},
                {"id":27,"title":"#{filter_genre_ho}"},
                {"id":10402,"title":"#{filter_genre_mu}"},
                {"id":9648,"title":"#{filter_genre_de}"},
                {"id":10749,"title":"#{filter_genre_md}"},
                {"id":878,"title":"#{filter_genre_fa}"},
                {"id":10770,"title":"#{filter_genre_tv}"},
                {"id":53,"title":"#{filter_genre_tr}"},
                {"id":10752,"title":"#{filter_genre_mi}"},
                {"id":37,"title":"#{filter_genre_ve}"}
            ],
            tv: [
                {"id": 10759,"title": "#{filter_genre_aa}"},
                {"id": 16,"title": "#{filter_genre_mv}"},
                {"id": 35,"title": "#{filter_genre_cm}"},
                {"id": 80,"title": "#{filter_genre_cr}"},
                {"id": 99,"title": "#{filter_genre_dc}"},
                {"id": 18,"title": "#{filter_genre_dr}"},
                {"id": 10751,"title": "#{filter_genre_fm}"},
                {"id": 10762,"title": "#{filter_genre_ch}"},
                {"id": 9648,"title": "#{filter_genre_de}"},
                {"id": 10763,"title": "#{filter_genre_nw}"},
                {"id": 10764, "title": "#{filter_genre_rs}"},
                {"id": 10765,"title": "#{filter_genre_hf}"},
                {"id": 10766,"title": "#{filter_genre_op}"},
                {"id": 10767,"title": "#{filter_genre_tc}"},
                {"id": 10768,"title": "#{filter_genre_mp}"},
                {"id": 37,"title": "#{filter_genre_ve}"}
            ]
        }
    }

    getName(){
        return this.name
    }

    getBaseUrl(){
        // Allow custom CUB domain for proxy users
        let custom_domain = Storage.field('cub_domain')
        if(custom_domain) return 'https://tmdb.' + custom_domain

        return 'https://tmdb.cub.red'
    }

    getApiKey(){
        // CUB doesn't need API key for most endpoints
        return ''
    }

    /**
     * Build CUB API URL with parameters
     */
    url(endpoint, params = {}){
        let u = endpoint

        if(params.genres && u.indexOf('genre') == -1) u = this.add(u, 'genre=' + params.genres)
        if(params.page) u = this.add(u, 'page=' + params.page)
        if(params.query) u = this.add(u, 'query=' + encodeURIComponent(params.query))

        if(params.filter){
            for(let i in params.filter){
                u = this.add(u, i + '=' + params.filter[i])
            }
        }

        let email = Storage.get('account', '{}').email || ''

        let fullUrl = Utils.addUrlComponent(this.getBaseUrl() + '/' + u, 'email=' + encodeURIComponent(email))

        // Apply proxy if configured
        return MetadataUtils.applyProxy(fullUrl)
    }

    /**
     * Add parameter to URL
     */
    add(u, params){
        return u + (/\?/.test(u) ? '&' : '?') + params
    }

    /**
     * Make GET request to CUB API
     */
    get(method, params = {}, oncomplite, onerror, cache = false){
        let u = this.url(method, params)

        this.network.silent(u, (json) => {
            json.url = method
            json.source = this.source

            oncomplite(Utils.addSource(json, this.source))
        }, onerror, false, {
            cache: cache
        })
    }

    /**
     * Main page
     */
    main(params = {}, oncomplite, onerror){
        let results = []
        let loaded = 0
        let limit = 6

        const checkComplete = () => {
            loaded++
            if(loaded >= limit){
                oncomplite({
                    results: results,
                    title: 'CUB'
                })
            }
        }

        // Now playing
        this.get('?sort=now_playing', params, (json) => {
            json.title = Lang.translate('title_now_watch')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 2})

        // Latest
        this.get('?sort=latest', params, (json) => {
            json.title = Lang.translate('title_latest')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 2})

        // Fire
        this.get('top/fire/movie', params, (json) => {
            json.title = Lang.translate('title_fire')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 7})

        // High quality
        this.get('?cat=movie&sort=latest&uhd=true', params, (json) => {
            json.title = Lang.translate('title_in_high_quality')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 3})

        // Top 100 movies
        this.get('top/hundred/movie', params, (json) => {
            json.title = Lang.translate('title_top_100') + ' - ' + Lang.translate('menu_movies')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 7})

        // Top 100 TV
        this.get('top/hundred/tv', params, (json) => {
            json.title = Lang.translate('title_top_100') + ' - ' + Lang.translate('menu_tv')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 7})
    }

    /**
     * Category
     */
    category(params = {}, oncomplite, onerror){
        let results = []
        let loaded = 0
        let limit = 5

        const checkComplete = () => {
            loaded++
            if(loaded >= limit){
                oncomplite({
                    results: results,
                    title: params.url
                })
            }
        }

        let airdate = params.url == 'anime' ? '&airdate=' + (new Date()).getFullYear() : ''

        // Now playing
        this.get('?cat=' + params.url + '&sort=now_playing' + airdate, params, (json) => {
            json.title = Lang.translate('title_now_watch')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 2})

        // High quality (or top for anime)
        if(params.url == 'anime'){
            this.get('?cat=' + params.url + '&sort=top', params, (json) => {
                json.title = Lang.translate('title_in_top')
                results.push(json)
                checkComplete()
            }, checkComplete, {life: this.day * 7})
        } else {
            this.get('?cat=' + params.url + '&sort=latest&uhd=true' + airdate, params, (json) => {
                json.title = Lang.translate('title_in_high_quality')
                results.push(json)
                checkComplete()
            }, checkComplete, {life: this.day * 3})
        }

        // Airing (for TV/anime)
        if(params.url == 'tv' || params.url == 'anime'){
            this.get('?cat=' + params.url + '&sort=airing' + airdate, params, (json) => {
                json.title = Lang.translate('title_ongoing')
                results.push(json)
                checkComplete()
            }, checkComplete, {life: this.day * 2})
        } else {
            checkComplete()
        }

        // Popular
        this.get('?cat=' + params.url + '&sort=top' + airdate, params, (json) => {
            json.title = Lang.translate('title_popular')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 3})

        // New this year
        this.get('?cat=' + params.url + '&sort=now&airdate=' + (new Date()).getFullYear(), params, (json) => {
            json.title = Lang.translate('title_new_this_year')
            results.push(json)
            checkComplete()
        }, checkComplete, {life: this.day * 2})
    }

    /**
     * Full card info
     */
    full(params, oncomplite, onerror){
        // CUB uses TMDB for full card info
        // Use direct TMDB API call here
        this.get('3/' + params.method + '/' + params.id, params, (json) => {
            if(json.status_code) return onerror()

            json.source = 'cub'
            oncomplite({
                movie: json
            })
        }, onerror, {life: this.day * 7})
    }

    /**
     * Search
     */
    search(params = {}, oncomplite){
        let results = []
        let loaded = 0

        const checkComplete = () => {
            loaded++
            if(loaded >= 3){
                let items = []

                results.forEach(r => {
                    if(r.results && r.results.length) items.push(r)
                })

                oncomplite(items)
            }
        }

        // Search movies
        this.get('search/movie', params, (json) => {
            json.title = Lang.translate('menu_movies')
            json.type = 'movie'
            results.push(json)
            checkComplete()
        }, checkComplete)

        // Search TV
        this.get('search/tv', params, (json) => {
            json.title = Lang.translate('menu_tv')
            json.type = 'tv'
            results.push(json)
            checkComplete()
        }, checkComplete)

        // Search anime
        this.get('search/anime', params, (json) => {
            json.title = Lang.translate('menu_anime')
            json.type = 'anime'
            results.push(json)
            checkComplete()
        }, checkComplete)
    }

    /**
     * List/pagination
     */
    list(params = {}, oncomplite, onerror){
        let u = this.url(params.url, params)

        this.network.silent(u, (data) => {
            oncomplite(Utils.addSource(data, this.source))
        }, onerror, false, {
            cache: {life: this.day * 2}
        })
    }

    /**
     * Person info - delegate to TMDB
     */
    person(params, oncomplite, onerror){
        // CUB doesn't have person endpoint, would need TMDB provider
        onerror()
    }

    /**
     * Seasons - delegate to TMDB
     */
    seasons(tv, from, oncomplite){
        // CUB doesn't have seasons endpoint, would need TMDB provider
        oncomplite({})
    }

    /**
     * Menu
     */
    menu(params, oncomplite){
        let menu = []

        if(this.genres[params.action]){
            this.genres[params.action].forEach(genre => {
                menu.push({
                    title: Lang.translate(genre.title.replace(/[^a-z_]/g, '')),
                    id: genre.id
                })
            })
        }

        oncomplite(menu)
    }

    /**
     * Get genres
     */
    genres(params, oncomplite, onerror){
        oncomplite({
            genres: this.genres[params.action] || []
        })
    }

    /**
     * Menu category
     */
    menuCategory(params, oncomplite){
        let menu = []

        menu.push({
            title: Lang.translate('title_now_watch'),
            url: '?cat=' + params.action + '&sort=now_playing'
        })

        if(params.action == 'tv'){
            menu.push({
                title: Lang.translate('title_new_episodes'),
                url: '?cat=' + params.action + '&sort=update'
            })
        }

        menu.push({
            title: Lang.translate('title_popular'),
            url: '?cat=' + params.action + '&sort=top'
        })

        menu.push({
            title: Lang.translate('title_latest'),
            url: '?cat=' + params.action + '&sort=latest'
        })

        menu.push({
            title: Lang.translate('title_new_this_year'),
            url: '?cat=' + params.action + '&sort=now'
        })

        menu.push({
            title: Lang.translate('title_hight_voite'),
            url: '?cat=' + params.action + '&sort=latest&vote=7'
        })

        oncomplite(menu)
    }

    /**
     * Company
     */
    company(params, oncomplite, onerror){
        onerror()
    }

    /**
     * Collections
     */
    collections(params, oncomplite, onerror){
        onerror()
    }

    /**
     * Get image URL
     */
    img(path, size){
        if(!path) return ''

        // CUB uses TMDB images
        size = size || 'w500'

        if(path.indexOf('http') === 0) return path

        let imgUrl = 'https://image.tmdb.org/t/p/' + size + path

        // Apply proxy if configured
        return MetadataUtils.applyProxy(imgUrl)
    }

    /**
     * Screensavers
     */
    screensavers(params, oncomplite, onerror){
        oncomplite({results: []})
    }

    /**
     * Clear cache
     */
    clear(){
        this.network.clear()
    }

    /**
     * Discovery
     */
    discovery(){
        return {
            title: 'CUB',
            search: this.search.bind(this),
            params: {
                align_left: true,
                object: {
                    source: 'cub'
                }
            },
            onMore: (params) => {
                // TODO: Implement
            },
            onCancel: this.network.clear.bind(this.network)
        }
    }
}

export default new CUBProvider()
