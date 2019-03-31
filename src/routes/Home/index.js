import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="row py6">
    <h1>Home</h1>

    <Link className="btn mt6" to="/subroute">To subroute</Link>
  </div>
)

export default Home;
