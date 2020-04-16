let cards = [];
let cardSelected = false;
let selectedCard = null;
let selectDeltaX = 0;
let selectDeltaY = 0;

function setup() {
	console.log("test");
  createCanvas(windowWidth, windowHeight);

  let width = windowWidth / 10;
  let height = width * 2;
  let padding = windowWidth / 50;
  let totalCards = Math.floor((windowWidth - padding) / (width + padding));
  for (i = 0; i < totalCards; i++) {
  	let x = padding + i * (width + padding);
  	let y = (windowHeight / 2) - (height / 2);
  	cards.push(new Card(x, y, width, height));
  }
}

function draw() {
	background("yellow");

	for (i = cards.length - 1; i >= 0; i--) {
		cards[i].display("pink");

		if (cards[i].overlap()) {
			cards[i].display("blue");
		}

		if (cardSelected) {
			selectedCard.display("purple");
		}
	}
}

function mouseDragged() {
	if (cardSelected) {
		selectedCard.x = mouseX - selectDeltaX;
		selectedCard.y = mouseY - selectDeltaY;
	}
}

function mousePressed() {
	let j = 0;
	for (i = 0; i < cards.length; i++) {
		if (cards[j].overlap() && cardSelected == false) {
			selectCard(j);
		}
		else {
			j++;
		}
	}
}

function mouseReleased() {
	deselectCard();
}

function selectCard(i) {
	selectDeltaX = mouseX - cards[i].x;
	selectDeltaY = mouseY - cards[i].y;
	cardSelected = true;
	selectedCard = cards[i];
	cards.splice(i, 1);
}

function deselectCard() {
	cardSelected = false;
	cards.unshift(selectedCard);
}

class Card {
	constructor(x, y, width, height) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.selectDeltaX = null;
		this.selectDeltaY = null;
		this.selected = false;
	}

	display(color) {
		fill(color);
		rect(
			this.x,
			this.y,
			this.width, 
			this.height
		);
	}

	overlap() {
		return mouseX > this.x
			&& mouseX < (this.x + this.width)
			&& mouseY > this.y
			&& mouseY < (this.y + this.height)
	}
}