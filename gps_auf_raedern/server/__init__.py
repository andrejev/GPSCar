# -*- coding: utf-8 -*-
import atexit
import logging
import os
import random
from random import randint

# external libs
import cherrypy
import math

is_local = False
try:
    from gps_auf_raedern.robotic.GPS_navigation import GPSCar, GPSCarStatus
    from RPIO import PWM
    import RPi.GPIO as GPIO
except:
    is_local = True


class Root(object):
    def __init__(self):
        if not is_local:
            self.car = GPSCar(run_navigate=False)
            self.status = GPSCarStatus(self.car)

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def GPS(self):
        # GPS_data = [gpsd.fix.latitude, gpsd.fix.longitude, gpsd.fix.altitude, gpsd.fix.track, gpsd.fix.satellites, fix_time]
        if is_local:
            return {"GPS":
                {
                    "latitude": 49.41739 + random.uniform(-0.002, 0.002),
                    "longitude": 8.67549 + random.uniform(-0.002, 0.002),
                    "altitude": randint(0, 100),
                    "track": randint(0, 100),
                    "satellites": randint(0, 100),
                    "fix_time": randint(0, 100)
                }
            }
        else:
            if self.status.gps_data and not math.isnan(self.status.gps_data[1]):
                return {"GPS": {
                    "latitude": self.status.gps_data[0],
                    "longitude": self.status.gps_data[1],
                    "altitude": self.status.gps_data[2],
                    "track": self.status.gps_data[3],
                    "satellites": len(self.status.gps_data[4]),
                    "fix_time": self.status.gps_data[5]
                }}
            else:
                return {"GPS": {
                    "latitude": 49.41722,
                    "longitude": 8.67556,
                    "altitude": 0,
                    "track": 0,
                    "satellites": 0,
                    "fix_time": 0
                }}

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def Status(self):
        # current_status = [direction, velocity, steer_position] + button
        if is_local:
            return {"Status":
                {
                    "direction": 0,
                    "velocity": 0,
                    "steer_position": 0
                }
            }
        elif self.status.current_status:
            return {"Status":
                {
                    "direction": self.status.current_status[0],
                    "velocity": self.status.current_status[1],
                    "steer_position": self.status.current_status[2]
                }
            }

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def ToggleCar(self):
        if not is_local:
            self.car.run_navigate = not self.car.run_navigate
            return {"Navigate": self.car.run_navigate}
        else:
            return {"Navigate": False}

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def Sensors(self):
        if not is_local and self.status.sensors:
            return {"Sensors":  # -1: error, 0: Free, 1: possible obstacle, 2: Obstacle
                {
                    "s1": self.status.sensors[0],
                    "s2": self.status.sensors[1],
                    "s3": self.status.sensors[2]
                }
            }
        else:
            return {"Sensors":
                {
                    "s1": -1,
                    "s2": -1,
                    "s3": -1
                }
            }

    @cherrypy.expose  # We can only be here as long as the car is not moving
    def SetDestination(self, lon, lat):
        if not is_local:
            self.car.GPS_destination[0] = float(lat)
            self.car.GPS_destination[1] = float(lon)

    @cherrypy.expose  # We can only be here as long as the car is not moving
    def SetSensorMode(self, mode):
        self.car.sensors.set_mode(int(mode))


def error_handler():
    """Instead of showing something useful to developers but
    disturbing to clients we will show a blank page.

    """
    cherrypy.response.status = 500
    cherrypy.response.body = ["<html><body>Sorry, an error occured</body></html>"]


def error_page(*args, **kwargs):
    """Instead of showing something useful to developers but
    disturbing to clients we will show a blank page.

    """
    return "<html><body>Page not found</body></html>"


def run(args):
    host = args.host
    port = args.port

    conf = {
        "/": {
            "tools.staticdir.on": True,
            "tools.staticdir.root": os.path.dirname(__file__),
            "tools.staticdir.dir": "static",
            "tools.staticdir.index": "index.html",
            "tools.proxy.on": True,
            "tools.sessions.on": True,
            "tools.sessions.timeout": 60,
            "tools.expires.on": True,
            "tools.expires.secs": 30,
            "tools.expires.force": False,
            "tools.gzip.on": True,
            "request.show_tracebacks": True,
            "response.headers.server": "Robotic/1.0",
            "request.error_response": error_handler,
            "error_page.default": error_page,
        },
        "/doc": {
            "tools.staticdir.dir": "../../doc"
        },
        "/favicon.ico": {
            "tools.staticfile.on": True,
            "tools.staticfile.filename": os.path.join(os.path.dirname(__file__),
                                                      "static",
                                                      "img/favicon.ico")
        }
    }

    cherrypy.server._socket_host = host
    cherrypy.server.socket_port = port

    cherrypy.log.access_log.setLevel(logging.CRITICAL)
    cherrypy.log.error_log.setLevel(logging.CRITICAL)

    root = Root()

    cherrypy.quickstart(root, "/", config=conf)
