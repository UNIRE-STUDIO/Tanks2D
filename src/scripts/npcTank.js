import { drawRect, drawText, randomRange, coordinatesToId, idToCoordinates } from "./general.js";
import Tank from "./tank.js";

export default class NpcTank extends Tank 
{
    constructor(config, spawnBullet, player)
    {
        super(config, spawnBullet);
        this.dirY = 1;
        this.speed = 0.06; // 0.07
        this.timeOfModeChange = 23; // Длительность режима в секундах

        this.isBlockTurn = false;
        this.drivingMode = 0; // 0 =

        this.player = player;
        
        // ПОИСК | Это всё нужно обнулять
        this.stack = [];
        this.visited = [];
        this.whereFrom = new Map();
        this.path = [];
        this.target = [24,24];
        this.currentPosOnPath = 1; // Позиция на пути к цели

        this.sides = [[-2, 0], // слева
                      [0, -2], // сверху
                      [2, 0],  // справа
                      [0, 2]]; // снизу
    }

    create(currentMap, pos)
    {
        super.create(currentMap, pos);
        this.moveX = this.dirX;
        this.moveY = this.dirY;
        setInterval(() => {
            this.changeMode(this.drivingMode + 1 > 1 ? 0 : this.drivingMode + 1); // Циклически меняем режимы
        }, this.timeOfModeChange * 1000);
    }

    changeMode(id)
    {
        switch (id) {
            case 0:
                
                break;
        
            case 1:
                this.search([Math.round(this.player.position.x / this.config.grid), Math.round(this.player.position.y / this.config.grid)])
                break;

            case 2:
                
                break;
        }
        this.drivingMode = id;
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

    movingTowardsTheGoal(lag)
    {
        let accuracy = 5; // Точность
        let posOnPath = idToCoordinates(this.path[this.currentPosOnPath], this.currentMap[0].length);
        posOnPath.x *= this.config.grid;
        posOnPath.y *= this.config.grid;
        let distX = Math.abs(posOnPath.x - this.position.x) < accuracy ? 0 : posOnPath.x - this.position.x;
        let distY = Math.abs(posOnPath.y - this.position.y) < accuracy ? 0 : posOnPath.y - this.position.y;
        let newDirX = distX > 0 ? 1 : (distX < 0 ? -1 : 0);
        let newDirY = distY > 0 ? 1 : (distY < 0 ? -1 : 0);

        if (this.dirX != this.newDirX || this.dirY != this.newDirY)
        {
            this.setDirection(newDirX, newDirY);
        }

        let incrementX = this.dirX * lag * this.speed;
        let incrementY = this.dirY * lag * this.speed;

        this.position.x += incrementX;
        this.position.y += incrementY;

        if (Math.abs(posOnPath.x - this.position.x) < accuracy
            && Math.abs(posOnPath.y - this.position.y) < accuracy)
        {
            
            this.currentPosOnPath++;
            if (this.currentPosOnPath >= this.path.length)
            {
                // Завершаем путь
                this.drivingMode = 0;
            }
        }
    }

    search(target)
    {
        this.target = target; // Обнуление
        this.path = [];
        this.stack = [];
        this.visited = [];
        this.whereFrom.clear();
        this.currentPosOnPath = 1;

        this.identifyPrioritiesSides(); // Выбираем приоритетные направления поиска
        this.depthFirstSearch({ x: Math.round(this.position.x / this.config.grid), y: Math.round(this.position.y / this.config.grid)});
    }

    identifyPrioritiesSides()
    {
        let distX = this.player.position.x - this.position.x;
        let distY = this.player.position.y - this.position.y;
        // По горизонтали ближе
        if (Math.abs(distX) < Math.abs(distY)) 
        {
            
            this.sides[3] = [distX < 0 ? -1 : 1, 0];
            this.sides[2] = [0, distY < 0 ? -1 : 1];
            this.sides[1] = [distX < 0 ? 1 : -1, 0];
            this.sides[0] = [0, distY < 0 ? 1 : -1];
        }
        else // По вертикали ближе
        {
            this.sides[3] = [0, distY < 0 ? -1 : 1];
            this.sides[2] = [distX < 0 ? -1 : 1, 0];
            this.sides[1] = [0, distY < 0 ? 1 : -1];
            this.sides[0] = [distX < 0 ? 1 : -1, 0];
        }
    }

    saveWhereFrom(currentId, neighboringId) 
    {
        // Запоминаем откуда мы нашли эту клетку
        if (!this.whereFrom.has(neighboringId)) 
            this.whereFrom.set(neighboringId, currentId);
    }

    depthFirstSearch(pos)
    {
        let l = this.currentMap[0].length;
        this.visited.push(coordinatesToId(pos.x, pos.y, l));
        if (pos.x == this.target[0] && pos.y == this.target[1]
         || pos.x + 1 == this.target[0] && pos.y == this.target[1]
         || pos.x == this.target[0] && pos.y + 1 == this.target[1]
         || pos.x + 1 == this.target[0] && pos.y + 1 == this.target[1]
        ) // Дошли до цели
        {
            this.path.push(coordinatesToId(pos.x, pos.y, l));
            while(this.visited[0] !== this.path[this.path.length-1]) // Если дошли до старотовой позиции
            {
                this.path.push(this.whereFrom.get(this.path[this.path.length-1]));
            }
            this.path.reverse();
            return;
        }
        
        let x = 0;
        let y = 0;
        let priority = [];
        for (let i = 0; i < 4; i++) 
        {
            x = pos.x + this.sides[i][0];
            y = pos.y + this.sides[i][1];
            let getId = coordinatesToId(x, y, l); // Соседняя клетка
            if (this.currentMap[y] !== undefined
            && this.currentMap[y][x] !== undefined
            && this.currentMap[y + 1] !== undefined
            && this.currentMap[y + 1][x + 1] !== undefined
            && this.currentMap[y][x] == 0
            && this.currentMap[y][x + 1] == 0
            && this.currentMap[y + 1][x] == 0
            && this.currentMap[y + 1][x + 1] == 0
            && !this.visited.includes(getId))
            {
                if (!this.stack.includes(getId)) // Если клетка НЕ находится в очереди ставим её в приоритет
                {
                    this.saveWhereFrom(coordinatesToId(pos.x, pos.y, l), getId); // Сохраняем, что-бы в последствии построить "прямой" путь
                    priority.push(getId);
                    continue;
                }
                this.saveWhereFrom(coordinatesToId(pos.x, pos.y, l), getId);
                this.stack.push(getId);          // Если клетка находится в очереди добавляем её обычным образом
            }
        }
        this.stack.push(...priority);

        this.depthFirstSearch(idToCoordinates(this.stack.pop(), l));
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
            this.movingTowardsTheGoal(lag);
        }
    }

    render()
    {
        super.render();
        
        // for (let i = 0; i < this.path.length; i++) 
        // {
        //     let pos = {
        //                 x: idToCoordinates(this.path[i], this.currentMap[0].length).x * this.config.grid,
        //                 y: idToCoordinates(this.path[i], this.currentMap[0].length).y * this.config.grid
        //             }; 
        //     drawRect(this.config.ctx, pos, {x:this.config.grid-4, y:this.config.grid-4}, "#f7f");
        //     drawText(this.config.ctx, pos, ""+i);
        // }
    }
}