import React from 'react';
import { connect } from 'react-redux';
import { func, oneOfType, node, array } from 'prop-types';
import { setActiveBreakpoint } from 'redux/actions';
import { initReduxBreakpoints } from 'utils/responsiveHelpers';
import { get } from 'lodash';
import 'styles/core.scss';
import './AppContainer.scss';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { dogs: null };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    const authToken = process.env.REACT_APP_CLIENT_ID;
    const apiUrl = 'http://challenge.teespring.com/v1';

		const fetchConfig = {
      method: 'GET',
      headers: new Headers({
        "Content-Type": "application/json",
        'Auth-Token': `Client-ID ${authToken}`
      }),
      mode: 'cors'
    };
    

    fetch(`${apiUrl}/inks`, fetchConfig)
      .then(res => res.json()).then(res => {
        this.setState({ data: res.data })
      })
      .catch(err => console.log(err));
    
    initReduxBreakpoints.call(
      this, window, (breakpointName, breakpointSize, mediaQueryState) =>
        dispatch(setActiveBreakpoint(breakpointName, breakpointSize, mediaQueryState))
    );
	}

  render () {
    const { children } = this.props;
    const { data } = this.state;
    if (!data) return false;
    console.log(data);

    return (
      <div className="appcontainer">
        <div className="pagecontent row">
          <h1>Hi there</h1>
        </div>
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: oneOfType([node, array]),
  dispatch: func,

  // Included in initReduxBreakpoints automatically
  // eslint-disable-next-line
  setActiveBreakpoint: func,
};

export default connect()(AppContainer);
