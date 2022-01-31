import { Table as AntdTable, TableProps as AntdTableProps } from "antd";
import { ColumnsType } from "antd/lib/table";

interface TableProps extends AntdTableProps<any> {
  columns: ColumnsType<any>;
  data: any[];
  loading: boolean;
}

export function Table({ columns, data, loading, ...rest }: TableProps) {
  return (
    <AntdTable
      loading={loading}
      bordered
      columns={columns}
      dataSource={data}
      {...rest}
    />
  );
}
