import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Column, SortColumn } from '../../types';

interface Props<T> {
  columns: Column<T>[];
  sortColumn: SortColumn;
  onSort: (sortColumn: SortColumn) => void;
}

class TableHeader<T> extends Component<Props<T>> {
  raiseSort = (path: string | undefined): void => {
    if (!path) return;
    const sortColumn = { ...this.props.sortColumn };

    if (sortColumn.path === path) {
      sortColumn.order = sortColumn.order === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.path = path;
      sortColumn.order = 'asc';
    }
    this.props.onSort(sortColumn);
  };

  renderSortIcon = (column: Column<T>) => {
    const { sortColumn } = this.props;

    const sortUp = <FontAwesomeIcon icon={faSortUp} />;
    const sortDown = <FontAwesomeIcon icon={faSortDown} />;

    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order === 'asc') return sortUp;
    else {
      return sortDown;
    }
  };

  render() {
    return (
      <thead>
        <tr>
          {this.props.columns.map((column) => (
            <th
              className='clickable'
              key={column.path || column.key}
              onClick={() => this.raiseSort(column.path)}
            >
              {column.label} {this.renderSortIcon(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
