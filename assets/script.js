document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if(btn && nav){
    btn.addEventListener('click', function(){
      var isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
