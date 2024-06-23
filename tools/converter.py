import xml.etree.ElementTree as ET
import json


def read_mm_file(file_path):
    """
    Read the .mm file and return the root element.

    :param file_path: The path to the .mm file.
    :return: The root element of the XML tree.
    """
    tree = ET.parse(file_path)
    return tree.getroot()


def parse_mm(node):
    """
    Parse the XML tree and construct a nested dictionary suitable for D3.js hierarchical data visualization.

    :param node: The root node of the XML tree.
    :return: The parsed data as a nested dictionary.
    """

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
    return traverse(root_node) if root_node is not None else {}


def save_as_json(data, file_path):
    """
    Save the constructed data to a JSON file.

    :param data: The data to save.
    :param file_path: The path to the output JSON file.
    """
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)


def main(file_path, output_path):
    """
    Orchestrate the reading, parsing, and saving processes.

    :param file_path: The path to the .mm file.
    :param output_path: The path to the output JSON file.
    """
    root = read_mm_file(file_path)
    data = parse_mm(root)
    save_as_json(data, output_path)


if __name__ == "__main__":
    file_path = 'b2b.mm'  # Replace with your file path
    output_path = 'graph_data.json'  # Output JSON file
    main(file_path, output_path)