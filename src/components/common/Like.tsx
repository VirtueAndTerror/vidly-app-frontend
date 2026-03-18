import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

const Like = ({ liked, onClick }) => {
  const likedHeart = <FontAwesomeIcon icon={faHeart} />;
  const unlikedHeart = <FontAwesomeIcon icon={farHeart} />;
  return (
    <span style={{ cursor: 'pointer' }} onClick={onClick}>
      {!liked ? unlikedHeart : likedHeart}
    </span>
  );
};

export default Like;
