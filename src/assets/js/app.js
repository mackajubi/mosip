$(function() {

  $(document).ready(function() {
    $('.skitter-large').skitter({
      responsive: {
        small: {
          animation: 'fade',
          suffix: '-small'
        },
        medium: {
          animation: 'directionRight',
          suffix: '-medium'
        }
      }
    });

    var currentTheme = '';
    $('#change-theme').on('click', 'a', function(e) {
      e.preventDefault();
      var theme = 'skitter-' +  $(this).data('theme')
      $('#change-theme a').removeClass('active');
      $(this).addClass('active');
      $('.skitter-large').removeClass(currentTheme).addClass(theme);
      currentTheme = theme;
    });
  
    $('#change-animation').on('click', 'a', function(e) {
      e.preventDefault();
      var animation = $(this).data('animation');
      $('#change-animation a').removeClass('active');
      $(this).addClass('active');
      $('.skitter-large').skitter('setAnimation', animation);
      $('.skitter-large').skitter('next');
    });
  
    var animations = $('.skitter-large').skitter('getAnimations');
    for (var i in animations) {
      var animation = animations[i];
      var item = '<li><a data-animation="' + animation + '">' + animation + '</a></li>';
      $('#change-animation ul').append(item);
    }

  });
});
