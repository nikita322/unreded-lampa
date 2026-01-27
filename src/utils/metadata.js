import Storage from './storage'
import Utils from './math'

let broken_images = 0

/**
 * Apply CORS proxy to URL if configured
 * @param {string} url - Original URL
 * @returns {string} Proxied URL or original URL
 */
function applyProxy(url){
    if(!Storage.field('proxy_tmdb') || !Storage.field('proxy_host')) return url

    let host = Storage.field('proxy_host')
    let username = Storage.field('proxy_username')
    let password = Storage.field('proxy_password')

    // If host already contains full URL with protocol and auth (http://user:pass@host:port)
    // Use it as is
    if(host.match(/^https?:\/\//)){
        let proxyUrl = host
        if(!proxyUrl.endsWith('/')) proxyUrl += '/'
        return proxyUrl + url
    }

    // Otherwise build URL from parts
    // Remove protocol if user added it
    host = host.replace(/^(https?):\/\//i, '')

    // Build CORS proxy URL with auth
    // Format: https://user:pass@proxy-host/original-url
    let proxyUrl = Utils.protocol()

    // Add Basic Auth if provided
    if(username && password){
        proxyUrl += encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@'
    }

    proxyUrl += host

    // Ensure proxy host ends with / and URL is properly appended
    if(!proxyUrl.endsWith('/')) proxyUrl += '/'

    return proxyUrl + url
}

/**
 * Get TMDB API base URL
 * @param {string} url - API endpoint
 * @returns {string} Full API URL with proxy if configured
 */
function api(url){
    let base = Utils.protocol() + 'api.themoviedb.org/3/' + url

    return applyProxy(base)
}

/**
 * Get TMDB image URL
 * @param {string} url - Image path
 * @returns {string} Full image URL with proxy if configured
 */
function image(url){
    let base = Utils.protocol() + 'image.tmdb.org/' + url

    return applyProxy(base)
}

function broken(){
    broken_images++

    if(broken_images > 50){
        broken_images = 0

        // REMOVED: Auto proxy enable logic - proxy_tmdb_auto setting removed
    }
}

function key(){
    return '4ef0d7355d9ffb5151e987764708ce96'
}

export default {
    api,
    key,
    image,
    broken,
    applyProxy
}