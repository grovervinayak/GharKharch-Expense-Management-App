import notifee, {AndroidImportance} from "@notifee/react-native";

export function testNotification(remoteMessage) {
	notifee.displayNotification({
  		title: 'Small Icon',
  		body: 'A notification using the small icon!.',
  		android: {
    		// Reference the name created
    		channelId:'important',
    		largeIcon: 'ic_launcher',
    		smallIcon:'ic_launcher',
    		importance: AndroidImportance.HIGH,
    	// Optional (Defaults to white)
  		},
	});
}