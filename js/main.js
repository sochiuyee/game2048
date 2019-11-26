// 游戏数据
let board = new Array(); // 保存分数的数组
let score = 0;
let hasConflicted = new Array(); // 记录格子是否发生过相加

document.addEventListener('DOMContentLoaded', function (e) {
    // DOM渲染完成，无需等待图片等资源加载完成
    newGame();
})

function newGame() {
    // 初始化棋盘
    init();
    // 随机在两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let gridCell = document.getElementById(`grid-cell-${i}-${j}`);
            gridCell.style.top = getPosTop(i, j) + 'px';
            gridCell.style.left = getPosLeft(i, j) + 'px';
        }
    }

    // 生成保存生成数字二维数组和记录相加过数字位置的二维数组
    for (let i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0; // 得出的结果[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
            hasConflicted[i][j] = false; // 初始化相加过的位置数组，没有相加过就是false
        }
    }

    updateBoardView(); // 初始化棋盘

    score = 0;

    removeGameOverMask();
}


function updateBoardView() {
    // 每次变化都需要清除上一次的数字
    let NumberCellGroup = document.getElementsByClassName('number-cell');
    if (NumberCellGroup.length !== 0) {
        remove(NumberCellGroup)
    }


    let gridContainer = document.querySelector('.grid-container');
    let fragment = document.createDocumentFragment(); // 在内存中操作元素,减少频繁的dom操作

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let NumberCell = document.createElement('div');
            NumberCell.className = 'number-cell';
            NumberCell.id = `number-cell-${i}-${j}`;
            fragment.appendChild(NumberCell);

            if (board[i][j] == 0) { // 棋盘没数字
                NumberCell.style.width = 0 + 'px';
                NumberCell.style.height = 0 + 'px';
                NumberCell.style.top = getPosTop(i, j) + 'px';
                NumberCell.style.left = getPosLeft(i, j) + 'px';

            } else { // 在棋盘上显示数字
                NumberCell.style.width = 100 + 'px';
                NumberCell.style.height = 100 + 'px';
                NumberCell.style.top = getPosTop(i, j) + 'px';
                NumberCell.style.left = getPosLeft(i, j) + 'px';

                NumberCell.style.backgroundColor = getNumberBackgroundColor(board[i][j]);
                NumberCell.style.color = getNumberColor(board[i][j]);
                NumberCell.innerText = board[i][j];
            }
            hasConflicted[i][j] = false; // 每更新完一次面板，初始化记录相加过数字的数组
        }
    }
    gridContainer.appendChild(fragment);
}

function generateOneNumber() {
    if (noSpace(board)) {
        return; // 棋盘没有位置就不再新生数字
    } else {
        // 随机在一个位置生成
        let randX = parseInt(Math.floor(Math.random() * 4)); // random生成的是大于0小于1的随机数，而位置是0-3，所以*4
        let randY = parseInt(Math.floor(Math.random() * 4));

        let times = 0; // 计算机尝试在空位置生成数字的次数

        while (times < 50) { // 随机尝试50次在空位置生成数字
            if (board[randX][randY] == 0) { // 生成的位置在面板位置是空白没数字可以用跳出循环
                break;
            }
            randX = parseInt(Math.floor(Math.random() * 4)); // 生成的位置不一定能用，如果生成的位置当前有数字就不能用，需要再生成位置随机数。
            randY = parseInt(Math.floor(Math.random() * 4));

            times++;
        }
        if (times == 50) { // 尝试50次仍然不能在空位置生成数字就遍历到最近的一个空位置生成随机数
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] == 0) {
                        randX = i;
                        randY = j;
                    }
                }
            }
        }

        // 生成新增的数字
        let randNumber = Math.random() < 0.5 ? 2 : 4; // 以50%概率生成2或者4

        // 在随机的位置上生成随机的数字
        board[randX][randY] = randNumber; // 更新面板内容，把新增的随机数显示出来
        showNumberWithAnimation(randX, randY, randNumber);

        return true;
    }
}


// 用户按下按键后游戏逻辑
document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 37: // left
            if (moveLeft(e.keyCode)) { // 判断原有的数字能否向左移动
                setTimeout(() => { // 等待移动过渡效果完成后再生成新的数字
                    generateOneNumber();
                    isGameOver();
                }, 400)
                // 新增完数字后判断是否游戏结束
            }
            break;
        case 38: // up
            if (moveUp(e.keyCode)) { // 判断原有的数字能否向上移动
                setTimeout(() => {
                    generateOneNumber();
                    isGameOver();
                }, 400)
            }
            break;
        case 39: // right
            if (moveRight(e.keyCode)) { // 判断原有的数字能否向右移动
                setTimeout(() => {
                    generateOneNumber();
                    isGameOver();
                }, 400)
            }
            break;
        case 40: // down
            if (moveDown(e.keyCode)) { // 判断原有的数字能否向下移动
                setTimeout(() => {
                    generateOneNumber();
                    isGameOver();
                }, 400)
            }
            break;
        default: // 用户不按按键不做操作
            break;
    }
})

// 寻找数字移动到左侧最佳落脚的位置
function moveLeft(keyCode) {

    // 判断数字左侧是否有空位或者左侧数字能否与自身移动合并成新数字
    if (!canMoveTo(keyCode, board)) {
        return false;
    }

    for (let i = 0; i < 4; i++) {

        for (let j = 1; j < 4; j++) { // 左移忽略第一列，j从1开始

            if (board[i][j] != 0) { // 数字自身不为0才可以向左移动

                for (let k = 0; k < j; k++) { // 检查数字左侧的所有位置，找到最佳落脚点

                    if (board[i][k] == 0 && noBlock(keyCode, i, k, j, board)) { // 左侧位置为空而且没有障碍物

                        // 移动
                        showMoveAnimation(i, j, i, k);

                        board[i][k] = board[i][j]; // 向左移动一格
                        board[i][j] = 0; // 原来数字的位置变为空

                        continue; // 重复上述移动一格的动作直至找到最佳落脚点

                    } else if (board[i][k] == board[i][j] && noBlock(keyCode, i, k, j, board) && !hasConflicted[i][k]) { // 数字相等没有障碍物且只累加一次

                        // 向左移动
                        showMoveAnimation(i, j, i, k);

                        // 数字相等，移动后合并相加，移动后原先的数字位置为空
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        // 更新得分总数
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true; // 记录数字合并后落脚的位置
                        continue;
                    }
                }
            }
        }
    }

    // transition的时间是400ms,过渡完再更新面板才有过渡效果
    setTimeout(() => {
        updateBoardView();
    }, 400);

    return true; // 移动了数字
}


function moveRight(keyCode) {
    if (!canMoveTo(keyCode, board)) {
        return false;
    }

    for (let i = 0; i < 4; i++) {

        for (let j = 0; j < 3; j++) { // 右移忽略第四列，j<3

            if (board[i][j] != 0) { // 有数字

                for (let k = 3; k > j; k--) { // 遍历数字右侧的所有位置，找到最佳落脚点

                    if (board[i][k] == 0 && noBlock(keyCode, i, j, k, board)) { // 数字的右侧位置为空且没有障碍物

                        // 移动
                        showMoveAnimation(i, j, i, k);

                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if (board[i][k] == board[i][j] && noBlock(keyCode, i, j, k, board) && !hasConflicted[i][k]) {

                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        // 更新得分总数
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true; // 记录数字合并后落脚的位置
                        continue;
                    }
                }
            }
        }
    }

    setTimeout(() => {
        updateBoardView();
    }, 400);

    return true; // 移动了数字
}


function moveUp(keyCode) {

    if (!canMoveTo(keyCode, board)) { // 判断数字上方位置为空或者可以合并才能移动
        return false;
    }

    for (let i = 1; i < 4; i++) {

        for (let j = 0; j < 4; j++) {

            if (board[i][j] != 0) {

                for (let k = 0; k < i; k++) {

                    if (board[k][j] == 0 && noBlock(keyCode, j, k, i, board)) {

                        // 移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlock(keyCode, j, k, i, board) && !hasConflicted[k][j]) { // 可以移动而且移动垂直方向没有障碍物而且没有合并过数字的位置

                        // 移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        // 更新得分总数
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[k][j] = true; // 记录数字合并后落脚的位置
                        continue;
                    }
                }
            }
        }
    }

    setTimeout(() => {
        updateBoardView();
    }, 400);

    return true; // 移动了数字
}

function moveDown(keyCode) {
    if (!canMoveTo(keyCode, board)) {
        return false;
    }
    for (let i = 0; i < 3; i++) {

        for (let j = 0; j < 4; j++) {

            if (board[i][j] != 0) {

                for (let k = 3; k > i; k--) { // 下移忽略第四行

                    if (board[k][j] == 0 && noBlock(keyCode, j, i, k, board)) { // 有空位置而且没有障碍物

                        // 移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlock(keyCode, j, i, k, board) && !hasConflicted[k][j]) {

                        // 移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        // 更新得分总数
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(() => {
        updateBoardView();
    }, 400);

    return true; // 移动了数字
}


// 没有空位置而且数字不能合并，游戏结束
function isGameOver() {
    if (noSpace(board) && !canMove(null, 0, board) && !canMove(null, 3, board) && !canMove(0, null, board) && !canMove(3, null, board)) {
        addGameOverMask();
    }
}