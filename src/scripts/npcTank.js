import { drawRect } from "./general.js";
import Tank from "./tank.js";

export default class NpcTank extends Tank 
{
    constructor(config, spawnBullet)
    {
        super(config, spawnBullet);
        this.dirY = 1;
    }

    create(currentMap, pos)
    {
        super.create(currentMap, pos);
        this.checkingThePath();
    }

    checkingThePath()
    {
        let dirs = [];

        let rightX = Math.ceil((this.position.x + this.config.grid) / this.config.grid);
        let rightY = Math.ceil(this.position.y / this.config.grid);

        let downX = Math.ceil(this.position.x / this.config.grid);
        let downY = Math.ceil((this.position.y + this.config.grid) / this.config.grid);

        let leftX = Math.ceil((this.position.x - this.config.grid) / this.config.grid);
        let leftY = rightY;

        let upX = downX;
        let upY = Math.ceil((this.position.y - this.config.grid) / this.config.grid);
        
        if (this.currentMap[rightY] !== undefined 
            && this.currentMap[rightY][rightX] !== undefined 
            && this.currentMap[rightY][rightX] == 0) 
        {
            dirs.push("right");
        }
        if (this.currentMap[downY] !== undefined 
            && this.currentMap[downY][downX] !== undefined 
            && this.currentMap[downY][downX] == 0) 
        {
            dirs.push("down");
        }
        if (this.currentMap[leftY] !== undefined 
            && this.currentMap[leftY][leftX] !== undefined 
            && this.currentMap[leftY][leftX] == 0) 
        {
            dirs.push("left");
        }
        if (this.currentMap[upY] !== undefined 
            && this.currentMap[upY][upX] !== undefined 
            && this.currentMap[upY][upX] == 0) 
        {
            dirs.push("right");
        }

        console.log(dirs);
    }

    update(lag)
    {
        if (!this.isUse) return;

        this.move(lag);
    }

    render()
    {
        super.render();

        let pos = {x: Math.ceil((this.position.x + this.config.grid) / this.config.grid) * this.config.grid,
                   y: Math.ceil(this.position.y / this.config.grid) * this.config.grid};
        drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#fff");

        pos = {x: Math.ceil(this.position.x / this.config.grid) * this.config.grid,
               y: Math.ceil((this.position.y + this.config.grid) / this.config.grid) * this.config.grid};
        drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#ff7");
        

        // pos = {x: Math.ceil((this.position.x + this.config.grid * this.moveX) / this.config.grid) * this.config.grid, 
        //       y: Math.ceil((this.position.y + this.config.grid * this.moveY) / this.config.grid) * this.config.grid};
        // drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#007");
    }
}