import './App.css';
import React from 'react'

function App(){
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [time, setTime] = React.useState(25*60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [breakTime, setBreakTime] = React.useState(false);
  const previousTime = React.useRef(null);
  const previousSessionLength = React.useRef(null);

  React.useEffect(() => {
    previousTime.current = time;
  }, [time]);

  React.useEffect(() => {
    previousSessionLength.current = sessionLength;
  }, [sessionLength]);

  const playAlarm = () => {
    document.getElementById("beep").play();
  }

  const decrement = (ref = '') => {
    if (ref === 'break') {
      if (breakLength - 1 > 0) {
        setBreakLength((prev) => prev - 1);
      }
    }
    else {
      if (previousSessionLength.current - 1 > 0) {
        previousSessionLength.current -= 1;
        setSessionLength(previousSessionLength.current);
        setTime(previousSessionLength.current*60);
      }
    }
  }

  const increment = (ref = '') => {
    if (ref === 'break') {
      if (breakLength + 1 <= 60) {
      setBreakLength((prev) => prev + 1);
      }
    }
    else {
      if (sessionLength + 1 <= 60) {
      setSessionLength((prev) => prev + 1);
      setTime((sessionLength + 1)*60);
      }
    }
  }

  const displayTime = () => {
    let min = Math.floor(time / 60);
    let sec = time % 60;
    return (
      (min < 10 ? `0${min}` : `${min}`)
      + `:` +
      (sec < 10 ? `0${sec}` : `${sec}`)
    )
  }

  const controlTime = () => {
    let second = 1000;
    let nextTime = new Date().getTime() + second;
    let breaking = breakTime
    if (!timerOn) {
      let interval = setInterval(() => {
        let currentTime = new Date().getTime();
        if (currentTime > nextTime) {
          if (previousTime.current <= 0 && breaking === false) {
            setBreakTime(true);
            breaking = true;
            console.log('Break!');
            setTime((prev) => (breakLength*60));
          }
          else if (previousTime.current <= 0 && breaking === true) {
            setBreakTime(false);
            breaking = false;
            console.log('Session!');
            setTime((prev) => (sessionLength*60));
          }
          else if (previousTime.current <= 1) {
            playAlarm();
            setTime((prev) => prev - 1);
          }
          else {
            setTime((prev) => prev - 1);
          }
          nextTime += second;
        }
      }, 10);
      localStorage.clear();
      localStorage.setItem("interval-id", interval)
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"))
    }
    setTimerOn(!timerOn)
  }

  const resetTime = () => {
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    setBreakTime(false);
    setBreakLength(5);
    setSessionLength(25);
    setTime(25*60);
    clearInterval(localStorage.getItem("interval-id"))
    setTimerOn(false);
  }

  return (
    <div className="clock">
        <p className="title mb-0">25 + 5 Clock</p>
      <div className="control">
        <div id="break-label">Break Length
          <div className="wrapper">
            <button className="btn btn-light" onClick={() => decrement('break')} id="break-decrement">-</button>
            <div id="break-length">{breakLength}</div>
            <button className="btn btn-light" onClick={() => increment('break')} id="break-increment">+</button>
          </div>
        </div>
        <div id="session-label">Session Length
          <div className="wrapper">
          <button className="btn btn-light" onClick={decrement} id="session-decrement">-</button>
            <div id="session-length">{sessionLength}</div>
            <button className="btn btn-light" onClick={increment} id="session-increment">+</button>
          </div>
        </div>
      </div>
      <div id="timer-label">{breakTime ? 'Break' : 'Session'}
        <div id="time-left">{displayTime()}</div>
      </div>
      <div id="regulator">
        <button id="start_stop" className="btn btn-light" onClick={controlTime}>
          {(timerOn ? ("Stop") : ("Start"))}
        </button>
        <button id="reset" className="btn btn-warning" onClick={resetTime}>Reset</button>
      </div>
      <audio id="beep" src="http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg"/>
    </div>
  );
}

export default App;
