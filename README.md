# MovingWorlds

## Setup

Globally install relevant node packages:
`npm install -g coffee-script supervisor stylus`

Locally install MovingWorlds node dependencies (from package.json):
`npm install`

Copy configuration file to final resting place:
`mkdir -p /opt/movingworlds`
`sudo cp sample.movingworlds.json /opt/movingworlds/movingworlds.json`

Modify config file to fit your dev environment:
`sudo vi /opt/movingworlds/movingworlds.json` 


## Development

Compile client side .styl files:
`make all`

Initialize app:
`supervisor -n error app`