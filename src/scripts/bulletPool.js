import Bullet from "./bullet.js";

export default class BulletPool
{
    constructor(config, currentMap)
    {
        this.config = config;
        this.currentMap = currentMap;

        const pool_size = 12;
        this.bullets = [];

        for (let i = 0; i < pool_size; i++) 
        {
            this.bullets[i] = new Bullet(this.config, this.currentMap);
        }
    }

    create(pos, dir)
    {
        for (let i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].isUse)
            {
                this.bullets[i].create(pos, dir);
                return;
            }
        }
        console.log("BulletPool переполнен");
    }

    update(lag)
    {
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].isUse)
            {
                this.bullets[i].update(lag);
            }
        }
    }

    render()
    {
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].isUse)
            {
                this.bullets[i].render();
            }
        }
    }
}