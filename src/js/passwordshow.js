import $ from 'jquery';

export default () => {
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
}