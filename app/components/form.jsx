import React from 'react';
import Autosuggest from 'react-autosuggest';

const Form = ({
  onSubmit,
  disabled,
  autoSuggestProps: { inputProps, ...rest },
}) => (
  <form className="form" onSubmit={onSubmit}>
    <Autosuggest {...rest} inputProps={{ disabled, ...inputProps }} />
    <input type="submit" disabled={disabled} value="Add to my shelf" />
  </form>
);

export default Form;
