import _ from 'lodash';

interface Props {
  itemsCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }: Props) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;

  const pages = _.range(1, pagesCount + 1);

  return (
    <nav>
      <ul className='pagination'>
        {pages.map(page => (
          <li
            key={page}
            className={page === currentPage ? 'page-item active' : 'page-item'}
          >
            <button onClick={() => onPageChange(page)} className='page-link'>
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};



export default Pagination;
