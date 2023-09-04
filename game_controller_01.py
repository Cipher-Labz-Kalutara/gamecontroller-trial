
import sys
import pygame
from pygame.locals import *

pygame.init()
pygame.joystick.init()

def add_remove_controllers():
    jss = [pygame.joystick.Joystick(x) for x in range(pygame.joystick.get_count())]
    for js in jss:
        print(js.get_name())

    return jss

joysticks = add_remove_controllers()

while True:
    for event in pygame.event.get():
        # print(event)

        if event.type == JOYBUTTONDOWN:
            # print(event)
            if event.button == 0:
                print("PRESSED A:", event.button)
            if event.button == 1:
                print("PRESSED B:", event.button)
            if event.button == 2:
                print("PRESSED X:", event.button)
            if event.button == 3:
                print("PRESSED Y:", event.button)
        
        if event.type == JOYHATMOTION:
            print(event)
            
        if event.type == JOYAXISMOTION:
            # print(event)
            if event.axis in (0,1):
                print("JOY AXIS :", event.axis, event.value)
        
        if event.type == JOYBUTTONUP:
            print(event)
        
        # general joystick events
        if event.type == JOYDEVICEADDED:
            joysticks = add_remove_controllers()

        if event.type == JOYDEVICEREMOVED:
            joysticks = add_remove_controllers()
            if joysticks.get_count() == 0:
                pygame.quit()
                sys.exit()

        if event.type == QUIT:
            pygame.quit()
            sys.exit()

        if event.type == KEYDOWN:
            if event.key == K_ESCAPE:
                pygame.quit()
                sys.exit()