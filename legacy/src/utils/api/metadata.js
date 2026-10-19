import Storage from '../storage'

// Import metadata providers
import TMDBProvider from './providers/tmdb'
import KinopoiskProvider from './providers/kinopoisk'
import CUBProvider from './providers/cub'

/**
 * Metadata source constants (enum)
 */
const METADATA_SOURCES = {
    TMDB: 'tmdb',
    KINOPOISK: 'kinopoisk',
    CUB: 'cub'
}

/**
 * Provider display names
 */
const PROVIDER_NAMES = {
    [METADATA_SOURCES.TMDB]: 'TMDB',
    [METADATA_SOURCES.KINOPOISK]: 'Kinopoisk',
    [METADATA_SOURCES.CUB]: 'CUB'
}

/**
 * METADATA PROVIDER ROUTER
 *
 * Get active provider based on user settings
 * Supports: TMDB, Kinopoisk, CUB
 *
 * @returns {BaseProvider} Always returns a provider instance (never null)
 */
function getActiveProvider(){
    let source = Storage.field('metadata_source') || METADATA_SOURCES.TMDB

    switch(source){
        case METADATA_SOURCES.TMDB:
            return TMDBProvider
        case METADATA_SOURCES.KINOPOISK:
            return KinopoiskProvider
        case METADATA_SOURCES.CUB:
            return CUBProvider
        default:
            // Default to TMDB if unknown source
            return TMDBProvider
    }
}

/**
 * Get name of active metadata provider for display in UI
 * @returns {string} Provider display name
 */
function getProviderName(){
    let source = Storage.field('metadata_source') || METADATA_SOURCES.TMDB
    return PROVIDER_NAMES[source] || PROVIDER_NAMES[METADATA_SOURCES.TMDB]
}

/**
 * PUBLIC API - All functions route to active provider
 */

function main(params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    return provider.main(params, oncomplite, onerror)
}

function category(params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    return provider.category(params, oncomplite, onerror)
}

function full(params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    return provider.full(params, oncomplite, onerror)
}

function search(params = {}, oncomplite){
    let provider = getActiveProvider()
    return provider.search(params, oncomplite)
}

function list(params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    return provider.list(params, oncomplite, onerror)
}

function person(params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    return provider.person(params, oncomplite, onerror)
}

function seasons(tv, from, oncomplite){
    let provider = getActiveProvider()
    return provider.seasons(tv, from, oncomplite)
}

function menu(params = {}, oncomplite){
    let provider = getActiveProvider()
    return provider.menu(params, oncomplite)
}

function menuCategory(params, oncomplite){
    let provider = getActiveProvider()
    return provider.menuCategory(params, oncomplite)
}

function company(params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    return provider.company(params, oncomplite, onerror)
}

function img(src, size){
    let provider = getActiveProvider()
    return provider.img(src, size)
}

function clear(){
    let provider = getActiveProvider()
    if(provider && provider.clear) provider.clear()
}

function discovery(){
    let provider = getActiveProvider()
    return provider.discovery ? provider.discovery() : null
}

function find(find, params = {}){
    let provider = getActiveProvider()
    return provider.find ? provider.find(find, params) : null
}

function parsePG(movie){
    let provider = getActiveProvider()
    return provider.parsePG ? provider.parsePG(movie) : null
}

function parseCountries(movie){
    let provider = getActiveProvider()
    return provider.parseCountries ? provider.parseCountries(movie) : null
}

function getGenresNameFromIds(card_type, ids){
    let provider = getActiveProvider()
    return provider.getGenresNameFromIds ? provider.getGenresNameFromIds(card_type, ids) : []
}

function videos(params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    if(provider.videos) return provider.videos(params, oncomplite, onerror)
}

function get(method, params = {}, oncomplite, onerror){
    let provider = getActiveProvider()
    if(provider.get) return provider.get(method, params, oncomplite, onerror)
}

function external_ids(params = {}, oncomplite, onerror){
    // TMDB-specific function - route to TMDB provider's get method
    let provider = getActiveProvider()
    if(provider.get){
        return provider.get((params.type || 'tv') + '/'+params.id+'/external_ids', params, oncomplite, onerror)
    }
}

function external_imdb_id(params = {}, oncomplite){
    // TMDB-specific function - route to TMDB provider's get method
    let provider = getActiveProvider()
    if(provider.get){
        return provider.get(params.type+'/'+params.id+'/external_ids', params, (ids)=>{
            oncomplite(ids.imdb_id || '')
        }, ()=>{
            oncomplite('')
        })
    }
}

function genres(){
    // Return genres from active provider
    let provider = getActiveProvider()
    return provider.genres || null
}

export default {
    main,
    menu,
    img,
    full,
    list,
    category,
    search,
    clear,
    company,
    person,
    seasons,
    find,
    external_ids,
    get,
    menuCategory,
    discovery,
    parsePG,
    parseCountries,
    genres,
    external_imdb_id,
    getGenresNameFromIds,
    videos,
    getProviderName,
    METADATA_SOURCES,
    PROVIDER_NAMES
}
