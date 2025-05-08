import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-1/4">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};

StatCard.defaultProps = {
  color: 'text-gray-800',
};

export default StatCard;
