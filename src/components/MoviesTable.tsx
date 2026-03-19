import { Component } from 'react';
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

class MoviesTable extends Component<Props> {
  columns: Column<Movie>[] = [
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
        <Like liked={Boolean(movie.liked)} onClick={() => this.props.onLike(movie)} />
      ),
    },
  ];

  deleteColumn: Column<Movie> = {
    key: 'delete',
    content: (movie) => (
      <button
        onClick={() => this.props.onDelete(movie)}
        className='btn btn-danger btn-sm'
      >
        Delete
      </button>
    ),
  };

  constructor(props: Props) {
    super(props);
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }
  render() {
    const { movies, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={movies}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default MoviesTable;
