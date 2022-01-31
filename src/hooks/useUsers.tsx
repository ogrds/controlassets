import Button from "antd-button-color";
import { ColumnsType } from "antd/lib/table";
import { useQuery } from "react-query";
import { api } from "../services/api";
import { Popconfirm, notification } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { queryClient } from "../services/queryClient";
import { Company } from "./useCompanies";
import { Unit } from "./useUnits";

export type User = {
  id: number;
  email: string;
  name: string;
  unitId: number;
  companyId: number;
};

export async function getUsers() {
  async function deleteUser(id: number) {
    const { data } = await api.delete("users/" + id);

    if (data) {
      queryClient.invalidateQueries("users");
      notification["success"]({
        message: "Success",
        description: "User deleted successfully",
        duration: 3,
      });
    }
  }

  const { data } = await api.get("users");
  const companies = await api.get("companies");
  const units = await api.get("units");

  const users: User[] = data;

  const tableColumns: ColumnsType<User> = [
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
      title: "E-Mail",
      dataIndex: "email",
      sorter: (a: any, b: any) => {
        if (a.model < b.model) {
          return -1;
        }
        if (a.model > b.model) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: "Company",
      render: (_, record) => {
        const content = companies.data.find(
          (company: Company) => company.id === record.companyId
        );

        return content.name;
      },
    },
    {
      title: "Unit",
      render: (_, record) => {
        const content = units.data.find(
          (unit: Unit) => unit.id === record.unitId
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
          <Link href={"/users/edit/" + text.id} passHref>
            <Button icon={<EditOutlined />} type="warning">
              Edit
            </Button>
          </Link>
          <Popconfirm
            placement="right"
            title="Are you sure to delete this user?"
            onConfirm={() => deleteUser(Number(text.id))}
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

  const tableData = users;

  return { users, tableData, tableColumns };
}

export function useUsers() {
  return useQuery(["users"], () => getUsers(), {
    staleTime: 1000 * 60 * 5, // 10 minutos
  });
}
