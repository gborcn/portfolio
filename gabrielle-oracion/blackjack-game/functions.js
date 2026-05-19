let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";
let wins = 0;

let dealerCards = [];
let dealerSum = 0;

function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;

  if (randomNumber > 10) return 10;
  else if (randomNumber === 1) return 11;
  else return randomNumber;
}

function startGame() {
  if (isAlive) return; // prevent multiple starts

  isAlive = true;
  hasBlackJack = false;

  // disable Start button
  document.getElementById("start-btn").disabled = true;

  // Player cards
  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  cards = [firstCard, secondCard];
  sum = firstCard + secondCard;

  // Dealer cards
  let d1 = getRandomCard();
  let d2 = getRandomCard();
  dealerCards = [d1, d2];
  dealerSum = d1 + d2;

  renderGame();
}

function renderGame() {
  document.getElementById("cards").textContent = cards.join(" ");
  document.getElementById("sum").textContent = sum;

  document.getElementById("dealer-cards").textContent = dealerCards.join(" ");
  document.getElementById("dealer-sum").textContent = dealerSum;

  if (sum < 21) {
    message = "Hit or Stand?";
  } else if (sum === 21) {
    message = "Blackjack! You stand automatically.";
    hasBlackJack = true;
    stand();
  } else {
    message = "You busted! Dealer wins 😢";
    isAlive = false;

    // ✅ enable start button again when player busts
    document.getElementById("start-btn").disabled = false;
  }

  document.getElementById("message").textContent = message;
}

function newCard() {
  if (isAlive && !hasBlackJack) {
    let card = getRandomCard();
    cards.push(card);
    sum += card;
    renderGame();
  }
}

function stand() {
  if (!isAlive) return;

  // Clear any previous message
  document.getElementById("message").textContent = "";

  function dealerDraw() {
    if (dealerSum < 17) {
      let card = getRandomCard();
      dealerCards.push(card);
      dealerSum += card;

      // Update dealer cards and sum directly
      document.getElementById("dealer-cards").textContent = dealerCards.join(" ");
      document.getElementById("dealer-sum").textContent = dealerSum;

      // Show current dealer hit in the message temporarily
      document.getElementById("message").textContent = `Dealer draws ${card}.`;

      // Draw next card after 800ms
      setTimeout(dealerDraw, 800);
    } else {
      // Dealer stops
      document.getElementById("message").textContent = "Dealer stands.";
      setTimeout(checkWinner, 800); // check winner after short delay
    }
  }

  dealerDraw();
}
  
function checkWinner() {
  let messageElement = document.getElementById("message");

  // ❗ Always remove blink first (reset)
  messageElement.classList.remove("blink");

  if (sum === 21) {
    // 🔥 BLACKJACK (PLAYER)
    messageElement.textContent = "BLACKJACK! You win 🎉";
    messageElement.classList.add("blink");
    wins++;

    // 👉 After 1.5s, stop blinking and show final message
    setTimeout(() => {
      messageElement.classList.remove("blink");
      messageElement.textContent = "You win 🎉";
    }, 1500);

  } else if (dealerSum === 21) {
    // 🔥 BLACKJACK (DEALER)
    messageElement.textContent = "BLACKJACK! Dealer wins 😢";
    messageElement.classList.add("blink");

    setTimeout(() => {
      messageElement.classList.remove("blink");
      messageElement.textContent = "Dealer wins 😢";
    }, 1500);

  } else if (dealerSum > 21) {
    messageElement.textContent = "Dealer busts! You win 🎉";
    wins++;

  } else if (dealerSum > sum) {
    messageElement.textContent = "Dealer wins 😢";

  } else if (dealerSum < sum) {
    messageElement.textContent = "You win 🎉";
    wins++;

  } else {
    messageElement.textContent = "It's a tie 🤝";
  }

  document.getElementById("wins").textContent = wins;
  isAlive = false;

  document.getElementById("start-btn").disabled = false;
}

function playAgain() {
  cards = [];
  dealerCards = [];
  sum = 0;
  dealerSum = 0;
  hasBlackJack = false;
  isAlive = false;
  wins = 0; // RESET the counter

  // Clear all displays
  document.getElementById("cards").textContent = "";
  document.getElementById("sum").textContent = "";
  document.getElementById("dealer-cards").textContent = "";
  document.getElementById("dealer-sum").textContent = "";
  document.getElementById("message").textContent = "Want to play a round?";
  document.getElementById("wins").textContent = wins; // update counter on screen
}