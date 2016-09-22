from debug_log import debug_print

lg = debug_print()
from sensors import GPSCarSensors
import time

mod = int(raw_input("Modus? 0, 1 oder 2? "))

sens = GPSCarSensors(mode=mod, start=False)

raw_input("Press enter to start")
sens.start()

time.sleep(1)

while True:
    out = "%s: %s, %s, %s\n" % (str(sens.running), sens.measurements[0][0],
                                sens.measurements[1], sens.measurements[2][0])
    # f = open("test.txt", "w")
    print out
    # f.write(out)
    # f.close()
    time.sleep(.1)
