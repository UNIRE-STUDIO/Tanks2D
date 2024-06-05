import { randomRange } from "./general.js";
import levels from "./levels.json";
import NpcTank from "./npcTank.js";
import Timer from "./timer.js";

export default class NpcPool
{
    constructor(config, bulletPool)
    {
        this.config = config;
        this.currentMap;
        this.currentLevel;

        const pool_size = 3;
        this.tanks = [];

        for (let i = 0; i < pool_size; i++) 
        {
            this.tanks[i] = new NpcTank(this.config, bulletPool);
        }
        this.cooldown = 2;
        this.timerSpawn = new Timer(this.cooldown, this.create.bind(this));
    }

    init(currentMap, currentLevel)
    {
        this.currentMap = currentMap;
        this.currentLevel = currentLevel;
        this.timerSpawn.start();
    }

    create()
    {
        for (let i = 0; i < this.tanks.length; i++) {
            if (!this.tanks[i].isUse)
            {
                let rand = randomRange(0, levels[this.currentLevel].spawnPoints.length);
                this.tanks[i].create(this.currentMap, {x: levels[this.currentLevel].spawnPoints[rand][0], 
                                                       y: levels[this.currentLevel].spawnPoints[rand][1]});
                this.timerSpawn.reset();
                this.timerSpawn.start();
                return;
            }
        }
        this.timerSpawn.reset();
    }

    setPause()
    {
        this.timerSpawn.stop();
    }
    setResume()
    {
        this.timerSpawn.start();
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