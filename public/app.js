const totalCardsAllowed = 10;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  
  let paddingDivisor = 200;
  padding = Math.min(windowHeight, windowWidth) / paddingDivisor;
  minCardSlotPadding = padding * 2;

  boardSetup();
}

function boardSetup() {
	let boardRatio = 5
	let boardHeight = windowHeight * (1 - 1 / boardRatio);
	let boardX = windowWidth / boardRatio;
	board = new Board(boardX, 0, windowWidth - boardX, boardHeight);

	deck = new Deck(board);
	landingBoard = new LandingBoard(board);

	cardSlotSetup(deck);
}

function cardSlotSetup(deck) {
	let cardRatio = 1.7;

	cardWidth = (deck.width - (totalCardsAllowed + 1) * minCardSlotPadding) / totalCardsAllowed;
	cardHeight = deck.height - 2 * minCardSlotPadding;

	let xPadding = 0;
	let yPadding = 0;
	if (cardHeight < cardRatio * cardWidth) {
		cardWidth = cardHeight / cardRatio;
		yPadding = minCardSlotPadding;
		xPadding = (deck.width - totalCardsAllowed * cardWidth) / (totalCardsAllowed + 1);
	} else {
		cardHeight = cardWidth * cardRatio;
		xPadding = minCardSlotPadding;
		yPadding = (deck.height - cardHeight) / 2;
	}

	cardSlots = [];
	for (let i = 0; i < totalCardsAllowed; i++) {
		let x = xPadding + (cardWidth + xPadding) * i;
		cardSlots.push(new CardSlot(x, deck.y + yPadding, cardWidth, cardHeight));
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  boardSetup(); // Change this.
}

function draw() {
	background(211, 211, 211);

	board.display("white");
	deck.display("white");
	landingBoard.display("white")

	cardSlots.forEach((cardSlot) => cardSlot.display("white"));
}

function mouseDragged() {
} 

function mousePressed() {
}

function mouseReleased() {
}

function selectCard(i) {
}

function deselectCard() {
}

class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	display(color) {
		fill(color);

		let cornerRadius = 10;
		rect(
			this.x,
			this.y,
			this.width, 
			this.height,
			cornerRadius,
			cornerRadius,
			cornerRadius,
			cornerRadius
		);
	}

	overlap() {
		return mouseX > this.x
			&& mouseX < (this.x + this.width)
			&& mouseY > this.y
			&& mouseY < (this.y + this.height)
	}

	getCorners() {
		let x0 = this.x;
		let y0 = this.y;
		let x1 = x0 + this.width;
		let y1 = y0 + this.height;
		return [x0, y0, x1, y1];
	}
}

class SolidRectangle extends Rectangle {
	display(color) {
		drawingContext.setLineDash([]);
		super.display(color);
	}
}

class DashedRectangle extends Rectangle {
	display(color) {
		drawingContext.setLineDash([10, 5]);
		super.display(color);
	}
}

class Deck extends SolidRectangle {
	constructor(board) {
		let y1 = board.getCorners()[3];
		super(0, y1, windowWidth, windowHeight - y1);
	}
}

class Board extends SolidRectangle {
}

class LandingBoard extends SolidRectangle {
	constructor(board) {
		super(0, board.y, windowWidth - board.width, board.height);
	}
}

class CardSlot extends DashedRectangle {
}

class Card extends Rectangle {
}