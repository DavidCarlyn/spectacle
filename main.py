import torch
import torch.nn as nn
from torchvision import models

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

    # print override
    def __str__(self):
        out = f"0: {self.name} \n"
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
            node = NN_Node(type(m).__name__, None)
            create_model_graph(m, node)
            parent.add_child(node)
        else:
            node = NN_Node(type(m).__name__, m)
            parent.add_child(node)

if __name__ == "__main__":
    model = models.resnet18(pretrained=False)
    graph = NN_Node("root")
    create_model_graph(model, graph)
    print(graph)
