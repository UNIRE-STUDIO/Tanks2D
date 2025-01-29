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

let game = new Game();

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
            gameLink: game,
            widthRightPart: 0
        }
    },
    mounted() {
        this.config = new Config(this.$refs.canvasMain, this.$refs.canvasBackground);
        if (window.innerWidth < 1500){
            this.config.grid = 16;
            this.config.updateParams();
            // this.config.scaleMultiplier = 0.75;
            // this.config.updateParams();
            // this.config.ctxMain.scale(0.75, 0.75);
        }
        this.widthRightPart = (this.config.grid * 3 - this.config.grid/2) + 'px';
        //console.log(this.widthRightPart);
        // Если прописать this.gameLink.init(this.config, this.uiFields) то реактивность this.uiFields.currentScreen не будет работать
        game.init(this.config, this.uiFields);
        this.canvasWidth = (this.config.viewSize.x * this.config.grid) + 'px';
        this.canvasHeight = (this.config.viewSize.y * this.config.grid) + 'px';
    },
    methods: {
        calc(){
        }
    }
}
</script>

<template>
    <div class="app">
        <div class="game">
            <div class="left-part">
                <div class="top-wrapper">
                    <MainScreen_Top v-if="uiFields.currentScreen === 0" />
                    <PlayScreen_Top v-if="uiFields.currentScreen === 1" :game="gameLink" />
                    <PauseScreen_Top v-if="uiFields.currentScreen === 2" :game="gameLink" />
                    <p id="current-level" v-if="uiFields.currentScreen !== 0">Уровень: {{ uiFields.currentLevel+1 }}</p>
                    <p id="version">v2.0</p>
                </div>
                <div class="canvas-wrapper">
                    <canvas ref="canvasBackground" class="myCanvas" id="canvasBackground"></canvas>
                    <canvas ref="canvasMain" class="myCanvas" id="canvasMain"></canvas>
                    <div class="content-center-wrapper">
                        <MainScreen     v-if="uiFields.currentScreen === 0" :game="gameLink" />
                        <PauseScreen    v-if="uiFields.currentScreen === 2" :game="gameLink" />
                        <GameOverScreen v-if="uiFields.currentScreen === 4" :game="gameLink" :uiFields="uiFields" />
                        <WinScreen v-if="uiFields.currentScreen === 3" :game="gameLink" :uiFields="uiFields"/>
                    </div>
                </div>
            </div>
            <div class="right-part">
                <PlayScreen_Right v-if="uiFields.currentScreen === 1 || uiFields.currentScreen === 2" :uiFields="uiFields" :config="config" />
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
    margin-bottom: 10px;
}

.game {
    display: flex;
    flex-direction: row;
    background-color: #161618;
    border-radius: 8px;
    padding: 15px;
}

.right-part {
    width: v-bind(widthRightPart);
    margin-left: 8px;
    border-color: dimgray;
    border-left: 2px;
}

.top-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    height: 40px;
    margin-bottom: 8px;
}

#current-level{
    color: aliceblue;
    grid-column-start: 2;
    grid-column-end: 3;
}

#version{
    grid-column-start: 3;
    grid-column-end: 4;
    text-align: right;
    align-self: flex-end;
    color: #404041;
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

.myCanvas {
    position: absolute;
    border-radius: 4px;
    image-rendering: pixelated;
}
</style>
