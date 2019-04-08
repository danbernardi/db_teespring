import React from 'react';
import { connect } from 'react-redux';
import { func, oneOfType, node, array } from 'prop-types';
import chroma from 'chroma-js';
import 'styles/core.scss';
import './AppContainer.scss';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inks: null,
      questions: null,
      scenarioId: null,
      loaded: []
    };
    
    this.authToken = process.env.REACT_APP_AUTH_TOKEN;
    this.apiUrl = 'http://challenge.teespring.com/v1/';
    this.findNearestColors = this.findNearestColors.bind(this);
    this.findCheapestInk = this.findCheapestInk.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
    this.getInks = this.getInks.bind(this);
    this.postAnswers = this.postAnswers.bind(this);
  }

  async componentDidMount() {
		const fetchConfig = {
      method: 'GET',
      headers: new Headers({
        'Auth-Token': this.authToken
      }),
      mode: 'cors'
    };
    // const c = chroma;

    // debugger;

    this.getInks(fetchConfig);
    this.getQuestions(fetchConfig);
  }
  
    /**
   * Requests inks from api
   */
  async getInks (config) {
    fetch(`${this.apiUrl}inks`, config)
      .then(res => res.json()).then(res => {
        const loadedArr = this.state.loaded.slice();
        loadedArr.push('inks');
        this.setState({ loaded: loadedArr, inks: res.inks });
      })
      .catch(err => console.log(err));
  }

  /**
   * Requests questions from api
   */
  async getQuestions (config) {
    fetch(`${this.apiUrl}question/evaluate`, config)
      .then(res => res.json()).then(res => {
        const loadedArr = this.state.loaded.slice();
        loadedArr.push('questions');
        this.setState({ loaded: loadedArr, questions: res.questions, scenarioId: res.scenario_id });
      })
      .catch(err => console.log(err));
  }

  componentDidUpdate (prevProps, prevState) {
    // Trigger answer processing when both data fields are returned
    if (prevState.loaded.length < 2 && this.state.loaded.length === 2) {
      const { inks, questions, scenarioId } = this.state;

      // TODO - Fix performance issues. Currently filtering down to
      // a subset of inks due to long processing times for the full array
      const filteredInks = inks;
      // const filteredInks = inks.slice(0, 1000);

      const answers = questions.map(q => ({ inks: q.layers.map(l => {
        return this.findCheapestInk(this.findNearestColors(l.color, filteredInks));
      }) }));

      // Generate body for POST request
      const body = {
        scenario_id: scenarioId,
        answers
      };

      console.log(body);

      this.setState({ answers }, () => this.postAnswers(body));
    }
  }

  /**
   * Compares each value in inks againsts the passed color value and
   * returns an array of all inks that score a euclidean distance
   * of less than 20
   * @param {string} color - hex value representing a color
   * @param {Array} inks[] - array of inks
   * @param {string} inks[].color - hex value assigned to individual ink
   */
  findNearestColors (color, inks) {
    return inks.filter(ink => {
      return chroma.distance(ink.color, color, 'rgb') < 20;
    });
  }

  /**
   * Returns ink value with lowest cost from passed inks array 
   * @param {Array} inks[] - Array of inks
   * @param {number} inks[].cost - Number representing cost of ink
   */
  findCheapestInk (inks) {
    // const getCosts = () => inks.map(c => c.cost);
    // console.log(inks.length);
    // const minValue = Math.min(...getCosts());
    // const minCost = inks.find(i => i.cost === minValue);

    const minCostItem = inks.reduce((a, b) => b.cost > a.cost ? a : b);
    console.log(minCostItem);

    // if (minCost === undefined) debugger;
    if (minCostItem) {
      return minCostItem.id;
    } else {
      // console.log(minCost);
    }

  }

  /**
   * Makes a post request with the answers data
   * @param {Object} body json body
   */
  postAnswers (body) {
    const config = {
      method: 'POST',
      headers: new Headers({
        'Auth-Token': this.authToken,
        'Content-Type': 'application/json'
      }),
      body:JSON.stringify(body),
      mode: 'cors'
    };

    fetch(`${this.apiUrl}answer/evaluate`, config)
      .then(res => res.json()).then(res => {
        console.log(res);
        // TODO - Figure out why the post is
        // failing with { error: "Missing parameters" }
      })
      .catch(err => console.log(err));
  }

  render () {
    const { loaded, answers, scenarioId, inks } = this.state;

    return (
      <div className="appcontainer">
        <div className="pagecontent row">
          <div className="inks__group">
            { answers
              ? <div className="py6">
                  <strong>scenarioId:&nbsp;</strong><span>{ scenarioId }</span>

                  <div className="answers">
                    { answers.map((a, index) => (
                      <div className="answers__item" key={ index }>
                        <strong>inks:&nbsp;</strong><br />
                        <div>
                          { a.inks.map((inkId, inkIndex) => {
                            const ink = inks.find(i => i.id === inkId);
                            return (
                              <div
                                className="ink__item"
                                key={ inkIndex }
                                style={ { backgroundColor: ink.color } }
                              >
                                <span>{ inkId }</span>
                              </div>
                            )
                          }) }
                        </div>
                      </div>
                    )) }
                  </div>
                </div> 
              
              : <h2 className="pt10">
                { loaded.length === 2 ? 'Requesting data...' : 'Processing data...' }
              </h2>
            }
          </div>
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
