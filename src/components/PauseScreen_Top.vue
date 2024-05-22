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
        <button class="btn-mini" @click="game.changeScreen(-1)">
            <svg width="35" height="50" viewBox="4 0 50 50" fill="161618" xmlns="http://www.w3.org/2000/svg">
                <path d="M35 50L11 25L35 0L40 4L20 25L40 45L35 50Z"/>
            </svg>
        </button>
    </div>
</template>

<style scoped>
  .panel{
        display: flex;
    }
</style>
