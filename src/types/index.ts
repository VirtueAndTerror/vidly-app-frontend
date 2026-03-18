export interface Genre {
  _id: string;
  name: string;
}

export interface Movie {
  _id: string;
  title: string;
  genre: Genre;
  numberInStock: number;
  dailyRentalRate: number;
  liked?: boolean; // optional — added client-side only
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface SortColumn {
  path: string;
  order: 'asc' | 'desc';
}

// Column definition used by Table, TableHeader, TableBody, MoviesTable
export interface Column<T> {
  path?: string;
  key?: string;
  label?: string;
  content?: (item: T) => React.ReactNode;
}
/* Note: The Column<T> interface here is a generic — 
    the T is a placeholder for whatever data type the table is rendering.
     When MoviesTable uses it, T will be Movie. 
     This avoids duplicating the column shape definition
      in every table component.
 */
