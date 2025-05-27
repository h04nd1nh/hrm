import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Component Dropdown tái sử dụng với style giống Input
 * @param {Object} props - Props của component
 * @param {Ref} ref - Ref được chuyển tiếp
 * @returns {JSX.Element} - Dropdown component
 */
const Dropdown = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  className = '',
  labelClassName = '',
  selectClassName = '',
  ...rest
}, ref) => {
  // Tạo id nếu không được cung cấp
  const selectId = id || name || `dropdown-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`
          w-full px-[18px] py-[11px] border rounded-[16px] placeholder-gray-400
          focus:outline-none focus:ring-blue-500 focus:border-blue-500
          appearance-none bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          ${selectClassName}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '16px 16px',
          paddingRight: '40px'
        }}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        
        {options.map((option) => (
          <option key={option.id || option.value} value={option.id || option.value}>
            {option.position_name || option.level_name || option.name || option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      position_name: PropTypes.string,
      level_name: PropTypes.string,
      name: PropTypes.string,
      label: PropTypes.string
    })
  ),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  selectClassName: PropTypes.string,
};

export default Dropdown; 