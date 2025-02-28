import {Skills} from "./Skills.class.js";
import Signaller from "./Signaller.class.js";

const ExplorerEvents = {
    mazeExplored:'mazeExplored',
    explorerSkillIncreased:'explorerSkillIncreased',
};

class Explorer extends Signaller
{
    /**
     * @type {Maze}
     */
    maze;
    searchPath;
    /**
     * @type {Cell}
     */
    current;
    exploreDuration;
    energy;
    hp;
    mp;
    skills;

    constructor(maze)
    {
        super();
        this.setMaze(maze);
        this.exploreDuration = 1;
        this.energy = 20;
        this.hp = 10;
        this.mp = 5;
        this.skills = {};
    }

    setMaze(maze)
    {
        this.searchPath = [];
        this.maze = maze;
        this.current = maze.getStartCell();
        this.current.isVisiting = this.current.explored = true;
        this.searchPath.push(this.current);
    }

    getSkillByName(name)
    {
        return this.skills[name];
    }

    improveSkill(skill)
    {
        if(!this.skills[skill.name])
        {
            let skillCopy = Object.create(Skills.getSkillByName(skill.name));
            this.skills[skillCopy.name] =skillCopy;
            this.signal(ExplorerEvents.explorerSkillIncreased, skillCopy);
        }
        this.skills[skill.name].addXP(skill.xp);
    }

    exploreStep()
    {
        let result = this.current.visit();

        for(let skill of result.skills)
        {
            this.improveSkill(skill);
        }

        if(this.current === this.maze.getEndCell())
        {
            this.signal(ExplorerEvents.mazeExplored);
            return true;
        }
        let neighbour = this.current.getRandomUnexploredNeighbour();
        this.current.isVisiting = false;

        if(neighbour !== null)
        {
            neighbour.explored = true;
            this.searchPath.push(neighbour);
            this.current = neighbour;
        }
        else
        {
            this.current.deadEnd = true;
            this.searchPath.pop();
            this.current = this.searchPath[this.searchPath.length - 1];
        }
        this.current.isVisiting = true;

        return false;
    }
}

export {Explorer, ExplorerEvents};

export default Explorer;