import React from 'react';

const WelcomeMessage = () => (
  <div className="welcomeMessage">
    <h1>Read as you Go.</h1>
    Rent a book here and read as you go
    <div>
      <span>Regular books:</span>
      2$ for the first 2 days and an extra 1.5$ for each day after that
      <br />
      <span>Novels:</span>
      4.5$ for the first 3 days and an extra 1.5$ for each day after that
      <br />
      <span>Fictional books:</span>
      Fixed rate of 3$ per day
    </div>
  </div>
);

export default WelcomeMessage;
