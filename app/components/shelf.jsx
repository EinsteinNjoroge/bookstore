import React from 'react';

const ShelfRow = ({
  index,
  title,
  rentDuration,
  numOfBooks,
}) => (
  <div className="shelf-row">
    <span>{index + 1}</span>
    <span className="titleSpan">{title}</span>
    <span>{rentDuration}</span>
    <span>{numOfBooks}</span>
  </div>
);


const Shelf = ({ books }) => Object.keys(books)
  .reverse()
  .map((title, index) => <ShelfRow key={index} title={title} index={index} {...books[title]} />);

export default Shelf;
