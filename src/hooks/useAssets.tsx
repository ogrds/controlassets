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

export type Asset = {
  id: number;
  sensors: string[];
  model: string;
  status: string;
  healthscore: number;
  name: string;
  image: string;
  specifications: {
    maxTemp: number;
    power?: number;
    rpm?: number;
  };
  metrics: {
    totalCollectsUptime: number;
    totalUptime: number;
    lastUptimeAt: Date;
  };
  unitId: number;
  companyId: number;
};

export async function getAssets() {
  async function deleteAsset(id: number) {
    const { data } = await api.delete("asset/" + id);

    if (data.success) {
      queryClient.invalidateQueries("assets");
      notification["success"]({
        message: "Success",
        description: data.message,
        duration: 3,
      });
    }
  }

  const { data } = await api.get("/asset");
  const companies = await api.get("company");
  const units = await api.get("unit");

  const assets: Asset[] = data.assets;

  const tableColumns: ColumnsType<Asset> = [
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
      title: "Model",
      dataIndex: "model",
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
        const content = companies.data.companies.find(
          (company: Company) => company.id === record.companyId
        );

        return content.name;
      },
    },
    {
      title: "Unit",
      render: (_, record) => {
        const content = units.data.units.find(
          (unit: Unit) => unit.id === record.unitId
        );

        return content.name;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: any, b: any) => {
        if (a.status < b.status) {
          return -1;
        }
        if (a.status > b.status) {
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
          <Link href={"/assets/edit/" + text.id} passHref>
            <Button icon={<EditOutlined />} type="warning">
              Edit
            </Button>
          </Link>
          <Popconfirm
            placement="right"
            title="Are you sure to delete this asset?"
            onConfirm={() => deleteAsset(Number(text.id))}
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

  const tableData = assets;

  return { assets, tableData, tableColumns };
}

export function useAssets() {
  return useQuery(["assets"], () => getAssets(), {
    staleTime: 1000 * 60 * 5, // 10 minutos
  });
}
