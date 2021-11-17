import React, { useState, useEffect } from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';


const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <Text>{getRemaining(seconds)}</Text>
  );
};

const formatNumber = (number:number) => `0${number}`.slice(-2);

const getRemaining = (time:number) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return formatNumber(mins) + ':' + formatNumber(secs) ;
}

export default Timer;
