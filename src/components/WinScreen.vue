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

    data() {
        return {
            scoreType0p0: this.uiFields.getScoreForType(0, 0), //[0][0] === [Тип танка][Игрок]
            scoreType1p0: this.uiFields.getScoreForType(1, 0),
            scoreType2p0: this.uiFields.getScoreForType(2, 0),

            scoreType0p1: this.uiFields.getScoreForType(0, 1),
            scoreType1p1: this.uiFields.getScoreForType(1, 1),
            scoreType2p1: this.uiFields.getScoreForType(2, 1),

            sumDestroyedP0: this.uiFields.getSumDestroyed(0),
            sumDestroyedP1: this.uiFields.getSumDestroyed(1),
        }
    }
}
</script>

<template>
    <div class="wrapper" >
        <div class="panel" @click="game.nextLevel()">
            <div class="stat">
                <div id="player1">
                    <p class="header" id="p1">Игрок 1</p>
                    <table>
                        <tr><th>Очки</th><th>Уничтожено</th><th>Тип</th></tr>
                        <tr>
                            <td :class="[uiFields.playersMode === 1 && scoreType0p1 <= scoreType0p0 ? 'best' : '']">{{scoreType0p0}}</td>
                            <td :class="[uiFields.playersMode === 1 && scoreType0p1 <= scoreType0p0 ? 'best' : '']">{{uiFields.numDestroyedTypes[0][0]}}</td>
                            <td><img src="/sprites/tankNpc_up.png" alt="" srcset=""></td>
                        </tr>
                        <tr>
                            <td :class="[uiFields.playersMode === 1 && scoreType1p1 <= scoreType1p0 ? 'best' : '']">{{scoreType1p0}}</td>
                            <td :class="[uiFields.playersMode === 1 && scoreType1p1 <= scoreType1p0 ? 'best' : '']">{{uiFields.numDestroyedTypes[1][0]}}</td>
                            <td><img src="/sprites/tankNpc1_up.png" alt="" srcset=""></td>
                        </tr>
                        <tr>
                            <td :class="[uiFields.playersMode === 1 && scoreType2p1 <= scoreType2p0 ? 'best' : '']">{{scoreType2p0}}</td>
                            <td :class="[uiFields.playersMode === 1 && scoreType2p1 <= scoreType2p0 ? 'best' : '']">{{uiFields.numDestroyedTypes[2][0]}}</td>
                            <td><img src="/sprites/tankNpc2_up.png" alt="" srcset=""></td>
                        </tr>
                        <tr><td colspan="3"><hr noshade="true" size="1"/></td></tr>
                        <tr>
                            <td class="sum" :class="[uiFields.playersMode === 1 && scoreType0p1 + scoreType1p1 <= scoreType0p0 + scoreType1p0 ? 'best' : '']">{{scoreType0p0 + scoreType1p0 + scoreType2p0}}</td>
                            <td :class="[uiFields.playersMode === 1 && sumDestroyedP1 <= sumDestroyedP0 ? 'best' : '']">{{sumDestroyedP0}}</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div id="player2" v-if="uiFields.playersMode === 1">
                    <p class="header" id="p2">Игрок 2</p>
                    <table>
                        <tr><th>Очки</th><th>Уничтожено</th><th>Тип</th></tr>
                        <tr>
                            <td :class="[uiFields.playersMode === 1 && scoreType0p0 <= scoreType0p1 ? 'best' : '']">{{scoreType0p1}}</td>
                            <td :class="[uiFields.playersMode === 1 && scoreType0p0 <= scoreType0p1 ? 'best' : '']">{{uiFields.numDestroyedTypes[0][1]}}</td>
                            <td><img src="/sprites/tankNpc_up.png" alt="" srcset=""></td>
                        </tr>
                        <tr>
                            <td :class="[uiFields.playersMode === 1 && scoreType1p0 <= scoreType1p1 ? 'best' : '']">{{scoreType1p1}}</td>
                            <td :class="[uiFields.playersMode === 1 && scoreType1p0 <= scoreType1p1 ? 'best' : '']">{{uiFields.numDestroyedTypes[1][1]}}</td>
                            <td><img src="/sprites/tankNpc1_up.png" alt="" srcset=""></td>
                        </tr>
                        <tr>
                            <td :class="[uiFields.playersMode === 1 && scoreType2p0 <= scoreType2p1 ? 'best' : '']">{{scoreType2p1}}</td>
                            <td :class="[uiFields.playersMode === 1 && scoreType2p0 <= scoreType2p1 ? 'best' : '']">{{uiFields.numDestroyedTypes[2][1]}}</td>
                            <td><img src="/sprites/tankNpc2_up.png" alt="" srcset=""></td>
                        </tr>
                        <tr><td colspan="3"><hr noshade="true" size="1"/></td></tr>
                        <tr>
                            <td class="sum" :class="[uiFields.playersMode === 1 && scoreType0p0 + scoreType1p0 <= scoreType0p1 + scoreType1p1 ? 'best' : '']">{{scoreType0p1 + scoreType1p1 + scoreType2p1}}</td>
                            <td :class="[uiFields.playersMode === 1 && sumDestroyedP0 <= sumDestroyedP1 ? 'best' : '']">{{sumDestroyedP1}}</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div id="button-wrapper">
                <button class="btn" type="button">СЛЕДУЮЩИЙ УРОВЕНЬ</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#p1{
    color: #18a8cc;
}

#p2{
    color: #ee644f;
}

.best{
    color: gold;
    font-weight: 900;
}

.sum{
    height: 30px;
}

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
    padding: 30px 30px;
    background-color: rgba(27, 27, 27, 0.89);
    border-radius: 8px;
}

.btn {
    margin-top: 20px;
    width: 165px;
}
</style>
