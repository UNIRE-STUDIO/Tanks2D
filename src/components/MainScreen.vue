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
    <div class="panel">
        <button class="btn" @click="game.changeScreen(1,1,0)">ОДИН ИГРОК</button>
        <button class="btn" @click="game.changeScreen(1,1,1)">ДВА ИГРОКА</button>
    </div>
</template>

<style scoped>
  .btn{
    margin: 10px;
  }
  .panel{
    display: flex;
    flex-direction: column;
  }
</style>
