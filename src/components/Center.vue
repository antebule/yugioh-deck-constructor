<template>
    <div class="center">
        <!-- MAIN DECK -->
        <div class="main-deck">
            <div class="main-deck-side-area">
                <div>
                    <div class="deck-total">{{ deck.length }}</div>
                    <hr>
                    <div v-for="type in ['normal', 'effect', 'ritual', 'spell', 'trap']" :key="type"
                        class="main-deck-card-type" :class="'main-deck-card-type-' + type">{{ countType(type) }}
                    </div>
                </div>

                <div class="main-deck-label-area">
                    <span class="main-deck-label">DECK</span>
                </div>
            </div>

            <div class="deck" @dragover.prevent @drop.prevent="deckDrop()">
                <draggable class="draggable-deck" ghost-class="ghost">
                    <transition-group type="transition" name="flip-list">
                        <div class="card sortable" v-for="(card, index) in deck" :key="index" :id="index"
                            @mouseover="hover(card)" @dragstart="mainDeckDragg($event, card)"
                            @dragend="mainDeckDraggEnd()">
                            <img class="card__img" :src="card.card_images[0].image_url_small" alt="card" />
                        </div>
                    </transition-group>
                </draggable>

                <div class="deck-background-grid">
                    <div v-for="i in 60" :key="i" class="deck-background-grid_box"></div>
                </div>
            </div>
        </div>

        <!-- SIDE DECK -->
        <div class="side-deck" @dragover.prevent @drop.prevent="sideDeckDrop()">
            <div class="side-deck-label-area">
                <span class="side-deck-label">SIDE</span>
            </div>
            <div class="side-deck-area">
                <draggable class="draggable" ghost-class="ghost">
                    <transition-group type="transition" name="flip-list">
                        <div class="card sortable" v-for="(card, index) in sideDeck" :key="index" :id="index"
                            @mouseover="hover(card)" @dragstart="sideDeckDragg($event, card)"
                            @dragend="sideDeckDraggEnd()">
                            <img class="card__img" :src="card.card_images[0].image_url_small" alt="card" />
                        </div>
                    </transition-group>
                </draggable>

                <div class="side-deck-background-grid">
                    <div v-for="i in 15" :key="i" class="side-deck-background-grid_box"></div>
                </div>
            </div>
        </div>

        <!-- EXTRA DECK -->
        <div class="extra-deck" @dragover.prevent @drop.prevent="extraDeckDrop()">
            <div class="extra-deck-label-area">
                <span class="extra-deck-label">EXTRA</span>
            </div>
            <div class="extra-deck-area">
                <draggable class="draggable" ghost-class="ghost">
                    <transition-group type="transition" name="flip-list">
                        <div class="card sortable" v-for="(card, index) in extraDeck" :key="index" :id="index"
                            @mouseover="hover(card)" @dragstart="extraDeckDragg($event, card)"
                            @dragend="extraDeckDraggEnd()">
                            <img class="card__img" :src="card.card_images[0].image_url_small" alt="card" />
                        </div>
                    </transition-group>
                </draggable>

                <div class="extra-deck-background-grid">
                    <div v-for="i in 15" :key="i" class="extra-deck-background-grid_box"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
    components: {
        draggable,
    },
    computed: {
        dropout() {
            return this.$store.getters.dropout;
        },
        deck() {
            return this.$store.getters.mainDeck;
        },
        sideDeck() {
            return this.$store.getters.sideDeck;
        },
        extraDeck() {
            return this.$store.getters.extraDeck;
        },
        countType() {
            return type => {
                return this.deck.filter((c) => c.type.toLowerCase().includes(type.toLowerCase())).length;
            };
        },
    },
    watch: {
        dropout() {
            if (this.dropout === true) {
                const mainCard = this.$store.getters.mainCard;
                const sideCard = this.$store.getters.sideCard;
                const extraCard = this.$store.getters.extraCard;
                if (mainCard.card) {
                    this.deck.splice(mainCard.index, 1);
                    this.$store.dispatch("dropout", false);
                } else if (sideCard.card) {
                    this.sideDeck.splice(sideCard.index, 1);
                    this.$store.dispatch("dropout", false);
                } else if (extraCard.card) {
                    this.extraDeck.splice(extraCard.index, 1);
                    this.$store.dispatch("dropout", false);
                }
            }
        },
    },
    methods: {
        deckDrop() {
            const droppedCard = this.$store.getters.draggedCard;
            const sideCard = this.$store.getters.sideCard;
            if (
                droppedCard.id &&
                this.deck.length < 60 &&
                this.checkType(droppedCard) &&
                this.checkNumber(droppedCard)
            ) {
                this.deck.push(droppedCard);
            } else if (
                sideCard.card &&
                this.deck.length < 60 &&
                this.checkType(sideCard.card)
            ) {
                this.deck.push(sideCard.card);
                this.sideDeck.splice(sideCard.index, 1);
            }
        },
        sideDeckDrop() {
            const droppedCard = this.$store.getters.draggedCard;
            const mainCard = this.$store.getters.mainCard;
            const extraCard = this.$store.getters.extraCard;
            if (
                droppedCard.id &&
                this.sideDeck.length < 15 &&
                this.checkNumber(droppedCard)
            ) {
                this.sideDeck.push(droppedCard);
            } else if (extraCard.card && this.sideDeck.length < 15) {
                this.sideDeck.push(extraCard.card);
                this.extraDeck.splice(extraCard.index, 1);
            } else if (mainCard.card && this.sideDeck.length < 15) {
                this.sideDeck.push(mainCard.card);
                this.deck.splice(mainCard.index, 1);
            }
        },
        extraDeckDrop() {
            const droppedCard = this.$store.getters.draggedCard;
            const sideCard = this.$store.getters.sideCard;
            if (
                droppedCard.id &&
                this.extraDeck.length < 15 &&
                !this.checkType(droppedCard) &&
                this.checkNumber(droppedCard)
            ) {
                this.extraDeck.push(droppedCard);
            } else if (
                sideCard.card &&
                this.extraDeck.length < 15 &&
                !this.checkType(sideCard.card)
            ) {
                this.extraDeck.push(sideCard.card);
                this.sideDeck.splice(sideCard.index, 1);
            }
        },
        checkNumber(card) {
            let number = 0;
            this.deck.forEach((deck_card) => {
                if (deck_card.id === card.id) number++;
            });
            this.sideDeck.forEach((deck_card) => {
                if (deck_card.id === card.id) number++;
            });
            this.extraDeck.forEach((deck_card) => {
                if (deck_card.id === card.id) number++;
            });
            if (number < 3) {
                return true;
            } else {
                return false;
            }
        },
        hover(card) {
            this.$store.dispatch("cardHover", card);
        },
        checkType(card) {
            if (
                card.type.includes("Synchro") ||
                card.type.includes("Link") ||
                card.type.includes("Fusion") ||
                card.type.includes("Pendulum") ||
                card.type.includes("XYZ")
            ) {
                return false;
            } else {
                return true;
            }
        },
        mainDeckDragg(event, card) {
            this.$store.dispatch("mainDeckDraggedCard", {
                card,
                index: event.target.id,
            });
        },
        mainDeckDraggEnd() {
            this.$store.dispatch("mainDeckDraggedCard", {});
        },
        sideDeckDragg(event, card) {
            this.$store.dispatch("sideDeckDraggedCard", {
                card,
                index: event.target.id,
            });
        },
        sideDeckDraggEnd() {
            this.$store.dispatch("sideDeckDraggedCard", {});
        },
        extraDeckDragg(event, card) {
            this.$store.dispatch("extraDeckDraggedCard", {
                card,
                index: event.target.id,
            });
        },
        extraDeckDraggEnd() {
            this.$store.dispatch("extraDeckDraggedCard", {});
        },
    },
};
</script>

<style scoped>
.center {
    width: 55%;
}

.main-deck {
    height: 71%;
    display: flex;
}

.main-deck-side-area {
    width: 8%;
    background-color: blue;
    height: 100%;
    flex-direction: column;
    display: flex;
    justify-content: space-between;
}

.deck-total,
.main-deck-card-type {
    width: 90%;
    aspect-ratio: 3 / 4;
    margin: 4px;
    font-size: 50px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    background: lightgray;
}


.main-deck-card-type-normal {
    background-color: #ebc05e;
}

.main-deck-card-type-effect {
    background-color: sandybrown;
}

.main-deck-card-type-ritual {
    background-color: dodgerblue;
}

.main-deck-card-type-spell {
    background-color: #7ccf7c;
}

.main-deck-card-type-trap {
    background-color: #e34f86;
}

.deck {
    height: 100%;
    border: 1px solid blue;
    background-color: rgb(113 155 249 / 93%);
    flex: 1;
}

.side-deck,
.extra-deck {
    height: 10%;
    display: flex;
}

.side-deck {
    background-color: green;
}

.extra-deck {
    background-color: red;
}

.main-deck-label-area,
.side-deck-label-area,
.extra-deck-label-area {
    width: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.main-deck-label-area {
    padding-bottom: 10px;
    width: 100%;
}

.main-deck-label,
.side-deck-label,
.extra-deck-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-weight: bold;
    font-size: clamp(16px, 1.5vw, 28px);
    color: white;
    cursor: default;
}

.main-deck-label {
    font-size: clamp(20px, 2vw, 32px);
}


.side-deck-area,
.extra-deck-area {
    position: relative;
    width: 100%;
    padding: .7rem .5rem;
}

/* .extra-deck .sortable-drag,
.side-deck .sortable-drag {
    opacity: 0;
} */

.center>div {
    margin-bottom: 5px;
}

.draggable {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
}

.draggable-deck {
    height: 100%;
}

.draggable-deck span {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    grid-template-rows: repeat(6, 1fr);
    height: 100%;
}

.draggable span {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    height: 100%;
    width: 100%;
}

.ghost {
    box-shadow: 5px 5px 5px -1px rgb(0, 0, 0);
}

/* .flip-list-move {
    transition: transform 1.5s;
} */

.deck,
.side-deck,
.extra-deck {
    position: relative;
}

.deck-background-grid {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    grid-template-rows: repeat(6, 1fr);
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    pointer-events: none;
}

.deck-background-grid_box {
    border: 1px solid blue;
}

.side-deck-background-grid,
.extra-deck-background-grid {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    position: absolute;
    pointer-events: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: .7rem .5rem;
}

.side-deck-background-grid_box {
    background: lightgreen;
    margin: 0 2px;
}

.extra-deck-background-grid_box {
    background: pink;
    margin: 0 2px;
}
</style>