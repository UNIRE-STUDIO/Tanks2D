
<script>
import type0img from "/sprites/tankNpc_Down.png";
import type1img from "/sprites/tankNpc1_Down.png";
  export default {
    props: {
        uiFields: {
            type: Object,
            required: true
        },
        config: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            type0: type0img,
            type1: type1img
        }
    },
    methods: {

    }
  }
</script>

<template>
    <div class="panel">
        <div id="countNpcTanks">
            <img v-for="(item, i) in this.uiFields.npc.slice().reverse()" :key="(item, i)" class="npcTanks" :style="{ width: config.grid + 'px', height: config.grid + 'px'}" :src="item == 0 ? type0 : type1" alt="">
        </div>
        <div id="health">
            <div class="playerHealth">
                <img :style="{ width: config.grid2 + 'px', height: config.grid2 + 'px'}" src="/sprites/tank_Up.png" alt="">
                <p class="lbl">{{ this.uiFields.playersHealth[0] }}</p>
            </div>
            <div class="playerHealth" v-if="this.uiFields.playersMode === 1">
                <img :style="{ width: config.grid2 + 'px', height: config.grid2 + 'px'}" src="/sprites/tank2_Up.png" alt="">
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
        gap: 8px;
    }
    #health
    {

    }
    .npcTanks{
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }
    .playerHealth {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
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
