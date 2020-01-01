import RequestHandler from "../classes/RequestHandler";
import { ICompetitionData, IMatch, IStatisticData } from "../reducers/data";

/**
 * Initializes an object following the Match interface
 * @param defaultNum the number to initialize the fields to
 */
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

/**
 * Asynchronously requests the team data from the API and compiles it into a format better suited for graphs via Plotly
 */
export async function compileData(): Promise<ICompetitionData> {
  // Initialize the request handler to pull from the API
  const requestHandler: RequestHandler = new RequestHandler("data/");
  const data = await requestHandler.get("teams/");
  const teams = data.data.data.teams;

  const competitionData: ICompetitionData = {};

  // Loop through each team
  teams.forEach((team: any) => {
    // Initialize the array for a specific team
    competitionData[team.teamNumber] = [];
    // Add the matches to the previously initalized array
    team.matches.forEach((match: IMatch) => {
      competitionData[team.teamNumber].push(match);
    });
  });

  return competitionData;
}

/**
 * Calculates the average for each matching field in an object array
 * @param competitionData - an array of matches
 */
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

/**
 * Finds the extrema (min / max) for each matching field in an object array
 * @param competitionData - an array of matches
 * @param extrema - wheather to find the "min" or "max" of the field
 */
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
