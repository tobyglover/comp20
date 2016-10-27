# 2048 Changes by wglove01 for COMP20

## Correctly Implemented

All aspects of this application have been correctly implemented. The two major changes are including jquery in index.html on line 87 and writing the transmitScore function, which takes as an argument the game state from the StorageManager right before the game ended. transmitScore() is called within move() on line 193.

In addition, transmit score makes use of localStorage to store the username previously entered by the user to autofill it in the prompt, requiring the user to not have to type the same username every time if they so desire.

## Approximate time

~4 hours

## Acknowledgements

NULL