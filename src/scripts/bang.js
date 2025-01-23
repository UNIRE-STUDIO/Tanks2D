import { getPosOnSliceImage, drawSliceImage} from "./general.js";

export default class Bullet
{
    constructor(config)
    {
        this.config = config;
        this.posX = 0;
        this.posY = 0;
        this.isUse = false;
        this.duration = 200; // ms
        this.timeCounter = 0;

        this.frames = [getPosOnSliceImage(4, 1, 16), getPosOnSliceImage(5, 1, 16), getPosOnSliceImage(6, 1, 16)];
        this.size = this.config.grid;
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
        drawSliceImage(this.config.ctx, this.config.atlas, pos, {x:this.size, y:this.size}, this.frames[Math.floor(this.timeCounter/(this.duration/this.frames.length))], {x: 16, y:16});
    }
}