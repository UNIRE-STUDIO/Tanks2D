import Bullet from "./bullet.js";
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

        this.currentMap = [[0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,1,1,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0,0,0,0]];
        this.tiles = [new Image(), new Image()];
        this.tiles[0].src = "/src/sprites/Grass.png";
        this.tiles[1].src = "/src/sprites/Water.png";
        
        this.config = config;
        input.moveEvent = this.move.bind(this);
        input.shootEvent = this.shoot.bind(this);

        this.player = new Tank(this.config, this.currentMap, this.spawnBullet.bind(this));

        this.bullets = new Map();
        this.bulletCounter = 0;
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

    move(dirX, dirY)
    {
        this.player.setDirection(dirX,dirY);   
    }

    shoot()
    {
        this.player.shoot();   
    }

    spawnBullet(pos, dir)
    {
        if (this.bulletCounter > 100) this.bulletCounter = 0;
        this.bullets.set(this.bulletCounter, new Bullet(pos, dir, this.config, 
                        this.currentMap, this.removeBullet.bind(this), this.bulletCounter));
        this.bulletCounter++;
    }

    removeBullet(id)
    {
        this.bullets.delete(id);
        console.log(this.bullets.size);
    }

    update(lag)
    {
        if (this.isPause) return;
        this.player.update(lag);
        if (this.bullets.length == 0) return;
        this.bullets.forEach(e => {
            e.update(lag);
        });
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

        if (this.bullets.length == 0) return;
        this.bullets.forEach(e => {
            e.render();
        });
    }
}