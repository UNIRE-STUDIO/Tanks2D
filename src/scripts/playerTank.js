import Tank from "./tank.js";
import Timer from "./timer.js";
import { getPosOnSliceImage } from "./general.js";

export default class PlayerTank extends Tank 
{
    constructor(config, spawnBullet, deadEvent, bangCreateEvent, playerId)
    {
        super(config, spawnBullet);

        this.frames_up[0] = playerId === 0 ?    getPosOnSliceImage(9,2,32) : getPosOnSliceImage(9,3,32);
        this.frames_up[1] = playerId === 0 ?    getPosOnSliceImage(10,2,32): getPosOnSliceImage(10,3,32);
        this.frames_up[2] = playerId === 0 ?    getPosOnSliceImage(11,2,32): getPosOnSliceImage(11,3,32);
        this.frames_down[0] = playerId === 0 ?  getPosOnSliceImage(0,2,32) : getPosOnSliceImage(0,3,32);
        this.frames_down[1] = playerId === 0 ?  getPosOnSliceImage(1,2,32) : getPosOnSliceImage(1,3,32);
        this.frames_down[2] = playerId === 0 ?  getPosOnSliceImage(2,2,32) : getPosOnSliceImage(2,3,32);
        this.frames_right[0] = playerId === 0 ? getPosOnSliceImage(6,2,32) : getPosOnSliceImage(6,3,32);
        this.frames_right[1] = playerId === 0 ? getPosOnSliceImage(7,2,32) : getPosOnSliceImage(7,3,32);
        this.frames_right[2] = playerId === 0 ? getPosOnSliceImage(8,2,32) : getPosOnSliceImage(8,3,32);
        this.frames_left[0] = playerId === 0 ?  getPosOnSliceImage(3,2,32) : getPosOnSliceImage(3,3,32);
        this.frames_left[1] = playerId === 0 ?  getPosOnSliceImage(4,2,32) : getPosOnSliceImage(4,3,32);
        this.frames_left[2] = playerId === 0 ?  getPosOnSliceImage(5,2,32) : getPosOnSliceImage(5,3,32);

        this.speed = 0.005 * config.grid;

        this.isCooldown = false;
        this.cooldownTime = 1;
        this.timerShoot = new Timer(this.cooldownTime, () => {this.isCooldown = false;}, 0.1);

        this.deadEvent = deadEvent;
        this.playerId = playerId;
        this.bangCreateEvent = bangCreateEvent;
    }

    setReset()
    {
        this.dirX = 0;
        this.dirY = -1;
        this.moveX = 0;
        this.moveY = 0;
        this.isUse = false;
        this.isCooldown = false;
        this.isPause = false;
        this.timerShoot.stop();
        this.timerShoot.reset();
    }

    setPause()
    {
        this.isPause = true;
        this.timerShoot.stop();
    }
    setResume()
    {
        this.isPause = false;
        this.timerShoot.start();
    }

    setDamage(damage)
    {
        this.health = this.health - damage <= 0 ? 0 : this.health - damage;
        if (this.health === 0)
        {
            this.isPause = true;
            this.bangCreateEvent({x: this.position.x + this.config.grid2/2, y: this.position.y + this.config.grid2/2});
            setTimeout(() => { // Уничтожение с задержкой
                this.setReset();
                this.deadEvent(this.playerId);
            }, 300);
        }
    }

    shoot()
    {
        if (this.isCooldown || this.isPause || !this.isUse) return;
                        // Смещаем на середину танка                 // Смещаем в сторону ствола от центра танка                   
        let centerPos = {x: this.position.x + this.config.grid2/2 + (this.config.grid2/2 * this.dirX), 
        y: this.position.y + this.config.grid2/2 + (this.config.grid2/2 * this.dirY)};
        this.spawnBullet(centerPos, {x: this.dirX, y: this.dirY}, true, this.playerId);
        this.isCooldown = true;
        this.timerShoot.reset();
        this.timerShoot.start();
    }

    move(lag)
    {
        let incrementX = this.moveX * lag * this.speed;
        let incrementY = this.moveY * lag * this.speed;
        if ((this.moveX == 0 && this.moveY == 0)
            || this.checkCollisionWithObstacle()
            || this.sortOtherTanks()
            || this.sortOtherObjects()) return; // Если выходим за границы карты
        
        this.position.x += incrementX;
        this.position.y += incrementY;
    }

    update(lag)
    {
        if (!this.isUse && !this.isPause) return;
        super.update(lag);
        this.move(lag);
    }
}