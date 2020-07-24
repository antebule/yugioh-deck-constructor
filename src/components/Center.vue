<template>
    <div class="center">
        <div class="deck" @dragover.prevent @drop.prevent="deckDrop()">
            <draggable class="draggable-deck" ghost-class="ghost">
                <transition-group type="transition" name="flip-list">
                    <div
                        class="card sortable"
                        v-for="(card,index) in deck"
                        :key="index"
                        :id="index"
                        @mouseover="hover(card)"
                        @dragstart="mainDeckDragg($event, card)"
                        @dragend="mainDeckDraggEnd()"
                    >
                        <img
                            class="card__img"
                            :src="card.card_images[0].image_url_small"
                            alt="card"
                        />
                    </div>
                </transition-group>
            </draggable>
        </div>

        <p>Side deck</p>
        <div class="side-deck" @dragover.prevent @drop.prevent="sideDeckDrop()">
            <draggable class="draggable" ghost-class="ghost">
                <transition-group type="transition" name="flip-list">
                    <div
                        class="card sortable"
                        v-for="(card,index) in sideDeck"
                        :key="index"
                        :id="index"
                        @mouseover="hover(card)"
                        @dragstart="sideDeckDragg($event, card)"
                        @dragend="sideDeckDraggEnd()"
                    >
                        <img
                            class="card__img"
                            :src="card.card_images[0].image_url_small"
                            alt="card"
                        />
                    </div>
                </transition-group>
            </draggable>
        </div>

        <p>Extra deck</p>
        <div class="extra-deck" @dragover.prevent @drop.prevent="extraDeckDrop()">
            <draggable class="draggable" ghost-class="ghost">
                <transition-group type="transition" name="flip-list">
                    <div
                        class="card sortable"
                        v-for="(card,index) in extraDeck"
                        :key="index"
                        :id="index"
                        @mouseover="hover(card)"
                        @dragstart="extraDeckDragg($event, card)"
                        @dragend="extraDeckDraggEnd()"
                    >
                        <img
                            class="card__img"
                            :src="card.card_images[0].image_url_small"
                            alt="card"
                        />
                    </div>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
    components: {
        draggable,
    },
    data() {
        return {
            deck: [],
            sideDeck: [],
            extraDeck: [],
        };
    },
    computed: {
        dropout() {
            return this.$store.getters.dropout;
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
    flex-basis: 55%;
}

.deck {
    height: 71%;
    border: 2px solid yellow;
}

.side-deck {
    height: 10%;
    border: 2px solid green;
}

.extra-deck {
    height: 10%;
    border: 2px solid purple;
}

/* .extra-deck .sortable-drag,
.side-deck .sortable-drag {
    opacity: 0;
} */

.center > div {
    margin-bottom: 5px;
}

.draggable {
    padding: 0.5rem;
}

.draggable-deck {
    height: 100%;
}

.draggable-deck span {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    grid-template-rows: repeat(6, 16.6%);
    height: 100%;
}

.draggable span {
    display: grid;
    grid-template-columns: repeat(15, 6.66%);
}

.ghost {
    box-shadow: 5px 5px 5px -1px rgb(0, 0, 0);
}

/* .flip-list-move {
    transition: transform 1.5s;
} */

/* .deck {
    position: relative;
}

.background-grid {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    grid-template-rows: repeat(6, 16.6%);
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
}

.background-grid_box {
    border: 1px solid red;
} */
</style>