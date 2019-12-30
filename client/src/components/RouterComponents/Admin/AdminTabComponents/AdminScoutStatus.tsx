import * as React from "react";
import { Component } from "react";

import { Table, Icon } from "antd";

import { IAdminFormState, IAdminScoutStatus } from "../../../../reducers/admin";

interface IProps {
  formState: IAdminFormState;
  scoutStatus: IAdminScoutStatus;
}

export default class Home extends Component<IProps> {
  props: IProps;
  tableColumns = [
    {
      title: "Seed",
      dataIndex: "seed",
      key: "seed"
    },
    {
      title: "Team Number",
      dataIndex: "team",
      key: "team"
    },
    {
      title: "Scout",
      dataIndex: "scout",
      key: "scout"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    }
  ];

  constructor(props: IProps) {
    super(props);
  }

  getStatusIcon = (status: boolean) => {
    console.log(`STATUS IS ${status}`);

    return status === true ? (
      <span style={{ color: "#52c41a" }}>
        <Icon type="check" />
      </span>
    ) : (
      <span style={{ color: "#f5222d" }}>
        <Icon type="close" />
      </span>
    );
  };

  render() {
    const redData = [
      {
        key: "s1",
        seed: "1st Seed",
        team: this.props.formState["r-s1-team"],
        scout: this.props.formState["r-s1-scout"],
        status: this.getStatusIcon(this.props.scoutStatus["r-s1-scout"])
      },
      {
        key: "s2",
        seed: "2nd Seed",
        team: this.props.formState["r-s2-team"],
        scout: this.props.formState["r-s2-scout"],
        status: this.getStatusIcon(this.props.scoutStatus["r-s2-scout"])
      },
      {
        key: "s3",
        seed: "3rd Seed",
        team: this.props.formState["r-s3-team"],
        scout: this.props.formState["r-s3-scout"],
        status: this.getStatusIcon(this.props.scoutStatus["r-s3-scout"])
      }
    ];
    const blueData = [
      {
        key: "s1",
        seed: "1st Seed",
        team: this.props.formState["b-s1-team"],
        scout: this.props.formState["b-s1-scout"],
        status: this.getStatusIcon(this.props.scoutStatus["b-s1-scout"])
      },
      {
        key: "s2",
        seed: "2nd Seed",
        team: this.props.formState["b-s2-team"],
        scout: this.props.formState["b-s2-scout"],
        status: this.getStatusIcon(this.props.scoutStatus["b-s2-scout"])
      },
      {
        key: "s3",
        seed: "3rd Seed",
        team: this.props.formState["b-s3-team"],
        scout: this.props.formState["b-s3-scout"],
        status: this.getStatusIcon(this.props.scoutStatus["b-s3-scout"])
      }
    ];
    return (
      <div className="scout-status">
        <div className="scout-status__col">
          <h1 className="scout-status__heading red">Red</h1>
          <Table
            bordered={true}
            pagination={false}
            dataSource={redData}
            columns={this.tableColumns}
          />
        </div>
        <div className="scout-status__col">
          <h1 className="scout-status__heading blue">Blue</h1>
          <Table
            bordered={true}
            pagination={false}
            dataSource={blueData}
            columns={this.tableColumns}
          />
        </div>
      </div>
    );
  }
}
