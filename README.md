# MovingWorlds

## Setup
```bash
# 1. Globally install relevant node packages:
npm install -g coffee-script supervisor stylus

# 2. Locally install MovingWorlds node dependencies (from package.json):
npm install

# 3. Copy configuration file to final resting place:
# a. Create the directory, and anything in between
sudo mkdir -p /opt/movingworlds
# b. Change permissions so you own the folder, instead of the system
sudo chwon -R $USER /opt/movingworlds
# c. Copy the sample file to the expected folder
sudo cp sample.movingworlds.json /opt/movingworlds/movingworlds.json

# 4. Modify config file to fit your dev environment:
sudo vi /opt/movingworlds/movingworlds.json
```

## Development
```bash
# 1. Compile client side .styl files:
make all

# 1.5. Alternately, have Stylus watch .styl files and compile on change:
stylus --compress views/style/main.styl --out ./public/style -w

# 2. Launch that server!!
supervisor -n error app
```