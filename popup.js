$(".split-button").click(function(){
   $(this).siblings().each(function(){
       $(this).removeClass('selected')
   })
   $(this).addClass('selected')
})