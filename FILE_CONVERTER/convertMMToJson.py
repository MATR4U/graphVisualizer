# Explanation
# read_mm_file: This function reads the .mm file and returns the root element.
# parse_mm: This function recursively traverses the XML tree and constructs a nested dictionary suitable for D3.js hierarchical data visualization.
# traverse: This inner function does the actual recursive traversal. For each node, it extracts the ID and TEXT attributes and processes its children. It constructs a dictionary with id, name, and children.
# save_as_json: This function saves the constructed data to a JSON file.
# main: This function orchestrates the reading, parsing, and saving processes.

import xml.etree.ElementTree as ET
import json


def read_mm_file(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    return root


def parse_mm(node):
    def traverse(node):
        node_id = node.get('ID')
        node_text = node.get('TEXT')
        children = [traverse(child) for child in node.findall('node')]
        return {
            "id": node_id,
            "name": node_text,
            "children": children if children else None
        }

    root_node = node.find('.//node')
    if root_node is not None:
        return traverse(root_node)
    return {}


def save_as_json(data, file_path):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)


def main(file_path, output_path):
    root = read_mm_file(file_path)
    data = parse_mm(root)
    save_as_json(data, output_path)


if __name__ == "__main__":
    file_path = 'b2b.mm'  # Replace with your file path
    output_path = 'graph_data.json'  # Output JSON file
    main(file_path, output_path)
