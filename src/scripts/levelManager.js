import BulletPool from "./bulletPool.js";
import { drawImage } from "./general.js";
//import SaveManager from "./saveManager.js";
import Tank from "./tank.js";
import levels from "./levels.json";
import NpcPool from "./npcPool.js";

export default class LevelManager
{
    constructor(input, config)
    {
        // куда-то
        this.canvas = config.canvas;
        this.ctx = config.ctx;

        this.timeUpdate = 0;
        
        this.score = 0;

        this.isPause = false;

        // Присваивает класс Game
        this.gameOverEvent;
        this.saveManager;

        this.currentLevel = 0;
        this.currentMap = null;
        
        this.tiles = [new Image(), new Image(), new Image()];
        this.tiles[0].src = "/Tanks2D/sprites/Grass.png";
        this.tiles[1].src = "/Tanks2D/sprites/Water.png";
        this.tiles[2].src = "/Tanks2D/sprites/Brick.png";
        
        this.config = config;

        this.bulletPool = new BulletPool(this.config, this.removeTile.bind(this));
        this.player = new Tank(this.config, this.bulletPool.create.bind(this.bulletPool));
        this.npcPool = new NpcPool(this.config, this.bulletPool);

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
        this.player.isPause = true;
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
        this.gameOverEvent();
    }

    start()
    {
        this.reset();
        this.currentMap = [];

        // Поскольку Object.assign делает только поверхностную копию мы присваиваем каждую полосу отдельно
        for (let i = 0; i < levels[this.currentLevel].map.length; i++) {
            this.currentMap.push(Object.assign({}, levels[this.currentLevel].map[i]));
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
        this.player.reset();
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
                if (this.currentMap[i][j] == 0) continue;
                drawImage(this.ctx, this.tiles[this.currentMap[i][j]], {x:j * this.config.grid, y:i * this.config.grid}, {x:this.config.grid, y:this.config.grid});
            }
        }
        this.player.render();
        this.bulletPool.render();
        this.npcPool.render();
    }
}