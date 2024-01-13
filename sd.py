from machine import Pin
import utime

#import gc
#gc.collect()

import network
from wlan import do_connect
do_connect()
import urequests
import time

firebase_url='https://iot-home-eb9ad-default-rtdb.firebaseio.com/Customer/sid.json'
auth_data={
    "email":"hellopsdofjsodfj@gmail.com",
    "password":"Querty@1234",
    "returnSecureToken":True
}
auth_response = urequests.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyAymUWsg-UwyeX7h9giwXMxfUJui6f18ag",json=auth_data)
auth_response_data=auth_response.json()
print(auth_response_data)
auth_response.close()
local_id=auth_response_data.get('localId')
print(local_id)

while 1:
    response=urequests.get(firebase_url)
    data=response.json()
    response.close()
    print(data, data["password"], data["sensorDetect"], data["unlockDoorFunc"])
    time.sleep(1)




############################firebase


Rled = Pin(22, Pin.OUT, Pin.PULL_UP)  # red led
Gled = Pin(27, Pin.OUT, Pin.PULL_UP)  # green led
buzzer = Pin(18, Pin.OUT)
pir = Pin(28, Pin.IN)
door = Pin(16, Pin.OUT)  # The pin that is connected to the Input Circuit of the Relay
keypad_rows = [9, 8, 7, 6]
keypad_columns = [5, 4, 3, 2]

# Create a map between keypad buttons and characters
matrix_keys = [['1', '2', '3', 'A'],
               ['4', '5', '6', 'B'],
               ['7', '8', '9', 'C'],
               ['*', '0', '#', 'D']]

col_pins = []
row_pins = []

# the keys entered by the user
guess = []
# our secret pin
secret_pin = ['1', '2', '3', '4', '5', '6']

for x in range(0, 4):
    row_pins.append(Pin(keypad_rows[x], Pin.OUT))
    row_pins[x].value(1)
    col_pins.append(Pin(keypad_columns[x], Pin.IN, Pin.PULL_DOWN))
    col_pins[x].value(0)


def alarm(n):
    for i in range(n):
        buzzer.value(1)
        utime.sleep(0.5)
        buzzer.value(0)
        utime.sleep(0.5)


def scankeys():
    for row in range(4):
        for col in range(4):
            row_pins[row].high()
            key = None

            if col_pins[col].value() == 1:
                print("You have pressed:", matrix_keys[row][col])
                key_press = matrix_keys[row][col]
                utime.sleep(0.3)
                guess.append(key_press)

                if len(guess) == 6:
                    checkPin(guess)
                    guess.clear()

            row_pins[row].low()


def checkPin(guess):
    if guess == secret_pin:
        print("You got the secret pin correct")
        #Gled.value(1)
        #utime.sleep(3)
        #Gled.value(0)
        #utime.sleep(1)
        #door.value(0)  # Turn the relay ON
        #utime.sleep(5)
        Gled.value(1)
        alarm(1)
        door.value(1)  # Turn the relay OFF (knob in)
        utime.sleep(2)
        door.value(0) # knob out
        Gled.value(0)

    else:
        print("Better luck next time")
        Rled.value(1)
        alarm(3)
        utime.sleep(1)
        Rled.value(0)

print("Enter the secret Pin")

while True:
    scankeys()
    utime.sleep(0.1)
    if pir.value() == 1:
        Rled.value(1)
        alarm(2)
        #print("Motion detected")
        utime.sleep(1)
        Rled.value(0)
    else:
        continue

#while True:
  #  if pir.value() == 1:
  #      print("Motion detected!")
  #      Rled.value(1)  # Blink red LED
   #     alarm(1)  # Activate buzzer
   # else:
   #     scankeys()
    #    utime.sleep(0.1)

