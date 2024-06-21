import { drawImage, drawRect } from "./general.js";

export default class Bullet
{
    constructor(config, removeTile, destructionOfTheBaseEvent)
    {
        this.config = config;
        this.posX = 0;
        this.posY = 0;
        this.dirY = 0;
        this.dirX = 0;
        this.currentMap;
        this.basePos;
        this.isUse = false;

        this.image_up = new Image();
        this.image_up.src = "/Tanks2D/sprites/Bullet_Up.png";
        this.image_down = new Image();
        this.image_down.src = "/Tanks2D/sprites/Bullet_Down.png";
        this.image_right = new Image();
        this.image_right.src = "/Tanks2D/sprites/Bullet_Right.png";
        this.image_left = new Image();
        this.image_left.src = "/Tanks2D/sprites/Bullet_Left.png";
        
        this.speed = 0.2;
        this.damage = 1;
        this.bulletsPlayer = false;

        this.removeTile = removeTile;
        this.destructionOfTheBaseEvent = destructionOfTheBaseEvent;
        this.tanks = [];    // bulletPool
        this.players = []   // bulletPool

    }

    create(pos, dir, bulletsPlayer)
    {
        this.posX = pos.x;
        this.posY = pos.y;
        this.dirY = dir.y;
        this.dirX = dir.x;
        this.isUse = true;
        this.bulletsPlayer = bulletsPlayer;
    }

    checkCollisionWithObstacle()
    {
        let tileX = Math.round((this.posX + (this.dirX * this.config.grid / 2)) / this.config.grid);
        let tileY = Math.round((this.posY + (this.dirY * this.config.grid / 2)) / this.config.grid);
        
        if (this.currentMap[tileY] === undefined
            || this.currentMap[tileY][tileX] === undefined)
        {
            return true;
        }
        
        let isCollision = false;
        if (this.currentMap[tileY][tileX] === 5) // Проверяем основным датчиком
        {
            this.removeTile(tileX, tileY);
            isCollision = true;
        }
        if (this.dirY != 0 
            && this.currentMap[0][tileX - 1] !== undefined
            && this.currentMap[tileY][tileX - 1] === 5) // Проверяем соседний блок по горизонтале
        {
            this.removeTile(tileX - 1, tileY);
            isCollision = true;
        }
        else if (this.dirX != 0 
            && this.currentMap[tileY - 1] !== undefined
            && this.currentMap[tileY - 1][tileX] === 5) // Проверяем соседний блок по вертикали
        {
            this.removeTile(tileX, tileY - 1);
            isCollision = true;
        }
        return isCollision;
    }

    sortTanks()
    {
        for (let i = 0; i < this.tanks.length; i++) 
        {
            if (this.tanks[i].isUse)
            {
                if (this.checkCollisionWithTank(this.tanks[i].position))
                {
                    if (this.bulletsPlayer) this.tanks[i].setDamage(this.damage);

                    return true;
                }
            }
        }
        for (let i = 0; i < this.players.length; i++) 
        {
            if (this.players[i].isUse)
            {
                if (this.checkCollisionWithTank(this.players[i].position))
                {
                    if (!this.bulletsPlayer) this.players[i].setDamage(this.damage);

                    return true;
                }
            }
        }
        return false;
    }

    checkCollisionWithTank(tankPos)
    {
        let tX = Math.round((this.posX + this.config.grid/2 * this.dirX) / this.config.grid);
        let tY = Math.round((this.posY + this.config.grid/2 * this.dirY) / this.config.grid);

        let oX = Math.round(tankPos.x / this.config.grid);
        let oY = Math.round(tankPos.y / this.config.grid);

        if (this.dirY > 0)  // Двигаясь вниз
        {
            if (tX-1 === oX + 1 && tY === oY // Сравниваем левую часть пули с правым верхним углом танка
             || tX === oX    && tY === oY // правую часть пули с левым верхним углом танка
             || tX-1 === oX  && tY === oY) return true; // левую часть пули с левым верхним углом танка
        }
        else if (this.dirY < 0) // Двигаясь вверх
        {
            if (tX-1 === oX + 1 && tY === oY + 1 // Сравниваем левую часть пули с правым нижним углом танка
             || tX === oX     && tY === oY + 1 // правую часть пули с левым нижним углом танка
             || tX-1 === oX && tY === oY + 1) return true; // левую часть пули с левым верхним углом танка
        }
        else if (this.dirX > 0) // Двигаясь вправо
        {
            if (tX === oX && tY-1 === oY + 1 // Сравниваем верхнюю часть пули с левым нижним углом танка
             || tX === oX && tY === oY // нижнюю часть пули с левым верхним углом танка
             || tX === oX && tY-1 === oY) return true; // верхнюю часть пули с левым верхним углом танка
        }
        else if (this.dirX < 0) // Двигаясь влево
        {
            if (tX === oX + 1 && tY-1 === oY + 1 // Сравниваем верхнюю часть пули с правым нижним углом танка
             || tX === oX + 1 && tY === oY // нижнюю часть пули с правым верхним углом танка
             || tX === oX + 1 && tY-1 === oY) return true; // верхнюю часть пули с правым верхним углом танка
        }

        return false;
    }

    update(lag)
    {
        if (this.checkCollisionWithObstacle()
            || this.sortTanks())
        {
            this.isUse = false;
            return;
        }
        if (this.checkCollisionWithTank(this.basePos))
        {
            this.isUse = false;
            this.destructionOfTheBaseEvent();
            return;
        }
        
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
        
        // pos = {x: Math.round((this.posX - (this.dirX * this.config.grid/2)) / this.config.grid) * this.config.grid,
        //          y: Math.round((this.posY - (this.dirY * this.config.grid/2)) / this.config.grid) * this.config.grid};
        // drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#fff");

        // if (this.dirY != 0) // Проверяем соседний блок по горизонтале
        // {
        //     pos = {x: pos.x - this.config.grid, y: pos.y};
        //     drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#000");
        // }
        // else if (this.dirX != 0) // Проверяем соседний блок по вертикали
        // {
        //     pos = {x: pos.x, y: pos.y - this.config.grid};
        //     drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#000");
        // }


    }
}