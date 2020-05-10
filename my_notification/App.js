/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import BackgroundJob from "react-native-background-job";
import { getBeaconsInit, GetPermissions } from './Beacon.js';

BackgroundJob.register({
  jobKey: "regularJobKey",
  job: () => {
    console.log(`Background Job fired!. Key = `);
    getBeaconsInit()
  }
});

const App: () => React$Node = () => {

  async function verifyLocationPermission() {
    // se location nao ativada, beacon nao funciona
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((granted) => {
      console.log('granted', true)
      if (!granted) {
        GetPermissions()
      }
    });
  }

  useEffect(() => {
    verifyLocationPermission()

    BackgroundJob.schedule({
      jobKey: "regularJobKey",
      notificationTitle: "Notification title",
      notificationText: "Notification text",
      period: 30000, // as i noted, the OS android set automatically a period to 30s. 
      exact: false, //to this work well, must be always false
      allowExecutionInForeground: false
    });

  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Daemon Beacon Detector</Text>
              <Text style={styles.sectionDescription}>
                If you close the app, a silenciously job will be running. If the job find a Beacon, a notification will be shown and you can open the app clicking on it.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
