import Tank from "./tank.js";
import Timer from "./timer.js";

export default class PlayerTank extends Tank 
{
    constructor(config, spawnBullet, deadEvent, playerId)
    {
        super(config, spawnBullet);

        this.frames_up[2].src = playerId === 0 ?    "/Tanks2D/sprites/tank_Up.png"      : "/Tanks2D/sprites/tank2_Up.png";
        this.frames_up[1].src = playerId === 0 ?    "/Tanks2D/sprites/tank_Up2.png"     : "/Tanks2D/sprites/tank2_Up2.png";
        this.frames_up[0].src = playerId === 0 ?    "/Tanks2D/sprites/tank_Up3.png"     : "/Tanks2D/sprites/tank2_Up3.png";
        this.frames_down[2].src = playerId === 0 ?  "/Tanks2D/sprites/tank_Down.png"    : "/Tanks2D/sprites/tank2_Down.png";
        this.frames_down[1].src = playerId === 0 ?  "/Tanks2D/sprites/tank_Down2.png"   : "/Tanks2D/sprites/tank2_Down2.png";
        this.frames_down[0].src = playerId === 0 ?  "/Tanks2D/sprites/tank_Down3.png"   : "/Tanks2D/sprites/tank2_Down3.png";
        this.frames_right[2].src = playerId === 0 ? "/Tanks2D/sprites/tank_Right.png"   : "/Tanks2D/sprites/tank2_Right.png";
        this.frames_right[1].src = playerId === 0 ? "/Tanks2D/sprites/tank_Right2.png"  : "/Tanks2D/sprites/tank2_Right2.png";
        this.frames_right[0].src = playerId === 0 ? "/Tanks2D/sprites/tank_Right3.png"  : "/Tanks2D/sprites/tank2_Right3.png";
        this.frames_left[2].src = playerId === 0 ?  "/Tanks2D/sprites/tank_Left.png"    : "/Tanks2D/sprites/tank2_Left.png";
        this.frames_left[1].src = playerId === 0 ?  "/Tanks2D/sprites/tank_Left2.png"   : "/Tanks2D/sprites/tank2_Left2.png";
        this.frames_left[0].src = playerId === 0 ?  "/Tanks2D/sprites/tank_Left3.png"   : "/Tanks2D/sprites/tank2_Left3.png";

        this.speed = 0.005 * config.grid;

        this.isCooldown = false;
        this.cooldownTime = 1;
        this.timerShoot = new Timer(this.cooldownTime, () => {this.isCooldown = false;}, 0.1);

        this.deadEvent = deadEvent;
        this.playerId = playerId;
    }

    setReset()
    {
        this.dirX = 0;
        this.dirY = -1;
        this.moveX = 0;
        this.moveY = 0;
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
        if (!this.isUse) return;
        super.update(lag);
        this.move(lag);
    }
}