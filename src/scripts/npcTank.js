import { drawRect, drawText, randomRange, coordinatesToId, idToCoordinates } from "./general.js";
import Tank from "./tank.js";
import Timer from "./timer.js";

export default class NpcTank extends Tank 
{
    constructor(config, spawnBullet, players, deadNpcEvent)
    {
        super(config, spawnBullet);
        this.dirY = 1;
        this.speed = 0.06; // 0.07
        this.timeOfModeChange = 23; // Длительность режима в секундах

        this.isBlockTurn = false;
        this.drivingMode = 0; // 0 =

        this.players = players;
        this.deadNpcEvent = deadNpcEvent;

        this.image_up.src = "/Tanks2D/sprites/TankNpc_Up.png";
        this.image_down.src = "/Tanks2D/sprites/TankNpc_Down.png";
        this.image_right.src = "/Tanks2D/sprites/TankNpc_Right.png";
        this.image_left.src = "/Tanks2D/sprites/TankNpc_Left.png";
        
        // ПОИСК | Это всё нужно обнулять
        this.stack = [];
        this.visited = [];
        this.whereFrom = new Map();
        this.path = [];
        this.target = [];
        this.currentPosOnPath = 0; // Позиция на пути к цели

        this.sides = [[-2, 0], // слева
                      [0, -2], // сверху
                      [2, 0],  // справа
                      [0, 2]]; // снизу
        
        this.timerDrivingMode = new Timer(this.timeOfModeChange, this.changeMode.bind(this));

        this.timerOfJamming = 0; // Застревание
        this.timeWaitOfJamming = randomRange(100, 1500);

        this.minCooldownTime = 1;
        this.maxCooldownTime = 5;
        this.timerShoot = new Timer(randomRange(this.minCooldownTime, this.maxCooldownTime), this.randomShoot.bind(this));
    }

    create(currentMap, pos)
    {
        super.create(currentMap, pos);
        this.moveX = this.dirX;
        this.moveY = this.dirY;
        this.drivingMode = 0;
        this.timerDrivingMode.reset();
        this.timerDrivingMode.start();
        this.timerShoot.reset();
        this.timerShoot.start();
    }

    setReset()
    {
        this.isUse = false;
        this.timerDrivingMode.stop();
        this.timerDrivingMode.reset();
        this.timerShoot.reset();
        this.timerShoot.stop();
    }

    setPause()
    {
        this.timerShoot.stop();
        this.timerDrivingMode.stop();
    }

    setResume()
    {
        this.timerShoot.start();
        this.timerDrivingMode.start();
    }

    changeMode()
    {
        this.drivingMode = this.drivingMode + 1 > 1 ? 0 : this.drivingMode + 1;
        this.timerOfJamming = 0;
        let id = randomRange(0,2);
        switch (this.drivingMode) {
            case 0:
                
                break;
        
            case 1:
                this.search([Math.round(this.players[id].position.x / this.config.grid), Math.round(this.players[id].position.y / this.config.grid)], id);
                break;

            case 2:
                
                break;
        }
        this.timerDrivingMode.reset();
        this.timerDrivingMode.start();
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

    tryTurnAnywhere()
    {
        let dirs = [];

        if (this.dirY != 0) 
        {
            let rightX = Math.round((this.position.x + this.config.grid * 2) / this.config.grid);
            let rightY = Math.round(this.position.y / this.config.grid);

            let leftX = Math.round((this.position.x - this.config.grid) / this.config.grid);
            let leftY = rightY;

            if (this.currentMap[rightY] !== undefined 
            && this.currentMap[rightY][rightX] !== undefined 
            && this.currentMap[rightY+1] !== undefined)
            {
                dirs.push([1,0]);
            }

            if (this.currentMap[leftY] !== undefined 
                && this.currentMap[leftY][leftX] !== undefined 
                && this.currentMap[leftY+1] !== undefined) 
            {
                dirs.push([-1,0]);
            }
        }
        else if (this.dirX != 0)
        {
            let downX = Math.round(this.position.x / this.config.grid);
            let downY = Math.round((this.position.y + this.config.grid * 2) / this.config.grid);

            let upX = downX;
            let upY = Math.round((this.position.y - this.config.grid) / this.config.grid);

            if (this.currentMap[downY] !== undefined 
                && this.currentMap[downY][downX] !== undefined
                && this.currentMap[downY][downX+1] !== undefined) 
            {
                dirs.push([0,1]);
            }
            if (this.currentMap[upY] !== undefined 
                && this.currentMap[upY][upX] !== undefined
                && this.currentMap[upY][upX+1] !== undefined) 
            {
                dirs.push([0,-1]);
            }  
        }
        if (randomRange(0, 6) == 0) // разворачиваемся по вероятности или при отсутствии доступного пространства
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

        if (!this.checkCollisionWithObstacle() 
            && !this.sortOtherTanks()
            && !this.checkCollisionWithTank(this.players[0])
            && !this.checkCollisionWithTank(this.players[1])) // Игрока можно обрабатывать отдельно
        {
            this.position.x += incrementX;
            this.position.y += incrementY;
        }
        else
        {
            this.timerOfJamming += lag;
            if (this.timerOfJamming >= this.timeWaitOfJamming) // Если мы застряли дольше определенного времени
            {
                this.timeWaitOfJamming = randomRange(100, 1000); // Время следующего застревания
                this.timerOfJamming = 0;
                this.tryTurn();
            }
            return;
        }

        if (Math.floor((this.position.x - incrementX) / this.config.grid2) != Math.floor(this.position.x / this.config.grid2)
            || Math.floor((this.position.y - incrementY) / this.config.grid2) != Math.floor(this.position.y / this.config.grid2))
        {
            if (randomRange(0, 7) == 0) this.tryTurnAnywhere();
            this.isBlockTurn = true;
            setTimeout(() => {this.isBlockTurn = false}, 600);
        }
    }

    movingTowardsTheGoal(lag)
    {
        let accuracy = 8; // Точность
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

        if (this.sortOtherTanks() 
            || this.checkCollisionWithTank(this.players[0])
            || this.checkCollisionWithTank(this.players[1]))
        {
            this.timerOfJamming += lag;
            if (this.timerOfJamming >= 1500) // Если мы застряли дольше определенного времени
            {
                this.timerOfJamming = 0;
                this.changeMode(); // Потенциально может быть проблема, когда после застревания
            }                      // в режим преследования игрока мы переходим к следованию на базу, т.е. будем мяться на месте
            return;
        }
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

    search(target, id)
    {
        this.target = target; // Обнуление
        this.path = [];
        this.stack = [];
        this.visited = [];
        this.whereFrom.clear();
        this.currentPosOnPath = 1;

        this.identifyPrioritiesSides(id); // Выбираем приоритетные направления поиска
        this.depthFirstSearch({ x: Math.round(this.position.x / this.config.grid), y: Math.round(this.position.y / this.config.grid)});
    }

    identifyPrioritiesSides(id)
    {
        let distX = this.players[id].position.x - this.position.x;
        let distY = this.players[id].position.y - this.position.y;
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
        if (this.stack.length === 0) // Если поиск зашёл в тупик
        {
            this.changeMode();
            return;
        }
        this.depthFirstSearch(idToCoordinates(this.stack.pop(), l));
    }

    setDamage(damage)
    {
        this.health = this.health - damage <= 0 ? 0 : this.health - damage;
        if (this.health === 0)
        {
            this.setReset();
            this.deadNpcEvent();
        }
    }

    randomShoot()
    {
        this.shoot();
        this.timerShoot.seconds = randomRange(this.minCooldownTime, this.maxCooldownTime);
        this.timerShoot.reset();
        this.timerShoot.start();
    }

    shoot()
    {
        if (this.isPause || !this.isUse) return;
        let centerPos = {x: this.position.x + this.config.grid/2 + (this.dirX * this.config.grid), 
        y: this.position.y + this.config.grid/2 + (this.dirY * this.config.grid)};
        this.spawnBullet(centerPos, {x: this.dirX, y: this.dirY}, false);
    }

    update(lag)
    {
        if (!this.isUse) return;
        this.moveX = this.dirX;
        this.moveY = this.dirY;
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