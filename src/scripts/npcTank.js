import { drawRect, randomRange, moveTo, coordinatesToId, idToCoordinates } from "./general.js";
import Tank from "./tank.js";

export default class NpcTank extends Tank 
{
    constructor(config, spawnBullet)
    {
        super(config, spawnBullet);
        this.dirY = 1;
        this.speed = 0.07;

        this.isBlockTurn = false;
        this.drivingMode = 0; // 0 =

        this.stack = [];
        this.visited = [];
        this.target = [0,0];
        this.counter = 0;
    }

    create(currentMap, pos)
    {
        super.create(currentMap, pos);
        this.moveX = this.dirX;
        this.moveY = this.dirY;
        setTimeout(() => {
            this.drivingMode = 1;
            this.depthFirstSearch([Math.floor(this.position.x / this.config.grid), Math.floor(this.position.y / this.config.grid)]);
        }, 10000);
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
                && this.currentMap[rightY+1] !== undefined
                && this.currentMap[rightY][rightX] == 0
                && this.currentMap[rightY+1][rightX] == 0) 
            {
                dirs.push([1,0]);
            }
            if (this.currentMap[leftY] !== undefined 
                && this.currentMap[leftY][leftX] !== undefined 
                && this.currentMap[leftY+1] !== undefined
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
                && this.currentMap[downY][downX+1] !== undefined 
                && this.currentMap[downY][downX] == 0
                && this.currentMap[downY][downX+1] == 0) 
            {
                dirs.push([0,1]);
            }
            if (this.currentMap[upY] !== undefined 
                && this.currentMap[upY][upX] !== undefined
                && this.currentMap[upY][upX+1] !== undefined
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

    randomMove(lag)
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

        if (Math.floor((this.position.x - incrementX) / this.config.grid2) != Math.floor(this.position.x / this.config.grid2)
            || Math.floor((this.position.y - incrementY) / this.config.grid2) != Math.floor(this.position.y / this.config.grid2))
        {
            if (randomRange(0, 8) == 0) this.tryTurn();
            this.isBlockTurn = true;
            setTimeout(() => {this.isBlockTurn = false}, 600);
        }
    }

    movingTowardsTheGoal()
    {
        //moveTo(this.position, this.visited.get);
    }

    depthFirstSearch(pos)
    {
        let l = this.currentMap[0].length;
        this.visited.push(coordinatesToId(pos[0], pos[1], l));
        if (pos[0] == this.target[0] && pos[1] == this.target[1])
        {
            console.log(this.visited);
            return;
        }
        if (this.currentMap[pos[1]][pos[0] - 2] !== undefined // Проверяем слева
         && this.currentMap[pos[1]][pos[0] - 2] == 0
         && !this.visited.includes(coordinatesToId(pos[0] - 2, pos[1], l)))
        {
            this.stack.push([pos[0] - 2, pos[1]]);
        }
        if (this.currentMap[pos[1] - 2] !== undefined // Проверяем сверху
         && this.currentMap[pos[1] - 2][pos[0]] == 0
         && !this.visited.includes(coordinatesToId(pos[0], pos[1] - 2, l)))
        {
            this.stack.push([pos[0], pos[1] - 2]);
        }
        if (this.currentMap[pos[1]][pos[0] + 2] !== undefined // Проверяем справа
         && this.currentMap[pos[1]][pos[0] + 2] == 0
         && !this.visited.includes(coordinatesToId(pos[0] + 2, pos[1], l)))
        {
            this.stack.push([pos[0] + 2, pos[1]]);
        }
        if (this.currentMap[pos[1] + 2] !== undefined // Проверяем снизу
         && this.currentMap[pos[1] + 2][pos[0]] == 0
         && !this.visited.includes(coordinatesToId(pos[0], pos[1] + 2, l)))
        {
            this.stack.push([pos[0], pos[1] + 2]);
        }
        this.depthFirstSearch(this.stack.pop());
    }

    update(lag)
    {
        if (!this.isUse) return;

        if (this.drivingMode == 0)
        {
            this.randomMove(lag);
        }
        else
        {
            this.movingTowardsTheGoal();
        }
    }

    render()
    {
        super.render();
        
        for (let i = 0; i < this.visited.length; i++) {
            let pos = {
                        x: idToCoordinates(this.visited[i], this.currentMap[0].length).x * this.config.grid,
                        y: idToCoordinates(this.visited[i], this.currentMap[0].length).y * this.config.grid
                    }; 
            drawRect(this.config.ctx, pos, {x:this.config.grid, y:this.config.grid}, "#"+i);
        }
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