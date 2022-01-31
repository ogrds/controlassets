import { Col, Row } from "antd";
import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";

import { Select } from "../components/Forms/Select";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { columnChartOptions } from "../utils/generateChartData";
import { useAssets } from "../hooks/useAssets";

const Home: NextPage = () => {
  const { data } = useAssets();

  const status = {
    categories: ["inAlert", "inOperation", "inDowntime"],
    inAlert: 0,
    inOperation: 0,
    inDowntime: 0,
  };

  const company = {
    categories: ["Empresa Teste"],
    total: 0,
  };

  const unit = {
    categories: ["Unidade Jaguar", "Unidade Tobias"],
    total1: 0,
    total2: 0,
  };

  data?.assets.map((asset) => {
    if (asset.status === "inAlert") status.inAlert++;
    else if (asset.status === "inOperation") status.inOperation++;
    else status.inDowntime++;
  });

  data?.assets.map((asset) => {
    if (asset.companyId) company.total++;
  });

  data?.assets.map((asset) => {
    if (asset.unitId === 1) unit.total1++;
    if (asset.unitId === 2) unit.total1++;
  });

  return (
    <Sidebar>
      <Row gutter={20}>
        <Col span={24}>
          <h2>Assets by Status</h2>
          <div style={{ background: "#fff", padding: "2rem" }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={columnChartOptions({
                categories: status.categories,
                series: [
                  {
                    showInLegend: false,
                    name: "Assets",
                    data: [
                      status.inAlert,
                      status.inOperation,
                      status.inDowntime,
                    ],
                  },
                ],
              })}
            />
          </div>
        </Col>
        <Col style={{ marginTop: "1rem" }} span={12}>
          <h2>Assets by Company</h2>
          <div style={{ background: "#fff", padding: "2rem" }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={columnChartOptions({
                categories: company.categories,
                series: [
                  {
                    showInLegend: false,
                    name: "Assets",
                    data: [company.total],
                  },
                ],
              })}
            />
          </div>
        </Col>
        <Col style={{ marginTop: "1rem" }} span={12}>
          <h2>Assets Maximum temperature</h2>
          <div style={{ background: "#fff", padding: "2rem" }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={columnChartOptions({
                categories: unit.categories,
                series: [
                  {
                    showInLegend: false,
                    name: "Assets",
                    data: [unit.total1, unit.total2],
                  },
                ],
              })}
            />
          </div>
        </Col>
      </Row>
    </Sidebar>
  );
};

export default Home;
