// 计算卡片的top值来绝对定位
function getPosTop(i, j) { // i是行数，j是列数
    return 20 + i * 120;
}

// 计算卡片的left值来绝对定位
function getPosLeft(i, j) {
    return 20 + j * 120;
}

// 根据数字大小设置背景颜色
function getNumberBackgroundColor(number) {

    switch (number) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#eee4da";
            break;
        case 8:
            return "#f26179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e36";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#3365a5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6bc";
            break;
        case 8192:
            return "#93c";
            break;
    }
    return "black";
}

// 设置数字颜色
function getNumberColor(number) {
    if (number <= 4) {
        return "#776e65";
    }
    return "white";
}

// 判断棋盘是否还有空位置来生成新数字
function noSpace(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

// 删除子元素集合或元素
function remove(selectors) {
    selectors.removeNode = [];
    if (selectors.length != undefined) {
        let len = selectors.length;
        for (let i = 0; i < len; i++) {

            selectors.removeNode.push({
                parent: selectors[i].parentNode,
                inner: selectors[i].outerHTML,
                next: selectors[i].nextSibling // 紧接着下一个兄弟元素
            });
        }

        for (let i = 0; i < len; i++)
            selectors[0].parentNode.removeChild(selectors[0]); // 删除一个元素后，紧接着的元素又变成第一个元素被删除
    }
    else {
        selectors.removeNode.push({
            parent: selectors.parentNode,
            inner: selectors.outerHTML,
            next: selectors.nextSibling
        });
        selectors.parentNode.removeChild(selectors);
    }
}

// 判断是否有障碍物
function noBlock(keyCode, RowOrCol, Row1OrCol1, Row2OrCol2, board) {
    for (let i = Row1OrCol1 + 1; i < Row2OrCol2; i++) {
        if (keyCode == 37 || keyCode == 39) { // 水平移动是否有障碍物
            if (board[RowOrCol][i] != 0) {
                return false;
            }
        } else if (keyCode == 38 || keyCode == 40) { // 垂直方向移动是否有障碍物
            if (board[i][RowOrCol] != 0) {
                return false;
            }
        }
    }
    return true;
}



// 判断可以移动的方向
function canMoveTo(keyCode, board) {
    if (keyCode == 37) { // left
        return canMove(null, 0, board)
    } else if (keyCode == 39) { // right
        return canMove(null, 3, board)
    } else if (keyCode == 38) { // up
        return canMove(0, null, board)
    } else if (keyCode == 40) { // down
        return canMove(3, null, board)
    }
}


// 可以移动规则：有数字，附近位置为空或者附近的数字与本身数字相等可以合并
function canMove(ignoreRow, ignoreCol, board) {

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            
            if (board[i][j] != 0 && j != ignoreCol) { // 水平移动
                if (ignoreCol == 0) { // 向左移动
                    if (board[i][j - 1] == 0 || board[i][j] == board[i][j - 1]) {
                        return true;
                    }

                } else if (ignoreCol == 3) { // 向右移动
                    if (board[i][j + 1] == 0 || board[i][j] == board[i][j + 1]) {
                        return true;
                    }
                }
            }
            if (board[i][j] != 0 && i != ignoreRow) { // 垂直移动
                if (ignoreRow == 0) { // 向上移
                    if (board[i - 1][j] == 0 || board[i][j] == board[i - 1][j]) {
                        return true;
                    }
                } else if (ignoreRow == 3) { // 向下移
                    if (board[i + 1][j] == 0 || board[i][j] == board[i + 1][j]) {
                        return true;
                    }
                }
            }
        }
    }
    return false; // 无法移动
}