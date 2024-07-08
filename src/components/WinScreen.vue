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
        },
    },
}
</script>

<template>
    <div class="wrapper">
        <div class="panel">
            <div class="stat">
                <div id="player1">
                    <p class="header">Игрок-1</p>
                    <table>
                        <tr><th>Очки</th><th>Уничтожено</th><th>Тип</th></tr>
                        <tr><td>{{this.uiFields.numDestroyedType0[0] * 100}}</td><td>{{this.uiFields.numDestroyedType0[0]}}</td><td><img src="/sprites/tankNpc_Up.png" alt="" srcset=""></td></tr>
                        <tr><td>{{this.uiFields.numDestroyedType1[0] * 150}}</td><td>{{this.uiFields.numDestroyedType1[0]}}</td><td><img src="/sprites/tankNpc1_Up.png" alt="" srcset=""></td></tr>
                        <tr><td>{{this.uiFields.numDestroyedType1[0] * 150 + this.uiFields.numDestroyedType0[0] * 100}}</td><td>{{this.uiFields.numDestroyedType1[0] + this.uiFields.numDestroyedType0[0]}}</td><td></td></tr>
                    </table>
                </div>
                <div id="player2">
                    <p class="header">Игрок-2</p>
                    <table>
                        <tr><th>Очки</th><th>Уничтожено</th><th>Тип</th></tr>
                        <tr><td>{{this.uiFields.numDestroyedType0[1] * 100}}</td><td>{{this.uiFields.numDestroyedType0[1]}}</td><td><img src="/sprites/tankNpc_Up.png" alt="" srcset=""></td></tr>
                        <tr><td>{{this.uiFields.numDestroyedType1[1] * 150}}</td><td>{{this.uiFields.numDestroyedType1[1]}}</td><td><img src="/sprites/tankNpc1_Up.png" alt="" srcset=""></td></tr>
                        <tr><td>{{this.uiFields.numDestroyedType1[1] * 150 + this.uiFields.numDestroyedType0[1] * 100}}</td><td>{{this.uiFields.numDestroyedType1[1] + this.uiFields.numDestroyedType0[1]}}</td><td></td></tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.header{
    color: aliceblue;
    font-size: 30px;
    margin-bottom: 20px;
}

table{
    color: aliceblue;
    width: 250px;
    height: 150px;
    margin: 5px 25px;
}

.stat{
    display: flex;
    justify-content: space-between;
}

.wrapper {

}

.fields {
    color: aliceblue;
    font-size: 20px;
    font-weight: bold;
}

.panel {
    display: flex;
    padding: 30px 30px;
    background-color: rgba(27, 27, 27, 0.808);
    border-radius: 8px;
}

.btn {
    width: 165px;
}
</style>
