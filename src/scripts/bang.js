import { drawSliceImage} from "./general.js";

export default class Bullet
{
    constructor(config, frames, size)
    {
        this.config = config;
        this.posX = 0;
        this.posY = 0;
        this.isUse = false;
        this.duration = 250; // ms
        this.timeCounter = 0;

        this.frames = frames;
        this.size = size;
    }

    create(pos)
    {
        this.posX = pos.x - this.size/2;
        this.posY = pos.y - this.size/2;
        this.isUse = true;
        this.timeCounter = 0;
    }

    update(lag)
    {
        this.timeCounter += lag;
        if (this.timeCounter >= this.duration) this.isUse = false;
    }

    render()
    {
        let pos = {x: this.posX, y: this.posY};
        drawSliceImage(this.config.ctxMain, this.config.atlas, pos, {x:this.size, y:this.size}, this.frames[Math.floor(this.timeCounter/(this.duration/this.frames.length))], {x: this.size, y:this.size});
    }
}