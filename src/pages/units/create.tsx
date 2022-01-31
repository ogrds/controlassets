import type { NextPage } from "next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUnitsFormSchema } from "../../services/yupValidations";
import { useRouter } from "next/router";
import { Form, Col, Row, notification } from "antd";
import { Input } from "../../components/Forms/Input";
import Button from "antd-button-color";

import { SaveOutlined } from "@ant-design/icons";
import { Select } from "../../components/Forms/Select";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

type CreateUnitFormData = {
  name: string;
  companyId: number;
};

type OptionsProps = {
  id: number;
  name: string;
};

const NewUnit: NextPage = () => {
  const [companies, setCompanies] = useState<OptionsProps[]>([]);

  useEffect(() => {
    api.get("companies").then((res) => setCompanies(res.data));
  }, []);

  const router = useRouter();

  const create = useMutation(
    async (unit: CreateUnitFormData) => {
      const { name, companyId } = unit;
      const res = await api.post("units", {
        name,
        companyId,
      });

      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data) {
          notification["success"]({
            message: "Success",
            description: "Unit created successfully",
            duration: 3,
          });

          queryClient.invalidateQueries("units");
        }
      },
    }
  );

  const { register, handleSubmit, formState, setValue } =
    useForm<CreateUnitFormData>({
      resolver: yupResolver(createUnitsFormSchema),
    });

  const { errors } = formState;

  const handleCreate: SubmitHandler<CreateUnitFormData> = async (
    values: CreateUnitFormData
  ) => {
    const data = await create.mutateAsync(values);

    if (data) {
      router.push("/units");
    }
  };

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
        <h1>New Unit</h1>
      </div>
      <Form
        style={{ background: "#fff", padding: "2rem" }}
        onFinish={handleSubmit(handleCreate)}
      >
        <Row gutter={20}>
          <Col span={12}>
            <Input
              label="Name"
              {...register("name")}
              error={errors.name}
              onChange={(e) => setValue("name", e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Select
              label="Company"
              values={companies}
              {...register("companyId")}
              error={errors.companyId}
              onChange={(e) => setValue("companyId", e)}
            />
          </Col>
        </Row>

        <Button
          htmlType="submit"
          type="primary"
          shape="round"
          icon={<SaveOutlined />}
          size="large"
          loading={formState.isSubmitting}
        >
          Save
        </Button>
        <Link href="/units" passHref>
          <Button
            style={{ marginLeft: ".5rem" }}
            type="lightdark"
            shape="round"
            size="large"
          >
            Cancel
          </Button>
        </Link>
      </Form>
    </Sidebar>
  );
};

export default NewUnit;
