import  cv2
import numpy as np

canvas = np.zeros((512, 512, 3), dtype=np.uint8) + 255

font1=cv2.FONT_HERSHEY_SIMPLEX
cv2.putText(canvas,"OpenCV",(10,450),font1,4,(0,0,0),cv2.LINE_AA)

cv2.imshow("Canvas", canvas)
cv2.waitKey(0)
cv2.destroyAllWindows()
