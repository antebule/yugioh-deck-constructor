<template>
    <div class="cardview" @dragover.prevent @drop.prevent="dropout()">
        <div class="card-info">
            <div class="card-image">
                <img
                    v-if="card.id"
                    class="card__img"
                    :src="card.card_images[0].image_url"
                    alt="card"
                />
                <img v-else alt="Card Image" />
            </div>
            <div class="card-description">{{ card.desc }}</div>
        </div>
        <div class="options">
            <section>
                <button class="option">New Deck</button>
                <button class="option">Rename Deck</button>
            </section>
            <section>
                <button class="option">Save Deck</button>
                <button class="option">Delete Deck</button>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: "CardView",
    computed: {
        card() {
            return this.$store.getters.hoveredCard;
        },
    },
    methods: {
        dropout() {
            this.$store.dispatch("dropout", true);
        },
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
    background: transparent;
    border: 2px solid black;
    border-radius: 50px;
}

.option + .option {
    margin-left: 5px;
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
