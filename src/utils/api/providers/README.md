# Metadata Providers Architecture

This directory contains metadata provider implementations for Lampa.

## Overview

Lampa supports multiple metadata sources (TMDB, CUB, custom providers). Each provider must implement the `BaseProvider` interface defined in `base.js`.

## Current Structure

- **base.js** - Base provider interface that all providers must implement
- **tmdb.js** - TMDB provider (to be created by extracting from metadata.js)
- **cub.js** - CUB provider (placeholder, to be implemented)

## How to Add a New Provider

### 1. Create Provider File

Create a new file in this directory: `{provider_name}.js`

Example: `kinopoisk.js`, `imdb.js`, `cub.js`

### 2. Implement BaseProvider Interface

```javascript
import BaseProvider from './base'
import Reguest from '../../reguest'
import Storage from '../../storage'

class MyProvider extends BaseProvider {
    constructor(){
        super()
        this.name = 'My Provider'
        this.network = new Reguest()
    }

    getBaseUrl(){
        return 'https://api.myprovider.com'
    }

    getApiKey(){
        return 'your-api-key'
    }

    // Implement all required methods from BaseProvider
    main(params, oncomplite, onerror){
        // Your implementation
    }

    category(params, oncomplite, onerror){
        // Your implementation
    }

    // ... other methods
}

export default new MyProvider()
```

### 3. Register Provider

In `src/utils/api/metadata.js`, import and register your provider:

```javascript
import TMDBProvider from './providers/tmdb'
import MyProvider from './providers/myprovider'

function getProvider(){
    let source = Storage.field('metadata_source') || 'tmdb'

    switch(source){
        case 'tmdb': return TMDBProvider
        case 'myprovider': return MyProvider
        default: return TMDBProvider
    }
}
```

### 4. Add to Settings

In `src/components/settings/params.js`, add your provider to the selector:

```javascript
select('metadata_source',{
    'tmdb': 'TMDB',
    'cub': 'CUB',
    'myprovider': 'My Provider Name',
    'custom': '#{settings_rest_metadata_source_custom}'
},'tmdb')
```

### 5. Add Translations

Add provider name translations to language files (`src/lang/ru.js`, etc.)

## Required Methods

Each provider must implement these methods from BaseProvider:

- `main()` - Main page categories
- `category()` - Category content
- `full()` - Full card info
- `search()` - Search functionality
- `list()` - List/pagination
- `person()` - Person info
- `seasons()` - TV seasons
- `menu()` - Menu categories
- `genres()` - Get genres
- `company()` - Get company info
- `collections()` - Collections
- `menuCategory()` - Menu category
- `img()` - Get image URL
- `screensavers()` - Get screensavers
- `clear()` - Clear cache
- `discovery()` - Discovery feature
- `get()` - Make GET request

## API Response Format

All providers should return data in a consistent format:

```javascript
{
    results: [...],  // Array of items
    title: 'Section Title',
    page: 1,
    total_pages: 10,
    // ... provider-specific fields
}
```

## Testing

When adding a new provider:

1. Test all main functions (main, category, search, full)
2. Verify image URLs work correctly
3. Test pagination
4. Verify search results
5. Test person/company pages

## Current Status

- ✅ Base architecture created
- ✅ BaseProvider interface defined
- ✅ Kinopoisk provider (fully implemented)
- ⏳ TMDB provider (currently inline in metadata.js, needs extraction)
- ⏳ CUB provider (placeholder created)
- ✅ Custom provider support

## Kinopoisk Provider Setup

The Kinopoisk provider is fully implemented and ready to use:

### 1. Get API Key

1. Go to https://kinopoiskapiunofficial.tech/
2. Register for a free account
3. Get your API key from the dashboard
4. Free tier: 500 requests per day

### 2. Configure in Lampa

1. Open Settings → Metadata
2. Select "Kinopoisk (KP)" as source
3. Enter your API key in the Kinopoisk API Key field
4. Save settings

### 3. Features

- ✅ Top 250 films from Kinopoisk
- ✅ Popular films
- ✅ Awaited films
- ✅ Search by title
- ✅ Full film information
- ✅ Actors and crew information
- ✅ Kinopoisk ratings
- ⏳ TV series support (coming soon)

### 4. API Limits

Free API key limits:
- 500 requests per day
- Rate limit: 20 requests per second

If you need more, upgrade to premium at kinopoiskapiunofficial.tech

## Future Enhancements

- Provider-specific settings (API keys, base URLs)
- Provider capability detection
- Automatic provider fallback on errors
- Provider health monitoring
- Provider-specific caching strategies
