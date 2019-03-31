import React from 'react';
import { Link } from 'react-router-dom';

const SubRoute = () => (
  <div className="row py6">
    <h1>subroute</h1>

    <Link className="btn mt6" to="/">To home</Link>
  </div>
)

export default SubRoute;