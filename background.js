import { incrementGlassCount } from "./storage.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  // createReminderNotif(); // a virer, to test
});

// fonction pour ajouter un verre et gérer les notifs
function addGlass() {
  incrementGlassCount((nouveauCompte) => {
    console.log(`Nouveau compteur : ${nouveauCompte}`);
    if (nouveauCompte === 8) {
      createGoalReachedNotif();
    } else {
      createDrankOneNotif();
    }
  });
}

// function addGlass() {
//   createDrankOneNotif();
//   // increment glass counter
//   // check if goal is reached
//   // if not
//   // reset timer
//   // if reached {
//   if (nouveauCompte > 8) {
//     createGoalReachedNotif(); // ask if : keep notifications on every hour, OR stay silent (but keep the possibility to add a glass by clicking the pop up)
//     // }
//     // save the updated number of glasses in local storage ??
//   }
// }

// function to create the notif for congratulating on drinking a new glass
function createDrankOneNotif() {
  chrome.notifications.create("drank-one", {
    type: "basic",
    // iconUrl: 'Ressources/icons/',
    title: "Drank one",
    message: "Yay, good job ! One more glass !",
    contextMessage:
      "I'll remind you your next glass in an hour, see you soon !",
  });
}

// function to create the notif for achieving goal
function createGoalReachedNotif() {
  chrome.notifications.create("goal-reached", {
    type: "basic",
    // iconUrl: 'Ressources/icons/',
    title: "Goal Reached !",
    message: "Congrats ! You reached you goal for today !",
    contextMessage: "What can I do for you now ?",
    buttons: [
      {
        title: "Keep sending me reminders for more hydratation !",
        iconUrl: "Notifications/Ressources/icons/",
      },
      {
        title: "No more reminders for today :)",
        iconUrl: "Notifications/Ressources/icons/",
      },
    ],
  });
}

// notif for when the "remind me in 10" is clicked
function createBeBackNotif() {
  chrome.notifications.create("will-be-back", {
    type: "basic",
    // iconUrl: 'Ressources/icons/',
    title: "I'll be back !",
    message: "Roger that, I'll remind you to drink in 10 minutes. See you !",
  });
}

// notif time to drink
function createReminderNotif() {
  chrome.notifications.create("drinking-reminder", {
    type: "basic",
    iconUrl: "Notifications/Ressources/icons/notif.png",
    title: "Time to drink water !",
    message: "It's time to drink your next glass !\nWhat do you want to do ?",
    buttons: [
      {
        title: "Remind me in 10 !",
        iconUrl: "Notifications/Ressources/icons/time-forward-10.png",
      },
      {
        title: "Drinking now !",
        iconUrl: "Notifications/Ressources/icons/water-glass.png",
      },
    ],
  });
}

// function to handle the remind in 10 case (notif, timeout, and remind)
function remindInTen() {
  createBeBackNotif();
  setTimeout(() => createReminderNotif(), 10000); // 10 seconds for testing
}

// button handler
chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    console.log(
      `Button clicked in notification ${notificationId} with index ${buttonIndex}`
    );

    if (notificationId === "drinking-reminder") {
      if (buttonIndex === 0) {
        console.log('User clicked "Remind me in 10!"');
        chrome.notifications.clear("drinking-reminder", remindInTen());
      } else if (buttonIndex === 1) {
        console.log('User clicked "Drinking now!"');
        chrome.notifications.clear("drinking-reminder", addGlass());
      }
    }
  }
);

/* NOTES

possible to add a callback function after clearing notif to automatically relaunch the timer, add a glass, show another notif

- how much time do the notifs stay ? how to adjust that ?
- handle click on notif / closing notif without clicking the buttons
- 

*/

//fonction qui lance un timer
let timerId = setInterval(() => createReminderNotif(), 10000);
