import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Tuner from '../components/Tuner';
import Note from '../components/Note';
import Meter from '../components/Meter';

export default class App extends Component {
  state = {
    note: {
      name: 'A',
      octave: 4,
      frequency: 440,
    },
  };

  _update(note) {
    this.setState({note});
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    const tuner = new Tuner();
    tuner.start();
    tuner.onNoteDetected = note => {
      if (this._lastNoteName === note.name) {
        console.log('NOTE DETECTED : ', note);
        this._update(note);
      } else {
        this._lastNoteName = note.name;
      }
    };
  }

  render() {
    return (
      <View style={style.body}>
        <Meter cents={this.state.note.cents} />
        <Note {...this.state.note} />
        <Text style={style.frequency}>
          {this.state.note.frequency.toFixed(1)} Hz
        </Text>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={style.note}>
            {'\n'}App will automatically detect strings and will guide you!!!{' '}
          </Text>
          <Text style={style.note}>Happy tunning !!!</Text>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  frequency: {
    fontSize: 28,
    color: '#37474f',
  },
  note: {
    fontStyle: 'italic',
    alignSelf: 'center',
    fontSize: 20,
    color: '#37474f',
  },
});
