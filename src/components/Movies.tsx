import _ from 'lodash';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getGenres } from '../services/genreService';
import { deleteMovie, getMovies } from '../services/movieService';
import type { Genre, Movie, SortColumn, User } from '../types';
import { paginate } from '../utils/paginate';
import MoviesTable from './MoviesTable';
import SearchBox from './SearchBox';
import ListGroup from './common/ListGroup';
import Pagination from './common/Pagination';

interface Props {
  user: User | null;
}

interface State {
  movies: Movie[];
  genres: Genre[];
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  selectedGenre: Genre | null;
  sortColumn: SortColumn;
}

class Movies extends Component<Props, State> {
  state: State = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: '',
    selectedGenre: null,
    sortColumn: { path: 'title', order: 'asc' as const },
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: '', name: 'All Genres' }, ...data];
    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async (movie: Movie) => {
    //  Optimistic Update ( we make the UI changes FIRST )
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (err: any) {
      if (err.response && err.response.status === 404)
        toast.error('This movie has already been deleted');

      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie: Movie) => {
    // Clone movies array of objects
    const movies = [...this.state.movies];
    // Get the index of the movie passed as an arguent
    const index = movies.indexOf(movie);
    // Toggle the value of the 'liked' property in the cloned object.
    movies[index].liked = !movies[index].liked;
    // Call the 'setState()' method from the 'Component Class' to replace
    // the state object with the clone and modified object.
    this.setState({ movies });
  };

  handlePageChange = (page: number) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre: Genre) => {
    this.setState({ selectedGenre: genre, searchQuery: '', currentPage: 1 });
  };

  handleSearch = (query: string) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn: SortColumn) => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const {
      pageSize,
      sortColumn,
      currentPage,
      movies: allMovies,
      selectedGenre,
      searchQuery,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase()),
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    // const { length: moviesCount } = this.state.movies;
    const { pageSize, sortColumn, currentPage, searchQuery } = this.state;
    const { user } = this.props;

    // if (moviesCount === 0) return <p>There are no movies in the database.</p>;

    const { totalCount, data: movies } = this.getPageData();

    return (
      <div className='row'>
        <div className='col-2'>
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className='col'>
          {user && (
            <Link
              to='/movies/new'
              className='btn btn-primary'
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>Showing {totalCount} movies in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />

          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
