<script>
  export default {
    props: {
        uiFields: {
            type: Object,
            required: true
        }
    },
  }
</script>

<template>
    <div class="panel">
        <div id="countNpcTanks">
            <img v-for="n in this.uiFields.countReserveNpcTanks" :key="n" class="npcTanks" width="24px" height="24px" src="/sprites/TankNpc_Down.png" alt="">
        </div>
        <div id="health">
            <div class="playerHealth">
                <img width="24px" height="24px" src="/sprites/Tank_Up.png" alt="">
                <p class="lbl">{{ this.uiFields.playersHealth[0] }}</p>
            </div>
            <div class="playerHealth" v-if="this.uiFields.playersMode === 1">
                <img width="24px" height="24px" src="/sprites/Tank_Up.png" alt="">
                <p class="lbl">{{ this.uiFields.playersHealth[1] }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .panel {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
    }
    #countNpcTanks{
        width: 80px;

        display: grid;
        grid-template-rows: repeat(7, 30px);
        grid-template-columns: repeat(2, 1fr);
        align-items: start;
        justify-items: center;
        gap: 2px;
    }
    #health
    {

    }
    .playerHealth {
        display: flex;
        justify-content: center; 
        width: 100%;
        margin: 16px 0px;
    }
    .lbl{
        color: aliceblue;
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
    }

</style>
