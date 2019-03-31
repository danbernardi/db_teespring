import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { string, object } from 'prop-types';
import AppContainer from 'containers/AppContainer';
import Home from './Home';
import SubRoute from './SubRoute';

export const routes = [
  { path: '/', component: Home },
  { path: '/subroute', component: SubRoute }
];

/**
 * Defines the base routes of the application.
 */
const Routes = ({ router }) => {
  const { location } = router;
  return (
    <AppContainer>
      <Switch location={ location }>
        { routes.map((route, index) => (
          <Route
            { ...route }
            exact
            key={ index }
          />
        )) }
        <Route render={ () => <div>Not found</div> } />
      </Switch>
    </AppContainer>
  );
};

const mapStateToProps = state => ({
  language: state.language,
  router: state.router
});

Routes.propTypes = {
  /* The language in which to display the site (from the Redux store). */
  language: string,
  router: object
};

export default connect(mapStateToProps)(Routes);
