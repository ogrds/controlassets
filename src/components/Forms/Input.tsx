import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react";
import { Input as AntdInput, InputProps as AntdInputProps, Form } from "antd";
import { FieldErrors } from "react-hook-form";

interface InputProps extends AntdInputProps {
  name: string;
  label?: string;
  auxiliarText?: string;
  placeholder?: string;
  error?: FieldErrors;
}

const InputBase: ForwardRefRenderFunction<AntdInput, InputProps> = (
  { name, label, auxiliarText, placeholder, error = null, ...rest },
  ref
) => {
  return (
    <Form.Item
      label={<span>{label}</span>}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      validateStatus={error ? "error" : "success"}
      help={error ? error.message : ""}
      extra={auxiliarText}
      hasFeedback={!!error}
      name={name}
    >
      <AntdInput
        bordered
        placeholder={placeholder}
        id={name}
        ref={ref}
        {...rest}
      />
    </Form.Item>
  );
};

export const Input = forwardRef(InputBase);
