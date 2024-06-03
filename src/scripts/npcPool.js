import { randomRange } from "./general.js";
import levels from "./levels.json";
import NpcTank from "./npcTank.js";

export default class NpcPool
{
    constructor(config, bulletPool)
    {
        this.config = config;
        this.currentMap;

        const pool_size = 6;
        this.tanks = [];

        for (let i = 0; i < pool_size; i++) 
        {
            this.tanks[i] = new NpcTank(this.config, bulletPool);
        }
    }

    init(currentMap)
    {
        this.currentMap = currentMap;

        setTimeout(() => {        
            this.spawnLoop();
        }, 2000);
    }

    start()

    spawnLoop()
    {
        this.create();
        setTimeout(() => {        
            this.spawnLoop();
        }, 5000);
    }

    create()
    {
        for (let i = 0; i < this.tanks.length; i++) {
            if (!this.tanks[i].isUse)
            {
                let rand = randomRange(0, levels.spawnPoints.length);
                this.tanks[i].init(this.currentMap, {x: levels.spawnPoints[rand][0], 
                                                     y: levels.spawnPoints[rand][1]});
                return true;
            }
        }
        console.log("NpcPool переполнен");
        return false;
    }

    update(lag)
    {
        for (let i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].isUse)
            {
                this.tanks[i].update(lag);
            }
        }
    }

    render()
    {
        for (let i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].isUse)
            {
                this.tanks[i].render();
            }
        }
    }
}