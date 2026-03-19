interface Props {
  items: any[];
  textProperty?: string;
  valueProperty?: string;
  onItemSelect: (item: any) => void;
  selectedItem: any;
}

const ListGroup = ({
  items,
  textProperty = 'name',
  valueProperty = '_id',
  onItemSelect,
  selectedItem
}: Props) => {
  return (
    <ul className='list-group'>
      {items.map((item) => (
        <li
          key={item[valueProperty]}
          className={
            item === selectedItem
              ? 'list-group-item text-center active'
              : 'list-group-item text-center'
          }
          onClick={() => onItemSelect(item)}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
