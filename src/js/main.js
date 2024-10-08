import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import "~bootstrap/dist/css/bootstrap.min.css";
import 'animate.css';
import '../css/style.css';
import '../css/media.css';
import theMovieDb from './theMovieDb.js';
import cache from './cache.js';
import $ from 'jquery';
import logo from 'images/logo.png';
import contactForm from './contactForm.js';
import passwordshow from './passwordshow.js';

$(() => {

	// cache time on load page // cache deleted on refresh page
	cache.setStale(60);	

	// insert logo
  	$("#logo img").attr('src', logo);

	//slide nav
	$('#slideToggle').on('click', () => {
		let slide = $('#slide');
		let links = $('#menu div');		
		if(slide.offset().left < 0){
			let freeSpace = $(window).innerHeight() - $('.social').innerHeight();
			let paddingTop = freeSpace < 300 ? freeSpace / (links.length * 34) : 25; 
			slide.animate({marginLeft: 0}, 500);			
			links.each((index, item) => {
				$(item).animate({
					paddingTop: `${paddingTop}px`,
					opacity: 1,
				}, 1000)
			});
		}else{
			links.each((index, item) => {
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
				theMovieDb.display(data.results)
			})
		}
	});

	theMovieDb.movies.getNowPlaying({page: 1})
	.then((data) => {
		theMovieDb.display(data.results)
	}).catch(e => {
		console.error(e);
	});


	//search input
	let searchtimer;
	$('#search').on('input', (e) => {
		clearTimeout(searchtimer);
		searchtimer = setTimeout(() => {
			let query = e.target.value;
			if(query !== ""){
				theMovieDb.movies.doSearch(query, {page: 1})
				.then((data) => {
					theMovieDb.display(data.results)
				});
			}else{
				theMovieDb.movies.getNowPlaying({page: 1})
				.then((data) => {
					theMovieDb.display(data.results)
				});
			}
		}, 1000);
	});
	

	let toTopBtn = $('#toTopBtn');
	toTopBtn.on('click', () => {
		backToTop();
	});
	const backToTop = () => $('html').animate({scrollTop:0}, 500);

	$(window).on('scroll', () => {
		if(window.scrollY > 100){
			toTopBtn.removeClass('invisible');
		}else{
			toTopBtn.addClass('invisible')
		}
	});

	
	passwordshow();
	contactForm();
	$('#loader').fadeOut(2000);

});


