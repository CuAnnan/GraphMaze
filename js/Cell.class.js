import Directions from "./Directions.class.js";
import {Skills} from "./Skills.class.js";

class Cell
{
    neighbours;
    walls;
    walked;
    openWalls;
    deadEnd;
    explored;
    x;
    y;
    isVisiting;
    contents;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.neighbours = {};
        for(let direction in Directions)
        {
            this.neighbours[direction] = null;
        }
        this.walls = {};
        this.openWalls = 0;
        this.deadEnd = false;
        for(let direction in Directions)
        {
            this.walls[direction] = true;
        }
        this.walked = false;
        this.explored = false;
        this.contents = [];
    }

    addEntity(entity)
    {
        this.contents.push(entity);
    }

    hasContents()
    {
        return this.contents.length > 0;
    }

    getContents()
    {
        return this.contents;
    }

    setNeighbour(direction, neighbour)
    {
        this.neighbours[direction.name] = neighbour;
        neighbour.neighbours[Directions.getOpposite(direction).name]= this;
    }

    getNeighbour(direction)
    {
        return this.neighbours[direction.name];
    }

    hasNeighbour(direction)
    {
        return this.neighbours[direction.name] !== null;
    }

    walk()
    {
        this.walked = true;
        // get a randomly chosen neighbour that has not been walked
        let unwalked = [];
        for(let direction in this.neighbours)
        {
            let neighbour = this.neighbours[direction];
            if(neighbour && !neighbour.walked)
            {
                unwalked.push(direction);
            }
        }
        // no unvisited neighbours
        if(unwalked.length === 0)
        {
            return;
        }
        let directionName = unwalked[Math.floor(Math.random() * unwalked.length)];

        let direction = Directions.byName(directionName);
        this.openWall(direction);
        let neighbour = this.getNeighbour(direction);
        neighbour.openWall(direction.opposite);
        neighbour.walk();

        this.walk();
    }

    getUnexploredNeighbours()
    {
        let unexplored = [];
        for(let direction in this.neighbours)
        {
            let neighbour = this.neighbours[direction];
            if(!this.walls[direction] && !neighbour.explored)
            {
                unexplored.push(neighbour);
            }
        }
        return unexplored;
    }

    hasExploredNeighbours()
    {
        return this.getUnexploredNeighbours().length > 0;
    }
    
    getRandomUnexploredNeighbour()
    {
        let unexplored = this.getUnexploredNeighbours();
        if(unexplored.length === 0)
        {
            return null;
        }
        return unexplored[Math.floor(Math.random() * unexplored.length)];
    }

    openWall(direction)
    {
        this.walls[direction.name] = false;
        this.openWalls ++;
    }



    hasWall(direction)
    {
        return this.walls[direction.name];
    }

    visit()
    {
        return {skills: [
            {name:Skills.getSkillByName("Exploring").name, xp:1},
            {name:Skills.getSkillByName("Speed").name, xp:1}
        ]};
    }
    
}

export default Cell;