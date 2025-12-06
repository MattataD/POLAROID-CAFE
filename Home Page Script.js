const headerEl = document.querySelector('.Nav-bar');
headerEl.addEventListener('mouseenter', () => {
    headerEl.classList.add('Nav-bar-hov');
});
headerEl.addEventListener('mouseleave', () => {
    headerEl.classList.remove('Nav-bar-hov');
});

class Carousel {
    constructor(items) {
        this.items = [...items];
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.update();
        this.startAutoPlay();
    }

    update() {
        const len = this.items.length;


        this.items.forEach(el => {
            el.classList.remove("card_1", "card_2", "card_3");
        });

        this.items.forEach((el, index) => {
            if (index === 0) {
                el.classList.add("card_1"); 
            } else if (index === 1) {
                el.classList.add("card_2"); 
            } else if (index === 2) {
                el.classList.add("card_3"); 
            }
        });
    }

    rotate() {

        this.items.unshift(this.items.pop());
        this.update();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.rotate();
        }, 4000);
        this.isAutoPlaying = true;
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isAutoPlaying = false;
    }

    showPauseIndicator() {
        pauseIndicator.classList.add('show');
        setTimeout(() => {
            pauseIndicator.classList.remove('show');
        }, 1500);
    }
}

const cards = document.querySelectorAll('.card');
const container = document.querySelector('.group-container');
const pauseIndicator = document.querySelector('.pause-indicator');
const carousel = new Carousel(cards);

container.addEventListener('mouseenter', () => {
    carousel.stopAutoPlay();
    carousel.showPauseIndicator();
});

container.addEventListener('mouseleave', () => {
    carousel.startAutoPlay();
});
