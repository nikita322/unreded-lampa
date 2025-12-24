import BaseProvider from './base'
import Reguest from '../../reguest'
import Storage from '../../storage'
import MetadataUtils from '../../metadata'
import Status from '../../status'
import Favorite from '../../favorite'
import Recomends from '../../recomend'
import Lang from '../../lang'
import Activity from '../../../interaction/activity'
import Utils from '../../math'
import Api from '../../../interaction/api'
import TimeTable from '../../timetable'
import Episode from '../../../interaction/episode'
import Arrays from '../../arrays'

/**
 * TMDB Metadata Provider
 *
 * Uses The Movie Database (TMDB) API
 * Official API documentation: https://developers.themoviedb.org/
 */
class TMDBProvider extends BaseProvider {
    constructor(){
        super()
        this.name = 'TMDB'
        this.network = new Reguest()
        this.menu_list = []

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
        return MetadataUtils.api('')
    }

    getApiKey(){
        return MetadataUtils.key()
    }

    /**
     * Build TMDB API URL with parameters
     */
    url(endpoint, params = {}){
        let u = endpoint
        let ln = ['ru']

        if(params.langs) ln = typeof params.langs == 'string' ? [params.langs] : ln.concat(params.langs.filter(n=>n !== ln[0]))

        u = this.add(u, 'api_key=' + this.getApiKey())
        u = this.add(u, 'language=' + ln.join(','))

        if(params.genres && u.indexOf('with_genres') == -1)  u = this.add(u, 'with_genres=' + params.genres)
        if(params.page)    u = this.add(u, 'page=' + params.page)
        if(params.query)   u = this.add(u, 'query=' + params.query)
        if(params.keywords) u = this.add(u, 'with_keywords=' + params.keywords)
        if(params.watch_region) u = this.add(u, 'watch_region=' + params.watch_region)
        if(params.watch_providers) u = this.add(u, 'with_watch_providers=' + params.watch_providers)
        if(params.networks) u = this.add(u, 'with_networks=' + params.networks)
        if(params.sort_by) u = this.add(u, 'sort_by=' + params.sort_by)

        // Add anime filters
        let is_anime = params.url == 'anime' || params.category == 'anime' || (params.object && params.object.url == 'anime')
        let is_multmovie = params.url == 'multmovie' || params.category == 'multmovie' || (params.object && params.object.url == 'multmovie')
        let is_multtv = params.url == 'multtv' || params.category == 'multtv' || (params.object && params.object.url == 'multtv')

        if(is_anime && u.indexOf('with_original_language') == -1){
            u = this.add(u, 'with_original_language=ja')
        }

        if(is_multmovie){
            if(u.indexOf('with_genres') == -1) u = this.add(u, 'with_genres=16')
            if(u.indexOf('include_adult') == -1) u = this.add(u, 'include_adult=false')
            if(u.indexOf('certification_country') == -1){
                u = this.add(u, 'certification_country=US')
                u = this.add(u, 'certification.lte=PG-13')
            }
        }

        if(is_multtv){
            if(u.indexOf('with_genres') == -1) u = this.add(u, 'with_genres=16')
            if(u.indexOf('include_adult') == -1) u = this.add(u, 'include_adult=false')
            if(u.indexOf('certification_country') == -1){
                u = this.add(u, 'certification_country=US')
                u = this.add(u, 'certification.lte=PG-13')
            }
        }

        if(params.filter){
            for(let i in params.filter){
                u = this.add(u, i + '=' + params.filter[i])
            }
        }

        if(params.genres && u.indexOf('discover/') !== 0){
            u = 'discover/' + u
        }

        return MetadataUtils.api(u)
    }

    add(u, params){
        return u + (/\?/.test(u) ? '&' : '?') + params
    }

    /**
     * Find item in search results
     */
    find(find, params = {}){
        let finded

        let filtred = (items)=>{
            for(let i = 0; i < items.length; i++){
                let item = items[i]

                if(params.original_title == item.original_title || params.title == item.title){
                    finded = item
                    break
                }
            }
        }

        if(find.movie && find.movie.results.length)      filtred(find.movie.results)
        if(find.tv && find.tv.results.length && !finded) filtred(find.tv.results)

        return finded
    }

    /**
     * Helper function for anime: fetch both movie and TV results and combine them
     */
    getAnimeBoth(movie_endpoint, tv_endpoint, params, oncomplite, onerror){
        let movie_results = []
        let tv_results = []
        let completed = 0

        // Fetch movies
        this.get(movie_endpoint, params, (json_movie) => {
            if(json_movie && json_movie.results) movie_results = json_movie.results
            completed++
            if(completed === 2){
                let combined = movie_results.concat(tv_results)
                combined = Arrays.shuffle(combined).slice(0, 20)
                oncomplite({results: combined})
            }
        }, () => {
            completed++
            if(completed === 2){
                oncomplite({results: tv_results})
            }
        })

        // Fetch TV series
        this.get(tv_endpoint, params, (json_tv) => {
            if(json_tv && json_tv.results) tv_results = json_tv.results
            completed++
            if(completed === 2){
                let combined = movie_results.concat(tv_results)
                combined = Arrays.shuffle(combined).slice(0, 20)
                oncomplite({results: combined})
            }
        }, () => {
            completed++
            if(completed === 2){
                oncomplite({results: movie_results})
            }
        })
    }

    /**
     * Parse age rating from movie data
     */
    parsePG(movie){
        let pg
        let cd = Storage.field('language')

        if(movie.content_ratings){
            try{
                let find = movie.content_ratings.results.find(a=>a.iso_3166_1 == cd.toUpperCase())

                if(!find) find = movie.content_ratings.results.find(a=>a.iso_3166_1 == 'US')

                if(find) pg = Utils.decodePG(find.rating)
            }
            catch(e){}
        }

        if(movie.release_dates && !pg){
            let find = movie.release_dates.results.find(a=>a.iso_3166_1 == cd.toUpperCase())

            if(!find) find = movie.release_dates.results.find(a=>a.iso_3166_1 == 'US')

            if(find && find.release_dates.length){
                pg = Utils.decodePG(find.release_dates[0].certification)
            }
        }

        if(movie.restrict) pg = movie.restrict + '+'

        return pg
    }

    /**
     * Parse country names from movie data
     */
    parseCountries(movie){
        let iso_countries = {
            'AD' : Lang.translate('country_ad'),
            'AE' : Lang.translate('country_ae'),
            'AF' : Lang.translate('country_af'),
            'AL' : Lang.translate('country_al'),
            'AM' : Lang.translate('country_am'),
            'AO' : Lang.translate('country_ao'),
            'AR' : Lang.translate('country_ar'),
            'AT' : Lang.translate('country_at'),
            'AU' : Lang.translate('country_au'),
            'AW' : Lang.translate('country_aw'),
            'AZ' : Lang.translate('country_az'),
            'BA' : Lang.translate('country_ba'),
            'BD' : Lang.translate('country_bd'),
            'BE' : Lang.translate('country_be'),
            'BG' : Lang.translate('country_bg'),
            'BH' : Lang.translate('country_bh'),
            'BI' : Lang.translate('country_bi'),
            'BJ' : Lang.translate('country_bj'),
            'BO' : Lang.translate('country_bo'),
            'BR' : Lang.translate('country_br'),
            'BS' : Lang.translate('country_bs'),
            'BT' : Lang.translate('country_bt'),
            'BW' : Lang.translate('country_bw'),
            'BY' : Lang.translate('country_by'),
            'CA' : Lang.translate('country_ca'),
            'CH' : Lang.translate('country_ch'),
            'CL' : Lang.translate('country_cl'),
            'CM' : Lang.translate('country_cm'),
            'CN' : Lang.translate('country_cn'),
            'CO' : Lang.translate('country_co'),
            'CR' : Lang.translate('country_cr'),
            'CU' : Lang.translate('country_cu'),
            'CV' : Lang.translate('country_cv'),
            'CY' : Lang.translate('country_cy'),
            'CZ' : Lang.translate('country_cz'),
            'DE' : Lang.translate('country_de'),
            'DJ' : Lang.translate('country_dj'),
            'DK' : Lang.translate('country_dk'),
            'DO' : Lang.translate('country_do'),
            'DZ' : Lang.translate('country_dz'),
            'EC' : Lang.translate('country_ec'),
            'EE' : Lang.translate('country_ee'),
            'EG' : Lang.translate('country_eg'),
            'ES' : Lang.translate('country_es'),
            'ET' : Lang.translate('country_et'),
            'FI' : Lang.translate('country_fi'),
            'FO' : Lang.translate('country_fo'),
            'FR' : Lang.translate('country_fr'),
            'GA' : Lang.translate('country_ga'),
            'GB' : Lang.translate('country_gb'),
            'GE' : Lang.translate('country_ge'),
            'GH' : Lang.translate('country_gh'),
            'GL' : Lang.translate('country_gl'),
            'GP' : Lang.translate('country_gp'),
            'GR' : Lang.translate('country_gr'),
            'GT' : Lang.translate('country_gt'),
            'HK' : Lang.translate('country_hk'),
            'HR' : Lang.translate('country_hr'),
            'HT' : Lang.translate('country_ht'),
            'HU' : Lang.translate('country_hu'),
            'ID' : Lang.translate('country_id'),
            'IE' : Lang.translate('country_ie'),
            'IL' : Lang.translate('country_il'),
            'IN' : Lang.translate('country_in'),
            'IQ' : Lang.translate('country_iq'),
            'IR' : Lang.translate('country_ir'),
            'IS' : Lang.translate('country_is'),
            'IT' : Lang.translate('country_it'),
            'JM' : Lang.translate('country_jm'),
            'JO' : Lang.translate('country_jo'),
            'JP' : Lang.translate('country_jp'),
            'KE' : Lang.translate('country_ke'),
            'KG' : Lang.translate('country_kg'),
            'KH' : Lang.translate('country_kh'),
            'KP' : Lang.translate('country_kp'),
            'KR' : Lang.translate('country_kr'),
            'KW' : Lang.translate('country_kw'),
            'KZ' : Lang.translate('country_kz'),
            'LA' : Lang.translate('country_la'),
            'LB' : Lang.translate('country_lb'),
            'LI' : Lang.translate('country_li'),
            'LK' : Lang.translate('country_lk'),
            'LR' : Lang.translate('country_lr'),
            'LT' : Lang.translate('country_lt'),
            'LU' : Lang.translate('country_lu'),
            'LV' : Lang.translate('country_lv'),
            'LY' : Lang.translate('country_ly'),
            'MA' : Lang.translate('country_ma'),
            'MC' : Lang.translate('country_mc'),
            'MD' : Lang.translate('country_md'),
            'ME' : Lang.translate('country_me'),
            'MK' : Lang.translate('country_mk'),
            'MM' : Lang.translate('country_mm'),
            'MN' : Lang.translate('country_mn'),
            'MO' : Lang.translate('country_mo'),
            'MT' : Lang.translate('country_mt'),
            'MU' : Lang.translate('country_mu'),
            'MV' : Lang.translate('country_mv'),
            'MW' : Lang.translate('country_mw'),
            'MX' : Lang.translate('country_mx'),
            'MY' : Lang.translate('country_my'),
            'MZ' : Lang.translate('country_mz'),
            'NA' : Lang.translate('country_na'),
            'NE' : Lang.translate('country_ne'),
            'NG' : Lang.translate('country_ng'),
            'NI' : Lang.translate('country_ni'),
            'NL' : Lang.translate('country_nl'),
            'NO' : Lang.translate('country_no'),
            'NP' : Lang.translate('country_np'),
            'NZ' : Lang.translate('country_nz'),
            'OM' : Lang.translate('country_om'),
            'PA' : Lang.translate('country_pa'),
            'PE' : Lang.translate('country_pe'),
            'PG' : Lang.translate('country_pg'),
            'PH' : Lang.translate('country_ph'),
            'PK' : Lang.translate('country_pk'),
            'PL' : Lang.translate('country_pl'),
            'PR' : Lang.translate('country_pr'),
            'PS' : Lang.translate('country_ps'),
            'PT' : Lang.translate('country_pt'),
            'PY' : Lang.translate('country_py'),
            'QA' : Lang.translate('country_qa'),
            'RO' : Lang.translate('country_ro'),
            'RS' : Lang.translate('country_rs'),
            'RU' : Lang.translate('country_ru'),
            'RW' : Lang.translate('country_rw'),
            'SA' : Lang.translate('country_sa'),
            'SD' : Lang.translate('country_sd'),
            'SE' : Lang.translate('country_se'),
            'SG' : Lang.translate('country_sg'),
            'SI' : Lang.translate('country_si'),
            'SK' : Lang.translate('country_sk'),
            'SN' : Lang.translate('country_sn'),
            'SU' : Lang.translate('country_su'),
            'SV' : Lang.translate('country_sv'),
            'SY' : Lang.translate('country_sy'),
            'TH' : Lang.translate('country_th'),
            'TJ' : Lang.translate('country_tj'),
            'TM' : Lang.translate('country_tm'),
            'TN' : Lang.translate('country_tn'),
            'TR' : Lang.translate('country_tr'),
            'TW' : Lang.translate('country_tw'),
            'TZ' : Lang.translate('country_tz'),
            'UA' : Lang.translate('country_ua'),
            'UG' : Lang.translate('country_ug'),
            'US' : Lang.translate('country_us'),
            'UY' : Lang.translate('country_uy'),
            'UZ' : Lang.translate('country_uz'),
            'VE' : Lang.translate('country_ve'),
            'VN' : Lang.translate('country_vn'),
            'WS' : Lang.translate('country_ws'),
            'YE' : Lang.translate('country_ye'),
            'YU' : Lang.translate('country_yu'),
            'ZA' : Lang.translate('country_za'),
            'ZM' : Lang.translate('country_zm'),
            'ZW' : Lang.translate('country_zw')
        }

        return movie.production_countries ? movie.production_countries.map(a => {
            if (iso_countries.hasOwnProperty(a.iso_3166_1)) {
              return iso_countries[a.iso_3166_1]
            } else {
              return a.name
            }
        }) : ''
    }

    /**
     * Get genre names from genre IDs
     */
    getGenresNameFromIds(card_type, ids){
        let finded = []
        let where  = this.genres[card_type]

        ids.forEach(a=>{
            let find = where.find(i=>i.id == a)

            if(find) finded.push(Utils.capitalizeFirstLetter(Lang.translate(find.title)))
        })

        return finded
    }

    /**
     * Main page implementation
     */
    main(params = {}, oncomplite, onerror){
        let parts_limit = 6
        let parts_data  = [
            (call)=>{
                this.get('movie/now_playing',params,(json)=>{
                    json.title = Lang.translate('title_now_watch')

                    call(json)
                },call)
            },
            (call)=>{
                call({
                    results: TimeTable.lately().slice(0,20),
                    title: Lang.translate('title_upcoming_episodes'),
                    nomore: true,
                    cardClass: (_elem, _params)=>{
                        return new Episode(_elem, _params)
                    }
                })
            },
            (call)=>{
                this.get('trending/movie/day',params,(json)=>{
                    json.title = Lang.translate('title_trend_day')

                    call(json)
                },call)
            },
            (call)=>{
                this.get('trending/movie/week',params,(json)=>{
                    json.title = Lang.translate('title_trend_week')

                    call(json)
                },call)
            },
            (call)=>{
                this.get('movie/upcoming',params,(json)=>{
                    json.title = Lang.translate('title_upcoming')

                    call(json)
                },call)
            },
            (call)=>{
                this.get('movie/popular',params,(json)=>{
                    json.title = Lang.translate('title_popular_movie')

                    call(json)
                },call)
            },
            (call)=>{
                this.get('trending/tv/week',params,(json)=>{
                    json.title = Lang.translate('title_popular_tv')

                    call(json)
                },call)
            },
            (call)=>{
                this.get('movie/top_rated',params,(json)=>{
                    json.title = Lang.translate('title_top_movie')

                    call(json)
                },call)
            },
            (call)=>{
                this.get('tv/top_rated',params,(json)=>{
                    json.title = Lang.translate('title_top_tv')

                    call(json)
                },call)
            }
        ]

        Arrays.insert(parts_data,0,Api.partPersons(parts_data, parts_limit, 'movie'))

        this.genres.movie.forEach(genre=>{
            let event = (call)=>{
                this.get('discover/movie?with_genres='+genre.id,params,(json)=>{
                    json.title = Lang.translate(genre.title.replace(/[^a-z_]/g,''))

                    call(json)
                },call)
            }

            parts_data.push(event)
        })

        function loadPart(partLoaded, partEmpty){
            Api.partNext(parts_data, parts_limit, partLoaded, partEmpty)
        }

        loadPart(oncomplite, onerror)

        return loadPart
    }

    category(params = {}, oncomplite, onerror){
        let api_type = params.url == 'anime' ? 'tv' :
                       params.url == 'multmovie' ? 'movie' :
                       params.url == 'multtv' ? 'tv' :
                       params.url
        let fullcat  = !(params.genres || params.keywords)
        let show     = (['movie','tv'].indexOf(params.url) > -1 || params.url == 'anime' || params.url == 'multmovie' || params.url == 'multtv') && fullcat

        // For anime, combine both TV and Movie history/recommendations
        let books, recomend
        if(params.url == 'anime'){
            let books_tv = Favorite.continues('tv').filter(item => item.original_language === 'ja')
            let books_movie = Favorite.continues('movie').filter(item => item.original_language === 'ja')
            books = books_tv.concat(books_movie)

            let recomend_tv = Recomends.get('tv').filter(item => item.original_language === 'ja')
            let recomend_movie = Recomends.get('movie').filter(item => item.original_language === 'ja')
            recomend = Arrays.shuffle(recomend_tv.concat(recomend_movie)).slice(0,19)
        }
        else{
            books = show ? Favorite.continues(api_type) : []
            recomend = show ? Arrays.shuffle(Recomends.get(api_type)).slice(0,19) : []
        }

        // Filter history and recommendations for multmovie to show only animated content (exclude anime)
        if(params.url == 'multmovie'){
            books = books.filter(item => item.genre_ids && item.genre_ids.indexOf(16) !== -1 && item.original_language !== 'ja')
            recomend = recomend.filter(item => item.genre_ids && item.genre_ids.indexOf(16) !== -1 && item.original_language !== 'ja')
        }

        // Filter history and recommendations for multtv to show only animated TV series (exclude anime)
        if(params.url == 'multtv'){
            books = books.filter(item => item.genre_ids && item.genre_ids.indexOf(16) !== -1 && item.original_language !== 'ja')
            recomend = recomend.filter(item => item.genre_ids && item.genre_ids.indexOf(16) !== -1 && item.original_language !== 'ja')
        }

        let parts_limit = 6
        let parts_data  = [
            (call)=>{
                let json = {results: books,title: api_type == 'tv' ? Lang.translate('title_continue') : Lang.translate('title_watched')}

                if(api_type == 'tv'){
                    json.ad    = 'notice',
                    json.type  = api_type
                }

                call(json)
            },
            (call)=>{
                if(api_type == 'tv'){
                    call({
                        results: TimeTable.lately().slice(0,20),
                        title: Lang.translate('title_upcoming_episodes'),
                        nomore: true,
                        cardClass: (_elem, _params)=>{
                            return new Episode(_elem, _params)
                        }
                    })
                }
                else{
                    call()
                }
            },
            (call)=>{
                call({results: recomend,title: Lang.translate('title_recomend_watch')})
            },
            (call)=>{
                if(api_type == 'movie'){
                    this.get('discover/' + api_type + '?with_release_type=3',params,(json)=>{
                        json.title = Lang.translate('title_now_watch')

                        call(json)
                    },call)
                }
                else call()
            },
            (call)=>{
                // For anime, fetch both movies and TV series
                if(params.url == 'anime'){
                    this.getAnimeBoth('discover/movie', 'discover/tv?sort_by=popularity.desc', params, (json)=>{
                        json.title = Lang.translate('title_popular')
                        json.ad    = 'bot'
                        json.type  = 'tv'
                        call(json)
                    }, call)
                }
                else{
                    // Use discover for multmovie/multtv to support filtering, trending for regular TV
                    let endpoint = api_type == 'movie' ? 'discover/movie' :
                                  (params.url == 'multmovie' || params.url == 'multtv' ? 'discover/tv?sort_by=popularity.desc' : 'trending/tv/day')

                    this.get(endpoint,params,(json)=>{
                        json.title = Lang.translate('title_popular')

                        if(api_type == 'tv'){
                            json.ad    = 'bot'
                            json.type  = api_type
                        }

                        call(json)
                    },call)
                }
            },
            (call)=>{
                // For anime, fetch both movies and TV series from last year
                if(params.url == 'anime'){
                    let year = new Date().getFullYear() - 1
                    this.getAnimeBoth(
                        'discover/movie?primary_release_year=' + year,
                        'discover/tv?first_air_date_year=' + year,
                        params,
                        (json)=>{
                            json.title = Lang.translate('title_last_year')
                            call(json)
                        },
                        call
                    )
                }
                else{
                    this.get('discover/' + api_type + '?'+(api_type == 'movie' ? 'primary_release_year' : 'first_air_date_year')+'=' + (new Date().getFullYear() - 1),params,(json)=>{
                        json.title = Lang.translate('title_last_year')
                        call(json)
                    },call)
                }
            },
            (call)=>{
                let lte = (new Date().getFullYear() - 2) + '-12-31'
                let gte = (new Date().getFullYear() - 7) + '-01-01'

                // For anime, fetch both movies and TV series
                if(params.url == 'anime'){
                    this.getAnimeBoth(
                        'discover/movie?primary_release_date.lte=' + lte + '&primary_release_date.gte=' + gte,
                        'discover/tv?first_air_date.lte=' + lte + '&first_air_date.gte=' + gte,
                        params,
                        (json)=>{
                            json.title = Lang.translate('title_worth_rewatch')
                            call(json)
                        },
                        call
                    )
                }
                else{
                    let reg = (api_type == 'movie' ? 'primary_release_date' : 'first_air_date')
                    lte = reg + '.lte=' + lte
                    gte = reg + '.gte=' + gte

                    this.get('discover/' + api_type + '?' + lte + '&' + gte,params,(json)=>{
                        json.title = Lang.translate('title_worth_rewatch')
                        call(json)
                    },call)
                }
            },
            (call)=>{
                let lte = (new Date().getFullYear() - 2) + '-12-31'
                let gte = (new Date().getFullYear() - 7) + '-01-01'

                // For anime, fetch both movies and TV series with high ratings
                if(params.url == 'anime'){
                    this.getAnimeBoth(
                        'discover/movie?primary_release_date.lte=' + lte + '&primary_release_date.gte=' + gte + '&vote_average.gte=8&vote_average.lte=9',
                        'discover/tv?first_air_date.lte=' + lte + '&first_air_date.gte=' + gte + '&vote_average.gte=8&vote_average.lte=9',
                        params,
                        (json)=>{
                            json.title = Lang.translate('title_hight_voite')
                            call(json)
                        },
                        call
                    )
                }
                else{
                    let reg = (api_type == 'movie' ? 'primary_release_date' : 'first_air_date')
                    lte = reg + '.lte=' + lte
                    gte = reg + '.gte=' + gte

                    this.get('discover/' + api_type + '?' + lte + '&' + gte + '&vote_average.gte=8&vote_average.lte=9',params,(json)=>{
                        json.title = Lang.translate('title_hight_voite')
                        call(json)
                    },call)
                }
            },
            (call)=>{
                if(params.genres) return call()

                // For anime, fetch both movies and TV series this week
                if(params.url == 'anime'){
                    this.getAnimeBoth(
                        'movie/upcoming',
                        'discover/tv?sort_by=first_air_date.desc',
                        params,
                        (json)=>{
                            json.title = Lang.translate('title_this_week')
                            call(json)
                        },
                        call
                    )
                }
                else if(api_type == 'tv'){
                    // Use discover for multmovie/multtv to support filtering, trending for regular TV
                    let endpoint = (params.url == 'multmovie' || params.url == 'multtv') ? 'discover/tv?sort_by=first_air_date.desc' : 'trending/tv/week'

                    this.get(endpoint,params,(json)=>{
                        json.title = Lang.translate('title_this_week')
                        call(json)
                    },call)
                }
                else{
                    this.get('movie/upcoming',params,(json)=>{
                        json.title = Lang.translate('title_upcoming')

                        json.small = true
                        json.wide = true

                        json.results.forEach(card=>{
                            card.promo = card.overview
                            card.promo_title = card.title || card.name
                        })

                        call(json)
                    },call)
                }
            }
        ]

        // Don't show popular persons section for anime/multmovie/multtv (not relevant for animation)
        if(fullcat && params.url !== 'anime' && params.url !== 'multmovie' && params.url !== 'multtv') Arrays.insert(parts_data,0,Api.partPersons(parts_data, parts_limit, api_type))

        // Use TV genres for anime category since it's primarily TV, but we'll fetch both
        let genre_type = api_type

        // For anime, use TV genres and fetch both movie and TV content for each genre
        if(params.url == 'anime'){
            this.genres['tv'].forEach(genre=>{
                if(params.genres && params.genres == genre.id) return

                let event = (call)=>{
                    let gen = params.genres ? [].concat(params.genres, genre.id) : [genre.id]
                    this.getAnimeBoth(
                        'discover/movie?with_genres=' + gen.join(','),
                        'discover/tv?with_genres=' + gen.join(','),
                        params,
                        (json)=>{
                            json.title = Lang.translate(genre.title.replace(/[^a-z_]/g,''))
                            call(json)
                        },
                        call
                    )
                }

                parts_data.push(event)
            })
        }
        else{
            this.genres[genre_type].forEach(genre=>{
                // For multmovie and multtv, always prepend Animation genre (16) to ensure only animated content
                let gen = (params.url == 'multmovie' || params.url == 'multtv') ?
                          (params.genres ? [16].concat(params.genres, genre.id) : [16, genre.id]) :
                          (params.genres ? [].concat(params.genres, genre.id) : [genre.id])

                if(params.genres && params.genres == genre.id) return

                let event = (call)=>{
                    this.get('discover/' + api_type+'?with_genres='+gen.join(','),params,(json)=>{
                        json.title = Lang.translate(genre.title.replace(/[^a-z_]/g,''))

                        call(json)
                    },call)
                }

                parts_data.push(event)
            })
        }

        function loadPart(partLoaded, partEmpty){
            Api.partNext(parts_data, parts_limit, partLoaded, partEmpty)
        }

        loadPart(oncomplite, onerror)

        return loadPart
    }

    full(params = {}, oncomplite, onerror){
        let status = new Status(7)
            status.onComplite = oncomplite

        if(Utils.dcma(params.method, params.id)) return onerror()

        this.get(params.method+'/'+params.id+'?append_to_response=content_ratings,release_dates,external_ids,keywords,alternative_titles',params,(json)=>{
            json.source = 'tmdb'

            if(json.external_ids){
                json.imdb_id = json.external_ids.imdb_id
            }

            if(params.method == 'tv'){
                let season = Utils.countSeasons(json)

                this.get('tv/'+json.id+'/season/'+season,{},(ep)=>{
                    status.append('episodes', ep)
                },status.error.bind(status))
            }
            else status.need--

            if(json.belongs_to_collection){
                this.get('collection/'+json.belongs_to_collection.id,{},(collection)=>{
                    collection.results = collection.parts.slice(0,19)

                    status.append('collection', collection)
                },status.error.bind(status))
            }
            else status.need--

            status.append('movie', json)
        },()=>{
            status.need -= 2

            status.error()
        })

        this.get(params.method+'/'+params.id+'/credits',params,(json)=>{
            status.append('persons', json)
        },status.error.bind(status))

        this.get(params.method+'/'+params.id+'/recommendations',params,(json)=>{
            status.append('recomend', json)
        },status.error.bind(status))

        this.get(params.method+'/'+params.id+'/similar',params,(json)=>{
            status.append('simular', json)
        },status.error.bind(status))

        this.videos(params, (json)=>{
            status.append('videos', json)
        },status.error.bind(status))
    }

    search(params = {}, oncomplite){
        let status = new Status(3)
            status.onComplite = (data)=>{
                let items = []

                if(data.movie && data.movie.results.length) items.push(data.movie)
                if(data.tv && data.tv.results.length) items.push(data.tv)
                if(data.person && data.person.results.length) items.push(data.person)

                oncomplite(items)
            }

        this.get('search/movie',params,(json)=>{
            json.title = Lang.translate('menu_movies')
            json.type = 'movie'

            status.append('movie', json)
        },status.error.bind(status))

        this.get('search/tv',params,(json)=>{
            json.title = Lang.translate('menu_tv')
            json.type = 'tv'

            status.append('tv', json)
        },status.error.bind(status))

        this.get('search/person',params,(json)=>{
            json.title = Lang.translate('title_actors')
            json.type = 'person'

            status.append('person', json)
        },status.error.bind(status))
    }

    list(params = {}, oncomplite, onerror){
        let u = this.url(params.url, params)

        this.network.silent(u,(json)=>{
            // Filter out Japanese content (anime) from multmovie and multtv results
            if((params.url == 'multmovie' || params.url == 'multtv') && json && json.results && Array.isArray(json.results)){
                json.results = json.results.filter(item => {
                    if(!item) return true
                    let isJapanese = (item.original_language === 'ja') ||
                                    (item.origin_country && item.origin_country.includes && item.origin_country.includes('JP'))
                    return !isJapanese
                })
            }
            oncomplite(json)
        }, onerror)
    }

    person(params = {}, oncomplite, onerror){
        const sortCredits = (credits) => {
            return credits
                .map((a) => {
                    a.year = parseInt(((a.release_date || a.first_air_date || '0000') + '').slice(0,4))
                    return a
                })
                .sort((a, b) => b.vote_average - a.vote_average && b.vote_count - a.vote_count)
        }

        const convert = (credits, person_data) => {
            if(params.only_credits){
                let cast  = sortCredits(credits.cast)
                let result = {}

                result[params.only_credits] = sortCredits(cast.filter(media => media.media_type === params.only_credits))

                return result
            }
            else{
                let department = ['directing','writing','editing','creator']

                credits.crew.forEach((a) => {
                    a.department = Lang.translate(department.indexOf(a.department.toLowerCase()) == -1 ? 'settings_main_rest' : 'full_' + a.department.toLowerCase())
                })

                let cast  = sortCredits(credits.cast),
                    crew  = sortCredits(credits.crew),
                    tv    = sortCredits(cast.filter(media => media.media_type === 'tv')),
                    movie = sortCredits(cast.filter(media => media.media_type === 'movie')),
                    knownFor

                knownFor = Arrays.groupBy(crew, 'department')

                if(movie.length > 0) knownFor[Lang.translate('menu_movies')] = movie
                if(tv.length > 0) knownFor[Lang.translate('menu_tv')] = tv

                knownFor = Object.entries(knownFor).map(([depIdx, dep]) => {
                    let set = {},
                        credits = dep.filter(credit => set.hasOwnProperty(credit.original_title || credit.original_name) ?
                            false : (credit.original_title ? set[credit.original_title] = true : set[credit.original_name] = true))
                    return {
                        name: depIdx,
                        credits,
                        vote_count: dep.reduce((a, b) => a + b.vote_count, 0)
                    }
                }).sort((a, b) => b.credits.length - a.credits.length)

                return {
                    raw: credits, cast, crew, tv, movie, knownFor
                }
            }
        }

        let status = new Status(params.only_credits ? 1 : 2)
            status.onComplite = ()=>{
                let fulldata = {}

                if(status.data.person) fulldata.person = status.data.person

                if(status.data.credits) fulldata.credits = convert(status.data.credits, status.data.person || {})

                oncomplite(fulldata)
            }

        if(!params.only_credits){
            this.get('person/'+params.id,params,(json)=>{
                status.append('person', json)
            },status.error.bind(status))
        }

        this.get('person/'+params.id+'/combined_credits',params,(json)=>{
            status.append('credits', json)
        },status.error.bind(status))
    }

    seasons(tv, from, oncomplite){
        let status = new Status(from.length)
            status.onComplite = oncomplite

        from.forEach(season => {
            this.get('tv/'+tv.id+'/season/'+season,{},(json)=>{
                status.append(''+season, json)
            },status.error.bind(status))
        })
    }

    menu(params = {}, oncomplite){
        if(this.menu_list.length) oncomplite(this.menu_list)
        else{
            let u = this.url('genre/movie/list',params)

            this.network.silent(u,(j)=>{
                j.genres.forEach((g)=>{
                    this.menu_list.push({
                        title: g.name,
                        id: g.id
                    })
                })

                oncomplite(this.menu_list)
            })
        }
    }

    genres(params, oncomplite, onerror){
        return null
    }

    company(params = {}, oncomplite, onerror) {
        let status = new Status(3)
            status.onComplite = ()=>{
                function sortResultsByVoteAverage(results) {
                  return results.sort((a, b) => b.vote_average - a.vote_average)
                }

                if(status.data.company){
                    let fulldata = {
                        company: status.data.company,
                        lines: []
                    }

                    if(status.data.movie && status.data.movie.results.length) fulldata.lines.push({nomore: true, title: Lang.translate('menu_movies'), results: sortResultsByVoteAverage(status.data.movie.results) })
                    if(status.data.tv && status.data.tv.results.length)       fulldata.lines.push({nomore: true, title: Lang.translate('menu_tv'), results: sortResultsByVoteAverage(status.data.tv.results) })

                    oncomplite(fulldata)
                }
                else onerror()
            }

        this.get('company/' + params.id,params,(json)=>{
            status.append('company', json)
        },status.error.bind(status))

        this.get('discover/movie?sort_by=vote_count.desc&with_companies=' + params.id,params,(json)=>{
            status.append('movie', json)
        },status.error.bind(status))

        this.get('discover/tv?sort_by=vote_count.desc&with_companies=' + params.id,params,(json)=>{
            status.append('tv', json)
        },status.error.bind(status))
    }

    collections(params, oncomplite, onerror){
        return null
    }

    menuCategory(params, oncomplite){
        let menu = []

        if(params.action !== 'tv'){
            menu.push({
                title: Lang.translate('title_now_watch'),
                url: params.action+'/now_playing'
            })
        }

        menu.push({
            title: Lang.translate('title_popular'),
            url: params.action+'/popular'
        })

        let date  = new Date()
        let query = []
            query.push('sort_by=release_date.desc')
            query.push('year='+date.getFullYear())
            query.push('first_air_date_year='+date.getFullYear())
            query.push('vote_average.gte=7')

        menu.push({
            title: Lang.translate('title_new'),
            url: 'discover/'+params.action+'?'+query.join('&')
        })

        if(params.action == 'tv'){
            menu.push({
                title: Lang.translate('title_tv_today'),
                url: params.action+'/airing_today'
            })

            menu.push({
                title: Lang.translate('title_this_week'),
                url: params.action+'/on_the_air'
            })
        }

        menu.push({
            title: Lang.translate('title_in_top'),
            url: params.action+'/top_rated'
        })

        oncomplite(menu)
    }

    img(path, size){
        let poster_size = Storage.field('poster_size')
        let baseimg = 't/p/' + poster_size + '/'
        let imgpath = baseimg

        if(size) imgpath = imgpath.replace(new RegExp(poster_size, 'g'), size)

        return path ? MetadataUtils.image(imgpath + path) : ''
    }

    screensavers(params, oncomplite, onerror){
        return null
    }

    clear(){
        this.network.clear()
    }

    discovery(){
        return {
            title: 'TMDB',
            search: this.search.bind(this),
            params: {
                align_left: true,
                object: {
                    source: 'tmdb'
                }
            },
            onMore: (params)=>{
                Activity.push({
                    url: 'search/' + params.data.type,
                    title: Lang.translate('search') + ' - ' + params.query,
                    component: 'category_full',
                    page: 2,
                    query: encodeURIComponent(params.query),
                    source: 'tmdb'
                })
            },
            onCancel: this.network.clear.bind(this.network)
        }
    }

    get(method, params = {}, oncomplite, onerror){
        let u = this.url(method, params)

        this.network.silent(u, (json)=>{
            json.url = method

            // Filter out Japanese content (anime) from multmovie and multtv results
            if((params.url == 'multmovie' || params.url == 'multtv') && json && json.results && Array.isArray(json.results)){
                json.results = json.results.filter(item => {
                    if(!item) return true
                    let isJapanese = (item.original_language === 'ja') ||
                                    (item.origin_country && item.origin_country.includes && item.origin_country.includes('JP'))
                    return !isJapanese
                })
            }

            oncomplite(json)
        }, onerror)
    }

    videos(params = {}, oncomplite, onerror){
        let lg = Storage.field('tmdb_lang')
        let status = new Status(lg == 'en' ? 1 : 2)
            status.onComplite = (res)=>{
                let data = []

                if(res.one && res.one.results.length) data = data.concat(res.one.results)
                if(res.two && res.two.results.length) data = data.concat(res.two.results)

                oncomplite({results: data})
            }

        this.get(params.method+'/'+params.id+'/videos',{langs: Storage.field('tmdb_lang')},(json)=>{
            status.append('one', json)
        },status.error.bind(status))

        if(lg !== 'en'){
            this.get(params.method+'/'+params.id+'/videos',{langs: 'en'},(json)=>{
                status.append('two', json)
            },status.error.bind(status))
        }
    }
}

export default new TMDBProvider()
