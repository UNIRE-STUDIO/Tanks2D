import { drawImage } from "./general.js";
import SaveManager from "./saveManager.js";
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

        this.map = [[0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,1,0,0,0],
                    [0,0,0,0,0,0,0,1,1,1,0,0,0],
                    [0,0,0,0,0,0,0,1,1,1,0,0,0],
                    [0,0,0,0,0,0,0,1,1,1,0,0,0]];
        this.tiles = [new Image(), new Image()];
        this.tiles[0].src = "/src/sprites/Grass.png";
        this.tiles[1].src = "/src/sprites/Water.png";
        
        this.config = config;
        input.moveEvent = this.move.bind(this);

        this.player = new Tank(this.config);
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

    update(lag)
    {
        if (this.isPause) return;
        this.player.update(lag);
    }

    render()
    {
        for (let i = 0; i < this.config.viewSize.y; i++) {
            for (let j = 0; j < this.config.viewSize.x; j++) 
            {
                drawImage(this.ctx, this.tiles[this.map[i][j]], {x:j * this.config.grid, y:i * this.config.grid}, {x:this.config.grid, y:this.config.grid});
            }
        }
        this.player.render();
    }
}