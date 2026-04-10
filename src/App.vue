<template>
    <div id="container">
        <div id="main">
            <card-view class="child" />
            <center class="child" />
            <search class="child" />
        </div>
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

function checkScreenSize() {
    if (window.screen.width < 1000 || window.screen.height < 650) {
        alert("This app is best experienced on a larger screen.");
    }
}

// Run after load
setTimeout(checkScreenSize, 2000);
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: max(1000px, 100vw);
}

#main {
    display: flex;
    aspect-ratio: 1.55 / 1;
    min-height: 650px;
    min-width: 1000px;
    width: min(95vw, calc(100vh * 1.55));
    z-index: 999;
}

.child {
    margin: 5px;
}

.card__img {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
