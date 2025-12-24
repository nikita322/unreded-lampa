import Storage from './storage'
import Utils from './math'

let broken_images = 0

/**
 * Build proxy URL from settings
 * @returns {string} Proxy URL or empty string
 */
function getProxyUrl(){
    if(!Storage.field('proxy_tmdb') || !Storage.field('proxy_host')) return ''

    let type = Storage.field('proxy_type') || 'http'
    let host = Storage.field('proxy_host')
    let username = Storage.field('proxy_username')
    let password = Storage.field('proxy_password')

    // Remove protocol if user added it
    host = host.replace(/^(https?|socks5?):\/\//i, '')

    // Build proxy URL
    let proxyUrl = type + '://'

    if(username && password){
        proxyUrl += encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@'
    }

    proxyUrl += host

    return proxyUrl
}

function api(url){
    let base  = Utils.protocol() + 'api.themoviedb.org/3/' + url
    let proxy = getProxyUrl()

    // If proxy is configured, requests should go through it
    // Note: This is a simplified version - in real app you'd need proxy middleware
    return base
}

function image(url){
    let base  = Utils.protocol() + 'image.tmdb.org/' + url
    let proxy = getProxyUrl()

    // If proxy is configured, requests should go through it
    // Note: This is a simplified version - in real app you'd need proxy middleware
    return base
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
    broken
}