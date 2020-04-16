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

  card = new Card(windowWidth / 2, windowHeight / 2, cardWidth, cardHeight);
}

function boardSetup() {
  getCardDimensions();

  let deckHeight = cardHeight + 2 * cardSlotPadding;
  deck = new Deck(padding, windowHeight - deckHeight, windowWidth - 2 * padding, deckHeight - padding);
  
  let numCards = 1.5;
  let landingBoardWidth = (cardWidth + cardSlotPadding) * numCards + cardSlotPadding;
  landingBoard = new LandingBoard(padding, padding, landingBoardWidth, deck.y - 2 * padding);
  
  let landingBoardX1 = landingBoard.getCorners()[2];
  board = new Board(landingBoardX1 + padding, padding, windowWidth - landingBoardX1 - 2 * padding, landingBoard.height);

  cardSlotSetup();
  cardSubmissionSlotSetup();
}

function getCardDimensions() {
  let cardRatio = 1.7;
  cardWidth = (windowWidth - (totalCardsAllowed + 1) * cardSlotPadding) / totalCardsAllowed;
  cardHeight = cardWidth * cardRatio;

  if (cardHeight > cardHeightMax) {
    cardHeight = cardHeightMax;
    cardWidth = cardHeightMax / cardRatio;
  }
}

function cardSlotSetup() {
  cardSlots = [];
  for (let i = totalCardsAllowed; i > 0; i--) {
    let x = windowWidth - (cardWidth + cardSlotPadding) * i;
    cardSlots.push(new CardSlot(x, calculateCenter(deck.y, deck.height) - cardHeight / 2, cardWidth, cardHeight));
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
  return point + size / 2;
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

  card.display("blue");
}

function mouseDragged() {
  if (card.selected) {
    card.x = mouseX;
    card.y = mouseY;
  }  
} 

function mousePressed() {
  if (card.mouseOverlap()) {
    card.select();
  }
}

function mouseReleased() {
  card.deselect();
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

  mouseOverlap() {
    return mouseX > this.x
      && mouseX < (this.x + this.width)
      && mouseY > this.y
      && mouseY < (this.y + this.height)
  }

  rectangleOverlap(other) {
    let thisX0, thisY0, thisX1, thisY1, otherX0, otherY0, otherX1, otherY1;
    [thisX0, thisY0, thisX1, thisY1] = this.getCorners();
    [otherX0, otherY0, otherX1, otherY1] = other.getCorners();

    return otherX1 > thisX0 
      && otherX0 < thisX1 
      && otherY1 > thisY0
      && otherY0 < thisY1;
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
  display(color) {
    if (this.rectangleOverlap(card)) {
      super.display("gold");
    } else {
      super.display(color);
    }
  }
}

class CardSubmissionSlot extends DashedRectangle {
}

class Card extends SolidRectangle {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.selected = false;
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }
}