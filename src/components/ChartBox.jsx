import React from 'react';
import PropTypes from 'prop-types';

const ChartBox = ({ children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[250px]">
      {children}
    </div>
  );
};

ChartBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChartBox;
