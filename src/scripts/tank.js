import { drawImage, drawRect } from "./general.js";

export default class Tank
{
    constructor(config, spawnBullet)
    {
        this.config = config;
        this.position = {
            x: 0,
            y: 0
        }
        this.moveY = 0;
        this.moveX = 0;
        this.dirY = -1;
        this.dirX = 0;
        this.spawnBullet = spawnBullet;
        this.isPause = false;
        this.currentMap;
        this.isUse = false;

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

        this.otherTanks = []; // Присваивает Level Manager или npcPool
    }

    create(currentMap, pos)
    {
        this.currentMap = currentMap;
        this.position.x = pos.x * this.config.grid2;
        this.position.y = pos.y * this.config.grid2;
        this.isUse = true;
    }

    reset()
    {
        this.isUse = false;
    }

    setDirection(dirX, dirY)
    {
        if (this.isPause || !this.isUse) return;

        // Если поворачиваем
        if (this.dirX != 0 && dirY != 0) 
        {
            this.position.x = Math.round(this.position.x / this.config.grid) * this.config.grid;
        }
        else if (this.dirY != 0 && dirX != 0)
        {
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
        if (this.currentMap[tileY] === undefined 
            || this.currentMap[tileY][tileX] === undefined) return true;
        if (this.moveY != 0) 
        {
            return (this.currentMap[tileY][tileX] != 0 || this.currentMap[tileY][tileX+1] != 0);
        }
        else if (this.moveX != 0)
        {
            return (this.currentMap[tileY][tileX] != 0 || this.currentMap[tileY+1][tileX] != 0);
        } 
    }

    sortOtherTanks()
    {
        let check = 0;
        for (let i = 0; i < this.otherTanks.length; i++) {
            if (this.otherTanks[i].isUse)
            {
                check = this.checkCollisionWithTank(this.otherTanks[i]) ? check + 1 : check;
            }
        }
        return check > 0;
    }

    checkCollisionWithTank(tank)
    {
        let tX = Math.round((this.position.x + this.config.grid/2 * this.moveX) / this.config.grid);
        let tY = Math.round((this.position.y + this.config.grid/2 * this.moveY) / this.config.grid);

        let oX = Math.round((tank.position.x) / this.config.grid);
        let oY = Math.round((tank.position.y) / this.config.grid);

        if (this.moveY > 0)  // Двигаясь вниз
        {
            if (tX === oX + 1 && tY + 1 === oY // Сравниваем левый нижний угл нашего танка с правым верхним углом другого
                || tX + 1 === oX && tY + 1 === oY // правый нижний угл нашего танка с левым верхним углом другого
                || tX === oX && tY + 1 === oY) return true; // левый нижний угл нашего танка с левым верхним углом другого
        }
        else if (this.moveY < 0) // Двигаясь вверх
        {
            if (tX === oX + 1 && tY === oY + 1 // Сравниваем левый верхний угл нашего танка с правым нижним углом другого
            || tX + 1 === oX && tY === oY + 1 // правый верхний угл нашего танка с левым нижним углом другого
            || tX === oX && tY === oY + 1) return true; // левый верхний угл нашего танка с левым верхним углом другого
        }
        else if (this.moveX > 0) // Двигаясь вправо
        {
            if (tX + 1 === oX && tY === oY + 1 // Сравниваем правый верхний угл нашего танка с левым нижним углом другого
            || tX + 1 === oX && tY + 1 === oY // правый нижний угл нашего танка с левым верхним углом другого
            || tX + 1 === oX && tY === oY) return true; // правый верхний угл нашего танка с левым верхним углом другого
        }
        else if (this.moveX < 0) // Двигаясь влево
        {
            if (tX === oX + 1 && tY === oY + 1 // Сравниваем левый верхний угл нашего танка с правым нижним углом другого
            || tX === oX + 1 && tY + 1 === oY // левый нижний угл нашего танка с правым верхним углом другого
            || tX === oX + 1 && tY === oY) return true; // левый верхний угл нашего танка с правым верхним углом другого
        }

        return false;
    }

    shoot()
    {
        if (this.isCooldown || this.isPause || !this.isUse) return;
        let centerPos = {x: this.position.x + this.config.grid/2 + (this.dirX * this.config.grid), 
        y: this.position.y + this.config.grid/2 + (this.dirY * this.config.grid)};
        this.spawnBullet(centerPos, {x: this.dirX, y: this.dirY});
        this.isCooldown = true;
        setTimeout(() => {
            this.isCooldown = false;
        }, this.cooldownTime);
    }
    
    move(lag)
    {
        let incrementX = this.moveX * lag * this.speed;
        let incrementY = this.moveY * lag * this.speed;
        if ((this.moveX == 0 && this.moveY == 0)
            || this.checkCollisionWithObstacle()
            || this.sortOtherTanks()) return; // Если выходим за границы карты
        
        this.position.x += incrementX;
        this.position.y += incrementY;
    }

    update(lag)
    {
        if (!this.isUse) return;
        this.move(lag);
    }

    render()
    {
        if (!this.isUse) return;

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