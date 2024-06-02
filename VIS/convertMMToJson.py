import xml.etree.ElementTree as ET
import json

def read_mm_file(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    return root

def parse_mm(root):
    nodes = []
    edges = []
    node_id_map = {}

    def traverse(node, parent_id=None):
        node_id = node.get('ID')
        node_text = node.get('TEXT')
        if node_id and node_text:
            node_entry = {"id": node_id, "label": node_text}
            nodes.append(node_entry)
            node_id_map[node_id] = node_text

        if parent_id and node_id:
            edges.append({"from": parent_id, "to": node_id})

        for child in node.findall('node'):
            traverse(child, node_id)

    root_node = root.find('.//node')
    if root_node is not None:
        traverse(root_node)

    return {"nodes": nodes, "edges": edges}

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
