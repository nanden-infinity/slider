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
  // SlidePosition
  slidePosition(slide) {
    const margin = this.wrapper.offsetWidth - slide.offsetWidth / 2;
    return -(slide.offsetLeft - margin);
  }
  // Slide Config
  slideCondig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element,
      };
    });
  }

  // Esse funcao encontra o slide do index da neve que a pessoa
  slideIndexNav(index) {
    const lastIndex = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === lastIndex ? undefined : index + 1,
    };
  }
  // Evento que muda o index de acordo com o slide que fomos pasando

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.distance.finalPosition = activeSlide.position;
  }
  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slideCondig();
    return this;
  }
}
