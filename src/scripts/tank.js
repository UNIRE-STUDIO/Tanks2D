import { drawImage, drawRect } from "./general.js";

export default class Tank
{
    constructor(config, currentMap, spawnBullet)
    {
        this.config = config;
        this.position = {
            x: 0 * this.config.grid2,
            y: 3 * this.config.grid2
        }
        this.moveY = 0;
        this.moveX = 0;
        this.dirY = -1;
        this.dirX = 0;
        this.currentMap = currentMap;
        this.spawnBullet = spawnBullet;

        this.image_up = new Image();
        this.image_up.src = "/Tanks2D/sprites/Tank_Up.png";
        this.image_down = new Image();
        this.image_down.src = "/Tanks2D/sprites/Tank_Down.png";
        this.image_right = new Image();
        this.image_right.src = "/Tanks2D/sprites/Tank_Right.png";
        this.image_left = new Image();
        this.image_left.src = "/Tanks2D/sprites/Tank_Left.png";
        
        this.speed = 0.1;
        this.isCooldown = false;
        this.cooldownTime = 1000;
    }

    setDirection(dirX, dirY)
    {
        // Если поворачиваем
        if (this.dirX != 0 && dirY != 0) 
        {
            this.position.x = Math.round(this.position.x / this.config.grid) * this.config.grid;
        }
        else if (this.dirY != 0 && dirX != 0){
            this.position.y = Math.round(this.position.y / this.config.grid) * this.config.grid;
        }
        this.moveX = dirX;
        this.moveY = dirY;
        if (dirX == 0 && dirY == 0) return; // Если input пытается сбросить направления, то this.dir? должны его сохранить даже если кнопка не нажата
        this.dirY = dirY;
        this.dirX = dirX;
    }

    checkCollisionWithObstacle()
    {
        let tileX = Math.ceil((this.position.x + this.config.grid * this.moveX) / this.config.grid);
        let tileY = Math.ceil((this.position.y + this.config.grid * this.moveY) / this.config.grid);
        if (tileX >= this.config.viewSize.x || tileY >= this.config.viewSize.y
            || tileX < 0 || tileY < 0) return false;
        if (this.moveY != 0) 
        {
            return (this.currentMap[tileY][tileX] == 1 || this.currentMap[tileY][tileX+1] == 1);
        }
        else if (this.moveX != 0)
        {
            return (this.currentMap[tileY][tileX] == 1 || this.currentMap[tileY+1][tileX] == 1);
        } 
    }

    checkCollisionWithBorders(incrementX, incrementY)
    {
            return (this.position.x + incrementX + this.config.grid2 > this.config.viewSize.x * this.config.grid
            || this.position.x + incrementX < 0
            || this.position.y + incrementY + this.config.grid2 > this.config.viewSize.y * this.config.grid
            || this.position.y + incrementY < 0);
    }

    shoot()
    {
        if (this.isCooldown) return;
        let centerPos = {x: this.position.x + this.config.grid/2, y: this.position.y + this.config.grid/2}
        this.spawnBullet(centerPos, {x: this.dirX, y: this.dirY});
        this.isCooldown = true;
        setTimeout(() => {
            this.isCooldown = false;
        }, this.cooldownTime);
    }

    update(lag)
    {
        let incrementX = this.moveX * lag * this.speed;
        let incrementY = this.moveY * lag * this.speed;
        if ((this.moveX == 0 && this.moveY == 0) 
            || this.checkCollisionWithBorders(incrementX, incrementY)
            || this.checkCollisionWithObstacle()) return; // Если выходим за границы карты
        
        this.position.x += incrementX;
        this.position.y += incrementY;
    }

    render()
    {
        let pos = {x: this.position.x, y: this.position.y};
        if (this.dirX == 1)
            drawImage(this.config.ctx, this.image_right, pos, {x:this.config.grid2, y:this.config.grid2});
        else if (this.dirX == -1)
            drawImage(this.config.ctx, this.image_left, pos, {x:this.config.grid2, y:this.config.grid2});
        else if (this.dirY == 1)
            drawImage(this.config.ctx, this.image_down, pos, {x:this.config.grid2, y:this.config.grid2});
        else if (this.dirY == -1)
            drawImage(this.config.ctx, this.image_up, pos, {x:this.config.grid2, y:this.config.grid2});

        //   pos = {x: Math.ceil((this.position.x + this.config.grid) / this.config.grid) * this.config.grid,
        //          y: Math.ceil((this.position.y + this.config.grid * this.moveY) / this.config.grid) * this.config.grid};
        //   drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#fff");

        // pos = {x: Math.ceil((this.position.x + this.config.grid * this.moveX) / this.config.grid) * this.config.grid, 
        //       y: Math.ceil((this.position.y + this.config.grid * this.moveY) / this.config.grid) * this.config.grid};
        // drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#007");
    }
}