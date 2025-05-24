// components/ui/checkbox.js
import { useState } from "react";

export const Checkbox = ({ id, checked = false, onCheckedChange, label }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e) => {
    const newCheckedState = e.target.checked;
    setIsChecked(newCheckedState);
    if (onCheckedChange) {
      onCheckedChange(newCheckedState);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-0"
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};
