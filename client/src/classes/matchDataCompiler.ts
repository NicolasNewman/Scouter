import RequestHandler from "./RequestHandler";

interface IMatch {
  csHatch: number;
  csCargo: number;
  r1Hatch: number;
  r2Hatch: number;
  r3Hatch: number;
  r1Cargo: number;
  r2Cargo: number;
  r3Cargo: number;
  // [other: string]: any;
}

type TeamData = Array<IMatch>;

interface ICompetitionData {
  [team: string]: TeamData;
}

function generateMatchData(defaultNum: number): IMatch {
  return {
    csHatch: defaultNum,
    csCargo: defaultNum,
    r1Hatch: defaultNum,
    r2Hatch: defaultNum,
    r3Hatch: defaultNum,
    r1Cargo: defaultNum,
    r2Cargo: defaultNum,
    r3Cargo: defaultNum
  };
}

export default async function compileData(): Promise<ICompetitionData> {
  const requestHandler: RequestHandler = new RequestHandler("data/");
  const data = await requestHandler.get("teams/");
  const teams = data.data.data.teams;

  const competitionData: ICompetitionData = {};

  teams.forEach((team: any) => {
    competitionData[team.teamNumber] = [];
    team.matches.forEach((match: IMatch) => {
      competitionData[team.teamNumber].push(match);
    });
  });

  return competitionData;
}
