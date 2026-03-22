import Joi from 'joi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useForm from '../hooks/useFrom';
import { getGenres } from '../services/genreService';
import { getMovie, saveMovie } from '../services/movieService';
import { Genre, Movie } from '../types';

// Shape of this form's data fields
interface FormData {
  _id?: string;
  title: string;
  genreId: string;
  numberInStock: string;
  dailyRentalRate: string;
}

const schema: Record<string, Joi.Schema> = {
  title: Joi.string().required().label('Title'),
  genreId: Joi.string().required().label('Genre'),
  numberInStock: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .required()
    .label('Number in Stock'),
  dailyRentalRate: Joi.number()
    .required()
    .min(0)
    .max(10)
    .label('Daily Rental Rate'),
};

const mapToViewModel = (movie: Movie): FormData => ({
  _id: movie._id,
  title: movie.title,
  genreId: movie.genre._id,
  numberInStock: String(movie.numberInStock),
  dailyRentalRate: String(movie.dailyRentalRate),
});

const MoviesForm = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [genres, setGenres] = useState<Genre[]>([]);

  const { data, setData, errors, validate, handleSubmit, handleChange } =
    useForm<FormData>(
      { title: '', genreId: '', numberInStock: '', dailyRentalRate: '' },
      schema,
      async () => {
        await saveMovie({
          ...data,
          numberInStock: Number(data.numberInStock),
          dailyRentalRate: Number(data.dailyRentalRate),
        });
        navigate('/movies');
      },
    );

  useEffect(() => {
    async function fetchData() {
      const { data: genres } = await getGenres();
      setGenres(genres);

      if (id === 'new') return;

      try {
        const { data: movie } = await getMovie(id);
        setData(mapToViewModel(movie));
      } catch (err: any) {
        if (err.response && err.response.status === 404)
          navigate('/not-found', { replace: true });
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Movie Form</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            id='title'
            name='title'
            type='text'
            value={data.title}
            onChange={handleChange}
            className='form-control'
          />
          {errors.title && (
            <div className='alert alert-danger'>{errors.title}</div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='genreId'>Genre</label>
          <select
            id='genreId'
            name='genreId'
            value={data.genreId}
            onChange={handleChange as any}
            className='form-control'
          >
            <option value='' />
            {genres.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
          {errors.genreId && (
            <div className='alert alert-danger'>{errors.genreId}</div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='numberInStock'>Number in Stock</label>
          <input
            id='numberInStock'
            name='numberInStock'
            type='number'
            value={data.numberInStock}
            onChange={handleChange}
            className='form-control'
          />
          {errors.numberInStock && (
            <div className='alert alert-danger'>{errors.numberInStock}</div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='dailyRentalRate'>Rate</label>
          <input
            id='dailyRentalRate'
            name='dailyRentalRate'
            type='number'
            value={data.dailyRentalRate}
            onChange={handleChange}
            className='form-control'
          />
          {errors.dailyRentalRate && (
            <div className='alert alert-danger'>{errors.dailyRentalRate}</div>
          )}
        </div>

        <button disabled={!!validate()} className='btn btn-primary'>
          Save
        </button>
      </form>
    </div>
  );
};

export default MoviesForm;
