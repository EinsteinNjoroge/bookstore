import React, { Fragment } from 'react';


const renderHeaderRow = (
  <div className="shelf-header">
    <span className="titleSpan">Book Title</span>
    <span>Copies</span>
    <span>Duration (Days)</span>
    <span />
  </div>
);

const ShelfRow = ({
  index,
  title,
  rentDuration,
  numOfBooks,
  addNumOfBooks,
  addRentDays,
  removeFromShelf
}) => (
  <div className="shelf-row">
    <span className="titleSpan">{title}</span>
    <input id={title} onChange={addNumOfBooks} type="number" min="1" value={numOfBooks} />
    <input id={title} onChange={addRentDays} type="number" min="1" value={rentDuration} />
    <button id={title} type="button" onClick={removeFromShelf} className="delete-btn">Remove</button>
  </div>
);


const Shelf = ({ books, addNumOfBooks, removeFromShelf, addRentDays }) => (
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

export default Shelf;
