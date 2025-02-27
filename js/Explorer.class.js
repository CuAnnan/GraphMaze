import {Skills} from "./Skills.class.js";

class Explorer
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
    signalDoneFunction;
    energy;
    hp;
    mp;
    skills;

    constructor(maze, signalDoneFunction = ()=>{console.log("Done")})
    {
        this.maze = maze;
        this.searchPath = [];
        this.current = maze.getStartCell();
        this.current.isVisiting = this.current.explored = true;
        this.searchPath.push(this.current);
        this.signalDoneFunction = signalDoneFunction;
        this.exploreDuration = 1;

        this.energy = 20;
        this.hp = 10;
        this.mp = 5;
        this.skills = {};
        let allSkills = Skills.getSkills();

        for(let skill in allSkills)
        {
            this.skills[skill] = Skills.getSkillByName(skill);
        }

    }

    getSkillByName(name)
    {
        return this.skills[name];
    }

    exploreStep()
    {
        let result = this.current.visit();
        for(let skill of result.skills)
        {
            console.log(skill);
            this.skills[skill.name].addXP(skill.xp);
        }



        if(this.current === this.maze.getEndCell())
        {
            this.signalDoneFunction();
            return true;
        }
        let neighbour = this.current.getRandomUnexploredNeighbour();

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
        return false;
    }
}

export default Explorer;