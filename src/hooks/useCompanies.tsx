import Button from "antd-button-color";
import { ColumnsType } from "antd/lib/table";
import { useQuery } from "react-query";
import { api } from "../services/api";
import { Popconfirm, notification } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { queryClient } from "../services/queryClient";

export type Company = {
  id: number;
  name: string;
};

export async function getCompanys() {
  async function deleteCompany(id: number) {
    const { data } = await api.delete("company/" + id);

    if (data.success) {
      queryClient.invalidateQueries("companies");
      notification["success"]({
        message: "Success",
        description: data.message,
        duration: 3,
      });
    }
  }

  const { data } = await api.get("/company");

  const companies: Company[] = data.companies;

  const tableColumns: ColumnsType<Company> = [
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
      title: "Ação",
      width: "25%",
      align: "center",
      render: (text) => (
        <>
          <Link href={"/companies/edit/" + text.id} passHref>
            <Button icon={<EditOutlined />} type="warning">
              Edit
            </Button>
          </Link>
          <Popconfirm
            placement="right"
            title="Are you sure to delete this company?"
            onConfirm={() => deleteCompany(Number(text.id))}
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

  const tableData = companies;

  return { companies, tableData, tableColumns };
}

export function useCompanies() {
  return useQuery(["companies"], () => getCompanys(), {
    staleTime: 1000 * 60 * 5, // 10 minutos
  });
}
