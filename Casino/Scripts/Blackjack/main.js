const playBtn = document.querySelector("#play-btn");
const hitBtn = document.querySelector("#hit-btn");
const stayBtn = document.querySelector("#stay-btn");
const splitBtn = document.querySelector("#split-btn");
const doubleBtn = document.querySelector("#double-btn");
const playerCardDisplay = document.querySelector("#display-player-cards");
const dealerCardDisplay = document.querySelector("#display-dealer-cards");
const playerSplitCardDisplay = document.querySelector("#display-player-split-cards");
const displayGameInfo = document.querySelector("#game-output-display");
const balanceOutput = document.querySelector("#balance-output");
const faceDownCardImage = document.createElement("img");
const dealerHand = new Hand();
const playerHand1 = new Hand();
const playerHand2 = new Hand();
let shoe = new Shoe();
let balance = 100;
let originalBet, totalBet, faceDownCard;

dealerHand.cardDisplay = dealerCardDisplay;
playerHand1.cardDisplay = playerCardDisplay;
playerHand2.cardDisplay = playerSplitCardDisplay;
balanceOutput.textContent = balance.toFixed(2);

function drawCard(hand) {
    const card = shoe.drawCard();
    hand.addToHand(card);
    
    const img = document.createElement('img');
    img.src = card.imagePath;
    img.className = "game-cards slideInTop";
    
    hand.cardDisplay.appendChild(img);
}

function clearHand(hand) {
    const images = document.querySelectorAll(".game-cards");

    hand.cards = [];
    hand.count = 0;
            
    images.forEach(img => {
        img.parentElement.removeChild(img);
    });
}

function endGame(calcWinner) {
    faceDownCardImage.src = faceDownCard.imagePath;

    disableButtons();
    if (calcWinner) calculateWinner();

    balanceOutput.textContent = balance.toFixed(2);

    setTimeout(() => {
        playBtn.disabled = false;
    }, 1000);
}

function checkForBlackjack() {
    const isDealerBlackjack = dealerHand.count === 21;
    const isPlayerBlackjack = playerHand1.count === 21;
    const checkDidPlayerSplit = playerHand1.selected && playerHand2.count !== 0;

    if (!checkDidPlayerSplit) {
        if (isDealerBlackjack) {
            isPlayerBlackjack ? balance += playerHand1.betOnThisHand : balance = balance;

            displayGameInfo.textContent = `${isPlayerBlackjack ? "Push" : "Dealer Blackjack"}`;

            return endGame(false);
        }

        if (isPlayerBlackjack) {
            balance += playerHand1.betOnThisHand * 2.5;

            displayGameInfo.textContent = "Player Blackjack";

            return endGame(false);
        }
    }
    
    const isPlayer2Blackjack = playerHand2.count === 21;

    if (isPlayerBlackjack && isPlayer2Blackjack) {
        balance += totalBet * 2.5;

        displayGameInfo.textContent = "Player Hand 1 Blackjack, Player Hand 2 Blackjack";

        return endGame(false);
    } 
    
    if (isPlayerBlackjack) {
        balance += playerHand1.betOnThisHand * 2.5;

        displayGameInfo.textContent = "Player Hand 1 Blackjack";

        return stay();
    }
    
    if (isPlayer2Blackjack) {
        balance += playerHand2.betOnThisHand * 2.5;

        playerHand1.selected = true;
        playerHand2.selected = false;

        displayGameInfo.textContent = "Player Hand 2 Blackjack";
    }
}

function checkForSplitAllowed(hand) {
    const faceCardCheck = ["Jack", "Queen", "King"];
    if ((faceCardCheck.includes(hand.cards[0].numValue) && faceCardCheck.includes(hand.cards[1].numValue)) || 
    ((faceCardCheck.includes(hand.cards[0].numValue)) && hand.cards[1].numValue === "10") || 
    ((faceCardCheck.includes(hand.cards[1].numValue)) && hand.cards[0].numValue === "10")) return true;

    return (hand.cards[0].numValue === hand.cards[1].numValue);
}

function calculateWinner() {
    const dealerScore = dealerHand.count <= 21 ? dealerHand.count : 0;
    const playerScore = playerHand1.count <= 21 ? playerHand1.count : -1;
    const checkDidPlayerSplit = playerHand2.count !== 0;
    const dealerWon = dealerScore > playerScore;

    console.log(`Dealer score = ${dealerScore}`);
    console.log(`Player score = ${playerScore}`);

    if (!checkDidPlayerSplit) {
        if (dealerScore !== playerScore) {
            dealerWon ? balance = balance : balance += playerHand1.betOnThisHand * 2;

            return displayGameInfo.textContent = `${dealerWon ? "Dealer Win" : "Player Win"}`;
        }

        balance += totalBet;
        return displayGameInfo.textContent = "Push";
    }

    const player2Score = playerHand2.count <= 21 ? playerHand2.count : -1;
    const dealerWonHand2 = dealerScore > player2Score;
    let dealerVsPlayer1Message;
    let dealerVsPlayer2Message;
    console.log(`Player 2 score = ${player2Score}`);

    if (dealerScore !== playerScore) {
        dealerWon ? balance = balance : balance += playerHand1.betOnThisHand * 2;

        dealerVsPlayer1Message = dealerWon ? "Dealer Win Hand 1" : "Player Win Hand 1";
    } else {
        balance += totalBet;

        dealerVsPlayer1Message = "Push";
    }

    if (dealerScore !== player2Score) {
        dealerWonHand2 ? balance = balance : balance += playerHand2.betOnThisHand * 2;

        dealerVsPlayer2Message = dealerWonHand2 ? "Dealer Win Hand 2" : "Player Win Hand 2";
    } else {
        balance += totalBet;

        dealerVsPlayer2Message = "Push";
    }

    displayGameInfo.textContent = `${dealerVsPlayer1Message}, ${dealerVsPlayer2Message}`;
}

function disableButtons() {
    stayBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
    splitBtn.disabled = true;
}

function runDealerTurn() {
    while (dealerHand.count < 17) {
        drawCard(dealerHand);
    }

    if (dealerHand.count - 10 === 7 && dealerHand.cards.some(card => card.numValue === 'Ace')) {
        drawCard(dealerHand);
    }

    endGame(true);
}

function hit() {
    if (playerHand1.selected && playerHand1.count < 21) drawCard(playerHand1);

    if (playerHand2.selected && playerHand2.count < 21) drawCard(playerHand2);

    const checkDidPlayerSplit = playerHand2.count !== 0;

    if (playerHand1.count < 21) {
        doubleBtn.disabled = true;
        splitBtn.disabled = true;

        return;
    }

    if (playerHand1.count >= 21 && !checkDidPlayerSplit) return runDealerTurn();

    if (playerHand2.count >= 21) return endGame(true);

    playerHand1.selected = false;
    playerHand2.selected = true;

    doubleBtn.disabled = false;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = 'limegreen';
}

function double() {
    balance -= originalBet;
    balanceOutput.textContent = balance.toFixed(2);

    if (playerHand1.selected) {
        playerHand1.betOnThisHand += originalBet;

        drawCard(playerHand1);
        reduceHandAces(playerHand1);
    }

    if (playerHand2.selected) {
        playerHand2.betOnThisHand += originalBet;

        drawCard(playerHand2);
        reduceHandAces(playerHand2)
        runDealerTurn();
    }

    const checkDidPlayerSplit = playerHand2.count !== 0;

    if (!checkDidPlayerSplit) {
        return playerHand1.count > 21 ? endGame(true) : runDealerTurn();
    }

    playerHand1.selected = false;
    playerHand2.selected = true;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = 'limegreen';
}

function stay() {
    const checkDidPlayerSplit = playerHand1.selected && playerHand2.count !== 0;

    if (!checkDidPlayerSplit) {
        return runDealerTurn();
    }

    playerHand1.selected = false;
    playerHand2.selected = true;

    doubleBtn.disabled = false;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = 'limegreen';
}

function split() {
    balance -= originalBet;
    playerHand2.betOnThisHand = playerHand1.betOnThisHand;
    balanceOutput.textContent = balance.toFixed(2);

    splitBtn.disabled = true;

    playerCardDisplay.style.backgroundColor = 'limegreen';

    const splitCard = playerHand1.cards[1];
    playerHand2.addToHand(splitCard);
    playerHand1.popFromHand(splitCard);

    const img = document.createElement('img');
    img.src = splitCard.imagePath;
    img.classList.add("game-cards");

    playerSplitCardDisplay.appendChild(img);

    drawCard(playerHand1);
    drawCard(playerHand2);
    checkForBlackjack();
}

async function game() {
    const userBetInput = document.querySelector("#user-input-bet").value;
    clearHand(dealerHand);
    clearHand(playerHand1);
    clearHand(playerHand2);
    displayGameInfo.textContent = "";

    originalBet = Number(userBetInput) >= 0.01 && Number(userBetInput) <= balance ? Number(userBetInput) : 0;

    if (originalBet === 0) return window.alert("Invalid Bet");

    playerHand1.betOnThisHand = originalBet;
    totalBet = originalBet;
    balance -= totalBet;
    balanceOutput.textContent = balance.toFixed(2);

    playBtn.disabled = true;

    playerHand1.selected = true;
    playerHand2.selected = false;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = null;

    faceDownCard = shoe.drawCard();
    dealerHand.addToHand(faceDownCard);

    faceDownCardImage.src = "../Images/Blackjack/backOfCard.jpeg";
    faceDownCardImage.className = "game-cards slideInTop";

    dealerCardDisplay.appendChild(faceDownCardImage);

    await new Promise(resolve => setTimeout(() => {
        drawCard(playerHand1);
        resolve();
    }, 750));

    await new Promise(resolve => setTimeout(() => {
        drawCard(dealerHand);
        resolve();
    }, 550));

    await new Promise(resolve => setTimeout(() => {
        drawCard(playerHand1);
        resolve();
    }, 750));
    
    checkForSplitAllowed(playerHand1) ? splitBtn.disabled = false : splitBtn.disabled = true;
    hitBtn.addEventListener("click", hit);
    if (balance - originalBet >= 0) doubleBtn.addEventListener("click", double);
    stayBtn.addEventListener("click", stay);
    if (balance - originalBet >= 0) splitBtn.addEventListener("click", split);
    stayBtn.disabled = false;
    hitBtn.disabled = false;
    doubleBtn.disabled = false;
    checkForBlackjack();
}

window.addEventListener("DOMContentLoaded", () => {
    playBtn.addEventListener("click", game);
});
