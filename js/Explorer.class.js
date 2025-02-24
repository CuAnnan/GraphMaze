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

    constructor(maze, signalDoneFunction = ()=>{console.log("Done")})
    {
        this.maze = maze;
        this.searchPath = [];
        this.current = maze.getStartCell();
        this.current.isVisiting = this.current.explored = true;
        this.searchPath.push(this.current);
        this.signalDoneFunction = signalDoneFunction;
        this.exploreDuration = 1;
    }

    exploreStep()
    {
        if(this.current === this.maze.getEndCell())
        {
            this.signalDoneFunction();
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

export default Explorer;