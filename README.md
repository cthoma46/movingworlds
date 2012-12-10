## MovingWorlds


### Setup
`sudo cp sample.movingworlds.conf /etc/movingworlds.conf`

`sudo vi /etc/movingworlds.conf` ( Modify to fit your dev environment. )

### Development
** Compile client side JavaScript **
`make all`

** Initialize app: **
`supervisor -n error app.coffee`