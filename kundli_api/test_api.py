import requests
import time

print("Waiting for server...")
# Simple retry loop
for i in range(5):
    try:
        res = requests.get("http://127.0.0.1:8000/")
        if res.status_code == 200:
            print("Server is UP!")
            break
    except:
        time.sleep(1)
        print(f"Retrying... {i}")

print("Testing generate-d1 endpoint...")
try:
    res = requests.post("http://127.0.0.1:8000/generate-d1", json={
      "date": "2000-01-01",
      "time": "12:00",
      "latitude": 19.07,
      "longitude": 72.87,
      "timezone": 5.5
    })
    print("Response:", res.json())
except Exception as e:
    print("Test failed:", e)
