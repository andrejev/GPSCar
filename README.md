# GPS auf Rädern

Es existieren bereits Lösungen zum Projekt “GPS auf Rädern” aus vorangegangenen Semestern (https://github.com/andrejev/Motorization und https://github.com/andrejev/robotik). Diese entwickelten zwei Modellautos, welche autonom mit Hilfe von GPS-Daten und Ultraschallsensoren zu einem festgelegten Zielpunkt fahren und dabei Hindernissen ausweichen können. Ziel dieses Fortgeschrittenenpraktikums ist die Weiterentwicklung der bestehenden Lösungen, indem Komponenten kombiniert, erweitert, oder ausgetauscht werden, sodass ein robustes, schnell einsatzfähiges Fahrzeug entsteht. Die Benutzung und Kontrolle des Fahrzeugs soll trivial und selbsterklärend sein.

![alt tag](https://raw.githubusercontent.com/andrejev/GPSCar/master/doc/assets/img/finished1.jpg)

## How to start

### Webserver mode:
```
ssh pi@192.168.0.1
sudo python robotic/start.py --host 192.168.0.1
```
![alt tag](https://raw.githubusercontent.com/andrejev/GPSCar/master/doc/assets/img/web.png)

### Navigation mode (doesn't support)
```
ssh pi@192.168.0.1
cd ~/robotic/gps_auf_raedern/robotic
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
