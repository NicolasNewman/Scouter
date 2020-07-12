import * as React from 'react';
import { Component } from 'react';

import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

interface ConstrainedUploaderValue {
    fileList: UploadFile<any>[];
    head: UploadFile;
}

interface IProps {
    btnText: string;
    limit: number;
    value?: ConstrainedUploaderValue;
    onChange?: (value: ConstrainedUploaderValue) => void;
}

interface IState {
    fileList: UploadFile<any>[];
}

export default class ConstrainedUploader extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
        this.state = {
            fileList: []
        };
    }

    handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        let fileList = [...info.fileList];
        console.log(fileList);
        fileList = fileList.slice(-this.props.limit);
        console.log(fileList);

        this.setState({ fileList: fileList });

        console.log(this.props.value);
        console.log(info);
        this.props.onChange({ fileList, head: fileList[0] });
    };

    render() {
        return (
            <Upload onChange={this.handleChange} fileList={this.state.fileList}>
                <Button>
                    <UploadOutlined /> {this.props.btnText}
                </Button>
            </Upload>
        );
    }
}
