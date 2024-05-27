import { drawImage } from "./general.js";

export default class Bullet
{
    constructor(config, currentMap)
    {
        this.config = config;
        this.posX = 0;
        this.posY = 0;
        this.dirY = 0;
        this.dirX = 0;
        this.currentMap = currentMap;
        this.isUse = false;

        this.image_up = new Image();
        this.image_up.src = "/Tanks2D/sprites/Bullet_Up.png";
        this.image_down = new Image();
        this.image_down.src = "/Tanks2D/sprites/Bullet_Down.png";
        this.image_right = new Image();
        this.image_right.src = "/Tanks2D/sprites/Bullet_Right.png";
        this.image_left = new Image();
        this.image_left.src = "/Tanks2D/sprites/Bullet_Left.png";
        
        this.speed = 0.15;
    }

    create(pos, dir)
    {
        this.posX = pos.x + (dir.x * this.config.grid);
        this.posY = pos.y + (dir.y * this.config.grid);
        this.dirY = dir.y;
        this.dirX = dir.x;
        this.isUse = true;
    }

    checkCollisionWithObstacle()
    {
        let tileX = Math.round((this.posX) / this.config.grid);
        let tileY = Math.round((this.posY) / this.config.grid);
        
        if (tileX >= this.config.viewSize.x || tileY >= this.config.viewSize.y
             || tileX < 0 || tileY < 0) return false;

        return (this.currentMap[tileY][tileX] == 2);
    }

    checkCollisionWithBorders()
    {
            return (this.posX > this.config.viewSize.x * this.config.grid
            || this.posX < 0
            || this.posY > this.config.viewSize.y * this.config.grid
            || this.posY < 0);
    }

    update(lag)
    {
        if ((this.dirX == 0 && this.dirY == 0) 
            || this.checkCollisionWithBorders()
            || this.checkCollisionWithObstacle()) this.isUse = false;
        
        this.posX += this.dirX * lag * this.speed;
        this.posY += this.dirY * lag * this.speed;
    }

    render()
    {
        let pos = {x: this.posX, y: this.posY};
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