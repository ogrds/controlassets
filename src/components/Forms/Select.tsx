import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react";
import {
  Select as AntdSelect,
  SelectProps as AntdSelectProps,
  Form,
} from "antd";
const { Option } = AntdSelect;

import { FieldErrors } from "react-hook-form";
import { BaseSelectRef } from "rc-select";

type OptionsProps = {
  id: number;
  name: string;
};

interface SelectProps extends AntdSelectProps {
  name: string;
  values: OptionsProps[] | string[];
  label?: string;
  auxiliarText?: string;
  error?: FieldErrors;
}

const SelectBase: ForwardRefRenderFunction<BaseSelectRef, SelectProps> = (
  { name, label, auxiliarText, values, error = null, ...rest },
  ref
) => {
  return (
    <Form.Item
      label={<span>{label}</span>}
      validateStatus={error ? "error" : "success"}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      help={error ? error.message : ""}
      extra={auxiliarText}
      name={name}
      hasFeedback={!!error}
    >
      <AntdSelect bordered id={name} allowClear {...rest} ref={ref}>
        {values.map((option) => {
          if (option instanceof Object) {
            return (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            );
          } else {
            return (
              <Option key={option} value={option}>
                {option}
              </Option>
            );
          }
        })}
      </AntdSelect>
    </Form.Item>
  );
};

export const Select = forwardRef(SelectBase);
