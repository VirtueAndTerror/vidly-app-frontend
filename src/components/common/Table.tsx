import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { Column, SortColumn } from '../../types';

interface Props<T> {
  columns: Column<T>[];
  sortColumn: SortColumn;
  onSort: (sortColumn: SortColumn) => void;
  data: T[];
}

const Table = <T extends { _id: string }>({
  columns,
  sortColumn,
  onSort,
  data,
}: Props<T>) => {
  return (
    <table className='table'>
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody data={data} columns={columns} />
    </table>
  );
};

export default Table;
