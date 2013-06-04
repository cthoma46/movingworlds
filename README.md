# MovingWorlds

## Setup

Globally install relevant node packages:
`npm install -g coffee-script supervisor stylus`

Locally install MovingWorlds node dependencies (from package.json):
`npm install`

Copy config file to final resting place:
`sudo cp sample.movingworlds.conf /etc/movingworlds.conf`

Modify config file to fit your dev environment:
`sudo vi /etc/movingworlds.conf` 


## Development

Compile client side .styl files:
`make all`

Initialize app:
`supervisor -n error app.coffee`