import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import "~bootstrap/dist/css/bootstrap.min.css";
import 'animate.css';
import '../css/style.css';
import theMovieDb from './theMovieDb.js';
import cache from './cache.js';
import $, { event } from 'jquery';
import logo from 'images/logo.png';
import defaultMovieImage from 'images/default-movie.jpg';
import contactForm from './contactForm.js';

$(() => {

	// cache time on load page // cache deleted on refresh page
	cache.setStale(60);	

	// insert logo
  	$("#logo img").attr('src', logo);

	//slide nav
	$('#slideToggle').on('click', () => {
		let slide = $('#slide');
		
		if(slide.offset().left < 0){
			slide.animate({marginLeft: 0}, 500);
			
			$('#menu div').each((index, item) => {
				$(item).animate({
					paddingTop: "25px",
					opacity: 1,
				}, 1000)
			});
			
		}else{
			$('#menu div').each((index, item) => {
				$(item).animate({
					paddingTop: "250px",
					opacity: 0,
				}, 1000)
			});
			slide.animate({marginLeft: -250}, 500);
			
		}

		$(".open-icon").toggleClass('d-none');
		$(".close-icon").toggleClass('d-none');
		
	});

	$('#menu a').on('click', (e) => {
		let fun = $(e.target).data('api');
		if(fun){
			backToTop();
			theMovieDb.movies[fun]()
			.then((data) => {
				display(data.results)
			})
		}
	});

	// theMovieDb.movies.getNowPlaying({page: 1})
	// .then((data) => {
	// 	display(data.results)
	// }).catch(e => {
	// 	console.error(e);
	// });


	//search input
	$('#search').on('change', (e) => {
		let query = e.target.value;
		if(query !== ""){
			theMovieDb.movies.doSearch(query, {page: 1})
			.then((data) => {
				display(data.results)
			});
		}else{
			theMovieDb.movies.getNowPlaying({page: 1})
			.then((data) => {
				display(data.results)
			})
		}
	});

	// display result
	const display = (data) => {
		let container = $('#items')
		let html = "";
					
		$.each(data, (index, movie) => {
			movie = validateResponseData(movie);
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

	function validateResponseData(obj){
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

	

	let toTopBtn = $('#toTopBtn');
	toTopBtn.on('click', () => {
		backToTop();
	});
	const backToTop = () => $('html').animate({scrollTop:0}, 1500);

	$(window).on('scroll', () => {
		if(window.scrollY > 100){
			toTopBtn.removeClass('invisible');
		}else{
			toTopBtn.addClass('invisible')
		}
	});

	let passInputs = $('.password');
	let showPassBtns = $('.showPassBtn');
	
	passInputs.each((index, input) => {

		$(input).on('focus', (e) => {
			let input = $(e.target);
			let icon = input.parent().find('i');
			icon.animate({
				bottom: 10,
				opacity: 1,
			});
		});
	});

	showPassBtns.each((index, icon) => {
		icon = $(icon);
		icon.on('click', (e) => {
			let input = $(e.target).parent().find('.password');
			if(input.attr('type') === 'password'){
				input.attr('type', 'text');
				icon.removeClass('fa-eye').addClass('fa-eye-slash');
			}else{
				input.attr('type', 'password');
				icon.removeClass('fa-eye-slash').addClass('fa-eye');
			}
		});

	});

	$(document).on('click focus keyup', (e) => {
		let target = $(e.target);
		if(target.hasClass('password') || target.hasClass('showPassBtn') ){
			return false;	
		}

		showPassBtns.animate({
			bottom: -20,
			opacity: 0,
		});		
	});

	contactForm();


	// $('#loader').fadeOut(2000);

});


