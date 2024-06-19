<script>
import Game from "./scripts/game.js";
import Config from "./scripts/config.js";
import UIFields from "./scripts/uiFields.js";
import MainScreen from "./components/MainScreen.vue";
import MainScreen_Top from "./components/MainScreen_Top.vue";
import PlayScreen_Top from "./components/PlayScreen_Top.vue";
import PauseScreen from "./components/PauseScreen.vue";
import PauseScreen_Top from "./components/PauseScreen_Top.vue";
import GameOverScreen from "./components/GameOverScreen.vue";
import PlayScreen_Right from "./components/PlayScreen_Right.vue";
import WinScreen from "./components/WinScreen.vue";

export default {
    components: {
        MainScreen,
        MainScreen_Top,
        PlayScreen_Top,
        PlayScreen_Right,
        PauseScreen,
        PauseScreen_Top,
        GameOverScreen,
        WinScreen
    },
    data() {
        return {
            canvasWidth: '',
            canvasHeight: '',
            config: null,
            uiFields: new UIFields(),
            game: new Game(),
        }
    },
    mounted() {
        this.config = new Config(this.$refs.myCanvas);
        this.game.init(this.config, this.uiFields);
        this.canvasWidth = (this.config.viewSize.x * this.config.grid) + 'px';
        this.canvasHeight = (this.config.viewSize.y * this.config.grid) + 'px';
    },
    methods: {
    }
}
</script>

<template>
    <div class="app">
        <h1 class="h1">TANKS 2D</h1>
        <div class="game">
            <div class="left-part">
                <div class="top-wrapper">
                    <MainScreen_Top v-if="game.currentScreen === 0" />
                    <PlayScreen_Top v-if="game.currentScreen === 1" :game="game" />
                    <PauseScreen_Top v-if="game.currentScreen === 2" :game="game" />
                    <p id="current-level" v-if="game.currentScreen !== 0">Уровень: {{ uiFields.currentLevel }}</p>
                </div>
                <div class="canvas-wrapper">
                    <canvas ref="myCanvas" id="myCanvas"></canvas>
                    <div class="content-center-wrapper">
                        <MainScreen v-if="game.currentScreen === 0" :game="game" />
                        <PauseScreen v-if="game.currentScreen === 2" :game="game" />
                        <GameOverScreen v-if="game.currentScreen === 4" :game="game" />
                        <WinScreen v-if="game.currentScreen === 3" :game="game" />
                    </div>
                </div>
            </div>
            <div class="right-part">
                <PlayScreen_Right v-if="game.currentScreen === 1 || game.currentScreen === 2" :uiFields="uiFields" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.app {
    font-family: Helvetica, sans-serif;
    text-align: center;
}

.h1 {
    margin-bottom: 20px;
}

.game {
    display: flex;
    flex-direction: row;
    background-color: #161618;
    border-radius: 8px;
    padding: 20px;
}

.right-part {
    width: 100px;
    border-color: dimgray;
    border-left: 2px;
}

.top-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    height: 50px;
    margin-bottom: 10px;
}

#current-level{
    color: aliceblue;
}

.canvas-wrapper {
    display: flex;
}

.content-center-wrapper {
    width: v-bind(canvasWidth);
    height: v-bind(canvasHeight);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

#myCanvas {
    position: absolute;
    background-color: #2d2d2d;
    border-radius: 4px;
}
</style>
