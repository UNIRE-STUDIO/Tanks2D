import { drawImage, drawRect } from "./general.js";

export default class Tank
{
    constructor(config, currentMap, spawnBullet)
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
        this.currentMap = currentMap;
        this.spawnBullet = spawnBullet;

        this.image_up = new Image();
        this.image_up.src = "/src/sprites/Tank_Up.png";
        this.image_down = new Image();
        this.image_down.src = "/src/sprites/Tank_Down.png";
        this.image_right = new Image();
        this.image_right.src = "/src/sprites/Tank_Right.png";
        this.image_left = new Image();
        this.image_left.src = "/src/sprites/Tank_Left.png";
        
        this.speed = 0.03;
        this.isCooldown = false;
        this.cooldownTime = 100;
    }

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
        if (dirX == 0 && dirY == 0) return; // Если input пытается сбросить направления, то this.dir? должны его сохранить даже если кнопка не нажата
        this.dirY = dirY;
        this.dirX = dirX;
    }

    checkCollisionWithObstacle()
    {
        let tileX2 = 0;
        let tileY2 = 0;
        if (this.moveY != 0) 
        {
            tileX2 = Math.round((this.position.x - (this.config.grid / 2) + this.moveX * this.config.grid / 2) / this.config.grid);
            tileY2 = Math.round((this.position.y + this.moveY * this.config.grid / 2) / this.config.grid);
        }
        else if (this.moveX != 0)
        {
            tileX2 = Math.round((this.position.x + this.moveX * this.config.grid / 2) / this.config.grid);
            tileY2 = Math.round((this.position.y - (this.config.grid / 2) + this.moveY * this.config.grid / 2) / this.config.grid);
        }
        let tileX = Math.round((this.position.x + this.moveX * this.config.grid / 2) / this.config.grid);
        let tileY = Math.round((this.position.y + this.moveY * this.config.grid / 2) / this.config.grid);
        
        if (tileX >= this.config.viewSize.x || tileY >= this.config.viewSize.y
            || tileX < 0 || tileY < 0) return false;

        return (this.currentMap[tileY][tileX] == 1 || this.currentMap[tileY2][tileX2] == 1);
    }

    checkCollisionWithBorders()
    {
            return (this.position.x + this.config.grid > this.config.viewSize.x * this.config.grid
            || this.position.x < 0
            || this.position.y + this.config.grid > this.config.viewSize.y * this.config.grid
            || this.position.y < 0);
    }

    shoot()
    {
        if (this.isCooldown) return;
        let centerPos = {x: this.position.x + this.config.grid/4, y: this.position.y + this.config.grid/4}
        this.spawnBullet(centerPos, {x: this.dirX, y: this.dirY});
        this.isCooldown = true;
        setTimeout(() => {
            this.isCooldown = false;
        }, this.cooldownTime);
    }

    update(lag)
    {
        if ((this.moveX == 0 && this.moveY == 0) 
            || this.checkCollisionWithBorders()
            || this.checkCollisionWithObstacle()) return; // Если выходим за границы карты
        
        this.position.x += this.moveX * 1000 / lag * this.speed;
        this.position.y += this.moveY * 1000 / lag * this.speed;
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

        // pos = {x: Math.round((this.position.x + this.moveX * this.config.grid / 2) / this.config.grid) * this.config.grid, 
        //     y: Math.round((this.position.y + this.moveY * this.config.grid / 2) / this.config.grid) * this.config.grid};
        // drawRect(this.config.ctx, pos, {x:10, y:10}, "#fff");

        // pos = {x: Math.round((this.position.x - (this.config.grid / 2) + this.moveX * this.config.grid / 2) / this.config.grid) * this.config.grid, 
        //      y: Math.round((this.position.y + this.moveY * this.config.grid /2 ) / this.config.grid) * this.config.grid};
        //  drawRect(this.config.ctx, pos, {x:10, y:10}, "#000");
    }
}