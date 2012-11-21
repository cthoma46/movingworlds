## MovingWorlds


### Setup
`sudo cp sample.movingworlds.conf /etc/movingworlds.conf`
`sudo vi /etc/movingworlds.conf` ( Modify to fit your dev environment. )

### Development
**Initialize app:**
`supervisor -n error app.coffee`

**Compile client side javascript.**
`coffee -wco ./public/js ./views/js`