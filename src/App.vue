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
}
#app {
    box-sizing: border-box;
    width: 80%;
    margin: 0 auto;
    display: flex;
    height: 100vh;
    min-width: 1200px;
    min-height: 670px;
}

.child {
    margin: 5px;
}

.card {
    padding: 1px;
}

.card__img {
    width: 100%;
    height: 100%;
}
</style>
