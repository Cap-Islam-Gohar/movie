import cache from './cache.js';

const theMovieDb = {};

theMovieDb.config = {
    v: "3",
    api_key: "75a72076d33126cfc6451e5bd88d1772",
    base_uri: "https://api.themoviedb.org",
    images_uri: "http://image.tmdb.org/t/p/w500",
    include_adult: false,
    language: "en-US",
    // region: "US",
};

theMovieDb.common = {
    generateUrl (path, params) {
        let config = theMovieDb.config;
        
        let finalParams = { 
            api_key: config.api_key,
            language: config.language,
            // region: config.region,
            include_adult: config.include_adult,
            ...params
        };

        let url = [
            [config.base_uri, config.v, path].join('/'), 
            new URLSearchParams(finalParams).toString()
        ].join('?');

        return url;
    },
    async get(url) {

        let data = cache.get(url);
        if(data) {
            console.log('form cache')
            return Promise.resolve(data);
        }else{
            return await fetch(url)
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                console.log('form request')
                let data = await response.json();
                cache.set(url, data);
                return data;
            })
            .catch(error => {
                throw new Error(`Error : ${error.message}`);
            });
        }
        
    }
}

theMovieDb.movies = {
    getNowPlaying (params) {
        let originParams = {
            page: 1, 
        };
        let url = theMovieDb.common.generateUrl('movie/now_playing', {...originParams, ...params});
        return theMovieDb.common.get(url);        
    },
    getUpcoming(params) {
        let originParams = {
            page: 1, 
        };
        let url = theMovieDb.common.generateUrl('movie/upcoming', {...originParams, ...params});
        return theMovieDb.common.get(url);  
    },
    getPopular(params) {
        let originParams = {
            page: 1, 
        };
        let url = theMovieDb.common.generateUrl('movie/popular', {...originParams, ...params});
        return theMovieDb.common.get(url);  
    },
    getTopRated(params) {
        let originParams = {
            page: 1, 
        };
        let url = theMovieDb.common.generateUrl('movie/top_rated', {...originParams, ...params});
        return theMovieDb.common.get(url);  
    },
    //time_window: "Day" | "Week"
    getTrending(time_window = "day", params) {
        let originParams = {
            page: 1, 
        };
        let url = theMovieDb.common.generateUrl(`trending/movie/${time_window}`, {...originParams, ...params});
        return theMovieDb.common.get(url);  
    },
    doSearch(query, params) {
        if(query){
            let originParams = {
                query: query,
                page: 1,
                primary_release_year: "", 
                year: "",
            };
            let url = theMovieDb.common.generateUrl('search/movie', {...originParams, ...params});
            return theMovieDb.common.get(url);
        }else{
            console.log('query required')
        }
        
        
    },
}


export default theMovieDb;