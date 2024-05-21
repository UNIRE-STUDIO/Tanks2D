export default class Config 
{
    constructor(canvas)
    {
        this.grid = 32;
        this.viewSize = {
            x: 13,
            y: 13
        };
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.viewSize.x * this.grid;
        this.canvas.height = this.viewSize.y * this.grid;
    }
}