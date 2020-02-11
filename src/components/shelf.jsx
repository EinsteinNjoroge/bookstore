/* eslint-disable react/no-array-index-key,react/forbid-prop-types */
import React, { Fragment } from 'react';
import {
  func, number, string, shape,
} from 'prop-types';

const renderHeaderRow = (
  <div className="shelf-header">
    <span className="titleSpan">Book Title</span>
    <span>Copies</span>
    <span>Duration (Days)</span>
    <span />
  </div>
);

const ShelfRow = ({
  title,
  rentDuration,
  numOfBooks,
  addNumOfBooks,
  addRentDays,
  removeFromShelf,
}) => (
  <div className="shelf-row">
    <span className="titleSpan">{title}</span>
    <input name={title} onChange={addNumOfBooks} type="number" min="1" value={numOfBooks} />
    <input name={title} onChange={addRentDays} type="number" min="1" value={rentDuration} />
    <button name={title} type="button" onClick={removeFromShelf} className="delete-btn">Remove</button>
  </div>
);


const Shelf = ({
  books, addNumOfBooks, removeFromShelf, addRentDays,
}) => (
  <Fragment>
    {renderHeaderRow}
    {
      Object.keys(books)
        .reverse()
        .map((title, index) => (
          <ShelfRow
            key={index}
            addNumOfBooks={addNumOfBooks}
            addRentDays={addRentDays}
            removeFromShelf={removeFromShelf}
            title={title}
            index={index}
            {...books[title]}
          />
        ))
    }
  </Fragment>
);


Shelf.propTypes = {
  books: shape({}).isRequired,
  addNumOfBooks: func.isRequired,
  removeFromShelf: func.isRequired,
  addRentDays: func.isRequired,
};

ShelfRow.propTypes = {
  title: string.isRequired,
  rentDuration: number.isRequired,
  numOfBooks: number.isRequired,
  addNumOfBooks: func.isRequired,
  addRentDays: func.isRequired,
  removeFromShelf: func.isRequired,
};


export default Shelf;
