/* eslint-disable react/no-array-index-key,react/forbid-prop-types */
import React, { Fragment } from 'react';
import {
  func, number, string, shape,
} from 'prop-types';

const renderHeaderRow = (
  <div className="shelf-header">
    <span className="titleSpan">Book Title</span>
    <span className="genre">Genre</span>
    <span className="copies">Copies</span>
    <span className="duration">Duration (Days)</span>
    <span className="charge">Charge</span>
    <span className="action" />
  </div>
);

const ShelfRow = ({
  title,
  genre,
  rentDuration,
  charge,
  numOfBooks,
  addNumOfBooks,
  addRentDays,
  removeFromShelf,
}) => (
  <div className="shelf-row">
    <span className="titleSpan">{title}</span>
    <span className="genre">{genre}</span>
    <input
      className="copies"
      name={title}
      onChange={addNumOfBooks}
      type="number"
      min="1"
      value={numOfBooks}
    />
    <input
      className="duration"
      name={title}
      onChange={addRentDays}
      type="number"
      min="1"
      value={rentDuration}
    />
    <span className="charge">
      {charge}
    </span>
    <button
      name={title}
      type="button"
      onClick={removeFromShelf}
      className="action delete-btn"
    >
      Remove
    </button>
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
  genre: string.isRequired,
  charge: number.isRequired,
  rentDuration: number.isRequired,
  numOfBooks: number.isRequired,
  addNumOfBooks: func.isRequired,
  addRentDays: func.isRequired,
  removeFromShelf: func.isRequired,
};


export default Shelf;
