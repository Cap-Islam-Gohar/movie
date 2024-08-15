import $, { error } from 'jquery';
import cache from './cache.js';
import defaultMovieImage from 'images/default-movie.jpg';

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
            // console.log('form cache')
            return Promise.resolve(data);
        }else{
            return await fetch(url)
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                // console.log('form request')
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

// display result
theMovieDb.display = (data) => {
    let container = $('#items')
    let html = "";
                
    $.each(data, (index, movie) => {
        movie = theMovieDb.validateResponseData(movie);
        html += `
        <div class="col-sm-12 col-md-6 col-lg-4 animate__animated animate__fadeIn">
            <div class="item animate__fadeIn">
                <div class="poster animate__fadeIn">
                    <img class="img-fluid" src="${movie.image}"/>
                </div>
                <div class="overlay">
                    <h1 class="title animate__animated animate__slideOutLeft">${movie.title}</h1>
                    <p class="desc animate__animated animate__slideOutLeft">${movie.overview}</p>
                    <p class="date animate__animated animate__slideOutLeft">
                        <span>Release Date<span> : ${movie.release_date}</span></span>
                    </p>
                    <p class="rate animate__animated">
                        ${movie.rate}
                    </p>
                    <p class="vote animate__animated">${movie.vote_average}</p>
                </div>
            </div>
        </div>`
    });

    container.html(html);

    $('#items .row div').addClass("animate__fadeIn");

    $('.item').on('mouseenter mouseleave', (e) => {
        let target  = $(e.delegateTarget);
        let overlay = target.find('.overlay');
        let title = overlay.find('.title');
        let desc = overlay.find('.desc');
        let date = overlay.find('.date');
        let rate = overlay.find('.rate'); 
        
        if(e.type === 'mouseenter'){	
            overlay.css({"opacity":"1","visibility":"visible"});		
            title.removeClass('animate__slideOutLeft');
            title.addClass('animate__fadeInDown animate__delay-0s');
            desc.removeClass('animate__slideOutLeft');
            desc.addClass('animate__flipInX animate__delay-0s');
            date.removeClass('animate__slideOutLeft');
            date.addClass('animate__fadeInUp animate__delay-0s');
            rate.removeClass('animate__slideOutLeft');
            rate.addClass('animate__fadeInUp animate__delay-0s');
            target.find('.poster img').addClass("animateImage");
            
        }else if (e.type === 'mouseleave'){
            title.addClass('animate__slideOutLeft');
            title.removeClass('animate__fadeInDown animate__delay-0s');
            desc.addClass('animate__slideOutLeft');
            desc.removeClass('animate__flipInX animate__delay-0s');
            date.addClass('animate__slideOutLeft');
            date.removeClass('animate__fadeInUp animate__delay-0s');
            rate.addClass('animate__slideOutLeft');
            rate.removeClass('animate__fadeInUp animate__delay-0s');
            target.find('.poster img').removeClass("animateImage");
            overlay.css({"opacity":"0","visibility":"hidden"});
        }
    });
}

theMovieDb.validateResponseData = (obj) => {
    return {
        title: obj?.title ?? obj?.name ?? 'Title',
        overview: obj.overview.length > 300 ? obj.overview.slice(0,250)+ '...' : obj.overview,
        release_date: obj?.release_date ?? obj?.first_air_date ?? 'Release Date UnKnown',
        vote_average: obj.vote_average.toFixed(1),
        get image(){
            let image = obj?.poster_path ?? obj?.backdrop_path;
            return image = image ? theMovieDb.config.images_uri + image : defaultMovieImage;
        },
        get rate(){
            let stars = "";
            let value = Math.floor(obj.vote_average);
            let isOdd = value % 2;
            let solid = isOdd ? (value-1) / 2: value /2;
    
            for (let i = 0; i < 5; i++) {
                let star = '<i class="fa-regular fa-star fs-6"></i>';
                if(value === 0 ){
                    star = `<i class="fa-solid fa-star text-muted fs-6"></i>`;
                }
                if(i < solid){
                    star = '<i class="fa-solid fa-star fs-6"></i>';
                }
                if(i == solid && isOdd){
                    star = '<i class="fa-regular fa-star-half-stroke fs-6"></i>';
                }
                stars += star;
            }
            return stars;
        }
    }
}


export default theMovieDb;