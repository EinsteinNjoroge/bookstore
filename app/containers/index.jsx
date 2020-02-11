import React from 'react';
import '../assets/index.css';
import { ToastContainer, toast } from 'react-toastify';
import components from '../components';
import 'react-toastify/dist/ReactToastify.css';

const {
  WelcomeMessage,
  Form,
  Shelf,
  TotalCharge,
} = components;

const DEFAULT_RENT_DURATION = 1;
const DEFAULT_BOOK_COUNT = 1;
const MAX_RENTED_BOOK = 10;


// eslint-disable-next-line react/prefer-stateless-function
class MainContainer extends React.Component {
  state = {
    currentBook: '',
    myShelf: {},
    rentRate: 1,
  };

  setBookState = ({ target: { value: currentBook } }) => {
    this.setState({ currentBook });
  };

  calculateCharge = () => {
    const { myShelf, rentRate } = this.state;
    let totalCharge = 0;
    Object.keys(myShelf).forEach((title) => {
      const { rentDuration, numOfBooks } = myShelf[title];
      totalCharge += rentDuration * rentRate * numOfBooks;
    });

    return totalCharge;
  };

  showMessage = (msg, state) => {
    switch (state) {
      case 'error':
        toast.error(msg);
        break;
      case 'success':
        toast.success(msg);
        break;
      default:
        toast(msg);
    }
  };

  addNumOfBooks = ({ target: { id: book, value } }) => {
    if (value < 1) {
      this.showMessage('Number Books rented can only cannot be less than 1', 'error');
      return;
    }
    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    newShelf[book].numOfBooks = value;
    this.setState({ myShelf: newShelf });
  };

  addRentDays = ({ target: { id: book, value } }) => {
    if (value < 1) {
      this.showMessage('Books can only be rented for at-least one day', 'error');
      return;
    }

    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    newShelf[book].rentDuration = value;
    this.setState({ myShelf: newShelf });
  };

  addToShelf = (e) => {
    e.preventDefault();

    const { currentBook, myShelf } = this.state;
    if (!currentBook) {
      this.showMessage('Enter a valid title', 'error');
      return;
    }

    const newShelf = Object.assign({}, myShelf);

    if (newShelf[currentBook]) {
      newShelf[currentBook].numOfBooks += 1;
    } else {
      newShelf[currentBook] = {
        rentDuration: DEFAULT_RENT_DURATION,
        numOfBooks: DEFAULT_BOOK_COUNT,
      };
    }

    this.setState({ myShelf: newShelf, currentBook: '' });
  };

  removeFromShelf = ({ target: { id: book } }) => {
    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    delete newShelf[book];
    this.setState({ myShelf: newShelf });
  };

  render() {
    const {
      addToShelf,
      setBookState,
      state,
      calculateCharge,
      addNumOfBooks,
      addRentDays,
      removeFromShelf,
    } = this;

    const { currentBook, myShelf } = state;

    const iHaveBooksInMyShelf = Object.keys(myShelf).length > 0;
    const disableInputs = Object.keys(myShelf).length >= MAX_RENTED_BOOK;
    const totalCharge = calculateCharge();

    return (
      <div className="container">
        <WelcomeMessage />
        <div>
          <ToastContainer position={toast.POSITION.TOP_LEFT} />
          <Form
            disabled={disableInputs}
            currentBook={currentBook}
            onSubmit={addToShelf}
            onChange={setBookState}
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
          { totalCharge > 0 && <TotalCharge charge={totalCharge} /> }
        </div>
      </div>
    );
  }
}
export default MainContainer;
