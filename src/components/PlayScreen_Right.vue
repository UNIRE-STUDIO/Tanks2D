
<script>
import type0img from "/sprites/tankNpc_down.png";
import type1img from "/sprites/tankNpc1_down.png";
import type2img from "/sprites/tankNpc2_down.png";
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
            tanksNpc: [type0img, type1img, type2img],
            fsize: this.config.grid * 0.6 + 'px'
        }
    },
    methods: {

    }
  }
</script>

<template>
    <div class="panel">
        <div id="wrapperCountNpcTanks" :style="{ height: config.grid * 10 + 8 * 10 + 'px'}">
            <div id="countNpcTanks">
                <img v-for="(item, i) in this.uiFields.npc.slice().reverse()" :key="(item, i)" class="npcTanks" :style="{ width: config.grid + 'px', height: config.grid + 'px'}" :src="tanksNpc[item]" alt="">
            </div>
        </div>
        <div id="health">
            <div class="playerStat">
                <div class="playerHealth">
                    <img :style="{ width: config.grid2 + 'px', height: config.grid2 + 'px'}" src="/sprites/tank_up.png" alt="">
                    <p class="lbl health-lbl" :style="{fontSize: fsize}">{{ this.uiFields.playersHealth[0] }}</p>
                </div>
                <p class="lbl score-lbl" :style="{fontSize: fsize}">{{  '★ ' + this.uiFields.getSumScore(0) }}</p>
            </div>
            
            <div class="playerStat" v-if="this.uiFields.playersMode === 1">
                <div class="playerHealth">
                   <img :style="{ width: config.grid2 + 'px', height: config.grid2 + 'px'}" src="/sprites/tank2_up.png" alt="">
                    <p class="lbl health-lbl" :style="{fontSize: fsize}">{{ this.uiFields.playersHealth[1] }}</p> 
                </div>
                <p class="lbl score-lbl" :style="{fontSize: fsize}">{{ '★ ' + this.uiFields.getSumScore(1) }}</p>
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
    #wrapperCountNpcTanks {
        background-color: #101011;
        border-radius: 5px;
        width: 100%;
    }
    #countNpcTanks{
        display: grid;
        grid-template-rows: repeat(7, 1fr);
        grid-template-columns: repeat(2, 1fr);
        align-items: start;
        justify-items: center;
        gap: 8px;
    }
    .health-lbl
    {
        color: #78f37a;
    }
    .npcTanks{
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }
    .playerStat {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;

        background-color: #101011;
        border-radius: 5px;
        padding-right: 4px;
        padding-top: 4px;

        margin-bottom: 10px;
    }
    .playerHealth {
        display: flex;
    }
    .score-lbl{
        color: #eeff56;
    }
    .lbl{
        font-weight: bold;
        margin: 0px;
    }

</style>
