import { drawImage } from "./general.js";

export default class Bullet
{
    constructor(pos, dir, config, currentMap, remove, id)
    {
        this.config = config;
        this.position = {
            x: pos.x + (dir.x * this.config.grid/2),
            y: pos.y + (dir.y * this.config.grid/2)
        }
        this.dirY = dir.y;
        this.dirX = dir.x;
        this.currentMap = currentMap;
        this.remove = remove;
        this.id = id;

        this.image_up = new Image();
        this.image_up.src = "/Tanks2D/sprites/Bullet_Up.png";
        this.image_down = new Image();
        this.image_down.src = "/Tanks2D/sprites/Bullet_Down.png";
        this.image_right = new Image();
        this.image_right.src = "/Tanks2D/sprites/Bullet_Right.png";
        this.image_left = new Image();
        this.image_left.src = "/Tanks2D/sprites/Bullet_Left.png";
        
        this.speed = 0.06;
    }

    update(lag)
    {
        if ((this.dirX == 0 && this.dirY == 0) 
            || this.checkCollisionWithBorders()
            || this.checkCollisionWithObstacle()) this.remove(this.id);
        
        this.position.x += this.dirX * 1000 / lag * this.speed;
        this.position.y += this.dirY * 1000 / lag * this.speed;
    }

    checkCollisionWithObstacle()
    {
        // let tileX2 = 0;
        // let tileY2 = 0;
        // if (this.dirY != 0) 
        // {
        //     tileX2 = Math.round((this.position.x - (this.config.grid / 2) + this.dirX * this.config.grid / 2) / this.config.grid);
        //     tileY2 = Math.round((this.position.y + this.dirY * this.config.grid / 2) / this.config.grid);
        // }
        // else if (this.dirX != 0)
        // {
        //     tileX2 = Math.round((this.position.x + this.dirX * this.config.grid / 2) / this.config.grid);
        //     tileY2 = Math.round((this.position.y - (this.config.grid / 2) + this.dirY * this.config.grid / 2) / this.config.grid);
        // }
        let tileX = Math.round((this.position.x) / this.config.grid);
        let tileY = Math.round((this.position.y) / this.config.grid);
        
        if (tileX >= this.config.viewSize.x || tileY >= this.config.viewSize.y
             || tileX < 0 || tileY < 0) return false;

        return (this.currentMap[tileY][tileX] == 2);
    }

    checkCollisionWithBorders()
    {
            return (this.position.x > this.config.viewSize.x * this.config.grid
            || this.position.x < 0
            || this.position.y > this.config.viewSize.y * this.config.grid
            || this.position.y < 0);
    }

    render()
    {
        let pos = {x: this.position.x, y: this.position.y};
        if (this.dirX == 1)
            drawImage(this.config.ctx, this.image_right, pos, {x:this.config.grid/2, y:this.config.grid/2});
        else if (this.dirX == -1)
            drawImage(this.config.ctx, this.image_left, pos, {x:this.config.grid/2, y:this.config.grid/2});
        else if (this.dirY == 1)
            drawImage(this.config.ctx, this.image_down, pos, {x:this.config.grid/2, y:this.config.grid/2});
        else if (this.dirY == -1)
            drawImage(this.config.ctx, this.image_up, pos, {x:this.config.grid/2, y:this.config.grid/2});
    }
}