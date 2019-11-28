var blankTable; // tableau vierge au début de la partie
const humanPlayer = 'O'; // action de l'humain
const pcPlayer = 'X'; // action de l'ordinateur

// On paramètre les situations qui permettent de gagner
const winGame = [
    // combo horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // combo vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // combo diagonal
    [0, 4, 8],
    [6, 4, 2]
]

// on fait référence à la classe="case" de l'html
const cases = document.querySelectorAll('.case');
start();

function start() {
    document.querySelector(".finDuGame").style.display = "none"
    blankTable = Array.from(Array(9).keys());
    for (var i = 0; i < cases.length; i++) {
        cases[i].innerText = '';
        cases[i].style.removeProperty('background-color');
        cases[i].addEventListener('click', clickedCase, false);
    }
}

// il se passe quelque chose quand je clique
function clickedCase(square) {
    if(typeof blankTable[square.target.id] == 'number') {
        clicked(square.target.id, humanPlayer)
        if(!VerifyEgality()) clicked(bestTentative(), pcPlayer);
    }
}

function clicked(squareId, player) {
    blankTable[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWinner = verifyVictory(blankTable, player)
    if (gameWinner) gameOver(gameWinner)
}

function verifyVictory(board, player) {
    let parties = board.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, [])
    let gameWinner = null;
    for (let [index, win] of winGame.entries()) { // on vérifie dans les combinaisons possibles de victoires si ça matche
        if(win.every(element => parties.indexOf(element) > -1)) {
            gameWinner = {index: index, player: player};
            break;
        }
    }
    return gameWinner;
}

// coloration cases jeu gagnant / jeu perdant + affichage de fin
function gameOver(gameWinner) {
    for (let index of winGame [gameWinner.index]) {
        document.getElementById(index).style.backgroundColor =
        gameWinner.player == humanPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cases.length; i++) {
        cases[i].removeEventListener('click', clickedCase, false);
    }
    showWinner(gameWinner.player == humanPlayer ? " Vous avez gagné !!! 😎" : "Perdu !!! 😥");
}

function showWinner(whoIs) {
    document.querySelector(".finDuGame").style.display = "block";
    document.querySelector(".finDuGame .message").innerText = whoIs;
}

function emptySquares() {
    return blankTable.filter(s => typeof s == 'number');
}

function bestTentative() {
    return aIntelligence(blankTable, pcPlayer).index;
}

// on vérifie si le jeu est en égalité, on affiche message "Egalité" + couleur verte.
function VerifyEgality() {
    if(emptySquares().length == 0) {
        for (var i = 0; i < cases.length; i++) {
            cases[i].style.backgroundColor = "green";
            cases[i].removeEventListener('click', clickedCase, false);
        }
        showWinner("Egalité !")
        return true;
    }
    return false;
}

// intelligence artificielle pour que le niveau du TIC TAC TOE soit plus élevé !
function aIntelligence(newTable, player) {
    var availTentatives = emptySquares(newTable);

    if(verifyVictory(newTable, player)) {
        return {score: -10};
    } else if (verifyVictory(newTable, pcPlayer)) {
        return {score: 20};
    } else if (availTentatives.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availTentatives.length; i++) {
        var move = {};
        move.index = newTable[availTentatives[i]];
        newTable[availTentatives[i]] = player;

        if (player == pcPlayer) {
            var result = aIntelligence(newTable, humanPlayer);
            move.score = result.score;
        } else {
            var result = aIntelligence(newTable, pcPlayer);
            move.score = result.score;
        }

        newTable[availTentatives[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === pcPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}