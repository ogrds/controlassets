import type { NextPage } from "next";
import { Spin, Result } from "antd";
import { Table } from "../../components/Table";
import { Company, useCompanies } from "../../hooks/useCompanies";
import Button from "antd-button-color";

import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

const moment = require("moment-timezone");
moment.tz("America/Los_Angeles");

const Companies: NextPage = () => {
  const { data, isLoading, isFetching, error } = useCompanies();

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
          Companies
          {isFetching && <Spin style={{ marginLeft: ".5rem" }} size="small" />}
        </h1>
        <Link href="/companies/create" passHref>
          <Button
            size="large"
            shape="round"
            icon={<PlusOutlined />}
            type="primary"
          >
            New Company
          </Button>
        </Link>
      </div>
      {!error ? (
        <Table
          loading={isLoading}
          columns={data ? data.tableColumns : []}
          data={data ? data.tableData : []}
          rowKey={(record: Company) => record.id}
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

export default Companies;
