import type { NextPage } from "next";
import { Spin, Result, Row, Col } from "antd";
import { Table } from "../../components/Table";
import { Asset, useAssets } from "../../hooks/useAssets";
import Button from "antd-button-color";

import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

const moment = require("moment-timezone");
moment.tz("America/Los_Angeles");

const Assets: NextPage = () => {
  const { data, isLoading, isFetching, error } = useAssets();

  return (
    <Sidebar>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h1>
          Assets
          {isFetching && <Spin style={{ marginLeft: ".5rem" }} size="small" />}
        </h1>
        <Link href="/assets/create" passHref>
          <Button
            size="large"
            shape="round"
            icon={<PlusOutlined />}
            type="primary"
          >
            New Asset
          </Button>
        </Link>
      </div>
      {!error ? (
        <Table
          loading={isLoading}
          columns={data ? data.tableColumns : []}
          data={data ? data.tableData : []}
          rowKey={(record: Asset) => record.id}
          expandable={{
            expandedRowRender: (record: Asset) => (
              <Row gutter={20}>
                <Col span={4}>
                  <img width={200} src={record.image} alt={record.name} />
                </Col>
                <Col span={20}>
                  <Row gutter={20}>
                    <Col span={24}>
                      <strong>Sensors: </strong>
                      {record.sensors.join(", ")}
                    </Col>
                    <Col span={24}>
                      <strong>Healthscore: </strong>
                      {record.healthscore}%
                    </Col>
                    <Col span={24}>
                      <strong>Specifications: </strong>
                      <ul>
                        <li>
                          Maximum temperature: {record.specifications.maxTemp}
                          ºC
                        </li>
                        {!!record.specifications?.power && (
                          <li>Power: {record.specifications.power} kWh</li>
                        )}
                        {!!record.specifications?.rpm && (
                          <li>RPM: {record.specifications.rpm}</li>
                        )}
                      </ul>
                    </Col>
                    <Col span={24}>
                      <strong>Metrics: </strong>
                      <ul>
                        <li>
                          Total Collects Uptime:{" "}
                          {record.metrics.totalCollectsUptime}
                        </li>
                        <li>
                          Total Hours Collect Uptime:{" "}
                          {Math.round(record.metrics.totalUptime)}{" "}
                        </li>
                        <li>
                          Last Collect:{" "}
                          {String(
                            moment(record.metrics.lastUptimeAt).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )
                          )}
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ),
          }}
        />
      ) : (
        <div style={{ background: "#fff" }}>
          <Result
            status="warning"
            title="There are some problems with your operation."
          />
        </div>
      )}
    </Sidebar>
  );
};

export default Assets;
