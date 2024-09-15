import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ScrollArea = ({ children, className }) => {
  return (
    <div className={classNames("overflow-auto", className)}>
      {children}
    </div>
  );
};

ScrollArea.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ScrollArea;