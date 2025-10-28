import debounce from "./deboounce.js";

export class Slide {
  constructor(wrapper, slide) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.distance = { finalPosition: 0, startX: 0, movement: 0 };
    this.ActiveClass = "active";
  }

  // Essa funcao  como bem o nome diz remove o item anterior que tiver o classe Active;
  // O uso de funcao IFF e propositado comm o treinamento da logica
  // Acontece que poderia ser chamado logo na instancia o ou fazendo mesmo o forEach ????
  removeActive() {
    (() =>
      document
        .querySelectorAll(`.${this.ActiveClass}`)
        ?.forEach((cl) => cl.classList.remove(this.ActiveClass)))();
  }
  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
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
    this.transition(false);
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
    event.preventDefault();
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
    this.transition(true);
    this.changeSlideOnEnd();
  }
  // Essa funcao  muda o slide  para o ponto centrar
  changeSlideOnEnd() {
    if (this.distance.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.distance.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
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
  // Essa funcao vai activar o classe que tiver activo do elemento movido do slider
  changeActiveClass() {
    this.removeActive();
    this.slideArray[this.index.active].element.classList.add(this.ActiveClass);
  }

  // Essa funcao vai activar o slide anterior
  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }
  // Essa funcao vai activar o slide a seguir
  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
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
    this.changeActiveClass();
  }

  // Fazendo a funcao onResize para manter os dados que  foram pegadas do objecto

  onRezise() {
    // Se essa funcao acontecer quero manter os valores armazenados no meu  objecto definido no constructor
    // aqui volto a chamar a funcao changeSlide e ativar indice atual
    // Feito todo isso vou colocar  isso dentro de um settimeout
    setTimeout(() => {
      this.slideCondig();
      this.changeSlide(this.index.active);
    }, 100);
  }
  // Agora aqui criando o evento do resize com window
  addResize() {
    window.addEventListener("resize", this.onRezise);
  }
  // Essa funcao esta fazendo o bind  das funcoes que foram passadas nela
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onRezise = debounce(this.onRezise.bind(this), 200);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }
  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slideCondig();
    this.changeSlide(4);
    this.activePrevSlide();
    this.transition(true);
    this.addResize();
    return this;
  }
}

export class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);

    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);

    this.nextElement.addEventListener("click", this.activeNextSlide);
  }
}
