import React from 'react';

const Form = ({
  onSubmit,
  disabled,
  currentBook,
  onChange,
}) => (
  <form className="form" onSubmit={onSubmit}>
    <input
      type="search"
      disabled={disabled}
      value={currentBook}
      onChange={onChange}
      placeholder="What would you like to read?"
    />
    <input type="submit" disabled={disabled} value="Add to my shelf" />
  </form>
);

export default Form;
