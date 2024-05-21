<script>
  export default {
    props: {
        startClick: {
            type: Function,
            required: true
        }
    },
  }
</script>

<template>
    <div class="panel">
        <button @click="startClick()">СТАРТ</button>
    </div>
</template>

<style scoped>
</style>
