# In Case Of Reign (Frontend)

Quick links:

Backend repo: https://github.com/sammyzanny/in-case-of-reign-backend

Demo: https://www.youtube.com/watch?v=s_1Rguesv4E

Live Site: https://in-case-of-reign.herokuapp.com/

__________________________________________

In Case of Reign is a single page game where you can be ruler of your own realm!  Cases are brought to you, and it's up to you to rule as you see fit on each.  Remember though, you have an approval rating you'll need to keep an eye on, otherwise your people might rise up against you!  You'll also have the ability to contribute your own cases to the game's database for anyone to use later.

### Prerequisites
The cases built in are in the seed file.  You can add more there if you wish, there is also the ability to add from within the app itself.  Make sure to follow the server side instructions to migrate the database once you clone it.

### Built With
* Vanilla JS
* Ruby
* Rails API utilizing Active Model Serializers
* PostgreSQL Database using ActiveRecord
* In-Line CSS

### Server-Side Install Instructions
1. Run ```bundle install```
2. Run ```rake db:create```
3. Run ```rake db:migrate```
4. Run ```rake db:seed```
5. Run ```rails s```
### Client-Side Install Instructions
1. Adjust the API_URL in index.js to the port used in step 5 above
2. Run ```open index.html```

### The App

To play, enter your username and choose a title.  Your "login" won't persist if you leave the page, but any cases or bundles you create with Create Mode will be saved to the database.

![Play or create screen](https://github.com/m-gizzi/in-case-of-reign-frontend/blob/master/assets/Screen%20Shot%202020-04-22%20at%2010.06.28%20PM.png?raw=true)

Here you can select cases on the left or build new ones on the right.  Either highlight individual cases by holding CTRL or CMD, or select a prebundled group by clicking a checkbox.  Then press Play.

![Gameplay screen](https://github.com/m-gizzi/in-case-of-reign-frontend/blob/master/assets/Screen%20Shot%202020-04-22%20at%2010.15.37%20PM.png?raw=true)

Your approval rating is on the top left.  Don't let it go to 0!  It will always go down, no matter what you pick.  Some choices will decrease more than others though, avoid those answers to win.

![Create new case screen](https://github.com/m-gizzi/in-case-of-reign-frontend/blob/master/assets/Screen%20Shot%202020-04-22%20at%2010.15.15%20PM.png?raw=true)

Here's what to know when building a new case.  The title and disclosure will be the text that appears when you land on the case.  Each option will be the text of a button.  Each consequence will be the alert that reads when you click the corresponding button.  The Rating Boost is the amount added to the starting approval rating if the case is chosen.  The Rating Effect is the amount subtracted from the approval if that option is selected.  Finish off by copying in the URL of an image, or selecting from the dropdown of previously used pictures.

![Create new bundle screen](https://github.com/m-gizzi/in-case-of-reign-frontend/blob/master/assets/Screen%20Shot%202020-04-22%20at%2010.15.20%20PM.png?raw=true)

Finally, creating a new bundle of cases is easy.  Just name the bundle, check the boxes of the cases you want to include, and click Bundle!

### Author

Sam Zandi, Matthew Gizzi ([@m-gizzi](https://github.com/m-gizzi))
