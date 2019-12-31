import RequestHandler from "../classes/RequestHandler";
import { ICompetitionData, IMatch, IStatisticData } from "../reducers/data";

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

export async function compileData(): Promise<ICompetitionData> {
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

export function calculateAverage(
  competitionData: ICompetitionData
): IStatisticData {
  const statisticData: IStatisticData = {};
  // Loop through the data for each team
  for (let teamKey in competitionData) {
    statisticData[teamKey] = generateMatchData(0);

    // Loop through the match data for a team
    let i = 0;
    competitionData[teamKey].forEach((match: IMatch) => {
      let matchKey: keyof IMatch;

      // Loop through the match fields for a match
      for (matchKey in match) {
        if (typeof statisticData[teamKey][matchKey] === "number") {
          statisticData[teamKey][matchKey] =
            statisticData[teamKey][matchKey] +
            competitionData[teamKey][i][matchKey];
        }
      }
      i++;
    });
  }

  return statisticData;
}

export function calculateExtrema(
  competitionData: ICompetitionData,
  extrema: "max" | "min"
): IStatisticData {
  const statisticData: IStatisticData = {};
  const extremaFunc = extrema === "max" ? Math.max : Math.min;
  // Loop through the data for each team
  for (let teamKey in competitionData) {
    statisticData[teamKey] = generateMatchData(
      extrema === "max" ? Number.MIN_VALUE : Number.MAX_VALUE
    );

    // Loop through the match data for a team
    let i = 0;
    competitionData[teamKey].forEach((match: IMatch) => {
      let matchKey: keyof IMatch;

      // Loop through the match fields for a match
      for (matchKey in match) {
        if (typeof statisticData[teamKey][matchKey] === "number") {
          statisticData[teamKey][matchKey] = extremaFunc(
            statisticData[teamKey][matchKey],
            competitionData[teamKey][i][matchKey]
          );
        }
      }
      i++;
    });
  }

  return statisticData;
}
