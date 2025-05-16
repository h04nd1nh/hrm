import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component Toggle Switch
 * @param {Object} props - Props của component
 * @returns {JSX.Element} - Toggle component
 */
const Toggle = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  labelClassName = '',
  ...rest
}) => {
  // Tạo id nếu không được cung cấp
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {label && (
        <label 
          htmlFor={toggleId} 
          className={`font-medium ${labelClassName}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative inline-block w-12 align-middle select-none">
        <input 
          type="checkbox" 
          id={toggleId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...rest}
        />
        <label 
          htmlFor={toggleId} 
          className={`
            block overflow-hidden h-6 rounded-full cursor-pointer
            transition-colors duration-200 ease-in-out
            ${checked ? 'bg-blue-500' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span 
            className={`
              absolute block w-4 h-4 rounded-full bg-white 
              transform transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-6' : 'translate-x-1'} top-1
            `} 
          />
        </label>
      </div>
    </div>
  );
};

Toggle.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default Toggle; 