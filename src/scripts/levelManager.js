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
        this.score = 0;
        this.uiFields.playerHealth1 = 3;
        this.isPause = false;

        // Присваивает класс Game
        this.gameOverEvent;
        this.saveManager;

        this.currentLevel = 0;
        this.currentMap = null;
        
        this.tiles = [new Image(), new Image(), new Image()];
        this.tiles[0].src = "/Tanks2D/sprites/block02.png";
        this.tiles[1].src = "/Tanks2D/sprites/Water.png";
        this.tiles[2].src = "/Tanks2D/sprites/Brick.png";
        
        this.config = config;

        this.bulletPool = new BulletPool(this.config, this.removeTile.bind(this));
        this.player = new PlayerTank(this.config, this.bulletPool.create.bind(this.bulletPool), this.playerDead.bind(this), 0);
        this.npcPool = new NpcPool(this.config, this.bulletPool.create.bind(this.bulletPool), this.player, this.win.bind(this), uiFields);

        this.player.otherTanks.push(...this.npcPool.tanks);
        this.bulletPool.setListNpcTanks(this.npcPool.tanks);
        this.bulletPool.setListPlayers([this.player]);

        input.moveEvent = this.player.setDirection.bind(this.player);
        input.shootEvent = this.player.shoot.bind(this.player);
    }

    removeTile(posX, posY)
    {
        this.currentMap[posY][posX] = 0;
    }
    
    setPause()
    {
        this.isPause = true;
        this.player.setPause();
        this.npcPool.setPause();
    }

    setResume()
    {
        this.isPause = false;
        this.player.isPause = false;
        this.npcPool.setResume();
    }

    gameOver()
    {   
        this.setPause();
        this.gameOverEvent();
    }

    win()
    {
        this.setPause(); // Временно!!!
        this.gameOverEvent();
    }

    start()
    {
        this.reset();
        this.currentMap = [];

        // Поскольку Object.assign делает только поверхностную копию мы присваиваем каждую полосу отдельно
        for (let i = 0; i < levels[this.currentLevel].map.length; i++) {
            this.currentMap.push(levels[this.currentLevel].map[i].slice());
        }
        setTimeout(() => {        
            this.bulletPool.init(this.currentMap);
            this.player.create(this.currentMap, levels[this.currentLevel].playerSpawnPos1);
            this.npcPool.init(this.currentMap, this.currentLevel);
            this.score = 0;
            this.isPause = false;
            this.player.isPause = false;
        }, 1000);
    }

    reset()
    {
        this.player.setReset();
        this.npcPool.setReset();
        this.bulletPool.setReset();
        this.uiFields.playerHealth1 = 3;
    }

    playerDead(playerId)
    {
        this.uiFields.playerHealth1--;
        if (this.uiFields.playerHealth1 === 0)
        {
            this.gameOver();
            return;
        }
        setTimeout(() => 
        {
            this.player.create(this.currentMap, levels[this.currentLevel].playerSpawnPos1);
        }, 2000);
    }

    update(lag)
    {
        if (this.isPause) return;
        this.player.update(lag);
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
        this.player.render();
        this.bulletPool.render();
        this.npcPool.render();
    }
}