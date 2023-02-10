import './App.css';
import React, {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { faCircleStop } from "@fortawesome/free-solid-svg-icons";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [breakLength, setBreakLength] = useState(5*60);
  const [sessionLength, setSessionLength] = useState(25*60);
  const [time, setTime] = useState(sessionLength);
  const [timerOn, setTimerOn] = useState(false);
  const [breakTime, setBreakTime] = useState(false);
  const previousTime = useRef(null);

  useEffect(() => {
    previousTime.current = time;
  }, [time]);

  const formatLength = (length) => {
    return Math.floor(length / 60);
  }

//   // const sleep = (milliseconds) => {
//   //   console.log("sleeping")
//   //   return new Promise(resolve => setTimeout(resolve, milliseconds))
//   // }

  const decrement = (ref = '') => {
    if (ref === 'break') {
      if (breakLength - 60 > 0) {
        setBreakLength((prev) => prev - 60);
      }
    }
    else {
      if (sessionLength - 60 > 0) {
        setSessionLength((prev) => prev - 60);
        setTime(sessionLength - 60);
      }
    }
  }

  const increment = (ref = '') => {
    if (ref === 'break') {
      if (breakLength + 60 <= 60*60) {
      setBreakLength((prev) => prev + 60);
      }
    }
    else {
      if (sessionLength + 60 <= 60*60) {
      setSessionLength((prev) => prev + 60);
      setTime(sessionLength + 60);
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

  const playAlarm = () => {
    document.getElementById("beep").play();
  }

const timer = () => {
  let second = 1000;
  let next = new Date().getTime() + second;
  let breaking = breakTime
  if(!timerOn) {
    let interval = setInterval(() => {
      let current = new Date().getTime();
      if (current > next) {
        if (previousTime.current <= 0 && breaking === false) {
          setBreakTime(true);
          breaking = true;
          console.log('break!');
          setTime((prev) => breakLength);
        }
        else if (previousTime.current <= 0 && breaking === true) {
          setBreakTime(false);
          breaking = false;
          console.log('session!');
          setTime((prev) => sessionLength);
        }
        else if (previousTime.current <= 1) {
          playAlarm();
          setTime((prev) => prev - 1);
        }
        else {
          setTime((prev) => prev - 1);
        }
        next += second;
      }
    }, 1);
    localStorage.clear();
    localStorage.setItem('interval-id', interval);
  }
  if (timerOn) {
    clearInterval(localStorage.getItem('interval-id'))
  }
  setTimerOn(!timerOn);
}

  const reset = () => {
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    setBreakLength(5*60);
    setSessionLength(25*60);
    setTime(25*60);
    setBreakTime(false);
    clearInterval(localStorage.getItem("interval-id"))
    setTimerOn(false);
  }

  return (
    <div className="clock">
        <p className="title mb-0">25 + 5 Clock</p>
      <div className="control">
        <div id="break-label">Break Length
          <div className="wrapper">
            <div id="break-decrement" onClick={() => decrement('break')}><FontAwesomeIcon icon={faCircleArrowDown} /></div>
            <div id="break-length">{formatLength(breakLength)}</div>
            <div id="break-increment" onClick={() => increment('break')}><FontAwesomeIcon icon={faCircleArrowUp} /></div>
          </div>
        </div>
        <div id="session-label">Session Length
          <div className="wrapper">
            <div id="session-decrement" onClick={decrement}><FontAwesomeIcon icon={faCircleArrowDown} /></div>
            <div id="session-length">{formatLength(sessionLength)}</div>
            <div id="session-increment" onClick={increment}><FontAwesomeIcon icon={faCircleArrowUp} /></div>
          </div>
        </div>
      </div>
      <div id="timer-label">{breakTime ? 'Break' : 'Session'}
        <div id="time-left">{displayTime()}</div>
      </div>
      <div id="regulator">
        <div id="start_stop" onClick={timer}>
          {timerOn ? <FontAwesomeIcon icon={faCircleStop}/> : <FontAwesomeIcon icon={faCirclePlay}/>}
        </div>
        <div id="reset"><FontAwesomeIcon icon={faArrowsRotate} onClick={reset}/></div>
      </div>
      <audio id="beep" src="http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg"/>
    </div>
  );
}

export default App;
