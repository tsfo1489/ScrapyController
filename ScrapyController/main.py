import json
import os
import zipfile
from flask import Flask, request
from werkzeug.utils import secure_filename
from executor import executor
from log import LogWatcher
from zipfile import ZipFile

CRAWLER_FILE_PATH = ''
TASK_FILE_PATH = ''
app = Flask('SCC')
pid_file = '.pid'
config_file = open('.SCCconfig', 'r')
for x in config_file.read().split('\n'):
    exec(x)
crawlers = json.loads(open(CRAWLER_FILE_PATH, 'r').read())
tasks = json.loads(open(TASK_FILE_PATH, 'r').read())
logs = {}
for task_name in tasks:
    if tasks[task_name]['status'] == 'run':
        logs[task_name] = LogWatcher(tasks[task_name]['temp_log'])
    elif tasks[task_name]['status'] == 'fin':
        logs[task_name] = LogWatcher(tasks[task_name]['log'])

@app.route('/crawlers', methods=['GET'])
def get_crawlers():
    return json.dumps(crawlers), 200

@app.route('/crawlers/<crawler_name>', methods=['POST'])
def add_crawlers(crawler_name):
    print(crawler_name)
    new_crawler = request.get_json()
    if crawler_name in crawlers:
        return json.dumps({'message': 'ERROR: Duplicate Crawler Name'}),201
    else:
        crawlers[crawler_name] = new_crawler
        f = request.files['crawler']
        fn = secure_filename(f.filename)
        f.save(fn)
        myzip = zipfile.ZipFile(fn,'w')
        myzip.extract(fn,'./')
        f.close()
        myzip.close()
        return json.dumps({'message': 'Success'}),200
    '''
        f = open(CRAWLER_FILE_PATH, 'w')
        f.write(json.dumps(crawlers))
    '''

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return json.dumps(tasks), 200

def valid_task(task):
    fields = ['name', 'crawler', 'log', 'parameters', 'options']
    msg = 'success'
    for field in fields:
        if field not in task:
            msg = f'Task needs {field}'
            return False, msg
    if task['crawler'] not in crawlers:
        msg = f'Crawler({task["crawler"]}) does not exits'
        return False, msg
    return True, msg

@app.route('/tasks/<task_name>', methods=['POST'])
def add_tasks(task_name):
    new_task = request.get_json()
    if task_name in tasks:
        return json.dumps({'message': 'ERROR: Duplicate Task Name'}), 400
    else:
        valid, msg = valid_task(new_task)
        if valid:
            crawlers[task_name] = new_task
            f = open(TASK_FILE_PATH, 'w')
            f.write(json.dumps(crawlers))
            f.close()
            return json.dumps({'message': 'Success'}), 201
        else:
            return json.dumps({'message': msg}), 400

@app.route('/run/<task_name>', methods=['POST'])
def run_tasks(task_name):
    if task_name not in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    if tasks[task_name] == 'run':
        return json.dumps({'message': f'Task({task_name}) already run'}), 400
    task = tasks[task_name]
    run_data = {}
    run_data.update(crawlers[task['crawler']])
    run_data['parameters'] = task['parameters']
    run_data['options'] = task['options']
    run_data['options']['LOG_FILE'] = task['log']
    pid, log_setting = executor(run_data)
    tasks[task_name]['temp_log'] = log_setting['TEMP_LOG']
    logs[task_name] = LogWatcher(log_setting['TEMP_LOG'])
    f = open(TASK_FILE_PATH, 'w')
    f.write(json.dumps(tasks))
    f.close()
    return json.dumps({'message': 'Task started'}), 200

@app.route('/stats/<task_name>', methods=['GET'])
def get_stats(task_name):
    if not task_name in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    if task_name not in logs:
        logs[task_name] = LogWatcher(tasks[task_name]['log'])
    task_stats = logs[task_name].get_stat()
    return json.dumps(task_stats.todict()), 200

def main():
    app.run('0.0.0.0', debug=True)

if __name__ == '__main__':
    main()