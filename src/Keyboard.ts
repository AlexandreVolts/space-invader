export class Keyboard
{
    private readonly keyMap = new Map<string, boolean>();

    constructor()
    {
        window.addEventListener('keydown', this.handleKey);
        window.addEventListener('keyup', this.handleKey);
    }
    private handleKey = (e: KeyboardEvent) => {
        this.keyMap.set(e.key, e.type === 'keydown');
    }

    public isPressed(key: string): boolean {
        return (this.keyMap.get(key) ?? false);
    }
}