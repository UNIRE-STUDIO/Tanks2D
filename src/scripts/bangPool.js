import Bang from "./bang.js";
import { getPosOnSliceImage } from "./general.js";

export default class BangPool
{
    constructor(config, size = config.grid, frames = [getPosOnSliceImage(4, 1, 16), getPosOnSliceImage(5, 1, 16), getPosOnSliceImage(6, 1, 16)])
    {
        this.config = config;
        this.frames = frames;

        const pool_size = 12;
        this.bangs = [];

        for (let i = 0; i < pool_size; i++) 
        {
            this.bangs[i] = new Bang(this.config, this.frames, size);
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