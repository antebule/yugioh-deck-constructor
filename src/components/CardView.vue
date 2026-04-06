<template>
    <div class="cardview" @dragover.prevent @drop.prevent="dropout()">
        <div class="card-info">
            <div class="card-image">
                <img v-if="card.id" class="card__img" :src="card.card_images[0].image_url" alt="card" />
                <img v-else alt="Card Image" />
            </div>
            <div class="card-description">{{ card.desc }}</div>
        </div>
        <div class="options">
            <section>
                <input type="text" placeholder="Deck name" class="deck-name" v-model="deckName">
                <button class="option" @click="clearDeck" :disabled="isEmpty">Clear Deck</button>
            </section>
            <section>
                <button class="option" @click="exportDeck" :disabled="isEmpty">Export Deck</button>
                <button class="option" @click="importDeckDialog">Import Deck</button>
            </section>
        </div>
    </div>
</template>

<script>
import { uploadDeckFile, importDeckFile } from '../utils/io/import';
import { toYdkFile, downloadFile } from '../utils/io/export';
export default {
    name: "CardView",
    data() {
        return {
            deckName: ''
        };
    },
    computed: {
        card() {
            return this.$store.getters.hoveredCard;
        },
        isEmpty() {
            return this.$store.getters.mainDeck.length == 0
                && this.$store.getters.sideDeck.length == 0
                && this.$store.getters.extraDeck.length == 0;
        }
    },
    methods: {
        dropout() {
            this.$store.dispatch("dropout", true);
        },
        clearDeck() {
            const confirmed = confirm("Are you sure you want to clear all cards from the deck?");
            if (confirmed) {
                this.$store.dispatch("setMainDeck", []);
                this.$store.dispatch("setSideDeck", []);
                this.$store.dispatch("setExtraDeck", []);
            }
        },
        exportDeck() {
            const fileName = `${this.deckName || "Unnamed"}.ydk`;
            const deck = {
                name: fileName,
                main: this.$store.getters.mainDeck,
                side: this.$store.getters.sideDeck,
                extra: this.$store.getters.extraDeck,
            }
            const file = toYdkFile(deck);
            downloadFile(file, document);
        },
        importDeckDialog() {
            uploadDeckFile(document, this.importDeck);
        },
        async importDeck(files) {
            if (files != null && files.length > 0) {
                const allCards = this.$store.getters.allCards;
                const result = await importDeckFile(files[0], allCards);

                const missingCards = result?.missing;
                if (missingCards?.length) {
                    alert(`${missingCards.length} cards could not be imported!`);
                    console.error("missing cards: ", missingCards.join("\n"));
                }
                const mainDeck = result?.deck?.parts["#main"];
                const sideDeck = result?.deck?.parts["!side"];
                const extraDeck = result?.deck?.parts["#extra"];
                if (mainDeck.length || sideDeck.length || extraDeck.length) {
                    this.$store.dispatch("setMainDeck", mainDeck);
                    this.$store.dispatch("setSideDeck", sideDeck);
                    this.$store.dispatch("setExtraDeck", extraDeck);
                    setTimeout(() => alert(`Successfully imported deck file.`), 1000);
                }
            }
        }
    },
};
</script>

<style scoped>
.cardview {
    flex-basis: 22%;
    background: white;
}

.card-info {
    height: 70%;
    border: 2px solid blue;
}

.options {
    height: 30%;
    padding: 5px;
}

section {
    text-align: center;
    margin-top: 5px;
}

.option {
    padding: 0.5rem;
    width: 48%;
}

.option+.option {
    margin-left: 5px;
}

.deck-name {
    padding: 8px;
    width: 48%;
    box-sizing: border-box;
    margin-right: 5px;
}

.card-image {
    height: 65%;
}

.card-description {
    padding: 0.5rem;
    height: 32%;
    overflow: scroll;
}
</style>
