
import _ from 'lodash';
import { Column } from '../../types';

interface Props<T extends { _id: string }> {
  data: T[];
  columns: Column<T>[];
}

const TableBody = <T extends { _id: string }>({ data, columns }: Props<T>) => {
  const renderCell = (item: T, column: Column<T>) => {
    if (column.content) return column.content(item);

    return _.get(item, column.path ?? '');
  };

  const createKey = (item: T, column: Column<T>): string => {
    return item._id + (column.path ?? column.key ?? '');
  };

  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {columns.map((column) => (
            <td key={createKey(item, column)}>
              {renderCell(item, column)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

};

export default TableBody;
