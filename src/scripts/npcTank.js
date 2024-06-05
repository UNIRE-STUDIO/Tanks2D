import { drawRect, randomRange } from "./general.js";
import Tank from "./tank.js";

export default class NpcTank extends Tank 
{
    constructor(config, spawnBullet)
    {
        super(config, spawnBullet);
        this.dirY = 1;
        this.speed = 0.05;
    }

    create(currentMap, pos)
    {
        super.create(currentMap, pos);
        this.checkingThePath();
        this.moveX = this.dirX;
        this.moveY = this.dirY;
    }

    checkingThePath()
    {
        let dirs = [];

        let rightX = Math.ceil((this.position.x + this.config.grid * 2) / this.config.grid);
        let rightY = Math.ceil(this.position.y / this.config.grid);

        let downX = Math.ceil(this.position.x / this.config.grid);
        let downY = Math.ceil((this.position.y + this.config.grid * 2) / this.config.grid);

        let leftX = Math.ceil((this.position.x - this.config.grid) / this.config.grid);
        let leftY = rightY;

        let upX = downX;
        let upY = Math.ceil((this.position.y - this.config.grid) / this.config.grid);

        if (this.dirY != 0) 
        {
            if (this.currentMap[rightY] !== undefined 
                && this.currentMap[rightY][rightX] !== undefined 
                && this.currentMap[rightY][rightX] == 0) 
            {
                dirs.push([1,0]);
            }
            if (this.currentMap[leftY] !== undefined 
                && this.currentMap[leftY][leftX] !== undefined 
                && this.currentMap[leftY][leftX] == 0) 
            {
                dirs.push([-1,0]);
            }
        }
        else if (this.dirX != 0)
        {
            if (this.currentMap[downY] !== undefined 
                && this.currentMap[downY][downX] !== undefined 
                && this.currentMap[downY][downX] == 0) 
            {
                dirs.push([0,1]);
            }
            if (this.currentMap[upY] !== undefined 
                && this.currentMap[upY][upX] !== undefined 
                && this.currentMap[upY][upX] == 0) 
            {
                dirs.push([0,-1]);
            }  
        }
        let rand = randomRange(0, dirs.length);
        console.log(dirs[rand]);
        this.setDirection(dirs[rand][0], dirs[rand][1]);
    }

    move(lag)
    {
        let incrementX = this.moveX * lag * this.speed;
        let incrementY = this.moveY * lag * this.speed;
        if (this.checkCollisionWithObstacle())
        {
            this.checkingThePath();
        }
        
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
        super.render();
        let pos = 0;
        if (this.dirY != 0) 
        {
            // right
            pos = {
                x: Math.ceil((this.position.x + this.config.grid * 2) / this.config.grid) * this.config.grid,
                y: Math.ceil(this.position.y / this.config.grid) * this.config.grid
            };
            drawRect(this.config.ctx, pos, { x: this.config.grid, y: this.config.grid }, "#fff");

            // left
            pos = {
                x: Math.ceil((this.position.x - this.config.grid) / this.config.grid) * this.config.grid,
                y: Math.ceil(this.position.y / this.config.grid) * this.config.grid
            };
            drawRect(this.config.ctx, pos, { x: this.config.grid, y: this.config.grid }, "#f7f");
        }

        if (this.dirX != 0) 
        {
            // down
            pos = {x: Math.ceil(this.position.x / this.config.grid) * this.config.grid,
            y: Math.ceil((this.position.y + this.config.grid * 2) / this.config.grid) * this.config.grid};
            drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#ff7");

            // up
            pos = {x: Math.ceil(this.position.x / this.config.grid) * this.config.grid,
            y: Math.ceil((this.position.y - this.config.grid) / this.config.grid) * this.config.grid};
            drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#007");

        }
    }
}