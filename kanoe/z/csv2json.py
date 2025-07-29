import json
from typing import List, Dict, Any

def load_bridges_data(file_path: str) -> List[Dict[str, Any]]:
    """
    Load bridges data from a JSON file.
    
    Args:
        file_path (str): Path to the JSON file containing bridges data
        
    Returns:
        List[Dict[str, Any]]: List of bridge dictionaries
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error: The file {file_path} is not a valid JSON file.")
        return []

def display_bridges(bridges: List[Dict[str, Any]]) -> None:
    """
    Display the list of bridges in a formatted way.
    
    Args:
        bridges (List[Dict[str, Any]]): List of bridge dictionaries
    """
    if not bridges:
        print("No bridges data available.")
        return
    
    print("\n長良川の主な橋梁一覧\n" + "="*50)
    
    for bridge in bridges:
        print(f"\n{bridge['id']}. {bridge['name']}")
        print(f"   場所: {bridge['location']}")
        print(f"   河口からの距離: {bridge['distance_from_mouth']} km")
        print(f"   種類: {bridge['type']}")
        print(f"   開通年: {bridge['year_opened']}")
        if bridge.get('notes'):
            print(f"   備考: {bridge['notes']}")

def main():
    # Path to the JSON file
    json_file = 'bridges.json'
    
    # Load the data
    bridges = load_bridges_data(json_file)
    
    # Display the data
    display_bridges(bridges)
    
    # Additional information
    print("\n" + "="*50)
    print(f"合計 {len(bridges)} 件の橋梁データを表示しました。")

if __name__ == "__main__":
    main()
