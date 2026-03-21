import auth from '../services/authService';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import Like from './common/Like';
import type { Movie, SortColumn, Column } from '../types';

interface Props {
  movies: Movie[];
  sortColumn: SortColumn;
  onSort: (sortColumn: SortColumn) => void;
  onLike: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

const MoviesTable = ({
  movies,
  sortColumn,
  onSort,
  onLike,
  onDelete,
}: Props) => {
  const columns: Column<Movie>[] = [
    {
      path: 'title',
      label: 'Title',
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { path: 'genre.name', label: 'Genre' },
    { path: 'numberInStock', label: 'Stock' },
    { path: 'dailyRentalRate', label: 'Rate' },
    {
      key: 'like',
      content: (movie) => (
        <Like liked={Boolean(movie.liked)} onClick={() => onLike(movie)} />
      ),
    },
  ];

  const deleteColumn: Column<Movie> = {
    key: 'delete',
    content: (movie) => (
      <button onClick={() => onDelete(movie)} className='btn btn-danger btn-sm'>
        Delete
      </button>
    ),
  };

  const user = auth.getCurrentUser();
  if (user && user.isAdmin) columns.push(deleteColumn);

  return (
    <Table
      columns={columns}
      data={movies}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default MoviesTable;
