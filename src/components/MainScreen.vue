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
        <button class="btn" @click="game.changeScreen(1,1)">СТАРТ</button>
    </div>
</template>

<style scoped>

</style>
