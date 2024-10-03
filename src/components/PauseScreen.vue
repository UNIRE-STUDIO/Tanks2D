<script>
  export default {
    props: {
        game: {
            type: Object,
            required: true
        }
    },
  }
</script>

<template>
  <div class="wrapper">
      <p class="lbl">ПАУЗА</p>
      <div class="panel">
          <button class="btn" @click="game.changeScreen(0)">Меню</button>
          <button class="btn" @click="game.changeScreen(1,2)">Продолжить</button>
      </div>
  </div>
</template>

<style scoped>
    .wrapper{

    }
  .panel {
    display: flex;
    justify-content: space-between;
    padding: 30px 30px;
    background-color: rgba(27, 27, 27, 0.808);
    border-radius: 8px;
    width: 340px;
  }

  .btn {
    width: 165px;
  }
</style>
