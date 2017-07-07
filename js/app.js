var theWindow = $(window).width();

$(document).ready(function() {

	if(theWindow < 1024) {
		// Menu celular
		$('.open-menu').on('click', function(){

			$('body').toggleClass('menu-aberto');
		});

		$('.open-sub').on('click', function(){

			if($(this).next('ul').is(':hidden')) {
				$(this).next('ul').css({
					'-webkit-transform' : 'translateX(0)',
					'-moz-transform' 	: 'translateX(0)',
					'-ms-transform' 	: 'translateX(0)',
					'transform' 		: 'translateX(0)',
					'display' 			: 'block'
				});
			} else {
				$(this).next('ul').css({
					'-webkit-transform' : 'translateX(-280px)',
					'-moz-transform' 	: 'translateX(-280px)',
					'-ms-transform' 	: 'translateX(-280px)',
					'transform' 		: 'translateX(-280px)',
					'display' 			: 'none'
				});
			}
		});

		$('.close-sub').on('click', function(){

			$('.dropdown').css({
				'-webkit-transform' : 'translateX(-280px)',
				'-moz-transform' 	: 'translateX(-280px)',
				'-ms-transform' 	: 'translateX(-280px)',
				'transform' 		: 'translateX(-280px)',
				'display' 			: 'none'
			});
		});
	}

	$('.fancy').fancybox({
		helpers : {
			title : {
				type : 'inside'
			},
			overlay : {
				locked : false
			}
		},
		afterShow: function() {
			$(':text').setMask();
		}
	});

	$('[data-menu]').each(function(){
        var menu = $(this).data('menu');
        if ($('body').is('.'+menu)) {
            $(this).find('a:eq(0)').addClass('actv');
        }
    });

    $(window).on('scroll load', function() {
    	var scrollTop = axysY();
    	if(scrollTop > 0) {
    		$('.mobile-menu').addClass('menu-scroled');
    	} else {
    		$('.mobile-menu').removeClass('menu-scroled');
    	}
    });

	//Retorna top
	function axysY() {
		return $(window).scrollTop();
	}

	$('.carousel').slick({

		arrows: false
	});

	$(window).on('load scroll', function() {

		if(axysY() > $('.wrap-header').height()) {

			$('.wrap-header').addClass('shrink');
		} else{

			$('.wrap-header').removeClass('shrink');
		}

		if($('body').hasClass('interna')) {

			if(axysY() > ($('.pos-relative').offset().top - 49)) {

				$('.positioned-target').addClass('is-positioned');
			} else {

				$('.positioned-target').removeClass('is-positioned');
			}
		}
		if($('body').hasClass('interna-teste-apagar')) {

			if(axysY() > ($('.pos-relative').offset().top - 49)) {

				$('.positioned-target').addClass('is-positioned');
			} else {

				$('.positioned-target').removeClass('is-positioned');
			}
		}
	});

	if(theWindow > 1024) {

		$('.open-sub, .toggle-menu').on('click', function() {

			$('body').toggleClass('menu-opened');
		});
	}

	//$(window).on('load', function() {
		window.setTimeout(function(){
			$('.lazy').addClass('carregado');
		},100);
		$('.lazy').each(function(i) {			
			//setTimeout(function() {

				//$('.lazy').eq(i).addClass('carregado')
			//}, i * 100);
		});

	$(window).on('load', function() {
		if ($('body').hasClass('home')) {
			//console.log('FOI');
			$('.list-filter > li > a').eq(0).click();
		}
	});

	$(function() {
		var $grid = $('.grid');
		
		$('.list-filter > li > a').click(function(){
			
			$('.list-filter > li > a').removeClass('actv').filter($(this)).addClass('actv');
			
			var filtro = $(this).data('filter');

			//console.log(filtro);
			
			if(filtro == "*") {
				filtro = filtro;
				} else {
				filtro = "."+filtro
			}
			
			$grid.isotope({
				filter: filtro,
				layoutMode: 'packery',
  				itemSelector: '.grid-item'
			});
		});
	});

	var vars = [], hash;
	function getUrlVars() {
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
	
	getUrlVars();

	setTimeout(function(){

		$('.list-filter > li > a[data-filter='+hash[1]+']').click()
	}, 50);
});



var language = 'br';
var Modelo = {
	
	init : function(){
		
		language = $('meta[name=language]').attr('content');
		
		Modelo.ajaxForm('[name=formNewsletter],[name=formContato],[name=formOrcamento]');
		
	
		
		$('input[alt=phone]').each(function(){
			$(this).click(function () {
				$.mask.masks.phone.mask = '(99) 9999-99999';
				$(':text').setMask();
			});
			$(this).blur(function () {
				var phone, element;
				element = $(this);
				phone = element.val().replace(/\D/g, '');
				if(phone.length > 10) {
					element.setMask("(99) 99999-9999?9");
					} else {
					element.setMask("(99) 9999-9999?9");
				}
			});
		});
		
		
		$('body').on('submit','[name=formTrabalheConosco]',function(){
			var $self = $(this);
			
			if ($self.data('enviando')) return false;
			if (!$self.find('.required').validate()) return false;
			
			$self.data('enviando',true);
			$.fancybox.showLoading();
			
			var callback = function(resp) {
				if (resp.redirect_url != undefined) {
					location.href = resp.redirect_url;
					return;
				}
				
				$.fancybox.hideLoading();
				$self.data('enviando',false);
				if (resp.popup_url != undefined) {
					
					$.fancybox.open([{
						href: resp.popup_url,
						type: ajax
					}]);
					
				}
				alert(resp.msg);
				if (resp.success) {
					$self[0].reset();
					$self.find('.btn-upload').val('Selecionar');
					$self.find('[name*=curriculo]').remove();
				}
			};
			
			$.ajax({
				url: $self.attr('action')+'?t='+Date.now(),
				method: 'post',
				dataType: 'json',
				data: $self.serializeArray(),
				success: callback,
				error: function() {
					callback({success:false,msg:"Não foi possível enviar o formulário."});
				}
			});
			
			return false;
		});
		
		
	},
	
	ajaxForm: function(selector,cb) {
		$('body').on('submit',selector,function(){
			var $self = $(this);
			if ($self.data('enviando')) return false;
			if (!$self.find('.required').validate()) return false;
			
			$self.data('enviando',true);
			$.fancybox.showLoading();
			
			var callback = function(resp) {
				$self.data('enviando',false);
				$.fancybox.hideLoading();
				
				if (cb) return cb(resp,$self);
				alert(resp.msg);
				if (resp.success) {
					$self[0].reset();
				}
			}
			
			$.ajax({
				url: $self.attr('action')+'?t='+Date.now(),
				type: 'post',
				dataType: 'json',
				data: $self.serializeArray(),
				success: callback,
				error: function() {
					callback({success:false,msg:"Não foi possível enviar o formulário."});
				}
			});
			return false;
		});
	},
	
	
}
$(document).ready(function(){
	$(Modelo.init);
});

/**
	* MEDIAS
*/
// > 1024 pixels
//if($(window).width() > 1024) {

//Habilita Máscara apenas para desktops
$(function(){
	$.mask.masks.phone.mask = '(99) 9999-99999';
	$(':text').setMask();
});
//}

$(function(){
	var $img = $('#flyer img');
	if ($img.length==0) return;
	var flyer = new Image();
	flyer.onload = function() {
		$.fancybox({
			href:'#flyer',
			autoResize : false,
			autoCenter : false,
			autoSize : true
		});
	}
	flyer.src = $('#flyer img').attr('src');
});								