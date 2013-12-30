
// random stuff from theme here for now
$(document).ready(function() {

  $('header#home.jumbotron').height($(window).height()+50);

  /*============================================
  Resize Functions
  ==============================================*/
  $(window).resize(function(){
    $('.jumbotron').height($(window).height());
    $('.message-box').css({'marginTop':$(window).height()*0.4});
    scrollSpyRefresh();
    waypointsRefresh();
  });

  /*============================================
  Navigation Functions
  ==============================================*/
  if ($(window).scrollTop()===0){
    $('#main-nav').removeClass('scrolled');
  }
  else{
    $('#main-nav').addClass('scrolled');    
  }

  $(window).scroll(function(){
    if ($(window).scrollTop()===0){
      $('#main-nav').removeClass('scrolled');
    }
    else{
      $('#main-nav').addClass('scrolled');    
    }
  });  


  /*============================================
  Scrolling Animations
  ==============================================*/
  $('.scrollimation').waypoint(function(){
    $(this).toggleClass('in');
  },{offset:'90%'});

  /*============================================
  Refresh scrollSpy function
  ==============================================*/
  function scrollSpyRefresh(){
    setTimeout(function(){
      $('body').scrollspy('refresh');
    },1000);
  }

  /*============================================
  Refresh waypoints function
  ==============================================*/
  function waypointsRefresh(){
    setTimeout(function(){
      $.waypoints('refresh');
    },1000);
  }

  /*============================================
  Sponsor thumbs - Masonry
  ==============================================*/
  $(window).load(function(){

    $('#sponsors-container').css({visibility:'visible'});

    $('#sponsors-container').masonry({
      itemSelector: '.sponsors-item:not(.filtered)',
      columnWidth:350,
      isFitWidth: true,
      isResizable: true,
      gutterWidth: 0
    });

    scrollSpyRefresh();
    waypointsRefresh();
  });
});