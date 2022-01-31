import type { NextPage } from "next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUsersFormSchema } from "../../services/yupValidations";
import { useRouter } from "next/router";
import { Form, Col, Row, notification } from "antd";
import { Input } from "../../components/Forms/Input";
import Button from "antd-button-color";

import { SaveOutlined } from "@ant-design/icons";
import { Select } from "../../components/Forms/Select";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

type CreateUserFormData = {
  name: string;
  email: string;
  unitId: number;
  companyId: number;
};

type OptionsProps = {
  id: number;
  name: string;
};

const NewUser: NextPage = () => {
  const [companies, setCompanies] = useState<OptionsProps[]>([]);
  const [units, setUnits] = useState<OptionsProps[]>([]);

  useEffect(() => {
    api.get("company").then((res) => setCompanies(res.data.companies));
    api.get("unit").then((res) => setUnits(res.data.units));
  }, []);

  const router = useRouter();

  const create = useMutation(
    async (user: CreateUserFormData) => {
      const { name, email, unitId, companyId } = user;
      const res = await api.post("user", {
        name,
        email,
        unitId,
        companyId,
      });

      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          notification["success"]({
            message: "Success",
            description: data.message,
            duration: 3,
          });

          queryClient.invalidateQueries("users");
        }
      },
    }
  );

  const { register, handleSubmit, formState, setValue } =
    useForm<CreateUserFormData>({
      resolver: yupResolver(createUsersFormSchema),
    });

  const { errors } = formState;

  const handleCreate: SubmitHandler<CreateUserFormData> = async (
    values: CreateUserFormData
  ) => {
    const { success } = await create.mutateAsync(values);

    if (success) {
      router.push("/users");
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
        <h1>New User</h1>
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
            <Input
              label="E-Mail"
              {...register("email")}
              error={errors.email}
              onChange={(e) => setValue("email", e.target.value)}
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
          <Col span={12}>
            <Select
              label="Unit"
              values={units}
              {...register("unitId")}
              error={errors.unitId}
              onChange={(e) => setValue("unitId", e)}
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
        <Link href="/users" passHref>
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

export default NewUser;