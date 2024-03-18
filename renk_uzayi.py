import cv2

img=cv2.imread("01_intro_to_opencv\pythonProject/resim_okuma_gosterme_kaydetme\klon.jpg")

img_rgb=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
img_gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

cv2.imshow("Img",img)
cv2.imshow("Img RGB",img_rgb)
cv2.imshow("Img GRAY",img_gray)
cv2.waitKey(0)
cv2.destroyAllWindows()
