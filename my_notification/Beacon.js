import React from 'react';
import {
  DeviceEventEmitter,
  PermissionsAndroid,
  AppState
} from 'react-native';
import Beacons from 'react-native-beacons-manager';

import invokeApp from 'react-native-invoke-app';

import { Notifications } from 'react-native-notifications';

Notifications.events().registerNotificationOpened((notification, completion) => {
  // open the app
  invokeApp();

  completion();
});

function GetPermissions() {
  try {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Local permission needed',
        message:
          'You must allow local permission enabled'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('Location Permitted');
    } else {
      // console.log('Location permission denied');
    }
  } catch (err) {
    // console.log(err);
  }
}

function searchBeacons() {
  try {
    Beacons.startRangingBeaconsInRegion('');
    // console.log(`Beacons ranging started succesfully!`);
  } catch (err) {
    // console.log(`Beacons ranging not started, error: ${error}`);
  }
}

var dataInit = undefined
var periodoRangingCt = 0;

const periodoRangingConst = 15; // search beacons for a interval by 15s, after that wait new call by the job

const tempoOutraNotificacao = 35000; // after a notification being show, set the interval to the next

function getBeaconsInit(callback) {
  if (dataInit != undefined && (new Date() - dataInit) < tempoOutraNotificacao) {
    return;
  }

  Beacons.detectIBeacons();
  GetPermissions();
  searchBeacons();

  // Print a log of the detected iBeacons (1 per second)
  const emit = DeviceEventEmitter.addListener('beaconsDidRange', data => {
    console.log(AppState.currentState)
    if (data.beacons.length != 0) {
      console.log("diferente de zero")

      // if the app isn't in foreground (active), verify new beacons
      if (AppState.currentState !== 'active') {
        // verify the interval of notifications
        if (dataInit == undefined) {
          dataInit = new Date();

          Notifications.removeAllDeliveredNotifications()

          Beacons.stopRangingBeaconsInRegion('');

          Notifications.registerRemoteNotifications();
          Notifications.postLocalNotification({
            title: "Beacon found!!!",
            body: "Click here to open the app.",
            //extra: "data",
          }, 1);
        } else {
          Beacons.stopRangingBeaconsInRegion('');
          if ((new Date() - dataInit) > tempoOutraNotificacao) {
            dataInit = undefined
          }
        }
      }
    } else {
      periodoRangingCt++;
      // search beacons by a interval, stop when its over
      if (periodoRangingCt >= periodoRangingConst) {
        Beacons.stopRangingBeaconsInRegion('');
        periodoRangingCt = 0;
      }
    }
  });

  return emit;
}

function exitSearchBeacons(emit) {
  return emit.remove();
}

export { getBeaconsInit, exitSearchBeacons, GetPermissions };
