import BulletPool from "./bulletPool.js";
import { drawImage } from "./general.js";
//import SaveManager from "./saveManager.js";
import levels from "./levels.json";
import NpcPool from "./npcPool.js";
import PlayerTank from "./playerTank.js";

export default class LevelManager
{
    constructor(input, config, uiFields)
    {
        this.uiFields = uiFields;

        this.timeUpdate = 0;
        this.uiFields.playersHealth[0] = 3;
        this.uiFields.playersHealth[1] = 3;
        this.isPause = false;

        // Присваивает класс Game
        this.gameOverEvent;
        this.winEvent;
        this.saveManager;

        this.uiFields.currentLevel = 0;
        this.currentMap = null;
        
        this.tiles = [new Image(), new Image(), new Image()];
        this.tiles[0].src = "/Tanks2D/sprites/block02.png";
        this.tiles[1].src = "/Tanks2D/sprites/Water.png";
        this.tiles[2].src = "/Tanks2D/sprites/Brick.png";
        
        this.config = config;

        this.bulletPool = new BulletPool(this.config, this.removeTile.bind(this));
        this.players = [];
        this.players[0] = new PlayerTank(this.config, this.bulletPool.create.bind(this.bulletPool), this.playerDead.bind(this), 0);
        this.players[1] = new PlayerTank(this.config, this.bulletPool.create.bind(this.bulletPool), this.playerDead.bind(this), 0);
        this.npcPool = new NpcPool(this.config, this.bulletPool.create.bind(this.bulletPool), this.players, this.win.bind(this), uiFields);

        this.players[0].otherTanks.push(...this.npcPool.tanks);
        this.bulletPool.setListNpcTanks(this.npcPool.tanks);
        this.bulletPool.setListPlayers([this.players[0]]);
        this.bulletPool.setListPlayers([this.players[1]]);

        input.movePlayer1Event = this.players[0].setDirection.bind(this.players[0]);
        input.shootPlayer1Event = this.players[0].shoot.bind(this.players[0]);

        input.movePlayer2Event = this.players[1].setDirection.bind(this.players[1]);
        input.shootPlayer2Event = this.players[1].shoot.bind(this.players[1]);
    }

    start(playersMode = 0)
    {
        this.reset();
        this.currentMap = [];

        // Поскольку Object.assign делает только поверхностную копию мы присваиваем каждую полосу отдельно
        for (let i = 0; i < levels[this.uiFields.currentLevel].map.length; i++) {
            this.currentMap.push(levels[this.uiFields.currentLevel].map[i].slice());
        }
        setTimeout(() => {        
            this.bulletPool.init(this.currentMap);
            this.isPause = false;
            this.players[0].create(this.currentMap, levels[this.uiFields.currentLevel].playerSpawnsPos[0]);
            this.players[0].isPause = false;
            if (playersMode === 1)
            {
                this.players[1].create(this.currentMap, levels[this.uiFields.currentLevel].playerSpawnsPos[1]);
                this.players[1].isPause = false;
            }
            this.npcPool.init(this.currentMap, this.uiFields.currentLevel);
        }, 1000);
    }

    removeTile(posX, posY)
    {
        this.currentMap[posY][posX] = 0;
    }
    
    setPause()
    {
        this.isPause = true;
        this.players[0].setPause();
        this.players[1].setPause();
        this.npcPool.setPause();
    }

    setResume()
    {
        this.isPause = false;
        this.players[0].isPause = false;
        this.players[1].isPause = false;
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
        this.players[0].setReset();
        this.players[1].setReset();
        this.npcPool.setReset();
        this.bulletPool.setReset();
        this.uiFields.playersHealth[0] = 3;
    }

    playerDead(playerId)
    {
        this.uiFields.playersHealth[playerId]--;
        if (this.uiFields.playersHealth[0] === 0 && 
            this.uiFields.playersHealth[1] === 0)
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

    update(lag)
    {
        if (this.isPause) return;
        this.players[0].update(lag);
        if (this.players[1].isUse)
            this.players[1].update(lag);
        this.bulletPool.update(lag);
        this.npcPool.update(lag);
    }

    render()
    {
        for (let i = 0; i < this.config.viewSize.y; i++) {
            for (let j = 0; j < this.config.viewSize.x; j++) 
            {
                drawImage(this.config.ctx, this.tiles[this.currentMap[i][j]], {x:j * this.config.grid, y:i * this.config.grid}, {x:this.config.grid, y:this.config.grid});
            }
        }
        this.players[0].render();
        if (this.players[1].isUse)
            this.players[1].render();

        this.bulletPool.render();
        this.npcPool.render();
    }
}