const totalCardsAllowed = 10;
let numBlanks = 3; // Number of cards that need to be submitted.

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  
  let paddingDivisor = 200;
  padding = Math.min(windowHeight, windowWidth) / paddingDivisor;
  cardSlotPadding = padding * 4;

  cardHeightMax = windowHeight / 8;

  boardSetup();
}

function boardSetup() {
  cardSlotSetup();

  let deckHeight = cardHeight + 2 * cardSlotPadding;
  deck = new Deck(0, windowHeight - deckHeight, windowWidth, deckHeight);
  
  let numCards = 1.5;
  let landingBoardWidth = (cardWidth + cardSlotPadding) * numCards + cardSlotPadding;
  landingBoard = new LandingBoard(0, 0, landingBoardWidth, windowHeight - deck.height);
  board = new Board(landingBoard.width, 0, windowWidth - landingBoard.width, landingBoard.height);

  cardSubmissionSlotSetup();
}

function cardSlotSetup() {
  let cardRatio = 1.7;
  cardWidth = (windowWidth - (totalCardsAllowed + 1) * cardSlotPadding) / totalCardsAllowed;
  cardHeight = cardWidth * cardRatio;

  if (cardHeight > cardHeightMax) {
    cardHeight = cardHeightMax;
    cardWidth = cardHeightMax / cardRatio;
  }

  cardSlots = [];
  for (let i = totalCardsAllowed; i > 0; i--) {
    let x = windowWidth - (cardWidth + cardSlotPadding) * i;
    cardSlots.push(new CardSlot(x, windowHeight - cardSlotPadding - cardHeight, cardWidth, cardHeight));
  }
}

function cardSubmissionSlotSetup() {
  let cy = calculateCenter(landingBoard.y, landingBoard.height);
  let cx = calculateCenter(landingBoard.x, landingBoard.width);
  let padding = cardSlotPadding * 2;

  let totalHeight = (cardHeight + padding) * numBlanks + padding;
  let startingY = cy - (totalHeight / 2);
  let x = cx - cardWidth / 2;

  cardSubmissionSlots = [];
  for (let i = 0; i < numBlanks; i++) {
    let y = startingY + (cardHeight + padding) * i + padding;
    cardSubmissionSlots.push(new CardSubmissionSlot(x, y, cardWidth, cardHeight));
  }
}

function calculateCenter(point, size) {
  return point + (size - point) / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  boardSetup(); // Change this.
}

function draw() {
  background(211, 211, 211);

  board.display("white");
  deck.display("white");
  landingBoard.display("white");

  cardSlots.forEach((cardSlot) => cardSlot.display("white"));
  cardSubmissionSlots.forEach((cardSlot) => cardSlot.display("white"));
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
}

class Board extends SolidRectangle {
}

class LandingBoard extends SolidRectangle {
}

class CardSlot extends DashedRectangle {
}

class CardSubmissionSlot extends DashedRectangle {
}

class Card extends Rectangle {
}