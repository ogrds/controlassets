import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Form, Col, Row, notification } from "antd";
import Button from "antd-button-color";

import { SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { queryClient } from "../../../services/queryClient";
import { updateCompaniesFormSchema } from "../../../services/yupValidations";
import { Input } from "../../../components/Forms/Input";
import { Select } from "../../../components/Forms/Select";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";

type Company = {
  id: number;
  name: string;
};

type EditCompanyProps = {
  company: Company;
};

type EditCompanyFormData = {
  name: string;
};

const EditCompany: NextPage<EditCompanyProps> = (props) => {
  const router = useRouter();

  const update = useMutation(
    async (company: EditCompanyFormData) => {
      const { name } = company;
      const res = await api.post("company/" + props.company.id, {
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
    useForm<EditCompanyFormData>({
      resolver: yupResolver(updateCompaniesFormSchema),
    });

  useEffect(() => {
    setValue("name", props.company.name);
  }, []);

  const { errors } = formState;

  const handleUpdate: SubmitHandler<EditCompanyFormData> = async (
    values: EditCompanyFormData
  ) => {
    const { success } = await update.mutateAsync(values);

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
        <h1>Edit Company [{props.company.name}]</h1>
      </div>
      <Form
        style={{ background: "#fff", padding: "2rem" }}
        onFinish={handleSubmit(handleUpdate)}
        initialValues={{
          ["name"]: props.company.name,
        }}
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

export default EditCompany;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const company = await api.get("company/" + ctx?.params?.id);

  return {
    props: {
      company: company.data.company,
    },
  };
};
