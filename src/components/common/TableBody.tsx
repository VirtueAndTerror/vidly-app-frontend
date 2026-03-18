import { Component } from 'react';
import _ from 'lodash';
import { Column } from '../../types';

interface Props<T extends { _id: string }> {
  data: T[];
  columns: Column<T>[];
}

class TableBody<T extends { _id: string }> extends Component<Props<T>> {
  renderCell = (item: T, column: Column<T>) => {
    if (column.content) return column.content(item);

    return _.get(item, column.path ?? '');
  };

  createKey = (item: T, column: Column<T>): string => {
    return item._id + (column.path ?? column.key ?? '');
  };

  render() {
    const { data, columns } = this.props;
    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
