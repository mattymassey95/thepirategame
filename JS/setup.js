$(document).ready( function() {

  sessionStorage.clear();

  pageSetup();

  $(window).resize(function() {
    pageSetup();
  });

  $('#new-btn').click(function(){
    resetAll();
    gameSetup(1);
  });

  $('#blank-btn').click(function(){
    resetAll();
    gameSetup(0);
  });

});

function pageSetup(){

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  var boxMin = math.min(vh, vw);

  $("#game-grid").css({'width': (boxMin * 0.9 + 'px')});
  $("#game-grid").css({'height': (boxMin * 0.9 + 'px')});

  $("#game-box").css({'width': ($("#game-grid").width() + 'px')});
  $("#game-box").css({'height': ($("#game-grid").height() + 'px')});

}

function gameSetup(type){
  if(1 === type){
    var cellArr = [
      "A1","A2","A3","A4","A5","A6","A7",
      "B1","B2","B3","B4","B5","B6","B7",
      "C1","C2","C3","C4","C5","C6","C7",
      "D1","D2","D3","D4","D5","D6","D7",
      "E1","E2","E3","E4","E5","E6","E7",
      "F1","F2","F3","F4","F5","F6","F7",
      "G1","G2","G3","G4","G5","G6","G7",
    ];
    var scoreArr = ["<div class='hover-box'>&#9972;<span class='hover-txt'>Steal someone\'s points</span></div>",
      "<div class='hover-box'>&#128473;<span class='hover-txt'>Kill someone</span></div>",
      "<div class='hover-box'>&#127873;<span class='hover-txt'>Give someone 1000 points</span></div>",
      "<div class='hover-box'>&#9760;<span class='hover-txt'>Wipe out a rows scores</span></div>",
      "<div class='hover-box'>&#128472;<span class='hover-txt'>Swap scores</span></div>",
      "<div class='hover-box'>&#9757;<span class='hover-txt'>Choose next square</span></div>",
      "<div class='hover-box'>&#128737;<span class='hover-txt'>Block attack</span></div>",
      "<div class='hover-box'>&#128269;<span class='hover-txt'>Reflect attack</span></div>",
      "<div class='hover-box'>&#128163;<span class='hover-txt'>You go to zero</span></div>",
      "<div class='hover-box'>&#127974;<span class='hover-txt'>Bank your score</span></div>",
      "<div class='hover-box'>X2<span class='hover-txt'>Double your score</span></div>",
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
      100, 100, 100, 100, 200, 200, 200, 200, 200, 200,
      200, 200, 200, 200, 300, 300, 300, 300, 300, 400,
      400, 500, 500, 500, 500, 500, 800, 1000];
    scoreArr.forEach(function(item, index){
      int = Math.floor(Math.random()*(cellArr.length));
      $("#"+cellArr[int]).html(item);
      cellArr.splice(int,1);
    });
    $('.hover-txt').each(function(){
      var hw = $(window).width() / 2;
      var bp = $(this).position().left;
      if(hw - bp < 250 &&  bp > 250){
        $(this).addClass("left");
      }else if(bp > 250){
        $(this).addClass("under");
      }
    });
    $('.blank-hide').removeClass("hide");
  }else{
    $('.cell').each(function(){
      $(this).html("");
    });
    $('.blank-hide').addClass("hide");
  }

}
