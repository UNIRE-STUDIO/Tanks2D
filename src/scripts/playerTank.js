import { drawRect, drawText, randomRange, coordinatesToId, idToCoordinates } from "./general.js";
import Tank from "./tank.js";
import Timer from "./timer.js";

export default class PlayerTank extends Tank 
{
    constructor(config, spawnBullet, deadEvent, playerId)
    {
        super(config, spawnBullet);

        this.image_up.src = "/Tanks2D/sprites/Tank_Up.png";
        this.image_down.src = "/Tanks2D/sprites/Tank_Down.png";
        this.image_right.src = "/Tanks2D/sprites/Tank_Right.png";
        this.image_left.src = "/Tanks2D/sprites/Tank_Left.png";

        this.speed = 0.1;

        this.isCooldown = false;
        this.cooldownTime = 1;
        this.timerShoot = new Timer(this.cooldownTime, () => {this.isCooldown = false;});

        this.deadEvent = deadEvent;
        this.playerId = playerId;
    }

    setReset()
    {
        this.isUse = false;
        this.isCooldown = false;
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
            this.setReset();
            this.deadEvent(this.playerId);
        }
    }

    shoot()
    {
        if (this.isCooldown || this.isPause || !this.isUse) return;
        let centerPos = {x: this.position.x + this.config.grid/2 + (this.dirX * this.config.grid), 
        y: this.position.y + this.config.grid/2 + (this.dirY * this.config.grid)};
        this.spawnBullet(centerPos, {x: this.dirX, y: this.dirY}, true);
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
            || this.sortOtherTanks()) return; // Если выходим за границы карты
        
        this.position.x += incrementX;
        this.position.y += incrementY;
    }

    update(lag)
    {
        if (!this.isUse) return;
        this.move(lag);
    }
}