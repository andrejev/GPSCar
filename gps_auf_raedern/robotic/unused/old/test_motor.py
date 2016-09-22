from RPIO import PWM
import time

motor = PWM.Servo()

#motor.set_servo(7,1000)
#time.sleep(1)
while(True):
    eingabe = raw_input('Wert eingebe:')

#for i in range (600,700,20):
#    motor.set_servo(7,i)
#    time.sleep(2)

    motor.set_servo(4,int(eingabe))
    time.sleep(4)
    motor.stop_servo(4)
#motor.stop_servo(7)


