class SignallerClass
{
    constructor()
    {
        this.callbacks = {};
    }

    signal(event, ...eventArgs)
    {
        for(let callback of this.callbacks[event])
        {
            callback(this, ...eventArgs);
        }
    }

    on(event, callback)
    {
        if(!this.callbacks[event])
        {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }
}

export default SignallerClass;