import React from 'react';
import '../assets/index.css';
import components from '../components';

const {
  WelcomeMessage,
  Form,
  Shelf,
  TotalCharge,
  Toast,
} = components;

const DEFAULT_RENT_DURATION = 1;
const DEFAULT_BOOK_COUNT = 1;
const MAX_RENTED_BOOK = 10;


// eslint-disable-next-line react/prefer-stateless-function
class MainContainer extends React.Component {
  state = {
    currentBook: '',
    myShelf: {},
    toast: {},
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

  showMessage = (msg, state) => this.setState({ toast: { msg, state } });

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

  render() {
    const {
      addToShelf,
      setBookState,
      state,
      calculateCharge,
    } = this;

    const { currentBook, toast, myShelf } = state;

    const iHaveBooksInMyShelf = Object.keys(myShelf).length > 0;
    const disableInputs = Object.keys(myShelf).length >= MAX_RENTED_BOOK;
    const totalCharge = calculateCharge();

    return (
      <div className="container">
        <WelcomeMessage />
        <div>
          {toast.msg && <Toast {...toast} />}
          <Form
            disabled={disableInputs}
            currentBook={currentBook}
            onSubmit={addToShelf}
            onChange={setBookState}
          />
          { iHaveBooksInMyShelf && <Shelf books={myShelf} /> }
          { totalCharge > 0 && <TotalCharge charge={totalCharge} /> }
        </div>
      </div>
    );
  }
}
export default MainContainer;