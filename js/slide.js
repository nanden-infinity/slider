export default class Slide {
  constructor(wrapper, slide) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.distance = { finalPosition: 0, startX: 0, movement: 0 };
  }

  onStart(event) {
    let mouseType;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.distance.startX = event.clientX;
      mouseType = "mousemove";
    } else {
      this.distance.startX = Math.floor(event.changedTouches[0].clientX);

      mouseType = "touchmove";
    }
    this.wrapper.addEventListener(mouseType, this.onMove);
  }
  moveSlide(distanceX) {
    this.distance.movePosition = distanceX;
    this.slide.style.transform = `translate3d(${distanceX}px,0,0)`;
  }
  updatePosition(clientX) {
    clientX = Math.floor(clientX);
    console.log(clientX);
    this.distance.movement = (this.distance.startX - clientX) * 1.6;
    return this.distance.finalPosition - this.distance.movement;
  }
  onMove(event) {
    // event.preventDefault();
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);

    this.moveSlide(finalPosition);
  }
  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(moveType, this.onMove);

    this.distance.finalPosition = this.distance.movePosition;
  }
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
  }
}
