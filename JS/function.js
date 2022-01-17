$(document).ready( function() {

  $('#game-grid td').click( function(e) {
    $('#start-message').css("display", "none");
    $('#game-ctrl').css("display", "flex");
    $('#btn-box').css("display", "flex");
    if(isNaN($(e.target).html())){
      if(!$(e.target.closest("td")).hasClass("selected")){
        $(e.target.closest("td")).addClass("selected");
        selectSymb($(e.target).html(),e.target.closest("td").id);
      }
    }else{
      if(!$(e.target).hasClass("selected")){
        $(e.target).addClass("selected");
        if (sessionStorage.getItem("cellList") === null) {
          var currCellList = [e.target.id];
          sessionStorage.setItem("cellList",JSON.stringify(currCellList));
          var currScoreList = [e.target.textContent];
          sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
          sessionStorage.setItem("selectList",JSON.stringify(currScoreList));
          sessionStorage.setItem("scoreTotal",JSON.stringify(parseInt(e.target.textContent)));
          sessionStorage.setItem("bankTotal",JSON.stringify(parseInt(0)));
        }else{
          var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
          if(0 === currCellList.length){
            currCellList.push(e.target.id);
          }else{
            currCellList.push(", "+e.target.id);
          }
          sessionStorage.setItem("cellList",JSON.stringify(currCellList));
          var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
          if(0 === currScoreList.length){
            currScoreList.push(e.target.textContent);
          }else{
            currScoreList.push(", "+e.target.textContent);
          }
          sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
          var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
          if(0 === currSelectList.length){
            currSelectList.push(e.target.textContent);
          }else{
            currSelectList.push(", "+e.target.textContent);
          }
          sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
          var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
          currScore = currScore + parseInt(e.target.textContent);
          sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
        }
      }
      updateFields();
    }
  });

  $('#undo-btn').click(function(){
    undoPrev()
  });

  $('#restart-btn').click(function(){
    resetAll();
  });

  $('#game-box').on('click','#close-btn',function(){
    $('#game-grid').css("display", "block");
    $('#btn-box').css("display", "flex");
    $('#game-box').css("display", "none");
    $("#game-box").html("");
  });

  $('#right-nav').click(function(e){
    if($(".right-container").hasClass("show")){
      $('.right-container').removeClass("show");
      $('#right-nav').html("&lt;");
    }else{
      $('.right-container').addClass("show");
      $('#right-nav').html("&gt;");
    }
  });

  $('.toggle-btn').click(function(e){
    if($(e.target).closest("div").hasClass("show")){
      $('.right-panel').removeClass("show");
    }else{
      $('.right-panel').removeClass("show");
      $(e.target).closest("div").addClass("show");
    }
  });

  var int = Math.floor(Math.random()*10);

  $("#gift-btn").on("click", function(){
    if (sessionStorage.getItem("cellList") === null) {
      $('#start-message').css("display", "none");
      $('#game-ctrl').css("display", "flex");
    }
    $('#game-grid').css("display", "none");
    $('#game-box').css("display", "block");
    $("#game-box").load("pages/addpoints.html?v=" + int);
  });

  $("#attack-btn").on("click", function(){
    if (sessionStorage.getItem("cellList") === null) {
      $('#start-message').css("display", "none");
      $('#game-ctrl').css("display", "flex");
    }
    $('#game-grid').css("display", "none");
    $('#game-box').css("display", "block");
    if (sessionStorage.getItem("blockItem") === null &&
      sessionStorage.getItem("mirrorItem") === null){
        $("#game-box").load("pages/subpoints.html?v=" + int);
    }else{
      $("#game-box").load("pages/savepoints.html?v=" + int);
    }
    updateFields();
  });

  $('.hover-txt').click(function(){return false;});

});

function resetAll(){
  sessionStorage.clear();
  updateFields(1);
  $(".cell").removeClass("selected");
  $('#start-message').css("display", "flex");
  $('#game-ctrl').css("display", "none");
  $('#btn-box').css("display", "none");
}

function updateFields(i){
  if(1===i){
    $("#game-history").html("");
    $("#score-history").html("");
    $("#select-history").html("");
    $("#score-total").html("Score : 0");
    $("#bank-total").html("Bank : 0");
    $("#game-total").html("Total : 0");
  }else{
    $("#game-history").html(JSON.parse(sessionStorage.getItem("cellList")));
    $("#score-history").html(JSON.parse(sessionStorage.getItem("scoreList")));
    $("#select-history").html(JSON.parse(sessionStorage.getItem("selectList")));
    $("#score-total").html("Score : " + JSON.parse(sessionStorage.getItem("scoreTotal")));
    $("#bank-total").html("Bank : " + JSON.parse(sessionStorage.getItem("bankTotal")));
    var gameTotal = parseInt(JSON.parse(sessionStorage.getItem("bankTotal"))) + parseInt(JSON.parse(sessionStorage.getItem("scoreTotal")));
    $("#game-total").html("Total : " + gameTotal);
  }
}

function undoPrev(){
  var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
  var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
  var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
  var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
  var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  if(1 === currCellList.length){
    resetAll();
  }else{
    var lastCell = currCellList.pop();
    var lastSelect = currSelectList.pop();
    var lastScore = currScoreList.pop();
    lastCell = lastCell.split(" ").pop();
    lastSelect = lastSelect.split(" ").pop();
    lastScore = lastScore.split(" ").pop();
    if(lastSelect === "&#127974;"){
      currScore = bankScore;
      bankScore = 0;
    }else{
      currScore = currScore - lastScore;
    }
    sessionStorage.setItem("cellList",JSON.stringify(currCellList));
    sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
    sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
    sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
    sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
    $('#'+lastCell).removeClass("selected");
    updateFields();
  }
}

function selectSymb(i,ref){
  $('#game-grid').css("display", "none");
  $('#btn-box').css("display", "none");
  $('#game-box').css("display", "block");
  int = Math.floor(Math.random()*10);
  var val = i.split('<');
  switch(val[0]){
    case "⛴":
      $("#game-box").load("pages/steal.html?v=" + int);
      stealFunc(ref);
      break;
    case "🗙":
      $("#game-box").load("pages/kill.html?v=" + int);
      killFunc(ref);
      break;
    case "🎁":
      $("#game-box").load("pages/gift.html?v=" + int);
      giftFunc(ref);
      break;
    case "☠":
      $("#game-box").load("pages/row.html?v=" + int);
      rowFunc(ref);
      break;
    case "🗘":
      $("#game-box").load("pages/swap.html?v=" + int);
      swapFunc(ref);
      break;
    case "☝":
      $("#game-box").load("pages/choose.html?v=" + int);
      chooseFunc(ref);
      break;
    case "🛡":
      $('#game-grid').css("display", "block");
      $('#btn-box').css("display", "flex");
      $('#game-box').css("display", "none");
      blockFunc(ref);
      break;
    case "🔍":
      $('#game-grid').css("display", "block");
      $('#btn-box').css("display", "flex");
      $('#game-box').css("display", "none");
      mirrorFunc(ref);
      break;
    case "💣":
      $('#game-grid').css("display", "block");
      $('#btn-box').css("display", "flex");
      $('#game-box').css("display", "none");
      bombFunc(ref);
      break;
    case "X2":
      $('#game-grid').css("display", "block");
      $('#btn-box').css("display", "flex");
      $('#game-box').css("display", "none");
      doubleFunc(ref);
      break;
    case "🏦":
      $('#game-grid').css("display", "block");
      $('#btn-box').css("display", "flex");
      $('#game-box').css("display", "none");
      bankFunc(ref);
      break;
  }
}

function stealFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#9972;");
  }else{
    currSelectList.push(", &#9972;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function killFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#128473;");
  }else{
    currSelectList.push(", &#128473;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function giftFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#127873;");
  }else{
    currSelectList.push(", &#127873;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function rowFunc(ref) {
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#9760;");
  }else{
    currSelectList.push(", &#9760;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function swapFunc(ref) {
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#128472;");
  }else{
    currSelectList.push(", &#128472;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function chooseFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#9757;");
  }else{
    currSelectList.push(", &#9757;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function blockFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#128737;");
  }else{
    currSelectList.push(", &#128737;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  sessionStorage.setItem("blockItem","TRUE");
  $("#" + ref).addClass("item");
  return true;
}

function mirrorFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#128269;");
  }else{
    currSelectList.push(", &#128269;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(0);
  }else{
    currScoreList.push(", " + 0);
  }
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  sessionStorage.setItem("mirrorItem","TRUE");
  $("#" + ref).addClass("item");
  return true;
}

function bombFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#128163;");
  }else{
    currSelectList.push(", &#128163;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(-1 * currScore);
  }else{
    currScoreList.push(", " + -1 * currScore);
  }
  currScore = 0;
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function doubleFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
    if(0 === currSelectList.length){
    currSelectList.push("X2");
  }else{
    currSelectList.push(", X2");
  }
  if(0 === currScoreList.length){
    currScoreList.push(currScore);
  }else{
    currScoreList.push(", " + currScore);
  }
  currScore = currScore * 2;
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function bankFunc(ref){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var bankScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
  }
  if(0 === currCellList.length){
    currCellList.push(ref);
  }else{
    currCellList.push(", " + ref);
  }
  if(0 === currSelectList.length){
    currSelectList.push("&#127974;");
  }else{
    currSelectList.push(", &#127974;");
  }
  if(0 === currScoreList.length){
    currScoreList.push(-1 * bankScore);
  }else{
    currScoreList.push(", " + -1 * bankScore);
  }
  currScore = 0;
  sessionStorage.setItem("cellList",JSON.stringify(currCellList));
  sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
  sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
  sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
  sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
  return true;
}

function showInput(){
  var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
  $("#input-row").html(`
    <h1>Swap Scores</h1>
    <p>Your current score is ${currScore}.</p>
    <p id='error-msg'></p>
    <label>Your new score is</label>
    <input id='input-box' type='number' min='100' max='1000000' step='100' value='100'>
    <div><button type='button' name='button' onclick='subPoints(4)'>CONFRIM</button></div>
  `);
}

function addPoints(i){
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  errorCheck = 0
  if(i === 1){//Gift
    if(0 === currCellList.length){
      currCellList.push("XX");
    }else{
      currCellList.push(", XX");
    }
    if(0 === currSelectList.length){
      currSelectList.push("&#127873;");
    }else{
      currSelectList.push(", &#127873;");
    }
    if(0 === currScoreList.length){
      currScoreList.push(1000);
    }else{
      currScoreList.push(", " + 1000);
    }
    currScore = currScore + 1000;
  }else if(i === 2){//Steal
    var newScore = parseInt($("#input-box").val());
    if(/^\d+00$/.test(newScore) || newScore === 0){
      currScore = currScore + newScore;
      currScoreList[currScoreList.length - 1] = (", " + newScore);
    }else{
      errorCheck = 1;
      $("#error-msg").html("Invalid score entered, please try again.");
    }
  }else if(i === 3){//Swap
    var newScore = parseInt($("#input-box").val());
    if(/^\d+00$/.test(newScore) || newScore === 0){
      var diffScore = newScore - currScore;
      currScore = newScore;
      currScoreList[currScoreList.length - 1] = (", " + diffScore);
    }else{
      errorCheck = 1;
      $("#error-msg").html("Invalid score entered, please try again.");
    }
  }
  if(errorCheck === 0){
    sessionStorage.setItem("cellList",JSON.stringify(currCellList));
    sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
    sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
    sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
    sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
    updateFields();
    $('#game-grid').css("display", "block");
    $('#game-box').css("display", "none");
  }
  return true;
}

function subPoints(i){
  var errorCheck = 0;
  if (sessionStorage.getItem("cellList") === null) {
    var currCellList = [];
    var currSelectList = [];
    var currScoreList = [];
    var currScore = 0;
    var bankScore = 0;
  }else{
    var currCellList = JSON.parse(sessionStorage.getItem("cellList"));
    var currSelectList = JSON.parse(sessionStorage.getItem("selectList"));
    var currScoreList = JSON.parse(sessionStorage.getItem("scoreList"));
    var currScore = JSON.parse(sessionStorage.getItem("scoreTotal"));
    var bankScore = JSON.parse(sessionStorage.getItem("bankTotal"));
  }
  if(i === 1){//Steal
    if(0 === currCellList.length){
      currCellList.push("XX");
    }else{
      currCellList.push(", XX");
    }
    if(0 === currSelectList.length){
      currSelectList.push("&#9972;");
    }else{
      currSelectList.push(", &#9972;");
    }
    if(0 === currScoreList.length){
      currScoreList.push(-1 * currScore);
    }else{
      currScoreList.push(", " + -1 * currScore);
    }
    currScore = 0;
  }else if(i === 2){//Kill
    if(0 === currCellList.length){
      currCellList.push("XX");
    }else{
      currCellList.push(", XX");
    }
    if(0 === currSelectList.length){
      currSelectList.push("&#128473;");
    }else{
      currSelectList.push(", &#128473;");
    }
    if(0 === currScoreList.length){
      currScoreList.push(-1 * currScore);
    }else{
      currScoreList.push(", " + -1 * currScore);
    }
    currScore = 0;
  }else if(i === 3){//Wipe
    if(0 === currCellList.length){
      currCellList.push("XX");
    }else{
      currCellList.push(", XX");
    }
    if(0 === currSelectList.length){
      currSelectList.push("&#9760;");
    }else{
      currSelectList.push(", &#9760;");
    }
    if(0 === currScoreList.length){
      currScoreList.push(-1 * currScore);
    }else{
      currScoreList.push(", " + -1 * currScore);
    }
    currScore = 0;
  }else if(i === 4){//Swap
    var newScore = parseInt($("#input-box").val());
    if(/^\d+00$/.test(newScore)){
      var diffScore = newScore - currScore;
      currScore = newScore;
      if(0 === currCellList.length){
        currCellList.push("XX");
      }else{
        currCellList.push(", XX");
      }
      if(0 === currSelectList.length){
        currSelectList.push("&#128472;");
      }else{
        currSelectList.push(", &#128472;");
      }
      if(0 === currScoreList.length){
        currScoreList.push(diffScore);
      }else{
        currScoreList.push(", " + diffScore);
      }
    }else{
      errorCheck = 1;
      $("#error-msg").html("Invalid score entered, please try again.");
    }
  }else if(i === "B"){
    if(0 === currCellList.length){
      currCellList.push("&#128737;");
    }else{
      currCellList.push(", &#128737;");
    }
    if(0 === currSelectList.length){
      currSelectList.push("&#128737;");
    }else{
      currSelectList.push(", &#128737;");
    }
    if(0 === currScoreList.length){
      currScoreList.push(0);
    }else{
      currScoreList.push(", 0");
    }
    sessionStorage.removeItem("blockItem");
    $('.item').each(function(){
      var item = $(this).html();
      if(item.includes("Block")){
        $(this).removeClass("item");
      }
    });
  }else if(i === "M"){
    if(0 === currCellList.length){
      currCellList.push("&#128269;");
    }else{
      currCellList.push(", &#128269;");
    }
    if(0 === currSelectList.length){
      currSelectList.push("&#128269;");
    }else{
      currSelectList.push(", &#128269;");
    }
    if(0 === currScoreList.length){
      currScoreList.push(0);
    }else{
      currScoreList.push(", 0");
    }
    sessionStorage.removeItem("mirrorItem");
    $('.item').each(function(){
      var item = $(this).html();
      if(item.includes("Reflect")){
        $(this).removeClass("item");
      }
    });
  }
  if(errorCheck === 0){
    sessionStorage.setItem("cellList",JSON.stringify(currCellList));
    sessionStorage.setItem("selectList",JSON.stringify(currSelectList));
    sessionStorage.setItem("scoreList",JSON.stringify(currScoreList));
    sessionStorage.setItem("scoreTotal",JSON.stringify(currScore));
    sessionStorage.setItem("bankTotal",JSON.stringify(bankScore));
    updateFields();
    $('#game-grid').css("display", "block");
    $('#game-box').css("display", "none");
  }
  return true;
}
