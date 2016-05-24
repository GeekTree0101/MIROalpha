"""
PlatformIO web remote Interface
Copyright(C) 2016 Ha Hyeon soo
"""

import subprocess as com
import sys as node



def appInterface(target, port):
 	#upload target = uno / mega , port = ex. /dev/ttyACM0
        com.call(["platformio","run","-e",target,"-t","upload","--upload-port",port])

        print("done")   

if __name__== "__main__":
	print("==============================")
	print("      MIRO PIO Interface      ")
	print("=============================\n")
	appInterface(node.argv[1],node.argv[2])
