import MatchFormModel from './matchFormModel';
import MatchTimeSeriesModel from './matchTimeseriesModel';

// Conditionally import the correct model based on the mode from the launcher form
export default process.env.MODE === 'form'
    ? MatchFormModel
    : MatchTimeSeriesModel;
