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
        <div class="panel">
            <p class="fields">Очки: {{ 1024 }}</p>
        </div>
    </div>
</template>

<style scoped>
.wrapper {

}

.fields {
    color: aliceblue;
    font-size: 20px;
    font-weight: bold;
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
