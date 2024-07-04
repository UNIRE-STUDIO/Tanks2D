import { drawImage} from "./general.js";

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

        this.frames = [new Image(), new Image(), new Image()];
        this.frames[0].src = "/Tanks2D/sprites/bang0.png";
        this.frames[1].src = "/Tanks2D/sprites/bang1.png";
        this.frames[2].src = "/Tanks2D/sprites/bang2.png";
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
        drawImage(this.config.ctx, this.frames[Math.floor(this.timeCounter/(this.duration/this.frames.length))], pos, {x:this.size, y:this.size});
    }
}