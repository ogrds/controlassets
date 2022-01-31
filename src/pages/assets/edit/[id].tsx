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
import { useEffect } from "react";
import { api } from "../../../services/api";
import { queryClient } from "../../../services/queryClient";
import { updateAssetsFormSchema } from "../../../services/yupValidations";
import { Input } from "../../../components/Forms/Input";
import { Select } from "../../../components/Forms/Select";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";

type Asset = {
  id: number;
  model: "motor" | "fan";
  status: string;
  healthscore: number;
  name: string;
  image: string;
  unitId: number;
  companyId: number;
};

type OptionsProps = {
  id: number;
  name: string;
};

type EditAssetProps = {
  asset: Asset;
  companies: OptionsProps[];
  units: OptionsProps[];
};

type EditAssetFormData = {
  name: string;
  status: string;
  model: string;
  image: string;
  unitId: number;
  companyId: number;
};

const EditAsset: NextPage<EditAssetProps> = (props) => {
  const companies: OptionsProps[] = props.companies;
  const units: OptionsProps[] = props.units;

  const router = useRouter();

  const update = useMutation(
    async (asset: EditAssetFormData) => {
      const { name, model, image, unitId, status, companyId } = asset;
      const res = await api.patch("assets/" + props.asset.id, {
        name,
        model,
        image,
        status,
        unitId,
        companyId,
      });

      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data) {
          notification["success"]({
            message: "Success",
            description: "Asset updated successfully",
            duration: 3,
          });

          queryClient.invalidateQueries("assets");
        }
      },
    }
  );

  const { register, handleSubmit, formState, setValue } =
    useForm<EditAssetFormData>({
      resolver: yupResolver(updateAssetsFormSchema),
    });

  useEffect(() => {
    setValue("name", props.asset.name);
    setValue("model", props.asset.model);
    setValue("status", props.asset.status);
    setValue("companyId", props.asset.companyId);
    setValue("unitId", props.asset.unitId);
    setValue("image", props.asset.image);
  }, []);

  const { errors } = formState;

  const handleUpdate: SubmitHandler<EditAssetFormData> = async (
    values: EditAssetFormData
  ) => {
    const data = await update.mutateAsync(values);

    if (data) {
      router.push("/assets");
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
        <h1>Edit Asset [{props.asset.name}]</h1>
      </div>
      <Form
        style={{ background: "#fff", padding: "2rem" }}
        onFinish={handleSubmit(handleUpdate)}
        initialValues={{
          ["name"]: props.asset.name,
          ["model"]: props.asset.model,
          ["status"]: props.asset.status,
          ["companyId"]: props.asset.companyId,
          ["unitId"]: props.asset.unitId,
          ["image"]: props.asset.image,
        }}
      >
        <Row gutter={20}>
          <Col span={8}>
            <Input
              label="Name"
              {...register("name")}
              error={errors.name}
              onChange={(e) => setValue("name", e.target.value)}
            />
          </Col>
          <Col span={8}>
            <Select
              label="Model"
              values={["motor", "fan"]}
              {...register("model")}
              error={errors.model}
              onChange={(e) => setValue("model", e)}
            />
          </Col>
          <Col span={8}>
            <Select
              label="Status"
              values={["inAlert", "inOperation", "inDowntime"]}
              {...register("status")}
              error={errors.status}
              onChange={(e) => setValue("status", e)}
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
          <Col span={24}>
            <Input
              label="Image URL"
              {...register("image")}
              error={errors.image}
              onChange={(e) => setValue("image", e.target.value)}
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
        <Link href="/assets" passHref>
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

export default EditAsset;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const asset = await api.get("assets/" + ctx?.params?.id);
  const company = await api.get("companies");
  const unit = await api.get("units");

  return {
    props: {
      asset: asset.data,
      companies: company.data,
      units: unit.data,
    },
  };
};
