import http.client
import json

try:
    conn = http.client.HTTPConnection("localhost", 8000)
    headers = {'Content-type': 'application/json'}
    data = {
        "email": "script_test_user@example.com", 
        "password": "password123", 
        "full_name": "Test Script User", 
        "phone": "1234567890", 
        "role": "customer"
    }
    json_data = json.dumps(data)

    print("Sending POST request to /auth/signup...")
    conn.request("POST", "/auth/signup", json_data, headers)
    response = conn.getresponse()
    
    body = response.read().decode()
    print(f"Status: {response.status}")
    print(f"Response: {body}")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
