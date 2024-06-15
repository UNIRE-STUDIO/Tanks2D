export default class Timer
{
    constructor(seconds, endEvent)
    {
        this.seconds = seconds;
        this.endEvent = endEvent;
        this.timer = seconds;

        this.interval = null;
    }

    reset()
    {
        this.timer = this.seconds;
    }

    start()
    {
        if (this.interval !== undefined) this.stop();
        this.interval = setInterval(() => {
            if (--this.timer <= 0) this.endEvent();
        }, 1000)
    }

    stop()
    {
        if (this.interval != null)  clearInterval(this.interval);
    }
}