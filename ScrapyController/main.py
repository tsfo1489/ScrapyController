import os, json
import shutil
from zipfile import ZipFile
from werkzeug.utils import secure_filename
from flask import Flask, request
from executor import executor
from log import LogWatcher

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

def write_tasks():
    f = open(TASK_FILE_PATH, 'w')
    f.write(json.dumps(tasks, indent=2))
    f.close()

@app.route('/crawlers', methods=['GET'])
def get_crawlers():
    return json.dumps(crawlers), 200

@app.route('/crawlers/<crawler_name>', methods=['POST'])
def add_crawlers(crawler_name):
    new_crawler = request.form
    if crawler_name in crawlers:
        return json.dumps({'message': 'ERROR: Duplicate Crawler Name'}), 201
    else:
        project_zip = request.files['file']
        filename = secure_filename(project_zip.filename)
        print(filename)
        project_zip.save('./' + filename)
        with ZipFile('./' + filename, 'r') as zf:
            os.mkdir('./' + filename[:filename.rfind('.zip')])
            zf.extractall('./' + filename[:filename.rfind('.zip')])
        os.remove(filename)
        crawlers[crawler_name] = new_crawler
        #f = open(CRAWLER_FILE_PATH, 'w')
        #f.write(json.dumps(crawlers))
        #f.close()
        return json.dumps({'message': 'Success'}), 200

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
        msg = f'Crawler({task["crawler"]}) does not exist'
        return False, msg
    if task['spider'] not in crawlers[task['crawler']]:
        return False, f'Spider({task["spider"]}) does not exist in Crawler({task["crawler"]})'
    for param in task['parameters']:
        if param not in crawlers[task['crawler']]['spiders']['parameters']:
            return False, f'Spider({task["spider"]}) does not have parameter({param})'
    return True, msg

@app.route('/tasks/<task_name>', methods=['POST'])
def add_tasks(task_name):
    new_task = request.get_json()
    if task_name in tasks:
        return json.dumps({'message': 'ERROR: Duplicate Task Name'}), 400
    else:
        valid, msg = valid_task(new_task)
        if valid:
            new_task['temp_log'] = ''
            tasks[task_name] = new_task
            write_tasks()
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
    run_data['path'] = crawlers[task['crawler']]['path']
    run_data['spider'] = task['spider']
    run_data['parameters'] = task['parameters']
    run_data['options'] = task['options']
    run_data['options']['LOG_FILE'] = task['log']
    pid, log_setting = executor(run_data)
    tasks[task_name]['temp_log'] = log_setting['TEMP_LOG']
    tasks[task_name]['status'] = 'run'
    logs[task_name] = LogWatcher(log_setting['TEMP_LOG'])
    write_tasks()
    return json.dumps({'message': 'Task started'}), 200

@app.route('/stats/<task_name>', methods=['GET'])
def get_stats(task_name):
    if not task_name in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    if tasks[task_name]['status'] == 'ready':
        return json.dumps({'message': f'Task({task_name}) not started'}), 400
    if task_name not in logs:
        if tasks[task_name]['status'] == 'run':
            logs[task_name] = LogWatcher(tasks[task_name]['temp_log'])
        else:
            logs[task_name] = LogWatcher(tasks[task_name]['log'])
    task_stats = logs[task_name].get_stat()
    if tasks[task_name]['status'] == 'run' and task_stats.status == 'finish':
        tasks[task_name]['status'] = 'finish'
        write_tasks()
        del logs[task_name]
        shutil.copy('./log/' + tasks[task_name]['temp_log'], './log/' + tasks[task_name]['log'])
        os.remove('./log/' + tasks[task_name]['temp_log'])
        logs[task_name] = LogWatcher(tasks[task_name]['log'])
        task_stats = logs[task_name].get_stat()
    return json.dumps(task_stats.todict(), indent=2), 200

@app.route('/refresh', methods=['POST'])
def refresh_all():
    for task_name in logs:
        temp_stat = logs[task_name].get_stat()
        if tasks[task_name]['status'] == 'run' and temp_stat.status == 'finish':
            tasks[task_name]['status'] = 'finish'
            write_tasks()
            del logs[task_name]
            shutil.copy('./log/' + tasks[task_name]['temp_log'], './log/' + tasks[task_name]['log'])
            os.remove('./log/' + tasks[task_name]['temp_log'])
            logs[task_name] = LogWatcher(tasks[task_name]['log'])

def main():
    app.run('0.0.0.0', debug=True)

if __name__ == '__main__':
    main()