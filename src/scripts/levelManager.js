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
        
        this.tilesBackground = [new Image(), new Image(), new Image(),new Image()];
        this.tilesBackground[0].src = "/Tanks2D/sprites/block03-1.png";
        this.tilesBackground[1].src = "/Tanks2D/sprites/block03-2.png";
        this.tilesBackground[2].src = "/Tanks2D/sprites/block03-3.png";
        this.tilesBackground[3].src = "/Tanks2D/sprites/block03-4.png";
        this.tiles = [new Image(), new Image(), new Image(),new Image()];
        this.tiles[0].src = "/Tanks2D/sprites/brick.png";
        this.tiles[1].src = "/Tanks2D/sprites/block04.png";
        this.tiles[2].src = "/Tanks2D/sprites/water04.png";
        this.tiles[3].src = "/Tanks2D/sprites/base.png";
        
        this.config = config;

        this.bulletPool = new BulletPool(this.config, this.removeTile.bind(this), this.destructionOfTheBase.bind(this));
        this.players = [];
        this.players[0] = new PlayerTank(this.config, this.bulletPool.create.bind(this.bulletPool), this.playerDead.bind(this), 0);
        this.players[1] = new PlayerTank(this.config, this.bulletPool.create.bind(this.bulletPool), this.playerDead.bind(this), 1);
        this.npcPool = new NpcPool(this.config, this.bulletPool.create.bind(this.bulletPool), this.players, this.win.bind(this), uiFields);

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
    }

    start(playersMode = 0)
    {
        this.uiFields.playersMode = playersMode;
        this.reset();
        this.currentMap = [];

        // Поскольку Object.assign делает только поверхностную копию мы присваиваем каждую полосу отдельно
        for (let i = 0; i < levels[this.uiFields.currentLevel].map.length; i++) {
            this.currentMap.push(levels[this.uiFields.currentLevel].map[i].slice());
        }
        setTimeout(() => {        
            let base = {x: levels[this.uiFields.currentLevel].basePos.x * this.config.grid, y: levels[this.uiFields.currentLevel].basePos.y * this.config.grid};
            this.bulletPool.init(this.currentMap, base);
            this.isPause = false;
            this.players[0].create(this.currentMap, levels[this.uiFields.currentLevel].playerSpawnsPos[0]);
            //this.players[0].setOtherCollisionObject(base);
            this.players[0].isPause = false;
            if (playersMode === 1)
            {
                this.players[1].create(this.currentMap, levels[this.uiFields.currentLevel].playerSpawnsPos[1]);
                //this.players[1].setOtherCollisionObject(base);
                this.players[1].isPause = false;
            }
            this.npcPool.init(this.currentMap, this.uiFields.currentLevel, base);
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
        if (this.uiFields.playersMode === 1) this.players[1].setPause();
        this.npcPool.setPause();
    }

    setResume()
    {
        this.isPause = false;
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
        this.players[0].setReset();
        if (this.uiFields.playersMode === 1){
            this.players[1].setReset();
            this.uiFields.playersHealth[1] = 3;
        } 
        this.npcPool.setReset();
        this.bulletPool.setReset();
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
        this.gameOver();
    }

    update(lag)
    {
        if (this.isPause) return;
        this.players[0].update(lag);
        if (this.uiFields.playersMode === 1) this.players[1].update(lag);
        this.bulletPool.update(lag);
        this.npcPool.update(lag);
    }

    render(lag)
    {
        let tile;
        for (let i = 0; i < this.config.viewSize.y; i++) {
            for (let j = 0; j < this.config.viewSize.x; j++) 
            {
                if (this.currentMap[i][j] === 0 || this.currentMap[i][j] === 9) tile = this.tilesBackground[j%2+(i%2 * 2)];
                else tile = this.tiles[this.currentMap[i][j]-1];
                drawImage(this.config.ctx, tile, {x:j * this.config.grid, y:i * this.config.grid}, {x:this.config.grid, y:this.config.grid});
            }
        }
        drawImage(this.config.ctx, this.tiles[3], {x: levels[this.uiFields.currentLevel].basePos.x * this.config.grid, y:levels[this.uiFields.currentLevel].basePos.y * this.config.grid}, {x:this.config.grid2, y:this.config.grid2});
        this.players[0].render();
        if (this.uiFields.playersMode === 1) this.players[1].render();

        this.bulletPool.render();
        this.npcPool.render();
    }
}