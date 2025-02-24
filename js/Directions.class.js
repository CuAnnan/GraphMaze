class Direction
{
    name;
    #opposite;

    constructor(name)
    {
        this.name = name;
        this.#opposite = null;
    }

    set opposite(oppositeDirection)
    {
        this.#opposite = oppositeDirection;
    }

    get opposite()
    {
        return this.#opposite;
    }
}

class Directions
{
    static getDirectionByName(name)
    {
        return Directions[name];
    }

    static getOpposite(direction)
    {
        return Directions[direction.name].opposite;
    }

    static getRandomDirection()
    {
        let directions = ["North", "South", "East", "West"];
        return Directions[Math.floor(Math.random() * directions.length)];
    }

    static byName(name)
    {
        return Directions.getDirectionByName(name);
    }
}
Directions.North = new Direction("North");
Directions.South = new Direction("South");
Directions.East  = new Direction("East");
Directions.West  = new Direction("West");
Directions.North.opposite = Directions.South;
Directions.South.opposite = Directions.North;
Directions.East.opposite =  Directions.West;
Directions.West.opposite =  Directions.East;


export default Directions;