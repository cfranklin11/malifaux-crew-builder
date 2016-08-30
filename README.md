# Malifaux Crew Builder

## Setup

* Run ```$npm install``` to install the packages.
* Run ```$bower install``` to install the bootstrap library.
* Run ```$gulp``` to compile the app & server code.

## Known Issues

* Gulp takes a very long time to compile the server-side code (generally > 3 minutes). I'm new to code compilers in general, and Gulp in particular, so I'm figuring out how to improve performance.
* Since this is an app for improving my knowledge of React/Redux, the database for the character and upgrade info is just a Google Sheet, which means that the app takes awhile to fetch data. Also, although, all factions are represented, not all available characters and upgrades are available (it took me long enough to enter the partial data that's there).
