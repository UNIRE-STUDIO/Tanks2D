<script>
  export default {
    props: {
        game: {
            type: Object,
            required: true
        }
    },

    data() {
        return{
            playerHealth1: 0,
            countNpc: 0
        }
    },

    methods: {
    },

    mounted(){
        this.playerHealth1 = this.game.levelManager.playerHealth1;
        this.game.levelManager.updateHealth = () => {this.playerHealth1 = this.game.levelManager.playerHealth1}; // Иначе не обновляется
        this.game.levelManager.npcPool.updateCountReserveNpcTanks = () => {this.countNpc = this.game.levelManager.npcPool.countReserveNpcTanks};
    },
  }
</script>

<template>
    <div class="panel">
        <div id="countNpcTanks">
            <img v-for="n in countNpc" class="npcTanks" width="24px" height="24px" src="/Tanks2D/sprites/TankNpc_Down.png" alt="">
        </div>
        <div id="playerHealth1">
            <img width="24px" height="24px" src="/Tanks2D/sprites/Tank_Up.png" alt="">
            <p class="lbl">{{ this.playerHealth1 }}</p>
        </div>
    </div>
</template>

<style scoped>
    .panel {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #countNpcTanks{
        width: 80px;
        height: 400px;

        display: grid;
        grid-template-rows: repeat(7, 30px);
        grid-template-columns: repeat(2, 1fr);
        align-items: start;
        justify-items: center;
        gap: 2px;
    }
    
    #playerHealth1 {
        display: flex;
        justify-content: center; 
        width: 100%;
    }
    .lbl{
        color: aliceblue;
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
    }

</style>
