/**
 * Represents a timer that can be used to keep track of passing time
 */
export default class Timer {
    t_start: [number, number] = [0, 0];
    t_end: [number, number] = [0, 0];

    /**
     * Starts the timer
     */
    start = (): void => {
        this.t_start = process.hrtime();
    };

    /**
     * Stops the timer
     */
    end = (): [number, number] => {
        this.t_end = process.hrtime(this.t_start);
        return this.t_end;
    };

    /**
     * Gets the ellapsed time from when start was last called
     * @returns the ellapsed time in seconds
     */
    getEllapsedTimeInSec = (): number => {
        return process.hrtime(this.t_start)[0];
    };

    /**
     * Gets the amount of time that is remaining from a fixed point in time
     * @param point - the point in time to count down from
     * @returns point - start
     */
    getEllapsedCountdownInSec = (point: number): number => {
        return point - process.hrtime(this.t_start)[0];
    };

    getEllapsedTimeInMs = (): number => {
        return this.nanoToMs(process.hrtime(this.t_start)[1]);
    };

    private nanoToMs = (nano: number): number => {
        return nano / 1000000;
    };
}
