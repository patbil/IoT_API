IP="192.168.1.78"
TARGET_PATH="pwm-driver/"

scp -r src test pi@$IP:$TARGET_PATH
