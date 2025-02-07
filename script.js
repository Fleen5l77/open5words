const words = ["слово", "кросс", "флаг", "книга", "ручка", "абзац", "броня", "винта", "грань", "дождь", "алмаз", "бисер", "вихрь", "графа", "дрель",     "кумир", "купол", "кураж", "курок", "кусок", "кухня", "лазер", "лакей", "лампа", "лапка", 
    "ласка", "лента", "лидер", "линия", "лицей", "ловец", "лодка", "ложка", "локон", 
    "лопух", "лыжня", "любим", "люстра", "магия", "макет", "манер", "маржа", "марка", 
    "масса", "масть", "мафия", "мелок", "месть", "метка", "мечта", "минус", "мираж", 
 "молот", "монах", "мотив", "музей", "мулат", "мумия", "мусор", 
    "муфта", "набор", "навес", "навык", "надел", "наезд", "наказ", "намек", "напор", 
    "народ", "наряд", "наука", "невод", "недуг", "нефть", "номер", "норма", "носок", "ночь", 
    "нрав", "нюанс", "обед", "образ", "обруч", "обувь", "овраг", "огонь", "озеро", "океан", 
    "оклад", "окно", "окоп", "окунь", "олень", "опера", "опора", "опрос", "орел", "осень", 
    "оскар", "ослик", "отбор", "отдел", "отзыв", "отказ", "откос", "отряд", "отход", "офис", 
    "охота", "очаг", "ошибка", "палач", "палец", "палка", "папка", "парк", "парус", "паста", 
    "пауза", "пафос", "певец", "пенал", "пепел", "песня", "петля", "печать", "пилот", "пирог", 
    "питон", "пламя", "плечо", "плита", "плоть", "пляж", "повод", "поезд", "поиск", "покой", 
    "полет", "полис", "полка", "полюс", "помеха", "порог", "порыв", "посев", "пост", "поэт", "право", "пресс", "приз", "принц", "приют", "проба", "проза", "профи", "прыжок", 
    "птица", "пульс", "пчела", "пшено", "пьеса", "пятно", "радар", "радио", 
    "район", "ранец", "раунд", "режим", "рельс", "робот", "роман", 
    "рубеж", "рубль", "рукав", "рулет", "ручка", "рыбак", "рынок"];

let currentWord = "";
let currentRow = 0;
let currentAttempt = "";
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;

const grid = document.querySelector(".grid");
const keyboard = document.querySelector(".keyboard");
const message = document.querySelector(".message");
const restartButton = document.querySelector(".restart");
const playButton = document.getElementById("play-button");
const achievementsButton = document.getElementById("achievements-button");
const aboutButton = document.getElementById("about-button");
const backButton = document.getElementById("back-button");
const backButtonAchievements = document.getElementById("back-button-achievements");
const levelDisplay = document.getElementById("level");
const xpDisplay = document.getElementById("xp");
const mainMenu = document.querySelector(".main-menu");
const gameContainer = document.querySelector(".game-container");
const aboutContainer = document.querySelector(".about-container");
const achievementsContainer = document.querySelector(".achievements-container");
const achievementsList = document.getElementById("achievements-list");
const backButtonGame = document.getElementById("back-button-game");
function initGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    currentRow = 0;
    currentAttempt = "";
    message.textContent = "";
    grid.innerHTML = "";
    keyboard.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");
            grid.appendChild(cell);
        }
    }

    const keys = "йцукенгшщзхъфывапролджэячсмитьбю";
    keys.split("").forEach(key => {
        const button = document.createElement("button");
        button.textContent = key;
        button.addEventListener("click", () => handleKeyPress(key));
        keyboard.appendChild(button);
    });

    const enterButton = document.createElement("button");
    enterButton.textContent = "Ввод";
    enterButton.addEventListener("click", handleEnter);
    keyboard.appendChild(enterButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "←";
    deleteButton.addEventListener("click", handleDelete);
    keyboard.appendChild(deleteButton);

    updateStatsDisplay();
}

function handleKeyPress(key) {
    if (currentAttempt.length < 5) {
        currentAttempt += key;
        updateGrid();
    }
}

function handleEnter() {
    if (currentAttempt.length === 5) {
        checkAttempt();
    }
}

function handleDelete() {
    if (currentAttempt.length > 0) {
        currentAttempt = currentAttempt.slice(0, -1);
        updateGrid();
    }
}

function updateGrid() {
    const cells = grid.querySelectorAll("div");
    for (let i = 0; i < 5; i++) {
        cells[currentRow * 5 + i].textContent = currentAttempt[i] || "";
    }
}

function checkAttempt() {
    const cells = grid.querySelectorAll("div");
    let correct = 0;

    for (let i = 0; i < 5; i++) {
        const cell = cells[currentRow * 5 + i];
        if (currentAttempt[i] === currentWord[i]) {
            cell.style.backgroundColor = "#4caf50";
            correct++;
        } else if (currentWord.includes(currentAttempt[i])) {
            cell.style.backgroundColor = "#ffeb3b";
        } else {
            cell.style.backgroundColor = "#f44336";
        }
    }

    if (correct === 5) {
        const xpGained = [1000, 800, 600, 500, 400, 300][currentRow];
        xp += xpGained;
        if (xp >= 1000) {
            level++;
            xp -= 1000;
        }
        saveStats();
        updateStatsDisplay();
        message.textContent = `Победа! Вы получили ${xpGained} XP!`;
        endGame();
    } else {
        currentRow++;
        currentAttempt = "";
        if (currentRow === 6) {
            message.textContent = `Поражение! Слово было: ${currentWord}`;
            endGame();
        }
    }
}

function endGame() {
    restartButton.style.display = "block";
}

function saveStats() {
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
}

function updateStatsDisplay() {
    levelDisplay.textContent = level;
    xpDisplay.textContent = xp;
}

function updateAchievements() {
    const achievements = achievementsList.querySelectorAll("li");
    achievements.forEach(achievement => {
        const requiredLevel = parseInt(achievement.getAttribute("data-level"));
        if (level >= requiredLevel) {
            achievement.classList.add("completed");
        } else {
            achievement.classList.remove("completed");
        }
    });
}

restartButton.addEventListener("click", () => {
    restartButton.style.display = "none";
    initGame();
});

playButton.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    initGame();
});

achievementsButton.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    achievementsContainer.classList.remove("hidden");
    updateAchievements();
});

aboutButton.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    aboutContainer.classList.remove("hidden");
});

backButton.addEventListener("click", () => {
    aboutContainer.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

backButtonGame.addEventListener("click", () => {
    gameContainer.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

initGame();