import BaseProvider from './base'
import Reguest from '../../reguest'
import Storage from '../../storage'
import Lang from '../../lang'

/**
 * CUB Metadata Provider
 *
 * CUB API is similar to TMDB but hosted separately
 * Base URL: https://api.cub.watch or similar
 *
 * TODO: Implement all methods from BaseProvider
 * TODO: Add CUB-specific API endpoints
 * TODO: Handle CUB authentication if needed
 */
class CUBProvider extends BaseProvider {
    constructor(){
        super()
        this.name = 'CUB'
        this.network = new Reguest()
    }

    getBaseUrl(){
        // TODO: Get from settings or use default
        return Storage.field('cub_base_url') || 'https://api.cub.watch'
    }

    getApiKey(){
        // TODO: Get from settings or use default
        return Storage.field('cub_api_key') || ''
    }

    /**
     * Build API URL with parameters
     */
    url(endpoint, params = {}){
        let url = this.getBaseUrl() + '/' + endpoint

        // Add API key
        url += (url.indexOf('?') > -1 ? '&' : '?') + 'api_key=' + this.getApiKey()

        // Add language (always Russian)
        url += '&language=ru'

        // Add other params
        if(params.page) url += '&page=' + params.page
        if(params.query) url += '&query=' + encodeURIComponent(params.query)

        return url
    }

    /**
     * Main page
     */
    main(params, oncomplite, onerror){
        // TODO: Implement CUB main page
        // For now, return empty to prevent errors
        oncomplite({
            results: [],
            title: 'CUB Provider - Not Implemented'
        })
    }

    /**
     * Category
     */
    category(params, oncomplite, onerror){
        // TODO: Implement CUB category
        oncomplite({
            results: [],
            title: 'CUB Provider - Not Implemented'
        })
    }

    /**
     * Full card
     */
    full(params, oncomplite, onerror){
        // TODO: Implement CUB full card
        onerror()
    }

    /**
     * Search
     */
    search(params, oncomplite, onerror){
        // TODO: Implement CUB search
        oncomplite([])
    }

    /**
     * List
     */
    list(params, oncomplite, onerror){
        // TODO: Implement CUB list
        oncomplite({results: []})
    }

    /**
     * Person
     */
    person(params, oncomplite, onerror){
        // TODO: Implement CUB person
        onerror()
    }

    /**
     * Seasons
     */
    seasons(tv, from, oncomplite){
        // TODO: Implement CUB seasons
        oncomplite({})
    }

    /**
     * Menu
     */
    menu(params, oncomplite){
        // TODO: Implement CUB menu
        oncomplite([])
    }

    /**
     * Genres
     */
    genres(params, oncomplite, onerror){
        // TODO: Implement CUB genres
        oncomplite({genres: []})
    }

    /**
     * Company
     */
    company(params, oncomplite, onerror){
        // TODO: Implement CUB company
        onerror()
    }

    /**
     * Collections
     */
    collections(params, oncomplite, onerror){
        // TODO: Implement CUB collections
        onerror()
    }

    /**
     * Menu category
     */
    menuCategory(params, oncomplite){
        // TODO: Implement CUB menu category
        oncomplite([])
    }

    /**
     * Get image URL
     */
    img(path, size){
        // TODO: Implement CUB image URLs
        return path || ''
    }

    /**
     * Screensavers
     */
    screensavers(params, oncomplite, onerror){
        // TODO: Implement CUB screensavers
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
            onMore: (params)=>{
                // TODO: Implement
            },
            onCancel: this.network.clear.bind(this.network)
        }
    }

    /**
     * Make GET request
     */
    get(method, params, oncomplite, onerror){
        let url = this.url(method, params)

        this.network.silent(url, (json)=>{
            json.url = method
            oncomplite(json)
        }, onerror)
    }
}

export default new CUBProvider()
