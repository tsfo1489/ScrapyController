import json
import subprocess
import hashlib
from datetime import datetime

def json_to_cmd(json_data):
    base = ['scrapy', 'crawl']
    parameters = json_data['parameters']
    parameters = [f'-a {param}={parameters[param]}' for param in parameters]
    options = json_data['options']
    final_log = {}
    if 'LOG_FILE' in options:
        final_log['LOG_FILE'] = options['LOG_FILE']
        options.pop('LOG_FILE') # Delete Log File option
    if 'LOG_LEVEL' in options:
        final_log['LOG_LEVEL'] = options['LOG_LEVEL']
        options.pop('LOG_LEVEL') # Delete Log Level option
    options = [f'-s {opt}={options[opt]}' for opt in options]

    cmds = base + [json_data['name']] + parameters + options
    cmd = ' '.join(cmds)
    temp_hash = hashlib.md5(cmd.encode())
    temp_hash.update(str(datetime.now().timestamp()).encode())
    temp_log = temp_hash.hexdigest()
    cmd += f' -s LOG_FILE={temp_log}.log'
    final_log['TEMP_LOG'] = temp_log + '.log'
    return cmd, final_log

def executor(json_data: dict):
    cmd, log_setting = json_to_cmd(json_data)
    proc = subprocess.Popen(cmd.split())
    return proc, log_setting

if __name__ == '__main__':
    executor(json.loads(open('test.json', 'r').read()))