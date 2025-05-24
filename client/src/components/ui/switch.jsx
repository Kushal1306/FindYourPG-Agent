import React, { useState } from 'react';

const Switch = ({ 
  id = 'toggle-switch',
  name = 'toggle',
  checked = false,
  onChange = () => {},
  disabled = false,
  label = '',
  size = 'md',
  labelPosition = 'right'
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  
  const handleChange = (e) => {
    if (!disabled) {
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);
      onChange(newCheckedState); // Pass the new state directly
    }
  };

  // Size variants with properly centered thumbs
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      label: 'text-sm'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      label: 'text-base'
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-6 h-6', 
      translate: 'translate-x-7',
      label: 'text-lg'
    }
  };
  
  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center ${labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`${currentSize.label} cursor-pointer ${disabled ? 'text-gray-400' : 'text-gray-700'} ${labelPosition === 'left' ? 'mr-3' : 'ml-3'}`}
        >
          {label}
        </label>
      )}
      <div className="relative inline-block">
        <input
          type="checkbox"
          id={id}
          name={name}
          className="sr-only"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
        />
        <div
          onClick={handleChange}
          className={`
            ${currentSize.switch}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isChecked ? 'bg-blue-600' : 'bg-gray-200'}
            rounded-full transition-colors duration-200 ease-in-out
            flex items-center
          `}
        >
          <div
            className={`
              ${currentSize.thumb}
              ${isChecked ? currentSize.translate : 'translate-x-0.5'} 
              bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
              my-0.5
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default Switch;