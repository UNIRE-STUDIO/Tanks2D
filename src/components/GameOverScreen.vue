<script>
  export default {
    props: {
        game: {
            type: Object,
            required: true
        },
        uiFields: {
            type: Object,
            required: true
        }
    },
  }
</script>

<template>
    <div class="wrapper">
        <p class="lbl">Вы проиграли!</p>
        <div class="panel">
            <button class="btn" @click="game.changeScreen(0)">Меню</button>
            <button class="btn" @click="game.changeScreen(1,1,uiFields.playersMode)">Рестарт</button>
        </div>
    </div>
</template>

<style scoped>
    .wrapper{

    }
  .lbl {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
    color: aliceblue;
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
