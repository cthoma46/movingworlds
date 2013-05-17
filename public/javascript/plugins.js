$(document).ready(function(){

	var BASE_URL = 'http://dev.mw:17127';

	$( ".combobox" ).combobox({});

	$( ".tabs, .tab_widget" ).tabs({
		cookie: { expires: 1 }
	});

	if($('.modal.autoplay').length > 0)
		$('.modal.autoplay').MwModal({});

	$('#dotmap').MwFeature();

	// $('#work_history').MwFieldCloner();
	$('#work_history, #education_history').MwFieldCloner();

	// home page invite field
	$('#get_invite_btn').click(function(e){
		e.preventDefault();
		$('#invite_form input').focus();
	});

	// display extra fields if experteer is chosen.
	// $('#invite_extras select#type').bind( "autocompletechange", function(event, ui) {
	// 	console.log( $(this).val() );
	// 	if($(this).val() == 'experteer') {
	// 		$('.experteer_only').removeClass('hidden');
	// 	}else{
	// 		$('.experteer_only').addClass('hidden').children('input').val('');
	// 	}
	// });

	//

	$(".experteer_box, .org_box").click(function(e){
		$this = $(this);
		e.preventDefault;
		$(".experteer_box, .org_box").removeClass('on');
		$this.addClass('on');
		if($this.is('.experteer_box')){
			$("li.step2 span").text('Personal Information');
			$("li.step3 span").text('Work & Education');
			$('#next').attr('href', '/register/2/experteer');
			$('input[name="type"]').attr('value', 'expterteer');
		}
		else{
			$("li.step2 span").text('Company Information');
			$("li.step3 span").text('First Opportunity');
			$('#next').attr('href', '/register/2/org');
			$('input[name="type"]').attr('value', 'representative');
		};
	});

	$("input[name='registered[is_registered]']").click(function(){
		var $this = $(this);
		if ($this.val() === 'true') {
			console.log( $('#registered_options') );
			$('#registered_options').show();
		}else{
			$('#registered_options').hide();
		};

	});

	$( ".slider" ).slider({
			range: "min"
		,	value: 0
		,	min: 1
		,	max: $(this).data('max')
		,	create: function( event, ui ) {
			var max = $(this).data('max');
			var min = $(this).data('min');
			$(this).slider( "option", "max", Number(max) );
			$(this).slider( "option", "min", Number(min) );
		}
		,	slide: function( event, ui ) {
			$( ".slider + input[type='hidden']" ).val( ui.value );
			$( ".slider_label span" ).text( ui.value );
		}
	});



	// $('#graduated').change(function(){
	//   if($(this).is(':checked')){
	// 		$("#degree").focus().parents('li').first().removeClass('hidden');
	//   } else {
	// 		$("#degree").val('').parents('li').first().addClass('hidden');
	//   }
	// });

	$('input[type="file"]').uploadifive({
		'auto' : false,
		'formData' : {'_id' : 'some id'},
		'buttonText' : 'Upload Avatar',
		'uploadScript' : '/upload-avatar',
		'onUploadComplete' : function(file, data) {
			console.log(data);
		}
	});


	$(".subnav").hoverIntent({
			over: function(){
				$(this).children('ul').first().slideDown('fast');
			},
			out: function(){
				$(this).children('ul').first().slideUp();
			},
			timeout: 500
	});

	// $( '.tags' ).tagit({
	// 		availableTags: ["Option 1","Option 2","Option 3","Option 4"]
	// 	,	create: function(event, ui) { }
	// 	,	onTagAdded: function(event, tag) {}
	// });

	$( '#msg_to' ).tagit({
			availableTags: ["Option 1","Option 2","Option 3","Option 4"]
	  ,	tagSource: function(search, response) {

	    var that = this;
	    $.ajax({
	      url: '/api/user',
	      data: {fields:'firstName|lastName', search:search.term},
	      success: function(data) {

	      	try	{
						response(
							$.map( data, function( item ) {
	      	  		return {
	      	  			 	value: item._id
	      	  			, label: item.firstName + " " + item.lastName
	      	  		}
	  	      	})
						);
					} catch(e){

					}
	      }
	    });

	  }
	  ,	onTagAdded: function(event, ui) {
	  	// console.log(event, ui);
	  }
	});

	$('.reply_btn a').click(function(e){
		e.preventDefault();
		$this = $(this);
		$('.tabs').tabs( "select" , 2 )
		$('#msg_to').tagit("removeAll")
		$("#msg_to").tagit("createTag", $this.data('uid'), $this.data('name') );
		var subject = $this .parents('.email').first().find('h3').text();
		$("#msg_subject").val( "RE: "+subject );
		$("#msg_body").focus();

	});

	$('.delete_msg_btn').click(function(e){
		e.preventDefault();
		$this = $(this);
		$.ajax({
				url: '/api/messages',
				method: 'delete',
				data: {},
				success: function(data) {
					console.log(data);
					$this.parents('.email').first().slideUp();
				}
			});
	})



	$( '.datepicker input' ).datepicker({
			showOn: "both"
		,	changeMonth: true
		,	changeYear: true
		,	buttonImage: "/images/btn_datepicker.png"
		,	buttonImageOnly: true
		// ,onSelect: function(dateText, inst) {
		// 	console.log(this)		
		// }
	});

	$('#flash_message').delay(2000).slideUp('slow');

	// AJAX

	// $('#invite_extras').live('submit', function(e){
	// 	e.preventDefault();
	// 	console.log(this);
	// 	var $form = $(this),
	// 		vals = new Object
	// 		url = $form.attr( 'action' );
	// 		
	// 		$form.find( 'input' ).each( function(){
	// 			var $input = $(this)
	// 			console.log($input);
	// 			vals[ $input.attr('name') ] = $input.val();
	// 		});
	// 		console.log(vals);
	// 	// $.post(url, {param1: 'value1'}, function(data, textStatus, xhr) {
	// 	// 	
	// 	// 	
	// 	// });
	// });

	$('form.validate').validate();

});


