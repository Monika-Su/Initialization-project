var serverHost = location.host;

ngi18nextInit();

multiModal();

function ngi18nextInit(){
	//ng-i18next
	if(typeof angular != 'undefined'){				
		angular.module('jm.i18next').config(['$i18nextProvider', function ($i18nextProvider) {
			var userLang = navigator.language || navigator.userLanguage;
			if(userLang.indexOf('zh-TW') == 0){
				$i18nextProvider.options = {
						lng: 'zh-TW',
						cookieName: '_rt.lang',
						getAsync: false,
						fallbackLng: 'zh-TW',
						lngWhitelist: ['zh-TW'],
						keyseparator: '/',
						defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
				}
			}else if(userLang.indexOf('zh-CN') == 0){
				$i18nextProvider.options = {
						lng: 'zh-CN',
						cookieName: '_rt.lang',
						getAsync: false,
						fallbackLng: 'zh-CN',
						lngWhitelist: ['zh-CN'],
						keyseparator: '/',
						defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
				}
			}else{
				$i18nextProvider.options = {
						lng: 'en',
						cookieName: '_rt.lang',
						getAsync: false,
						fallbackLng: 'en',
						keyseparator: '/',
						defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
				}
			};
		}]);
	}
}

//enable multi modal issue for bootstrap
function multiModal(){
	$('.modal').on('hidden.bs.modal', function( event ) {
		$(this).removeClass( 'fv-modal-stack' );
		$('body').data( 'fv_open_modals', $('body').data( 'fv_open_modals' ) - 1 );
		$('.modal:visible').length && $(document.body).addClass('modal-open');
	});

	$( '.modal' ).on( 'shown.bs.modal', function ( event ) {

		// keep track of the number of open modals

		if ( typeof( $('body').data( 'fv_open_modals' ) ) === 'undefined' )
		{
			$('body').data( 'fv_open_modals', 0 );
		}


		// if the z-index of this modal has been set, ignore.

		if ( $(this).hasClass( 'fv-modal-stack' ) )
		{
			return;
		}

		$(this).addClass( 'fv-modal-stack' );

		$('body').data( 'fv_open_modals', $('body').data( 'fv_open_modals' ) + 1 );

		$(this).css('z-index', 1040 + (10 * $('body').data( 'fv_open_modals' )));

		$( '.modal-backdrop' ).not( '.fv-modal-stack' )
		.css( 'z-index', 1039 + (10 * $('body').data( 'fv_open_modals' )));


		$( '.modal-backdrop' ).not( 'fv-modal-stack' )
		.addClass( 'fv-modal-stack' );
	});
}

function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

function validUrl(url){
	return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z0-9]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}

function getParameterByName(name){
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexString = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexString);
	var found = regex.exec(window.location.search);
	if(found == null)
		return null;
	else
		return decodeURIComponent(found[1].replace(/\+/g, " "));
}

function isValid(str){
 	return !/[~`!#$%\^@&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

/* bootstrap-ckeditor-fix */
$.fn.modal.Constructor.prototype.enforceFocus = function() {
  	modal_this = this;
  	$(document).on('focusin.modal', function (e) {
	    if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
	    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') 
	    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
	      modal_this.$element.focus()
	    }
  	})
};