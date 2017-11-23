
$(document).ready(function(){

/*-------------------------*
	   SMOOTH SCROLL
---------------------------*/

const $scroll_link = $('.smooth-scroll');
$scroll_link.click(function(event){
	event.preventDefault();
	$('body,html').animate({
		scrollTop: $(this.hash).offset().top
	},1000);
	if($(window).width()<580){menu.slideToggle()};
});


/*-------------------------*
	 PORTFOLIO LOADING
---------------------------*/

const loading_button = $('#works button');
loading_button.on('click', function(){
	$.ajax({
    type: "GET",   
    url: "photos.json",
    dataType : 'json',
    success: function(data) {
        loading_button.before('<div class="works-container"></div>');
		let i = ($('.works-container').length-1)*6; //inicjalizacja licznika to ilosc zdjec w jednym kontenerze pomnozona przez ilosc kontenerow
		let stop = i+6; //wartosc graniczna to wartosc startowa plus 6 zdjec (ilosc w jednym kontenerze)
		for(i;i<stop;i++){
			$('.works-container:last-of-type').css("display","none");
			let output = '<div class="works-item"><a href="#"><img src="' + data.images[i].source + '" alt="' + data.images[i].description + '" /></a><a href="#" class="works-description"><span>' + data.images[i].category + '</span><span>beautiful ' + data.images[i].category + '</span></a></div>';
			$('.works-container:last-of-type').append(output).fadeIn();
		};
		if($('.works-container img').length>=data.images.length){
				loading_button.fadeOut(1000);
		};
    },
    error: function() {
        console.log( "Wystąpił błąd");
    }
	});
});


/*-------------------------*
	TESTIMONIALS SLIDER
---------------------------*/

const $slider = $('.testimonials-container');
const $slides = $('.testimonials-slide');
const $buttons = $('.slider-navigation>div');
let current_index = 0;
let timeout;

function move(new_index) {
	advance();
	
	$buttons.eq(current_index).removeClass('show-button');
	$buttons.eq(new_index).addClass('show-button');

	if(current_index === new_index){
		return;
	}
	else {
		$slides.eq(current_index).fadeOut();
		$slides.eq(new_index).fadeIn();
	}
	
	current_index = new_index;
};

function advance() {
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		if(current_index<($slides.length-1)){
			move(current_index+1);
		} else {
			move(0)
		}
	}, 5000);
}

$.each($buttons, function(index){
	if(index==current_index){
		$buttons.eq(index).addClass('show-button');
	}
	$(this).on('click', function(){
		move(index)});
	});	

advance(); 


/*-------------------------*
	VIDEO - PLACEHOLDER
---------------------------*/

$('.video-modal').on('click', function(){
	$('.video-wrapper').append('<iframe width="560" height="315" src="https://www.youtube.com/embed/LmOrMXWYG7Q?rel=0&controls=2&autoplay=1&mute=1&fs=0&rel=0"frameborder="0"></iframe>');
	$('.video-modal').fadeOut(1700);
  });


/*-------------------------*
	  FORM VALIDATION
---------------------------*/

const forms = document.querySelectorAll("form[data-validate]");
const validated_inputs = document.querySelectorAll("form[data-validate] input[data-validate-rules]");
const validate_type = {
	reset_validation: function(element){
		const validate_info = element.nextElementSibling;
		element.classList.remove("error-field");
		validate_info.innerHTML="";
	},
	required: function(element){
		const validate_info = element.nextElementSibling;
		if(/^\s*$/.test(element.value)==true){
			validate_info.insertAdjacentHTML("beforeend","<p class='validation_details'>This field is required</p>");
			element.classList.add("error-field");
		} 
	},
	max_length: function(element){
		const validate_info = element.nextElementSibling;
		if(element.value.length>40){
			validate_info.insertAdjacentHTML("beforeend","<p class='validation_details'>This field must not contain more than 30 signs</p>");
			element.classList.add("error-field");
		}
	},
	email_pattern: function(element){
		const validate_info = element.nextElementSibling;
		if(element.value.search(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)==-1&&element.value!==""){
			validate_info.insertAdjacentHTML("beforeend","<p class='validation_details'>Invalid email pattern</p>");
			element.classList.add("error-field");
		}
	},
	no_special_char: function(element){
		const validate_info = element.nextElementSibling;
		if(/[\-\[\]\/\\,\\\{\}\(\)\*\+\?\.\^\$\|]/.test(element.value)==true&&element.value!==""){
			validate_info.insertAdjacentHTML("beforeend","<p class='validation_details'>This field should not contain any special characters or symbols</p>");
			element.classList.add("error-field");
		}
	}
};

// containers for validation info
validated_inputs.forEach(function(element){element.insertAdjacentHTML("afterend","<div class='validation_info'></div>")});
// validation on blur for each input

for(let i=0;i<validated_inputs.length;i++){
	validated_inputs[i].addEventListener("blur", function(){
		const attributes = validated_inputs[i].getAttribute("data-validate-rules").split(",");
		for(let index=0;index<attributes.length;index++){
			if(typeof validate_type[attributes[index]]==="function"){
				validate_type[attributes[index]](validated_inputs[i]);
			};
		};
	});
};

// validation on submit

forms.forEach(function(element){
	const inputs_to_final_validation = element.querySelectorAll("input[data-validate-rules],select[data-validate-rules],textarea[data-validate-rules]");
	const submit_button = element.querySelector("input[type=submit]");
	submit_button.addEventListener("click",function(event){
		event.preventDefault();
		element.querySelectorAll(".validation_info").forEach(function(element){ //reset
		element.innerHTML="";});
		for(let i=0;i<inputs_to_final_validation.length;i++){
			const attributes = inputs_to_final_validation[i].getAttribute("data-validate-rules").split(",");
			for(let index=0;index<attributes.length;index++){
				if(typeof validate_type[attributes[index]]==="function"){
				validate_type[attributes[index]](inputs_to_final_validation[i]);
				};
			};
		};
	});
});


/*-------------------------*
	    MOBILE MENU
---------------------------*/

const menu_button = $('.menu-trigger');
const menu = $('nav ul');

menu_button.on('click', function(){
	menu.slideToggle();
});

$(window).resize(function() {
$("nav > ul").removeAttr("style");
});

}); // end of document ready function	
