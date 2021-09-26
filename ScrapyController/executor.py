import json
import subprocess

def json_to_cmd(name):
    result = []
    base = ['scrapy', 'crawl']
    with open(name,'r') as file:
        json_data = json.load(file)

    for crawler in json_data:
        parameters = crawler['parameters']
        parameters = [f'-a {param}={parameters[param]}' for param in parameters]
        options = crawler['options']
        options = [f'-s {opt}={options[opt]}' for opt in options]

        cmds = base + [crawler['name']] + parameters + options
        result.append(' '.join(cmds))
    return result

def executor(json_src : str):
    para = json_to_cmd(json_src)
    for cline in para:
        proc = subprocess.Popen(cline.split(), stdout=subprocess.PIPE)