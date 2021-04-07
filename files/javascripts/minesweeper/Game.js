
/* 
	I hope it is not required to comment every little thing throughout the code. 
	I tried my best to come up with easy to understand both method and variable names.
*/



// This is not a good practice. But it works fine here.
Array.prototype.containsPosition = function (obj) {
	let i = this.length;
	while (i--) {
		if (this[i].column == obj.column && this[i].row == obj.row) {
			return true;
		}
	}
	return false;
};

Array.prototype.removePosition = function (obj) {
	let i = this.length;
	while (i--) {
		if (this[i].column == obj.column && this[i].row == obj.row) {
			this.splice(i, 1);
		}
	}
};

class Coordinate {
	constructor(row, column) {
		this.row = parseInt(row);
		this.column = parseInt(column);
	}
}

/*
	This class handles form, high scores and keeps track of important game state data.
*/
class GameState {
	constructor() {
		this.loadLocalStorage();
		this.getFormTextInputs();
		this.loadVariables();
		this.formCheck();
		this.addListeners();
	}

	loadVariables() {
		this.uncovered = 0;
		this.state = "initial";
		this.toggle = document.querySelector("#toggle").classList.contains("mine");
	}

	addListeners() {
		document.querySelector("#toggle").addEventListener("click", this.toggleRevealer.bind(this), true);
		// each change is checked by formCheck
		document.querySelector(".options").addEventListener("input", this.formCheck.bind(this), false);
	}

	get storage() {
		return window.localStorage;
	}

	loadLocalStorage() {
		if (!this.storage.getItem("options"))
			this.storage.setItem("options", JSON.stringify(this.getValuesFromForm()));
		else
			this.setValuesFromLocalStorage();
	}

	toggleRevealer(e) {
		this.toggle = !this.toggle;
		if (this.toggle)
			e.target.classList = "mobButton mine";
		else
			e.target.classList = "mobButton flag";
	}

	// Returns array with game settings which will be placed into local storage.
	getValuesFromForm() {
		this.sound = document.querySelector("#sound").checked;
		this.easyStart = document.querySelector("#easyStart").checked;
		this.mobileMenu = document.querySelector("#mobileMenu").checked;
		this.backButton = document.querySelector("#backButton").checked;
		this.mines = parseInt(document.getElementById("mines").value);
		this.columns = parseInt(document.getElementById("columns").value);
		this.rows = parseInt(document.getElementById("rows").value);
		document.getElementsByName("difficulty").forEach(radio => {
			if (radio.checked)
				this.difficulty = radio.value;
		});
		return ([this.sound, this.easyStart, this.mobileMenu, this.backButton, this.mines, this.columns, this.rows, this.difficulty]);
	}

	setValuesFromLocalStorage() {
		const options = JSON.parse(this.storage.getItem("options"));
		document.querySelector("#sound").checked = options[0];
		document.querySelector("#easyStart").checked = options[1];
		document.querySelector("#mobileMenu").checked = options[2];
		document.querySelector("#backButton").checked = options[3];
		document.getElementById("mines").value = parseInt(options[4]);
		document.getElementById("columns").value = parseInt(options[5]);
		document.getElementById("rows").value = parseInt(options[6]);
	}

	getFormTextInputs() {
		this.backButtonInput = document.querySelector("#backButton");
		this.minesInput = document.querySelector("#mines");
		this.columnsInput = document.querySelector("#columns");
		this.rowsInput = document.querySelector("#rows");
	}

	formCheck() {
		this.getValuesFromForm();
		this.handleDifficultySetting();
		this.mobileMenuToggler();
		this.updateFormNumberInputs();
		this.disableEasystart();
	}

	disableEasystart() {
		let easyStart = document.querySelector("#easyStart");
		if ((this.columns * this.rows) - this.mines < 9) {
			easyStart.checked = false;
			easyStart.disabled = true;

		} else {
			easyStart.disabled = false;
		}

	}

	mobileMenuToggler() {
		const mobileMenu = document.querySelector(".mobileMenu");
		if (!this.mobileMenu) {
			mobileMenu.style.display = "none";
			this.backButtonInput.disabled = true;
			this.backButtonInput.checked = false;
		}
		else {
			mobileMenu.style.display = "";
			// Maybe I will implement this feature once, 
			// don't have time for it now.
			// this.backButtonInput.disabled = false;
		}
	}

	updateFormNumberInputs() {
		this.minesInput.value = this.mines;
		this.rowsInput.value = this.rows;
		this.columnsInput.value = this.columns;
	}

	handleDifficultySetting() {

		this.minesInput.disabled = true;
		if (this.difficulty === "hard")
			this.calculateNumberOfMines(5);
		if (this.difficulty === "easy")
			this.calculateNumberOfMines(10);
		if (this.difficulty === "medium")
			this.calculateNumberOfMines(7);
		if (this.difficulty === "custom") {
			this.minesInput.disabled = false;
			let limit = (this.columns * this.rows) - 1;
			this.mines = this.mines > limit ? limit : this.mines;
		}
	}

	calculateNumberOfMines(ratio) {
		this.mines = parseInt(this.columns * this.rows / ratio);
		if (this.mines == 0) this.mines = 1;
	}

	/*
		 I'm 99% sure this could've been done better.
		 Each difficulty can have any kind of size stored.
		 So each difficulty has an item in the local storage
		 with an array of already recorded sizes. If it doesn't 
		 exist new one gets created and recorded. If it does,
		 it compares the times and if it is a record, it gets 
		 recorded.
	 */
	addHighScore(time) {
		if (this.difficulty != "custom") {
			let storageTimes = [];
			time = time / 100;
			const size = this.columns + "x" + this.rows;
			if (this.storage.getItem(this.difficulty)) {
				storageTimes = JSON.parse(this.storage.getItem(this.difficulty));
				if (storageTimes.indexOf(size) != -1) {
					const previousRecord = this.storage.getItem(size + "," + this.difficulty);
					if (previousRecord > time) {
						this.storage.setItem(size + "," + this.difficulty, time);
						this.showHighScore(time);
					}
				}
				else {
					this.addNewRecord(storageTimes, size, time);
				}
			}
			else {
				this.addNewRecord(storageTimes, size, time);
			}
		}
	}

	addNewRecord(storageTimes, size, time) {
		storageTimes.push(size);
		this.storage.setItem(this.difficulty, JSON.stringify(storageTimes));
		this.storage.setItem(size + "," + this.difficulty, time);
		this.showHighScore(time);
	}

	// Shows new high score modal window.
	showHighScore(time) {
		document.querySelector(".modal").style.display = "block";
		document.querySelector("#highscores").style.display = "none";
		document.querySelector("#highscore").style.display = "block";
		document.querySelector("#headerText").innerHTML = "New High Score!";
		document.querySelector("#recordDif").innerHTML = this.difficulty;
		document.querySelector("#recordTim").innerHTML = time;
	}
}

// Engine calcutes mine positions, and adds all numbers on the board.
class Engine {
	constructor(gameState) {
		this.minePositions;
		this.gameState = gameState;
	}

	determineMinePositions() {
		let row;
		let column;
		let positions = [];
		let i = 0;
		do {
			row = Math.floor(Math.random() * this.gameState.rows);
			column = Math.floor(Math.random() * this.gameState.columns);
			const asignee = new Coordinate(row, column);
			if (!positions.containsPosition(asignee)) positions[i++] = asignee;
		} while (positions.length != this.gameState.mines);
		this.minePositions = positions;
		return positions;
	}

	// "Numberifies" the board.
	calculateBoard() {
		this.board = this.getEmptyBoard();
		this.determineMinePositions().forEach(mine => {
			this.board[mine.row][mine.column] += 9;
			this.getNeighbours(mine).forEach(minePosition => {
				this.board[minePosition.row][minePosition.column]++;
			});
		});
	}

	getEmptyBoard() {
		let board = [];
		for (let i = 0; i < this.gameState.rows; i++) {
			let row = [];
			for (let j = 0; j < this.gameState.columns; j++) {
				row[j] = 0;
			}
			board[i] = row;
		}
		return board;
	}

	getNeighbours(mine) {
		let radius = [];
		for (let i = mine.row - 1; i < mine.row + 2; i++)
			if (i >= 0 && i < this.gameState.rows)
				for (let j = mine.column - 1; j < mine.column + 2; j++)
					if (j >= 0 && j < this.gameState.columns)
						if (!(i == mine.row && j == mine.column))
							radius.push(new Coordinate(i, j));
		return radius;
	}
}

/*
	This class makes the LCD canvas work.
	Also increments seconds since game started.
*/
class LCD {
	constructor() {
		this.loadDisplays();
		this.segment = [];
		this.number = [];
		this.loadSegments();
		this.loadNumbers();
		this.seconds = 0;
	}

	loadDisplays() {
		const time = document.getElementById("time");
		const remaining = document.getElementById("remaining");
		this.tctx = time.getContext("2d");
		this.rctx = remaining.getContext("2d");
	}

	/*
		Each position in this array represents it's number.
		So if we call this.number[5] all the segments in
		number 5 will light up.
	*/
	loadNumbers() {
		this.number[0] = [5, 5, 7, 3, 9, 6, 6];
		this.number[1] = [0, 0, 2, 3, 4, 6, 6];
		this.number[2] = [0, 5, 7, 8, 9, 6, 1];
		this.number[3] = [0, 0, 7, 8, 9, 6, 6];
		this.number[4] = [5, 0, 2, 8, 4, 6, 6];
		this.number[5] = [5, 0, 7, 8, 9, 1, 6];
		this.number[6] = [5, 5, 7, 8, 9, 1, 6];
		this.number[7] = [0, 0, 7, 3, 4, 6, 6];
		this.number[8] = [5, 5, 7, 8, 9, 6, 6];
		this.number[9] = [5, 0, 7, 8, 9, 6, 6];
		// All dim
		this.number[10] = [0, 0, 2, 3, 4, 1, 1];
		// "-" sign
		this.number[11] = [0, 0, 2, 8, 4, 1, 1];
	}

	/*
	LCD segments.
	DR = Dim Right
	LMT = Lit Middle Top 
	and so on..
	*/
	loadSegments() {
		this.segment[0] = document.getElementById("DL");
		this.segment[1] = document.getElementById("DR");
		this.segment[2] = document.getElementById("DMT");
		this.segment[3] = document.getElementById("DMM");
		this.segment[4] = document.getElementById("DMB");
		this.segment[5] = document.getElementById("LL");
		this.segment[6] = document.getElementById("LR");
		this.segment[7] = document.getElementById("LMT");
		this.segment[8] = document.getElementById("LMM");
		this.segment[9] = document.getElementById("LMB");
	}

	// variable x specifies the X axis offset.
	drawNumber(context, number, x) {
		// Left segments
		context.drawImage(this.segment[number[0]], x, 3);
		context.drawImage(this.segment[number[1]], x, 18);
		// Middle segments
		context.drawImage(this.segment[number[2]], x + 2, 2);
		context.drawImage(this.segment[number[3]], x + 2, 15);
		context.drawImage(this.segment[number[4]], x + 2, 28);
		// Right segments
		context.drawImage(this.segment[number[5]], x + 13, 3);
		context.drawImage(this.segment[number[6]], x + 13, 18);
	}

	// I was surprised that I have to clear the canvas between each 
	// change
	clearDisplay(context) {
		context.rect(0, 0, 70, 34);
		context.fill();
	}

	// takes in a number and print's it to the corresponding canvas.
	printNumber(number, display = "time") {
		display = display === "time" ? this.tctx : this.rctx;
		this.clearDisplay(display);
		const digits = this.getDigits(number);
		this.drawNumber(display, this.number[digits[0]], 4);
		this.drawNumber(display, this.number[digits[1]], 26);
		this.drawNumber(display, this.number[digits[2]], 49);
	}

	getDigits(number) {
		if (number > 999)
			number = 999;
		if (number < -99)
			number = -99;
		let returnArray = number.toString().split("");
		/* 
			This one is here for the ability to display negative number. 
			Scenario: More flags are placed on the board than the actual
			number of bombs. I could have just limited the number of possible 
			flags, but this is cooler.
		*/
		if (returnArray[0] == "-")
			returnArray[0] = 11;
		while (returnArray.length < 3)
			returnArray.unshift(10);
		return returnArray;

	}

	incrementSeconds() {
		this.seconds++;
		if (this.seconds % 100 === 0)
			this.printNumber(this.seconds / 100);
	}
}

/* 
	There are way too many things here.
	Basically draws the buttons, according to calculations in Engine class.
	Adds event listeners to game logic elements. 
	Checks if game has been won or is over.
	Plays sounds. 

*/
class Controller {
	constructor() {
		this.addListeners();
		this.resetGame();
	}

	resetGame() {
		this.stopTimer();
		this.initVariables();
		this.createButtonBoard();
		this.addBoardListeners();
		this.initLCD();
		this.changeSun();
	}

	initVariables() {
		this.gameState = new GameState();
		this.engine = new Engine(this.gameState);
		this.lcd = new LCD();
		this.flagPositions = [];
		this.buttons = [];
		this.timer;
		this.listeners = [];
	}

	initLCD() {
		this.lcd.printNumber(0);
		this.lcd.printNumber(0, "rem");
	}

	// Creates buttons according to Engine.
	createButtonBoard() {
		let btnRow = [];
		let buttons = [];
		for (let i = 0; i < this.gameState.rows; i++) {
			btnRow[i] = this.buttonRowFactory();
			let row = [];
			for (let j = 0; j < this.gameState.columns; j++) {
				row[j] = this.buttonFactory(i + "," + j);
				btnRow[i].appendChild(row[j]);
			}
			buttons[i] = row;
			this.drawRow(btnRow, i);
		}
		this.buttons = buttons;
	}

	drawRow(btnRow, i) {
		document.querySelector(".board").appendChild(btnRow[i]);
	}

	buttonRowFactory() {
		let div = document.createElement("DIV");
		div.setAttribute("class", "btnRow");
		return div;
	}

	buttonFactory(id) {
		let btn = document.createElement("A");
		btn.setAttribute("class", "mineButton");
		btn.setAttribute("id", id);
		return btn;
	}

	addListeners() {
		// Game restart event listeners.
		document.querySelectorAll(".restart").forEach(x => x.addEventListener("mousedown", () => {
			this.reset();
		}));
		document.querySelectorAll(".restart").forEach(x => x.addEventListener("touchstart", () => {
			this.reset();
		}, { passive: false }));

		// Save setting event listener.
		// It is here because it also triggers a new game.
		document.querySelector("#save").addEventListener("mousedown", () => {
			this.gameState.storage.setItem("options", JSON.stringify(this.gameState.getValuesFromForm()));
			this.reset();
		}, false);
	}

	addBoardListeners() {
		// Mine Buttons event listeners.
		this.buttons.forEach(row => row.forEach(column => {
			column.addEventListener("click", element => {
				if (this.gameState.toggle) {
					if (this.gameState.state === "initial")
						this.loadGame(element.target);
					this.handleClick(element.target);
				}
				else {
					if (this.gameState.uncovered !== 0)
						this.handleRightClick(element.target);
				}
			});
			column.addEventListener("contextmenu", flagElement => {
				flagElement.preventDefault();
				if (this.gameState.state === "default")
					this.handleRightClick(flagElement.target);
			});
		}));
	}

	// Removes buttons and starts a new game
	reset() {
		this.buttons.forEach(x => x.forEach(y => y.remove()));
		this.resetGame();
	}

	handleClick(element) {
		// This means it's not a bomb and not and empty tile too.
		if (this.gameState.state == "default") {
			if (element.innerHTML != 0 && element.innerHTML < 9)
				this.flagReveal(element);
			else this.reveal(element);
			this.gameWon();
			this.changeSun();
		}
	}

	// Starts a new game.
	loadGame(element) {
		let position = this.getButtonCoordinates(element);
		this.gameState.state = "default";
		this.engine.calculateBoard();
		this.easyStart(position);
		this.startTimer();
		this.updateRemaining();
	}

	// Makes sure that the first click lands on an empty tile ...by brute force.
	easyStart(position) {
		if (this.gameState.easyStart)
			while (this.engine.board[position.row][position.column] != 0)
				this.engine.calculateBoard();
	}

	startTimer() {
		this.timer = setInterval(() => {
			this.lcd.incrementSeconds();
		}, 10);
	}

	stopTimer() {
		clearInterval(this.timer);
	}

	// This is an important feature for me as an minewsweeper enthusiast.
	// After you've marked the corrensponding number of mines in the perimeter,
	// you can just click on the number to reveal if your guess was correct.
	flagReveal(element) {
		let positions = this.engine.getNeighbours(
			this.getButtonCoordinates(element)
		);
		let flags = 0;
		positions.forEach(x => {
			if (this.buttons[x.row][x.column].classList.contains("flag")) flags++;
		});
		if (element.innerHTML == flags)
			positions.forEach(x => this.reveal(this.buttons[x.row][x.column]));
	}

	handleRightClick(element) {
		this.setFlag(element);
		if (element.innerHTML != 0 && element.innerHTML < 9 && !this.gameState.toggle)
			this.flagReveal(element);
		this.gameWon();
		this.changeSun();
	}

	setFlag(element) {
		if (this.containsClass(element, "flag")) {
			element.classList.remove("flag");
			this.flagPositions.removePosition(this.getButtonCoordinates(element));
		} else if (!this.containsClass(element, "empty")) {
			element.className += " flag";
			this.flagPositions.push(this.getButtonCoordinates(element));
		}
		this.updateRemaining();
	}

	setBomb(element) {
		element.className += " mine";
	}

	setFalseFlag(element) {
		element.classList.remove("flag");
		element.className += " falseflag";
	}

	setEmpty(element, value) {
		element.className += " empty num" + value;
		if (value != 0 && !element.classList.contains("falseflag"))
			element.innerHTML = value;
		this.gameState.uncovered++;
	}

	// Reveals empty tiles after clicking on them. Oh, and is also recursive.
	reveal(element) {
		const originCoordinates = this.getButtonCoordinates(element);
		const tileValue = this.engine.board[originCoordinates.row][
			originCoordinates.column
		];
		if (
			!this.containsClass(element, "empty") &&
			!this.containsClass(element, "flag")
		) {
			if (tileValue < 9) {
				this.setEmpty(element, tileValue);
				this.engine.getNeighbours(originCoordinates).forEach(newCoordinates => {
					if (tileValue == 0)
						this.reveal(
							this.buttons[newCoordinates.row][newCoordinates.column]
						);
				});
			} else this.gameOver(element);
		}
	}

	// Stops the game and makes the sun sad.
	gameOver(element) {
		this.stopTimer();
		this.playSound("files/Assets/sound/gameOver.jpg");
		this.gameState.state = "lost";
		element.className += " deadly";
		this.engine.minePositions.forEach(x => {
			if (!this.containsClass(this.buttons[x.row][x.column], "flag"))
				this.setBomb(this.buttons[x.row][x.column]);
			this.flagPositions.removePosition(x);
		});
		this.flagPositions.forEach(x =>
			this.setFalseFlag(this.buttons[x.row][x.column])
		);
	}

	// Stops the game and makes the sun smug.
	gameWon() {
		const toUncover =
			this.gameState.rows * this.gameState.columns - this.gameState.mines;
		if (this.gameState.uncovered == toUncover) {
			this.stopTimer();
			this.gameState.addHighScore(this.lcd.seconds);
			this.gameState.state = "win";
			this.buttons.forEach(row => row.forEach(x => {
				if (x.classList.length == 1)
					this.setFlag(x);
			}));
			this.playSound("files/Assets/sound/gameWon.jpg");
			return true;
		}
		return false;
	}

	playSound(file) {
		if (this.gameState.sound) {
			const sound = new Audio(file);
			sound.play().catch(function () {
			});
		}
	}

	changeSun() {
		let sun = document.querySelector(".sun");
		if (this.gameState.state === "win") sun.classList += " sunwon";
		if (this.gameState.state === "lost") sun.classList += " sunlost";
		if (this.gameState.state === "default" || this.gameState.state === "initial") {
			sun.classList += " sunclick";
			setTimeout(() => (sun.classList = "sun"), 200);
		}
	}

	// changes the number of mines required to flag.
	updateRemaining() {
		this.lcd.printNumber(
			this.gameState.mines - this.flagPositions.length,
			"remaining"
		);
	}

	containsClass(element, cssClass) {
		return element.classList.contains(cssClass);
	}

	getButtonCoordinates(element) {
		return new Coordinate(element.id.split(",")[0], element.id.split(",")[1]);
	}
}

// This is where all the trouble began.
new Controller();
