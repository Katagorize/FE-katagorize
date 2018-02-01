import React from 'react';
import '../css/style.css';
import '../css/KataData.css';
import CircularProgressbar from 'react-circular-progressbar';
import Trend from 'react-trend';


class KataData extends React.Component {

    state = {
        tests: 0,
        passes: 0,
        fails: 0,
        passMessages: [],
        failureMessage: [],
        scores: [0, 0]
    }

    getAllData = (newProps) => {

        let username = this.props.match.params.username;
        let kataname = this.props.match.params.kata_name;

        if (newProps) {

            username = newProps.match.params.username
            kataname = newProps.match.params.kata_name
        }

        return fetch(`http://katalystpro-env.eu-west-2.elasticbeanstalk.com/api/users/${username}/katas/${kataname}/test`)

        .then((data) => {
            return data.json()
        })
        .then((data) => {
        console.log(data)
           return this.setState({
                tests: data.stats.tests,
                passes: data.stats.passes,
                fails: data.stats.failures,
                passMessages: data.passes,
                failureMessage: data.failures

            })
    })
}

   componentDidMount() {
        this.getUserScores()
        .then(()=> {
            this.getAllData()
        })
    }
 

    componentWillReceiveProps(newProps) {
        this.getUserScores(newProps)
        .then(() => {
            this.getAllData();
        })
    
    }

    getUserScores = (props) => {
        let username = this.props.match.params.username;
        let kataname = this.props.match.params.kata_name;

        if (props) {

            username = props.match.params.username
            kataname = props.match.params.kata_name
        }
  
        return fetch(`http://katalystpro-env.eu-west-2.elasticbeanstalk.com/api/users`)
            .then((res) => res.json())
            .then((userKatas) => {
              return userKatas[username][kataname].map((score) => {
                  return Number(score.match(/(\d+)(?!.*\d)/)[0])
              })
            })
            .then((scores) => {
                console.log(scores)
            return this.setState({scores})
            })
    }

    render() {
        return (
            <div className="results">
                <div className='resultsTitle'>
                    <h4>Kata data</h4>
                </div>

                <div className='circleDivA'>
                    <CircularProgressbar
                        percentage={100 / this.state.tests * this.state.passes}
                        strokeWidth={5}
                        Clockwise
                        initialAnimation={true}
                        textForPercentage={(percentage) => {
                            return percentage === 100 ? `Woo!!` : `${this.state.passes} / ${this.state.tests}`;
                        }}
                        classForPercentage={(percentage) => {
                            return percentage === 100 ? 'complete' : 'incomplete';
                        }}
                    />
                    <p>Tests Passed</p>
                </div>


                <div className='circleDivB'>
                    <CircularProgressbar
                        percentage={Math.ceil(100 / this.state.tests * this.state.passes)}
                        strokeWidth={5}
                        Clockwise
                        initialAnimation={true}
                    />
                    <p>Percentage complete</p>
                </div>

                <div className='graph'>

                    <h4>Scores for each test.</h4>
                    <Trend data={this.state.scores}
                        autoDraw
                        autoDrawDuration={4000}
                        autoDrawEasing="ease-out" 
                        gradient={['#C31433', '#395E66', '#083D77', '#DDE2C6']}
                        width={300} 
                        height={250}
                        strokeWidth={4}/>
                    <p>This graph shows the highs and lows of your scores, you should be aiming high. The straighter the line, the more consistent you are with your code. </p>    
                </div>

                <div className='failBox'>
                <h6>Here are the tests that you have failed.</h6>
                    {this.state.failureMessage.map((fails) => {
                        return (
                            <div className='BoxContent'><i className="fa fa-times-circle fa-lg failed" aria-hidden="true"></i><p>{fails.title}</p></div>
                        )
                    })}
                </div>

                <div className='passBox'>
                <h6>Here are the tests that you have passed.</h6>

                    {this.state.passMessages.map((passes) => {
                        return (
                            <div className='BoxContent'><i className="fa fa-check fa-lg passed" aria-hidden="true"></i><p>{passes.title}</p></div>
                        )
                    })}
                </div>

                

            </div>
        )
    }

}

export default KataData;