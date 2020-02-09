import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import './assets/index.css';
import suggestions from '../api';

const TAG_LINE = 'Read as you Go.';
const TAG_LINE_MSG = 'Enrich your life, go anywhere, learn anything, read every day.';
const TAG_LINE_SEC_MSG = 'Rent a book here and read as you go';
const DEFAULT_RENT_DURATION = 1;
const DEFAULT_BOOK_COUNT = 1;
const MAX_RENTED_BOOK = 10;

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : suggestions.filter(lang =>
    lang.title.toLowerCase().slice(0, inputLength) === inputValue
  );
};
const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

const renderWelcomeMessage = () => (
  <div>
    <h1>{TAG_LINE}</h1>
    {TAG_LINE_MSG}
    <br />
    {TAG_LINE_SEC_MSG}
  </div>
);

const renderShelfRow = (title, rentDetails, rowNumber) => {
  const { rentDuration, numOfBooks } = rentDetails;
  return (
    <div key={rowNumber} className="myShelf">
      <span>{rowNumber + 1}</span>
      <span className="titleSpan">{title}</span>
      <span>{rentDuration}</span>
      <span>{numOfBooks}</span>
    </div>
  );
};

const renderTotalCharge = totalCharge => (
    <div className="totalCharge">
      <span>Total Charge</span>
      <span >{totalCharge}$</span>
    </div>
  );

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component {
  state = {
    currentBook: '',
    myShelf:{vvv: {rentDuration: 1, numOfBooks: 1},
      fvfbgbfvdvd: {rentDuration: 1, numOfBooks: 2}},
    library:[],
    suggestions:[],
    rentRate: 1,
  };

  setBookState = ({target: {value: currentBook}}) => {
    this.setState({currentBook});
  };

  calculateCharge = () => {
    const {myShelf, rentRate} = this.state;
    let totalCharge = 0;
    Object.keys(myShelf).forEach(title => {
      const {rentDuration, numOfBooks} = myShelf[title];
      totalCharge += rentDuration * rentRate * numOfBooks;
    });

    return totalCharge;
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };
  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  showMessage = msg => {};

  addToShelf = (e) => {
    e.preventDefault();
    const {currentBook, myShelf} = this.state;

    if(!currentBook){
      this.showMessage("Enter a valid title");
      return;
    }

    let newShelf = Object.assign({}, myShelf);

    if(newShelf[currentBook]){
      newShelf[currentBook].numOfBooks += 1;
    }else{
      newShelf[currentBook] = {rentDuration: DEFAULT_RENT_DURATION, numOfBooks: DEFAULT_BOOK_COUNT};
    }

    this.setState({myShelf: newShelf, currentBook: ''});
    this.calculateCharge();
  };

  showAutocomplete = (e) =>{
    console.log(e.target.value);
  };

  render() {
    const {addToShelf, showAutocomplete,setBookState, state, calculateCharge} = this;
    const {currentBook,myShelf} = state;

    const iHaveBooksInMyShelf = Object.keys(myShelf).length > 0;
    const disableInputs = Object.keys(myShelf).length >= MAX_RENTED_BOOK;
    const totalCharge = calculateCharge();

    const inputProps = {
      placeholder: 'Type a programming language',
      value:currentBook,
      onChange: this.setBookState
    };


    return (
      <div className="container">

        <div className="welcomeMessage">
        {renderWelcomeMessage()}

        <div className="cover">
          <form className="form" onSubmit={addToShelf}>

            <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />

            <input type="search" auto-complete="library" disabled={disableInputs} value={currentBook} onChange={setBookState} onBlur={showAutocomplete} placeholder="What would you like to read?" />
            <input type="submit" disabled={disableInputs} value="Add to my shelf" />
          </form>
          {iHaveBooksInMyShelf &&
            <div>
              { Object.keys(myShelf).reverse().map((title, index) => renderShelfRow(title, myShelf[title], index)) }
            </div>
          }
          { totalCharge > 0 && renderTotalCharge(totalCharge) }
        </div>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('app'));
