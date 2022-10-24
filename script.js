// Card variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = [ 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'],
    colors = ['black, red'];

// DOM variables
let textArea = document.getElementById('text-area'),
    introArea = document.getElementById('intro'),
    dealerCardsArea = document.getElementById('dealer-cards'),
    playerCardsArea = document.getElementById('player-cards'),
    newGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button');

// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();
  
newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  
  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [ getNextCard(), getNextCard() ];
  playerCards = [ getNextCard(), getNextCard() ];
  
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  introArea.innerHTML = '<h2>Play!</h2>'
  textArea.innerText = '';
  checkForEndOfGame();
  showStatus();
});

hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});


function createDeck() {
    let deck = [];
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push( card );
        }
    }
    return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardHTML(card) {
  let icon = '';
  if (card.suit == 'Hearts') {
    icon = 'hearts';
  }
  else if (card.suit == 'Spades') {
    icon = 'spades';
  }
  else if (card.suit == 'Diamonds') {
    icon = 'diamonds';
  }
  else {
    icon = 'clubs';
  }
   
  return '<div class="card"><div class="value">' + card.value + '</div><div id="suit" class="' + icon + '"></div></div>';
}
function getCardString(card) {
    return card.value + ' of ' + card.suit;
}

function getNextCard() {
    return deck.shift();
}

function getCardNumericValue(card) {
  switch(card.value) {
    case 'A':
      return 1;
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    case '7':
      return 7;
    case '8':
      return 8;
    case '9':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'A') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
  
  updateScores();
  
  if (gameOver) {
    // let dealer take cards
    while(dealerScore < playerScore 
          && playerScore <= 21 
          && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
      console.log('dealer needs more cards');
    }
  }
  
  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
    console.log('player score greater than 21');
  }
  else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
    console.log('dealer score greater than 21');
  }
  
  else if (playerScore === dealerScore) {
    playerWon = false;
    gameOver = true;
    console.log('TIE! Dealer wins');
  }
  
  else if (playerScore === 21) {
    playerWon = true;
    gameOver = true;
    console.log('BlackJack!');
  }
  
  else if (gameOver) {
    
    if (playerScore > dealerScore) {
      playerWon = true;
      console.log('player score greater than dealer score');
    }
    else {
      playerWon = false;
      console.log('dealer score greater than player score');
    }
  }
}

function showStatus() {
  if (!gameStarted) {
    textArea.innerText = 'Let\'s play a game!';
    return;
  }
  
  let dealerCardString = '';
  for (let i=0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  
  let dealerCardElement = '';
  for (let i=0; i < dealerCards.length; i++) {
    dealerCardsArea.innerHTML = dealerCardElement += getCardHTML(dealerCards[i]);
  }
  
  
  let playerCardString = '';
  for (let i=0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  
  let playerCardElement = '';
  for (let i=0; i < playerCards.length; i++) {
    playerCardsArea.innerHTML = playerCardElement += getCardHTML(playerCards[i]);
  }
  
  updateScores();
   
  document.getElementById('dealer-score').innerText = 
    'Dealer has: ' + dealerScore  + '\n\n'
    
  document.getElementById('player-score').innerText = 
    'Player has: ' + playerScore  + '\n\n'
  
  if (gameOver) {
    if (playerWon) {
      introArea.innerHTML = "<h2>YOU WIN <i class=\"fas fa-laugh-beam\"></i></h2>";
    }
    else {
      introArea.innerHTML = "<h2>DEALER WINS <i class=\"fas fa-sad-tear\"></i></h2>";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }

}
