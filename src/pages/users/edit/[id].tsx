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
import { updateUsersFormSchema } from "../../../services/yupValidations";
import { Input } from "../../../components/Forms/Input";
import { Select } from "../../../components/Forms/Select";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";

type User = {
  id: number;
  email: string;
  name: string;
  unitId: number;
  companyId: number;
};

type OptionsProps = {
  id: number;
  name: string;
};

type EditUserProps = {
  user: User;
  companies: OptionsProps[];
  units: OptionsProps[];
};

type EditUserFormData = {
  name: string;
  email: string;
  unitId: number;
  companyId: number;
};

const EditUser: NextPage<EditUserProps> = (props) => {
  const companies: OptionsProps[] = props.companies;
  const units: OptionsProps[] = props.units;

  const router = useRouter();

  const update = useMutation(
    async (user: EditUserFormData) => {
      const { name, email, unitId, companyId } = user;
      const res = await api.post("user/" + props.user.id, {
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
    useForm<EditUserFormData>({
      resolver: yupResolver(updateUsersFormSchema),
    });

  useEffect(() => {
    setValue("name", props.user.name);
    setValue("email", props.user.email);
    setValue("companyId", props.user.companyId);
    setValue("unitId", props.user.unitId);
  }, []);

  const { errors } = formState;

  const handleUpdate: SubmitHandler<EditUserFormData> = async (
    values: EditUserFormData
  ) => {
    const { success } = await update.mutateAsync(values);

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
        <h1>Edit User [{props.user.name}]</h1>
      </div>
      <Form
        style={{ background: "#fff", padding: "2rem" }}
        onFinish={handleSubmit(handleUpdate)}
        initialValues={{
          ["name"]: props.user.name,
          ["email"]: props.user.email,
          ["companyId"]: props.user.companyId,
          ["unitId"]: props.user.unitId,
        }}
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

export default EditUser;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const user = await api.get("user/" + ctx?.params?.id);
  const company = await api.get("company");
  const unit = await api.get("unit");

  return {
    props: {
      user: user.data.user,
      companies: company.data.companies,
      units: unit.data.units,
    },
  };
};
