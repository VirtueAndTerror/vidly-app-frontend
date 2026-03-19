import Joi from 'joi';
import { useParams, useNavigate } from 'react-router-dom';
import Form, { FormState } from './common/Form';
import { saveMovie, getMovie } from '../services/movieService';
import { getGenres } from '../services/genreService';
import { Genre, Movie } from '../types';
import axios from 'axios';

// Shape of this form's data fields
interface FormData {
  _id?: string;
  title: string;
  genreId: string;
  numberInStock: string;
  dailyRentalRate: string;
}

interface MoviesFormState extends FormState<FormData> {
  genres: Genre[];
}
// Props injected by the wrapper
interface InjectedProps {
  match: { params: Record<string, string | undefined> };
  history: {
    push: (path: string) => void;
    replace: (path: string) => void;
  };
}

class MoviesForm extends Form<FormData, MoviesFormState> {
  state: MoviesFormState = {
    data: {
      title: '',
      genreId: '',
      numberInStock: '',
      dailyRentalRate: '',
    },
    genres: [] as Genre[],
    errors: {},
  };
  constructor(props: InjectedProps) {
    super(props);
  }

  schema: Record<string, Joi.Schema> = {
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

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id || '';
      if (movieId === 'new') return;

      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  mapToViewModel(movie: Movie): FormData {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock.toString(),
      dailyRentalRate: movie.dailyRentalRate.toString(),
    };
  }

  doSubmit = async (): Promise<void> => {
    //Call the server
    const { data } = this.state;
    await saveMovie({
      ...data,
      numberInStock: Number(data.numberInStock),
      dailyRentalRate: Number(data.dailyRentalRate),
    }as any);
    this.props.history.push('/movies');
  };

  render() {
    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('title', 'Title')}
          {this.renderSelect('genreId', 'Genre', this.state.genres)}
          {this.renderInput('numberInStock', 'Number in Stock', 'number')}
          {this.renderInput('dailyRentalRate', 'Rate', 'number')}
          {this.renderButton('Save')}
        </form>
      </div>
    );
  }
}

// Wrapper injects v6 hooks as props the class component already expects
function MoviesFormWrapper(props: object) {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <MoviesForm
      {...props}
      match={{ params }}
      history={{ push: navigate, replace: navigate }}
    />
  );
}

export default MoviesFormWrapper;
