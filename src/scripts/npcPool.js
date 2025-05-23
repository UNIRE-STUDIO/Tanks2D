
import { randomRange } from "./general.js";
import levels from "./levels.json";
import NpcTank from "./npcTank.js";
import Timer from "./timer.js";

export default class NpcPool
{
    constructor(config, bulletPool, players, winEvent, bangCreateEvent, uiFields)
    {
        this.config = config;
        this.currentMap;
        this.currentLevel;
        this.uiFields = uiFields;
        this.uiFields.countReserveNpcTanks = 0;
        this.countNpcTanks = 0;

        const pool_size = 5;
        this.tanks = [];

        for (let i = 0; i < pool_size; i++) 
        {
            this.tanks[i] = new NpcTank(this.config, bulletPool, players, this.deadNpcEvent.bind(this), bangCreateEvent, i);
        }
        for (let i = 0; i < pool_size; i++) 
        {
            this.tanks[i].otherTanks.push(...this.tanks);
            this.tanks[i].otherTanks.splice(i,1);
        }
        this.cooldown = 2;
        this.timerSpawn = new Timer(this.cooldown, this.create.bind(this));

        this.basePos;

        this.winEvent = winEvent;
    }

    init(currentMap, currentLevel, basePos)
    {
        this.currentMap = currentMap;
        this.currentLevel = currentLevel;
        this.basePos = basePos;
        this.uiFields.countReserveNpcTanks = levels[currentLevel].npc.length;
        this.countNpcTanks = levels[currentLevel].npc.length;
        this.timerSpawn.reset();
        this.timerSpawn.start();
    }

    setOtherCollisionObject(obj)
    {
        for (let i = 0; i < this.tanks.length; i++) 
        {
            this.tanks[i].setOtherCollisionObject(obj);
        }
    }

    create()
    {
        if (this.uiFields.countReserveNpcTanks === 0)
        {
            this.timerSpawn.stop();
            this.timerSpawn.reset();
            return;
        }
        for (let i = 0; i < this.tanks.length; i++) {
            if (!this.tanks[i].isUse)
            {
                let rand = randomRange(0, levels[this.currentLevel].spawnPoints.length);
                this.tanks[i].create(this.currentMap, 
                                    {x: levels[this.currentLevel].spawnPoints[rand][0], y: levels[this.currentLevel].spawnPoints[rand][1]},
                                    this.basePos,
                                    this.uiFields.playersMode,
                                    this.uiFields.npc[0]);
                
                this.uiFields.countReserveNpcTanks--;
                this.uiFields.npc.splice(0,1);
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
        for (let i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].isUse)
            {
                this.tanks[i].setPause();
            }
        }
    }
    setResume()
    {
        this.timerSpawn.start();
        for (let i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].isUse)
            {
                this.tanks[i].setResume();
            }
        }
    }

    setReset()
    {
        this.timerSpawn.stop();
        this.timerSpawn.reset();
        for (let i = 0; i < this.tanks.length; i++) {
            this.tanks[i].isUse = false;
            this.tanks[i].setReset();
        }
    }

    deadNpcEvent()
    {
        this.countNpcTanks--
        if (this.countNpcTanks === 0)
        {
            this.winEvent();
        }
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