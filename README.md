# GPS auf Rädern

Placeholder for project description

## How to start

### Webserver mode:
```
ssh pi@192.168.0.1
cd ~/gps_auf_raedern
sudo python start.py --host 192.168.0.1
```
### Navigation mode
```
ssh pi@192.168.0.1
cd ~/gps_auf_raedern/gps_auf_raedern/robotic
sudo python GPS_navigation.py
```

## Dependencies

### Webserver:

cherrypy 5.6.0:
```
# install from local file
pip install vendor/wheels/CherryPy-5.6.0-py2-none-any.whl

# download and install from global pip repository
pip install cherrypy==5.6.0
```

## Project structure:

Placeholder




##########
# README #
##########

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact