import { drawImage} from "./general.js";

export default class Bullet
{
    constructor(config)
    {
        this.config = config;
        this.posX = 0;
        this.posY = 0;
        this.isUse = false;
        this.duration = 0.2;
        this.timeCounter;

        this.frames = [new Image(), new Image(), new Image()];
        this.frames[0].src = "/Tanks2D/sprites/bang0.png";
        this.frames[1].src = "/Tanks2D/sprites/bang1.png";
        this.frames[2].src = "/Tanks2D/sprites/bang2.png";
    }

    create(pos, dir)
    {
        this.posX = pos.x - this.size/2;
        this.posY = pos.y - this.size/2;
        this.dirY = dir.y;
        this.dirX = dir.x;
        this.isUse = true;
    }

    render(lag)
    {
        let pos = {x: this.posX, y: this.posY};


        drawImage(this.config.ctx, this.image_right, pos, {x:this.size, y:this.size});
    }
}