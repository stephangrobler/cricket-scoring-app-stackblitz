import { nanoid } from 'nanoid';
import * as React from 'react';
import {
  getCurrentMatch,
  persistMatch,
  getCurrentOver,
  persistOver,
  getCurrentInnings,
  persistInnings,
} from './api/matchData';
import './style.css';
import BattersAndBowler from './components/BattersAndBowler';
import FairDelivery from './components/FairDelivery';
import ExtrasComponent from './components/ExtrasComponent';
import WicketComponent from './components/WicketComponent';

export default function App() {
  const matchData = getCurrentMatch();
  const inningData = getCurrentInnings(matchData.id);
  const overData = getCurrentOver();

  const [match, setMatch] = React.useState(matchData);
  const [innings, setInnings] = React.useState(inningData);
  const [over, setOver] = React.useState(overData);
  const [bowler, setBowler] = React.useState('');
  const [batsman1, setBatsman1] = React.useState('');
  const [batsman2, setBatsman2] = React.useState('');
  const [batsman, setBatsman] = React.useState('');
  const [facing, setFacing] = React.useState(1);
  const [multiplier, setMultiplier] = React.useState(1);
  const [extra, setExtra] = React.useState('');

  const ballTemplate = {
    bowler: '',
    batsman: '',
    ball: '',
    wicket: '',
    score: 0,
    extras: 0,
    bowlerScore: 0,
    batsmanScore: 0,
    symbol: '',
    multiplier: 1,
  };

  const handleBall = (ball, extraScore) => {
    const newBall = { ...ballTemplate, ball, bowler, batsman, multiplier };
    switch (ball) {
      case 'DOT':
        newBall.score = 0;
        break;
      case '1':
        newBall.score = 1 * multiplier;
        newBall.batsmanScore = newBall.score;
        newBall.bowlerScore = newBall.score;
        break;
      case '2':
        newBall.score = 2 * multiplier;
        newBall.batsmanScore = newBall.score;
        newBall.bowlerScore = newBall.score;
        break;
      case '3':
        newBall.score = 3 * multiplier;
        newBall.batsmanScore = newBall.score;
        newBall.bowlerScore = newBall.score;
        break;
      case 'FOUR':
        newBall.score = 4 * multiplier;
        newBall.batsmanScore = newBall.score;
        newBall.bowlerScore = newBall.score;
        break;
      case '5':
        newBall.score = 5 * multiplier;
        newBall.batsmanScore = newBall.score;
        newBall.bowlerScore = newBall.score;
        break;
      case 'SIX':
        newBall.score = 6 * multiplier;
        newBall.batsmanScore = newBall.score;
        newBall.bowlerScore = newBall.score;
        break;
      case 'WIDE':
        newBall.extras = 1 + extraScore;
        newBall.batsmanScore = 0;
        newBall.bowlerScore = newBall.score;
        break;
      case 'NOBALL':
        newBall.extras = 1 + extraScore;
        newBall.batsmanScore = 0;
        newBall.bowlerScore = newBall.score;
        break;
      // should this be here?? byes should be extra, does it count against the bowler though?
      case 'BYE':
        newBall.extras = 0 + extraScore;
        break;
      case 'LEGBYE':
        newBall.extras = 0 + extraScore;
        break;
      case 'CAUGHT':
        newBall.score = 0;
        newBall.wicket = 'CAUGHT';
        break;
      case 'BOWLED':
        newBall.score = 0;
        newBall.wicket = 'CAUGHT';
        break;
      case 'RUNOUT':
        newBall.score = 0;
        newBall.wicket = 'RUNOUT';
        break;
      case 'STUMPED':
        newBall.score = 0;
        newBall.wicket = 'STUMPED';
        break;
    }

    const balls = [...over.balls, newBall];
    setOver({ ...over, balls });
    persistOver({ ...over, balls });

    setExtra('');
    setMultiplier(1);
  };

  const handleEndOver = () => {
    const newInnings = { ...innings, overs: [...innings.overs, over] };

    setInnings(newInnings);
    persistInnings(newInnings);

    setOver({ bowler: '', balls: [] });
    persistOver({ bowler: '', balls: [] });

    persistMatch(match);
  };

  const handleEndMatch = () => {
    setInnings([]);
    setMatch([]);
    persistMatch(match);
  };

  const handleEndInnings = () => {
    setInnings([]);
    setMatch([...match, innings]);
    persistMatch(match);
  };

  const handleFacing = (facingBatsman) => {
    setBatsman(facingBatsman === 1 ? batsman1 : batsman2);
    setFacing(facingBatsman);
  };

  const getBatsmenScore = (batsman) => {
    const score = innings.overs.reduce((acc, cur) => {
      return (acc += cur.balls.reduce((overAcc, overCur) => {
        if (overCur.batsman === batsman) {
          overAcc += overCur.batsmanScore;
        }
        return overAcc;
      }, 0));
    }, 0);
    return score;
  };

  const displayScore = () => {
    const score = innings.overs.reduce((acc, cur) => {
      return (acc += cur.balls.reduce((overAcc, overCur) => {
        return (overAcc += overCur.score);
      }, 0));
    }, 0);
    return score;
  };

  return (
    <div className="container m-auto px-1">
      <header className="my-2">
        <button className="btn btn-primary m-1" onClick={handleEndMatch}>
          New Match
        </button>
        <button className="btn btn-primary m-1" onClick={handleEndInnings}>
          New Innings
        </button>
      </header>
      <BattersAndBowler
        bowler={bowler}
        setBowler={setBowler}
        batsman1={batsman1}
        setBatsman1={setBatsman1}
        handleFacing={handleFacing}
        batsman2={batsman2}
        setBatsman2={setBatsman2}
        facing={facing}
      />
      <FairDelivery
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        handleBall={handleBall}
      />
      <ExtrasComponent
        extra={extra}
        setExtra={setExtra}
        handleBall={handleBall}
      />
      <WicketComponent handleBall={handleBall} />
      <footer className="mt-5">
        <button className="btn btn-error m-1" onClick={handleEndOver}>
          End Over
        </button>
        <button className="btn btn-error m-1" onClick={handleEndOver}>
          End Innings
        </button>
        <button className="btn btn-error m-1" onClick={handleEndOver}>
          End Match
        </button>
      </footer>

      <div>
        <div>
          Scoresheet: {displayScore()} for WICKETS after {match.length} overs
        </div>
        <ul>
          <li>{getBatsmenScore(batsman1)}</li>
          <li>{getBatsmenScore(batsman2)}</li>
        </ul>

        <div>Over:</div>
        <div>
          <ul className={'over-display'}>
            {over.balls.map((ball) => (
              <li>{ball.ball}</li>
            ))}
          </ul>
        </div>
        {/* <div>
          <code>{JSON.stringify(over)}</code>
        </div> */}
        <div>
          Innings: <br />
          {/* <code>{JSON.stringify(innings)}</code> */}
          <ul>
            {innings.overs.map((over) => (
              <li>
                <ul className={'over-display'}>
                  {over.balls.map((ball) => (
                    <li>{ball.ball}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div>
          Match: <br />
          <code>{JSON.stringify(match)}</code>
        </div>
      </div>
    </div>
  );
}
