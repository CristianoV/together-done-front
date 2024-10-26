import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 mt-1 text-gray-900 border rounded-md focus:ring focus:ring-indigo-300 focus:border-indigo-500"
      required
    />
  </div>
);

export default InputField;
