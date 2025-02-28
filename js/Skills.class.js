class Skill
{
    level;
    name;
    growthRate;
    xp;

    constructor(name, growthRate)
    {
        this.name = name;
        this.growthRate = growthRate;
        this.level = 1;
        this.xp = 0;
    }

    getLevel()
    {
        return this.level;
    }

    setXP(xp)
    {
        this.xp = parseInt(xp);
        this.level = 1 + Math.floor(Math.log10(this.xp));
    }

    addXP(xpAmount)
    {
        this.xp += xpAmount * this.growthRate;
        this.level = 1 + Math.max(0,Math.floor(Math.log10(this.xp)));
    }

    getXPToLevel()
    {
        return Math.pow(10, this.getLevel());
    }
}

class Skills
{
    static skills = {};

    static addSkill(skill)
    {
        this.skills[skill.name] = skill;
    }

    static getSkillByName(name)
    {
        return this.skills[name];
    }

    static getSkills()
    {
        return this.skills;
    }
}

Skills.addSkill(new Skill("Exploring", 1));
Skills.addSkill(new Skill("Speed", 0.5));

export {Skills, Skill};
export default Skill;
