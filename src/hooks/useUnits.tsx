import Button from "antd-button-color";
import { ColumnsType } from "antd/lib/table";
import { useQuery } from "react-query";
import { api } from "../services/api";
import { Popconfirm, notification } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { queryClient } from "../services/queryClient";
import { Company } from "./useCompanies";

export type Unit = {
  id: number;
  name: string;
  companyId: number;
};

export async function getUnits() {
  async function deleteUnit(id: number) {
    const { data } = await api.delete("unit/" + id);

    if (data.success) {
      queryClient.invalidateQueries("units");
      notification["success"]({
        message: "Success",
        description: data.message,
        duration: 3,
      });
    }
  }

  const { data } = await api.get("/unit");
  const companies = await api.get("company");

  const units: Unit[] = data.units;

  const tableColumns: ColumnsType<Unit> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: any, b: any) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: "Company",
      render: (_, record) => {
        const content = companies.data.companies.find(
          (company: Company) => company.id === record.companyId
        );

        return content.name;
      },
    },
    {
      title: "Ação",
      width: "25%",
      align: "center",
      render: (text) => (
        <>
          <Link href={"/units/edit/" + text.id} passHref>
            <Button icon={<EditOutlined />} type="warning">
              Edit
            </Button>
          </Link>
          <Popconfirm
            placement="right"
            title="Are you sure to delete this unit?"
            onConfirm={() => deleteUnit(Number(text.id))}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ marginLeft: ".5rem" }}
              icon={<DeleteOutlined />}
              type="danger"
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const tableData = units;

  return { units, tableData, tableColumns };
}

export function useUnits() {
  return useQuery(["units"], () => getUnits(), {
    staleTime: 1000 * 60 * 5, // 10 minutos
  });
}
