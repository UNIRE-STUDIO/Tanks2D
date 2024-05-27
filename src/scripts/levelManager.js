import BulletPool from "./bulletPool.js";
import { drawImage } from "./general.js";
//import SaveManager from "./saveManager.js";
import Tank from "./tank.js";

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

        this.currentMap =  [[0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 0,1, 1,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 0,1, 1,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 0,0, 0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 0,0, 0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 0,0, 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 0,1, 0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

                            [0,0, 0,0, 1,1, 1,1, 1,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0, 0,0, 1,1, 1,1, 1,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        this.tiles = [new Image(), new Image()];
        this.tiles[0].src = "/Tanks2D/sprites/Grass.png";
        this.tiles[1].src = "/Tanks2D/sprites/Water.png";
        
        this.config = config;

        this.BulletPool = new BulletPool(this.config, this.currentMap);
        this.player = new Tank(this.config, this.currentMap, this.BulletPool.create.bind(this.BulletPool));

        input.moveEvent = this.player.setDirection.bind(this.player);
        input.shootEvent = this.player.shoot.bind(this.player);
    }
    
    setPause()
    {
        this.isPause = true;
    }

    setResume()
    {
        this.isPause = false;
    }

    gameOver()
    {   
        this.gameOverEvent();
    }

    start()
    {
        this.score = 0;
        this.isPause = false;
    }

    update(lag)
    {
        if (this.isPause) return;
        this.player.update(lag);
        this.BulletPool.update(lag);
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
        this.BulletPool.render();
    }
}