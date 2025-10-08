document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("match-game-page")) return;

  const board = document.getElementById("game-board");
  const resetBtn = document.getElementById("reset-btn");
  const winMessage = document.getElementById("win-message");

  // ---- CONFIG ----
  const images = [
    "game-assets/tile1.jpg",
    "game-assets/tile2.jpg",
    "game-assets/tile3.jpg",
    "game-assets/tile4.jpg",
    "game-assets/tile5.jpg",
    "game-assets/tile6.jpg",
    "game-assets/tile7.jpg",
    "game-assets/tile8.jpg"
  ];

  const gridSize = 4; // 4x4 grid = 8 pairs

  // ---- GAME STATE ----
  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;

  // ---- INIT GAME ----
  function startGame() {
    winMessage.textContent = "";
    board.innerHTML = "";
    matchedPairs = 0;
    flippedCards = [];

    // duplicate & shuffle images
    const selected = images.slice(0, (gridSize * gridSize) / 2);
    const gameImages = [...selected, ...selected].sort(() => Math.random() - 0.5);

    // create cards
    gameImages.forEach((imgSrc) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back"><img src="${imgSrc}" alt="tile"></div>
        </div>
      `;
      card.addEventListener("click", () => flipCard(card, imgSrc));
      board.appendChild(card);
    });
  }

  // ---- FLIP CARD ----
  function flipCard(card, imgSrc) {
    if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

    card.classList.add("flipped");
    flippedCards.push({ card, imgSrc });

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 700);
    }
  }

  // ---- CHECK MATCH ----
  function checkMatch() {
    const [first, second] = flippedCards;
    if (first.imgSrc === second.imgSrc) {
      matchedPairs++;
      flippedCards = [];

      if (matchedPairs === (gridSize * gridSize) / 2) {
        winMessage.textContent = "🎉 You matched all tiles!";
      }
    } else {
      first.card.classList.remove("flipped");
      second.card.classList.remove("flipped");
      flippedCards = [];
    }
  }

  // ---- RESET ----
  resetBtn.addEventListener("click", startGame);

  startGame();
});

// ===========================
// Breathing Game Logic
// ===========================

function startBreathing() {
  const phaseText = document.querySelector(".phase-text");
  const circle = document.querySelector(".circle");
  const startBtn = document.querySelector(".start-btn");

  startBtn.disabled = true;
  startBtn.textContent = "Relaxing...";
  phaseText.textContent = "Inhale...";

  let cycle = 0;
  const totalCycles = 3;

  function breathingCycle() {
    // Inhale phase
    phaseText.textContent = "Inhale...";
    circle.style.animation = "expand 4s ease-in-out forwards";

    setTimeout(() => {
      // Hold phase
      phaseText.textContent = "Hold...";
      circle.style.animation = "none";
      circle.style.transform = "scale(1.5)";

      setTimeout(() => {
        // Exhale phase
        phaseText.textContent = "Exhale...";
        circle.style.animation = "contract 4s ease-in-out forwards";

        setTimeout(() => {
          cycle++;
          if (cycle < totalCycles) {
            breathingCycle();
          } else {
            phaseText.textContent = "Well done!";
            circle.style.animation = "none";
            circle.style.transform = "scale(1)";
            startBtn.disabled = false;
            startBtn.textContent = "Restart";
          }
        }, 6000); // exhale duration
      }, 5000); // hold duration
    }, 6000); // inhale duration
  }

  breathingCycle();
}

// ===========================
// Sentence Reframe Game Logic
// ===========================

const reframeData = [
  { negative: "I quit", positive: "I will not quit" },
  { negative: "I am sad", positive: "I am happy" },
  { negative: "I can’t do it", positive: "I can do it" },
  { negative: "I’ll never be good enough", positive: "I will try becoming better each day" },
  { negative: "Things never work out for me", positive: "Things will work out for me" }
];

let currentSentence = 0;

function loadReframe() {
  const sentenceEl = document.getElementById("negative-sentence");
  const feedbackEl = document.getElementById("feedback");
  const inputEl = document.getElementById("user-input");

  if (currentSentence < reframeData.length) {
    sentenceEl.textContent = reframeData[currentSentence].negative;
    feedbackEl.textContent = "";
    inputEl.value = "";
  } else {
    sentenceEl.textContent = "✨ Well done! You completed all sentences!";
    feedbackEl.textContent = "";
    document.querySelector(".submit-btn").style.display = "none";
    inputEl.style.display = "none";
  }
}

function checkReframe() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  const feedbackEl = document.getElementById("feedback");

  const correctAnswer = reframeData[currentSentence].positive.toLowerCase();

  if (input === correctAnswer) {
    feedbackEl.textContent = "✅ Good job!";
    feedbackEl.style.color = "green";
    currentSentence++;
    setTimeout(loadReframe, 1500);
  } else {
    feedbackEl.textContent = "❌ Try again!";
    feedbackEl.style.color = "red";
  }
}

// Load the first sentence when page starts
document.addEventListener("DOMContentLoaded", loadReframe);
