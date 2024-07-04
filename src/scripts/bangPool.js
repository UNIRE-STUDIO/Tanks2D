import Bang from "./bang.js";

export default class BangPool
{
    constructor(config)
    {
        this.config = config;

        const pool_size = 12;
        this.bangs = [];

        for (let i = 0; i < pool_size; i++) 
        {
            this.bangs[i] = new Bang(this.config);
        }
    }

    create(pos)
    {
        for (let i = 0; i < this.bangs.length; i++) {
            if (!this.bangs[i].isUse)
            {
                this.bangs[i].create(pos);
                return;
            }
        }
        console.log("BangPool переполнен");
    }

    setReset()
    {
        for (let i = 0; i < this.bangs.length; i++) 
        {
            this.bangs[i].isUse = false;
        }
    }

    update(lag)
    {
        for (let i = 0; i < this.bangs.length; i++) {
            if (this.bangs[i].isUse)
            {
                this.bangs[i].update(lag);
            }
        }
    }

    render()
    {
        for (let i = 0; i < this.bangs.length; i++) {
            if (this.bangs[i].isUse)
            {
                this.bangs[i].render();
            }
        }
    }
}