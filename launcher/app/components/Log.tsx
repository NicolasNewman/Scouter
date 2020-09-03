import * as React from 'react';
import { LogEvents } from '../reducers/log';

// import { Input } from 'antd';

// const { TextArea } = Input;

interface IProps {
    events: LogEvents;
}

const Log: React.FC<IProps> = ({ events }) => {
    return (
        <div className="logfc">
            {events.map(event => (
                <div>
                    {''}
                    <span
                        className={
                            event.level === 'ERROR' ? 'log--error' : event.level === 'WARNING' ? 'log--warning' : ''
                        }
                    >
                        {event.message}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Log;
