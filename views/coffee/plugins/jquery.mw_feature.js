/*!
 * jQuery Moving Worlds Feature Plugin
 * Original author: Jonah Werre
 */
;(function ( $, window, document, undefined ) {

    var pluginName = 'MwFeature',
        defaults = {
	        	data: '/api/page/home'
					,	offset: {"x":26,"y":50}
					, autoStart: 8000
					, dropRate: 1
					, startIndex: 0
					,	popupTemplate: '<div class="testemonial_popup"><header><h2></h2><a href="#" class="close_btn">close</a></header><section class="video_testimony"><iframe id="yplayer" width="425" height="216" src="" frameborder="0" allowfullscreen="allowfullscreen"></iframe></section><section class="profile"><div class="avatar"><div class="av_img_container"><img src="images/tmp_avatar1.png"></div></div><div class="profile_info"><hgroup><h3></h3><h4></h4></hgroup><p></p></div></section><div class="popup_arrow"></div></div>'
					,	markerTemplate: '<div class="marker"></div>'
        };

    function MwFeature( element, options ) {

        this.element = element;
        this.settings = $.extend( {}, defaults, options );
				this.popup;
				this.markerData;
				this.markers = [];
				this.currentIndex;
				this.rotateInterval;	

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    };

    MwFeature.prototype = {
        
    	init: function() {
				
				var _this = this;
				_this.popup = $(_this.settings.popupTemplate).appendTo(_this.element);
				
				_this.markerData = featureData
				
				for ( var i in _this.markerData ) {
					var data = _this.markerData[i];
					var marker = $(_this.settings.markerTemplate).appendTo(_this.element)
					.addClass(data.type+'_icn')
					.css( {'top': '-100px', 'left': data.x+'px'} )
					.delay(i*_this.settings.dropRate*100)
					.animate( {'top': data.y+'px', 'opacity':1}, 800, "easeOutBounce", 
						function(){
							var index = $(this).index('.marker');
							if( index === _this.settings.startIndex){
								_this.open(index, 2000);
								if(_this.settings.autoStart > 0 ) {
									_this.play(_this.settings.startIndex);
								}	
							}
					}).click( function(e){
						e.preventDefault();
						_this.open( $(this).index('.marker') );
					});
					_this.markers.push( $(marker) )
				}
				
				
				$(".testemonial_popup .close_btn").click(function(e){
					e.preventDefault();
					_this.hide();
				});
				
				$(this.popup).hover(function(){
					_this.pause();
				});

    	}

			,	open: function( index, delay ) {

				console.log('open', index, delay);
				var _this = this;
				
				if(index == _this.currentIndex){
					_this.hide();
					return;
				}
				
				if( typeof delay == 'undefined') {
					delay = 0;
				}
				
				_this.currentIndex = index;
				
				
				var position = _this.markers[index].position();
				var left = position.left > $(_this.element).width()*.5;
				var $arrow = $(_this.popup).children('.popup_arrow').first();
				var yPos = _this.settings.offset.y;
				var xPos = ( left ) 
							? position.left - 447 - _this.settings.offset.x*.5
							: position.left + _this.settings.offset.x;
				var arrowPos = ( position.left > $(_this.element).width()*.5 ) 
							? { "right": "-13px" , "top": position.top - _this.settings.offset.y+"px", "background-position": "-36px -20px"  } 
							: { "left":"-13px", "top": position.top - _this.settings.offset.y+"px", "background-position":"-36px 0px" };
				
				// console.log(_this.markerData);
				
				$(_this.popup).slideUp('fast', "easeInSine", function(){
					
					$('.testemonial_popup h2').text(_this.markerData[index].h2)
					$('.testemonial_popup h3').text(_this.markerData[index].h3)
					$('.testemonial_popup h4').text(_this.markerData[index].h4)
					$('.testemonial_popup p').text(_this.markerData[index].description)
					$('.testemonial_popup img').attr('src',_this.markerData[index].image)
					$('#yplayer').attr('src', "http://www.youtube.com/embed/"+_this.markerData[index].video_id+"?controls=1&showinfo=0")
					
					$(_this.popup).attr('style', "").css({"left":xPos+"px", "top": yPos+"px"});
					$arrow.attr('style', "").css(arrowPos);
					$(_this.popup).delay(delay).slideDown('slow', "easeOutSine");
				});
				
			}
			
			,	hide: function(speed) {

				var _this = this;

				if( typeof speed == 'undefined') {
					speed = 'fast';
				}
				_this.pause();
				_this.currentIndex = null;
				$("#yplayer").attr('src', '');
				
				$(_this.popup).slideUp(speed, "easeOutSine", function(){

				});
			}

			,	play: function( from ) {

				var _this = this;

				var count = from;
				
				_this.rotateInterval = setInterval ( function(){
					if(count < _this.markers.length-1 ) {
						count++;
					} else {
						count = 0;
					}
					_this.open(count, 500);
				}, _this.settings.autoStart );
			}

			,pause: function() {
				var _this = this;
				clearInterval(_this.rotateInterval);
			}

    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data( this, 'plugin_' + pluginName,
                new MwFeature( this, options ) );
            }
        });
    }

})( jQuery, window, document );