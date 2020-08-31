import * as React from 'react';
// import { Input } from 'antd';

// const { TextArea } = Input;

interface IProps {
    text: string;
}

const Log: React.FC<IProps> = ({ text }) => {
    return <div className="logfc">{text}</div>;
};

export default Log;
