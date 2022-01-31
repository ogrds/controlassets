import type { NextPage } from "next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { createCompaniesFormSchema } from "../../services/yupValidations";
import { useRouter } from "next/router";
import { Form, Col, Row, notification } from "antd";
import { Input } from "../../components/Forms/Input";
import Button from "antd-button-color";

import { SaveOutlined } from "@ant-design/icons";
import { Select } from "../../components/Forms/Select";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

type CreateCompanyFormData = {
  name: string;
};

type OptionsProps = {
  id: number;
  name: string;
};

const NewCompany: NextPage = () => {
  const router = useRouter();

  const create = useMutation(
    async (company: CreateCompanyFormData) => {
      const { name } = company;
      const res = await api.post("company", {
        name,
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

          queryClient.invalidateQueries("companies");
        }
      },
    }
  );

  const { register, handleSubmit, formState, setValue } =
    useForm<CreateCompanyFormData>({
      resolver: yupResolver(createCompaniesFormSchema),
    });

  const { errors } = formState;

  const handleCreate: SubmitHandler<CreateCompanyFormData> = async (
    values: CreateCompanyFormData
  ) => {
    const { success } = await create.mutateAsync(values);

    if (success) {
      router.push("/companies");
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
        <h1>New Company</h1>
      </div>
      <Form
        style={{ background: "#fff", padding: "2rem" }}
        onFinish={handleSubmit(handleCreate)}
      >
        <Row gutter={20}>
          <Col span={24}>
            <Input
              label="Name"
              {...register("name")}
              error={errors.name}
              onChange={(e) => setValue("name", e.target.value)}
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
        <Link href="/companies" passHref>
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

export default NewCompany;
