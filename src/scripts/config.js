export default class Config 
{
    constructor(canvas)
    {
        
        this.grid = 20;
        this.grid2 = this.grid * 2;
        this.viewSize = {
            x: 26,
            y: 26
        };
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.viewSize.x * this.grid;
        this.canvas.height = this.viewSize.y * this.grid;
    }
}