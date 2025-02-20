import BulletPool from "./bulletPool.js";
import { drawSliceImage, getPosOnSliceImage } from "./general.js";
//import SaveManager from "./saveManager.js";
import levels from "./levels.json";
import NpcPool from "./npcPool.js";
import PlayerTank from "./playerTank.js";
import BangPool from "./bangPool.js";

export let Tiles = {background: 0, brick: 1, block: 2, water: 3, cover: 4, base: 9};

export default class LevelManager
{
    constructor(input, config, uiFields)
    {
        this.uiFields = uiFields;

        this.timeUpdate = 0;
        this.uiFields.playersHealth[0] = 3;
        this.uiFields.playersHealth[1] = 3;
        this.isPause = false;
        this.isPlay = false; // Для того что-бы коректно ставить на паузу до появления игроков

        // Присваивает класс Game
        this.gameOverEvent;
        this.winEvent;
        this.saveManager;

        this.currentMap = null;
        
        this.config = config;

        this.tilesBackgroundPos = [getPosOnSliceImage(3,1,16), getPosOnSliceImage(2,1,16), getPosOnSliceImage(3,0,16), getPosOnSliceImage(2,0,16)];
                            // - Кирпич                   - Блок                           - Маскировка                - База
        this.tilesPos = [getPosOnSliceImage(0,0,16), getPosOnSliceImage(1,0,16), getPosOnSliceImage(4,0,16), getPosOnSliceImage(0,9,32)];

        this.bangBulletPool = new BangPool(this.config, this.config.grid);
        this.bangTankPool = new BangPool(this.config, this.config.grid2, 32, [getPosOnSliceImage(1,9,32), getPosOnSliceImage(2,9,32), getPosOnSliceImage(3,9,32), getPosOnSliceImage(4,9,32), getPosOnSliceImage(5,9,32)]);
        this.bulletPool = new BulletPool(this.config, this.removeTile.bind(this), this.destructionOfTheBase.bind(this), this.bangBulletPool.create.bind(this.bangBulletPool), this.uiFields);
        this.players = [];
        this.players[0] = new PlayerTank(this.config, this.bulletPool.create.bind(this.bulletPool), this.playerDead.bind(this), this.bangTankPool.create.bind(this.bangTankPool), 0);
        this.players[1] = new PlayerTank(this.config, this.bulletPool.create.bind(this.bulletPool), this.playerDead.bind(this), this.bangTankPool.create.bind(this.bangTankPool), 1);
        this.npcPool = new NpcPool(this.config, this.bulletPool.create.bind(this.bulletPool), this.players, this.win.bind(this), this.bangTankPool.create.bind(this.bangTankPool), uiFields);

        this.players[0].otherTanks.push(...this.npcPool.tanks);
        this.players[1].otherTanks.push(...this.npcPool.tanks);
        this.players[0].otherTanks.push(this.players[1]);
        this.players[1].otherTanks.push(this.players[0]);
        
        this.bulletPool.setListNpcTanks(this.npcPool.tanks);
        this.bulletPool.setListPlayers([this.players[0]]);
        this.bulletPool.setListPlayers([this.players[1]]);

        input.movePlayer1Event = this.players[0].setDirection.bind(this.players[0]);
        input.shootPlayer1Event = this.players[0].shoot.bind(this.players[0]);

        input.movePlayer2Event = this.players[1].setDirection.bind(this.players[1]);
        input.shootPlayer2Event = this.players[1].shoot.bind(this.players[1]);

        this.durationWaterAnim = 2000; // ms
        this.timeCounterWaterAnim = 0;
        this.waterFrames = [getPosOnSliceImage(5,0,16), getPosOnSliceImage(6,0,16), getPosOnSliceImage(7,0,16), getPosOnSliceImage(8,0,16), getPosOnSliceImage(7,0,16), getPosOnSliceImage(6,0,16)];

        this.timerStart;
    }

    start(playersMode = 0)
    {
        this.uiFields.playersMode = playersMode;
        this.uiFields.reset();
        this.reset();
        this.currentMap = [];

        // canvas background
        this.config.ctxBackground.clearRect(0, 0, this.config.canvasMain.width, this.config.canvasMain.height);

        // Поскольку Object.assign делает только поверхностную копию мы присваиваем каждую полосу отдельно
        for (let i = 0; i < levels[this.uiFields.currentLevel].map.length; i++) {
            this.currentMap.push(levels[this.uiFields.currentLevel].map[i].slice());
            for (let j = 0; j < levels[this.uiFields.currentLevel].map[i].length; j++) 
            {
                //let tile = levels[this.uiFields.currentLevel].map[i][j];
                let tPos = this.tilesBackgroundPos[j%2+(i%2 * 2)];
                // if (tile === 3)
                // {
                //     tPos = this.tilesPos[2];
                // }
                drawSliceImage(this.config.ctxBackground, this.config.atlas, {x:j * this.config.grid, y:i * this.config.grid}, {x:this.config.grid, y:this.config.grid}, tPos, {x:16,y:16});
            }
        }

        let basePos = {x: levels[this.uiFields.currentLevel].basePos.x * this.config.grid, y:levels[this.uiFields.currentLevel].basePos.y * this.config.grid};
        drawSliceImage(this.config.ctxBackground, this.config.atlas, basePos, {x:this.config.grid2, y:this.config.grid2}, this.tilesPos[3], {x:this.config.atlasGrid*2, y:this.config.atlasGrid*2});
        
        this.timerStart = setTimeout(() => {        
            this.delayedSpawn();
        }, 1000);
    }

    delayedSpawn()
    {
        let base = {
            x: levels[this.uiFields.currentLevel].basePos.x * this.config.grid, 
            y: levels[this.uiFields.currentLevel].basePos.y * this.config.grid
        };
        this.bulletPool.init(this.currentMap, base);
        this.isPause = false;
        this.players[0].create(this.currentMap, levels[this.uiFields.currentLevel].playerSpawnsPos[0]);
        //this.players[0].setOtherCollisionObject(base);
        this.players[0].isPause = false;
        if (this.uiFields.playersMode === 1)
        {
            this.players[1].create(this.currentMap, levels[this.uiFields.currentLevel].playerSpawnsPos[1]);
            //this.players[1].setOtherCollisionObject(base);
            this.players[1].isPause = false;
        }
        this.npcPool.init(this.currentMap, this.uiFields.currentLevel, base);
        this.isPlay = true; // Для того что-бы коректно ставить на паузу до появления игроков
    }

    removeTile(posX, posY)
    {
        this.currentMap[posY][posX] = 0;
    }
    
    setPause()
    {
        this.isPause = true;
        if (!this.isPlay)
        {
            clearTimeout(this.timerStart);
            return;
        }
        this.players[0].setPause();
        if (this.uiFields.playersMode === 1) this.players[1].setPause();
        this.npcPool.setPause();
    }

    setResume()
    {
        this.isPause = false;
        if (!this.isPlay)
        {
            this.delayedSpawn();
            return;
        }
        this.players[0].isPause = false;
        if (this.uiFields.playersMode === 1) this.players[1].isPause = false;
        this.npcPool.setResume();
    }

    gameOver()
    {   
        this.setPause();
        this.gameOverEvent();
    }

    win()
    {
        this.setPause();
        this.winEvent();
    }

    reset()
    {
        this.config.ctxBackground.clearRect(0, 0, this.config.canvasMain.width, this.config.canvasMain.height);
        this.uiFields.npc = levels[this.uiFields.currentLevel].npc.slice();
        this.players[0].setReset();
        if (this.uiFields.playersMode === 1){
            this.players[1].setReset();
            this.uiFields.playersHealth[1] = 3;
        } 
        this.npcPool.setReset();
        this.bulletPool.setReset();
        this.bangBulletPool.setReset();
        this.bangTankPool.setReset();
        this.uiFields.playersHealth[0] = 3;
    }

    // Принимаем от танка игрока
    playerDead(playerId)
    {
        this.uiFields.playersHealth[playerId]--;
        if (this.uiFields.playersHealth[0] === 0 
            && (this.uiFields.playersHealth[1] === 0 || this.uiFields.playersMode === 0))
        {
            this.gameOver();
            return;
        }
        if (this.uiFields.playersHealth[playerId] === 0) return;
        setTimeout(() => 
        {
            this.players[playerId].create(this.currentMap, levels[this.uiFields.currentLevel].playerSpawnsPos[playerId]);
        }, 2000);
    }
    
    nextLevel()
    {
        this.uiFields.currentLevel = this.uiFields.currentLevel >= levels.length-1 ? this.uiFields.currentLevel = 0 : this.uiFields.currentLevel+1;
    }

    destructionOfTheBase()
    {
        let basePos = {x: levels[this.uiFields.currentLevel].basePos.x * this.config.grid + this.config.grid2/2, y:levels[this.uiFields.currentLevel].basePos.y * this.config.grid + this.config.grid2/2};
        this.bangTankPool.create(basePos);
        setTimeout(() => { // Уничтожение с задержкой
            this.gameOver();
        }, 200);
    }

    update(lag)
    {
        if (this.isPause) return;
        this.players[0].update(lag);
        if (this.uiFields.playersMode === 1) this.players[1].update(lag);
        this.bulletPool.update(lag);
        this.npcPool.update(lag);
        this.bangBulletPool.update(lag);
        this.bangTankPool.update(lag);

        this.timeCounterWaterAnim += lag;
        if (this.timeCounterWaterAnim >= this.durationWaterAnim) this.timeCounterWaterAnim = 0;
    }

    render()
    {
        let tPos;
        let coversPos = [];
        this.players[0].render();
        if (this.uiFields.playersMode === 1) this.players[1].render();
        this.npcPool.render();

        for (let i = 0; i < this.config.viewSize.y; i++) {
            for (let j = 0; j < this.config.viewSize.x; j++)
            {
                let tile = this.currentMap[i][j];

                if (tile === Tiles.background || tile === Tiles.base){ continue; }
                else if (tile === Tiles.cover) 
                {
                    coversPos.push({x:j * this.config.grid, y:i * this.config.grid});
                    continue;
                }
                else if (tile === Tiles.water) 
                {
                    tPos = this.waterFrames[Math.floor(this.timeCounterWaterAnim/(this.durationWaterAnim/this.waterFrames.length))];
                }
                else
                {
                    tPos = this.tilesPos[this.currentMap[i][j]-1];
                }
                drawSliceImage(this.config.ctxMain, this.config.atlas, {x:j * this.config.grid, y:i * this.config.grid}, {x:this.config.grid, y:this.config.grid}, tPos, {x:16,y:16});
            }
        }
        this.bulletPool.render();
        this.bangBulletPool.render();
        this.bangTankPool.render();

        for (let i = 0; i < coversPos.length; i++) 
        {
            drawSliceImage(this.config.ctxMain, this.config.atlas, {x:coversPos[i].x, y:coversPos[i].y}, {x:this.config.grid, y:this.config.grid}, this.tilesPos[2], {x:this.config.atlasGrid, y:this.config.atlasGrid});
        }
    }
}