import levels from "./levels.json";

export default class Config 
{
    constructor(canvas)
    {
        this.grid = 32;
        this.grid2 = this.grid * 2;
        this.viewSize = {
            x: levels[0].map[0].length,
            y: levels[0].map.length
        };
        this.canvasMain = canvas;
        this.ctxMain = this.canvasMain.getContext('2d');
        this.updateParams();

        this.atlas = new Image();
        this.atlas.src = "/Tanks2D/sprites/atlas.png";
        this.atlasGrid = 16;
    }

    updateParams(){
        this.grid2 = this.grid * 2;
        this.canvasMain.width = this.viewSize.x * this.grid;
        this.canvasMain.height = this.viewSize.y * this.grid;
    }
}