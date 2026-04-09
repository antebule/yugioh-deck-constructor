<template>
    <div class="search" @dragover.prevent @drop.prevent="dropout()">
        <div class="filters">
            <h1 style="text-align: center;">SEARCH</h1>
            <div class="filter-group">
                <label for="name">Name:</label>
                <input type="text" name="name" v-model="name" />
            </div>
            <div class="filter-group">
                <label for="desc">Desc:</label>
                <input type="text" name="desc" v-model="desc" />
            </div>
            <div class="filter-group">
                <label for="card">Card:</label>
                <section style="display: flex; flex-grow: 1;">
                    <select name="card" id="card" v-model="card_type" @change="typeChangeed()">
                        <option value></option>
                        <option value="Monster">Monster</option>
                        <option value="Spell">Spell</option>
                        <option value="Trap">Trap</option>
                    </select>
                    <select name="monster_card" id="card" v-model="type" style="margin-left: 5px;"
                        :disabled="this.card_type !== 'Monster'">
                        <option value></option>
                        <option value="normal">Normal</option>
                        <option value="effect">Effect</option>
                        <option value="ritual">Ritual</option>
                        <option value="fusion">Fusion</option>
                        <option value="synchro">Synchro</option>
                        <option value="xyz">XYZ</option>
                        <option value="link">Link</option>
                        <option value="pendulum">Pendulum</option>
                    </select>
                </section>
            </div>
            <div class="filter-group">
                <label for="card">Type:</label>
                <select name="card" id="card" v-model="race" :disabled="this.card_type === ''">
                    <option value></option>
                    <optgroup v-if="this.card_type === 'Spell'">
                        <option value="normal">Normal</option>
                        <option value="continuous">Continuous</option>
                        <option value="equip">Equip</option>
                        <option value="quick-play">Quick-Play</option>
                        <option value="field">Field</option>
                        <option value="ritual">Ritual</option>
                    </optgroup>
                    <optgroup v-else-if="this.card_type === 'Trap'">
                        <option value="normal">Normal</option>
                        <option value="continuous">Continuous</option>
                        <option value="counter">Counter</option>
                    </optgroup>
                    <optgroup v-else-if="this.card_type === 'Monster'">
                        <option value="aqua">Aqua</option>
                        <option value="beast">Beast</option>
                        <option value="beast-warrior">Beast-Warrior</option>
                        <option value="cyberse">Cyberse</option>
                        <option value="dinosaur">Dinosaur</option>
                        <option value="Divine-Beast">Divine-Beast</option>
                        <option value="dragon">Dragon</option>
                        <option value="fairy">Fairy</option>
                        <option value="fiend">Fiend</option>
                        <option value="fish">Fish</option>
                        <option value="insect">Insect</option>
                        <option value="machine">Machine</option>
                        <option value="plant">Plant</option>
                        <option value="psychic">Psychic</option>
                        <option value="pyro">Pyro</option>
                        <option value="reptile">Reptile</option>
                        <option value="rock">Rock</option>
                        <option value="sea serpent">Sea-Serpent</option>
                        <option value="spellcaster">Spellcaster</option>
                        <option value="thunder">Thunder</option>
                        <option value="warrior">Warrior</option>
                        <option value="winged beast">Winged-Beast</option>
                        <option value="wyrm">Wyrm</option>
                        <option value="zombie">Zombie</option>
                    </optgroup>
                </select>
            </div>
            <div class="filter-group">
                <label for="attribute">Attribute:</label>
                <select name="attribute" id="attribute" v-model="attribute" :disabled="this.card_type !== 'Monster'">
                    <option value></option>
                    <option value="dark">Dark</option>
                    <option value="divine">Divine</option>
                    <option value="earth">Earth</option>
                    <option value="fire">Fire</option>
                    <option value="light">Light</option>
                    <option value="water">Water</option>
                    <option value="wind">Wind</option>
                </select>
            </div>
            <div class="filter-group atk-and-def">
                <div id="atk" class="filter-group">
                    <input type="text" v-model="lessThanAtk" style="max-width:30px"
                        :disabled="this.card_type !== 'Monster'" />
                    <label for="atk" class="atk">
                        <i class="fas fa-less-than-equal"></i>
                        <span>ATK</span>
                        <i class="fas fa-less-than-equal"></i>
                    </label>
                    <input type="text" v-model="greaterThanAtk" style="max-width:30px"
                        :disabled="this.card_type !== 'Monster'" />
                </div>
                <div id="def" class="filter-group">
                    <input type="text" v-model="lessThanDef" style="max-width:30px"
                        :disabled="this.card_type !== 'Monster'" />
                    <label for="def" class="def">
                        <i class="fas fa-less-than-equal"></i>
                        <span>DEF</span>
                        <i class="fas fa-less-than-equal"></i>
                    </label>
                    <input type="text" v-model="greaterThanDef" style="max-width:30px"
                        :disabled="this.card_type !== 'Monster'" />
                </div>
            </div>
            <div class="buttons">
                <button class="pagination" @click.prevent="previous()" :disabled="this.start === 0">
                    <i class="fas fa-caret-left"></i>
                </button>
                <div class="buttons__middle">
                    <button class="search-btn" @click.prevent="search()">Search</button>
                    <div class="result">{{ this.page }} / {{ this.results }}</div>
                </div>
                <button class="pagination" @click.prevent="next()"
                    :disabled="(this.searchedCards.length - this.start) < 20">
                    <i class="fas fa-caret-right"></i>
                </button>
            </div>
        </div>
        <div class="cards_area">
            <div class="cards">
                <Card v-for="(card, index) in cards" :key="index" :card="card" :showPoints="showPoints"
                    @dragstart="drag(card)" @dragend="dragEnd()" @hover="hover(card)" />
            </div>
            <div class="search-cards-background-grid">
                <div v-for="i in 20" :key="i" class="search-cards-background-grid_box"></div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Card from "./Card.vue";
export default {
    components: {
        Card
    },
    computed: {
        allCards() {
            return this.$store.getters.allCards;
        },
        cards() {
            let cards = [];
            if (
                this.searchedCards.length > 20 &&
                this.searchedCards.length - this.start >= 20
            ) {
                for (let i = this.start; i < this.start + 20; i++) {
                    cards.push(this.searchedCards[i]);
                }
            } else if (this.searchedCards.length - this.start < 20) {
                for (let i = this.start; i < this.searchedCards.length; i++) {
                    cards.push(this.searchedCards[i]);
                }
            } else {
                cards = [...this.searchedCards];
            }
            return cards;
        },
        results() {
            return Math.ceil(this.searchedCards.length / 20);
        },
        showPoints() {
            return this.$store.getters.showPoints;
        },
    },
    data() {
        return {
            searchedCards: [],
            start: 0,
            page: 1,
            name: "",
            desc: "",
            card_type: "",
            race: "",
            type: "",
            attribute: "",
            lessThanAtk: "",
            greaterThanAtk: "",
            lessThanDef: "",
            greaterThanDef: "",
        };
    },
    created() {
        this.getAllCards();
    },
    methods: {
        getAllCards() {
            axios
                .get("https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes&format=all")
                .then((res) => {
                    this.searchedCards = res.data.data;
                    this.$store.dispatch("allCards", res.data.data);
                });
            this.start = 0;
            this.page = 1;
        },
        drag(card) {
            this.$store.dispatch("draggedCard", card);
        },
        hover(card) {
            this.$store.dispatch("cardHover", card);
        },
        next() {
            this.start += 20;
            this.page += 1;
        },
        previous() {
            this.start -= 20;
            this.page -= 1;
        },
        search() {
            this.start = 0;
            this.page = 1;
            if (this.name.length || this.desc.length || this.card_type.length) {
                this.filterCards(this.card_type);
            } else {
                this.getAllCards();
            }
        },
        filterCards(cardType) {
            this.searchedCards = this.allCards.filter((card) => {
                return card.type.includes(cardType);
            });

            const filters = [];
            this.name.length ? filters.push("name") : 0;
            this.desc.length ? filters.push("desc") : 0;
            this.race.length ? filters.push("race") : 0;
            this.type.length ? filters.push("type") : 0;
            this.attribute.length ? filters.push("attribute") : 0;

            filters.forEach((filter) => {
                this.searchedCards = this.searchedCards.filter((card) => {
                    return card[filter]
                        .toLowerCase()
                        .includes(this[filter].toLowerCase());
                });
            });

            if (cardType === "Monster") {
                if (this.lessThanAtk.length) {
                    this.searchedCards = this.searchedCards.filter((card) => {
                        return parseInt(this.lessThanAtk) <= parseInt(card.atk);
                    });
                }

                if (this.greaterThanAtk.length) {
                    this.searchedCards = this.searchedCards.filter((card) => {
                        return (
                            parseInt(card.atk) <= parseInt(this.greaterThanAtk)
                        );
                    });
                }

                if (this.lessThanDef.length) {
                    this.searchedCards = this.searchedCards.filter((card) => {
                        return parseInt(this.lessThanDef) <= parseInt(card.def);
                    });
                }

                if (this.greaterThanDef.length) {
                    this.searchedCards = this.searchedCards.filter((card) => {
                        return (
                            parseInt(card.def) <= parseInt(this.greaterThanDef)
                        );
                    });
                }
            }
        },
        typeChangeed() {
            this.race = "";
            this.type = "";
            this.attribute = "";
        },
        dragEnd() {
            this.$store.dispatch("draggedCard", {});
            this.$store.dispatch("dropout", false);
        },
        dropout() {
            this.$store.dispatch("dropout", true);
        },
    },
};
</script>

<style scoped>
.search {
    width: 22%;
    background-color: yellow;
}

.filters {
    height: 38%;
}

.cards_area {
    height: 62%;
    padding: 2px;
    position: relative;
}

.cards {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    position: relative;
    z-index: 1;
}

.search-cards-background-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    position: absolute;
    pointer-events: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2px;
}

.search-cards-background-grid_box {
    background-color: lightyellow;
    margin: 2px;
}

label {
    font-weight: 700;
    font-size: 24px;
    flex-basis: 25%;
}

input {
    padding: 8px;
    box-sizing: content-box;
    flex-grow: 1;
}

select {
    padding: 8px;
    flex-grow: 1;
    /* border-radius: 5px; */
}

i {
    font-size: 60px;
}

.filter-group {
    display: flex;
    justify-content: space-between;
    padding: 0 0.3rem;
    align-items: center;
    margin: 4px;
}

.pagination {
    background: none;
    border: none;
    outline: none;
    padding: 0.5rem;
}

.buttons {
    display: flex;
    justify-content: center;
    text-align: center;
}

.buttons__middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 0.3rem;
}

.search-btn {
    padding: 0.5rem 2rem;
}

.result {
    font-size: 1.5rem;
    font-weight: 700;
}

.fa-less-than-equal,
.fa-greater-than-equal {
    font-size: 10px;
}

.atk,
.def {
    display: flex;
    align-items: center;
    margin: 0 5px;
}

#atk,
#def {
    margin: 0;
    padding: 0;
}


/* less than 1750px */
@media screen and (max-width: 1750px) {
    .filters {
        height: 40%;
    }

    .cards_area {
        height: 60%;
    }

    label {
        font-size: 20px;
    }

    input,
    select {
        padding: 5px;
    }

    .filter-group {
        margin: 2px;
    }

    .atk-and-def {
        flex-direction: column;
    }

    #atk {
        margin: 4px 0;
    }
}

/* less than 1300px */
@media screen and (max-width: 1300px) {
    h1 {
        font-size: 25px;
    }

    label {
        font-size: 14px;
    }

    input,
    select {
        padding: 2px;
    }

    #atk {
        margin: 2px 0;
    }

    .buttons {
        align-items: start;
        margin-top: 5px;
    }

    .pagination {
        padding: 0 0.2rem;
    }

    .search-btn {
        padding: 0.2rem 1.5rem;
    }

    .result {
        font-size: 1.3rem;
    }
}
</style>