$(document).ready(function() {

  // show the payment modal (defined in views/partials/head.jade)
  // and update relevant fields and inputs.
  paymentModal = function(plan, name, price) {
    $form = $('#payment-modal')
    $form.find('#plan').text(name)
    $form.find('#planName').val(plan)
    $form.find('#price').text(price + '/year')
    $form.find('button').text('Pay ' + price)
    $form.MwModal()
  }

  $('#button-plus').on('click', function () {
    paymentModal('plus', 'Premium Plus Account', '$699')
    return false
  })

  $('#button-premium').on('click', function () {
    paymentModal('premium', 'Premium Account', '$199')
    return false
  })

  $('#button-basic').on('click', function () {
    paymentModal('basic', 'Basic Account', '$99')
    return false
  })

  // STRIPE MAGIC!!
  // from: https://stripe.com/docs/tutorials/forms
  var stripeResponseHandler = function(status, response) {
    var $form = $('#payment-form');

    if (response.error) {
      // Show the errors on the form
      $form.find('.payment-errors').text(response.error.message);
      $form.find('button').prop('disabled', false);
    } else {
      // token contains id, last4, and card type
      var token = response.id;
      // Insert the token into the form so it gets submitted to the server
      $form.append($('<input type="hidden" name="stripeToken" />').val(token));
      // and submit
      $form.get(0).submit();
    }
  };

  $('#payment-form').submit(function(event) {
    var $form = $(this);

    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);

    Stripe.createToken($form, stripeResponseHandler);

    // Prevent the form from submitting with the default action
    return false;
  });
  
})
