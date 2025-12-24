/**
 * Base metadata provider interface
 * All providers must implement these methods
 */
class BaseProvider {
    constructor(){
        this.name = 'Base Provider'
    }

    /**
     * Get provider name
     */
    getName(){
        return this.name
    }

    /**
     * Get provider base URL
     */
    getBaseUrl(){
        throw new Error('getBaseUrl() must be implemented')
    }

    /**
     * Get provider API key
     */
    getApiKey(){
        throw new Error('getApiKey() must be implemented')
    }

    /**
     * Main page categories
     */
    main(params, oncomplite, onerror){
        throw new Error('main() must be implemented')
    }

    /**
     * Category content
     */
    category(params, oncomplite, onerror){
        throw new Error('category() must be implemented')
    }

    /**
     * Full card info
     */
    full(params, oncomplite, onerror){
        throw new Error('full() must be implemented')
    }

    /**
     * Search
     */
    search(params, oncomplite, onerror){
        throw new Error('search() must be implemented')
    }

    /**
     * List/pagination
     */
    list(params, oncomplite, onerror){
        throw new Error('list() must be implemented')
    }

    /**
     * Person info
     */
    person(params, oncomplite, onerror){
        throw new Error('person() must be implemented')
    }

    /**
     * Seasons
     */
    seasons(tv, from, oncomplite){
        throw new Error('seasons() must be implemented')
    }

    /**
     * Menu categories
     */
    menu(params, oncomplite){
        throw new Error('menu() must be implemented')
    }

    /**
     * Get genres
     */
    genres(params, oncomplite, onerror){
        throw new Error('genres() must be implemented')
    }

    /**
     * Get company
     */
    company(params, oncomplite, onerror){
        throw new Error('company() must be implemented')
    }

    /**
     * Collections
     */
    collections(params, oncomplite, onerror){
        throw new Error('collections() must be implemented')
    }

    /**
     * Menu category
     */
    menuCategory(params, oncomplite){
        throw new Error('menuCategory() must be implemented')
    }

    /**
     * Get image URL
     */
    img(path, size){
        throw new Error('img() must be implemented')
    }

    /**
     * Get screensavers
     */
    screensavers(params, oncomplite, onerror){
        throw new Error('screensavers() must be implemented')
    }

    /**
     * Clear cache
     */
    clear(){
        // Optional, can be empty
    }

    /**
     * Discovery feature
     */
    discovery(){
        return null
    }

    /**
     * Make GET request
     */
    get(method, params, oncomplite, onerror){
        throw new Error('get() must be implemented')
    }
}

export default BaseProvider
