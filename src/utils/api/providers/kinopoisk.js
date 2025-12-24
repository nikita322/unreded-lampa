import BaseProvider from './base'
import Reguest from '../../reguest'
import Storage from '../../storage'
import Lang from '../../lang'
import Arrays from '../../arrays'

/**
 * Kinopoisk Unofficial API Provider
 *
 * Uses: https://kinopoiskapiunofficial.tech/
 * Docs: https://kinopoiskapiunofficial.tech/documentation/api/
 *
 * API Key: Get from https://kinopoiskapiunofficial.tech/
 */
class KinopoiskProvider extends BaseProvider {
    constructor(){
        super()
        this.name = 'Kinopoisk'
        this.network = new Reguest()
        this.genres_map = null
    }

    getBaseUrl(){
        // Use CORS proxy to avoid CORS issues
        return 'https://cors.kp556.workers.dev:8443/https://kinopoiskapiunofficial.tech/api'
    }

    getApiKey(){
        // Get from settings or use default (user should configure their own)
        return Storage.field('kinopoisk_api_key') || ''
    }

    /**
     * Build API URL with headers
     */
    url(endpoint, params = {}){
        let url = this.getBaseUrl() + '/' + endpoint

        // KP API uses URL params for pagination/filters
        if(params.page) url += (url.indexOf('?') > -1 ? '&' : '?') + 'page=' + params.page
        if(params.keyword) url += (url.indexOf('?') > -1 ? '&' : '?') + 'keyword=' + encodeURIComponent(params.keyword)
        if(params.order) url += (url.indexOf('?') > -1 ? '&' : '?') + 'order=' + params.order

        return url
    }

    /**
     * Make request with KP API headers
     */
    get(endpoint, params, oncomplite, onerror){
        let url = this.url(endpoint, params)

        // KP API requires API key in headers
        let headers = {
            'X-API-KEY': this.getApiKey(),
            'Content-Type': 'application/json'
        }

        this.network.silent(url, (json)=>{
            // Convert KP response format to Lampa format
            if(json.items){
                json.results = json.items
                delete json.items
            }
            oncomplite(json)
        }, onerror, false, {headers: headers})
    }

    /**
     * Convert KP film to Lampa card format
     */
    convertToCard(kp_film){
        return {
            id: kp_film.kinopoiskId || kp_film.filmId,
            title: kp_film.nameRu || kp_film.nameOriginal,
            original_title: kp_film.nameOriginal,
            overview: kp_film.description || '',
            poster_path: kp_film.posterUrl || kp_film.posterUrlPreview,
            backdrop_path: null,
            vote_average: kp_film.ratingKinopoisk || kp_film.rating,
            release_date: kp_film.year,
            first_air_date: kp_film.year,
            genre_ids: kp_film.genres ? kp_film.genres.map(g => g.id) : [],
            kinopoisk_id: kp_film.kinopoiskId || kp_film.filmId
        }
    }

    /**
     * Main page
     */
    main(params, oncomplite, onerror){
        let parts = []

        // Top 250 films
        parts.push((call) => {
            this.get('v2.2/films/top?type=TOP_250_BEST_FILMS', {page: 1}, (json) => {
                json.results = json.results.map(this.convertToCard.bind(this))
                json.title = 'Топ 250 фильмов Кинопоиска'
                call(json)
            }, call)
        })

        // Popular films
        parts.push((call) => {
            this.get('v2.2/films/top?type=TOP_100_POPULAR_FILMS', {page: 1}, (json) => {
                json.results = json.results.map(this.convertToCard.bind(this))
                json.title = 'Популярные фильмы'
                call(json)
            }, call)
        })

        // Awaiting films
        parts.push((call) => {
            this.get('v2.2/films/top?type=TOP_AWAIT_FILMS', {page: 1}, (json) => {
                json.results = json.results.map(this.convertToCard.bind(this))
                json.title = 'Ожидаемые фильмы'
                call(json)
            }, call)
        })

        // Return first batch
        if(parts.length){
            let completed = 0
            let results = []

            parts.forEach(part => {
                part((data) => {
                    if(data && data.results) results.push(data)
                    completed++
                    if(completed === parts.length){
                        oncomplite(results)
                    }
                })
            })
        } else {
            onerror()
        }
    }

    /**
     * Category
     */
    category(params, oncomplite, onerror){
        // Similar to main for now
        this.main(params, oncomplite, onerror)
    }

    /**
     * Full card info
     */
    full(params, oncomplite, onerror){
        this.get('v2.2/films/' + params.id, {}, (json) => {
            let fulldata = {
                movie: {
                    id: json.kinopoiskId,
                    title: json.nameRu || json.nameOriginal,
                    original_title: json.nameOriginal,
                    overview: json.description,
                    poster_path: json.posterUrl,
                    backdrop_path: json.coverUrl,
                    vote_average: json.ratingKinopoisk,
                    release_date: json.year,
                    runtime: json.filmLength,
                    genres: json.genres,
                    countries: json.countries,
                    kinopoisk_id: json.kinopoiskId,
                    imdb_id: json.imdbId,
                    source: 'kinopoisk'
                },
                persons: [],
                recomend: {results: []},
                simular: {results: []}
            }

            // Get staff (actors/directors)
            this.get('v1/staff?filmId=' + params.id, {}, (staff) => {
                fulldata.persons = {
                    cast: staff.filter(s => s.professionKey === 'ACTOR'),
                    crew: staff.filter(s => s.professionKey !== 'ACTOR')
                }
                oncomplite(fulldata)
            }, () => {
                oncomplite(fulldata)
            })
        }, onerror)
    }

    /**
     * Search
     */
    search(params, oncomplite, onerror){
        if(!params.query){
            oncomplite([])
            return
        }

        this.get('v2.1/films/search-by-keyword?keyword=' + encodeURIComponent(params.query), {page: 1}, (json) => {
            json.results = json.results.map(this.convertToCard.bind(this))
            json.title = 'Результаты поиска'
            json.type = 'movie'
            oncomplite([json])
        }, () => {
            oncomplite([])
        })
    }

    /**
     * List/pagination
     */
    list(params, oncomplite, onerror){
        // Use appropriate endpoint based on params
        this.get(params.url || 'v2.2/films/top?type=TOP_100_POPULAR_FILMS', params, (json) => {
            json.results = json.results.map(this.convertToCard.bind(this))
            oncomplite(json)
        }, onerror)
    }

    /**
     * Person info
     */
    person(params, oncomplite, onerror){
        this.get('v1/staff/' + params.id, {}, (json) => {
            oncomplite({
                person: {
                    id: json.personId,
                    name: json.nameRu || json.nameEn,
                    profile_path: json.posterUrl,
                    biography: json.facts ? json.facts.join('\n\n') : ''
                },
                credits: {
                    cast: json.films || []
                }
            })
        }, onerror)
    }

    /**
     * Seasons (for TV series)
     */
    seasons(tv, from, oncomplite){
        // KP API has different structure for series
        // This would need series-specific implementation
        oncomplite({})
    }

    /**
     * Menu
     */
    menu(params, oncomplite){
        oncomplite([
            {title: 'Топ 250', url: 'v2.2/films/top?type=TOP_250_BEST_FILMS'},
            {title: 'Популярные', url: 'v2.2/films/top?type=TOP_100_POPULAR_FILMS'},
            {title: 'Лучшие сериалы', url: 'v2.2/films/top?type=TOP_250_TV_SHOWS'},
            {title: 'Ожидаемые', url: 'v2.2/films/top?type=TOP_AWAIT_FILMS'}
        ])
    }

    /**
     * Genres
     */
    genres(params, oncomplite, onerror){
        if(this.genres_map){
            oncomplite({genres: this.genres_map})
            return
        }

        this.get('v2.2/films/filters', {}, (json) => {
            this.genres_map = json.genres || []
            oncomplite({genres: this.genres_map})
        }, onerror)
    }

    /**
     * Company
     */
    company(params, oncomplite, onerror){
        onerror() // Not implemented yet
    }

    /**
     * Collections
     */
    collections(params, oncomplite, onerror){
        onerror() // Not implemented yet
    }

    /**
     * Menu category
     */
    menuCategory(params, oncomplite){
        this.menu(params, oncomplite)
    }

    /**
     * Get image URL
     */
    img(path, size){
        // KP returns full URLs, not paths
        return path || ''
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
            title: 'Кинопоиск',
            search: this.search.bind(this),
            params: {
                align_left: true,
                object: {
                    source: 'kinopoisk'
                }
            },
            onCancel: this.network.clear.bind(this.network)
        }
    }
}

export default new KinopoiskProvider()
