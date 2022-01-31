import type { NextPage } from "next";
import { Spin, Result, Row, Col } from "antd";
import { Table } from "../../components/Table";
import { Unit, useUnits } from "../../hooks/useUnits";
import Button from "antd-button-color";

import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

const moment = require("moment-timezone");
moment.tz("America/Los_Angeles");

const Units: NextPage = () => {
  const { data, isLoading, isFetching, error } = useUnits();

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
          Units
          {isFetching && <Spin style={{ marginLeft: ".5rem" }} size="small" />}
        </h1>
        <Link href="/units/create" passHref>
          <Button
            size="large"
            shape="round"
            icon={<PlusOutlined />}
            type="primary"
          >
            New Unit
          </Button>
        </Link>
      </div>
      {!error ? (
        <Table
          loading={isLoading}
          columns={data ? data.tableColumns : []}
          data={data ? data.tableData : []}
          rowKey={(record: Unit) => record.id}
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

export default Units;
