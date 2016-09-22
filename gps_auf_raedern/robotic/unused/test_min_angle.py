import time
from robotic.debug_log import debug_print
lg = debug_print()
import robotic.sensors
sens = robotic.sensors.GPSCarSensors(sensors_min=0, mode=0, start=True)

sens.move_servo(sens.servo_MIN)
time.sleep(1)

try:
	while True:
		print sens.measurements
		print
		time.sleep(0.1)

except:
	sens.move_servo(sens.servo_MAX)
	time.sleep(1)
	try:
		while True:
			print sens.measurements
			print
			time.sleep(0.1)
	except:
		sens.running = False
