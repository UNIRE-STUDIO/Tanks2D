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
        <button class="btn-mini" @click="game.changeScreen(2)">❚❚</button>
    </div>
</template>

<style scoped>
  .panel{
        display: flex;
    }
</style>
