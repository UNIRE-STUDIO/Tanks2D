<script>
  import Game from "./scripts/game.js";
  import Config from "./scripts/config.js";
  import MainMenu from "./components/MainMenu.vue";
  export default{
    components: {
        MainMenu
    },
    data(){
      return{
        canvasWidth: '',
        canvasHeight: '',
        config: null,
        game: null,
      }
    },
    beforeMount(){
      this.game = new Game();
    },
    mounted(){
      this.config = new Config(this.$refs.myCanvas);
      this.game.init(this.config);
      this.canvasWidth = (this.config.viewSize.x * this.config.grid) + 'px';
      this.canvasHeight = (this.config.viewSize.y * this.config.grid) + 'px';
    },
    methods: {
      startGame(){
        this.game.startGame();
      }
    } 
  }
</script>

<template>
  <div class="app">
    <h1 class="h1">TANKS 2D</h1>
    <div class="canvas-wrapper">
      <canvas ref="myCanvas" id="myCanvas"></canvas>
      <div class="content-center-wrapper">
        <MainMenu v-if="this.game.currentScreen == 0" :startClick="startGame"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .app {
    font-family: Helvetica, sans-serif;
    text-align: center;
    margin-top: 40px;
  }
  .canvas-wrapper{
    display: flex;
    justify-content: center;
  }
  .content-center-wrapper{
    width: v-bind(canvasWidth);
    height: v-bind(canvasHeight);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #myCanvas {
    background-color: rgb(167, 167, 167);
    position: absolute;
  }

</style>
