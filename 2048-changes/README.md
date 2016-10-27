# 2048 Changes by wglove01 for COMP20

## Correctly Implemented

All aspects of this application have been correctly implemented. The two major changes are including jquery in index.html on line 87 and writing the transmitScore function at the pottom of game_manager.js, which takes as an argument score and cells. transmitScore() is called on line 102 within a setTimeout(). The purpose of this is to allow the game to fade in the "Game Over!" message before the prompt is displayed asking for the user to save their score. This is a better UX than the opposite occuring.

In addition, transmitScore() makes use of localStorage to store the username previously entered by the user to autofill it in the prompt, requiring the user to not have to type the same username every time if they so desire.

## Approximate time

~4 hours

## Acknowledgements

NULL