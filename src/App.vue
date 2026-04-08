<template>
    <div id="app">
        <card-view class="child" />
        <center class="child" />
        <search class="child" />
    </div>
</template>

<script>
import CardView from "./components/CardView";
import center from "./components/Center";
import search from "./components/Search";
export default {
    name: "App",
    components: {
        "card-view": CardView,
        center,
        search,
    },
};
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#app {
    margin: 0 auto;
    display: flex;
    aspect-ratio: 1.55 / 1;
    height: 100%;
    max-height: 100vh;
    min-width: 1000px;
    /* max-width: 100%; */
    max-width: min(2000px, 95%);
}

.child {
    margin: 5px;
}

.card {
    padding: 1px;
    overflow: hidden;
}

.card__img {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
