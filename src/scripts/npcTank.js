import { drawRect, randomRange } from "./general.js";
import Tank from "./tank.js";

export default class NpcTank extends Tank 
{
    constructor(config, spawnBullet)
    {
        super(config, spawnBullet);
        this.dirY = 1;
        this.speed = 0.07;
        this.isBlockTurn = false;
    }

    create(currentMap, pos)
    {
        super.create(currentMap, pos);
        this.moveX = this.dirX;
        this.moveY = this.dirY;
    }

    tryTurn()
    {
        let dirs = [];

        if (this.dirY != 0) 
        {
            let rightX = Math.ceil((this.position.x + this.config.grid * 2) / this.config.grid);
            let rightY = Math.ceil(this.position.y / this.config.grid);

            let leftX = Math.ceil((this.position.x - this.config.grid) / this.config.grid);
            let leftY = rightY;

            if (this.currentMap[rightY] !== undefined 
                && this.currentMap[rightY][rightX] !== undefined 
                && this.currentMap[rightY][rightX] == 0
                && this.currentMap[rightY+1][rightX] == 0) 
            {
                dirs.push([1,0]);
            }
            if (this.currentMap[leftY] !== undefined 
                && this.currentMap[leftY][leftX] !== undefined 
                && this.currentMap[leftY][leftX] == 0
                && this.currentMap[leftY+1][leftX] == 0) 
            {
                dirs.push([-1,0]);
            }
        }
        else if (this.dirX != 0)
        {
            let downX = Math.ceil(this.position.x / this.config.grid);
            let downY = Math.ceil((this.position.y + this.config.grid * 2) / this.config.grid);

            let upX = downX;
            let upY = Math.ceil((this.position.y - this.config.grid) / this.config.grid);

            if (this.currentMap[downY] !== undefined 
                && this.currentMap[downY][downX] !== undefined 
                && this.currentMap[downY][downX] == 0
                && this.currentMap[downY][downX+1] == 0) 
            {
                dirs.push([0,1]);
            }
            if (this.currentMap[upY] !== undefined 
                && this.currentMap[upY][upX] !== undefined 
                && this.currentMap[upY][upY] == 0
                && this.currentMap[upY][upY+1] == 0) 
            {
                dirs.push([0,-1]);
            }  
        }
        if (randomRange(0, 6) == 0 || dirs.length == 0) // разворачиваемся по вероятности или при отсутствии доступного пространства
        {
            this.setDirection(-this.dirX, -this.dirY);
            return;
        }
        let rand = randomRange(0, dirs.length);
        this.setDirection(dirs[rand][0], dirs[rand][1]);
    }

    move(lag)
    {
        let incrementX = this.dirX * lag * this.speed;
        let incrementY = this.dirY * lag * this.speed;
        if (this.checkCollisionWithObstacle())
        {
            this.tryTurn();
            return;
        }
        
        this.position.x += incrementX;
        this.position.y += incrementY;

        if (this.position.x / this.config.grid2 - Math.floor(this.position.x / this.config.grid2) < 0.1 
            && this.position.y / this.config.grid2 - Math.floor(this.position.y / this.config.grid2) < 0.1 
            && randomRange(0, 8) == 0 && !this.isBlockTurn)
        {
            this.tryTurn();
            this.isBlockTurn = true;
            setTimeout(() => {this.isBlockTurn = false}, 600);
        }
    }

    update(lag)
    {
        if (!this.isUse) return;
        this.move(lag);
    }

    render()
    {
        super.render();
        // let pos = 0;
        // if (this.dirY != 0) 
        // {
        //     // right
        //     pos = {
        //         x: Math.ceil((this.position.x + this.config.grid * 2) / this.config.grid) * this.config.grid,
        //         y: Math.ceil(this.position.y / this.config.grid) * this.config.grid
        //     };
        //     drawRect(this.config.ctx, pos, { x: this.config.grid, y: this.config.grid }, "#fff");

        //     // left
        //     pos = {
        //         x: Math.ceil((this.position.x - this.config.grid) / this.config.grid) * this.config.grid,
        //         y: Math.ceil(this.position.y / this.config.grid) * this.config.grid
        //     };
        //     drawRect(this.config.ctx, pos, { x: this.config.grid, y: this.config.grid }, "#f7f");
        // }

        // if (this.dirX != 0) 
        // {
        //     // down
        //     pos = {x: Math.ceil(this.position.x / this.config.grid) * this.config.grid,
        //     y: Math.ceil((this.position.y + this.config.grid * 2) / this.config.grid) * this.config.grid};
        //     drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#ff7");

        //     // up
        //     pos = {x: Math.ceil(this.position.x / this.config.grid) * this.config.grid,
        //     y: Math.ceil((this.position.y - this.config.grid) / this.config.grid) * this.config.grid};
        //     drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#007");

        // }
    }
}