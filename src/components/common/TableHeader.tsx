
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Column, SortColumn } from '../../types';

interface Props<T> {
  columns: Column<T>[];
  sortColumn: SortColumn;
  onSort: (sortColumn: SortColumn) => void;
}

const TableHeader = <T,>({ columns, sortColumn, onSort }: Props<T>) => {
  const raiseSort = (path: string | undefined): void => {
    if (!path) return;
    const newSortComumn = { ...sortColumn };

    if (newSortComumn.path === path) {
      newSortComumn.order = newSortComumn.order === 'asc' ? 'desc' : 'asc';
    } else {
      newSortComumn.path = path;
      newSortComumn.order = 'asc' as const;
    }
    onSort(newSortComumn);
  };

  const renderSortIcon = (column: Column<T>) => {
    const sortUp = <FontAwesomeIcon icon={faSortUp} />;
    const sortDown = <FontAwesomeIcon icon={faSortDown} />;

    if (column.path !== sortColumn.path) return null;

    return (sortColumn.order === 'asc') ? sortUp : sortDown;
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            className='clickable'
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );

}

export default TableHeader;
