import _ from 'lodash';
import { useEffect, useState } from 'react';
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

const Movies = ({ user }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [pageSize] = useState<number>(4);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>({
    path: 'title',
    order: 'asc' as const,
  });

  useEffect(() => {
    async function fetchData() {
      const { data: genres } = await getGenres();
      const { data: movies } = await getMovies();
      setMovies(movies);
      setGenres([{ _id: '', name: 'All Genres' }, ...genres]);
    }
    fetchData();
  }, []);

  const handleDelete = async (movie: Movie) => {
    //  Optimistic Update ( we make the UI changes FIRST )
    const originalMovies = movies;
    const updatedMovies = originalMovies.filter((m) => m._id !== movie._id);
    setMovies(updatedMovies);

    try {
      await deleteMovie(movie._id);
    } catch (err: any) {
      if (err.response && err.response.status === 404)
        toast.error('This movie has already been deleted');

      setMovies(originalMovies);
    }
  };

  const handleLike = (movie: Movie) => {
    // Clone movies array of objects
    const updatedMovies = [...movies];
    // Get the index of the movie passed as an arguent
    const index = updatedMovies.indexOf(movie);
    // Toggle the value of the 'liked' property in the cloned object.
    updatedMovies[index] = {
      ...updatedMovies[index],
      liked: !updatedMovies[index].liked,
    };
    setMovies(updatedMovies);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenre(null);
    setCurrentPage(1);
  };

  const handleSort = (column: SortColumn) => {
    setSortColumn(column);
  };

  const getPageData = () => {
    let filtered = movies;
    if (searchQuery)
      filtered = movies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase()),
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = movies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const paginated = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: paginated };
  };

  // if (moviesCount === 0) return <p>There are no movies in the database.</p>;

  const { totalCount, data: pagedMovies } = getPageData();

  return (
    <div className='row'>
      <div className='col-2'>
        <ListGroup
          items={genres}
          selectedItem={selectedGenre}
          onItemSelect={handleGenreSelect}
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
        <SearchBox value={searchQuery} onChange={handleSearch} />
        <MoviesTable
          movies={pagedMovies}
          sortColumn={sortColumn}
          onLike={handleLike}
          onDelete={handleDelete}
          onSort={handleSort}
        />

        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Movies;
