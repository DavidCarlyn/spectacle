import torch
import torch.nn as nn
import json

from typing import TypeVar
from torchvision import models

# The weight 

def is_composite(m):
    if isinstance(m, nn.Sequential) or isinstance(m, models.resnet.BasicBlock):
        return True
    return False

class NN_Node():
    def __init__(self, name, data=None):
        self.name = name
        self.data = data
        self.children = []

    def get_children(self):
        return self.children

    def add_child(self, child):
        self.children.append(child)

    def get_json(self):
        children_json = []
        for child in self.children:
            children_json.append(child.get_json())
        data_json = {}
        if self.data is not None:
            for key, value in self.data.items():
                if value is None:
                    data_json[key] = ""
                elif isinstance(value, TypeVar) and key == "T_destination":
                    data_json[key] = ""
                elif isinstance(value, torch.Tensor):
                    data_json[key] = value.detach().numpy().tolist()
                else:
                    data_json[key] = value
        return {
            self.name : {
                "data" : data_json,
                "children" : children_json
            }
        }

    # print override
    def __str__(self):
        out = f"{self.name}\n"
        outer = self.get_children().copy()
        inner = []
        while len(outer) > 0:
            inner = outer.copy()
            outer = []
            for child in inner:
                out += f"{child.name} "
                for grandchild in child.get_children():
                    outer.append(grandchild)
            out += "\n"

        return out

def create_model_graph(module, parent):
    for name, m in module.named_children():
        if is_composite(m):
            node = NN_Node(type(m).__name__)
            create_model_graph(m, node)
            parent.add_child(node)
        else:
            attributes = {}
            for attr in dir(m):
                if not callable(getattr(m, attr)) and not attr.startswith("_"):
                    attributes[attr] = getattr(m, attr)
            node = NN_Node(type(m).__name__, attributes)
            parent.add_child(node)

if __name__ == "__main__":
    model = models.resnet18(pretrained=False)
    graph = NN_Node("root")
    print("Creating Graph")
    create_model_graph(model, graph)
    
    print("Obtaining JSON")
    data = graph.get_json()

    print("Saving")
    with open("test.json", "w") as f:
        json.dump(data, f)

    print("Done.")
