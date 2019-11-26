function showNumberWithAnimation(i, j, randNumber){
    let numberCell = document.getElementById(`number-cell-${i}-${j}`);
    numberCell.style.backgroundColor = getNumberBackgroundColor(randNumber);
    numberCell.style.color = getNumberColor(randNumber);
    numberCell.innerText = randNumber;

    numberCell.style.width = 100 +'px';
    numberCell.style.height = 100 +'px';
    numberCell.style.top = getPosTop(i,j)+'px';
    numberCell.style.left = getPosLeft(i,j)+'px';
    numberCell.style.transition = 'all 400ms';
}

function showMoveAnimation(fromX,fromY,toX,toY){

    let numberCell = document.getElementById(`number-cell-${fromX}-${fromY}`);
    
    numberCell.style.top = getPosTop(toX,toY)+'px';
    numberCell.style.left = getPosLeft(toX,toY)+'px';
    numberCell.style.transition = 'all 400ms';
}

function updateScore(score){
    let allScore = document.getElementById('score');
    allScore.innerText = score;
}

function addGameOverMask(){
    let mask = document.getElementsByClassName('mask')[0];
    mask.classList.add('game-over-mask');
}

function removeGameOverMask(){
    let mask = document.getElementsByClassName('mask')[0];
    mask.classList.remove('game-over-mask');
}