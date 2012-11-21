(function($) {

  var methods = {

		init: function(options) {
			
			settings = $.extend( {
					childType: 'fieldset'
				,	deleteBtnClass: '.delete_btn'
				, navMarkup : '<nav><ul><li><a href="#" class="add_btn">+</a></li><li><a href="#" class="minus_btn">-</a></li></ul></nav>'
			}, options);

     	return this.each(function(){

         var $this = $(this),
             data = $this.data('mwFieldCloner');
				
        if ( ! data ) {

					$this.data('mwFieldCloner', {
							template : $( "#"+$this.data('template') ).html()
						, total : $this.children( settings.childType ).length
						, $nav : $(settings.navMarkup).appendTo( $this )
					});

				}

				// enable all delete buttons
				$(settings.deleteBtnClass).click( function(e){
					e.preventDefault();
					removeTemplate( $(this).parents(settings.childType).first() );
				})



				$this.data('mwFieldCloner').$nav.find('.minus_btn').click( function(e){
					e.preventDefault();
					removeTemplate();
				})

				$this.data('mwFieldCloner').$nav.find('.add_btn').click( function(e){
					e.preventDefault();
					addTemplate();
				});



				addTemplate( $this.data('mwFieldCloner').template );

				// console.log( data.settings )

				// FUNCTIONS

				function addTemplate() {

					console.log('addTemplate'); 
						
					var $temp = $( $this.data('mwFieldCloner').template ).insertBefore( $this.data('mwFieldCloner').$nav );

					$temp.find(settings.deleteBtnClass).removeClass('hidden').click( function(){
						e.preventDefault();
						removeTemplate( $temp )
					})

					$this.data('mwFieldCloner').total++;
					configureNav();
					configureFields();

				}

				function	removeTemplate( item ) {
					console.log('removeTemplate');
					if(!item) {
						item = $this.find( settings.childType ).last();
					}

							console.log(item); 
						
				
					if ($this.data('mwFieldCloner').total > 1) {
						$(item).remove()
						$this.data('mwFieldCloner').total--;
					}
					configureNav();
					configureFields();
				}


				function configureNav() {
					console.log('configureNav');
					var $minusBtn = $this.data('mwFieldCloner').$nav.find('.minus_btn');

					if($this.data('mwFieldCloner').total == 1 && !$minusBtn.hasClass('disabled')){
						$minusBtn.addClass('disabled')
					}
					else if($this.data('mwFieldCloner').total > 1 && $minusBtn.hasClass('disabled')) {
						$minusBtn.removeClass('disabled')
					}

				}

				function configureFields() {
					console.log('configureFields');
					$this.children( settings.childType ).each(function(i){
						
						console.log('count',i, this);

						$(this).find('input, select, textarea').each(function(j){


							var $this = $(this);

							if( $this.attr('name') )
								var newName = $this.attr('name').replace(/\[.*\]/, "["+i+"]");

							// console.log($this, newName);

							if( newName ){
												
								$this.attr('name', newName);
								$this.attr('id', newName);
								$this.attr('tabIndex', $this.attr('tabindex')*100 ); 

								$this.siblings('label').first().attr('for', newName)
							}

						});

					});



					$(".tags").tagit();


					$( ".datepicker input" ).datepicker({
						changeMonth: true
						,	changeYear: true
						,	buttonImage: "/images/btn_datepicker.png"
						,	showOn: "both"
						,	buttonImageOnly: true
						}
					);

				}

			
			});

		}

	
	};

	$.fn.MwFieldCloner = function(method) {

	    if (methods[method]) {
	        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	    } else if (typeof method === 'object' || !method) {
	        return methods.init.apply(this, arguments);
	    } else {
	        $.error('The method: ' + method + ' does not exist');
	    }

	};

})(jQuery);
