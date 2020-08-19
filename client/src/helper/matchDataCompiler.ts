import RequestHandler from '../classes/RequestHandler';
import { DataState } from '../reducers/data';

/**
 * Asynchronously requests the team data from the API and compiles it into a format better suited for graphs via Plotly
 */
export async function compileData(): Promise<DataState> {
    // Initialize the request handler to pull from the API
    const requestHandler: RequestHandler = new RequestHandler('data/');
    const gameData = await requestHandler.get('games/');
    const teamData = await requestHandler.get('teams/');
    console.log(gameData);
    console.log(teamData);
    const games = gameData.data.data.games;
    const teams = teamData.data.data.teams;

    return { gameData: games, teamData: teams };
}
