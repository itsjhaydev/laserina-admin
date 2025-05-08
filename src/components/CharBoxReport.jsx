import React from 'react';
import PropTypes from 'prop-types';

const ChartBoxReport = ({ children }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-[60%] print:w-full min-h-[300px]">
            {children}
        </div>
    );
};

ChartBoxReport.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ChartBoxReport;
