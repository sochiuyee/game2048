// 设置数字的宽高定位位置来显示数字
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

// 设置数字的定位位置来移动数字
function showMoveAnimation(fromX,fromY,toX,toY){

    let numberCell = document.getElementById(`number-cell-${fromX}-${fromY}`);
    
    numberCell.style.top = getPosTop(toX,toY)+'px';
    numberCell.style.left = getPosLeft(toX,toY)+'px';
    numberCell.style.transition = 'all 400ms';
}

// 更新总分分数
function updateScore(score){
    let allScore = document.getElementById('score');
    allScore.innerText = score;
}

// 游戏结束添加遮罩
function addGameOverMask(){
    let mask = document.getElementsByClassName('mask')[0];
    mask.classList.add('game-over-mask');
}

// 游戏重新开始移除遮罩
function removeGameOverMask(){
    let mask = document.getElementsByClassName('mask')[0];
    mask.classList.remove('game-over-mask');
}