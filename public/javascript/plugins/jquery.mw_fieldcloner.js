(function($) {

  var methods = {

		init: function(options) {
			
			settings = $.extend({
				childType: '.pure-u-1',
				deleteBtnClass: '.delete_btn',
				addBtnClass: '.add_btn'
			}, options);

	     	return this.each(function() {
		        var $this = $(this),
		            data = $this.data('mwFieldCloner');
						
		        if ( !data ) {
					$this.data('mwFieldCloner', {
						template : $( "#"+$this.data('template') ).html(),
						total : $this.children( settings.childType ).length
					});
				}

				// enable all delete buttons
				$(settings.deleteBtnClass).click( function(e){
					e.preventDefault();
					// walk up the tree to find first child element
					removeTemplate( $(this).parents(settings.childType).first() );
				})

				$this.find(settings.addBtnClass).click( function(e){
					e.preventDefault();
					// just add a new template to the element
					addTemplate();
				});

				// FUNCTIONS
				function addTemplate() {
					var $temp = $( $this.data('mwFieldCloner').template ).insertAfter( $this.find(settings.childType + ":last") );
					$temp.find(settings.deleteBtnClass).removeClass('hidden').click( function(e){
						e.preventDefault();
						removeTemplate( $temp )
					})
					$this.data('mwFieldCloner').total++;
					configureFields();
				}

				function removeTemplate( item ) {
					console.log('removeTemplate');
					if(!item) {
						item = $this.find( settings.childType ).last();
					}
					$(item).remove()
					configureFields();
				}

				function configureFields() {
					console.log('configureFields');
					$this.children( settings.childType ).each(function(i){
						
						console.log('count',i, this);

						$(this).find('input, select, textarea').each(function(j){
							var $this = $(this);

							// replace that placeholder with the latest index
							if( $this.attr('name') ) {
								var newName = $this.attr('name').replace(/\[##\]/, "["+i+"]");
							}
							// now go udpate other relevant attributes
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
						changeMonth: true,
						changeYear: true,
						buttonImage: "/images/btn_datepicker.png",
						showOn: "both",
						buttonImageOnly: true
					});
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
