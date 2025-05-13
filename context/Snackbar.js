import {useContext, useState, useEffect} from 'react';
import {createContext} from 'react';
import Sound from 'react-native-sound';
export const SnackbarContext = createContext();
export const SnackProvider = ({children}) => {
  const [show, setShow] = useState(false);
  const [messege, setMessege] = useState('');
  const [explain, setExplain] = useState('');
  const [type, setType] = useState('info');
  const [sound, setSound] = useState(null);

  var ding = new Sound('ding2', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    ding.setVolume(1);
  });

  var beep = new Sound('beep', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    beep.setVolume(1);
  });
  const handleSnackbar = ({error, messege}) => {
    if (error) {
      setShow(true);
      setMessege(error[0]);
      setExplain(error[1]);
      setType('error');
      setSound(beep.play());
    } else if (messege) {
      setShow(true);
      setMessege(messege[0]);
      setExplain(messege[1]);
      setType('success');
      setSound(ding.play());
    } else {
      setShow(false);
    }
  };

  return (
    <SnackbarContext.Provider
      value={{type, show, setShow, messege, sound, explain, handleSnackbar}}>
      {children}
    </SnackbarContext.Provider>
  );
};
