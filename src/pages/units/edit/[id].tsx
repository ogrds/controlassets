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
import { updateUnitsFormSchema } from "../../../services/yupValidations";
import { Input } from "../../../components/Forms/Input";
import { Select } from "../../../components/Forms/Select";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";

type Unit = {
  id: number;
  name: string;
  companyId: number;
};

type OptionsProps = {
  id: number;
  name: string;
};

type EditUnitProps = {
  unit: Unit;
  companies: OptionsProps[];
};

type EditUnitFormData = {
  name: string;
  companyId: number;
};

const EditUnit: NextPage<EditUnitProps> = (props) => {
  const companies: OptionsProps[] = props.companies;

  const router = useRouter();

  const update = useMutation(
    async (unit: EditUnitFormData) => {
      const { name, companyId } = unit;
      const res = await api.patch("units/" + props.unit.id, {
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
            description: "Unit updated successfully",
            duration: 3,
          });

          queryClient.invalidateQueries("units");
        }
      },
    }
  );

  const { register, handleSubmit, formState, setValue } =
    useForm<EditUnitFormData>({
      resolver: yupResolver(updateUnitsFormSchema),
    });

  useEffect(() => {
    setValue("name", props.unit.name);
    setValue("companyId", props.unit.companyId);
  }, []);

  const { errors } = formState;

  const handleUpdate: SubmitHandler<EditUnitFormData> = async (
    values: EditUnitFormData
  ) => {
    const data = await update.mutateAsync(values);

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
        <h1>Edit Unit [{props.unit.name}]</h1>
      </div>
      <Form
        style={{ background: "#fff", padding: "2rem" }}
        onFinish={handleSubmit(handleUpdate)}
        initialValues={{
          ["name"]: props.unit.name,
          ["companyId"]: props.unit.companyId,
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

export default EditUnit;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const unit = await api.get("units/" + ctx?.params?.id);
  const company = await api.get("companies");

  return {
    props: {
      unit: unit.data,
      companies: company.data,
    },
  };
};
