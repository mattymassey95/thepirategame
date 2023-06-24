window.addEventListener("load", function() {
  resizeGrid();
  addListener();
  const reloadBtn = document.getElementById('reload');
  reloadBtn.addEventListener('click', function(){
    resetGrid();
    resetBold();
  })
});

window.addEventListener('resize', function() {
  resizeGrid();
});

function resizeGrid(){
  const tableWrapper = document.getElementById('table-wrapper');
  const tableGrid = document.getElementById('game-grid');
  const wrapperWidth = tableWrapper.offsetWidth;
  const wrapperHeight = tableWrapper.offsetHeight;
  var tableMin = math.min(wrapperHeight, wrapperWidth) - 40;
  tableGrid.style.width = tableMin + 'px';
  tableGrid.style.height = tableMin + 'px';
};

function addListener(){
  let boxes = document.querySelectorAll('#game-grid td');
  boxes.forEach(box => {
    box.addEventListener('click', function(e){
      if(e.target.classList.contains('cell')){
        if(!e.target.classList.contains('selected')){
          resetBold();
          e.target.classList.add('selected');
          e.target.classList.add('bold');
        }
      }
    });
  });
}

function resetGrid(){
  let boxes = document.querySelectorAll('#game-grid td');
  boxes.forEach(box => {
    if(box.classList.contains('selected')){
      box.classList.remove('selected');
    }
  });
}

function resetBold(){
  let boxes = document.querySelectorAll('#game-grid td');
  boxes.forEach(box => {
    if(box.classList.contains('bold')){
      box.classList.remove('bold');
    }
  });
}
