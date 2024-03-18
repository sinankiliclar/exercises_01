import  cv2
import numpy as np

canvas = np.zeros((512, 512, 3), dtype=np.uint8) + 255

cv2.line(canvas,(50,50),(512,512),(255,255,0),thickness=5)
cv2.line(canvas,(40,40),(300,200),(255,0,255),thickness=3)
cv2.line(canvas,(100,100),(200,412),(0,255,255),thickness=1)

cv2.rectangle(canvas, (10,10),(300,300),(255,0,0),thickness=2)

cv2.circle(canvas,(120,120),100,(0,0,255),thickness=-3)

p1=(100,150)
p2=(200,250)
p3=(300,450)

cv2.line(canvas,p1,p2,(100,255,200),3)
cv2.line(canvas,p1,p3,(100,255,200),3)
cv2.line(canvas,p3,p2,(100,255,200),3)

points=np.array([[300,100],[400,100],[500,350],[400,350]],np.int32)
cv2.polylines(canvas,[points],True,(0,0,255),3)

cv2.imshow("Canvas", canvas)
cv2.waitKey(0)
cv2.destroyAllWindows()
