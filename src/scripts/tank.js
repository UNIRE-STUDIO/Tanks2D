import { drawImage } from "./general.js";

export default class Bunny
{
    constructor(config)
    {
        this.config = config;
        this.position = {
            x: 3 * this.config.grid,
            y: 8 * this.config.grid
        }
        this.moveY = 0;
        this.moveX = 0;
        this.dirY = -1;
        this.dirX = 0;
        this.image_up = new Image();
        this.image_up.src = "/src/sprites/Tank_Up.png";
        this.image_down = new Image();
        this.image_down.src = "/src/sprites/Tank_Down.png";
        this.image_right = new Image();
        this.image_right.src = "/src/sprites/Tank_Right.png";
        this.image_left = new Image();
        this.image_left.src = "/src/sprites/Tank_Left.png";
        
        this.speed = 0.03;
    };

    setDirection(dirX, dirY)
    {
        // Если поворачиваем
        if (this.dirX != 0 && dirY != 0) 
        {
            this.position.x = Math.round(this.position.x / this.config.grid * 2) * this.config.grid / 2;
        }
        else if (this.dirY != 0 && dirX != 0){
            this.position.y = Math.round(this.position.y / this.config.grid * 2) * this.config.grid / 2;
        }
        this.moveX = dirX;
        this.moveY = dirY;
    }

    update(lag)
    {
        if ((this.moveX == 0 && this.moveY == 0)
            || this.position.x + this.moveX + this.config.grid > this.config.viewSize.x * this.config.grid
            || this.position.x + this.moveX < 0
            || this.position.y + this.moveY + this.config.grid > this.config.viewSize.y * this.config.grid
            || this.position.y + this.moveY < 0) return; // Если выходим за границы карты
        
        this.position.x += this.moveX * 1000 / lag * this.speed;
        this.position.y += this.moveY * 1000 / lag * this.speed;

        this.dirY = this.moveY;
        this.dirX = this.moveX;
    }

    render()
    {
        let pos = {x: this.position.x, y: this.position.y};
        if (this.dirX == 1)
            drawImage(this.config.ctx, this.image_right, pos, {x:this.config.grid, y:this.config.grid});
        else if (this.dirX == -1)
            drawImage(this.config.ctx, this.image_left, pos, {x:this.config.grid, y:this.config.grid});
        else if (this.dirY == 1)
            drawImage(this.config.ctx, this.image_down, pos, {x:this.config.grid, y:this.config.grid});
        else if (this.dirY == -1)
            drawImage(this.config.ctx, this.image_up, pos, {x:this.config.grid, y:this.config.grid});
    }
}