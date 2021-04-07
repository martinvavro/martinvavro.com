/* eslint-disable indent */
/*
    Handles non-sectionGame logic related front-end operations.
*/
class View {
  constructor() {
    history.replaceState(0, null, "");
    this.loadVariables();
    this.showInMain(this.sectionGame);
    this.loadDragVariables();
    this.addListeners();
    // windows clock at the bottom.
    this.clock();
    setInterval(() => this.clock(), 30000);
  }

  loadVariables() {
    this.sectionMain = document.querySelector("main");
    this.sectionGame = document.querySelector("#game");
    this.sectionOptions = document.querySelector("#options");
    this.sectionDocs = document.querySelector("#docs");
    this.sectionBsod = document.querySelector(".bsod");
    this.heading = [];
    this.content = [];
  }

  loadDragVariables() {
    this.xLimit = parseInt(this.sectionMain.offsetLeft);
    this.yLimit = parseInt(this.sectionMain.offsetTop);
    this.xOffset = 0;
    this.yOffset = 0;
  }

  showInMain(element, fromHistory = false) {
    this.resetElementsVisibility();
    this.addHistory(fromHistory, element);
    element.style.display = "block";
  }

  resetElementsVisibility() {
    this.sectionGame.style.display = "none";
    this.sectionOptions.style.display = "none";
    this.sectionDocs.style.display = "none";
    this.sectionMain.style.display = "block";
  }

  addHistory(fromHistory, element) {
    if (!fromHistory) {
      const x = this.getHistoryElementId(element);
      if (x != -1) history.pushState(x, null, "");
    }
  }

  getHistoryElementId(element) {
    if (element.id === this.sectionOptions.id) return 1;
    if (element.id === this.sectionGame.id) return 0;
    else return -1;
  }

  hide(element) {
    let target = this.getWindow(element);
    target.style.display = "none";
  }

  getWindow(element) {
    let target = element.parentElement;
    while (!target.classList.contains("window")) {
      target = target.parentElement;
    }
    return target;
  }

  addListeners() {
    // Dragable windows

    // Hide-show window
    document.querySelectorAll(".hide").forEach((x) => x.addEventListener("mousedown", (x) => this.hide(x.target), false));
    document.querySelectorAll(".hide").forEach((x) => x.addEventListener("touchstart", (x) => this.hide(x.target), { passive: true }));
    document.querySelector("#mineIcon").addEventListener("dblclick", () => this.showInMain(this.sectionGame), false);
    document.querySelector("#computer").addEventListener("dblclick", () => this.easterEggShow(), false);
    document.querySelector("#save").addEventListener("mousedown", () => this.showInMain(this.sectionGame), false);
    document.querySelector("#new").addEventListener("mousedown", () => this.showInMain(this.sectionGame), false);
    // Navbar functionality
    document.querySelector("#menuOptions").addEventListener("mousedown", () => this.showInMain(this.sectionOptions), false);
    document.querySelector("#menuOptions").addEventListener("touchstart", () => this.showInMain(this.sectionOptions), { passive: true });
    document.querySelectorAll(".menuScores").forEach((x) => x.addEventListener("mousedown", () => this.showHighScores(), false));
    document.querySelectorAll(".menuScores").forEach((x) => x.addEventListener("touchstart", () => this.showHighScores(), { passive: true }));
    document.querySelectorAll("#clearStorage").forEach((x) => x.addEventListener("mousedown", () => this.clearLocalStorageScores(), false));
    document.querySelectorAll("#clearStorage").forEach((x) => x.addEventListener("touchstart", () => this.clearLocalStorageScores(), { passive: true }));
    document.querySelector("#menuDocs").addEventListener("mousedown", (x) => this.pagination(x.target), false);
    document.querySelector("#menuDocs").addEventListener("touchstart", (x) => this.pagination(x.target), { passive: true });
    document.querySelector("#menuHelp").addEventListener("mousedown", (x) => this.pagination(x.target), false);
    document.querySelector("#menuHelp").addEventListener("touchstart", (x) => this.pagination(x.target), { passive: true });
    // Center window
    document.querySelector("#center").addEventListener("mousedown", this.centerMain.bind(this), false);
    // history
    document.querySelector("#next").addEventListener("click", () => this.gotoPage(parseInt(document.querySelector(".hidden").value) + 1));
    document.querySelector("#previous").addEventListener("click", () => this.gotoPage(parseInt(document.querySelector(".hidden").value) - 1));
    window.addEventListener("popstate", (e) => {
      if (e.state == 0) this.showInMain(this.sectionGame, true);
      if (e.state == 1) this.showInMain(this.sectionOptions, true);
      if (e.state.length == 2) {
        document.querySelector(".hidden").value = e.state[1];
        this.href = e.state[0];
        this.loadDocsContent();
        this.gotoPage(e.state[1], true);
      }
    });
  }

  pagination(element) {
    if (element.id === document.querySelector("#menuDocs").id) {
      this.href = "menuDocs";
    } else {
      this.href = "menuHelp";
    }
    this.loadDocsContent();
    this.gotoPage(0);
  }

  loadDocsContent() {
    if (this.href === "menuDocs") {
      this.heading = ["Goal of this project", "Procedure", "Features"];
      this.content = [
        `<p>The goal of this project was to create a fully
                functioning Minesweeper game. I'm a
                minesweeper enthusiast, and the most important feature for me was the ability to reveal buttons
                by clicking on empty numbered tile.
                (After having the correct number of flags in perimeter.)</p>`,
        `<p>This project took circa 80 hours. Each commit can be found in 
                <a href="https://gitlab.com/martinvavro/javascript-minesweeper/commits/master" target="_blank">Gitlab</a>. 
                It wasn't necessary to spend this much time but I loved every second of it.
                Best semestral project yet!</p > `,
        `<p> This applications has the following features:</p>
                <ul class="ulmine">
                <li>Modern design. (By 1994 standards)</li>
                <li>Bug free Minesweeper game. (Probably)</li>
                <li>Sound effects! (Audiophile experience)</li>
                <li>Dragable windows. (Kinda buggy)</li>
                <li>SVG graphics. (Beautiful)</li>
                <li>Digital LCD. (Made in canvas)</li>
                <li>W3.com valid HTML.</li>
                <li>Works in Opera, Firefox and Chrome. (Edge probably too)</li>
                <li>HTML5 semantics.</li>
                <li>Game options form.</li>
                <li>Can work without internet connection. (Dial-up is expensive)</li>
                <li>Advanced CSS selectors.</li>
                <li>Game options form.</li>
                <li>CSS3 transformations and transitions.</li>
                <li>Responsive docs window.</li>
                <li>ES6 JS classes.</li>
                <li>Local storage.</li>
                <li>History. (Changes within Main element)</li>
                <li>And much more... (Functionality in tutorial)</li>
                </ul > `,
      ];
    } else {
      this.heading = ["Gameplay", "Options", "UI"];
      this.content = [
        `
                <h5>What do the numbers mean?</h5>
                <p> Number on the tile states how many mines are present in it's surroundings. </p>
                <h5>Flags</h5>
                <p>Use right-click on mouse or flag toggle in mobile menu to flag mine locations.</p>
                <h5>Reveal</h5>
                <p>Reveal tiles by pressing buttons which you believe to not contain mine.
                Alterantively you can also click on the number on tile after having
                 the same number of flags in perimeter. </p>
                 <h5>High scores</h5>
                <p> For every size a best time gets recorded. Only works for predefined difficulties. </p>
                <h5></h5>
                `,
        `
                <h5>Size</h5>
                <p>You can set your own custom size of the board. Minimum is 2x2.</p>
                <h5>Difficulty</h5>
                <p>Four difficulties are available: Custom, Easy, Medium, Hard.</p>
                <h5>Easy Start</h5>
                <p>First click is guaranteed to land on an empty tile.</p>
                <h5>Mobile menu</h5>
                <p> Required for mobile devices in order to have a full featured game.</p>
                `,
        `<h5>Mobile Menu</h5>
                 <p>
                    Mobile menu contains three buttons. Button on the left centers the window.
                    Middle button toggles between mine and flag selection. 
                    Right button functionality is not yet implemented. It will function as an undo move.
                 </p>
                 <h5>Main Window</h5>
                 <p>
                    Main Window is draggable, you can position it wherever you please. It can also be closed.
                    To open it after closing it, double click/tap on the minesweeper icon on the desktop.
                 </p>
                 <h5>Start menu</h5>
                 <p>
                    Start menu will return you to homepage.
                 </p>
                 <h5>My computer</h5>
                 <p>
                    Full-featured Microsoft Windows 95 experience.
                 </p>
                `,
      ];
    }
  }

  gotoPage(index, fromHistory = false) {
    let currentPage = document.querySelector(".hidden");
    currentPage.value = index;
    if (!fromHistory) history.pushState([this.href, index], null, "");
    if (currentPage.value < 0) currentPage.value = 0;
    if (currentPage.value > this.heading.length - 1) currentPage.value = this.heading.length - 1;
    this.renderPage();
  }

  renderPage() {
    let currentPage = document.querySelector(".hidden");
    let index = parseInt(currentPage.value);
    this.disablePaginationButtons(index);
    document.querySelector("#heading").innerHTML = this.heading[index];
    document.querySelector("#content").innerHTML = this.content[index];
    this.showInMain(this.sectionDocs);
  }

  disablePaginationButtons(index) {
    const prevButton = document.querySelector("#previous");
    const nextButton = document.querySelector("#next");
    prevButton.classList = "buttonWindow";
    nextButton.classList = "buttonWindow";
    if (index === 0) prevButton.classList = "buttonWindow disabled";
    if (index === this.heading.length - 1) nextButton.classList = "buttonWindow disabled";
  }

  clearLocalStorageScores() {
    if (window.confirm("Are you sure?")) {
      let storage = window.localStorage;
      const options = storage.getItem("options");
      storage.clear();
      storage.setItem("options", options);
      this.clearHighScoresTable();
    }
  }

  easterEggClose() {
    this.sectionBsod.style.display = "none";
    document.querySelector("body").style.cursor = "auto";
    this.showInMain(this.sectionGame);
  }

  easterEggShow() {
    document.querySelector("body").style.cursor = "wait";
    setTimeout(() => {
      this.sectionBsod.style.display = "flex";
      this.hide(this.sectionGame);
      this.sectionBsod.addEventListener("mousedown", () => this.easterEggClose(), false);
      document.querySelector("body").style.cursor = "none";
    }, 1000);
  }

  clock() {
    var today = new Date();
    var time = today.getHours() + ":" + (today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes());
    document.querySelector("#clock").innerHTML = time;
  }

  centerMain() {
    this.sectionMain.style.top = "25%";
    this.sectionMain.style.left = "50%";
    this.sectionMain.style.transform = "translate3d(" + 0 + "px, " + 0 + "px, 0)";
  }

  showHighScores() {
    this.clearHighScoresTable();
    document.querySelector("#headerText").innerHTML = "High Scores";
    document.querySelector(".modal").style.display = "block";
    document.querySelector("#highscores").style.display = "block";
    document.querySelector("#highscore").style.display = "none";
    this.getLocalStorage("easy");
    this.getLocalStorage("medium");
    this.getLocalStorage("hard");
  }

  clearHighScoresTable() {
    document.querySelector("#tdif").innerHTML = "<th>Difficutly</th>";
    document.querySelector("#ttim").innerHTML = "<th>Time</th>";
    document.querySelector("#tsiz").innerHTML = "<th>Size</th>";
  }

  getLocalStorage(diffic) {
    const storage = window.localStorage;
    const difficulty = storage.getItem(diffic);
    if (difficulty) {
      JSON.parse(difficulty).forEach((x) => {
        this.tableColumnFactory(x, diffic);
      });
    }
  }

  tableColumnFactory(size, diff) {
    document.querySelector("#tdif").appendChild(this.tableDataFactory(diff));
    document.querySelector("#ttim").appendChild(this.tableDataFactory(localStorage.getItem(size + "," + diff) + "s"));
    document.querySelector("#tsiz").appendChild(this.tableDataFactory(size));
  }

  tableDataFactory(content) {
    let td = document.createElement("TD");
    td.innerHTML = content;
    return td;
  }
}

// Make the DIV element draggable:
dragElement(document.getElementById("minesweeper"));
dragElement(document.getElementById("modalWindow"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.querySelector("#" + elmnt.id + " .windowHeader")) {
    // if present, the header is where you move the DIV from:
    document.querySelector("#" + elmnt.id + " .windowHeader").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

new View();
