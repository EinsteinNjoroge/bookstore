import React from 'react';
import {
  func, boolean, shape, array, string,
} from 'prop-types';
import Autosuggest from 'react-autosuggest';

const Form = ({
  onSubmit,
  disabled,
  autoSuggestProps: { inputProps, ...rest },
}) => {
  const props = { ...inputProps };
  if (disabled) props.disabled = disabled;
  return (
    <form className="form" onSubmit={onSubmit}>
      <Autosuggest {...rest} inputProps={props} />
      <input type="submit" disabled={disabled} value="Add to my shelf" />
    </form>
  );
};

Form.propTypes = {
  onSubmit: func.isRequired,
  disabled: boolean,
  autoSuggestProps: shape({
    suggestions: array.isRequired,
    onSuggestionsFetchRequested: func.isRequired,
    onSuggestionsClearRequested: func.isRequired,
    getSuggestionValue: func.isRequired,
    renderSuggestion: func.isRequired,
    inputProps: {
      value: string.isRequired,
      onChange: func.isRequired,
    },
  }).isRequired,
};

Form.defaultProps = {
  disabled: false,
};

export default Form;
