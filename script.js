/* ===== Buffer Page Logic ===== */
if (document.body.classList.contains("buffer-page")) {
  setTimeout(() => {
    window.location.href = "login.html"; // redirect to login after 2 seconds
  }, 2000);
}


/* ===== Login Page Logic ===== */
if (document.body.classList.contains("login-page")) {
  const form = document.querySelector(".login-form");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // stop actual form submission

    // (Demo only) You can add validation or backend later
    alert("Login successful!");
    window.location.href = "mood.html"; // redirect to home after login
  });
}

/* ===== Sign Up Page Logic ===== */
if (document.body.classList.contains("signup-page")) {
  const form = document.querySelector(".signup-form");
  const termsCheckbox = document.querySelector("#terms-checkbox");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // stop default submission

    if (!termsCheckbox.checked) {
      alert("Please agree to the Terms & Conditions to continue.");
      return;
    }

    // (Demo only) In real app, send data to backend
    alert("Sign up successful!");
    window.location.href = "personal-info.html"; // go to personal info page
  });
}

/* ===== Personal Info Page Logic ===== */
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".personal-page")) {
    // Chip toggle
    document.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("active");
      });
    });

    // Submit handler
    const form = document.getElementById("personal-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // For now, just go to home.html
      window.location.href = "mood.html";
    });
  }
});

// Mood options (index = slider value)
const moods = ["😌 Calm", "😊 Happy", "😐 Neutral", "😔 Stressed", "😡 Angry"];

const moodSlider = document.getElementById("moodSlider");
const moodLabel = document.getElementById("moodLabel");
const moodIcons = document.querySelectorAll(".mood-icons img");

// Function to update UI
function updateMoodUI(value) {
  moodLabel.textContent = moods[value];
  moodIcons.forEach((icon, index) => {
    icon.classList.toggle("active", index == value);
  });
}

// Initial set
if (moodSlider) {
  updateMoodUI(moodSlider.value);

  moodSlider.addEventListener("input", function() {
    updateMoodUI(this.value);
  });
}

// Save mood and go to home page
function saveMood() {
  const mood = moods[moodSlider.value];
  localStorage.setItem("currentMood", mood);
  window.location.href = "home.html"; // redirect after confirm
}

// Set current mood dynamically (placeholder example)
document.addEventListener("DOMContentLoaded", () => {
  const moodElement = document.getElementById("currentMood");
  if (moodElement) {
    moodElement.textContent = "😊 Happy"; // Later update from mood.html
  }

  // Weekly Reports Chart
  const ctx = document.getElementById("weeklyChart");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Mood Trend",
          data: [3, 4, 2, 5, 4, 3, 5], // Example data
          borderColor: "#4a90e2",
          backgroundColor: "rgba(74, 144, 226, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#4a90e2"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, max: 5 }
        }
      }
    });
  }
});

// Games navigation
function openGame(page) {
  window.location.href = page;
}

/* ===== Growth Plant Logic ===== */
// Track growth percentage
let growth = 35;

function completeTask(task) {
  growth = Math.min(growth + 15, 100); // increase growth
  document.getElementById("growthStatus").textContent = `Growth: ${growth}% 🌱`;

  // Update plant stage image
  const plantImage = document.getElementById("plantImage");
  if (growth < 40) {
    plantImage.src = "assets/plant-seed.png";
  } else if (growth < 70) {
    plantImage.src = "assets/plant-sprout.png";
  } else if (growth < 100) {
    plantImage.src = "assets/plant-small.png";
  } else {
    plantImage.src = "assets/plant-full.png";
  }
}

/* =========================
   Common JS for All Pages
   ========================= */

// Example: Update Current Mood ribbon dynamically (if present)
function updateCurrentMood(moodText) {
  const moodElement = document.getElementById("currentMood");
  if (moodElement) {
    moodElement.textContent = moodText;
  }
}

// Example: Redirect helper
function goToPage(page) {
  window.location.href = page;
}

/* =========================
   Profile Page Logic
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const bodyClass = document.body.classList;

  // --- Profile Page Specific ---
  if (bodyClass.contains("profile-page")) {
    const editBtn = document.querySelector(".edit-btn");
    const logoutBtn = document.querySelector(".settings-list li:last-child");

    // Edit Profile button
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        alert("Profile editing not implemented yet!");
        // Future: open modal to edit name/avatar/email
      });
    }

    // Logout (last item in settings list)
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        goToPage("login.html");
      });
    }

    // Demo: Auto-fill mood + stats (replace with DB/API later)
    updateCurrentMood("😊 Happy");

    const streakCard = document.querySelector(".stat-card:nth-child(2) h4");
    if (streakCard) streakCard.textContent = "5 🔥";

    const activitiesCard = document.querySelector(".stat-card:nth-child(3) h4");
    if (activitiesCard) activitiesCard.textContent = "8";
  }
});

/* ======================================================
   Plant page logic
   ====================================================== */
(function() {
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("plant-page")) return;

    const popupOverlay = document.getElementById("popupOverlay");
    const nurtureBtn = document.getElementById("nurtureBtn");
    const growBtn = document.getElementById("growBtn");
    const cancelGrow = document.getElementById("cancelGrow");
    const positiveInput = document.getElementById("positiveInput");
    const plantImage = document.getElementById("plantImage");
    const growthStatus = document.getElementById("growthStatus");

    // fallback guards
    if (!plantImage || !growthStatus) {
      console.warn("[plant] essential DOM nodes missing (plantImage/growthStatus)");
      return;
    }

    // image candidate lists (tries each until one loads)
    const STAGE1 = ["assets/plant-grow1.png", "assets/plant-seed.png", "assets/plant-1.png"];
    const STAGE2 = ["assets/plant-grow2.png", "assets/plant-sprout.png", "assets/plant-2.png"];
    const STAGE3 = ["assets/plant-grow3.png", "assets/plant-grown.png", "assets/plant-full.png", "assets/plant-3.png"];

    // loadFromCandidates: try each src until one onload succeeds
    function loadFromCandidates(list, onSuccess, onFail) {
      let i = 0;
      function tryNext() {
        if (i >= list.length) {
          if (onFail) onFail();
          return;
        }
        const test = new Image();
        test.onload = () => onSuccess(list[i]);
        test.onerror = () => { i += 1; tryNext(); };
        test.src = list[i];
      }
      tryNext();
    }

    // helper to set plant image with a small animation
    function setPlantImage(src) {
      // set temporary opacity to create a pleasant transition
      plantImage.style.opacity = 0.6;
      // after a tiny delay set src then animate
      setTimeout(() => {
        plantImage.src = src;
        plantImage.classList.add("plant-grow-anim");
        setTimeout(() => {
          plantImage.classList.remove("plant-grow-anim");
          plantImage.style.opacity = 1;
        }, 650);
      }, 80);
    }

    // load a candidate image (tries automatically)
    function setPlantStage(candidates) {
      loadFromCandidates(candidates, (goodSrc) => {
        setPlantImage(goodSrc);
      }, () => {
        console.warn("[plant] no candidate images found for stage", candidates);
      });
    }

    // growth value (persisted)
    let growth = parseInt(localStorage.getItem("plantGrowth") || "35", 10);
    if (isNaN(growth)) growth = 35;

    // map growth -> image
    function updatePlantUI() {
      // clamp
      growth = Math.max(0, Math.min(100, Number(growth) || 0));
      if (growth >= 100) {
        setPlantStage(STAGE3);
        growthStatus.textContent = "Your plant is fully grown 🌳";
      } else if (growth >= 80) {
        // final visuals may be same as stage3
        setPlantStage(STAGE3);
        growthStatus.textContent = `Growth: ${growth}% 🌿`;
      } else if (growth >= 40) {
        setPlantStage(STAGE2);
        growthStatus.textContent = `Growth: ${growth}% 🌿`;
      } else {
        setPlantStage(STAGE1);
        growthStatus.textContent = `Growth: ${growth}%`;
      }
    }

    // initialize
    updatePlantUI();

    // Open popup
    if (nurtureBtn && popupOverlay) {
      nurtureBtn.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
        popupOverlay.setAttribute("aria-hidden", "false");
        // focus textarea
        if (positiveInput) positiveInput.focus();
      });
    }

    // Close popup clicking overlay background
    if (popupOverlay) {
      popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
          popupOverlay.style.display = "none";
          popupOverlay.setAttribute("aria-hidden", "true");
        }
      });
    }

    // Cancel button (close)
    if (cancelGrow) {
      cancelGrow.addEventListener("click", () => {
        if (popupOverlay) {
          popupOverlay.style.display = "none";
          popupOverlay.setAttribute("aria-hidden", "true");
        }
      });
    }

    // Grow button handler
    if (growBtn) {
      growBtn.addEventListener("click", () => {
        const text = (positiveInput && positiveInput.value || "").trim();
        if (!text) {
          alert("Please write something positive 🌼");
          return;
        }

        // increase growth by step (adjustable)
        const STEP = 30;
        growth = Math.min(100, growth + STEP);
        localStorage.setItem("plantGrowth", String(growth));

        updatePlantUI();

        // clear & close
        if (positiveInput) positiveInput.value = "";
        if (popupOverlay) {
          popupOverlay.style.display = "none";
          popupOverlay.setAttribute("aria-hidden", "true");
        }
      });
    }

    // Expose debug helper
    window._plant = {
      getGrowth: () => growth,
      setGrowth: (v) => { growth = Math.max(0, Math.min(100, Number(v)||0)); localStorage.setItem("plantGrowth", String(growth)); updatePlantUI(); },
      reset: () => { growth = 35; localStorage.setItem("plantGrowth", String(growth)); updatePlantUI(); }
    };

  }); // DOMContentLoaded end
})();

