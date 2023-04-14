/* Add a smooth scrolling animation to the navigation links */
$('nav ul li a').on('click', function(e) {
    if (this.hash !== '') {
      e.preventDefault();
  
      const hash = this.hash;
  
      $('html, body').animate(
        {
          scrollTop: $(hash).offset().top
        },
        800
      );
    }
  });
  
  /* Add a pop-up modal window when clicking on a project */
  $('#projects li').on('click', function() {
    const modal = $(this).find('.modal');
  
    modal.addClass('show');
  });
  
  $('.modal button').on('click', function() {
    const modal = $(this).closest('.modal');
  
    modal.removeClass('show');
  });