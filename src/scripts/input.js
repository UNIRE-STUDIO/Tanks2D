export default class Input
{
    constructor()
    {
        document.addEventListener('keydown', (e) => this.setKeydown(e)); 
        document.addEventListener('keyup', (e) => this.setKeyup(e));

        this.changeScreenEvent;
        this.moveEvent;
        this.shootEvent;

        this.dirX = 0;
        this.dirY = 0;

        this.isUp = false;
        this.isDown = false;
        this.isRight = false;
        this.isLeft = false;
    }

    backButton_click()
    {
        this.changeScreenEvent(-1);
    }

    pause_click()
    {
        this.changeScreenEvent(2);
    }

    restart_click()
    {
        this.changeScreenEvent(1, 1); // Параметр 1 - начать уровень заново
    }

    resume_click()
    {
        this.changeScreenEvent(1, 2); // Параметр 2 - продолжить игру на уровне с сохранением результата
    }

    setKeydown(e)
    {   
        if (e.code === "Space")
        {
            this.shootEvent();
        }
        if (e.code === "ArrowRight")
        {
            this.dirY = 0;
            this.dirX = 1;
            this.isRight = true;
        }
        if (e.code === "ArrowLeft")
        {
            this.dirY = 0;
            this.dirX = -1;
            this.isLeft = true;
        }
        if (e.code === "ArrowUp")
        {
            this.dirX = 0;
            this.dirY = -1;
            this.isUp = true;
        }
        if (e.code === "ArrowDown")
        {
            this.dirX = 0;
            this.dirY = 1;
            this.isDown = true;
        }
        this.moveEvent(this.dirX, this.dirY);
    }

    setKeyup(e)
    {
        if (e.code === "ArrowRight")
        {
            this.dirX = 0;
            this.isRight = false;
        }
        if (e.code === "ArrowLeft")
        {
            this.dirX = 0;
            this.isLeft = false;
        }
        if (e.code === "ArrowUp")
        {
            this.dirY = 0;
            this.isUp = false;
        }
        if (e.code === "ArrowDown")
        {
            this.dirY = 0;
            this.isDown = false;
        }

        if (this.isRight) this.dirX = 1;
        else if (this.isLeft) this.dirX = -1;
        else if (this.isUp) this.dirY = -1;
        else if (this.isDown) this.dirY = 1;

        if (this.dirY != 0 && this.dirX != 0) this.dirY = 0;
        this.moveEvent(this.dirX, this.dirY);
    }
    
}