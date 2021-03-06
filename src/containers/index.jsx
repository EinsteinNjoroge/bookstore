/* eslint-disable no-param-reassign */
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import components from '../components';

// fetch data from a json file
// Ideally this would be a fetch() function componentDidMount()
import { library } from '../api/library.json';

let allBooks = [];
Object.keys(library).forEach((genre) => {
  const {
    books, rentRate, minRentDuration, minCharge,
  } = library[genre];
  books.forEach((book) => {
    book.rentRate = rentRate;
    book.genre = genre;
    if (minRentDuration) {
      book.minRentDuration = minRentDuration;
    }
    if (minRentDuration) {
      book.minCharge = minCharge;
    }
  });
  allBooks = [...allBooks, ...books];
});

const {
  WelcomeMessage,
  Form,
  Shelf,
  TotalCharge,
} = components;

const DEFAULT_RENT_DURATION = 1;
const DEFAULT_BOOK_COUNT = 1;
const MAX_RENTED_BOOK = 10;

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? []
    : allBooks.filter(book => book.title.toLowerCase().startsWith(inputValue));
};

export const getSuggestionValue = suggestion => suggestion.title;

export const renderSuggestion = ({ title, genre }) => `${title} - ${genre}`;

class MainContainer extends React.Component {
  state = {
    currentBook: '',
    myShelf: {},
    suggestions: [],
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: getSuggestions(value) });
  };

  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  setBookState = (event, { newValue }) => this.setState({ currentBook: newValue });

  getTotalCharge = () => {
    let totalCharge = 0;
    const { myShelf } = this.state;
    Object.values(myShelf).forEach((book) => { totalCharge += book.charge; });
    return totalCharge;
  };

  calculateCharge = (book) => {
    const { myShelf } = this.state;
    const newShelf = { ...myShelf };
    const {
      rentDuration, numOfBooks, rentRate, minRentDuration, minCharge,
    } = myShelf[book];

    if (minRentDuration && minCharge) {
      newShelf[book].charge = minCharge;

      if (rentDuration > minRentDuration) {
        newShelf[book].charge += (rentDuration - minRentDuration) * rentRate * numOfBooks;
      }
    } else {
      newShelf[book].charge = rentDuration * rentRate * numOfBooks;
    }

    this.setState({ myShelf: newShelf });
  };

  showMessage = (msg, state) => {
    switch (state) {
      case 'error':
        toast.error(msg);
        break;
      case 'warn':
        toast.warn(msg);
        break;
      default:
    }
  };

  addNumOfBooks = ({ target: { name: book, value } }) => {
    if (value < 1) {
      this.showMessage('Number Books rented can only cannot be less than 1', 'error');
      return;
    }
    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    newShelf[book].numOfBooks = parseInt(value, 10);
    this.setState(
      { myShelf: newShelf },
      () => this.calculateCharge(book),
    );
  };

  addRentDays = ({ target: { name: book, value } }) => {
    if (value < 1) {
      this.showMessage('Books can only be rented for at-least one day', 'error');
      return;
    }

    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    newShelf[book].rentDuration = parseInt(value, 10);
    this.setState(
      { myShelf: newShelf },
      () => this.calculateCharge(book),
    );
  };

  addToShelf = (e) => {
    e.preventDefault();

    const { currentBook, myShelf } = this.state;
    if (!currentBook) {
      this.showMessage('Please enter a valid title', 'error');
      return;
    }

    if (!allBooks.find(book => book.title === currentBook)) {
      this.showMessage('Sorry we dont have that book in our library', 'error');
      return;
    }

    const newShelf = Object.assign({}, myShelf);

    if (newShelf[currentBook]) {
      newShelf[currentBook].numOfBooks += 1;
    } else {
      const bookDetails = allBooks.filter(x => x.title === currentBook)[0];
      newShelf[currentBook] = {
        ...bookDetails,
        rentDuration: DEFAULT_RENT_DURATION,
        numOfBooks: DEFAULT_BOOK_COUNT,
      };
    }

    this.setState(
      { myShelf: newShelf, currentBook: '' },
      () => this.calculateCharge(currentBook),
    );
  };

  removeFromShelf = ({ target: { name: book } }) => {
    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    delete newShelf[book];
    this.setState({ myShelf: newShelf });
  };

  render() {
    const {
      addToShelf,
      setBookState,
      showMessage,
      state,
      getTotalCharge,
      addNumOfBooks,
      addRentDays,
      removeFromShelf,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
    } = this;

    const { currentBook, myShelf, suggestions } = state;

    const iHaveBooksInMyShelf = Object.keys(myShelf).length > 0;
    const disableInputs = Object.keys(myShelf).length >= MAX_RENTED_BOOK;
    if (disableInputs) {
      showMessage("You've reached the maximum number of books borrowable", 'warn');
    }

    const inputProps = {
      placeholder: 'What would you like to read?',
      value: currentBook,
      onChange: setBookState,
      type: 'search',
    };

    const autoSuggestProps = {
      suggestions,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
      inputProps,
    };

    return (
      <div className="container">
        <WelcomeMessage />
        <div>
          <ToastContainer position={toast.POSITION.TOP_LEFT} />
          <Form
            autoSuggestProps={autoSuggestProps}
            disabled={disableInputs}
            onSubmit={addToShelf}
          />
          {
            iHaveBooksInMyShelf && (
            <Shelf
              removeFromShelf={removeFromShelf}
              addNumOfBooks={addNumOfBooks}
              addRentDays={addRentDays}
              books={myShelf}
            />
            )
          }
          { iHaveBooksInMyShelf > 0 && <TotalCharge charge={getTotalCharge()} /> }
        </div>
      </div>
    );
  }
}
export default MainContainer;
