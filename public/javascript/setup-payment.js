$(document).ready(function() {

  $('#button-plus').on('click', function () {
    StripeCheckout.open({
      key : 'pk_test_9z8N4GDEjILOBFFMtWwodzCT',
      amount : 69900,
      name : 'Premium Plus',
      description : '($699.00)',
      token : function (res) {
        var $input = $('<input type=hidden name=stripeToken />').val(res.id);
        $('#form-plus').append($input).submit();
      }
    })
    return false
  })

  $('#button-premium').on('click', function () {
    StripeCheckout.open({
      key : 'pk_test_9z8N4GDEjILOBFFMtWwodzCT',
      amount : 19900,
      name : 'Premium',
      description : '($199.00)',
      token : function (res) {
        var $input = $('<input type=hidden name=stripeToken />').val(res.id);
        $('#form-premium').append($input).submit();
      }
    })
    return false
  })

  $('#button-basic').on('click', function () {
    StripeCheckout.open({
      key : 'pk_test_9z8N4GDEjILOBFFMtWwodzCT',
      amount : 9900,
      name : 'Basic',
      description : '($99.00)',
      token : function (res) {
        var $input = $('<input type=hidden name=stripeToken />').val(res.id);
        $('#form-basic').append($input).submit();
      }
    })
    return false
  })
  
})
