import base64
import json
import sys
import os

def base64_to_json(base64_string):
    try:
        decoded_bytes = base64.b64decode(base64_string)
        
        json_data = json.loads(decoded_bytes.decode('utf-8'))
        
        os.makedirs('output', exist_ok=True)
        
        output_path = os.path.join('output', 'decoded_output.json')
        with open(output_path, 'w') as f:
            json.dump(json_data, f, indent=4)
        
        print(f"JSON file created successfully: {output_path}")
        return json_data
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python base64_to_json.py <base64_string>", file=sys.stderr)
        sys.exit(1)
    
    base64_input = sys.argv[1]
    base64_to_json(base64_input)