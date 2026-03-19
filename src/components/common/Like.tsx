import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

interface Props {
  liked: boolean;
  onClick: () => void;
}

const Like = ({ liked, onClick }: Props) => {
  const likedHeart = <FontAwesomeIcon icon={faHeart} />;
  const unlikedHeart = <FontAwesomeIcon icon={farHeart} />;
  return (
    <span style={{ cursor: 'pointer' }} onClick={onClick}>
      {!liked ? unlikedHeart : likedHeart}
    </span>
  );
};

export default Like;
