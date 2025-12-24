/**
 * Local timecodes storage
 * Replaces CUB cloud sync with local-only storage
 */

import Storage from './storage'
import DB from './db'

let cache = {}

/**
 * Initialize local timecodes storage
 * Migrates existing data from file_view if available
 */
function init() {
    // Migrate from old file_view storage if exists
    let old_data = Storage.get('file_view', '{}')

    // Load existing local timecodes or use migrated data
    cache = Storage.get('local_timecodes', old_data)

    console.log('LocalTimecodes', 'Initialized with', Object.keys(cache).length, 'entries')
}

/**
 * Save timecode for a video
 * @param {string} hash - Unique identifier for the video
 * @param {{time:number, duration:number, percent:number}} data - Timecode data
 */
function save(hash, data) {
    if(!hash || hash == 0) return

    cache[hash] = {
        time: data.time || 0,
        duration: data.duration || 0,
        percent: data.percent || 0,
        updated: Date.now()
    }

    Storage.set('local_timecodes', cache)

    // Also save to IndexedDB for redundancy
    DB.set('timecodes', hash, cache[hash])
}

/**
 * Get timecode for a video
 * @param {string} hash - Unique identifier for the video
 * @returns {{time:number, duration:number, percent:number}}
 */
function get(hash) {
    return cache[hash] || { time: 0, duration: 0, percent: 0 }
}

/**
 * Remove timecode for a video
 * @param {string} hash - Unique identifier for the video
 */
function remove(hash) {
    delete cache[hash]
    Storage.set('local_timecodes', cache)
    DB.remove('timecodes', hash)
}

/**
 * Get all timecodes
 * @returns {object} All stored timecodes
 */
function all() {
    return cache
}

/**
 * Clear all timecodes
 */
function clear() {
    cache = {}
    Storage.set('local_timecodes', {})
}

export default {
    init,
    save,
    get,
    remove,
    all,
    clear
}
